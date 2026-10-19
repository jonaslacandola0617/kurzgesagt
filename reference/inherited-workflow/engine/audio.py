"""Shared audio operations; preserves Pig War's sample processing exactly."""
from pathlib import Path
import numpy as np,subprocess
from scipy.io import wavfile

def load(path,rate=48000):
 return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-ar',str(rate),'-ac','2','-f','f32le','-']),dtype='<f4').reshape(-1,2).copy()

def save(path,a,rate=48000):
 wavfile.write(path,rate,(np.clip(a,-1,1)*32767).astype(np.int16))

def place_cue(fx,raw,t,dur,peak,pan=0,off=0,rate=48000):
 n=len(fx);a=raw[round(off*rate):round((off+dur)*rate)].copy()
 if not len(a):raise ValueError('Empty sound cue')
 if not (0<=t<n/rate) or peak<=0:raise ValueError('Invalid sound cue timing/gain')
 a*=peak/max(.001,float(np.max(np.abs(a))));f=min(1680,len(a)//4)
 if f:a[:f]*=np.linspace(0,1,f)[:,None]
 f=min(5280,len(a)//4)
 if f:a[-f:]*=np.linspace(1,0,f)[:,None]
 a[:,0]*=1-.3*pan;a[:,1]*=1+.3*pan;p=round(t*rate);a=a[:n-p];fx[p:p+len(a)]+=a
 return len(a)/rate

def normalize(source,target,rate=48000):
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(source),'-af','loudnorm=I=-13:TP=-1.5:LRA=8','-ar',str(rate),'-ac','2','-c:a','pcm_s16le',str(target)],check=True)

def canonical_pcm(source,target,rate=48000):
 _,pcm=wavfile.read(source);wavfile.write(target,rate,pcm)

def normalize_two_pass(source,target,rate=48000):
 import json
 measure=subprocess.run(['ffmpeg','-hide_banner','-i',str(source),'-af','loudnorm=I=-13:TP=-1.5:LRA=8:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
 stats=json.loads(measure.stderr[measure.stderr.rfind('{'):])
 values={'measured_I':'input_i','measured_TP':'input_tp','measured_LRA':'input_lra','measured_thresh':'input_thresh','offset':'target_offset'}
 filt='loudnorm=I=-13:TP=-1.5:LRA=8:'+':'.join(k+'='+stats[v] for k,v in values.items())+':linear=true'
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(source),'-af',filt,'-ar',str(rate),'-ac','2','-c:a','pcm_s16le',str(target)],check=True)
