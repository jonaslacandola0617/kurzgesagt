# channel production engine v1.1

## Sun film production standard — owner adopted, 18 October 2026

The owner approved the complete Sun-disappearance film and explicitly ordered: “I WANT OUR FUTURE VIDEOS TO BE MADE EXACTLY LIKE THIS!” This replaces the temporary experiment and makes [the Sun film standard](../../production/standards/INHERITED_PRODUCTION_STANDARD.md) the current production baseline. Read it before new work. Use its image-led explanatory motion, 12fps scene/camera cadence inside native 1080×1920/30fps delivery, meaningful change about every 1.5–2s, photographic layers, animated the old headline display face keywords, centered Manrope captions, clean graphic supports, controlled material/optical finishing, natural Bernard, evolving original score, forward existing action SFX and exact 30fps legacy brand ending. Adapt the subject, composition, mechanism and music to the story. Preserve approved historical bytes.

New episode configs declare `production_standard: sun-disappeared-v1`, `scene_fps: 12` and an episode-relative `motion_review_targets` ledger. The shared renderer and validator implement this cadence; custom renderers follow [the integration guide](../../production/engine/SUN_STANDARD_INTEGRATION.md). Measured execution, owner creative approval and independent listening/source/caption checks remain separate. No new film is authorized merely by this infrastructure update.

## Default delivery — owner update, 17 October 2026

Native **1080 × 1920 at 30 fps** is now the standard final posting format. Use high-quality H.264 MP4 (12 Mbps target,16 Mbps peak ceiling) and AAC 48 kHz stereo 320 kbps.4K is optional when explicitly requested. Apply [the 1080p delivery standard](DELIVERY_1080P_STANDARD.md). Older mandatory 4K statements below are superseded for new production; historical exports remain unchanged. Keep all visual/audio/whole-film quality gates and immediate versioned GitHub archiving.

**Current governing direction: image-led sequences.** The owner's 14 October Astronaut R2 approval and `production/standards/IMAGE_LED_OWNER_DIRECTION.md` outrank older paper-dominant staging examples. Images show the narrated change; strong textures, decisive layered motion, forward reusable SFX, Bernard, original music, the old headline display face, centered Manrope captions and the exact legacy brand ending remain locked.


## Required visual art review — 14 October 2026
Before new science artwork, use [science paper/image art direction](../art-direction/SCIENCE_PAPER_IMAGE_STANDARD.md) and its shot contract. They operationalize the owner's existing direction: specific images, deliberate crop/hierarchy, distinct physical materials, strong source-local textures, repaired layers, refined printed figures and intentional intermediate states. Five demanding frames and the hardest moving join require explicit art review; manifest/codec passes are not art approval. No new film is authorized by an infrastructure review.

Working extraction of the approved Pig War implementation, not a new creative Bible. Shared browser functions preserve the existing pixel behavior. Original episode source and published movies remain untouched.

## Run

From the repository root, substitute the private project directory containing `assets/` and `baseline/`:

```bash
python3 production/engine/pipeline.py check --episode production/episodes/pig-war --project /absolute/private/pig_war_full --out /absolute/private/build
python3 production/engine/pipeline.py preview --episode production/episodes/pig-war --project /absolute/private/pig_war_full --out /absolute/private/build
python3 production/engine/pipeline.py render --episode production/episodes/pig-war --project /absolute/private/pig_war_full --out /absolute/private/build
python3 production/engine/pipeline.py package --episode production/episodes/pig-war --project /absolute/private/pig_war_full --out /absolute/private/build
```

`plan --profile native` reports `render`, `remux` or `reuse` without encoding. `audio` runs the episode's deterministic audio director through the shared decode/cue/normalization utilities. Voice generation is never implicit. `render --start 9.3 --seconds 1` creates explicitly named short native `Smoke` outputs; it never records a full-film render cache. `preview` without a range renders the complete 1080p film. Browser Studio opens directly from disk, without a server or network assets.

