#!/usr/bin/env python3
"""the channel SFX v1 — ORIGINAL procedural editorial sound design.
NO third-party samples, no recorded-source claims, no external sample dependencies.
Build: python production/audio-sfx-v1/generate_pack.py
Requires numpy, scipy, soundfile and ffmpeg. Deterministic RNG per filename.
All source sound is designed/synthesized, not field-recorded acoustic Foley.
"""
import csv, hashlib, json, math, os, pathlib, subprocess, tempfile, zipfile, zlib
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

SR=48000
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=ROOT/"audio"/"sfx_v1"
OUT.mkdir(parents=True,exist_ok=True)
PI=math.pi

# Short intentional editorial cues rather than a generic huge sound dump.
# Usage descriptions are not claims that the audio matches a real historical recording.
CUES=[
 ("discovery_chime","editorial",1.45,"Unexpected factual discovery; under a named-revelation word"),
 ("causal_reveal","editorial",1.85,"Quiet rise and tonal landing as an explanation resolves"),
 ("doubt_tick","editorial",0.65,"Micro accent for contradiction or unchecked assumption"),
 ("evidence_lock","editorial",1.15,"Positive evidence-match punctuation; not every document"),
 ("turn_of_story","editorial",2.0,"Shift from apparent explanation into a deeper problem"),
 ("quiet_resolution","editorial",2.45,"Soft, warm thematic resolve without overpowering voice"),
 ("heartbeat_breath","editorial",1.9,"Human-stakes breath / narrative hinge, NOT a human heartbeat recording"),
 ("hard_fact_punctuate","editorial",0.75,"Sharp but controlled impact under a consequential number"),
 ("paper_light_turn","archive",1.05,"Illustrated paper page turn, designed/approximate"),
 ("paper_heavy_turn","archive",1.50,"Large dossier or folded document movement, designed/approximate"),
 ("photo_slide","archive",0.95,"Photo slide / archive image entering desk frame"),
 ("document_stamp","archive",0.70,"Soft approval/rejection stamp impression, designed"),
 ("pencil_marks","archive",1.35,"Illustrated pencil scratch and underlining, not a recording"),
 ("microfilm_spool","archive",2.15,"Mechanically inspired microfilm handling, designed"),
 ("typewriter_cluster","archive",1.65,"Stylized mechanical typing accents, not real typewriter field audio"),
 ("tape_reel_start","archive",2.15,"Stylized old tape start/transport texture"),
 ("screw_jack_turn","mechanical",1.50,"Mechanically inspired slow screw-jack turn, illustrative"),
 ("steel_latch","mechanical",0.82,"Small steel latch / positive metal lock, designed"),
 ("wood_stress","mechanical",1.70,"Creak and tension texture, designed not field-recorded"),
 ("gear_ratchet","mechanical",1.45,"Ratchet wheel indexing, physically timed"),
 ("heavy_hinge","mechanical",1.50,"Massive hinge rotating with constrained motion"),
 ("wheel_roll","mechanical",2.15,"Friction and rotary movement against ground"),
 ("metallic_rivet","mechanical",0.92,"Riveted metal contact/striking detail"),
 ("cable_tension","mechanical",2.15,"Strained winch cable / growing tension, approximate"),
 ("telemetry_ping","science",0.85,"Retro instrument ping, fictional design (not real NASA telemetry)"),
 ("radio_search","science",2.35,"Tuning across radio channels, fictional stylization"),
 ("lost_signal","science",2.35,"Radio carrier interruptions and dropout, designed"),
 ("radar_sweep","science",2.70,"Illustrative radar scan/pass, NOT historical instrument recording"),
 ("unit_mismatch","science",1.20,"Scientific numerical discrepancy / error-reveal accent"),
 ("data_pulse","science",1.10,"Transmission / data packet movement"),
 ("terminal_error","science",1.40,"Soft restrained system-error cue, not a game-over jingle"),
 ("mission_contact","science",1.60,"Spaceflight contact regained hypothetical status stinger"),
 ("parallax_swish","motion",1.15,"Layered editorial camera push / shallow whoosh"),
 ("document_focus","motion",0.95,"Macro archival focus switch / whisper"),
 ("map_route_draw","motion",1.35,"Cartographic ink-route reveal / aerial movement"),
 ("tiny_mask_reveal","motion",0.70,"Subtle masked number/source reveal"),
 ("perspective_whip","motion",1.30,"Quick 2.5D camera axis change"),
 ("cut_match","motion",0.80,"Matched-contour transition, very short"),
 ("soft_depth_pass","motion",1.80,"Continuous quiet across-plane motion; restrained"),
 ("low_cinematic_hit","cinematic",1.55,"Heavy consequence but no fabricated explosion"),
 ("investigative_sting","cinematic",2.00,"Investigative twist, rising dissonance then landing"),
 ("restrained_boom","cinematic",1.25,"Sub impact under serious revelation; not field explosion"),
 ("warm_resolution","cinematic",2.45,"Mild major-tonal earned ending"),
 ("suspense_riser","cinematic",2.75,"Controlled discovery rise without trailer cliché"),
 ("micro_emphasis","cinematic",0.60,"Mobile-safe sub/transient emphasis under one word"),
 ("archive_room","ambient",8.0,"Seamless loop: fictional quiet records room air and hum"),
 ("workshop_floor","ambient",8.0,"Seamless loop: fictional machine-room low ambience"),
 ("mission_control","ambient",8.0,"Seamless loop: fictional control-room electronics"),
 ("radio_noise_bed","ambient",8.0,"Seamless loop: analogue-style signal noise texture"),
 ("cavern_lowwind","ambient",8.0,"Seamless loop: fictional enclosed cavern air")
]

