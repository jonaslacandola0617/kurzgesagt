# the channel — VOX MOTION MASTERY LAB
**Research status: direct decoded analysis of nine USER-SUPPLIED, LOW-RESOLUTION TikTok reference clips; not nine verified original Vox master videos.**

**Evidence keys:** [F] directly observed decoded video frames; [S] computed audio-signal measurements (NOT listened to); [M] ffprobe metadata or decoded-frame counts; [I] estimated/inferred animation rig/easing; [P] proposed original channel implementation. Third-party clips can show genuine working After Effects UI but do NOT establish the authoring recipe of original Vox films.

# 02 — FRAME-SEQUENCE MOTION FORENSICS (35 SHORT X-RAYS)
**Method:** 35 spans, 7 actual decoded frames per span, across all 9 references. Frame strips in `../frames/XRAY_[clip]_[window].jpg`; per-video overview in `../frames/XRAY_[clip]_SHEET.jpg`. Each observed timing is from the downloaded video, not a Vox project file. Normalized storyboard keyframes below are **[P] proposed reconstructions**; actual AE keyframe curves are unknown unless visible in tutorial UI.

**Normalized geometry:** `x,y` in logical 1080×1920 equivalent for portrait clips (landscape: normalized unit-square preserving original aspect); `scale` relative to an independent subject/camera anchor. For a typical 2s animated shot, example authored camera states: t=0 at (540,960,s=1), t=.25 at (540,954,s=1.07), t=.5 at (542,950,s=1.22), t=.75 at (545,948,s=1.36), t=1 at (547,948,s=1.4). **This is an implementation starting point, not a measured Vox keyframe profile.** Acceleration should be validated by image tracking and playback.

### X01 — 0711d05c, 0.00–0.95s (cutout entry)

**[F] Evidence:** 7 decoded frames spaced 0.158s, with a start and end at 0.000/0.950. Stored internal strip `XRAY_0711d05c_00.jpg`. The wider context is in the clip's full contact sheet.

- **T01 — Staggered high-contrast headline reveal.** Observed: Sequential yellow-backed word groups establish a large editorial question; text occupies different sized blocks. Estimated/inferred layers: Editable outlined display type on independent animation tracks; masks per phrase. Proposed timing: animate opacity/translation in ~3 staggered clusters, 4–9 frames apart; ease-out to 100%. channel adaptation: Preserve real the old headline display face headlines, do not copy yellow Vox wordmark.
- **T02 — Taped-cutout photographic framing.** Observed: Cutout portrait sits over a bright rectangular paper insert with visible tape edges. Estimated/inferred layers: Portrait mask; paper rectangle and tape shadows as separate layers. Proposed timing: portrait mask stays anchored while headline enters; subtle camera offset (<3%). channel adaptation: Use original historical portrait and paper scraps with source marks.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X02 — 0711d05c, 1.35–2.25s (paper relocation)

**[F] Evidence:** 7 decoded frames spaced 0.150s, with a start and end at 1.350/2.250. Stored internal strip `XRAY_0711d05c_01.jpg`. The wider context is in the clip's full contact sheet.

- **T01 — Staggered high-contrast headline reveal.** Observed: Sequential yellow-backed word groups establish a large editorial question; text occupies different sized blocks. Estimated/inferred layers: Editable outlined display type on independent animation tracks; masks per phrase. Proposed timing: animate opacity/translation in ~3 staggered clusters, 4–9 frames apart; ease-out to 100%. channel adaptation: Preserve real the old headline display face headlines, do not copy yellow Vox wordmark.
- **T02 — Taped-cutout photographic framing.** Observed: Cutout portrait sits over a bright rectangular paper insert with visible tape edges. Estimated/inferred layers: Portrait mask; paper rectangle and tape shadows as separate layers. Proposed timing: portrait mask stays anchored while headline enters; subtle camera offset (<3%). channel adaptation: Use original historical portrait and paper scraps with source marks.
- **T03 — Historical sculpture as editorial counterpoint.** Observed: Greyscale sculpture/photo anchors lower-right while headline and document graphics evolve. Estimated/inferred layers: Foreground cutout keyed from archive with source asset and soft local shadow. Proposed timing: hold eye on figure, move typography relative to it over 0.6–1.4s. channel adaptation: Adapt with subject-specific objects, not repeated classical statues.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X03 — 0711d05c, 2.90–4.25s (type and logo)

