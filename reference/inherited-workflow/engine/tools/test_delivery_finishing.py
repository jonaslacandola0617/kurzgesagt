"""Resolution-specific finishing evidence must match the requested delivery."""
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

ENGINE=Path(__file__).resolve().parents[1]
module_spec=importlib.util.spec_from_file_location('delivery_finishing',ENGINE/'finishing_contract.py')
finishing=importlib.util.module_from_spec(module_spec)
module_spec.loader.exec_module(finishing)

class FinishingResolutionTests(unittest.TestCase):
    def check_cli_profile(self,extra,expected):
        spec=importlib.util.spec_from_file_location('delivery_cli',ENGINE/'pipeline.py')
        cli=importlib.util.module_from_spec(spec);spec.loader.exec_module(cli)
        argv=['pipeline.py','render','--episode','fixture','--project','fixture','--out','fixture']+extra
        with patch('sys.argv',argv),patch.object(cli,'Project') as project:
            cli.main()
            project.return_value.render.assert_called_once_with(expected,0,None)
    def test_cli_defaults_to_1080p_posting(self):
        self.check_cli_profile([],'posting')
    def test_explicit_native_request_preserves_4k_route(self):
        self.check_cli_profile(['--profile','native'],'native')
    def test_resolution_matched_proof_and_wrong_resolution_rejection(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder)
            (root/'contract.md').write_text('Synthetic fixture, not production approval.')
            studio=root/'studio.html';studio.write_text('synthetic studio')
            proof={'native':[1080,1920],'errors':[],'deterministic':True,
                   'cases':[{'t':1,'meanRedDifference':3,'opaqueCaptionDifference':0},
                            {'t':2,'meanRedDifference':4},
                            {'t':35,'meanRedDifference':0}],
                   'temporal_grain':{'changed_mean_abs':1},
                   'studio_sha256':hashlib.sha256(studio.read_bytes()).hexdigest()}
            (root/'proof.json').write_text(json.dumps(proof))
            config={'id':'synthetic','visual_style':'image-led','finishing':{
                'enabled':True,'implementation':'fixture','contract':'contract.md',
                'runtime_proof':'proof.json','studio':'studio.html'}}
            self.assertEqual(finishing.validate_finishing(config,root,'release',expected_size=[1080,1920])['status'],'PASS')
            with self.assertRaisesRegex(ValueError,'execution proof failed'):
                finishing.validate_finishing(config,root,'release',expected_size=[2160,3840])
            proof['native']=[2160,3840]
            (root/'proof.json').write_text(json.dumps(proof))
            self.assertEqual(finishing.validate_finishing(config,root,'release')['status'],'PASS')
            with self.assertRaisesRegex(ValueError,'execution proof failed'):
                finishing.validate_finishing(config,root,'release',expected_size=[1080,1920])

if __name__=='__main__':unittest.main()