def rng_for(name):
    return np.random.default_rng((zlib.crc32(("CHANNEL-SFX-V1-"+name).encode())+20261011)&0xffffffff)

def filt(x,lo=0,hi=None,order=3):
    hi=hi or SR*.48
    if lo<=0:
        return sosfilt(butter(order,hi,btype="lowpass",fs=SR,output="sos"),x).astype(np.float64)
    if hi>=SR*.49:
        return sosfilt(butter(order,lo,btype="highpass",fs=SR,output="sos"),x).astype(np.float64)
    return sosfilt(butter(order,[lo,hi],btype="bandpass",fs=SR,output="sos"),x).astype(np.float64)

def noise(n,r,lo=150,hi=7000):
    x=filt(r.standard_normal(n+256),lo,hi)[256:]
    a=np.sqrt(np.mean(x*x))+1e-12
    return x/(a*3.8)

def ring(n,fs,decay=5,attack=0.003,detune=0):
    t=np.arange(n)/SR
    phase=2*PI*(fs*t+detune*t*t*.5)
    return np.sin(phase)*np.exp(-decay*t)*(1-np.exp(-t/max(.0003,attack)))

def chirp(n,a,b):
    t=np.arange(n)/SR
    d=max(t[-1],1e-3)
    phase=2*PI*(a*t+(b-a)*t*t/(2*d))
    return np.sin(phase)

def click_at(y,where,freq,r,scale=1.,length=.16,metal=.6):
    ix=int(where*SR)
    if ix>=len(y):return
    n=min(len(y)-ix,max(48,round(length*SR)))
    t=np.arange(n)/SR
    burst=noise(n,r,400,12500)*np.exp(-t*42)
    tone=(.7*ring(n,freq,19,.0008)+.26*ring(n,freq*1.89,28,.0005)+
          .18*ring(n,freq*2.73,35,.0005))
    y[ix:ix+n]+=scale*(metal*tone+(1-metal)*burst)

def roomy(y,dry=.86):
    # Discrete synthetic short reflections rather than a sampled impulse response.
    z=y.copy()
    for delay,gain in [(0.019,.14),(0.039,.075),(0.081,.039),(0.134,.026)]:
        k=round(delay*SR)
        if len(y)>k:z[k:]+=gain*y[:-k]
    return dry*y+(1-dry)*z

def paper(name,n,r,i):
    t=np.arange(n)/SR
    x=noise(n,r,900,11000)
    wob=np.maximum(0,np.sin(PI*np.clip(t/max(t[-1],.1),0,1)))**.7
    # Irregular physical stick-slip / thin-paper microtexture.
    pressure=.3+.55*np.abs(np.sin(2*PI*(9.5+.7*i)*t+.45*np.sin(2*PI*1.9*t)))
    y=.44*x*wob*pressure
    clicks={"document_stamp":3,"photo_slide":3,"typewriter_cluster":15,
            "pencil_marks":20,"microfilm_spool":9,"tape_reel_start":7}.get(name,6)
    for k in range(clicks):
        where=(k+.35)/max(clicks,1)*t[-1]+r.uniform(-.024,.024)
        if name=="document_stamp":where=.29+(.05*k)
        if where>0:click_at(y,where,110+65*r.random(),r,.24 if name!="document_stamp" else .85,.06,.34)
    if name=="tape_reel_start":
        y+=.10*chirp(n,125,180)*np.minimum(1,t/.33)*np.exp(-.12*t)
    if name=="microfilm_spool":
        y+=.12*chirp(n,155,240)*np.minimum(1,t/.20)*np.exp(-.18*t)
    if name=="document_stamp":y+=.18*ring(n,90,9)*np.exp(-3*np.maximum(0,t-.29))
    return roomy(y)