**[F] Evidence:** 7 decoded frames spaced 0.225s, with a start and end at 2.900/4.250. Stored internal strip `XRAY_0711d05c_02.jpg`. The wider context is in the clip's full contact sheet.

- **T03 — Historical sculpture as editorial counterpoint.** Observed: Greyscale sculpture/photo anchors lower-right while headline and document graphics evolve. Estimated/inferred layers: Foreground cutout keyed from archive with source asset and soft local shadow. Proposed timing: hold eye on figure, move typography relative to it over 0.6–1.4s. channel adaptation: Adapt with subject-specific objects, not repeated classical statues.
- **T04 — Paper/desk prop replacement.** Observed: Page scene transforms to tablet and editing icon framed by notebook, pen and sticky note. Estimated/inferred layers: Independent prop sprites with shadow/edge masks. Proposed timing: motivated hard cut at 4.2; tablet pushes, annotation follows. channel adaptation: Change mechanism to subject evidence, not CapCut CTA.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X04 — 0711d05c, 4.45–6.20s (screen replacement)

**[F] Evidence:** 7 decoded frames spaced 0.292s, with a start and end at 4.450/6.200. Stored internal strip `XRAY_0711d05c_03.jpg`. The wider context is in the clip's full contact sheet.

- **T04 — Paper/desk prop replacement.** Observed: Page scene transforms to tablet and editing icon framed by notebook, pen and sticky note. Estimated/inferred layers: Independent prop sprites with shadow/edge masks. Proposed timing: motivated hard cut at 4.2; tablet pushes, annotation follows. channel adaptation: Change mechanism to subject evidence, not CapCut CTA.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X05 — 2101ba3e, 0.30–1.80s (paper typography)

**[F] Evidence:** 7 decoded frames spaced 0.250s, with a start and end at 0.300/1.800. Stored internal strip `XRAY_2101ba3e_00.jpg`. The wider context is in the clip's full contact sheet.

- **T05 — Deep headline camera crop.** Observed: Camera travels from full article toward oversized headline and low-resolution portrait. Estimated/inferred layers: Paper plane, source article, figure crop; parent camera with local figure scale. Proposed timing: camera scale estimated 1→2.3 over ~1.5s then continue to 3+; introduce edge defocus. channel adaptation: Add focused evidence and source framing without copying named outlet layout.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X06 — 2101ba3e, 1.65–3.85s (article kinetic crop)

**[F] Evidence:** 7 decoded frames spaced 0.367s, with a start and end at 1.650/3.850. Stored internal strip `XRAY_2101ba3e_01.jpg`. The wider context is in the clip's full contact sheet.

- **T05 — Deep headline camera crop.** Observed: Camera travels from full article toward oversized headline and low-resolution portrait. Estimated/inferred layers: Paper plane, source article, figure crop; parent camera with local figure scale. Proposed timing: camera scale estimated 1→2.3 over ~1.5s then continue to 3+; introduce edge defocus. channel adaptation: Add focused evidence and source framing without copying named outlet layout.
- **T06 — Paper grain anchored to document coordinates.** Observed: Grain remains associated with paper rather than a floating screen overlay during camera shift. Estimated/inferred layers: Texture mapped in page UV; paper grain, edge speckle and ink as separate channels. Proposed timing: texture follows page 1:1 transforms; paper edge shadow remains dynamic. channel adaptation: channel archival paper textures must have source-specific wear and crisp type.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X07 — 2101ba3e, 3.80–6.50s (paper depth motion)

**[F] Evidence:** 7 decoded frames spaced 0.450s, with a start and end at 3.800/6.500. Stored internal strip `XRAY_2101ba3e_02.jpg`. The wider context is in the clip's full contact sheet.

- **T05 — Deep headline camera crop.** Observed: Camera travels from full article toward oversized headline and low-resolution portrait. Estimated/inferred layers: Paper plane, source article, figure crop; parent camera with local figure scale. Proposed timing: camera scale estimated 1→2.3 over ~1.5s then continue to 3+; introduce edge defocus. channel adaptation: Add focused evidence and source framing without copying named outlet layout.
- **T06 — Paper grain anchored to document coordinates.** Observed: Grain remains associated with paper rather than a floating screen overlay during camera shift. Estimated/inferred layers: Texture mapped in page UV; paper grain, edge speckle and ink as separate channels. Proposed timing: texture follows page 1:1 transforms; paper edge shadow remains dynamic. channel adaptation: channel archival paper textures must have source-specific wear and crisp type.
- **T07 — Camera reset from macro to evidence whole.** Observed: Tight text crop rapidly returns to complete newspaper then cuts to creator. Estimated/inferred layers: Camera parent transform and photographic flattening of focus planes. Proposed timing: jump/whip of camera focal target and decrease scale over 0.4–0.8s. channel adaptation: Use for fact verification after dramatic micro focus.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X08 — 2101ba3e, 20.80–23.80s (AE camera stages)

