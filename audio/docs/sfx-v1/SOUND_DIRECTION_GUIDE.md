# the channel SFX v1 — Editorial Sound Direction and Implementation
**Status:** First-party original designed sound library to supplement (NOT replace) existing recordings.
**Creative production reference:** `production/MASTER_PRODUCTION_BIBLE.md` v1.2 and `production/bible/v1.1/08_AUDIO_AND_CAPTION_BIBLE.md`.

## Why this exists
Episode 008's user review praised video/graphics/SFX but found narration emotionally flat and overall excitement weaker than hoped. This pack adds deliberately structured accents to land information: curiosity, discovery, mechanism, hidden contradiction, and earned payoff. **The voice still needs a director**. Do not use loud SFX as a substitute for expressive narration or melodic scoring.

## The the channel "dramatic audio arc"
- **0–1s FIRST-FRAME PHYSICAL FACT:** real environment or one restrained editorial transient; immediately recognizable, never a fixed logo swoosh.
- **1–5s UNANSWERED QUESTION:** narrow ambience, signal/paper movement timed to an object's action; limit distracting frequency buildup around intelligible speech.
- **5–20s CONTEXT:** credible scene-specific low ambience and source handling; use silence intentionally and retain voice clarity.
- **20–45s MECHANISM:** independently cue working parts and feedback (small motors, paper, wires, rotating gear); sound follows *the mechanism*, not arbitrary scene boundaries.
- **45–65s CONTRADICTION/TURN:** selective moment of stronger punctuation and harmonic score shift timed precisely to a consequential word.
- **65–END PAYOFF:** gentle resolution, short voice-led tail. No 4-second empty outro.

## Sound buses
`VOICE / MUSIC / AMBIENCE / PHYSICAL FOLEY / EDITORIAL INFORMATION / TRANSITION / SUB-IMPACT / MASTER`.

These are **recommended starting-level ranges**, NOT mixing presets:
- Dialogue first; measure and critically audition the final mix at phone volume.
- Ambience typically ~−28 to −37 dBFS under voice (context dependent).
- Tiny document/UI sounds ~−22 to −30 dBFS perceived while speaking.
- Important selective info punctuations ~−15 to −24 dBFS peak in relevant band (adjust for device).
- Cinematic sub transients restrained and EQ-limited so they don't bury the first syllable.
- Score must remain clearly audible with thematic development and correct voice ducking.
- Final encode target generally −14 to −12 LUFS and ≤−1 dBTP, with human headphone/phone listening QA.

## Trigger rules
For EACH sound, cue sheet must state: `sound_id, asset_file, narrative_word_id, animation_event_id, onset_time, duration, purpose, mix_bus, gains, edit notes, source/license`.
- Start physical sound on physical contact/launch/lock: typically exact cue, often no more than ±1–2 frames unless prelap motivated.
- Archive page rustle travels with moving/source-local paper planes.
- A `unit_mismatch` cue should accent the newly visible wrong units; don't play an irrelevant sci-fi laser.
- No automatic whoosh on every camera zoom; score and physical motion may be enough.
- Avoid >2 identical SFX motifs within 15 sec unless intentionally recurring as a storytelling clue.
- Give important narrator emphasis room: accent may lead by 50–120ms or follow by a beat, not mask the crucial noun/number.
- Use gain automation and spectral ducking where necessary. Mix SFX stem independently.
- Listen to VO + effects + music after final codec encodes; don't judge from solo sounds alone.

## Asset truth and licensing
All 50 cues were generated from our original waveform synthesis code and do not include third-party download audio. Even the "paper" and "mechanical" names indicate a *designed impression*, not field-recorded authenticity; use authentic recorded Foley from Drive where licensed and narratively important. `science` cues are fictionally designed UI/telemetry **not authentic NASA space instrument sounds**. `ambient` cues are synthetic imaginary spaces, not real geographic places.

File format in source repo: lossless **FLAC PCM 24-bit / 48 kHz stereo**. Main GitHub branch contains `audio/sfx_v1/CATALOG.csv`, `CATALOG.json`, `BUILD_QA.json`, per-category audio and one `SFX_V1_AUDITION.mp3`. Release also contains uncompressed 48 kHz/24-bit WAV ZIP. All source sample spectra and code are auditable in `production/audio-sfx-v1/generate_pack.py`.

## QA gates
Each pack file must decode as 48 kHz stereo 24-bit, have finite samples, peak <= -1 dBFS, nonzero RMS, artifact-free fade/tail and authentic filename/hash catalog metadata. Loops need sample-continuous seam checked in code AND audition. The generator's signal checks cannot replace hearing. User approval: audition the reel and select which design sounds are genuinely interesting; refine weak cues later.

## Search and use
Use `CATALOG.csv` to filter by `category` and `usage`. Copy a sound into episode build assets by tracked source path and record its ID + hash; do not pull a random matching filename from Drive. No unnecessary stereo widening on speech; do not normalize ambience to be as loud as impacts.

## Priority future additions
Real paper/metal/wood Foley, human reactions/crowds with privacy/rights, real room tones, science and vintage technology evidence recordings, soundtrack micro-stems, and professionally voiced emotional narration. These are not fabricated as already solved by this starter library.