Dependencies: Python (NumPy/SciPy for audio), FFmpeg/ffprobe, Node, Playwright and Chromium. Set `CHANNEL_CHROME` or use `--chrome`; normal Chromium executables are detected. The Work runtime's Node/modules are used when available; ordinary Node/Playwright also work. Do not call external image/speech/SFX services during routine rebuilds.

## Shared versus authored

`browser/` owns runtime buffers, easing/drawing utilities, typography, captions, grain/material finishing, native focus, player and explicit HTML/CSS templates. `audio.py` owns sample decode, placement and mastering utilities. `tools/render.cjs` streams lossless RGBA pixels at fixed frame times. `pipeline.py` validates inputs, builds, tracks dependencies, encodes/remuxes and packages.

The episode owns data preparation, sourced geography, artwork registration, composition, objects, choreography, source labels, narration events, score direction and cue selection. `episode.json` declares those inputs. Required adapter functions: `renderScene(t)`, `furniture(t)` and optional `episodeMotionState(t)`. The supported v1 frame profile is 1080×1920 logical, native ×2, 30 fps. Materials use named `paper` and `ink` image slots. Data includes duration, phrase captions and episode-owned events. This is intentionally an extraction, not a universal declarative storyboard language.

## Cache correctness

Visual fingerprint includes build/input-inspection code, episode config/code/data, images, pinned fonts and timing. Audio fingerprint is the exact mixed WAV. Output hashes prevent trusting missing/corrupted cache files.

- Identical fingerprints and outputs: reuse.
- Same visual fingerprint, changed mix: copy encoded video packets and replace audio in MP4/WebM/download MP4.
- Timing, artwork, type or animation change: render visuals again.
- The audio stage has a separate fingerprint for its script, shared audio utilities, stems, cues and timing.

Encoder code has an independent render signature. Packaging-only edits do not invalidate picture renders.

Cache granularity is **whole visual render versus audio**, not per-shot frames. Per-shot transition dependencies and automated shot collision analysis are later extensions. v1 does not claim to shorten an uncached full native render; its gain is preventing unnecessary repeated work.

## Outputs and checks

Native `render` encodes H.264 CRF15/AAC 320k and VP9 CRF22/Opus 256k directly from the same native lossless RGBA frame stream. It also produces a CRF20 download MP4 with a runtime-based bitrate ceiling and an actual <512 MiB check. No 1080p upscale is used. Browser export is supported in the default 1080p studio; `?scale=2` is for native production capture and safely directs users back to standard preview for browser export. Browser exports are synchronized review copies; cadence depends on the device, and they do not replace the authoritative fixed-cadence masters.

Input checks include pinned font hashes, asset presence, caption order/bounds in time, 48k stereo PCM and matching audio/timeline duration. Encode checks independently validate resolution, codecs, frame count, duration, stereo/rate and full decode. These checks do **not** certify factual/rights review, exact spoken word alignment, caption/UI visibility, perceptual SFX quality, loudness or creative approval. Preserve the Bible's complete release gates and run full episode-specific encoded QA before release; never promote a technical pass to FINAL MASTER.

The WAV embedding contract currently requires a canonical 44-byte PCM16 stereo WAV. The audio stage produces it. Unexpected headers fail explicitly rather than being misread.

## Verification

See `VERIFICATION.json`: 22 exact native RGB checkpoints; 120 exact moving RGBA comparisons over three difficult transitions; unchanged authoritative mix and three stems; native three-format integration test; audio-remux video packet identity; cache/visual-invalidation/font-rejection checks; complete browser review recording with duration/audio validation. Sample comparisons are not a whole-film pixel certification or independent listening approval.

Private assets and generated studios/packages must never enter this public repository. `package` includes required private rebuild inputs and notices, not unrelated old assets or tutorial source pixels. The original Pig War private source bundle remains the historical baseline.

