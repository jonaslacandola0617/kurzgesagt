# Narration tail and final-word release gate
Adopted from owner feedback, 14 October 2026.

The owner reported the last spoken word of the published Astronaut Height film was clipped. Preserve that published file; do not silently re-render it. Its visual benchmark remains approved. Duration, decoder, waveform and loudness passes did not establish that every final word remained fully audible.

## Required checks
- Preserve the untouched generated narration and exact intended script. Determine the actual decoded source duration and the final spoken word, including its trailing consonants.
- Reconcile the whole script with the actual-audio transcript, explicitly including the closing sentence. Captions derived from an incomplete transcript cannot certify completeness.
- Set the film timeline from the complete narration plus deliberate closing hold and the locked endcard. Never cut speech to fit a previously chosen runtime.
- Preserve all narration samples unless a quiet-region edit was specifically measured and shown not to remove speech. Export/remux must use the resulting measured duration.
- Keep music/SFX fades separate from narration. No voice or master fade may make the final syllable/consonant inaudible.
- Allow at least 0.75 seconds after the complete decoded narration before the locked endcard starts unless a specifically reviewed intentional overlap is chosen. This is a conservative timing floor; it does not replace listening.
- Check the complete final caption, its reading hold, and the endcard handoff together.
- Audition the final 8–12 seconds of the actual encoded review and delivery copies through the complete final word and fade. Record whether the source, mix, captions and delivered ending passed. ASR recognition and silence measurements are separate machine checks, not an independent listening certification.
- Any truncated word, unfinished closing clause or premature fade is a release failure. Repair the source/edit and extend/re-time the ending instead of hiding the defect with music.
- Record narration SHA256, decoded duration, final word, final-word end timestamp (with its measurement basis), caption end, endcard start, film duration and listening-review status in NARRATION_TAIL_QA.json.

For new productions, apply this alongside NATIVE_RENDER_RECOVERY.md. Save the original narration and private asset project before expensive render work, then preserve verified render chunks and delivery receipts.
