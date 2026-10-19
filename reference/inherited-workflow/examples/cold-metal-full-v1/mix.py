from pathlib import Path
import numpy as np,json,subprocess,math,hashlib
from scipy.io import wavfile
from scipy.signal import butter,sosfilt
r=Path(__file__).parent;repo=r.parents[4];sr=48000
load=lambda p:np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-f','f32le','-ar',str(sr),'-ac','2','-']),np.float32).reshape(-1,2).copy()
# Only shorten explicitly detected interior silence; original speech assets remain intact.
edits={'intro':[(5.89,6.36)],'outro':[(3.49,3.70),(6.30,6.68)]}
def warp(name,t):return t-sum(max(0,min(t,b)-a) for a,b in edits.get(name,[]) if t>a)
def source(name):
 p=r/'audio'/f'{name}.mp3';a=load(p);mask=np.ones(len(a),bool)
 for x,y in edits[name]:mask[round(x*sr):round(y*sr)]=False
 return a[mask],len(a)
intro,ni=source('intro');outro,no=source('outro');mech=load(r.parent/'motion-r2/audio/voice_original.mp3')
intro_on=.18;mech_on=math.ceil((intro_on+len(intro)/sr+.10)*30)/30;outro_on=mech_on+13.35
voice_end=outro_on+len(outro)/sr;duration=math.ceil((voice_end+1.65)*30)/30;n=round(duration*sr);vo=np.zeros((n,2));records=[]
for name,a,on in [('intro',intro,intro_on),('mechanism',mech,mech_on+.18),('outro',outro,outro_on)]:
 a*=.62/max(np.max(abs(a)),.001);i=round(on*sr);vo[i:i+len(a)]+=a;records.append({'name':name,'onset':on,'end':on+len(a)/sr,'samples':len(a),'speech_time_stretch':False})
t=np.arange(n)/sr;mu=np.zeros_like(vo)
# Continue the original harmonically voiced, plucked editorial score across the whole story.
chords=[[146.832,220,261.626],[174.614,261.626,349.228],[196,246.942,293.665],[130.813,196,261.626]]
for k in range(math.ceil(duration/3.4)):
 tt=t-k*3.4;u=np.maximum(tt,0);env=np.where(tt>=0,np.minimum(u/.35,1)*np.exp(-u/3.4),0)
 for f in chords[k%4]:
  v=(np.sin(2*np.pi*f*t)+.23*np.sin(2*np.pi*2*f*t))*.012*env;mu[:,0]+=v;mu[:,1]+=v*.92
notes=[587.33,440,523.25,659.25,587.33,523.25,392,523.25,659.25,523.25]
for k in range(math.ceil(duration/1.26)):
 f=notes[k%len(notes)];tt=t-(.3+k*1.26);u=np.maximum(tt,0);env=np.where(tt>=0,np.minimum(u/.012,1)*np.exp(-u*3.8),0);v=(np.sin(2*np.pi*f*tt)+.21*np.sin(2*np.pi*2*f*tt)+.08*np.sin(2*np.pi*3*f*tt))*.042*env;mu[:,0]+=v;mu[:,1]+=v*.87
