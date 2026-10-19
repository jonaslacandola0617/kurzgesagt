"""Prepare Bernard narration: decode, trim only measured silence in gaps above 0.85 s down to 0.70 s,
shift word timestamps, report every gap. Speech samples are never altered or time stretched.
usage: python3 prep_voice.py <take.mp3> <out_dir>
"""
import json, subprocess, sys, os, hashlib
import numpy as np
from scipy.io import wavfile

SR = 48000; KEEP = 0.70; LIMIT = 0.85; THRESH_DB = -40.0; WIN = 0.010
src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, dtype=np.float32).copy()
n = int(WIN * SR); frames = len(x) // n
rms = np.sqrt(np.mean(x[:frames * n].reshape(frames, n) ** 2, axis=1) + 1e-12)
quiet = 20 * np.log10(rms) < THRESH_DB
# quiet runs (seconds)
runs, i = [], 0
while i < frames:
    if quiet[i]:
        j = i
        while j < frames and quiet[j]: j += 1
        runs.append((i * WIN, j * WIN)); i = j
    else: i += 1
words = json.load(open(os.path.join(os.path.dirname(__file__), 'audio', 'words_raw.json')))['words']
first, last = words[0]['start'], words[-1]['end']
gaps = [(a, b) for a, b in runs if a > first + 0.05 and b < last - 0.05]
cuts, report = [], []
for a, b in gaps:
    d = b - a
    if d > LIMIT:
        remove = d - KEEP; c0 = a + (d - remove) / 2; cuts.append((c0, c0 + remove))
        report.append({'start': round(a, 3), 'end': round(b, 3), 'duration': round(d, 3), 'action': f'trimmed to {KEEP:.2f}s (silence only)'})
    elif d >= 0.12:
        report.append({'start': round(a, 3), 'end': round(b, 3), 'duration': round(d, 3), 'action': 'kept'})
# apply cuts with 8 ms crossfades inside silence
segs, pos = [], 0
for c0, c1 in cuts:
    segs.append(x[int(pos * SR):int(c0 * SR)]); pos = c1
segs.append(x[int(pos * SR):])
fade = int(0.008 * SR); y = segs[0]
for s in segs[1:]:
    r = np.linspace(0, 1, fade, dtype=np.float32)
    y = np.concatenate([y[:-fade], y[-fade:] * (1 - r) + s[:fade] * r, s[fade:]])
def shift(t):
    removed = sum(c1 - c0 for c0, c1 in cuts if c1 <= t)
    return round(t - removed, 4)
for w in words: w['start'], w['end'] = shift(w['start']), shift(w['end'])
st = np.stack([y, y], axis=1)
wavfile.write(os.path.join(out, 'narration.wav'), SR, st.astype(np.float32))
json.dump({'source_take_sha256': hashlib.sha256(open(src, 'rb').read()).hexdigest(), 'cuts_s': [[round(a, 3), round(b, 3)] for a, b in cuts],
           'duration_s': round(len(y) / SR, 4), 'first_word_start': words[0]['start'], 'last_word_end': words[-1]['end'],
           'timing_basis': 'Scribe machine word times, shifted by trims; estimated, not manually verified', 'words': words},
          open(os.path.join(out, 'words.json'), 'w'), indent=0)
json.dump({'threshold_dbfs': THRESH_DB, 'flag_above_s': LIMIT, 'release_fail_above_s': 1.2, 'gaps': report}, open(os.path.join(out, 'gap_report.json'), 'w'), indent=1)
print(json.dumps({'cuts': cuts, 'duration': len(y) / SR, 'max_kept_gap': max(g['duration'] if g['action'] == 'kept' else KEEP for g in report), 'last_word_end': words[-1]['end']}))
