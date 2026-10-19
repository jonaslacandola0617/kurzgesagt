"""Require runtime finishing evidence for new image-led native production."""
from pathlib import Path
import json,hashlib

def validate_finishing(config,episode,stage='artwork',studio_path=None,expected_size=None):
 if config.get('visual_style')!='image-led':return {'status':'not image-led'}
 # Preserve only specifically named historical source rebuilds without a new contract.
 if config.get('id') in {'pig-war','tutorial-optics-test','legacy-ending-film','sunlight-white','astronaut-height','recorded-voice'} and not config.get('revision') and not config.get('finishing'):return {'status':'preserved historical source'}
 f=config.get('finishing',{})
 if f.get('enabled')is not True or not f.get('implementation')or not f.get('contract'):raise ValueError('New image-led render requires declared active finishing and a subject-specific contract')
 if not(Path(episode)/f['contract']).is_file():raise ValueError('Missing finishing decision contract')
 if stage=='release':
  p=Path(episode)/f.get('runtime_proof','');
  if not p.is_file():raise ValueError('Native release requires actual finishing runtime proof')
  d=json.loads(p.read_text());cases=d.get('cases',[])
  if d.get('errors') or d.get('native')!=(expected_size or [2160,3840])or d.get('deterministic')is not True:raise ValueError('Native finishing execution proof failed')
  if len(cases)<3 or not any(x.get('meanRedDifference',0)>2 for x in cases)or not any(x.get('opaqueCaptionDifference')==0 for x in cases)or not any(x.get('t',0)>30 and x.get('meanRedDifference')==0 for x in cases):raise ValueError('Finishing proof lacks picture effect/caption/ending coverage')
  if d.get('temporal_grain',{}).get('changed_mean_abs',0)<=.1:raise ValueError('Moving grain did not execute at phone size')
  studio=Path(studio_path) if studio_path is not None else Path(episode)/f.get('studio','studio.html')
  if not studio.is_file()or hashlib.sha256(studio.read_bytes()).hexdigest()!=d.get('studio_sha256'):raise ValueError('Finishing proof does not match this rendered studio')
 return {'status':'PASS','stage':stage,'artistic_quality':'not inferred from execution proof'}
