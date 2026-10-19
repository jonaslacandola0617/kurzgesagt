# Applying the owner-approved Sun standard

Authority: `production/standards/INHERITED_PRODUCTION_STANDARD.md`. Canonical ID:`sun-disappeared-v1`. This is a production preset and evidence workflow, not a universal Sun/Earth scene template.

For each new film, merge `production/templates/sun-standard/episode-standard.json` into its complete `episode.json`. Supply actual assets, fonts, data loader, scene scripts, finishing proof, sequence/review records and audio. The snippet and sample ledger are not a render-ready episode. Replace the example ledger with actual operation times and resulting understanding, set its duration to the decoded full-film timeline, and explain any interval longer than 2s. Do not change narration speed to fit this ledger.

The production CLI calls `production_standard.validate_standard` against the actual loaded timeline; it rejects an unknown preset, wrong resolution/cadence/ending, absent or malformed ledger, duration mismatch or an unexplained long hold. Ledger content participates in the visual fingerprint and frozen-package input closure. It verifies declared timing, not whether the claimed action is meaningful. Mandatory encoded review must establish that separately.

The shared browser `frame.js` uses quantized time for scene, image optics, film/material pass, captions and furniture. Exact brand ending and player clock use real output time. Audio remains real-time. The explicit historical-ID compatibility list preserves existing adapters without a declaration; a new episode ID without the preset fails the CLI. Unknown declarations fail. Every newly authored film must declare the preset. Custom Canvas/NAPI capture should use the same quantization shown in the approved immutable source at commit30cea6213c2d5a6005c8595ce1e8ddb21aaccdf2; the Sun artifact itself is not rewritten to import new infrastructure.

Custom renderers must also call existing finishing validation with resolution-matched proof, include the standards/ledger in frozen fingerprints, and save source before capture. Preserve image-led material slots, fonts and sequence/approval guards. Do not move captions before optical finishing or apply additional effects to the locked endcard. Background/audio output checks remain independent.

Verification commands from repository root:
```
python -m unittest discover -s production/engine/tests -p 'test_production_standard.py'
node production/engine/tests/sun-cadence.cjs
```
The browser VM regression exercises the shared frame dispatcher over the actual1485-frame benchmark duration: identical scene/camera/optical/material times within12fps buckets, real30fps brand time, deterministic seek, UI actual time and unchanged undeclared historical behavior. It does not render/inspect artwork or audition audio.

Finish each episode using the template RELEASE_CHECKLIST.md. Owner creative approval remains separate from independent listening, exact caption timing, rights and technical checks. No new asset generation, social posting or other episode production is triggered by installing this preset.


## Complete acceptance look-back — 18 October 2026
The owner reaffirmed the full eight-section acceptance list. Read production/templates/sun-standard/RELEASE_CHECKLIST.md and ACCEPTANCE_REQUIREMENTS.json: all 57 items plus reference-study obligations are explicit. Check every ID against the actual final encoded film after finishing and before a compliance claim. Require specific evidence/reviewer/timecodes; report unmet items. Detailed direct reference-channel viewing remains incomplete, covering premise, escalation, visual metaphors, typography, transitions and sound relationships. Owner approval does not certify that study. Compare available swipe-away, retention, watch-duration and engagement metrics at comparable ages only after publication. The original temporary experiment scope is preserved in the checklist provenance; later owner adoption of the film established the current craft baseline.
