# GitHub export storage — owner directive, 15 October 2026

Status: ADOPTED. The owner explicitly directed that all the channel proprietary exports be included in the project's GitHub repository assets / Releases for persistent storage and backup. This supplements the native render recovery rules and supersedes the default use of Drive or chat file storage for proprietary outputs. It does not change artistic approvals, rights, or the locked render/audio standards.

## Mandatory render versioning — owner reinforcement, 17 October 2026

Applies to EVERY completed video render: full previews, revised previews, tests, native masters, posting copies and browser exports. The owner explicitly requires immediate GitHub archiving and version history, not merely occasional backups of approved finals.

1. **Checkpoint the source before capture.** Commit the exact source, timing, asset identities, voice/mix identities and render settings. Record the source commit in the render record. Do not start an expensive run from uncheckpointed creative work.
2. **Archive as soon as the encoder closes and basic integrity checks pass.** Hash and verify the completed output, then upload its actual bytes immediately. Do this BEFORE prolonged creative review, another render/revision, or ending the work turn. An unreviewed export is archived as unreviewed; owner approval is not a prerequisite for saving it.
3. **Give every changed render its own version.** Use an episode/revision/run tag and unique asset identity, for example `cold-metal/full/r02/render-001`. Record the previous version, reason for change, source commit, renderer/settings, output role, review status, byte size, SHA-256 and observed GitHub asset/download identifiers. Source code belongs in Git history; large video bytes belong in Release assets attached to that source version.
4. **Preserve prior versions.** Never replace/delete a delivered or reviewed asset, move its source tag, or reuse its URL for changed bytes. Keep rejected/superseded versions with accurate labels. Repair a broken link by retrieving archived bytes; an identical-byte reupload is a recovery action, not a creative rerender. Explicit owner instructions govern any deletion.
5. **Verify the archive.** Compare observed uploaded size/digest to the pre-upload local values; verify an unauthenticated download when sharing a public link. Commit the observed receipt and version relationship. A proposed URL, local log, source-only commit or expiring Actions artifact is not a saved movie.
6. **Stop on archive failure.** Record `ENCODED_ARCHIVE_PENDING`, explain the actual blocker and retain the local bytes. Do not call it delivered, start another expensive revision, or imply an unattended job will finish and notify the owner. Resume archiving the existing output as the next action. If the run is still active when a turn must end, save verified closed chunks and their receipts first; an active local process is not durable execution.
7. **Keep recovery bounded for previews as well as native renders.** Archive verified closed, expensive chunks at least every two chunks; pause capture if that checkpoint cannot be saved. Do not let parallel workers accumulate an unprotected whole film. This is a workflow obligation; the existing local preview scripts do not yet provide an authenticated automatic Release uploader. Do not claim automatic upload merely because this rule exists.

Completion states are separate: `ENCODED_ARCHIVE_PENDING` → `ARCHIVED_UNREVIEWED` → `REVIEWED` → `OWNER_APPROVED` where applicable. A saved test remains a test; a complete episode requires the whole-film preview and independent quality gates. Every version stays traceable and recoverable.

## Required storage
- Commit source code, reusable original assets appropriate for Git, scripts, captions/posts, rights records, small QA and hash manifests.
- Attach large proprietary outputs as assets of a versioned GitHub Release: master MP4, posting MP4, native WebM, browser player, original export packages, and expensive render recovery bytes where appropriate.
- Use an episode/revision tag, such as water-wrinkled-fingers-r2. Describe review status honestly: a review release is not owner approval or a social-media publication.
- Actions artifacts are build transport, not the sole archive: they expire. Promote required outputs to Release assets before declaring durable delivery.
- Keep each Release asset below GitHub's current per-file limit (under 2 GiB at adoption). Split larger recovery files with ordered parts and whole/part hashes. A manifest referencing missing local bytes is not a backup.
- GitHub remains the primary archive for proprietary exports. Do not introduce a different primary storage destination without owner direction. Existing backups remain intact; this directive does not authorize their deletion.
- Respect existing item-level rights and privacy for third-party raw assets, reference tutorials, credentials and signed URLs. Publish original/cleared export media with required attribution; don't silently turn a nonredistributable reference into a public raw asset.

## Delivery gate
1. Check repository identity, export hash, revision, native format and actual QA.
2. Check the destination Release and existing assets before uploading; avoid duplicating uncertain writes.
3. Upload actual bytes, not a progress record or a link to temporary storage.
4. Read back asset ID, name, uploaded state, byte size and digest where available. Retain receipts in the episode delivery manifest.
5. Verify downloads against SHA-256 when the provider does not expose a matching digest.
6. Return only observed Release/download URLs. Keep local evidence until the archive and links are verified.
7. If upload/authentication is unavailable, say archive pending; do not claim the export is backed up. Offer the existing review copy without falsely calling its temporary link permanent.

## Recovery
Pin source/mix fingerprints and exact frame coverage. Save closed, verified lossless render chunks to GitHub Release assets at least every two chunks; stop accumulating unprotected work if saving fails. A lossy native recovery proxy can be retained as an explicitly labeled additional fallback, but must never be called lossless or silently substituted into the final master pipeline.

## Platform references checked at adoption
- https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases
- https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository

Review: Jonas Lacandola / owner direction in conversation, 15 October 2026. Implemented as Bible v1.4.5, storage-only amendment.