**[F] Evidence:** 7 decoded frames spaced 0.500s, with a start and end at 20.800/23.800. Stored internal strip `XRAY_2101ba3e_03.jpg`. The wider context is in the clip's full contact sheet.

- **T08 — Perspective-mapped newspaper plane.** Observed: After Effects demonstration reveals planar newspaper with perspective/transform handling. Estimated/inferred layers: 2D plane with 3D transform or homography plus shadow layer. Proposed timing: y-rotation/scale of page tied to parent camera; pin center stays stable. channel adaptation: Use own legal/source-backed document sheet.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X09 — 228c142a, 0.00–1.55s (archival to car)

**[F] Evidence:** 7 decoded frames spaced 0.258s, with a start and end at 0.000/1.550. Stored internal strip `XRAY_228c142a_00.jpg`. The wider context is in the clip's full contact sheet.

- **T09 — Photograph-to-mechanism match cut.** Observed: Sepia car photograph is exchanged for isolated red performance car over road/sky. Estimated/inferred layers: Mask vehicle silhouette, ground line, sky layer and a period photo. Proposed timing: hard cut synchronized to content change; continuity is shared vehicle horizontal axis. channel adaptation: Translate via subject-specific evidence-to-reconstruction transition.
- **T10 — Object anchored split-field documentary layout.** Observed: Car remains visual anchor between blue-sky top and warm paper lower third. Estimated/inferred layers: Moving object, matte for terrain strip, top/bottom content fields. Proposed timing: small lateral vehicle travel while type reveals in secondary space. channel adaptation: Use with legal/cultural/machine subjects only when split is motivated.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X10 — 228c142a, 1.35–2.65s (car-plane switching)

**[F] Evidence:** 7 decoded frames spaced 0.217s, with a start and end at 1.350/2.650. Stored internal strip `XRAY_228c142a_01.jpg`. The wider context is in the clip's full contact sheet.

- **T09 — Photograph-to-mechanism match cut.** Observed: Sepia car photograph is exchanged for isolated red performance car over road/sky. Estimated/inferred layers: Mask vehicle silhouette, ground line, sky layer and a period photo. Proposed timing: hard cut synchronized to content change; continuity is shared vehicle horizontal axis. channel adaptation: Translate via subject-specific evidence-to-reconstruction transition.
- **T10 — Object anchored split-field documentary layout.** Observed: Car remains visual anchor between blue-sky top and warm paper lower third. Estimated/inferred layers: Moving object, matte for terrain strip, top/bottom content fields. Proposed timing: small lateral vehicle travel while type reveals in secondary space. channel adaptation: Use with legal/cultural/machine subjects only when split is motivated.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X11 — 228c142a, 3.15–4.90s (circle tracked title)

**[F] Evidence:** 7 decoded frames spaced 0.292s, with a start and end at 3.150/4.900. Stored internal strip `XRAY_228c142a_02.jpg`. The wider context is in the clip's full contact sheet.

- **T10 — Object anchored split-field documentary layout.** Observed: Car remains visual anchor between blue-sky top and warm paper lower third. Estimated/inferred layers: Moving object, matte for terrain strip, top/bottom content fields. Proposed timing: small lateral vehicle travel while type reveals in secondary space. channel adaptation: Use with legal/cultural/machine subjects only when split is motivated.
- **T11 — Hand-circled headline emphasis.** Observed: Yellow freehand oval animates around italic History label. Estimated/inferred layers: Stroke reveal / source outline and variable-width path. Proposed timing: draw path from 0 to 100% over ~0.5s then hold briefly. channel adaptation: Original annotation geometry; no copied Vox title art.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X12 — 228c142a, 7.50–10.50s (photographic dossier)

**[F] Evidence:** 7 decoded frames spaced 0.500s, with a start and end at 7.500/10.500. Stored internal strip `XRAY_228c142a_03.jpg`. The wider context is in the clip's full contact sheet.

