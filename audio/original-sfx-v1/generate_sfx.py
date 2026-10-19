#!/usr/bin/env python3
"""Original procedural editorial SFX: no external samples or recordings."""
import csv, hashlib, json, math, pathlib, zipfile
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt

P=pathlib.Path(__file__).resolve().parent
O=P/'wav'; O.mkdir(parents=True,exist_ok=True)
SR=48000
rng=np.random.default_rng(20261011)
GROUPS={
 'reveals':['answer_glint','ominous_discovery','question_motif','final_resolution'],
 'impacts':['first_frame_punch','deep_consequence','evidence_stamp','mechanical_snap'],
 'tension':['riser_short','riser_long','heartbeat_subtle','countdown_accelerating'],
 'transitions':['paper_camera_push','air_parallax','quick_reframe','reverse_pull'],
 'archival':['paper_rustle','document_stack','pencil_underline','old_projector'],
 'mechanical':['latch_small','ratchet_cycle','gears_rotation','hydraulic_release'],
 'telemetry':['receiver_ping','signal_dropout','unit_mismatch','data_transfer'],
 'ambience':['control_room_low','electrical_hum','distant_engine_room','cosmic_low_tension']
}
assert sum(map(len,GROUPS.values()))==32
def band(n,lo,hi):
    x=rng.standard_normal(n)
    y=sosfilt(butter(3,[lo,hi],btype='bandpass',fs=SR,output='sos'),x)
    return y/(4*np.sqrt(np.mean(y*y))+1e-8)
def osc(t,f):
    return np.sin(2*np.pi*np.cumsum(f*np.ones_like(t) if np.isscalar(f) else f)/SR)
def bump(t,a,w):return np.exp(-.5*((t-a)/w)**2)
def tone(t,f,start,decay):
    u=np.maximum(0,t-start)
    return (osc(t,f)+.25*osc(t,f*2.03))*np.exp(-u/decay)*(t>=start)
