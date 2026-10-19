# EPISODE_STATE: illustrated science trial

Updated 2026-10-19 (Asia/Manila). Working repo `jonaslacandola0617/kurzgesagt` (`main`). Workflow files inherited from the owner's previous channel repository (hashes in `MIGRATION_MANIFEST.json`); that repository was not modified. Previous brand identity removed from this repo at owner request on 19 Oct.

## Status
- Stage: 1, topic decision. **No topic selected.** No narration, artwork, score or film exists.
- Brand identity: **none defined** (name, tagline, palette, logo, ending, headline typeface all open).
- Approvals: none. Earlier channel approvals do not transfer.
- Local folder `D:\channel-animation` holds the original prompt plus copies of the root docs. This repo is the source of truth.

## Verified capabilities (tested 2026-10-19)
| Capability | Result |
|---|---|
| Deterministic frame capture | PASS. Playwright 1.56 + Chromium 1194 in cloud workspace. 60 frames at 1080×1920 gave exactly 24 scene states (3/2 holds); shuffled seeks matched sequential renders byte for byte; font loaded before capture. `qa/pipeline-test-20261019/` |
| FFmpeg encode/decode | PASS. ffmpeg 6.1.1: H.264 High, yuv420p, 30/1, AAC LC 48 kHz stereo 320k, faststart, clean full decode |
| Audio processing | PASS (technical). loudnorm + ebur128: −13.0 LUFS. numpy/scipy present; `soundfile`, `sox` missing (installable). No listening test |
| GitHub commit/push | PASS (admin/push, public repo) |
| GitHub Release upload | **BLOCKED for this session type** (HTTP 403 on Release create). Small outputs go in the repo; masters need owner upload or another permitted route |
| Browser preview | Built in browser pane reachable on owner PC but cannot open files/localhost from the cloud workspace. Review via hosted Artifact pages or GitHub; Playwright screenshots for frames |
| Owner PC shell | Linux VM on Windows: node 22, ffmpeg 4.4, python 3.10, git; no Chromium, no gh; 2 CPU / 2.8 GB. File handoff only |
| Narration | Previous narrator "Bernard" = ElevenLabs voice `QMJTqaMXmGnG8TCm8WQG` (eleven_v3), reachable in the connected ElevenLabs workspace as library voice "Clyde, Vintage Male Radio Announcer". No generation attempted |
| Word alignment | ElevenLabs transcription available; accuracy untested |
| Long unattended renders | Cloud container is ephemeral; no Actions workflow yet |
| Seeing/hearing output | Claude can inspect frames and measurements but cannot watch motion or listen; owner viewing and listening reviews are required |

## Assets in this repo
- Fonts `assets/fonts/`: Manrope, Manrope800 (OFL; licence text not yet added).
- SFX (synthesized/generated, not authentic recordings): `audio/sfx_v1` (50 cues, FLAC 48k/24, files renamed `SFX_*`), `audio/original-sfx-v1` (32 CC0 WAV + generator), `audio/generated-editorial-v1` (8 cues), `audio/free-editorial-20261013` (metadata and private fetch helper only; raw third party audio not redistributable).
- Research: `research/kurzgesagt-topic-study-20261018/` (findings and caption index; transcripts private, not copied).
- Reference: `reference/inherited-workflow/` engine (neutral ending stub), validators, delivery/recovery/archive standards, 57 item templates, caption standard, sequence method, motion research, Cold Metal pipeline example (no audio).

## Unresolved dependencies
1. **New brand identity:** owner to decide name, ending, palette and headline typeface, or to run without an ending for the trial.
2. **Narrator:** owner chose to keep Bernard (19 Oct); generated via the ElevenLabs connection. Audio download needs owner help or `storage.googleapis.com` allowed.
3. **Release archive:** Release creation blocked here; owner upload route needed before full film capture.
4. **Preset validator:** build `illustrated-science-trial-v1` declaration/validator in `src/` (the inherited Sun validator rejects other presets).
5. **Font licences:** add OFL text for Manrope; any new typeface needs owner approval.
6. **Reference study R.1/R.2** (frame by frame Kurzgesagt picture and sound study) OPEN; needs owner viewing notes since Claude cannot watch or listen. Kurzgesagt process page not fetched this session.
7. Install `soundfile`/`sox` when audio work starts.

