#!/usr/bin/env python3
"""channel production CLI: explicit inputs, stable builds, visual/audio cache separation."""
from pathlib import Path
import argparse,base64,hashlib,html,importlib.util,json,os,shutil,subprocess,sys,wave,zipfile,inspect

ENGINE=Path(__file__).resolve().parent
_sequence_spec=importlib.util.spec_from_file_location('channel_sequence_contract',ENGINE/'sequence.py')
_sequence=importlib.util.module_from_spec(_sequence_spec);_sequence_spec.loader.exec_module(_sequence)
validate_episode_sequence=_sequence.validate_episode_sequence
_finishing_spec=importlib.util.spec_from_file_location('channel_finishing_contract',ENGINE/'finishing_contract.py')
_finishing=importlib.util.module_from_spec(_finishing_spec);_finishing_spec.loader.exec_module(_finishing)
validate_finishing=_finishing.validate_finishing
_std_spec=importlib.util.spec_from_file_location('channel_production_standard',ENGINE/'production_standard.py')
_std=importlib.util.module_from_spec(_std_spec);_std_spec.loader.exec_module(_std)
_pre_spec=importlib.util.spec_from_file_location('channel_pre_render',ENGINE/'pre_render.py')
_pre=importlib.util.module_from_spec(_pre_spec);_pre_spec.loader.exec_module(_pre)
BROWSER=['motion.js','optics.js','finishing.js','editorial-finish.js','focus.js','runtime.js','materials.js','material-profile.js','brand.js','drawing.js','typography.js']

def digest(p):
 h=hashlib.sha256()
 with Path(p).open('rb') as f:
  for chunk in iter(lambda:f.read(8*1024*1024),b''):h.update(chunk)
 return h.hexdigest()

def fingerprint(paths):
 return hashlib.sha256(json.dumps([(str(p),digest(p)) for p in paths],separators=(',',':')).encode()).hexdigest()

def load_json(p):return json.loads(Path(p).read_text())
def write_json(p,d):Path(p).write_text(json.dumps(d,indent=2))
def run(args):subprocess.run([str(a) for a in args],check=True)

def validate_visual_direction(c):
 # Approved historical sources preserve their original render contracts.
 if c['id'] in ['pig-war','tutorial-optics-test','legacy-ending-film','sunlight-white','astronaut-height']:return
 if c.get('material_profile')!='image-led-v1' or c.get('visual_style')!='image-led':
  raise ValueError('New episodes require the owner-adopted image-led style and image-led-v1 material profile')
 missing=set(['paperFiber','plastic','photocopy'])-set(c.get('images',{}))
 if missing:raise ValueError('Image-led episodes require private material slots: '+', '.join(sorted(missing)))