- **T12 — Evidence board collage with physical stickers.** Observed: Photographs, Ferrari marker, archival document and red hand annotations coexist. Estimated/inferred layers: Independent archival sprites, paper clipping masks, taped labels and scribble overlays. Proposed timing: arrive by hard cut, then card/annotation stages staggered over 1–3s. channel adaptation: Use citations and prioritize causal evidence over visual clutter.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X13 — 2d1cd47f, 0.00–0.95s (title build)

**[F] Evidence:** 7 decoded frames spaced 0.158s, with a start and end at 0.000/0.950. Stored internal strip `XRAY_2d1cd47f_00.jpg`. The wider context is in the clip's full contact sheet.

- Motion family: visible composition transition; inspect strip for exact balance of camera and object movement. Do not infer a unique filter merely from its appearance.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X14 — 2d1cd47f, 1.65–4.45s (parallax location)

**[F] Evidence:** 7 decoded frames spaced 0.467s, with a start and end at 1.650/4.450. Stored internal strip `XRAY_2d1cd47f_01.jpg`. The wider context is in the clip's full contact sheet.

- **T13 — Depth plane grids beneath a large title.** Observed: Dark perspective grid recedes below bright italic headline. Estimated/inferred layers: Grid as projected plane; large title in camera-facing HUD plane. Proposed timing: grid y-perspective fixed while headline scales/offsets minimally. channel adaptation: Better applied to explained spatial systems, not generic decoration.
- **T14 — Map/photo insert on a receding plane.** Observed: Textured aerial insert and location label float over dark grid. Estimated/inferred layers: Aerial rectangle cutout, grid depth plane and label/arrow screen plane. Proposed timing: aerial expands independently; arrows/labels held in screen-space. channel adaptation: Use real geospatial map instead of generic raster.
- **T15 — Tracking-frame kinetic typography.** Observed: Corner brackets tighten around Focus HUNTING title. Estimated/inferred layers: Four independent line corners, clip reveal of cyan/black text. Proposed timing: staggered bracket inward move then title scale from 0.94 to 1.0. channel adaptation: Adapt to channel Manrope utilities and the old headline display face title hierarchy.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X15 — 2d1cd47f, 4.25–5.70s (typographic lock)

**[F] Evidence:** 7 decoded frames spaced 0.242s, with a start and end at 4.250/5.700. Stored internal strip `XRAY_2d1cd47f_02.jpg`. The wider context is in the clip's full contact sheet.

- **T15 — Tracking-frame kinetic typography.** Observed: Corner brackets tighten around Focus HUNTING title. Estimated/inferred layers: Four independent line corners, clip reveal of cyan/black text. Proposed timing: staggered bracket inward move then title scale from 0.94 to 1.0. channel adaptation: Adapt to channel Manrope utilities and the old headline display face title hierarchy.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X16 — 2d1cd47f, 12.00–16.80s (AE blur technique)

**[F] Evidence:** 7 decoded frames spaced 0.800s, with a start and end at 12.000/16.800. Stored internal strip `XRAY_2d1cd47f_03.jpg`. The wider context is in the clip's full contact sheet.

- **T16 — Camera-depth blur applied via adjustment layer.** Observed: UI visibly demonstrates After Effects Fast Box Blur above layers. Estimated/inferred layers: Adjustment layer covering selectively masked background, depth bands. Proposed timing: blur radius linked to camera focus progress; subject stays sharp. channel adaptation: Prefer controlled optical depth to blur just for decoration.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X17 — 32cec3f2, 0.00–5.75s (bridge long hold)

**[F] Evidence:** 7 decoded frames spaced 0.958s, with a start and end at 0.000/5.750. Stored internal strip `XRAY_32cec3f2_00.jpg`. The wider context is in the clip's full contact sheet.

- **T17 — Foreground occlusion establishing urban depth.** Observed: Real bridge framed between close masonry walls; bright callout held on bridge. Estimated/inferred layers: Real footage with near-brick foreground and distant bridge. Proposed timing: camera relatively static; static composition derives depth from occlusion. channel adaptation: Use foreground architecture silhouettes around main subject.
- **T18 — Landmark distance marker compositing.** Observed: Cloud-obscured skyline marker sits at skyscraper scale. Estimated/inferred layers: Source footage and tracked white/gold numeric label. Proposed timing: stable label for 1+sec, hard landmark cut; no unmotivated motion. channel adaptation: Place labels on true geolocations with readable scale.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X18 — 32cec3f2, 5.40–11.00s (sky building cut)

