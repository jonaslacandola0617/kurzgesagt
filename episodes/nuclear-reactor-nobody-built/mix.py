"""Audio for The Nuclear Reactor Nobody Built, draft v1.
Original synthesized score (sections follow the story), catalogued SFX on visible events, Bernard narration with ducking.
usage: python3 mix.py <repo_root> <narration.wav> <out_dir>
"""
import json, re, subprocess, sys, os, hashlib
import numpy as np
from scipy.io import wavfile

root, narr, out = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(out, exist_ok=True)
here = os.path.dirname(os.path.abspath(__file__))
tl = open(os.path.join(here, 'timeline.js')).read()
B = json.loads(re.search(r'B = (\{.*?\});', tl).group(1)); VO = float(re.search(r'VO = ([0-9.]+)', tl).group(1)); DUR = float(re.search(r'DURATION = ([0-9.]+)', tl).group(1))
SR = 48000; N = int(SR * DUR); t = np.arange(N) / SR
fr = lambda x: float(np.ceil(x * 30 - 1e-9) / 30)   # first frame showing the event

def decode(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()
def env(a, d, s, r, L):
    tot = a + d + r
    if tot * SR > L: k = L / (tot * SR) * .98; a, d, r = a * k, d * k, r * k
    na, nd, nr = max(1, int(a * SR)), max(1, int(d * SR)), max(1, int(r * SR))
    e = np.ones(L) * s; e[:na] = np.linspace(0, 1, na); e[na:na + nd] = np.linspace(1, s, nd); e[-nr:] *= np.linspace(1, 0, nr); return e

music = np.zeros((N, 2))
def tone(f, t0, dur, amp, pan=0.0, harm=(1, .5, .25), a=.4, r=.8, vib=0.0):
    i0 = int(t0 * SR); L = min(int(dur * SR), N - i0)
    if L <= 0: return
    tt = np.arange(L) / SR; ph = 2 * np.pi * f * tt + vib * np.sin(2 * np.pi * 5 * tt)
    w = sum(h * np.sin(ph * (k + 1)) for k, h in enumerate(harm)) * env(a, .3, .8, r, L) * amp
    music[i0:i0 + L, 0] += w * (1 - pan) * .7; music[i0:i0 + L, 1] += w * (1 + pan) * .7
def pad(t0, t1, freqs, amp, a=1.5, r=1.5):
    for k, f in enumerate(freqs): tone(f, t0, t1 - t0, amp, (-1) ** k * .3, (1, .3, .1), a=a, r=r)
D = 73.42; Dm = [D * 2, D * 2 * 1.189, D * 3, D * 4 * 1.122]; F = [D * 2 * 1.189, D * 3, D * 4 * 1.189]
motif = [1, 1.189, 1.5, 1.335]           # original four note motif (D minor colour)
def play_motif(t0, base, step, amp, ratios=motif):
    for k, m in enumerate(ratios): tone(base * m, t0 + k * step, step * 1.6, amp, (-1) ** k * .4, (1, .4, .15), a=.01, r=.5)
# 1 lab: curious motif
pad(0, B['natural'], [D * 2, D * 3], .035); play_motif(.6, D * 8, .32, .03); play_motif(B['missing'] - .1, D * 8, .22, .03, [1.5, 1.335, 1.189, 1.122])
# 2 earth: spacious pad, motif high, dark turn at "less"
pad(B['natural'] - .2, B['like'], Dm, .03, a=2); play_motif(B['everywhere'], D * 16, .4, .016)
tone(D * 2 * 1.059, B['less'] - .05, 2.4, .04, 0, (1, .5, .3), a=.05, r=1.2)
# 3 compare: low drone, tension
tone(D, B['like'] - .2, B['about2b'] - B['like'], .07, 0, (1, .5, .3), a=.6, r=1.0); tone(D * 1.5 * 1.059, B['nobody'], 2.2, .03, .3, (1, .4), a=.3, r=1.2)
# 4 deep time: reverse swell into a wide pad, rising arpeggio as the gauge rises
sw = np.linspace(0, 1, int(1.2 * SR)) ** 2; i0 = int((B['about2b'] - 1.2) * SR); noise = np.random.default_rng(3).standard_normal(len(sw)); lp = np.convolve(noise, np.ones(30) / 30, 'same') * sw * .08
music[i0:i0 + len(sw), 0] += lp; music[i0:i0 + len(sw), 1] += lp
pad(B['about2b'], B['groundwater'], [D, D * 1.5, D * 2 * 1.122, D * 3], .035, a=1.0)
for k in range(8): tone(D * 4 * [1, 1.122, 1.189, 1.5, 1.682, 2, 2.245, 2.378][k], B['richer'] + k * .19, .5, .025, (-1) ** k * .4, (1, .3), a=.01, r=.35)
# 5 dive + chain: descending figure, then an accelerating pulse locked to fissions
for k in range(6): tone(D * 4 * [2, 1.682, 1.5, 1.189, 1.122, 1][k], B['groundwater'] + k * .28, .5, .022, 0, (1, .3), a=.01, r=.35)
tone(D, B['water_slows'], B['heat'] - B['water_slows'], .06, 0, (1, .5, .3), a=.8, r=.5)
pt = B['split'] - .4; k = 0
while pt < B['heat']: tone([D * 4, D * 4 * 1.5, D * 4 * 1.189, D * 8][k % 4], pt, .22, .04 + .002 * min(k, 12), (-1) ** k * .4, (1, .4, .2), a=.005, r=.18); pt += max(.12, .42 - .025 * k); k += 1
# 6 cycle: tension cluster + simmer, silence at OFF, cool, restart pulse
for f, p in [(D * 2 * 1.059, -.4), (D * 2 * 1.122, .4), (D * 2 * 1.189, 0)]: tone(f, B['heat'] - .2, B['stopped'] - B['heat'] + .4, .03, p, (1, .5, .3), a=1.2, r=.4, vib=.004)
noise = np.random.default_rng(1).standard_normal(N); simmer = np.convolve(noise, np.ones(40) / 40, 'same')
se = np.clip((t - B['boiled']) / 1.0, 0, 1) * np.clip((B['stopped'] - t) / .4, 0, 1) * .05; music[:, 0] += simmer * se; music[:, 1] += np.roll(simmer, 300) * se
pad(B['cooled'] - .2, B['switched'], [D, D * 1.5], .03, a=1.5, r=.6)
pt = B['again'] - .2; k = 0
while pt < B['half'] + .2: tone([D * 4, D * 4 * 1.5][k % 2], pt, .2, .035, (-1) ** k * .3, (1, .4), a=.005, r=.15); pt += .3; k += 1
# 7 rhythm: on/off pulses (sync to picture pulses: period shrinks 1.6 -> 0.35 s)
tt = B['half'] - .3; k = 0
while tt < B['cant'] - .3:
    u = np.clip((tt - B['half']) / (B['years1'] - B['half']), 0, 1); u = u * u * (3 - 2 * u); per = 1.6 + (.35 - 1.6) * u
    tone(D * 4 * (1.5 if k % 4 == 3 else 1), tt, min(.25, per * .2 + .05), .04, (-1) ** k * .3, (1, .4, .2), a=.005, r=.12); tt += per; k += 1
pad(B['half'] - .3, B['cant'], [D, D * 2], .03, a=.5, r=.4)
# 8 today: descending motif, thinning
play_motif(B['cant'], D * 4, .45, .03, [1.5, 1.335, 1.189, 1]); pad(B['cant'], B['receipts'] - .5, [D, D * 1.189 * 2], .028, a=.6, r=1.2)
# 9 receipts: wonder, motif in a brighter colour
pad(B['receipts'] - .8, B['nuclear'], [D * 2, D * 2 * 1.26, D * 3, D * 4 * 1.26], .03, a=1.5)
play_motif(B['receipts'], D * 8, .38, .022, [1, 1.26, 1.5, 1.682]); play_motif(B['changed'], D * 8, .38, .02, [1.5, 1.682, 2, 1.5])
# 10 landing: motif resolves
pad(B['nuclear'] - .3, DUR, [D, D * 2, D * 3, D * 4 * 1.26], .035, a=1.0, r=2.0); play_motif(B['nuclear'], D * 8, .5, .025, [1, 1.189, 1.5, 2])
music *= np.clip((DUR - t) / 1.2, 0, 1)[:, None]

# ---------------- SFX: catalogue cues on visible events ----------------
S = 'audio/sfx_v1/'; O = 'audio/original-sfx-v1/wav/'
cues = [('readout appears', B['missing'] - .55, S + 'science/SFX_SCIENCE_data_pulse_v1.flac', -12),
        ('MISMATCH on screen', B['missing'] + .25, S + 'science/SFX_SCIENCE_unit_mismatch_v1.flac', -12),
        ('cut to Earth', B['natural'] - .15, S + 'motion/SFX_MOTION_soft_depth_pass_v1.flac', -12),
        ('Gabon pin appears', B['this_ore'] - .15, S + 'motion/SFX_MOTION_tiny_mask_reveal_v1.flac', -10),
        ('Gabon turns red', B['less'] - .1, S + 'editorial/SFX_EDITORIAL_doubt_tick_v1.flac', -8),
        ('fuel rod lands', B['like'] + .2, S + 'mechanical/SFX_MECHANICAL_steel_latch_v1.flac', -10),
        ('rock slides in', B['but_rock'] + .15, S + 'motion/SFX_MOTION_cut_match_v1.flac', -10),
        ('NOBODY BUILT IT', B['nobody'], S + 'cinematic/SFX_CINEMATIC_investigative_sting_v1.flac', -11),
        ('rewind', B['about2b'] - .9, S + 'cinematic/SFX_CINEMATIC_suspense_riser_v1.flac', -15),
        ('uranium gauge rises', B['three'] - .3, S + 'science/SFX_SCIENCE_data_pulse_v1.flac', -13),
        ('dive into ground', B['groundwater'] - .2, S + 'motion/SFX_MOTION_parallax_swish_v1.flac', -9),
        ('iris into ore', B['water_slows'] - .25, S + 'motion/SFX_MOTION_soft_depth_pass_v1.flac', -9),
        ('CHAIN REACTION', B['chain'], S + 'editorial/SFX_EDITORIAL_causal_reveal_v1.flac', -11),
        ('reaction OFF', B['stopped'] - .2, S + 'science/SFX_SCIENCE_lost_signal_v1.flac', -12),
        ('ON AGAIN', B['switched'], S + 'editorial/SFX_EDITORIAL_discovery_chime_v1.flac', -12),
        ('rhythm cut', B['half'] - .4, S + 'motion/SFX_MOTION_cut_match_v1.flac', -12),
        ("it can't happen today", B['cant'] - .2, S + 'cinematic/SFX_CINEMATIC_restrained_boom_v1.flac', -11),
        ('TOO LITTLE FUEL', B['natural2'], S + 'editorial/SFX_EDITORIAL_hard_fact_punctuate_v1.flac', -12),
        ('receipts', B['receipts'] - .9, S + 'editorial/SFX_EDITORIAL_discovery_chime_v1.flac', -13),
        ('alpha panel', B['fundamental'], S + 'motion/SFX_MOTION_document_focus_v1.flac', -13),
        ('bound locked', B['less2'], S + 'editorial/SFX_EDITORIAL_evidence_lock_v1.flac', -12),
        ('return to lab', B['nuclear'] - .35, S + 'cinematic/SFX_CINEMATIC_warm_resolution_v1.flac', -13)]
SPLITS = [B['split'], B['split'] + 1.0, B['split'] + 1.15, B['split'] + 1.7, B['chain'] + .2, B['chain'] + .9, B['again'] - .1]
cues += [(f'fission {i + 1}', s, S + 'cinematic/SFX_CINEMATIC_micro_emphasis_v1.flac', -8 - i) for i, s in enumerate(SPLITS[:6])] + [('restart fission', SPLITS[6], S + 'cinematic/SFX_CINEMATIC_micro_emphasis_v1.flac', -9)]
for i in range(10): cues.append((f'pin {i + 1}', B['everywhere'] - .3 + i * .17 + .08, S + 'science/SFX_SCIENCE_telemetry_ping_v1.flac', -24))
sfx = np.zeros((N, 2)); sheet = []
for name, at, rel, gain in cues:
    path = os.path.join(root, rel); x = decode(path); on = fr(at); i0 = int(on * SR); L = min(len(x), N - i0)
    if L <= 0: continue
    sfx[i0:i0 + L] += x[:L] * 10 ** (gain / 20)
    sheet.append({'event': name, 'onset_s': round(on, 3), 'asset': rel, 'sha256': hashlib.sha256(open(path, 'rb').read()).hexdigest(), 'gain_db': gain, 'provenance': 'catalogued synthesized SFX, not a recording'})
br = np.random.default_rng(77)
for k in range(30):
    on = fr(B['boiled'] + br.random() * 2.4); f0 = 500 + br.random() * 900; L = int(.07 * SR); tt = np.arange(L) / SR
    pop = np.sin(2 * np.pi * (f0 * tt + 2500 * tt * tt)) * np.exp(-tt * 55) * (.05 + .05 * br.random()); i0 = int(on * SR); p = br.random() * 2 - 1
    sfx[i0:i0 + L, 0] += pop * (1 - p) * .7; sfx[i0:i0 + L, 1] += pop * (1 + p) * .7
sheet.append({'event': 'boiling bubble pops x30', 'onset_s': f"{B['boiled']:.2f}-{B['boiled'] + 2.4:.2f}", 'asset': 'synthesized in mix.py', 'provenance': 'designed sound, not a recording'})

# ---------------- narration + ducking ----------------
sr, v = wavfile.read(narr); v = v.astype(np.float32)
if v.ndim == 1: v = np.stack([v, v], 1)
fl = int(.03 * SR); v[-fl:] *= np.linspace(1, 0, fl)[:, None]      # 30 ms end fade against a possible abrupt source ending
voice = np.zeros((N, 2)); i0 = int(VO * SR); L = min(len(v), N - i0); voice[i0:i0 + L] = v[:L]
a = np.abs(voice[:, 0]); win = int(.05 * SR); lev = np.convolve(a, np.ones(win) / win, 'same'); speech = (lev > .01).astype(float)
duck = np.convolve(speech, np.ones(int(.25 * SR)) / int(.25 * SR), 'same')
mix = voice + music * (10 ** (-8 * np.clip(duck * 1.5, 0, 1) / 20))[:, None] + sfx * (10 ** (-2 * np.clip(duck, 0, 1) / 20))[:, None]
for name, x in [('music', music), ('sfx', sfx), ('voice', voice), ('mix_raw', mix)]:
    wavfile.write(os.path.join(out, name + '.wav'), SR, np.clip(x, -1, 1).astype(np.float32))
json.dump({'voice_offset_s': VO, 'duration_s': DUR, 'cues': sheet}, open(os.path.join(out, 'SFX_CUE_SHEET.json'), 'w'), indent=1)
print('peak', float(np.abs(mix).max()), 'cues', len(sheet))
