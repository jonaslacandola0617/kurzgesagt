# Optical and motion recovery checkpoint — 13 October 2026

The execution workspace disconnected after the 12.8-second test had rendered and passed its checks. This branch checkpoints the two tested core modules from the execution transcript. It is a recovery snapshot, not a completed integration into main. Recover and compare the local files before merging.

Completed in the workspace:
- Analyzed all three supplied tutorials using distributed frames, full-resolution instructional details and local ASR.
- Added opt-in timing, focus-hunt and radial chromatic controls; preserved original Pig War defaults.
- Produced 384 direct native 2160x3840 PNG frames at 30fps, H.264/AAC MP4, VP9/Opus WebM and a smaller 4K MP4.
- Source scan to explicitly labeled editorial transcription cut at rendered frame 298 (9.9333s). Driver peak 9.92s; sampled projected word-anchor peak 9.9424s, nearest frame also 298.
- Focus envelopes at 3.03–3.58, 5.13–5.61 and 9.22–9.77; 0/4/6/0 logical px. Maximum per-channel radial fringe 1.05 logical px. Local ink sampling 12fps; cameras/delivery 30fps.
- All three native movies fully decoded. Delivered MP4 audio -13.54 LUFS/-1.50 dBTP; WebM -13.53/-1.36.
- Four original Pig War native checkpoints matched exactly with optical treatment disabled.
- RGB reconstruction and edge-padding tests passed.
- Audio-only update preserved video-packet hashes in all three movies.
- Complete browser review export 12.955s, stereo audio, decoded successfully.
- Cache/reuse, audio remux, font rejection, visual changes and independent encoder-profile invalidation tests passed.
- Zero new image, speech or SFX generation requests; reused Voice A, approved artwork and 15 existing sound cues.
Owner creative review and independent word/headphone verification are not inferred from technical checks.

Tutorial sources:
1. 2d1cd47fc2ff47fef6364d87afb57220.mp4: 29.557s, focus hunting / Fast Box Blur.
2. 719b931f0927612a86eb7b988c09608c.mp4: 31.260s, cut at peak velocity and register inherited motion.
3. f1c5ee3e7479d70b0060bc80af8a330c.mp4: 30.150s, restrained chromatic edges, long settle, texture and visible 12fps treatment.
The last two revisit earlier T06/T10 documentation; this work applies their methods in actual motion. Exact proprietary Vox/AE parameter values were not recovered.

Expected local work:
- the channel/production/engine and production/episodes/tutorial-optics-test contain the complete integration.
- tutorial_optics_build/deliverables/Channel_Tutorial_Optics_Test_4K.mp4
- tutorial_optics_build/deliverables/Channel_Tutorial_Optics_Test_4K.webm
- tutorial_optics_build/deliverables/Channel_Tutorial_Optics_Test_Preview.mp4
- tutorial_optics_build/deliverables/Channel_Tutorial_Optics_Test_Studio.html
- tutorial_optics_build/qa contains actual verification reports and owned render frames.
- tutorial_optics_build/Channel_Engine_Project.zip and pig_war_engine/Channel_Engine_Project.zip packaging was started; completion/final content must be checked.

Resume:
1. Restore workspace access; check existing files before regenerating anything.
2. Preserve native encodes if present and passing. Do not rerender for packaging or source documentation changes.
3. Compare local modules with this snapshot; complete main integration including episode adapter, Bible implementation note, optional frame pass, two-pass audio helper and encoder-aware cache signature.
4. Repackage current source with governance documents, notices, QA and SRT. Do not publicly commit raw tutorial pixels, private textures, fonts, voice or movie assets.
5. Finish persistent saves and provide working direct downloads. A preview save was attempted after disconnect; its outcome must be resolved before retrying.
6. Existing source project is saved as Channel_Engine_Project.zip in the owner's files. New tutorial uploads are also retained. Use these if local assets need recovery.
7. After the owner reviews this test, continue the requested free, license-cleared SFX collection.

The original approved benchmark remains R2. New treatment is a technique review, not an automatically approved channel default.

## Recovery completed
The private saved project was restored after workspace maintenance. The full adapter and engine integration were rebuilt and verified. Native test encodes, browser export, codec/decode/loudness, original-default and cache checks passed; see OPTICS_TEST_VERIFICATION.json. Owner creative/listening approval remains pending.