**[F] Evidence:** 7 decoded frames spaced 0.933s, with a start and end at 5.400/11.000. Stored internal strip `XRAY_32cec3f2_01.jpg`. The wider context is in the clip's full contact sheet.

- **T17 — Foreground occlusion establishing urban depth.** Observed: Real bridge framed between close masonry walls; bright callout held on bridge. Estimated/inferred layers: Real footage with near-brick foreground and distant bridge. Proposed timing: camera relatively static; static composition derives depth from occlusion. channel adaptation: Use foreground architecture silhouettes around main subject.
- **T18 — Landmark distance marker compositing.** Observed: Cloud-obscured skyline marker sits at skyscraper scale. Estimated/inferred layers: Source footage and tracked white/gold numeric label. Proposed timing: stable label for 1+sec, hard landmark cut; no unmotivated motion. channel adaptation: Place labels on true geolocations with readable scale.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X19 — 32cec3f2, 11.00–16.50s (park title hold)

**[F] Evidence:** 7 decoded frames spaced 0.917s, with a start and end at 11.000/16.500. Stored internal strip `XRAY_32cec3f2_02.jpg`. The wider context is in the clip's full contact sheet.

- Motion family: visible composition transition; inspect strip for exact balance of camera and object movement. Do not infer a unique filter merely from its appearance.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X20 — 37901357, 0.00–2.55s (newspaper spatial entry)

**[F] Evidence:** 7 decoded frames spaced 0.425s, with a start and end at 0.000/2.550. Stored internal strip `XRAY_37901357_00.jpg`. The wider context is in the clip's full contact sheet.

- **T19 — Source-page expansion into full-frame evidence.** Observed: Tilting New York Times page grows into camera crop, foreground boxing imagery fills view. Estimated/inferred layers: Article as photographic plane, masks separate boxer/print. Proposed timing: camera 1→~1.7 and rotates toward page normal over ~2s. channel adaptation: Original channel source must keep provenance and physical paper geometry.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X21 — 37901357, 2.50–4.25s (Ali cutout integration)

**[F] Evidence:** 7 decoded frames spaced 0.292s, with a start and end at 2.500/4.250. Stored internal strip `XRAY_37901357_01.jpg`. The wider context is in the clip's full contact sheet.

- **T19 — Source-page expansion into full-frame evidence.** Observed: Tilting New York Times page grows into camera crop, foreground boxing imagery fills view. Estimated/inferred layers: Article as photographic plane, masks separate boxer/print. Proposed timing: camera 1→~1.7 and rotates toward page normal over ~2s. channel adaptation: Original channel source must keep provenance and physical paper geometry.
- **T20 — Frame-by-frame rough-ink oval.** Observed: Purple irregular oval and underline trace named Ali in article. Estimated/inferred layers: Stroke path duplicated, varied displacement/turbulent edge. Proposed timing: path trim 0→100% then seed/evolution subtle over hold. channel adaptation: Use trace to direct attention, never hide factual text.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X22 — 37901357, 3.70–6.90s (handdrawn underline)

**[F] Evidence:** 7 decoded frames spaced 0.533s, with a start and end at 3.700/6.900. Stored internal strip `XRAY_37901357_02.jpg`. The wider context is in the clip's full contact sheet.

- **T20 — Frame-by-frame rough-ink oval.** Observed: Purple irregular oval and underline trace named Ali in article. Estimated/inferred layers: Stroke path duplicated, varied displacement/turbulent edge. Proposed timing: path trim 0→100% then seed/evolution subtle over hold. channel adaptation: Use trace to direct attention, never hide factual text.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X23 — 37901357, 22.00–27.50s (roughen edges workflow)

**[F] Evidence:** 7 decoded frames spaced 0.917s, with a start and end at 22.000/27.500. Stored internal strip `XRAY_37901357_03.jpg`. The wider context is in the clip's full contact sheet.

- **T21 — Roughen Edges procedural stroke.** Observed: AE UI shows a Roughen Edges effect being applied to annotation layer. Estimated/inferred layers: Outlined stroke/shape alpha fed through roughening operation. Proposed timing: contour complexity and scale tuned, keep base line width readable. channel adaptation: Implement displacement of authored vector path, not a copy of author drawing.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X24 — 66980986, 0.00–6.25s (typewriter intro)

