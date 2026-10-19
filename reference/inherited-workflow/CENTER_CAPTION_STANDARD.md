# the channel — CAPTIONS IN THE CENTRAL SAFE AREA
**Authoritative channel production correction — 2026-10-10**

## Problem to prevent
Episode 006 burned subtitles near the bottom of the 9:16 frame. TikTok and YouTube Shorts interface elements (captions, account info, action controls, descriptions, and navigation) can obscure them. A readable movie file is not necessarily readable inside the platform interface.

## Binding placement rules for ALL subsequent episodes
- Primary burned-in captions must occupy the **CENTER REGION of the 9:16 picture**, not the bottom UI zone. Aim for the central 42–58% of total frame height, adapting to the subject and the number of caption lines. For a 2160×3840 master this nominal zone is about y=1613–2227; for 1080×1920 logical design, about y=806–1114. These are starting points, not a substitute for actual overlay checks.
- Center-align on the horizontal axis unless an editorial composition specifically requires a nearby central alignment. Use Manrope in short readable phrase groups, high contrast, and a restrained outline or shaded support where necessary.
- **Build the animation around the caption area**: move important faces, vehicles, maps, numbers, diagrams and crucial evidence away from it. Never merely move captions over important explanatory content.
- Do not let primary narration captions drift into TikTok's lower-left metadata or right-side buttons, or YouTube Shorts' lower description and right-side action stack. Provide platform-specific safe-zone previews.
- Check a still frame at a real phone preview size **with a TikTok UI overlay and a YouTube Shorts UI overlay** for every distinct caption arrangement. QA fails if any subtitle is obscured, competes with essential visual material, is clipped, or is too small.
- Burn this placement into **both actual 2160×3840 30fps H.264 MP4 and VP9 WebM**. The 1080p derivative, if any, must preserve relative central placement.
- Derive captions from the exact final voice and verify alignment; no estimated phrase timing may be labeled as fully word-aligned.
- Caption position and clarity are actual encoded-film QA gates, not source-code assurances.

## Audio and export parity — existing critical safeguards
- Record inter-passage gaps from the isolated narration stem; normal breathing room about 0.12–0.55s, unplanned >0.85s editorial FAIL, >1.20s release FAIL even if music masks the pause.
- Never pad scene slots or speed up voice to hide a mismatch; ripple edit the picture and effects to real measured narration.
- BOTH exported release videos must be real native 2160×3840, 30fps, narration/music/SFX/burned captions. An upscaled or 1080p MP4 is not a 4K MP4.
