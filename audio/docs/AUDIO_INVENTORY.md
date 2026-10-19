# the channel Audio Assets — Canonical Use and Provenance

**Last updated:** 11 October 2026. These assets **supplement** the approved the channel Master Bible v1.2. The Bible's voice-first timing, audible music and accurately synchronized recorded SFX rules still govern every episode.

## Use this production order

1. **Primary original SFX Pack v1 (50 cues):** [Audio catalog](../../audio/sfx_v1/CATALOG.csv) · [Audition MP3](../../audio/sfx_v1/SFX_V1_AUDITION.mp3) · [Download WAV ZIP (GitHub)](the source repository). Fifty originally synthesized editorial, archive, mechanical, science, camera/motion, cinematic, and ambient sounds. Source is repo `audio/sfx_v1/` in lossless 48kHz/24-bit stereo FLAC; WAVs are in the release. Generator and cross-episode scoring guide: [SFX direction](../audio-sfx-v1/SOUND_DIRECTION_GUIDE.md); [audit](../audio-sfx-v1/LIBRARY_AUDIT.md); [source generator](../audio-sfx-v1/generate_pack.py).
2. **Experimental alternative Pack v1 (32 cues):** [Catalog](original-sfx-v1/CATALOG.csv) · [Download 32-WAV ZIP](the source repository). Additional synthesized prototypes useful for variation and testing; audio at `production/audio/original-sfx-v1/wav/`. [Generation QA](original-sfx-v1/QA.json). These are NOT 32 unique acoustic events proven absent from the 50-cue pack; treat them as alternate designs, not an independently validated expansion in sonic coverage.
3. **Existing third-party audio in Google Drive:** `SFX` > `Sounds Effects` > `Mixkit SFX (new)` and adjacent root sound folders, catalogued by file name as 120 existing assets. Sound recordings remain in Drive because third-party redistribution permission was not established; per-file licensing and sound audition remain to do.

## Which pack should future episodes use?
**Start with the primary 50** and select sound based on visible mechanism, scene environment and narration word-event, not file popularity. Audition both candidate files and their context in the mix. Optionally consider the 32 experimental sounds where needed to vary the sonic language. For physically crucial historical objects use real rights-cleared Foley from Drive or new recordings, not a synthetic paper or machinery cue falsely presented as a real archival capture. Never call a scientifically invented telemetry ping genuine NASA audio.

### Sound-direction creative gate
User feedback on Episode 008: animations and presentability were good, but **narration lacked emotional rise and excitement**, with insufficient well-placed physical sound details. Fix this with voice-directed emphasis, dramatic pacing on accurate claims, composed melodic score and materially synchronized SFX. More booms alone cannot replace narration acting. Mix voice, music, physical Foley, editorial punctuation, ambience separately. Phone and headphones subjective listening of final MP4/WebM is required before FINAL approval.

### Rights and QA clarity
- Both sound packs are newly algorithmically synthesized. They embed no downloaded stock recordings, but should still be listened to for sonic character.
- Automated WAV/FLAC file probes, nonempty signals, sample-rate/bit-depth checks and catalog hashes passed for both.
- **No independent human full-speed audition or real recorded Foley quality certification has occurred**, so neither pack should be represented as a professionally sound-approved sample library.
- Both packs were generated via separate workflows; do not automatically mix their names, catalog hashes or versions.
- Existing uploaded Mixkit, Freesound, and creator-labeled samples are source-owned third-party media, and *must not be added to public GitHub without explicit redistribution rights.*

### Links
- [Primary WAV ZIP (50)](the source repository)
- [Primary audition MP3](the source repository)
- [Experimental WAV ZIP (32)](the source repository)
- [Experimental audition WAV](the source repository)

## Owner directive, 12 October 2026
Reuse existing sound libraries before generating new effects. [Approved generated editorial cues](../../audio/generated-editorial-v1/README.md) now preserve the Pig War R2 sounds. Every new generated SFX must be saved, indexed and pushed for reuse.

## Vox sound research, 13 October 2026
Use the [source-backed research and audition brief](VOX_SOUND_RESEARCH_2026_10_13.md) when selecting the next recorded Foley additions. It separates historical creator testimony, provider claims, third-party tutorial techniques and original channel criteria. Music editing, material fit and timing are assessed together. No new downloaded pack or exact Vox sample matches have been certified by this research pass.

## Owner-retained free collection — 13 October 2026
All 70 auditioned sounds were retained by the owner. Use the [catalog and private retrieval helper](free-editorial-20261013/README.md) for future episodes before generating new effects. Metadata and hashes are committed; raw third-party audio remains private due to source redistribution restrictions.