**[F] Evidence:** 7 decoded frames spaced 1.042s, with a start and end at 0.000/6.250. Stored internal strip `XRAY_66980986_00.jpg`. The wider context is in the clip's full contact sheet.

- **T23 — Typewriter premise and delayed response.** Observed: Client/Me type appears character-by-character on textured black. Estimated/inferred layers: Mask reveal over monospaced text, background texture plane. Proposed timing: 0–5s stepped letter count, cursor/horizontal spacing retained. channel adaptation: Use sparingly; 6s of text-only hook risks weak first-frame retention.
- **T24 — Newspaper/photo cutout with marker arrow.** Observed: Musk greyscale silhouette intersects yellow-highlighted New York Times story. Estimated/inferred layers: Subject mask placed on paper document; handline curved arrow follows content. Proposed timing: subject pop then annotation path over ~1s, camera pull for context. channel adaptation: Use source photos legally, original channel arrow graphics.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X25 — 66980986, 6.20–11.70s (Elon newspaper reveal)

**[F] Evidence:** 7 decoded frames spaced 0.917s, with a start and end at 6.200/11.700. Stored internal strip `XRAY_66980986_01.jpg`. The wider context is in the clip's full contact sheet.

- **T23 — Typewriter premise and delayed response.** Observed: Client/Me type appears character-by-character on textured black. Estimated/inferred layers: Mask reveal over monospaced text, background texture plane. Proposed timing: 0–5s stepped letter count, cursor/horizontal spacing retained. channel adaptation: Use sparingly; 6s of text-only hook risks weak first-frame retention.
- **T24 — Newspaper/photo cutout with marker arrow.** Observed: Musk greyscale silhouette intersects yellow-highlighted New York Times story. Estimated/inferred layers: Subject mask placed on paper document; handline curved arrow follows content. Proposed timing: subject pop then annotation path over ~1s, camera pull for context. channel adaptation: Use source photos legally, original channel arrow graphics.
- **T25 — Archival person-to-illustration transition.** Observed: Suit figure and Edison portrait swapped with line drawings and signature motif. Estimated/inferred layers: Separated portrait layer, icon lineart, flat colored paper shapes. Proposed timing: foreground silhouette acts as visual anchor across sudden background changes. channel adaptation: Map subject portrait to lineart only with informed archival sourcing.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X26 — 66980986, 11.50–18.75s (Edison montage)

**[F] Evidence:** 7 decoded frames spaced 1.208s, with a start and end at 11.500/18.750. Stored internal strip `XRAY_66980986_02.jpg`. The wider context is in the clip's full contact sheet.

- **T24 — Newspaper/photo cutout with marker arrow.** Observed: Musk greyscale silhouette intersects yellow-highlighted New York Times story. Estimated/inferred layers: Subject mask placed on paper document; handline curved arrow follows content. Proposed timing: subject pop then annotation path over ~1s, camera pull for context. channel adaptation: Use source photos legally, original channel arrow graphics.
- **T25 — Archival person-to-illustration transition.** Observed: Suit figure and Edison portrait swapped with line drawings and signature motif. Estimated/inferred layers: Separated portrait layer, icon lineart, flat colored paper shapes. Proposed timing: foreground silhouette acts as visual anchor across sudden background changes. channel adaptation: Map subject portrait to lineart only with informed archival sourcing.
- **T26 — Photo + typographic source collage.** Observed: Historical paper, Edison Electric Light title and lamp emblem form a dossier card. Estimated/inferred layers: Paper stock, image clipping masks, black printed label and icon separate. Proposed timing: two-stage layering and relative scale hold, avoid continuous random floats. channel adaptation: Original subject-specific document collages with citation region.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X27 — a2553b8f, 0.00–2.70s (Capitol parallax and serif)

**[F] Evidence:** 7 decoded frames spaced 0.450s, with a start and end at 0.000/2.700. Stored internal strip `XRAY_a2553b8f_00.jpg`. The wider context is in the clip's full contact sheet.

- **T27 — Independent Capitol dome and typographic layer motion.** Observed: Huge Vox type moves behind Capitol skyline, architectural dome partly occludes letters. Estimated/inferred layers: Dome / facade / sky / word / contrast background as distinct layers. Proposed timing: camera pushes ~1→1.2 while letters drift at a different rate from building. channel adaptation: Original subject architecture and channel headline fonts replace Vox mark.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X28 — a2553b8f, 3.75–6.50s (flat-vs-layer demo)