## Opt-in tutorial controls
See [tutorial integration](TUTORIAL_OPTICS_2026_10_13.md) and the tutorial-optics-test episode. These add timing curves, registered peak cuts, focus envelopes and padded chromatic separation. Original Pig War defaults remain unchanged. Two-pass audio normalization is available without changing the historical single-pass helper.

## Owner-locked ending and full paper/image profile
New episode manifests require brand_ending: brand-ending-v1, visual_style: image-led and material_profile: image-led-v1. Supply private paperFiber/plastic/photocopy image slots. The image-led directive makes photographs/cutouts the visual actors; paper, sources and necessary annotations support the explanation. Keep all motion, focus, material and sonic techniques where meaningful. Recipe strength and the shared ending are unchanged. Historical pig-war, tutorial-optics-test and legacy-ending-film manifests remain compatible for approved rebuilds. See ../standards/IMAGE_LED_OWNER_DIRECTION.md. Manifest checks do not certify subjective visual fidelity.

## Lossless transfer update — 13 October 2026
The frame streamer now reads native Canvas RGBA and transfers it with Blob/FileReader, avoiding browser PNG compression and encoder PNG decoding. Explicit BT.709 primaries and sRGB transfer tags preserve the former PNG metadata; output codec/quality settings are unchanged. Native source RGBA equality against PNG at three legacy brand states and decoded native H264 RGB equality at a mechanism state passed. See LOSSLESS_TRANSFER_QA.json. These are sample comparisons, not a whole-film perceptual certification.

## Adopted sequence-first implementation — 15 October 2026
Read [visual sequence direction](../art-direction/VISUAL_SEQUENCE_DIRECTION.md). Name each beat’s operation, resulting understanding and inheritance; review connected finished states before moving integration. Preserve approved-source rebuilds and existing art/audio/ending/native gates.

Engine enforcement: new manifests provide `sequence_contract_version: 1` and `sequence_contract` (episode-relative JSON). Input checks validate required decisions; browser moving builds require recorded owner sequence approval; native render requires moving-preflight approval. Existing approved episode sources without a new contract retain their original rebuild route. A reworked sequence uses a new episode ID or supplies a new contract. The validator checks records, not artistic merit.


## Rendered visual translation safeguard

Apply `production/art-direction/VISUAL_TRANSLATION_REVIEW.md` in full. The rejected Recorded Voice beatboard is not an approved benchmark. One demanding rendered passage and its comparison precede owner art approval and animation.


## Required finishing execution proof
Read [FINISHING_OUTPUT_CONTRACT.md](FINISHING_OUTPUT_CONTRACT.md). New image-led builds declare active material/optical finishing; native release verifies proof against the actual rebuilt studio. A profile label or imported effect is insufficient. Custom renderers use the same native picture/caption/ending proof contract. Wrinkled Fingers R1 exposed a custom-renderer bypass; R2 implements and demonstrates the missing grain, focus, transition and print treatment. Preserve historical approved source rebuilds and the exact ending.


## Pre-render pilot
See [pre-render workflow](../pre-render/README.md) and [five-project pilot](../pre-render/pilot-20261016/README.md). New pilot adapters bind `pre_render_manifest` relative to their episode folder. Native production checks the frozen package before build/encoding. Removing the binding from a registered pilot ID also blocks native production. Historical approved adapters without this field retain their existing route. Tests: `python3 -m unittest discover -s production/engine/tools -p test_pre_render.py -v`. This gate checks restored input bytes/records and renderer dependencies; owner artistic/listening approval and actual GitHub receipt verification remain human/source-backed duties.


## Finishing coverage and evidence
Use [FINISHING_CHECKLIST.md](FINISHING_CHECKLIST.md) for a short shot-specific coverage audit before capture and after encoding. `finishing_audit.py` rejects missing effect coverage, stale source/evidence hashes and unexplained exclusions; it does not infer artistic quality or listening approval. The cold-metal motion-v1 custom capture command calls its preflight before FFmpeg. Existing native-release validation remains independently required.
