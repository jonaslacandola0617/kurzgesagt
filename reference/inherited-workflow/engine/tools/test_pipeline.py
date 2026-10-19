"""Integration test: native codecs, reuse, audio remux, and visual invalidation."""
from pathlib import Path
import argparse,array,hashlib,importlib.util,json,shutil,subprocess,sys,wave

parser=argparse.ArgumentParser();parser.add_argument('--engine',required=True);parser.add_argument('--episode',required=True);parser.add_argument('--project',required=True);parser.add_argument('--out',required=True);a=parser.parse_args()
original_engine=Path(a.engine).resolve();engine=Path(a.out).resolve()/'engine';shutil.copytree(original_engine,engine,dirs_exist_ok=True);source=Path(a.project).resolve();out=Path(a.out).resolve();out.mkdir(exist_ok=True,parents=True)
episode=out/'episode';shutil.copytree(a.episode,episode,dirs_exist_ok=True);project=out/'project';assets=project/'assets';assets.mkdir(exist_ok=True,parents=True)
for p in (source/'assets').iterdir():
 q=assets/p.name
 if not q.exists():q.symlink_to(p)
timing=json.loads((assets/'timing.json').read_text());timing['duration']=1.;timing['captions']=[dict(c,end=min(1,c['end'])) for c in timing['captions'] if c['start']<1]
(assets/'timing.json').unlink();(assets/'timing.json').write_text(json.dumps(timing))
for name in ['preflight_mix.wav','voice_full.wav']:
 with wave.open(str(source/'assets'/name)) as w:data=w.readframes(48000)
 (assets/name).unlink()
 with wave.open(str(assets/name),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(48000);w.writeframes(data)
spec=importlib.util.spec_from_file_location('channel',engine/'pipeline.py');mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
args=argparse.Namespace(episode=str(episode),project=str(project),out=str(out/'outputs'),chrome=None)
p=mod.Project(args);assert p.plan()=='render';p.render('native');assert p.plan()=='reuse';p.render('native')
def video_hash(file):return subprocess.check_output(['ffmpeg','-v','error','-i',str(file),'-map','0:v','-c','copy','-f','hash','-hash','sha256','-']).decode().strip()
movies=list((out/'outputs').glob('Channel_4K*.mp4'))+list((out/'outputs').glob('Channel_4K*.webm'));before={x.name:video_hash(x) for x in movies};audio_before=p.audio_key
with wave.open(str(assets/'preflight_mix.wav')) as w:data=array.array('h',w.readframes(w.getnframes()))
for i,value in enumerate(data):data[i]=int(value*.8)
with wave.open(str(assets/'preflight_mix.wav'),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(48000);w.writeframes(data.tobytes())
assert p.plan()=='remux';assert p.audio_key!=audio_before;p.render('native');assert p.plan()=='reuse'
assert all(video_hash(x)==before[x.name] for x in movies),'Audio remux changed encoded video packets'
encoder=engine/'tools/render.cjs';encoder_original=encoder.read_text();encoder.write_text(encoder_original.replace("?'15':'20'","?'16':'20'"));assert p.plan()=='render';encoder.write_text(encoder_original);assert p.plan()=='reuse'
scene=episode/'scenes.js';scene.write_text(scene.read_text().replace("glyphLine('TWO POWERS'","glyphLine('TWO NATIONS'"));assert p.plan()=='render'
# Corrupted fonts must stop a build, not silently substitute a fallback.
font=assets/'HeadlineDisplay.ttf';font.unlink();font.write_bytes(b'invalid font')
try:p.inspect()
except ValueError as e:assert 'Pinned font changed' in str(e)
else:raise AssertionError('Corrupted font was accepted')
report={'native_encode':'PASS 30 frames in MP4, WebM and download MP4','unchanged_render_reuse':'PASS','audio_only_remux':'PASS','video_packet_hashes_unchanged_after_remux':before,'encoder_change_invalidation':'PASS','visual_change_invalidation':'PASS','font_corruption_rejection':'PASS','scope':'One-second isolated fixture; not a new release master'}
(out/'pipeline-test.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
