# Oklo pilot, low poly 3D, smooth 30fps (2026-10-19)

Owner authorised pilot reusing the Oklo topic. **Not an approved episode; no owner art, motion or full film approval.**

- `oklo-pilot-3d-30fps-novoice-v1.mp4`: 1080×1920, 30fps, 372 frames (all distinct), 12.4 s, H.264 High yuv420p, AAC 48 kHz stereo; −14.8 LUFS integrated, −1.5 dB sample peak. sha256 `deb37b7a56081e01ba39fce048197b4c662bd2729cd9b9f62bed6397788f71d0`. **No narration yet** (Bernard take `YsbpPU1Qo7w3mLeoY6rf` awaiting download); captions and picture are timed to its machine word timestamps (estimated, not verified).
- Determinism: random seek frames 7, 55, 150, 300, 371 byte identical to sequential capture.
- Rebuild from repo root after `npm install`: `node pilots/oklo-3d-20261019/capture.mjs . <framesDir>`; `python3 pilots/oklo-3d-20261019/mix.py . <voice.mp3|none> <audioDir>`; loudnorm I −14, TP −1.5; encode per CLAUDE.md.
- Assets: `assets/3d/` (owner's own low poly models, provenance in `ASSET_MANIFEST.json`); atoms, water, neutrons, mounds, strata built in code.
- See `motion-ledger.json`, `SFX_CUE_SHEET.json`.