def mechanical(name,n,r,i):
    t=np.arange(n)/SR
    y=.12*noise(n,r,55,2300)*(np.sin(2*PI*(2.1+i*.12)*t)**2+.12)
    choices={
      "screw_jack_turn":(108,11,.25),"steel_latch":(240,1,.54),
      "wood_stress":(86,5,.25),"gear_ratchet":(288,9,.27),
      "heavy_hinge":(64,4,.48),"wheel_roll":(93,13,.16),
      "metallic_rivet":(318,2,.79),"cable_tension":(140,4,.31)
    }
    f,k,amp=choices[name]
    if name=="wood_stress":
        y+=.20*chirp(n,147,58)*np.sin(PI*np.clip(t/max(t[-1],.1),0,1))**2
    if name=="cable_tension":
        y+=.18*chirp(n,65,255)*np.minimum(1,t/.3)**2
    if name=="wheel_roll":
        y+=.12*noise(n,r,65,620)*(np.sin(2*PI*10*t)**2)
    for j in range(k):
        sec=(j+.45)/max(k,1)*t[-1]+r.uniform(-.018,.018)
        click_at(y,max(0,sec),f,r,amp*(.55+.4*r.random()),length=.22,metal=.85)
    return roomy(y)

def science(name,n,r,i):
    t=np.arange(n)/SR
    y=np.zeros(n)
    f=310+(i%5)*117
    if name=="radio_search":
        y=.22*noise(n,r,460,8500)*(.3+.7*np.abs(np.sin(2*PI*3.7*t)))
        y+=.17*chirp(n,220,2100)*np.abs(np.sin(2*PI*.8*t))
    elif name=="lost_signal":
        carrier=.18*ring(n,940,.14)
        p=np.maximum(0,np.sin(2*PI*1.7*t))
        y=.11*noise(n,r,350,6500)*p + carrier*p
        y*=np.clip((t[-1]-.65-t)/.22,0,1)
    elif name=="radar_sweep":
        y=.19*noise(n,r,320,7500)*np.maximum(0,np.sin(2*PI*.55*t))**8
        y+=.16*chirp(n,470,530)*np.maximum(0,np.sin(2*PI*.55*t))**7
    else:
        times=([.08,.23,.39,.51] if name=="data_pulse"
          else [.11,.65] if name=="mission_contact" else
          [.11,.50,.89] if name=="unit_mismatch" else
          [.13,.46,.79] if name=="terminal_error" else [.12,.42])
        for j,sec in enumerate(times):
            if sec>=t[-1]:continue
            ix=round(sec*SR);z=np.arange(n-ix)/SR
            f0=f+(j*143)
            ping=np.sin(2*PI*f0*z)*np.exp(-z*(13 if name=="telemetry_ping" else 10))
            ping+=.18*np.sin(2*PI*(f0*2.01)*z)*np.exp(-z*16)
            y[ix:]+=.28*ping
        y+=.025*noise(n,r,190,8500)
        if name=="unit_mismatch":y+=.11*chirp(n,880,380)*np.exp(-2*t)
    return roomy(y,.93)

def editorial(name,n,r,i):
    t=np.arange(n)/SR
    base= [164.81,185,196,220,246.94,261.63,293.66,329.63][i]
    mode={"discovery_chime":[1,1.5,2.25],
          "causal_reveal":[1,1.2599,1.5],
          "doubt_tick":[1,1.414],
          "evidence_lock":[1,1.5,2],
          "turn_of_story":[1,1.122,1.498],
          "quiet_resolution":[1,1.25,1.498,2],
          "heartbeat_breath":[1,1.499,1.999],
          "hard_fact_punctuate":[1,1.499]}[name]
    y=np.zeros(n)
    for k,m in enumerate(mode):
        onset=round((.07+.11*k)*SR)
        if onset>=n:continue
        decay=(2.3+1.25*k) if name in ("quiet_resolution","causal_reveal") else (4.+k)
        y[onset:]+=.20/(k+1)**.5*ring(n-onset,base*m,decay=decay)
    if "punctuate" in name or "doubt" in name:
        click_at(y,.06,195,r,.44,.18,.65)
    if name=="heartbeat_breath":
        for sec in [.09,.83]:click_at(y,sec,70,r,.6,.28,.83)
    y+=.05*noise(n,r,600,9000)*np.exp(-4*t)
    return roomy(y,.78)

