import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec=importlib.util.spec_from_file_location('standard',Path(__file__).parents[1]/'production_standard.py')
standard=importlib.util.module_from_spec(spec);spec.loader.exec_module(standard)

class StandardTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.addCleanup(self.temp.cleanup)
        self.root=Path(self.temp.name)
        self.config={'production_standard':'sun-disappeared-v1','width':1080,'height':1920,'fps':30,'scene_fps':12,'brand_ending':'brand-ending-v1','motion_review_targets':'motion.json'}
        self.ledger={'duration':7.1,'events':[{'t':t,'operation':'reveal','understanding':'new relationship'} for t in (0,1.7,3.4,5.1)],'exceptions':[]}
    def validate(self,duration=7.1):
        (self.root/'motion.json').write_text(json.dumps(self.ledger))
        return standard.validate_standard(self.config,self.root,duration)
    def test_valid(self):
        self.assertEqual(self.validate()['operations'],4)
    def test_historical_preserved(self):
        self.assertEqual(standard.validate_standard({'id':'pig-war'},self.root)['status'],'historical declaration unchanged')
    def test_new_episode_must_declare_standard(self):
        with self.assertRaises(ValueError):standard.validate_standard({'id':'new-episode'},self.root)
    def test_wrong_cadence_rejected(self):
        self.config['scene_fps']=15
        with self.assertRaises(ValueError):self.validate()
    def test_wrong_ending_rejected(self):
        self.config['brand_ending']='substitute'
        with self.assertRaises(ValueError):self.validate()
    def test_unexplained_hold_rejected(self):
        self.ledger['events'].pop(1)
        with self.assertRaises(ValueError):self.validate()
    def test_explicit_reading_exception(self):
        self.ledger['events'].pop(1)
        self.ledger['exceptions']=[{'start':0,'end':3.4,'reason':'Read dense source quotation; encoded review required'}]
        self.assertEqual(len(self.validate()['exceptions']),1)
    def test_caption_only_declaration_incomplete(self):
        self.ledger['events'][1].pop('understanding')
        with self.assertRaises(ValueError):self.validate()
    def test_duration_mismatch_rejected(self):
        with self.assertRaises(ValueError):self.validate(8)
    def test_order_rejected(self):
        self.ledger['events'][2]['t']=1
        with self.assertRaises(ValueError):self.validate()
    def test_nonfinite_rejected(self):
        self.ledger['events'][1]['t']=float('nan')
        with self.assertRaises(ValueError):self.validate()
    def test_path_escape_rejected(self):
        self.config['motion_review_targets']='../outside.json'
        with self.assertRaises(ValueError):self.validate()
    def test_unknown_standard_rejected(self):
        self.config['production_standard']='unknown'
        with self.assertRaises(ValueError):self.validate()

if __name__=='__main__':unittest.main()
