"""Oklo style test audio: original synthesized score + catalogued SFX + Bernard narration.
usage: python3 mix.py <repo_root> <voice.mp3|none> <out_dir>
Writes music.wav, sfx.wav, (voice.wav), mix_raw.wav, SFX_CUE_SHEET.json. Loudness normalisation is a separate ffmpeg step.
"""
import json, subprocess, sys, os, hashlib
import numpy as np
from scipy.io import wavfile

SR = 48000; DUR = 12.4; N = int(SR * DUR); VO = 0.25
root, voice_path, out = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(out, exist_ok=True)
t = np.arange(N) / SR
q12 = lambda x: np.ceil(x * 12 - 1e-9) / 12   # sound lands on the visible scheduled state

def decode(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()

def env(a, d, s, r, length):
    e = np.ones(length) * s; tot = a + d + r
    if tot * SR > length: k = length / (tot * SR) * .98; a, d, r = a * k, d * k, r * k
    na, nd, nr = max(1, int(a * SR)), max(1, int(d * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na); e[na:na + nd] = np.linspace(1, s, nd); e[-nr:] *= np.linspace(1, 0, nr); return e

# ---------------- score (original, synthesized) ----------------
rng = np.random.default_rng(1019)
music = np.zeros((N, 2))
def tone(f, t0, dur, amp, pan=0.0, harm=(1, .5, .25), a=.4, r=.8, vib=0.0):
    i0 = int(t0 * SR); L = min(int(dur * SR), N - i0)
    if L <= 0: return
    tt = np.arange(L) / SR; ph = 2 * np.pi * f * tt + (vib * np.sin(2 * np.pi * 5 * tt))
    w = sum(h * np.sin(ph * (k + 1)) for k, h in enumerate(harm)) * env(a, .3, .8, r, L) * amp
    music[i0:i0 + L, 0] += w * (1 - pan) * .7; music[i0:i0 + L, 1] += w * (1 + pan) * .7
D = 73.42  # D2
# section 1: dusk pad, D minor add9 (0 - 4.3)
for f, p in [(D * 2, -.3), (D * 2 * 1.189, .3), (D * 3, -.1), (D * 2 * 1.5 * 1.122, .2)]:
    tone(f, 0, 4.9, .05, p, (1, .3, .1), a=1.6, r=1.2)
tone(D, 0, 4.9, .07, 0, (1, .2), a=1.2, r=1.0)
for k, f in enumerate([D * 8, D * 8 * 1.189, D * 8 * 1.5, D * 8 * 1.335]):   # shimmer motif
    tone(f, .6 + k * .55, 1.4, .018, (-1) ** k * .5, (1,), a=.02, r=1.2)
# section 2: chain reaction pulse, accelerating, tied to visible splits (4.3 - 6.9)
pulse_times = list(np.cumsum([.32, .3, .27, .24, .21, .19, .17, .15, .14, .13])) ; pulse_times = [4.6 + x for x in pulse_times]
for k, pt in enumerate(pulse_times):
    tone([D * 4, D * 4 * 1.5, D * 4 * 1.189, D * 4 * 2][k % 4], pt, .25, .045 + .004 * k, (-1) ** k * .4, (1, .4, .2), a=.005, r=.2)
tone(D, 4.4, 2.8, .08, 0, (1, .5, .3), a=.8, r=.6); tone(D * 1.5, 5.4, 1.9, .05, 0, (1, .3), a=.6, r=.5)
# section 3: heat & boiling tension cluster (6.3 - 10.0)
for f, p in [(D * 2 * 1.059, -.4), (D * 2 * 1.122, .4), (D * 2 * 1.189, 0), (D * 3, .2)]:
    tone(f, 6.3, 3.9, .035, p, (1, .5, .3), a=1.8, r=.6, vib=.004)
noise = rng.standard_normal(N); simmer = np.convolve(noise, np.ones(40) / 40, 'same')
simmer_env = np.clip((t - 7.4) / 1.2, 0, 1) * np.clip((10.0 - t) / .4, 0, 1) * .05
music[:, 0] += simmer * simmer_env; music[:, 1] += np.roll(simmer, 300) * simmer_env
# section 4: shut-off landing, descending tone over a low drone (10.0 - 12.4)
tone(D, 10.0, 2.4, .08, 0, (1, .4), a=.3, r=1.4)
for k, f in enumerate([D * 4 * 1.5, D * 4 * 1.335, D * 4 * 1.189, D * 4]):
    tone(f, 10.45 + k * .38, .9, .03, (-1) ** k * .3, (1, .3), a=.02, r=.7)
music *= np.clip((DUR - t) / .6, 0, 1)[:, None]

# ---------------- SFX cue sheet (catalogue first; designed bubbles synthesized) ----------------
A = lambda rel: os.path.join(root, rel)
CUES = [
    ('dive into the ground', 1.75, 'audio/sfx_v1/motion/SFX_MOTION_parallax_swish_v1.flac', -6),
    ('ore seam revealed', 3.58, 'audio/sfx_v1/editorial/SFX_EDITORIAL_discovery_chime_v1.flac', -8),
    ('iris into the ore', 4.25, 'audio/sfx_v1/motion/SFX_MOTION_soft_depth_pass_v1.flac', -7),
    ('first fission', 5.40, 'audio/sfx_v1/cinematic/SFX_CINEMATIC_micro_emphasis_v1.flac', -5),
    ('fission C', 5.78, 'audio/sfx_v1/cinematic/SFX_CINEMATIC_micro_emphasis_v1.flac', -9),
    ('fission B', 5.84, 'audio/sfx_v1/cinematic/SFX_CINEMATIC_micro_emphasis_v1.flac', -10),
    ('fission D', 6.12, 'audio/sfx_v1/cinematic/SFX_CINEMATIC_micro_emphasis_v1.flac', -10),
    ('fission E', 6.30, 'audio/sfx_v1/cinematic/SFX_CINEMATIC_micro_emphasis_v1.flac', -11),
    ('fission F', 6.70, 'audio/sfx_v1/cinematic/SFX_CINEMATIC_micro_emphasis_v1.flac', -12),
    ('heat rises', 6.40, 'audio/sfx_v1/cinematic/SFX_CINEMATIC_suspense_riser_v1.flac', -14),
    ('moderated fission H', 9.52, 'audio/sfx_v1/cinematic/SFX_CINEMATIC_micro_emphasis_v1.flac', -11),
    ('fast neutron 1', 10.10, 'audio/original-sfx-v1/wav/transitions__quick_reframe.wav', -12),
    ('fast neutron 2', 10.30, 'audio/original-sfx-v1/wav/transitions__quick_reframe.wav', -13),
    ('fast neutron 3', 10.55, 'audio/original-sfx-v1/wav/transitions__quick_reframe.wav', -14),
    ('reactor off', 10.42, 'audio/sfx_v1/cinematic/SFX_CINEMATIC_restrained_boom_v1.flac', -8),
]
sfx = np.zeros((N, 2)); sheet = []
for name, at, rel, gain in CUES:
    x = decode(A(rel)); on = float(q12(at)); i0 = int(on * SR); L = min(len(x), N - i0)
    sfx[i0:i0 + L] += x[:L] * 10 ** (gain / 20)
    sheet.append({'event': name, 'onset_s': round(on, 3), 'asset': rel, 'sha256': hashlib.sha256(open(A(rel), 'rb').read()).hexdigest(), 'gain_db': gain, 'provenance': 'catalogued synthesized SFX, not a recording'})
# designed bubble pops while the water boils (synthesized here)
br = np.random.default_rng(77)
for k in range(26):
    on = float(q12(7.65 + br.random() * 2.2)); f0 = 500 + br.random() * 900; L = int(.07 * SR); tt = np.arange(L) / SR
    pop = np.sin(2 * np.pi * (f0 * tt + 2500 * tt * tt)) * np.exp(-tt * 55) * (.05 + .05 * br.random())
    i0 = int(on * SR); pan = br.random() * 2 - 1; sfx[i0:i0 + L, 0] += pop * (1 - pan) * .7; sfx[i0:i0 + L, 1] += pop * (1 + pan) * .7
sheet.append({'event': 'boiling bubble pops x26', 'onset_s': '7.67-9.92', 'asset': 'synthesized in mix.py', 'gain_db': 'about -26', 'provenance': 'designed sound, not a recording'})

# ---------------- narration + ducking ----------------
voice = np.zeros((N, 2)); speech = np.zeros(N)
if voice_path != 'none':
    v = decode(voice_path); i0 = int(VO * SR); L = min(len(v), N - i0); voice[i0:i0 + L] = v[:L]
    a = np.abs(v[:L, 0]); win = int(.05 * SR); lev = np.convolve(a, np.ones(win) / win, 'same'); speech[i0:i0 + L] = lev > .01
duck = np.convolve(speech, np.ones(int(.25 * SR)) / int(.25 * SR), 'same')
music_g = 10 ** (-7 * np.clip(duck * 1.5, 0, 1) / 20)
mix = voice + music * music_g[:, None] + sfx * 10 ** (-2 * np.clip(duck, 0, 1) / 20)[:, None]
for name, x in [('music', music), ('sfx', sfx), ('voice', voice), ('mix_raw', mix)]:
    wavfile.write(os.path.join(out, name + '.wav'), SR, np.clip(x, -1, 1).astype(np.float32))
json.dump({'voice_offset_s': VO, 'duration_s': DUR, 'cues': sheet}, open(os.path.join(out, 'SFX_CUE_SHEET.json'), 'w'), indent=1)
print('peak', float(np.abs(mix).max()), 'voice', voice_path != 'none')