class Project:
 def __init__(self,args):
  self.episode=Path(args.episode).resolve();self.project=Path(args.project).resolve();self.assets=self.project/'assets'
  self.config=load_json(self.episode/'episode.json');self.out=Path(args.out).resolve();self.out.mkdir(parents=True,exist_ok=True)
  if self.config.get('schema')!=1:raise ValueError('Unsupported episode schema')
  self.state_path=self.out/'build-state.json';self.state=load_json(self.state_path) if self.state_path.exists() else {}
  self.chrome=args.chrome or os.environ.get('CHANNEL_CHROME')
  if not self.chrome:
   self.chrome=shutil.which('chromium') or shutil.which('google-chrome')
   fallback=Path('/tmp/channel_chrome/chrome-headless-shell-linux64/chrome-headless-shell')
   if not self.chrome and fallback.exists():self.chrome=str(fallback)
  self.node=os.environ.get('CODEX_PRIMARY_RUNTIME_NODE') or shutil.which('node')
  self.mix=self.assets/self.config['mix'];self.studio=self.out/'Studio.html'

 def inspect(self):
  c=self.config
  lock=load_json(ENGINE/'requirements.lock.json')
  for name,expected in lock.items():
   canonical=ENGINE.parent.parent/name
   if canonical.exists() and digest(canonical)!=expected:raise ValueError('Production requirement changed; read and reconcile before rebuilding: '+name)
  if c['id'] not in ['pig-war','tutorial-optics-test'] and c.get('brand_ending')!='brand-ending-v1':raise ValueError('New episodes must use the owner-locked legacy brand endcard')
  validate_visual_direction(c)
  validate_episode_sequence(c,self.episode,'artwork')
  validate_finishing(c,self.episode,'artwork')
  if (c['width'],c['height'],c['fps'])!=(1080,1920,30):raise ValueError('v1 engine requires the existing channel 9:16/30fps profile')
  required=list(c['images'].values())+c['data_files']+[c['mix'],c['voice']]+[f['file'] for f in c['fonts']]
  missing=[n for n in required if not (self.assets/n).is_file()]
  if missing:raise ValueError('Missing private project inputs: '+', '.join(missing))
  for f in c['fonts']:
   if digest(self.assets/f['file'])!=f['sha256']:raise ValueError('Pinned font changed: '+f['file'])
  spec=importlib.util.spec_from_file_location('episode_data',self.episode/c['data_loader']);mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
  self.data=mod.load(self.assets);self.duration=float(self.data['timing']['duration'])
  if self.duration<=0:raise ValueError('Invalid duration')
  standard_report=_std.validate_standard(c,self.episode,self.duration)
  captions=self.data['timing']['captions'];previous=-1
  for cap in captions:
   if not (0<=cap['start']<cap['end']<=self.duration+.001) or cap['start']<previous:raise ValueError('Invalid/overlapping caption times')
   previous=cap['end']
  for p in [self.mix,self.assets/c['voice']]:
   with wave.open(str(p)) as w:
    if (w.getnchannels(),w.getsampwidth(),w.getframerate())!=(2,2,48000):raise ValueError('Expected 16bit 48k stereo PCM: '+p.name)
    if abs(w.getnframes()/48000-self.duration)>.05:raise ValueError('Audio/timeline duration mismatch: '+p.name)
  # Current browser PCM contract: scipy/FFmpeg canonical 44-byte WAV header.
  with self.mix.open('rb') as f:header=f.read(44)
  if header[:4]!=b'RIFF' or header[36:40]!=b'data':raise ValueError('Canonical PCM WAV required; convert with audio command before build')
  paths=[ENGINE/'production_standard.py',ENGINE/'sequence.py',self.episode/'episode.json',self.episode/c['data_loader']]+[ENGINE/'browser'/n for n in BROWSER+['frame.js','player.js','player.css','studio.html']]+[self.episode/n for n in c['scripts']]+[self.assets/n for n in list(c['images'].values())+c['data_files']+[f['file'] for f in c['fonts']]]
  if c.get('sequence_contract'):paths.append(self.episode/c['sequence_contract'])
  if c.get('motion_review_targets'):paths.append(self.episode/c['motion_review_targets'])
  self.visual_key=hashlib.sha256((fingerprint(paths)+inspect.getsource(Project.build)+inspect.getsource(Project.inspect)).encode()).hexdigest();self.audio_key=digest(self.mix);self.render_key=digest(ENGINE/'tools/render.cjs')
  return {'episode':c['id'],'duration':self.duration,'frames':round(self.duration*30),'fonts':'PINNED','inputs':'PASS','visual_key':self.visual_key,'audio_key':self.audio_key,'production_standard':standard_report,'creative_review':'human review required','caption_review':self.data['timing'].get('caption_status','not independently verified')}

 def save(self):write_json(self.state_path,self.state)

 def build(self):
  validate_episode_sequence(self.config,self.episode,'motion')
  report=self.inspect();key=self.visual_key+'/'+self.audio_key
  if self.state.get('build',{}).get('key')==key and self.studio.exists() and digest(self.studio)==self.state['build']['sha256']:
   print('Build reused: unchanged inputs');return
  c=self.config;media={}
  for name,file in c['images'].items():
   mime='png' if file.endswith('.png') else 'jpeg';media[name]='data:image/'+mime+';base64,'+base64.b64encode((self.assets/file).read_bytes()).decode()
  media['mix']=base64.b64encode(self.mix.read_bytes()).decode();font_css=''
  for font in c['fonts']:
   font_css+='@font-face{font-family:'+json.dumps(font['family'])+';src:url(data:font/ttf;base64,'+base64.b64encode((self.assets/font['file']).read_bytes()).decode()+') format("truetype");font-weight:100 900;}'
  js='const CONFIG='+json.dumps(c,separators=(',',':'))+';const DATA='+json.dumps(self.data,separators=(',',':'))+';const MEDIA='+json.dumps(media,separators=(',',':'))+';const RENDER_SCALE=new URLSearchParams(location.search).get("scale")==="2"?2:1;\n'
  js+='\n'.join((ENGINE/'browser'/n).read_text() for n in BROWSER)
  js+='\n'+'\n'.join((self.episode/n).read_text() for n in c['scripts'])
  js+='\n'+(ENGINE/'browser/frame.js').read_text()+'\n'+(ENGINE/'browser/player.js').read_text()
  js+="\ndocument.getElementById('scrub').max=DURATION;Promise.all([document.fonts.ready,...Object.values(imgs).map(i=>i.decode().catch(error=>{if(!i.complete||!i.naturalWidth||!i.naturalHeight)throw error;const probe=document.createElement('canvas');probe.width=probe.height=1;const q=probe.getContext('2d');q.drawImage(i,0,0,1,1);q.getImageData(0,0,1,1);} ))]).then(()=>{if(!document.fonts.check('900 100px \\\"the old headline display face\\\"')||!document.fonts.check('700 36px Manrope'))throw Error('Font loading failed');setupMaterials();renderAt(0);window.renderReady=true;});"
  template=(ENGINE/'browser/studio.html').read_text();values={'TITLE':html.escape(c['title']),'DESCRIPTION':html.escape(c['description']),'DURATION':str(self.duration),'CSS':font_css+(ENGINE/'browser/player.css').read_text(),'SCRIPT':js.replace('</script','<\\/script')}
  for name,value in values.items():template=template.replace('@@'+name+'@@',value)
  self.studio.write_text(template);self.state['build']={'key':key,'sha256':digest(self.studio)};self.save();write_json(self.out/'input-check.json',report);print('Built',self.studio)

 def plan(self,profile='posting'):
  self.inspect();old=self.state.get(profile,{})
  if old.get('visual_key')==self.visual_key and old.get('render_key')==self.render_key and all(Path(x).exists() and digest(x)==h for x,h in old.get('outputs',{}).items()) and old.get('outputs'):
   return 'reuse' if old.get('audio_key')==self.audio_key else 'remux'
  return 'render'

 def render(self,profile,start=0,seconds=None):
  if profile in ('native','posting'):
   if self.config.get('pre_render_manifest') or self.config.get('id') in _pre.PILOT_IDS:
    if not self.config.get('pre_render_manifest'):raise ValueError('Pilot episode requires pre_render_manifest')
    _pre.require_ready(self.episode/self.config['pre_render_manifest'],self.episode,self.project)
    settings=load_json(self.episode/self.config['pre_render_manifest'])['settings']
    expected=(2160,3840) if profile=='native' else (1080,1920)
    if (settings['width'],settings['height'])!=expected:raise ValueError('Requested delivery resolution differs from frozen reviewed package')
   validate_episode_sequence(self.config,self.episode,'release')
  self.build()
  if profile in ('native','posting'):validate_finishing(self.config,self.episode,'release',studio_path=self.studio,expected_size=[2160,3840] if profile=='native' else [1080,1920])
  if not self.chrome or not self.node:raise ValueError('Set CHANNEL_CHROME and install Node/Playwright')
  smoke=seconds is not None;duration=seconds if smoke else self.duration
  if start<0 or start+duration>self.duration+.001:raise ValueError('Render range outside episode')
  scale=2 if profile=='native' else 1;prefix='Smoke' if smoke else ('Channel_4K' if profile=='native' else 'Channel_1080p' if profile=='posting' else 'Preview')
  kinds=[('posting' if profile=='posting' else 'master',self.out/(prefix+'.mp4'))]
  if scale==2:kinds += [('webm',self.out/(prefix+'.webm')),('download',self.out/(prefix+'_Download.mp4'))]
  action='render' if smoke else self.plan(profile)
  if action=='reuse':print('Render reused: verified inputs and output hashes unchanged');return
  if action=='remux':
   for kind,p in kinds:
    temp=p.with_name(p.stem+'.remux'+p.suffix)
    audio=['libopus','256k'] if kind=='webm' else ['aac','320k']
    run(['ffmpeg','-y','-v','error','-i',p,'-i',self.mix,'-map','0:v','-map','1:a','-c:v','copy','-c:a',audio[0],'-b:a',audio[1],'-ar','48000','-ac','2','-t',self.duration]+([] if kind=='webm' else ['-movflags','+faststart'])+[temp]);temp.replace(p)
  else:
   config={'studio':str(self.studio),'mix':str(self.mix),'chrome':self.chrome,'scale':scale,'start':start,'frames':round(duration*30),'outputs':[{'kind':k,'path':str(p)} for k,p in kinds],'progress':str(self.out/'render-progress.json')}
   cfg=self.out/'render-request.json';write_json(cfg,config);run([self.node,ENGINE/'tools/render.cjs',cfg])
  results={}
  for kind,p in kinds:
   results[p.name]=verify(p,scale,round(duration*30),duration)
   if kind=='download' and p.stat().st_size>=512*1024*1024:raise ValueError('Download size limit exceeded')
  write_json(self.out/(prefix+'_technical.json'),{'status':'SMOKE TEST' if smoke else 'RENDER CANDIDATE','action':action,'outputs':results,'creative_listening_caption_approval':'not inferred from technical checks'})
  if not smoke:self.state[profile]={'visual_key':self.visual_key,'audio_key':self.audio_key,'render_key':self.render_key,'outputs':{str(p):digest(p) for _,p in kinds}};self.save()

 def audio(self):
  c=self.config;script=(self.episode if c.get('audio_builder_location')=='episode' else self.project)/c['audio_builder'];inputs=[script,ENGINE/'audio.py']+[self.project/n for n in c['audio_inputs']]
  key=fingerprint(inputs)
  if self.state.get('audio',{}).get('key')==key and self.mix.exists() and digest(self.mix)==self.state['audio']['output']:print('Audio reused');return
  subprocess.run([sys.executable,str(script)],check=True,env={**os.environ,'CHANNEL_ENGINE_ROOT':str(ENGINE),'CHANNEL_PROJECT_ROOT':str(self.project)});self.state['audio']={'key':key,'output':digest(self.mix)};self.save();print('Audio rebuilt; visual cache remains eligible if timing is unchanged')

 def package(self):
  self.build();target=self.out/'Channel_Engine_Project.zip'
  with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:
   for root,label in [(ENGINE,'engine'),(self.episode,'episode')]:
    for p in root.rglob('*'):
     if p.is_file() and '__pycache__' not in p.parts:z.write(p,label+'/'+str(p.relative_to(root)))
   required=set(self.config['images'].values())|set(self.config['data_files'])|{f['file'] for f in self.config['fonts']}|{self.config['mix'],self.config['voice']}
   required|={str(Path(p).relative_to('assets')) for p in self.config['audio_inputs'] if Path(p).parts[0]=='assets'}
   required|={p.name for p in self.assets.glob('*.txt')}
   required|={'music_full.wav','sfx_full.wav'}
   for name in sorted(required):
    p=self.assets/name
    if p.exists():z.write(p,'project/assets/'+name)
   for name in ['SFX_CUE_SHEET.json','RESEARCH_AND_RIGHTS.md','SEQUENCE_CONTRACT.md','NARRATION_FINAL.txt','README.md','ASSET_MANIFEST.json']:
    p=self.project/name
    if p.exists():z.write(p,'project/'+name)
   for source in self.project.glob('*.srt'):z.write(source,'project/'+source.name)
   p=self.project/'baseline/SFX_CUE_SHEET_R2.json'
   if p.exists():z.write(p,'project/baseline/'+p.name)
   for p in self.out.glob('*.json'):z.write(p,'checks/'+p.name)
   z.write(self.studio,'Studio.html')
   z.writestr('PRIVATE_MATERIAL_NOTICE.txt','Private rebuild bundle. Contains owner materials, licensed fonts and geography notices. Do not publish raw materials.\n')
   for name in ['AGENTS.md','production/art-direction/VISUAL_TRANSLATION_REVIEW.md','production/art-direction/VISUAL_SEQUENCE_DIRECTION.md','production/art-direction/SCIENCE_SHOT_ART_CONTRACT.md','production/art-direction/SCIENCE_PAPER_IMAGE_STANDARD.md','production/MASTER_PRODUCTION_BIBLE.md','production/bible/v1.4/01_EDITORIAL_ART_AND_MOTION_DIRECTION_BIBLE.md','production/standards/PIG_WAR_R2_OWNER_APPROVAL.md','production/standards/PAPER_IMAGE_OWNER_DIRECTION.md']:
    source=ENGINE.parent.parent/name
    if source.exists():z.write(source,'governance/'+name)
   for source in (self.out/'qa').glob('*.json'):z.write(source,'checks/qa/'+source.name)
   source=self.out/'qa/pipeline/pipeline-test.json'
   if source.exists():z.write(source,'checks/qa/pipeline-test.json')
  with zipfile.ZipFile(target) as z:
   if z.testzip():raise ValueError('ZIP integrity failed')
  print('Packaged',target,'PRIVATE: contains licensed project assets')

