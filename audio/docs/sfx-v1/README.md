# the channel — Original Editorial SFX Pack v1
**50 original sound-design cues · FLAC PCM24 48 kHz stereo · reproducible synthesis.**

## Start
1. Read [existing-library audit](LIBRARY_AUDIT.md) — approximately 120 owned/collected Google Drive sound files inventoried by metadata (not auditioned).
2. Read [sound direction and cues](SOUND_DIRECTION_GUIDE.md) — how to increase emotion and impact without burying narration.
3. Browse `audio/sfx_v1/CATALOG.csv` after build; each row records duration, purpose, category, sample format, measured peak/RMS and SHA256.
4. Download `audio/sfx_v1/SFX_V1_AUDITION.mp3` for a quick demo and the **GitHub Release WAV ZIP** for editing in any NLE.
5. Rebuild using `pip install numpy scipy soundfile && python production/audio-sfx-v1/generate_pack.py`, with FFmpeg installed. The pack's generator is deterministic for each filename.

## Contents
- **Editorial (8):** discovery, doubt, reveal, resolve, narrative turn
- **Archive (8):** page/paper, photo, stamp, pencil, typewriter, reel
- **Mechanical (8):** screw jack, steel, gear, wood, wheel, cable
- **Science (8):** telemetry, radio, radar, mismatched units, signals
- **Motion (7):** map, parallax, document focus, transition accents
- **Cinematic (6):** softer consequence hits, resolution, suspense
- **Ambiences (5):** loopable fictional newsroom/mission/workshop/air textures

**All cues are original synthetic designs, not field recordings.** Do not present any as authentic NASA transmissions, actual nineteenth-century machinery, or real rooms. These are modest reusable layers and require human arrangement with emotional narration and musical direction to become engaging.

## Copyright and provenance
No third-party audio from the user's connected Drive collection is copied to this repository or SFX pack. Source for generated sounds is the checked-in Python DSP generator. Existing Mixkit, Freesound and other downloaded recordings may be licensed for inclusion in videos but not rehosting/redistribution; source and right checks happen per asset.

## Build and release
`.github/workflows/channel-sfx-v1-build.yml` generates, probes, verifies, commits lossless FLAC assets to the official repository and creates the downloadable WAV ZIP as a GitHub prerelease. A pass certifies signal integrity, **not** perceptual sound-design sophistication. Future iterations should incorporate authentic original Foley recordings and a human audition result.

This pack **supplements** the channel Bible v1.2. It does not alter the approved channel identity or production rules.