def synth(group,idx,seconds):
    t=np.arange(round(SR*seconds))/SR
    n=len(t);v=np.zeros(n)
    low=band(n,70,1200);mid=band(n,400,4500);high=band(n,1800,11000)
    x=t/seconds
    if group=='reveals':
        base=[392,110,466,261][idx]
        seq=[(0,1),(.23,1.28),(.49,1.5)] if idx!=2 else [(0,1),(.32,1.122)]
        for d,p in seq:v+=tone(t,base*p,d,.4+.18*idx)*(.70/(1+.5*d))
        v+=.08*high*np.exp(-3*t)
    elif group=='impacts':
        base=[71,43,125,218][idx];f=base*(1+1.6*np.exp(-t*20))
        v=.8*osc(t,f)*np.exp(-t*(7 if idx==3 else 3.5))
        v+=.45*mid*np.exp(-t*(20 if idx in (2,3) else 9))
        if idx==3:v+=.25*osc(t,930)*np.exp(-t*10)
    elif group=='tension':
        if idx in (0,1):
            v=(.42*low+.19*osc(t,75+220*x*x))*(x**1.6)*np.minimum(1,t/.15)
        elif idx==2:
            for p in np.arange(.2,seconds,.84):
                v+=.7*osc(t,64)*bump(t,p,.038)+.46*osc(t,60)*bump(t,p+.18,.048)
        else:
            for p in [.3,1.1,1.8,2.35,2.77,3.13]:
                v+=tone(t,800+100*p,p,.08)*bump(t,p,.075)
    elif group=='transitions':
        e=np.sin(np.pi*x)**1.45
        if idx==3:e=e[::-1].copy()
        v=(.55*mid+.27*high)*e+.17*osc(t,180+800*x)*e
        if idx==0:v+=.18*low*bump(t,.43,seconds*.15)
    elif group=='archival':
        v=.6*mid
        at=[[.18,.58],[.15,.47,.82,1.3],[.10,.30,.53,.81,1.1],[.10,.22,.34,.46,.58,.70,.82,.94]][idx]
        v*=sum(bump(t,p,.085 if idx!=3 else .012) for p in at)
        if idx==3:v+=.15*osc(t,93)*(.6+.4*np.sin(2*np.pi*22*t))
    elif group=='mechanical':
        period=[.45,.19,.15,.45][idx]
        v=.12*osc(t,88+30*idx)
        for p in np.arange(.10,seconds,period):
            v+=.42*mid*bump(t,p,.012 if idx<3 else .11)
        if idx==3:v+=.33*low*np.minimum(1,t/.7)
    elif group=='telemetry':
        if idx==0:v=tone(t,880,.1,.34)
        if idx==1:v=.5*osc(t,720)*(t<seconds*.5)+.28*high*bump(t,seconds*.52,.18)
        if idx==2:v=tone(t,475,.08,.46)+tone(t,452,.23,.55)+.2*mid*bump(t,.63,.2)
        if idx==3:
            for p in np.arange(.10,seconds-.05,.13):
                v+=tone(t,1000+350*np.sin(14*p),p,.045)*bump(t,p,.035)*.37
    else:
        base=[64,60,95,43][idx]
        v=.11*osc(t,base)+.05*osc(t,base*2)+.09*low
        if idx==3:v+=.09*osc(t,base+.3)
    fade=min(580,len(v)//20)
    v[:fade]*=np.linspace(0,1,fade)
    v[-fade:]*=np.linspace(1,0,fade)
    v-=np.mean(v)
    pk=np.max(abs(v))
    if pk<1e-6:raise RuntimeError('empty sound')
    v*=.69/pk
    delay=round(SR*.003)
    stereo=np.column_stack((v,.92*v+.06*np.r_[np.zeros(delay),v[:-delay]])).astype('float32')
    return stereo
DURATION={
 'reveals':[1.3,2.3,1.25,2.1],
 'impacts':[1.2,2.3,.7,.75],
 'tension':[2.2,4.6,3.2,3.8],
 'transitions':[1.15,.95,.47,1.2],
 'archival':[1.1,1.8,1.3,3.1],
 'mechanical':[.7,1.9,3.0,2.7],
 'telemetry':[1.2,2.1,1.7,1.8],
 'ambience':[6.4,6.4,6.4,6.4]
}
rows=[];prev=[]
for group,names in GROUPS.items():
 for k,name in enumerate(names):
    filename=f'{group}__{name}.wav'
    x=synth(group,k,DURATION[group][k])
    sf.write(O/filename,x,SR,subtype='PCM_24')
    y,fs=sf.read(O/filename,always_2d=True,dtype='float32')
    pk=float(np.max(abs(y))); rms=float(np.sqrt(np.mean(y.astype('float64')**2)))
    assert fs==SR and y.shape[1]==2 and .4<pk<.85 and rms>.001 and np.isfinite(y).all()
    rows.append(dict(filename=filename,category=group,duration=round(len(y)/SR,3),format='WAV PCM24',sample_rate=48000,channels=2,peak_dbfs=round(20*np.log10(pk),2),rms_dbfs=round(20*np.log10(rms),2),sha256=hashlib.sha256((O/filename).read_bytes()).hexdigest(),source='Original procedural synthesis, not authentic recorded Foley'))
    prev.extend([y*.35,np.zeros((round(.22*SR),2),dtype='float32')])
with (P/'CATALOG.csv').open('w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
(P/'CATALOG.json').write_text(json.dumps(rows,indent=2))
sf.write(P/'AUDITION_ALL_32.wav',np.concatenate(prev),SR,subtype='PCM_16')
report=dict(cues=len(rows),sample_rate=SR,format='48k stereo WAV 24-bit',signal_qa='PASS',creative_listening='PENDING HUMAN REVIEW',categories={k:len(v) for k,v in GROUPS.items()},warnings=['These are procedural designed sounds, NOT real historical or archival field recordings','Existing Drive licensed stock library deliberately excluded','Listen on headphones and phone, and verify any sync inside each episode'])
(P/'QA.json').write_text(json.dumps(report,indent=2))
with zipfile.ZipFile(P/'ORIGINAL_SFX_V1.zip','w',compression=zipfile.ZIP_DEFLATED,compresslevel=8) as z:
 for fn in O.glob('*.wav'):z.write(fn,'wav/'+fn.name)
 for fn in ['README.md','LICENSE.txt','CATALOG.csv','CATALOG.json','generate_sfx.py','QA.json']:z.write(P/fn,fn)
print(json.dumps(report,indent=2))
