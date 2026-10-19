# Durable native render recovery

## Default delivery — owner update, 17 October 2026

Native **1080 × 1920 at 30 fps** is now the standard final posting format. Use high-quality H.264 MP4 (12 Mbps target,16 Mbps peak ceiling) and AAC 48 kHz stereo 320 kbps.4K is optional when explicitly requested. Apply [the 1080p delivery standard](DELIVERY_1080P_STANDARD.md). Older mandatory 4K statements below are superseded for new production; historical exports remain unchanged. Keep all visual/audio/whole-film quality gates and immediate versioned GitHub archiving.

Owner adopted: 14 October 2026. Storage route amended by owner on 15 October 2026: see GITHUB_EXPORT_STORAGE.md.

## Required production sequence
1. Pin the owner-approved scene/manifest/source/mix hashes, native resolution, fps, frame count, fonts and encoder profile before rendering. Reuse approved sources; a resolution rebuild must preserve art, soundtrack, captions and locked ending.
2. Capture native frames in bounded, integer-indexed chunks. Use at most two browser capture workers and no more than 80 frames per instance unless memory testing justifies another limit. Store active work in the conversation workspace rather than /tmp where practical. Workspace files are not a substitute for durable saves.
3. Close each lossless intermediate; verify its resolution and decoded frame count. Record start_frame/count, SHA256, pinned source fingerprints and successful verification in a local manifest immediately.
4. Save the actual verified chunk bytes to GitHub Release assets for proprietary render outputs (subject to item-level rights), as well as recovery records to Git. A log of completed frames is not a saved render. Split a large chunk into ordered pieces below the upload limit if necessary; retain each part checksum, size and durable file identity. Join raw parts in order and check the reconstructed chunk checksum before use.
5. Only mark a chunk DURABLE after every part has a successful save receipt. Link those durable identities into the public repository recovery manifest without signed URLs, credentials, private raw assets or restricted stock. Distinguish pending, locally verified, durable, encoding and final verified statuses.
6. Checkpoint at least every two completed chunks. If no durable save succeeds for a prolonged period, prevent unbounded capture from making a large amount of unprotected progress. Never overwrite an active encoding output or ambiguously retry an uncertain file mutation.
7. On resume, resolve the current source identity and checkpoint. Materialize durable chunks, check all hashes/counts and exact contiguous coverage of [0,total_frames). Render only missing or invalid ranges; regenerate assets/audio only when the approved source actually changed.
8. Encode final formats from native lossless frames and the exact approved mix. Completed native chunks protect expensive capture even if the final encoder must restart.
9. Verify final dimensions/fps/frame count/duration/codecs, full decode, audio levels/headroom and final hashes. Save final files and receipts before offering download links.
10. Keep recovery chunks until all final deliverables are durably saved and verified. Cleanup requires an explicit retention policy; do not delete recoverable evidence merely because encoding started.

## Storage roles
Git: approved source code, renderer and recovery scripts, small manifests, source/output hashes, frame ranges, durable file identities, approvals, profile settings and recovery instructions.
GitHub Release assets: proprietary native lossless chunks (or split parts), source mixes and final encoded videos; verify actual uploaded bytes and record receipts. Restricted third-party raw assets retain their existing permitted storage. Actions artifacts are temporary transport, not the sole archive.
Runtime workspace: active rendering, local working copies and disposable caches.

Git alone does not preserve an already-computed render when its manifest references only local paths. Do not commit large native movie chunks or private/restricted assets into public Git.

## Honest progress
Report measured verified frame counts, actual save statuses and actual encoder/QA results. A running cloud process is not a guarantee of continued execution through environment loss. A local file is not a completed delivery.


The later owner directive in GITHUB_EXPORT_STORAGE.md governs proprietary export storage. Do not use Drive or chat storage as the sole archive for these outputs. A native CRF15 recovery proxy is lossy and never equivalent to a saved lossless chunk.
