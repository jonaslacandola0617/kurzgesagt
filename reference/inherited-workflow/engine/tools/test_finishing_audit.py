import importlib.util,json,tempfile,unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('finishing_audit',Path(__file__).parents[1]/'finishing_audit.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class AuditTests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup);self.r=Path(self.tmp.name);(self.r/'source').write_text('source');(self.r/'proof').write_text('rendered evidence fixture');self.path=self.r/'audit.json'
  self.d={'schema':1,'sources':[{'path':'source','sha256':m.digest(self.r/'source')}],'coverage':{n:{'applicable':True,'execution':'PASS','active_window':'fixture','expected_result':'pixel change','evidence':[{'path':'proof','sha256':m.digest(self.r/'proof')}]}for n in m.REQUIRED}}
 def check(self):self.path.write_text(json.dumps(self.d));return m.check(self.path)
 def test_complete_records(self):self.assertTrue(self.check()['execution_records_pass'])
 def test_forgotten_grain(self):del self.d['coverage']['moving_grain'];self.assertFalse(self.check()['execution_records_pass'])
 def test_changed_source(self):(self.r/'source').write_text('modified');self.assertFalse(self.check()['execution_records_pass'])
 def test_changed_proof(self):(self.r/'proof').write_text('changed');self.assertFalse(self.check()['execution_records_pass'])
 def test_na_needs_reason(self):self.d['coverage']['ending_protection']={'applicable':False};self.assertFalse(self.check()['execution_records_pass'])
 def test_documented_exclusion(self):self.d['coverage']['ending_protection']={'applicable':False,'reason':'isolated passage does not contain the full film endcard'};self.assertTrue(self.check()['execution_records_pass'])
 def test_texture_cannot_be_excluded(self):self.d['coverage']['material_texture']={'applicable':False,'reason':'omitted'};self.assertFalse(self.check()['execution_records_pass'])
 def test_enabled_is_not_execution(self):self.d['coverage']['motion_blur']['execution']='enabled';self.assertFalse(self.check()['execution_records_pass'])
if __name__=='__main__':unittest.main()