mu*=np.minimum(t/.22,1)[:,None]*np.clip((duration-t)/.65,0,1)[:,None]
old=json.loads((r.parent/'motion-r2/timeline.json').read_text());cues=[(Path(e['source']).name,mech_on+e['onset'],e['duration'],e['peak_target'],e['event'])for e in old['events']]
cues += [('camera_move.mp3',0,.48,.24,'metal/wood photographic comparison'),('ink.mp3',1.55,.2,.21,'equal-condition baseline'),('marker_bold.mp3',3.35,.28,.24,'colder-feeling question'),('paper.mp3',6.08,.35,.26,'shared equilibrium comparison'),('pencil.mp3',8.7,.42,.23,'equilibrium condition'),('camera_move.mp3',outro_on+.04,.35,.24,'skin response reframe'),('marker_bold.mp3',outro_on+warp('outro',3.95),.32,.24,'wood slower-transfer selection'),('camera_move.mp3',outro_on+warp('outro',6.7),.4,.25,'resolve opening paradox'),('ink.mp3',outro_on+warp('outro',9.9),.22,.22,'heat-leaving insight')]
fx=np.zeros_like(vo);activity=np.clip(np.sqrt(np.convolve(np.mean(vo*vo,axis=1),np.ones(480)/480,mode='same'))/.025,0,1);held=0;release=np.exp(-1/(sr*.08))
for j in range(n):held=max(activity[j],held*release);activity[j]=held
sheet=[]
for name,at,dur,peak,event in sorted(cues,key=lambda x:x[1]):
 p=repo/'audio/generated-editorial-v1'/name;a=load(p);energy=np.sqrt(np.mean(a*a,axis=1));ix=np.where(energy>max(.0005,np.max(energy)*.03))[0];off=max(0,int(ix[0])-480)if len(ix)else 0;a=a[off:off+round(dur*sr)];a=sosfilt(butter(2,6500,fs=sr,output='sos'),a,axis=0);a*=peak/max(np.max(abs(a)),.001);fade=min(960,len(a)//3);a[:fade]*=np.linspace(0,1,fade)[:,None];a[-fade:]*=np.linspace(1,0,fade)[:,None];i=round(at*sr);a*=(1-.56*activity[i:i+len(a)])[:,None];fx[i:i+len(a)]+=a;mu[max(0,i-1500):min(n,i+len(a)+4000)]*=.64;sheet.append({'source':str(p.relative_to(repo)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'onset':at,'duration':len(a)/sr,'event':event})
for name,a in [('voice',vo),('music',mu),('sfx',fx),('raw',vo+mu+fx)]:wavfile.write(r/'audio'/f'{name}.wav',sr,np.int16(np.clip(a,-1,1)*32767))
a=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(r/'audio/raw.wav'),'-af','loudnorm=I=-14:TP=-1.5:LRA=8,volume=0.6dB,alimiter=limit=0.85:level=false:latency=true','-ar','48000','-ac','2','-f','f32le','-']),np.float32).reshape(-1,2)
assert len(a)==n;wavfile.write(r/'audio/mix.wav',sr,np.int16(np.clip(a,-1,1)*32767))
caps=[]
def cap(on,a,b,lines,name=None):caps.append({'start':on+(warp(name,a)if name else a),'end':on+(warp(name,b)if name else b),'lines':lines})
for a,b,ss in [(0,1.35,['These two spoons can be']),(1.35,3.05,['exactly the same temperature.']),(3.30,4.96,['But metal feels colder.']),(5.34,5.83,['How?']),(6.56,7.8,['Leave metal and wood']),(7.8,9.08,['in the same room long enough,']),(9.16,11.05,['and both settle','to room temperature.'])]:cap(intro_on,a,b,ss,'intro')
for c in old['captions']:cap(mech_on,c['start'],min(c['end'],13.27),c['lines'])
for a,b,ss in [(0,1.8,['That colder feeling comes from']),(1.8,3.4,['your skin cooling faster.']),(3.90,6.26,['Wood takes heat away','more slowly.']),(6.90,8.15,["Your hand isn't simply reading"]),(8.15,9.60,["the spoon's temperature."]),(9.86,11.43,["It's responding to heat"]),(11.43,12.68,['leaving your skin.'])]:cap(outro_on,a,b,ss,'outro')
data={'duration':duration,'fps':30,'frames':round(duration*30),'intro_on':intro_on,'mechanism_start':mech_on,'outro_start':outro_on,'payoff_start':outro_on+warp('outro',6.7),'voice_end':voice_end,'ending_start':duration-1.1,'captions':caps,'caption_status':'phrase timing estimated from measured source silences; not independently word-verified','events':sheet,'source_records':records,'silence_edits':edits,'tail':{'last_word':'skin','voice_fade':False,'protected_tail_before_endcard':duration-1.1-voice_end}}
(r/'timeline.json').write_text(json.dumps(data,indent=2)+'\n');(r/'SFX_CUE_SHEET.json').write_text(json.dumps(sheet,indent=2)+'\n');print(json.dumps({k:v for k,v in data.items()if k not in ['captions','events']}))
