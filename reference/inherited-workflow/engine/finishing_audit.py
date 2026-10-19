"""Validate effect coverage evidence and input freshness, never artistic merit."""
import argparse,hashlib,json
from pathlib import Path
REQUIRED={'material_texture','moving_grain','motion_blur','selective_focus','focus_shading','focus_hunt','chromatic','mechanical_jitter','exposure','ink_bleed','edge_boil','caption_protection','ending_protection','sequence_continuity','audio_tail','sound_music'}
def digest(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def check(path):
 path=Path(path).resolve();d=json.loads(path.read_text());errors=[]
 if d.get('schema')!=1:errors.append('Unsupported audit schema')
 for i in d.get('sources',[]):
  p=path.parent/i['path']
  if not p.is_file()or digest(p)!=i.get('sha256'):errors.append('Source changed: '+i['path'])
 if not d.get('sources'):errors.append('Missing source fingerprints')
 effects=d.get('coverage',{})
 for name in sorted(REQUIRED):
  item=effects.get(name,{})
  if item.get('applicable') is False:
   if name in {'material_texture','moving_grain','caption_protection','sequence_continuity','audio_tail','sound_music'}:errors.append('Required treatment cannot be excluded: '+name)
   if not item.get('reason'):errors.append('Unexplained exclusion: '+name)
   continue
  if item.get('applicable') is not True:errors.append('Missing coverage: '+name);continue
  if item.get('execution')!='PASS':errors.append('Execution not proven: '+name)
  evidence=item.get('evidence',[])
  if not evidence:errors.append('No actual evidence: '+name)
  for e in evidence:
   p=path.parent/e.get('path','')
   if not p.is_file()or digest(p)!=e.get('sha256'):errors.append('Missing/changed evidence: '+name)
  if not item.get('active_window')or not item.get('expected_result'):errors.append('Missing shot-specific direction: '+name)
 return {'execution_records_pass':not errors,'errors':errors,'owner_motion_review':d.get('owner_motion_review','NOT REVIEWED'),'artistic_quality':'not inferred','subjective_listening':d.get('subjective_listening','NOT REVIEWED')}
if __name__=='__main__':
 a=argparse.ArgumentParser();a.add_argument('audit');args=a.parse_args();r=check(args.audit);print(json.dumps(r,indent=2));raise SystemExit(0 if r['execution_records_pass']else 1)
