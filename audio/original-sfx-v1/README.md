# the channel — Original Designed SFX v1

**32 original, deterministic designed audio cues**, 48 kHz stereo 24-bit WAV. This is an **editorial sound-design supplement** to the existing Google Drive recording library, NOT a set of authentic Foley recordings. It does not duplicate or redistribute any third-party downloaded sound file.

### Existing Drive library audit (file/folder metadata only)
The collection under \`SFX / Sounds Effects\` includes **120 named audio files**:
- 5 in SFX root and 14 in Sounds Effects root
- 5 keyboard, 6 bass drops, 6 wooshes, 5 clock recordings
- 26 root Mixkit entries and 53 across Mixkit's Suspense (3), Wooshes (6), Technology (24), Videogames (5), Ambient (7), People (4), Alarms (4) subfolders.

Strengths: wooshes, clocks, digital UI, mechanical keyboards, rain, city, crowd, basic alarms, traffic and bass impacts.

**Still missing/underrepresented**: narrative discoveries and emotional reveals, source/document movements, detailed procedural machinery, accurate mission/telemetry-inspired design, flexible tension beds, and meaningful cause/effect sound layers. Authentic recorded historical Foley remains a separate acquisition priority.

**Limitations:** Drive files were inventoried by provider filenames and sizes. Their actual sound quality, durations, waveforms, duplication and redistribution rights were not individually audited. Do not treat the 120 file listing as a completed listening review. Existing licensed assets remain in Drive.

### New original cue categories
32 sounds, four each:
- \`reveals\` — answer, ominous discovery, mystery question, earned resolution
- \`impacts\` — openings, serious consequence, evidence stamps, snapped mechanisms
- \`tension\` — short/long risers, subdued heartbeat design, accelerating countdown
- \`transitions\` — soft movement, camera travel, reverse pulls (not every scene)
- \`archival\` — **synthetic interpretations** of paper, document handling, pencil and projector
- \`mechanical\` — **synthetic interpretations** of ratchet, latch, gears, pressure
- \`telemetry\` — fictional pings, dropout, measurement mismatch and digital transfer
- \`ambience\` — low-profile control room, machinery and sustained textures

Use sounds to follow information and physical causes, not an arbitrary cue every two seconds. Prioritize stronger **emotional voice delivery** separately: sound effects cannot compensate for monotone narration. Verify synchronization to the actual narration voice master. Do not present the space/archival sound designs as actual recorded NASA or historic audio. The generator and generated WAVs are reusable in every film. Audition the tracks and listen to the final mix with headphones AND a phone before approval.

### Files
- \`wav/\`: 32 original 48k, 24-bit stereo WAVs
- \`CATALOG.csv\`, \`CATALOG.json\`: searchable, SHA256-verified cue manifest
- \`QA.json\`: automated peak/RMS/stream validation, explicitly not creative certification
- \`generate_sfx.py\`: deterministic recipe source (requires numpy scipy soundfile)
- A downloadable ZIP and audition WAV are on the GitHub tagged release.

### Rebuild
\`\`\`sh
python -m pip install numpy scipy soundfile
python production/audio/original-sfx-v1/generate_sfx.py
\`\`\`

### Rights
The new waveforms are **original mathematical synthesis** with no third-party sample pack, recording, soundfont, NASA audio or licensed field sound. See LICENSE.txt. Your existing stock sound recordings retain their original source licenses and are not included here.
