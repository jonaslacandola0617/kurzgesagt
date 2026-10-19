"""Synthetic gate fixtures; no fabricated owner decision is used for real production."""
import copy
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

ENGINE=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('pre_render',ENGINE/'pre_render.py')
pre=importlib.util.module_from_spec(spec);spec.loader.exec_module(pre)

class GateTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.root=Path(self.tmp.name);self.episode=self.root/'episode';self.episode.mkdir()
        self.project=self.root/'project';self.project.mkdir()
        self.path=self.root/'package.json'
        (self.episode/'episode.json').write_text(json.dumps({'id':'synthetic','pre_render_manifest':'../package.json'}))
        self.inputs=[]
        for role in sorted(pre.REQUIRED_ROLES):
            p=self.root/(role+'.txt');p.write_text('SYNTHETIC TEST ONLY: '+role)
            self.inputs.append({'path':p.name,'role':role,'sha256':pre.digest(p),'rights_status':'cleared',
                'archive':{'kind':'github-release','url':'the source repository'+p.name,
                           'verified_at':'synthetic fixture, not a real receipt','size':p.stat().st_size,'sha256':pre.digest(p)}})
        settings={'width':2160,'height':3840,'fps':30,'visual_style':'image-led','material_profile':'image-led-v1','brand_ending':'brand-ending-v1'}
        fp=pre.fingerprint(self.inputs,settings)
        self.m={'schema':1,'episode_id':'synthetic','status':'RENDER_READY','inputs':self.inputs,'settings':settings,
            'frozen_fingerprint':fp,'unresolved_findings':[],
            'gates':{name:{'status':'approved','date':'synthetic','reviewer':'owner','evidence_path':'story.txt','fingerprint':fp} for name in pre.GATES}}
    def check(self, closure=None):
        self.path.write_text(json.dumps(self.m))
        with patch.object(pre,'engine_inputs',return_value=closure or set()):
            return pre.validate_package(self.path,self.episode,self.project)
    def test_complete_synthetic_records_pass(self): self.assertTrue(self.check()['ready'])
    def test_1080p_frozen_package_passes_with_fresh_bindings(self):
        self.m['settings'].update(width=1080,height=1920)
        fp=pre.fingerprint(self.inputs,self.m['settings'])
        self.m['frozen_fingerprint']=fp
        for gate in self.m['gates'].values():gate['fingerprint']=fp
        self.assertTrue(self.check()['ready'])
    def test_resolution_change_cannot_reuse_old_approvals(self):
        self.m['settings'].update(width=1080,height=1920)
        self.assertFalse(self.check()['ready'])
    def test_720p_is_review_only_not_production_ready(self):
        self.m['settings'].update(width=720,height=1280)
        fp=pre.fingerprint(self.inputs,self.m['settings'])
        self.m['frozen_fingerprint']=fp
        for gate in self.m['gates'].values():gate['fingerprint']=fp
        self.assertFalse(self.check()['ready'])
    def test_draft_does_not_pass(self):
        self.m['status']='STORY_SEQUENCE_DRAFT';self.assertFalse(self.check()['ready'])
    def test_changed_bytes_block(self):
        (self.root/'mix.txt').write_text('CHANGED');self.assertFalse(self.check()['ready'])
    def test_missing_bytes_block(self):
        (self.root/'voice.txt').unlink();self.assertFalse(self.check()['ready'])
    def test_missing_receipt_blocks(self):
        del self.m['inputs'][0]['archive'];self.assertFalse(self.check()['ready'])
    def test_stale_approval_blocks(self):
        self.m['gates']['owner_art_sequence']['fingerprint']='old';self.assertFalse(self.check()['ready'])
    def test_ai_cannot_supply_owner_record(self):
        self.m['gates']['owner_motion']['reviewer']='assistant';self.assertFalse(self.check()['ready'])
    def test_unlisted_dependency_blocks(self):
        self.assertFalse(self.check({self.root/'unlisted.js'})['ready'])
    def test_asset_rights_block(self):
        next(i for i in self.m['inputs'] if i['role']=='asset')['rights_status']='unknown';self.assertFalse(self.check()['ready'])
    def test_settings_invalidate_fingerprint(self):
        self.m['settings']['fps']=60;self.assertFalse(self.check()['ready'])
    def test_unbound_episode_blocks(self):
        (self.episode/'episode.json').write_text(json.dumps({'id':'synthetic'}));self.assertFalse(self.check()['ready'])
    def test_uncommitted_git_bytes_block(self):
        self.m['inputs'][0]['archive']={'kind':'git'};self.assertFalse(self.check()['ready'])
    def test_pinned_git_bytes_pass_then_detect_drift(self):
        subprocess.run(['git','init','-q',str(self.root)],check=True)
        subprocess.run(['git','-C',str(self.root),'add','.'],check=True)
        subprocess.run(['git','-C',str(self.root),'-c','user.name=Synthetic Test',
                        '-c','user.email=fixture@example.invalid','commit','-qm','fixture'],check=True)
        commit=subprocess.check_output(['git','-C',str(self.root),'rev-parse','HEAD'],text=True).strip()
        item=self.m['inputs'][0]
        item['archive']={'kind':'git','commit':commit,'verified_at':'synthetic, not a remote receipt',
            'url':'the source repository'+commit+'/'+item['path']}
        self.assertTrue(self.check()['ready'])
        (self.root/item['path']).write_text('modified after saved fixture')
        self.assertFalse(self.check()['ready'])
    def test_dependency_inspection_requires_restored_project(self):
        self.path.write_text(json.dumps(self.m));self.assertFalse(pre.validate_package(self.path)['ready'])
    def test_native_engine_stops_before_build(self):
        spec=importlib.util.spec_from_file_location('channel_fixture',ENGINE/'pipeline.py')
        channel=importlib.util.module_from_spec(spec);spec.loader.exec_module(channel)
        p=object.__new__(channel.Project);p.config={'pre_render_manifest':'../package.json'}
        p.episode=self.episode;p.project=self.project
        self.m['status']='STORY_SEQUENCE_DRAFT';self.path.write_text(json.dumps(self.m))
        with patch.object(channel.Project,'build',side_effect=AssertionError('must not build')):
            with self.assertRaisesRegex(ValueError,'Pre-render blocked'): p.render('native')
    def test_pilot_cannot_bypass_by_removing_binding(self):
        spec=importlib.util.spec_from_file_location('channel_fixture',ENGINE/'pipeline.py')
        channel=importlib.util.module_from_spec(spec);spec.loader.exec_module(channel)
        p=object.__new__(channel.Project);p.config={'id':'cold-metal-pilot'}
        with patch.object(channel.Project,'build',side_effect=AssertionError('must not build')):
            with self.assertRaisesRegex(ValueError,'requires pre_render_manifest'): p.render('native')
    def test_posting_cannot_bypass_pilot_binding(self):
        spec=importlib.util.spec_from_file_location('channel_posting',ENGINE/'pipeline.py')
        channel=importlib.util.module_from_spec(spec);spec.loader.exec_module(channel)
        p=object.__new__(channel.Project);p.config={'id':'cold-metal-pilot'}
        with patch.object(channel.Project,'build',side_effect=AssertionError('must not build')):
            with self.assertRaisesRegex(ValueError,'requires pre_render_manifest'):p.render('posting')
    def test_posting_rejects_frozen_4k_package_before_build(self):
        spec=importlib.util.spec_from_file_location('channel_posting',ENGINE/'pipeline.py')
        channel=importlib.util.module_from_spec(spec);spec.loader.exec_module(channel)
        p=object.__new__(channel.Project);p.config={'pre_render_manifest':'../package.json'}
        p.episode=self.episode;p.project=self.project
        self.path.write_text(json.dumps(self.m))
        with patch.object(channel._pre,'require_ready'),patch.object(channel.Project,'build',side_effect=AssertionError('must not build')):
            with self.assertRaisesRegex(ValueError,'resolution differs'):p.render('posting')
    def test_pilot_has_five_valid_contracts_and_zero_ready(self):
        spec=importlib.util.spec_from_file_location('seq',ENGINE/'sequence.py')
        seq=importlib.util.module_from_spec(spec);spec.loader.exec_module(seq)
        batch=ENGINE.parent/'pre-render/pilot-20261016'
        queue=json.loads((batch/'queue.json').read_text())
        self.assertEqual(len(queue['items']),5)
        for item in queue['items']:
            manifest=batch/item['manifest']
            self.assertFalse(pre.validate_package(manifest)['ready'])
            contract=json.loads((manifest.parent/'sequence_contract.json').read_text())
            self.assertEqual(seq.validate_contract(contract)['shots'],5)
            if contract.get('owner_sequence_review',{}).get('status')=='approved':
                seq.validate_contract(contract,'motion')
                with self.assertRaises(ValueError): seq.validate_contract(contract,'release')
            else:
                with self.assertRaises(ValueError): seq.validate_contract(contract,'motion')

if __name__=='__main__': unittest.main()
