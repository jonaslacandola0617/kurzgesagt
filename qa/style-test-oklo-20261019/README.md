# Oklo 12 s style test (2026-10-19)

Style test of the illustrated workflow, **not an episode, not a topic selection, not approved**.

- `oklo-style-test-preview-novoice.mp4`: picture, captions, original score and SFX; **no narration yet** (Bernard take not yet downloadable here). 1080×1920, 30 fps, 372 frames, 149 scene states (12/s), H.264 High yuv420p, AAC 48 kHz stereo, 12.4 s. sha256 `34c5ce2cade13481fc70ff6ef75891dd4afd5bc2aee9a6c3d52fba6289d6c914`.
- Narration planned: Bernard take `YsbpPU1Qo7w3mLeoY6rf` (11.36 s) at +0.25 s; captions and picture already timed to its Scribe word timestamps.
- Rebuild: `node capture.mjs <repo> <framesDir>`, `python3 mix.py <repo> <voice.mp3|none> <audioDir>`, loudnorm to −14 LUFS, encode per CLAUDE.md.
- See `motion-ledger.json` and `SFX_CUE_SHEET.json`.