def motion(name,n,r,i):
    t=np.arange(n)/SR
    x=noise(n,r,145,10000)
    u=t/max(t[-1],.01)
    env=np.sin(PI*np.clip(u,0,1))**(1.15 if name!="tiny_mask_reveal" else 2)
    sweep=np.sin(2*PI*(85+280*u)*t)
    wob=.20+.6*np.abs(np.sin(2*PI*(1.3+.1*i)*t))**2
    y=(.15+.12*(i%3))*x*env*wob+.11*sweep*env
    if name=="cut_match":click_at(y,t[-1]*.53,250,r,.50,.13,.55)
    if name=="map_route_draw":
        y+=.12*chirp(n,250,1650)*env
    if name=="document_focus":y+=.075*chirp(n,1000,290)*env
    if name=="perspective_whip":y+=.10*chirp(n,160,2800)*env
    return roomy(y,.94)

def cinematic(name,n,r,i):
    t=np.arange(n)/SR
    f={"low_cinematic_hit":56,"investigative_sting":112,"restrained_boom":43,"warm_resolution":174,
       "suspense_riser":110,"micro_emphasis":92}[name]
    if name=="suspense_riser":
        u=t/max(t[-1],.01)
        return .14*noise(n,r,150,9000)*u**1.7+.24*chirp(n,160,740)*u**2.1
    y=.33*ring(n,f,3.4,attack=.003)+.17*ring(n,f*2.012,4.6)
    y+=.14*noise(n,r,120,8500)*np.exp(-t*8)
    if name=="investigative_sting":
        y+=.13*chirp(n,185,480)*np.sin(PI*np.minimum(1,t/max(t[-1],.01)))
    if name=="warm_resolution":
        y=.3*ring(n,196,1.6)+.23*ring(n,246.94,1.5)+.19*ring(n,293.66,1.5)
    return roomy(y,.77)