**[F] Evidence:** 7 decoded frames spaced 0.458s, with a start and end at 3.750/6.500. Stored internal strip `XRAY_a2553b8f_01.jpg`. The wider context is in the clip's full contact sheet.

- **T28 — Counterexample-driven flat-vs-depth contrast.** Observed: Same subject against a flat black background feels inert vs layered original, flagged BORING. Estimated/inferred layers: A/B split scenes, identical foreground object, variable background/mattes. Proposed timing: synchronized comparison keeps subject screen position; removes depth selectively. channel adaptation: Use as internal QA drill, not a repeated edit in all episodes.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X29 — a2553b8f, 10.80–15.15s (graphic comparison)

**[F] Evidence:** 7 decoded frames spaced 0.725s, with a start and end at 10.800/15.150. Stored internal strip `XRAY_a2553b8f_02.jpg`. The wider context is in the clip's full contact sheet.

- **T29 — Figure/chart contrast hierarchy.** Observed: Dollar portrait and blue/purple data lines compare distracting white plane to nuanced gray. Estimated/inferred layers: Cutout engraved portrait, graph line layers, backdrop separate. Proposed timing: chart stays sharp while background defocus changes, line remains focal. channel adaptation: Use data diagrams that explain real grounded values.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X30 — a2553b8f, 23.00–29.00s (layer architectural depth)

**[F] Evidence:** 7 decoded frames spaced 1.000s, with a start and end at 23.000/29.000. Stored internal strip `XRAY_a2553b8f_03.jpg`. The wider context is in the clip's full contact sheet.

- **T30 — Architectural photo-card sequencing.** Observed: Independent Capitol photos on colored rectangular cards stack/scale before full-bleed architecture. Estimated/inferred layers: Four separate photo planes with matte background and shadows. Proposed timing: sequential offset, slight overlap and axis alignment, camera lands on full-width plate. channel adaptation: channel maps/archival works must serve topic not mimic specific Capitol footage.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X31 — aeed0471, 0.00–2.80s (article editorial attention)

**[F] Evidence:** 7 decoded frames spaced 0.467s, with a start and end at 0.000/2.800. Stored internal strip `XRAY_aeed0471_00.jpg`. The wider context is in the clip's full contact sheet.

- **T32 — Text highlight tracked to article wording.** Observed: Yellow strip follows headline as camera closes on embedded article beneath large circular Vox graphic. Estimated/inferred layers: Tracked highlight rectangle beneath typeset words, paper image and camera. Proposed timing: reveal/highlight attaches to article coordinates while camera changes. channel adaptation: Use muted gold anchored source highlight; never replace source text.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X32 — aeed0471, 3.10–5.80s (step one and typographic emphasis)

**[F] Evidence:** 7 decoded frames spaced 0.450s, with a start and end at 3.100/5.800. Stored internal strip `XRAY_aeed0471_01.jpg`. The wider context is in the clip's full contact sheet.

- **T33 — Numbered instructional step transition.** Observed: Oversized numeral 1 and emphatic NOT static hierarchy appear over dim article texture. Estimated/inferred layers: Big type parent with document background and mask block. Proposed timing: staged numeral, short word emphasis and evidence reveal. channel adaptation: Avoid numbering every channel story or repeating the same title-slide pattern.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X33 — aeed0471, 6.80–11.00s (second visual step)

**[F] Evidence:** 7 decoded frames spaced 0.700s, with a start and end at 6.800/11.000. Stored internal strip `XRAY_aeed0471_02.jpg`. The wider context is in the clip's full contact sheet.

- **T34 — Typography + article texture as alternating focus.** Observed: Numeral 2 and the photographed document alternate dominance across a tonal split. Estimated/inferred layers: Paper texture plane, masked article, giant serif numeral. Proposed timing: shift opacity and camera focal priority in step with claim. channel adaptation: Use original legible the old headline display face numbers and Manrope notes.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X34 — aeed0471, 15.70–19.20s (third highlighter)

**[F] Evidence:** 7 decoded frames spaced 0.583s, with a start and end at 15.700/19.200. Stored internal strip `XRAY_aeed0471_03.jpg`. The wider context is in the clip's full contact sheet.

- Motion family: visible composition transition; inspect strip for exact balance of camera and object movement. Do not infer a unique filter merely from its appearance.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

### X35 — aeed0471, 20.00–24.10s (question-to-photo)

