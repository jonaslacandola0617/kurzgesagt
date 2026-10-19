# Oklo 12 s style test, low-poly 3D version (2026-10-19)

Style comparison against `../style-test-oklo-20261019/` (2D). **Not an episode, not a topic selection, not approved.**

- Same timeline, captions, keywords, labels, cue sheet and planned Bernard narration as the 2D test (see that folder's `motion-ledger.json`).
- Picture: three.js 0.180.0 (`package.json`), rendered in headless Chromium with SwiftShader (no GPU), composited onto a 2D canvas for the iris transition and overlays. Scene evaluated at 12 states/s, output 1080×1920 @ 30 fps.
- Macro scene: cutaway ground block with the owner's low-poly acacia, grass, scrub and rock models (`assets/3d/`, provenance in `assets/3d/ASSET_MANIFEST.json`); strata, groundwater band and ore seam built in code.
- Micro scene: nucleon clusters, water, neutrons, bubbles and rock grains built in code (low-poly icosahedra), not from the asset library.
- Capture: `node qa/style-test-oklo-3d-20261019/capture.mjs <repo> <framesDir>` from the repo root after `npm install`.
