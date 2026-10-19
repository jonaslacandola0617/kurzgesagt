# 10 — channel Motion Graphics Engine v2 (original reference implementation specification)

**Pure absolute-time interface, independent transformations:**
```js
const scene={
 fps:30,duration:3.4,
 camera:{transform:t=>matrix(t)},
 world:{parts:[{id:"main",parent:null,local:t=>matrix(t),geometry:originalPath}]},
 masks:[{owner:"main",z:5,shape:originalContour}],
 annotations:[{owner:"main",anchorLocal:[0.32,0.41],sourceId:"evidence1"}],
 caption:{coordinateSpace:"screen",safeBand:[0.42,0.58]},
 events:[{id:"evidence_read",time:1.4,claimId:"fact_001",sfxEventId:null}]
};
function renderFrame(frame) {
 const t=frame/scene.fps; const s=evaluateAbsolute(scene,t);
 drawGraphics(s); drawOcclusion(s); drawAnchors(s);
 drawScreenCaptions(s); // NEVER transform with world camera
}
```

**Projection:** `screenPoint = viewport × camera(t) × sourceParent(t) × graphicLocal(t) × pointLocal`. Every anchor must recompute when the camera or parent changes. Mask and type stay in their own coordinate spaces. Fixed screen captions never inherit virtual-camera zoom.

**Data fill:** for stable item order `order(i)`, `active_i(t) = clamp((p(t) - order(i)*stagger)/revealLength)`. Never randomize data membership per frame; measured values must match source. Draw explicit threshold only after underlying graphical evidence is legible.

**Causal link:** edge progress `clamp((t - edgeOnset)/drawDuration)` becomes positive only once start+end node have source-attached geometry. Compute arclength along original drawn path; don't animate an unrelated decorative arrow.

**Physical scale:** `fillHeight = (reading-min)/(max-min)*scaleHeight`, source bounds and units verified. Number/tick and cursor independent of mask timing, synchronized to actual narration word if available.

**Machine:** parents for frame/housing, local crank/rod/piston, link constraints, contact/hinge surfaces and independent shading. Demo-04 is a mechanical *neutral proof* not a photographic artifact nor historically accurate machine.

**Testing:** `setTime(t)`, `setFrame(f)`, `renderFrame(f)`, `getDuration()` with repeatable static frame endpoints. Assert finite matrices, known source-anchor projected pixel error ≤1px, held readability, no sudden z-mask inversion, center-safe caption collision status, and full moving playback. Nonzero sampled pixel differences alone are not a human QA verdict.

**Actual eight original tests:** each 3.4s / 102 frames / 540×960 / 30fps H264, full source HTML and deterministic Python renderer provided in the downloadable complete research archive. These engineering clips were actually encoded and probed; not copyrighted Vox media or actual 2160×3840 channel releases.
