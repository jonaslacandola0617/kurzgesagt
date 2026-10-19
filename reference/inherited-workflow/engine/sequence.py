"""Validate new-episode visual sequence contracts; never certify artistry."""
import json
from pathlib import Path

# Existing approved exports retain their original source contracts.
HISTORICAL={'pig-war','tutorial-optics-test','legacy-ending-film','sunlight-white','astronaut-height','recorded-voice'}
REQUIRED=('viewer_before','factual_proposition','visual_operation','subject_action','viewer_after','invariant','initial_state','difficult_intermediate','resolved_state','next_inheritance','representation_reason','source_truth_boundary','caption_clearance','reading_hold')

def historical(config):
 return config.get('id') in HISTORICAL and 'sequence_contract' not in config

def validate_contract(contract,stage='artwork'):
 if contract.get('version')!=1:raise ValueError('Visual sequence contract must have version 1')
 shots=contract.get('shots')
 if not isinstance(shots,list) or not shots:raise ValueError('Visual sequence contract requires nonempty shots')
 for i,shot in enumerate(shots):
  missing=[k for k in REQUIRED if not isinstance(shot.get(k),str) or not shot[k].strip() or shot[k].strip().lower() in {'todo','tbd','pending','to complete'}]
  if missing:raise ValueError(f'Sequence shot {i+1} missing decisions: '+', '.join(missing))
  translation=shot.get('visual_translation',{})
  keys=('reference_observation','transferable_principle','original_execution','asset_operation')
  if any(not isinstance(translation.get(k),str) or not translation[k].strip() for k in keys):
   raise ValueError(f'Sequence shot {i+1} requires reference-to-execution translation')
 if stage in {'motion','release'}:
  rendered=contract.get('rendered_review',{})
  for key in ('initial','intermediate','resolved'):
   item=rendered.get(key,{})
   digest=item.get('sha256','')
   if not item.get('path') or len(digest)!=64 or any(c not in '0123456789abcdef' for c in digest):
    raise ValueError('Rendered review requires path and SHA-256 for '+key)
  if any(not isinstance(rendered.get(k),str) or not rendered[k].strip() for k in ('heading_hidden_evidence','comparison','remaining_weaknesses')):
   raise ValueError('Rendered comparison, weaknesses and heading-hidden evidence required')
  if rendered.get('unresolved_fallbacks')!=[]:
   raise ValueError('Unresolved visual fallback findings block motion')
  review=contract.get('owner_sequence_review',{})
  if review.get('status')!='approved' or not review.get('date') or not review.get('evidence'):
   raise ValueError('Owner art/sequence approval must be recorded before moving production')
 if stage=='release':
  review=contract.get('owner_motion_review',{})
  if review.get('status')!='approved' or not review.get('date') or not review.get('evidence'):
   raise ValueError('Owner moving preflight approval must be recorded before native production')
 return {'contract_fields':'PASS','stage':stage,'shots':len(shots),'artistic_quality':'not inferred from validation'}

def validate_episode_sequence(config,episode,stage='artwork'):
 if historical(config):return {'status':'preserved historical source','artistic_quality':'not freshly certified'}
 if config.get('sequence_contract_version')!=1 or not config.get('sequence_contract'):
  raise ValueError('New episodes require sequence_contract_version: 1 and a sequence_contract JSON path')
 path=(Path(episode)/config['sequence_contract']).resolve()
 if not path.is_file():raise ValueError('Missing visual sequence contract: '+str(path))
 return validate_contract(json.loads(path.read_text()),stage)