## Visual reference review
**Supplied references found:** none visual (prompt only; no Project docs; no Kurzgesagt frames).
**Observed:** nine caption exports, text only (18 Oct): violated assumption → minimum mechanism → escalation through the same mechanism → second reveal changes the category → uncertainty restored → earned landing. No picture, motion, typography or sound observed. Kurzgesagt's public process description is carried forward from the brief, not re-read.
**Proposed (ours, not observed):** multi part vector assets with internal structure; consistent scientific colour roles; characters only as teaching devices; assembly, cross section, transformation, tracking and scale change with an invariant held across transitions; anticipation/arrival/hold grammar at 12 states/s; flat colour with selective depth; typography and sound families per episode. No claim to match Kurzgesagt's rigs, curves, layouts or mixes.

## Topic candidates (proposals, not selections)
1. **The reactor that breathed** (Oklo, Gabon): 2 billion year old natural fission reactors ran about 30 min on and 2.5 h off because their heat boiled away the water that sustained the chain reaction. Meshik et al. 2004 PRL 93:182302; U-235 ≈3% then vs 0.72% now (Shlyakhter). Caveat: impossible in natural ore today. **Recommended.**
2. **Mirror life:** a mirror image bacterium might evade immune systems and predators because recognition depends on molecular handedness. Adamala et al. 2024 Science, 10.1126/science.ads9158. Caveat: does not exist; expert risk assessment; at least a decade away; red lines debated.
3. **The day the Sun held still:** atmospheric tide resonance may have held the day near 19.5 h from ~2 to 0.6 billion years ago. Wu et al. 2023 Sci Adv 10.1126/sciadv.add2499; Mitchell & Kirscher 2023 Nat Geosci. Caveat: Farhat et al. 2024 A&A 684:A49 finds the torque insufficient.

## Pilot (owner decisions 19 Oct 2026, 19:49)
- Direction: low poly 3D with owner's asset library, smooth 30fps (12fps stepped rule retired), content in the Kurzgesagt approach; owner's two vertical references set the animation style only.
- Pilot: `pilots/oklo-3d-20261019/` reusing the Oklo topic (not an approved episode). Surface corrected for the era: bare rock, river, microbial mounds; the earlier style tests wrongly showed acacias and grass 2 billion years ago.
- Working repo rule: only `kurzgesagt`; other repos are read only sources to copy from.

## Style tests (2026-10-19)
- 2D illustrated: `qa/style-test-oklo-20261019/` (preview without narration archived).
- Low-poly 3D: `qa/style-test-oklo-3d-20261019/` using owner's own low-poly asset library (7 models copied to `assets/3d/`, renamed). Owner to compare and choose a direction.
- Bernard kept as narrator (owner, 19 Oct). Take `YsbpPU1Qo7w3mLeoY6rf` chosen for timing; download blocked here (storage.googleapis.com not allowed); owner to save it as `D:\channel-animation\style-test\bernard.mp3`.

## Full draft: The Nuclear Reactor Nobody Built (owner approved title 19 Oct 2026, 20:14)
- `episodes/nuclear-reactor-nobody-built/`: claims C01 to C10, script v1 (not owner approved), Bernard take do8dPOKUA9HSn4mT4IsL (silence trims only), scene, timeline, mix.
- **draft v1 MP4** sha256 `a8d5e4fe108a722217928e9434d0d898e57446075608f05593f322293d0fbb53`, 91.1 s, spec PASS (H.264 High yuv420p 30fps, AAC 48k 320k, faststart), −14.2 LUFS / −1.5 dBTP, clean decode, random seek identical (6 frames). Archived in two parts in `archive/` (LFS and Releases blocked; fresh download SHA verified at 163fea0).
- Known issues for owner review: REACTOR chip lags "stopped" and "ON AGAIN"; oversized orange ore glow in rhythm and today shots with weak caption contrast; caption overlaps lab monitor text near 6 s; final word may end abruptly (30 ms fade); captions estimated; ElevenLabs account warning.
- Approvals: none. Owner viewing and listening review pending.

## Next action
Owner selects a topic, decides narrator, and says whether brand identity work comes first. Then: `episodes/<slug>/claims.csv`, script draft, preset validator. No production before selection.
