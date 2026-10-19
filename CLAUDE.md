# CLAUDE.md: illustrated science trial

Working repo for original, Kurzgesagt *inspired* illustrated science shorts (preset `illustrated-science-trial-v1`). The new channel has **no brand identity yet**: no name, tagline, palette, logo, ending or headline typeface. Do not invent one or reuse the previous channel's; ask the owner.
Full brief: `CLAUDE_PRODUCTION_PROMPT.md`. Read `EPISODE_STATE.md` before any work; it holds live status, decisions and the next action.

## Scope and authority
- **This is the only working repo.** Never edit, commit, push or open PRs in any other repository (`curio-bureau`, `kurzgesagt-v2`, `wordline-animation` or others); other agents work there. If something from another repo is needed, copy it into this repo and record its source commit and hash.
- `reference/inherited-workflow/` holds inherited production workflow (timing, audio, captions, QA, archive, engine). The previous brand identity was removed from it on 19 Oct 2026; leftover style rules there (photographic/image-led layers, paper and film finishing, Sun preset, "legacy brand" ending) do **not** apply. Where it conflicts with this file, this file wins. Do not edit it to change policy.
- Latest explicit owner instruction wins. No earlier approvals transfer to this channel.
- No topic is selected. Do not write final narration, polished art or a film until the owner selects one. A recommendation is not a selection.

## Visual direction
Original illustrated vector worlds are the primary picture: purpose built multi part assets, scientific colour roles chosen per episode, clear silhouettes, explanation through assembly, cross section, transformation, tracking and scale change. No photo collage, paper dominance or film/photocopy finishing by default; record any finishing used or NOT APPLICABLE with a reason. Typography is designed for this system; Manrope is the practical caption default until the owner approves otherwise. Declare `illustrated-science-trial-v1`, never the inherited Sun preset.

## Mandatory workflow rules
- Delivery 1080×1920, 30fps, H.264 High yuv420p, 12 Mbps target / 16 max / 24 buffer, AAC 48 kHz stereo 320 kbps, faststart. No upscale, no WebM renamed to MP4.
- Scene, camera, material and optics at 12 states/s: `sceneTime = floor((frame/30 + 1e-8) * 12) / 12`. Overlays use the scheduled state. Audio never quantized. An ending, once approved, runs on real 30fps output time.
- A meaningful explanatory change about every 1.5 to 2 s (relationship, transformation, consequence, evidence, viewpoint, connected cut). Caption swaps, texture crawl, idle drift do not count. Longer holds need a timecoded reason. Keep a motion ledger.
- Natural narration timing: actual decoded speech drives picture. Gaps 0.12 to 0.55 s normal; unplanned >0.85 s flag, >1.20 s release fail. Never speed speech. Protect final word plus 0.8 to 1.8 s tail.
- Captions: short phrases centred in the 42 to 58% band, crisp, no glow/halo/blurred duplicate/soft shadow backdrop. Estimated timing labelled estimated.
- Sound: original evolving score; existing SFX first (`audio/`, see `audio/docs/AUDIO_INVENTORY.md`); cue sheet; about −14 to −12 LUFS, ≤ −1 dBTP; owner listens to the encoded mix. Never add third party audio without redistribution rights.
- Separate owner reviews, each tied to exact artifact/version/hash: (1) art and sequence review of ≥5 finished states incl. narration hidden check and hardest transition; (2) moving preflight of the hardest passage with final art, real voice, music, SFX, captions; (3) complete encoded film against the 57 acceptance IDs in the brief. Never invent approvals or claim a film exists when only code exists.
- Research: claims ledger with primary source and location, evidence category, caveat, visual and confidence. Caveats survive into posts.
- GitHub (this repo) is the persistent store. Freeze/hash source before capture; archive every completed MP4, tests included, immediately; verify a fresh download and SHA-256; mark `ENCODED_ARCHIVE_PENDING` if archiving fails. Never commit secrets, third party transcripts or reference frames.

## Engine method and layout
Browser HTML/Canvas/SVG/JS. `renderFrame(frameIndex)` is pure: seeded randomness, no wall clock, fonts loaded before capture, seek equals sequential render. Player UI never appears in capture. Capture with Playwright Chromium in the cloud workspace, encode with FFmpeg. Proven pattern: `qa/pipeline-test-20261019/`.
Layout: `src/` renderer and episode modules, `assets/` fonts and designed parts, `audio/` cleared SFX, `research/`, `qa/`, `episodes/<slug>/` (claims.csv, script.md, episode.json, motion-ledger.json, captions.json, audio-cues.json, POSTS.md), `renders/` ignored.