**[F] Evidence:** 7 decoded frames spaced 0.683s, with a start and end at 20.000/24.100. Stored internal strip `XRAY_aeed0471_04.jpg`. The wider context is in the clip's full contact sheet.

- **T35 — Question-mark mask to concentrate source detail.** Observed: A large ? masks visual context then the full document is restored. Estimated/inferred layers: Vector punctuation mask, paper as nested content, graded backing. Proposed timing: letter silhouette wipe 0→full opacity; restore via cut/reverse crop. channel adaptation: Use original infographic symbols with real narrative need.

**[I] How to isolate motion:** track 2–3 stable features of the background against the subject; if both displace identically infer camera/global transform. If foreground outline and document text diverge, model separate layers or nested cameras. Check line aliasing and text legibility at each quarter beat.

**[P] Frame/state drill:** 0% show recognizable source subject → 25% introduce the target/annotation → 50% move camera or mask while maintaining eye path → 75% reveal the editorial point → 100% settle composition and leave a transition anchor. Do not mechanically use all five stages when the observed sample demonstrates a held frame instead.

## Quantified feature-tracking cross-check [M/I, conservative]

Each 7-frame window was passed through ORB keypoint extraction and partial-affine RANSAC correlation from first to middle and first to last frame at reduced analysis resolution. **A fitted affine matrix is NOT necessarily the camera motion:** it can follow foreground art, the page surface or a person. Bad fits often indicate cuts, variable depth, source texture loss or independent layers. No invented 3D camera track should be inferred from low-confidence values.

| Window | Clip | Estimate first → last | Fit confidence | Interpretation |
|---|---|---|---|---|
| X01 | 0711d05c | scale=1.178, rotation=-0.35°, normalized Δ=[-0.096, -0.113], 71/119 inliers | MODERATE_GLOBAL_FEATURE_AFFINE | Possible global planar movement; still not proof of parent camera rather than page plane |
| X02 | 0711d05c | 6/88 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X03 | 0711d05c | 5/64 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X04 | 0711d05c | 6/84 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X05 | 2101ba3e | 5/97 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X06 | 2101ba3e | 5/84 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X07 | 2101ba3e | 6/72 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X08 | 2101ba3e | scale=0.876, rotation=2.31°, normalized Δ=[0.07, 0.233], 75/128 inliers | MODERATE_GLOBAL_FEATURE_AFFINE | Possible global planar movement; still not proof of parent camera rather than page plane |
| X09 | 228c142a | 6/72 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X10 | 228c142a | 7/68 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X11 | 228c142a | 5/64 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X12 | 228c142a | 5/78 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X13 | 2d1cd47f | scale=1.003, rotation=-0.02°, normalized Δ=[0.045, -0.001], 43/86 inliers | LOW_GLOBAL_FEATURE_AFFINE | Do not assign to camera without subject/background feature isolation |
| X14 | 2d1cd47f | 6/93 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X15 | 2d1cd47f | 16/103 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X16 | 2d1cd47f | 5/37 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X17 | 32cec3f2 | 4/33 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X18 | 32cec3f2 | 7/83 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X19 | 32cec3f2 | 6/53 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X20 | 37901357 | 5/110 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X21 | 37901357 | 6/114 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X22 | 37901357 | 5/95 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X23 | 37901357 | 6/101 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X24 | 66980986 | 3/82 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X25 | 66980986 | 4/68 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X26 | 66980986 | 7/70 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X27 | a2553b8f | 4/73 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X28 | a2553b8f | 6/67 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X29 | a2553b8f | 4/51 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X30 | a2553b8f | 4/78 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X31 | aeed0471 | 7/66 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X32 | aeed0471 | 5/69 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X33 | aeed0471 | 5/93 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X34 | aeed0471 | 5/60 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |
| X35 | aeed0471 | 4/73 inliers; unreliable | LOW_SCENE_CUT_OR_TEXTURE_POOR | Do not assign to camera without subject/background feature isolation |

The stronger observations include `X01` (`0711d05c`, 0–0.95s) ~1.178× global feature scale with a translation of [-0.096,-0.113] of analysis image dimensions; `X08` (`2101ba3e`, 20.8–23.8s) ~0.876× with +2.31° inferred in-plane rotation; `X13` (`2d1cd47f`, 0–0.95s) ~1.003× (low confidence). **32/35 windows were too internally complex or insufficiently trackable to claim a single coherent transform.** Use original layer authored keyframes instead of forcing unreliable motion extraction.