def verify(p,scale,frames,duration):
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(p)]));v=next(x for x in probe['streams'] if x['codec_type']=='video');a=next(x for x in probe['streams'] if x['codec_type']=='audio')
 expected_v,expected_a=('vp9','opus') if p.suffix=='.webm' else ('h264','aac')
 if (v['width'],v['height'],v['r_frame_rate'],int(v['nb_read_frames']),v['codec_name'],a['codec_name'],int(a['sample_rate']),a['channels'])!=(1080*scale,1920*scale,'30/1',frames,expected_v,expected_a,48000,2):raise ValueError('Encoded stream mismatch: '+p.name)
 if abs(float(probe['format']['duration'])-duration)>.08:raise ValueError('Encoded duration mismatch')
 run(['ffmpeg','-v','error','-xerror','-i',p,'-f','null','-'])
 return {'size':p.stat().st_size,'width':v['width'],'height':v['height'],'frames':frames,'duration':float(probe['format']['duration']),'full_decode':'PASS'}

def main():
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('command',choices=['check','preview','render','plan','audio','package']);parser.add_argument('--episode',required=True);parser.add_argument('--project',required=True);parser.add_argument('--out',required=True);parser.add_argument('--chrome');parser.add_argument('--start',type=float,default=0);parser.add_argument('--seconds',type=float);parser.add_argument('--profile',choices=['posting','native','preview'],default='posting');args=parser.parse_args();p=Project(args)
 if args.command=='check':p.build();print(json.dumps(p.inspect(),indent=2))
 elif args.command=='preview':p.render('preview',args.start,args.seconds)
 elif args.command=='render':p.render(args.profile,args.start,args.seconds)
 elif args.command=='plan':print(p.plan(args.profile))
 elif args.command=='audio':p.audio()
 elif args.command=='package':p.package()

if __name__=='__main__':
 try:main()
 except (ValueError,OSError,subprocess.CalledProcessError) as e:print('channel:',e,file=sys.stderr);sys.exit(1)
