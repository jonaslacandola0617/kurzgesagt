# the channel — VOX-INSPIRED MOTION FORENSICS
**Basis:** nine decoded third-party TikTok tutorial/demonstration clips. NOT authenticated full original Vox editorial films. References cited as clip-ID + video seconds. `[F]` frames directly observed; `[S]` measured waveform only; `[I]` technical inference; `[P]` an original design proposal. **No complete reference soundtrack was perceptually auditioned and no full original Vox project source was recovered.**

# 09 — Deterministic Animation, 2.5D Camera, Masks and Editing System
## Architecture
Use a data-authored, absolute-time scene specification in browser HTML/SVG/Canvas (optionally vector rasterization and GPU compositing). 

```text
Episode {fps, resolution, voiceMasterFile, audioCueTimeline, assetManifest}
  Shot {id,start,end,purpose, claim_id, reference_technique_ids, composition_fingerprint}
    Camera {keyframes, projection, focalTarget, easeProfile}
    Groups: [paperPlane, foregroundCutout, visualEvidence, typedLabels, maskingGroup]
      Node {asset_id, parent_id, localPose(t), zIndex, mask_id, opacity(t), anchor, material}
    SubtitleRegion {normalized x=.5, y=.42..58, wordCueIds}
    OutgoingTransition {type, screenSpaceMatchObjectId, nextShotId, duration}
```

## Transform maths and coordinate precision
For a 2D affine object, local transform `M = T(position) · T(anchor) · R(angle) · S(scaleX,scaleY) · T(-anchor)`. Parent multiplication maps it to world. Camera view maps world to normalized screen: `screenPos = P_camera(t) * Π_i M_parent_i(t) * localVertex`. Use separate page-space highlights (under the page transform) and screen-space captions (outside camera) so they cannot drift.

For 2.5D depth, each plane has z. `viewScale(z) = focal / (focal + z)` for a simple stylized perspective; proper homographies for photographs turning in 3D; depth occlusion and layered shadow handling must be authored and stable. Never approximate all layers with the same CSS `scale()`.

```javascript
// PSEUDOCODE: Absolute-time, deterministic, readable motion
function sampleKeyframes(t, keyframes, ease = cubicBezier(.20,.05,.30,1)) {
  const [a,b] = adjacentKeys(keyframes,t);
  const u = clamp((t-a.time)/(b.time-a.time),0,1);
  return interpolate(a.value,b.value,ease(u));
}
function drawShot(ctx,t,shot) {
  const camera = sampleCamera(t,shot.cameraKeys);
  ctx.setTransform(...camera.matrix);
  for (const node of topologicalSort(shot.nodes)) {
    ctx.save();
    applyMatrix(ctx, node.worldMatrix(t));
    if (node.maskId) applyClipPath(ctx, node.maskId);
    paintVectorOrCachedAsset(ctx,node.assetId,node.material);
    ctx.restore();
  }
  ctx.setTransform(1,0,0,1,0,0);
  drawWordTimedCaptionsInCenter(ctx,t,shot.captionIDs);
}
```

### Keyframe domains
Animation is always specified by `master_t`, not asynchronous `requestAnimationFrame` counts. Support step/hold, linear, cubic-bezier, overshoot/spring, signed distance masked reveal, drawn stroke path progress, easing with different entry/exit velocities, per-object lag. Do not apply identical acceleration everywhere; liquid/metal/satellite/printed page obey different editorial and physical pacing.

```javascript
// Proposed paper-annotation binding: constant coordinates on paper
const pageWorld = cameraWorld(t).multiply(page.localMatrix(t));
const goldMarkWorld = pageWorld.multiply(highlight.localMatrix(t));
// The annotation cannot float if the paper moves.
```

### Source texture and procedural ink
Paper texture is anchored to paper UV/object transform; SVG path points use seeded 2D noise at `t`. For animated rough hand-mark: `p'(s,t) = p(s) + n(s,t) * normal(s) * amp`, with `amp` about .7–2 logical pixels at ordinary caption size; pin the same deterministic seed across renders. Rasterize at 2× logical resolution or higher when camera push demands it. Do not simulate rough ink by moving arbitrary compressed low-res photographs.

### Editorial camera/keyframe workbench
Provide visible scrub, source video tag with timestamps, overlay of tracked coordinates and step-keyframe ruler, screen-space caption safe region, per-layer toggle, camera-vs-object toggle, RGB/vector detail checker. Render to lossless PNG frames at native 2160×3840. Encode H.264 CRF~15/AAC 48k stereo for MP4 and VP9/Opus for WebM. Both need independent pixel/bitstream and soundtrack audit; a 1080p intermediate upscaled is not real 4K visual detail.

### Audio cue contract
Voice is source of truth. `AudioCue {mediaRef,sourceLicense,bus,inTime,outTime,volumeEnvelope,pan,semanticEventId}`. `VisualCue {objectId,animatedProperty,eventTime,linkedNarrationWordId}`. Audio effects must derive from actual physical event and be verified in encoded MP4. No preassigned 8s scene slots with 3–5s dead narration holes. Captions must use forced or manually validated word-boundaries.

### Performance
Render heavy SVG/illustrations to vector caches or precomposed high-res sprites; do not recalculate 1500 path points per frame when only parent matrix changes. For motion tests, compare `t=0`, `t=0.5*shot`, `t=1*shot`, then six consecutive frames around mask intersections. Detect unchanging screenshots, clipped labels, one-frame pop, depth-order mistakes, compression aliasing, source-film color mismatch, and bokeh that eats small labels.

### Implementation roadmap
1. Typed scene spec + hierarchy / parent matrix and assertion tests. 2. Proper camera rig and z-depth planes. 3. Document texture transform and screen-space annotation test. 4. Stroke roughening stable noise engine. 5. Renderer parity between browser scrub and PNG/H264/VP9. 6. Actual creative motion previews reviewed before episode assembly.