def ambience(name,n,r,i):
    t=np.arange(n)/SR
    if name=="archive_room":y=.12*noise(n,r,50,720)+.028*np.sin(2*PI*57*t)
    elif name=="workshop_floor":y=.13*noise(n,r,45,1300)+.025*chirp(n,80,90)
    elif name=="mission_control":y=.095*noise(n,r,240,3500)+.018*np.sin(2*PI*165*t)
    elif name=="radio_noise_bed":y=.11*noise(n,r,500,9000)+.028*np.sin(2*PI*465*t)
    else:y=.15*noise(n,r,32,850)+.02*np.sin(2*PI*42*t)
    y*=(.91+.09*np.sin(2*PI*.31*t)**2)
    # Make the last portion loop into the opening, smoothing both value and spectral character.
    k=min(round(.7*SR),n//5)
    if k>100:
        w=np.sin(np.linspace(0,PI/2,k))**2
        tail=y[-k:].copy()
        y[-k:]=tail*(1-w)+y[:k]*w
    return y

def finish(x,name,is_loop):
    x=np.asarray(x,dtype=np.float64)
    x=np.nan_to_num(x)
    x-=np.mean(x)
    n=len(x)
    if not is_loop:
        k=min(round(.008*SR),n//5)
        if k>2:
            x[:k]*=np.linspace(0,1,k)
            x[-k:]*=np.linspace(1,0,k)
    peak=np.max(np.abs(x))+1e-12
    x=x/peak*(10**(-4.8/20))
    if is_loop:
        # Avoid sudden start clicks at loop wrap.
        x[-1]=x[0]
    # Tiny side delays and level difference for a safe, useful stereo image.
    delay=103+(zlib.crc32(name.encode())%77)
    right=.92*np.roll(x,delay)+.08*x
    left=x.copy()
    return np.stack([left,right],axis=1).astype(np.float32)

def writeWAV(frames,path):
    sf.write(path,frames,SR,subtype="PCM_24",format="WAV")

def build():
    manifest=[];demo=[]
    subdirs=set()
    for idx,(name,cat,duration,usage) in enumerate(CUES):
        r=rng_for(name)
        n=int(round(duration*SR))
        local_idx=sum(1 for nn,cc,_,_ in CUES[:idx] if cc==cat)
        bank={"editorial":editorial,"archive":paper,"mechanical":mechanical,
              "science":science,"motion":motion,"cinematic":cinematic,"ambient":ambience}
        y=bank[cat](name,n,r,local_idx)
        frames=finish(y,name,cat=="ambient")
        dirname=OUT/cat;dirname.mkdir(exist_ok=True);subdirs.add(dirname)
        fname=f"SFX_{cat.upper()}_{name}_v1.flac"
        path=dirname/fname
        sf.write(path,frames,SR,subtype="PCM_24",format="FLAC")
        probe,srr=sf.read(path,dtype="float32",always_2d=True)
        assert srr==SR and probe.shape==(n,2),str(path)
        peak=float(np.max(abs(probe)))
        rms=float(np.sqrt(np.mean(probe.astype(np.float64)**2)))
        assert np.isfinite(probe).all() and .015<peak<.85 and rms>.0007,(name,peak,rms)
        if cat=="ambient":assert abs(probe[0,0]-probe[-1,0])<.008
        bits=hashlib.sha256(path.read_bytes()).hexdigest()
        manifest.append({"name":name,"category":cat,"path":str(path.relative_to(ROOT)),"format":"FLAC PCM_24",
          "sample_rate":SR,"channels":2,"duration_seconds":round(n/SR,3),
          "peak_dBFS":round(20*math.log10(peak),2),"rms_dBFS":round(20*math.log10(rms),2),
          "sha256":bits,"production_method":"original procedural synthesis, no third-party samples",
          "usage":usage,"capture_type":"DESIGNED/SYNTHESIZED, not authentic recorded Foley",
          "loop":cat=="ambient","rights":"Original the channel sound design; source generator included."})
        # Reel: a representative blend of all families and mechanisms.
        if (cat!="ambient" and local_idx<4) or (cat=="ambient" and local_idx<2):
            length=min(n,round(1.7*SR))
            seg=probe[:length]
            if length>350:
                z=seg.copy()
                f=min(3500,len(z)//3)
                z[-f:]*=np.linspace(1,0,f)[:,None]
                demo.append(z)
                demo.append(np.zeros((round(.28*SR),2),np.float32))
    (OUT/"CATALOG.json").write_text(json.dumps({"version":"1.0.0","sample_rate":SR,
      "file_count":len(manifest),"license_scope":"original synthesized cues only; existing Google Drive licensed samples excluded",
      "last_inventory":"metadata audit: Drive SFX/Sounds Effects 120 audio entries on 2026-10-11",
      "cues":manifest},indent=2))
    with (OUT/"CATALOG.csv").open("w",newline="") as file:
        w=csv.DictWriter(file,fieldnames=list(manifest[0]));w.writeheader();w.writerows(manifest)
    sound=np.concatenate(demo)
    sf.write(OUT/"AUDITION_48k.wav",sound,SR,subtype="PCM_24")
    subprocess.run(["ffmpeg","-y","-v","error","-i",str(OUT/"AUDITION_48k.wav"),"-c:a",
      "libmp3lame","-b:a","224k",str(OUT/"SFX_V1_AUDITION.mp3")],check=True)
    # Avoid storing an extra large WAV reel in the repository; user can hear MP3.
    (OUT/"AUDITION_48k.wav").unlink()
    zip_path=ROOT/"SFX_V1_PCM24_WAV_PACK.zip"
    with zipfile.ZipFile(zip_path,"w",zipfile.ZIP_DEFLATED,compresslevel=6) as z:
        for entry in manifest:
            p=ROOT/entry["path"];arr,sr=sf.read(p,dtype="float32",always_2d=True)
            with tempfile.NamedTemporaryFile(suffix=".wav") as tf:
                writeWAV(arr,tf.name)
                z.write(tf.name,f"channel_SFX_v1/{entry['category']}/"+p.stem+".wav")
        for name in ["CATALOG.json","CATALOG.csv"]:
            z.write(OUT/name,"channel_SFX_v1/"+name)
    report={"status":"PASS","original_synthesized":len(manifest),"sample_rate":SR,"bit_depth":24,"channels":2,
       "categories":{c:sum(a['category']==c for a in manifest) for c in sorted(set(a["category"] for a in manifest))},
       "user_zip_bytes":zip_path.stat().st_size,"wav_pack_file":zip_path.name,
       "source_truth":"Digital sound design, not an authentic location recording or licensed recording from Drive.",
       "missing_final_human_QA":"Sound audition and placement in a narrated reference mix require human review."}
    (OUT/"BUILD_QA.json").write_text(json.dumps(report,indent=2))
    print("SFX_PACK_PASS",json.dumps(report),flush=True)
if __name__=="__main__":build()
