// Oklo pilot, low poly 3D, smooth 30fps (owner decision 19 Oct 2026). Every frame is a pure function of t = frame/30.
// Pilot only: not an approved episode. Surface staged for 2 billion years ago: bare rock, river, microbial mounds, no land plants or animals.
import * as THREE from 'three';
import { OBJLoader } from '/node_modules/three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from '/node_modules/three/examples/jsm/loaders/MTLLoader.js';

const W = 1080, H = 1920, FPS = 30, DURATION = 12.4, FRAMES = Math.round(DURATION * FPS);
const ASSETS = '/assets/3d/';

// ---------- helpers ----------
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, u) => a + (b - a) * u;
const smooth = u => { u = clamp(u); return u * u * (3 - 2 * u); };
const inOut = u => { u = clamp(u); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
const outBack = u => { u = clamp(u); const c = 1.6; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
const span = (t, a, b) => clamp((t - a) / (b - a));
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// ---------- renderer + output canvas ----------
const out = document.getElementById('c'); const q = out.getContext('2d');
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: false });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ---------- palette ----------
const C = { ore: '#ffb53d', oreHi: '#ffe39a', neutron: '#6ff3ff', water: '#3aa6ff', waterHi: '#9fd6ff', heat: '#ff5a36', proton: '#ff7a3c', uranium: '#ffbe3b', tag: '#ffe39a', textEdge: '#140c22' };
const flat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: .9, metalness: 0, ...extra });

async function loadOBJ(name) {
  const mtl = await new MTLLoader().setPath(ASSETS).loadAsync(name + '.mtl'); mtl.preload();
  const obj = await new OBJLoader().setMaterials(mtl).setPath(ASSETS).loadAsync(name + '.obj');
  obj.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach(m => { m.flatShading = true; m.needsUpdate = true; }); } });
  return obj;
}
function lowpolyRock(r, seed, detail = 0) {
  const g = new THREE.IcosahedronGeometry(r, detail), p = g.attributes.position, rr = rng(seed), key = {};
  for (let i = 0; i < p.count; i++) { const k = [p.getX(i), p.getY(i), p.getZ(i)].map(v => v.toFixed(3)).join(); if (!(k in key)) key[k] = .78 + rr() * .4; const s = key[k]; p.setXYZ(i, p.getX(i) * s, p.getY(i) * s * .85, p.getZ(i) * s); }
  g.computeVertexNormals(); return g;
}

// =====================================================================
// MACRO: cutaway block of savanna ground
// =====================================================================
const macro = new THREE.Scene();
{ const cv = document.createElement('canvas'); cv.width = 4; cv.height = 512; const g = cv.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 512);
  gr.addColorStop(0, '#1a1440'); gr.addColorStop(.45, '#4a2463'); gr.addColorStop(.75, '#c4566a'); gr.addColorStop(1, '#f0915e'); g.fillStyle = gr; g.fillRect(0, 0, 4, 512);
  const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; macro.background = tx; }
macro.add(new THREE.HemisphereLight('#8a6fd0', '#5a3a2a', 1.1));
const key = new THREE.DirectionalLight('#ffd2a0', 2.6); key.position.set(6, 7, 9); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -10, right: 10, top: 10, bottom: -12, near: 1, far: 40 }); macro.add(key);
const rim = new THREE.DirectionalLight('#ff9a6a', 1.4); rim.position.set(-4, 2, -10); macro.add(rim);
const sun = new THREE.Mesh(new THREE.IcosahedronGeometry(2.6, 2), new THREE.MeshBasicMaterial({ color: '#ffd27a' })); sun.position.set(4, 1.2, -28); macro.add(sun);
const starsGeo = new THREE.BufferGeometry(); { const r = rng(5), a = []; for (let i = 0; i < 240; i++) a.push((r() - .5) * 90, 6 + r() * 40, -40 - r() * 10); starsGeo.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); }
macro.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: '#ffffff', size: .22, transparent: true, opacity: .8 })));
// distant low-poly hills
for (const [x, z, s, col] of [[-9, -18, 7, '#2f2350'], [6, -20, 9, '#2a1f48'], [0, -14, 5, '#3a2a55']]) { const m = new THREE.Mesh(lowpolyRock(1, x * 7 + 3, 1), flat(col)); m.scale.set(s * 1.6, s * .55, s); m.position.set(x, -.4, z); macro.add(m); }
// ground surface (low-poly displaced plane), front edge kept flat to meet the cut
{ const g = new THREE.PlaneGeometry(16, 10, 24, 15); g.rotateX(-Math.PI / 2); const p = g.attributes.position, r = rng(9);
  for (let i = 0; i < p.count; i++) { const z = p.getZ(i); if (z < 4.9) p.setY(i, r() * .22); }
  g.computeVertexNormals(); const m = new THREE.Mesh(g, flat('#8c6a56')); m.receiveShadow = true; macro.add(m); }
// river crossing the plain (Oklo ores formed in ancient river and delta sediments)
const river = new THREE.Mesh(new THREE.PlaneGeometry(16, 2.2, 16, 2), new THREE.MeshStandardMaterial({ color: '#3f86c9', roughness: .2, metalness: .1, flatShading: true, transparent: true, opacity: .9 }));
river.rotation.x = -Math.PI / 2; river.rotation.z = .18; river.position.set(0, .26, -1.2); macro.add(river);
// microbial mounds (stromatolite-like) along the river: the only life at the time
const moundMat = flat('#6f7f4a'), moundMat2 = flat('#8a8a55'), mounds = [];
{ const r = rng(77); for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(lowpolyRock(.35 + r() * .25, 900 + i, 0), i % 2 ? moundMat : moundMat2); m.scale.y = .45; const x = -6 + i * 1.5 + (r() - .5) * .6; m.position.set(x, .08, -1.2 + (x * -.18) + (r() < .5 ? -.9 : .9)); m.castShadow = true; macro.add(m); mounds.push(m); } }
macro.fog = new THREE.Fog('#b8607a', 22, 60);
// strata (front face at z = +5 is the cut)
const STRATA = [[0, -1.2, '#7a4a3a'], [-1.2, -3.0, '#9a6240'], [-3.0, -4.6, '#6e4a52'], [-4.6, -6.1, '#5a3550'], [-6.1, -8.0, '#4a2c45'], [-8.0, -11, '#33203d']];
for (const [top, bot, col] of STRATA) { const m = new THREE.Mesh(new THREE.BoxGeometry(16, top - bot, 10), flat(col)); m.position.set(0, (top + bot) / 2, 0); m.receiveShadow = true; macro.add(m); }
// groundwater band seen in the cut face
const gwMat = new THREE.MeshStandardMaterial({ color: '#3aa6ff', transparent: true, opacity: .45, roughness: .3, emissive: '#1a4f8a', emissiveIntensity: .5 });
const gw = new THREE.Mesh(new THREE.BoxGeometry(16, 1.0, .08), gwMat); gw.position.set(0, -3.8, 5.04); macro.add(gw);
// ore seam: glowing lens with protruding crystals
const oreMat = new THREE.MeshStandardMaterial({ color: '#b8641a', emissive: '#ff8a1a', emissiveIntensity: .4, flatShading: true, roughness: .6 });
const oreLens = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 2), oreMat); oreLens.scale.set(3.3, .72, 1.2); oreLens.position.set(0, -7.0, 4.55); macro.add(oreLens);
const crystalMat = new THREE.MeshStandardMaterial({ color: '#ffe39a', emissive: '#ffb53d', emissiveIntensity: .5, flatShading: true });
{ const r = rng(12); for (let i = 0; i < 18; i++) { const c = new THREE.Mesh(new THREE.OctahedronGeometry(.16 + r() * .18, 0), crystalMat); const x = (r() - .5) * 5.2; c.position.set(x, -7.0 + (r() - .5) * .9 * (1 - Math.abs(x) / 3.3), 5.08 + r() * .2); c.rotation.set(r() * 3, r() * 3, r() * 3); c.scale.y = 1.6; macro.add(c); } }
const oreLight = new THREE.PointLight('#ffa040', 0, 9, 1.6); oreLight.position.set(0, -7, 6.4); macro.add(oreLight);
// embedded rocks in the cut face (texture attached to strata)
const faceRocks = [];
// camera
const camM = new THREE.PerspectiveCamera(40, W / H, .1, 200);

// =====================================================================
// MICRO: inside the ore (plane z=0 maps 1:100 to the 2D layout; screen px -> world)
// =====================================================================
const P = (x, y, z = 0) => V((x - 540) / 100, -(y - 960) / 100, z);
const micro = new THREE.Scene(); micro.background = new THREE.Color('#1c1124');
const mHemi = new THREE.HemisphereLight('#b9a0ff', '#3a1a22', 1.2); micro.add(mHemi);
const mKey = new THREE.DirectionalLight('#ffe2c0', 2.2); mKey.position.set(-6, 8, 10); micro.add(mKey);
const reactorLight = new THREE.PointLight('#ff8a3a', 0, 30, 1.2); reactorLight.position.set(0, 1, 6); micro.add(reactorLight);
const rockMats = ['#4a2d3e', '#5a3646', '#6a404c', '#553447'].map(c => flat(c, { emissive: '#ff3a1a', emissiveIntensity: 0 }));
{ const r = rng(20261019); for (let gy = -60; gy < H + 120; gy += 130) for (let gx = -60; gx < W + 120; gx += 140) {
  const m = new THREE.Mesh(lowpolyRock(.55 + r() * .25, Math.floor(r() * 1e6), 0), rockMats[Math.floor(r() * 4)]);
  m.position.copy(P(gx + (r() - .5) * 60, gy + (r() - .5) * 60, -1.1 - r() * .8)); m.rotation.set(r() * 3, r() * 3, r() * 3); micro.add(m); } }
const NUC = { A: [300, 520], B: [720, 360], C: [650, 700], D: [900, 560], E: [360, 1290], F: [790, 1360], G: [250, 1640], H: [640, 1640] };
const SPLIT = { A: 5.40, C: 5.78, B: 5.84, D: 6.12, E: 6.30, F: 6.70, H: 9.52 };
const protonMat = flat(C.proton, { emissive: '#ff5a1a', emissiveIntensity: .15, roughness: .5 });
const neutronMatN = flat(C.uranium, { emissive: '#ffa020', emissiveIntensity: .15, roughness: .5 });
const nucleonGeo = new THREE.IcosahedronGeometry(.17, 1);
function nucleusGroup(n, seed) { const g = new THREE.Group(), r = rng(seed); for (let i = 0; i < n; i++) { const a = i * 2.39996, d = Math.sqrt((i + .5) / n), u = r() * 2 - 1; const rad = n > 20 ? .58 : .42; const m = new THREE.Mesh(nucleonGeo, r() < .43 ? protonMat : neutronMatN); m.position.set(Math.cos(a) * d * rad * Math.sqrt(1 - u * u), Math.sin(a) * d * rad * Math.sqrt(1 - u * u), u * d * rad); g.add(m); } return g; }
const nuclei = {};
const haloMat = new THREE.SpriteMaterial({ map: null, color: '#ffb040', transparent: true, opacity: .0, blending: THREE.AdditiveBlending, depthWrite: false });
for (const [k, [x, y]] of Object.entries(NUC)) { const whole = nucleusGroup(34, x + y), fa = nucleusGroup(17, x), fb = nucleusGroup(17, y); const root = new THREE.Group(); root.position.copy(P(x, y, .2)); root.add(whole, fa, fb); micro.add(root); nuclei[k] = { root, whole, fa, fb }; }
const halos = {};
// small background uranium grains
{ const r = rng(44); for (let i = 0; i < 22; i++) { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(.11 + r() * .08, 0), neutronMatN); m.position.copy(P(r() * W, r() * H, -.5)); micro.add(m); } }
// pores with water
const PORES = [{ id: 'P1', x: 470, y: 600, r: 92 }, { id: 'P2', x: 870, y: 380, r: 78 }, { id: 'P3', x: 470, y: 1520, r: 104 }, { id: 'P4', x: 960, y: 1560, r: 80 }, { id: 'P5', x: 140, y: 1330, r: 70 }, { id: 'P6', x: 160, y: 300, r: 66 }];
const waterMat = new THREE.MeshStandardMaterial({ color: C.water, transparent: true, opacity: .82, roughness: .15, metalness: 0, flatShading: true, emissive: '#0a3a80', emissiveIntensity: .35 });
const cavityMat = new THREE.MeshBasicMaterial({ color: '#0d0712' });
for (const p of PORES) {
  const cav = new THREE.Mesh(new THREE.CircleGeometry(p.r / 100 * 1.05, 9), cavityMat); cav.position.copy(P(p.x, p.y, -.35)); micro.add(cav);
  const w = new THREE.Mesh(lowpolyRock(p.r / 100, p.x * 3 + p.y, 1), waterMat); w.position.copy(P(p.x, p.y, -.2)); w.scale.z = .5; micro.add(w); p.mesh = w;
}
const water = (t, id) => 1 - smooth(span(t, id === 'P3' ? 9.35 : 7.7, id === 'P3' ? 9.95 : 9.85));
// bubbles (pool, positions computed from time)
const bubbleMat = new THREE.MeshStandardMaterial({ color: '#dff0ff', transparent: true, opacity: .7, roughness: .1, flatShading: true });
const bubbles = []; { const br = rng(33); for (let i = 0; i < 70; i++) { const p = PORES[i % PORES.length]; const m = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), bubbleMat.clone()); micro.add(m); bubbles.push({ m, p, born: 7.5 + br() * 2.2, life: .9 + br() * .7, dx: (br() - .5) * p.r, sz: 7 + br() * 12, i }); } }
// neutrons with trails
const nMat = new THREE.MeshBasicMaterial({ color: C.neutron });
const trailMat = new THREE.MeshBasicMaterial({ color: C.neutron, transparent: true, opacity: .45 });
const FLIGHTS = [
  { a: [-40, 560], b: NUC.A, t0: 5.02, t1: 5.40 }, { a: NUC.A, b: NUC.B, t0: 5.40, t1: 5.84 }, { a: NUC.A, b: NUC.C, t0: 5.40, t1: 5.78 },
  { a: NUC.C, b: NUC.D, t0: 5.78, t1: 6.12 }, { a: NUC.C, b: NUC.E, t0: 5.78, t1: 6.30 }, { a: NUC.E, b: NUC.F, t0: 6.30, t1: 6.70 },
  { a: NUC.D, b: [1140, 120], t0: 6.12, t1: 6.45 }, { a: NUC.F, b: [1140, 1180], t0: 6.70, t1: 7.05 }, { a: NUC.B, b: [820, -60], t0: 5.84, t1: 6.20 },
  { a: [-40, 1470], b: [380, 1500], t0: 8.45, t1: 8.70 }, { a: [380, 1500], b: [560, 1545], t0: 8.70, t1: 9.30, slow: 1 }, { a: [560, 1545], b: NUC.H, t0: 9.30, t1: 9.52 },
  { a: [-60, 1700], b: [1140, 1560], t0: 10.10, t1: 10.42, fast: 1 }, { a: [-60, 420], b: [1140, 640], t0: 10.30, t1: 10.60, fast: 1 }, { a: [1140, 1260], b: [-60, 1420], t0: 10.55, t1: 10.85, fast: 1 }];
for (const f of FLIGHTS) { f.ball = new THREE.Mesh(new THREE.IcosahedronGeometry(.13, 1), nMat); f.trail = new THREE.Mesh(new THREE.CylinderGeometry(.07, .0, 1, 6), trailMat); micro.add(f.ball, f.trail); }
// fission flashes (additive sprites)
const flashTex = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,245,200,1)'); gr.addColorStop(.35, 'rgba(255,190,80,.6)'); gr.addColorStop(1, 'rgba(255,120,40,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(cv); })();
for (const [k, [x, y]] of Object.entries(NUC)) { const hs = new THREE.Sprite(new THREE.SpriteMaterial({ map: flashTex, transparent: true, opacity: .35, blending: THREE.AdditiveBlending, depthWrite: false })); hs.position.copy(P(x, y, -.1)); hs.scale.setScalar(2.4); micro.add(hs); halos[k] = hs; }
const flashes = {}; for (const k of Object.keys(SPLIT)) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: flashTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false })); s.position.copy(P(...NUC[k], .8)); micro.add(s); flashes[k] = s; }
const camU = new THREE.PerspectiveCamera(43.6, W / H, .1, 100);

// ---------- state ----------
const glow = t => clamp(Object.values(SPLIT).filter(s => t >= s && s < 8).length / 6) * (1 - smooth(span(t, 9.7, 11.3)) * .9);
const heat = t => smooth(span(t, 5.4, 7.4)) * (1 - smooth(span(t, 9.8, 11.6)) * .85);

function updateMacro(t) {
  const dive = inOut(span(t, 1.75, 3.45)), zoom = inOut(span(t, 3.55, 4.55));
  const p0 = V(.8, 2.6, 24), p1 = V(-.3, -5.6, 15.5), p2 = V(0, -7.0, 9.0);
  const l0 = V(0, .2, 0), l1 = V(0, -6.2, 5), l2 = V(0, -7.0, 5);
  const pos = dive < 1 ? p0.clone().lerp(p1, dive) : p1.clone().lerp(p2, zoom); const look = dive < 1 ? l0.clone().lerp(l1, dive) : l1.clone().lerp(l2, zoom);
  pos.x += .25 * Math.sin(t * .6); camM.position.copy(pos); camM.lookAt(look); camM.updateMatrixWorld();
  const reveal = smooth(span(t, 3.2, 3.9)); oreMat.emissiveIntensity = .15 + .3 * reveal; crystalMat.emissiveIntensity = .25 + .45 * reveal; oreLight.intensity = 4 * reveal;
  gwMat.opacity = .35 + .25 * smooth(span(t, 2.2, 2.8));
}
function updateMicro(t) {
  const push = smooth(span(t, 4.4, 12.4)); camU.position.set(.15 * Math.sin(t * .5), .1 * Math.cos(t * .4), lerp(24, 22.3, push)); camU.lookAt(0, 0, 0); camU.updateMatrixWorld();
  const h = heat(t), g = glow(t);
  rockMats.forEach(m => m.emissiveIntensity = .06 * h); micro.background.set(new THREE.Color('#1c1124').lerp(new THREE.Color('#3a1520'), h));
  reactorLight.intensity = 45 * g; mHemi.color.set(new THREE.Color('#b9a0ff').lerp(new THREE.Color('#ffb08a'), h));
  for (const [k, n] of Object.entries(nuclei)) {
    const s = SPLIT[k], split = s !== undefined && t >= s;
    n.whole.visible = !split; n.fa.visible = n.fb.visible = split; const bx = (NUC[k][0] - 540) / 100, by = -(NUC[k][1] - 960) / 100; n.root.rotation.set(.3 * Math.sin(t * .7 + bx), t * .35 + by, 0);
    const pre = (!split && s !== undefined) ? smooth(span(t, s - .1, s)) : 0; n.root.position.x = bx + .03 * pre * Math.sin(t * 90);
    if (split) { const u = span(t, s, s + .9), d = (26 + 70 * outBack(u)) / 100; n.fa.position.set(-d * .8, d * .5, 0); n.fb.position.set(d * .8, -d * .5, 0); n.fa.scale.setScalar(1 - .2 * u); n.fb.scale.setScalar(1 - .2 * u); }
    halos[k].material.opacity = (split ? .12 : .32) * (1 - .6 * smooth(span(t, 10, 11.4)));
    if (flashes[k]) { const f = split ? 1 - span(t, s, s + .4) : 0; flashes[k].material.opacity = f; flashes[k].scale.setScalar(.1 + 5.5 * f); }
  }
  for (const p of PORES) { const w = water(t, p.id); p.mesh.visible = w > .02; p.mesh.scale.set(.25 + .75 * w, (.15 + .85 * w), .5 * w + .05); p.mesh.position.y = -(p.y - 960) / 100 - (1 - w) * p.r / 100 * .6; }
  for (const b of bubbles) { const u = (t - b.born) / b.life; const on = u >= 0 && u <= 1 && !(water(t, b.p.id) < .05 && u < .1); b.m.visible = on; if (!on) continue;
    const y = b.p.y + b.p.r * .5 - u * (b.p.r * 1.6 + 120), x = b.p.x + b.dx + 8 * Math.sin(u * 9 + b.i); b.m.position.copy(P(x, y, .3)); b.m.scale.setScalar(b.sz / 100 * (u < .45 ? 1 : 1.4 + u)); b.m.material.opacity = .75 * (1 - u); }
  for (const f of FLIGHTS) { const on = t >= f.t0 && t <= f.t1; f.ball.visible = f.trail.visible = on; if (!on) continue;
    const u = (t - f.t0) / (f.t1 - f.t0), a = P(...f.a, .5), b = P(...f.b, .5), pos = a.clone().lerp(b, u), dir = b.clone().sub(a).normalize(); f.ball.position.copy(pos);
    const len = f.slow ? .25 : f.fast ? 2.4 : 1.1; f.trail.scale.set(1, len, 1); f.trail.position.copy(pos.clone().addScaledVector(dir, -len / 2)); f.trail.quaternion.setFromUnitVectors(V(0, -1, 0), dir); }
}
function project(cam, v) { const p = v.clone().project(cam); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; }

// ---------- 2D overlay (labels, thermometer, keywords, captions) ----------
function tag(text, x, y, tx, ty, a) {
  if (a <= 0) return; q.save(); q.globalAlpha = a; q.strokeStyle = C.tag; q.lineWidth = 4; q.lineCap = 'round'; q.beginPath(); q.moveTo(x, y); q.lineTo(tx, ty); q.stroke();
  q.fillStyle = C.tag; q.beginPath(); q.arc(tx, ty, 7, 0, 6.283); q.fill(); q.font = '700 40px Manrope'; q.textAlign = x < tx ? 'right' : 'left'; q.textBaseline = 'middle';
  q.lineJoin = 'round'; q.lineWidth = 9; q.strokeStyle = C.textEdge; const X = x + (x < tx ? -12 : 12); q.strokeText(text, X, y); q.fillText(text, X, y); q.restore();
}
const KEYWORDS = [{ s: '2 BILLION YEARS AGO', t0: .35, t1: 2.45 }, { s: 'OKLO, GABON', t0: 2.55, t1: 4.3 }, { s: 'CHAIN REACTION', t0: 5.15, t1: 7.5, c: C.ore }, { s: 'BOILING', t0: 7.6, t1: 10.0, c: C.waterHi }, { s: 'OFF', t0: 10.4, t1: 12.4, c: C.neutron }];
const CAPTIONS = [{ s: 'Two billion years ago,', t0: .25, t1: 1.86 }, { s: 'under what is now Gabon,', t0: 1.89, t1: 3.55 }, { s: 'uranium started its own chain reaction.', t0: 3.62, t1: 6.25 }, { s: 'Then its heat boiled away', t0: 6.33, t1: 8.35 }, { s: 'the water it needed...', t0: 8.39, t1: 10.03 }, { s: 'and it shut itself off.', t0: 10.07, t1: 12.1 }];
function wrap(s, max) { const w = s.split(' '), L = []; let c = ''; for (const x of w) { const tr = c ? c + ' ' + x : x; if (q.measureText(tr).width > max && c) { L.push(c); c = x; } else c = tr; } L.push(c); return L; }
function overlay(t, iris) {
  if (iris < 1) {
    if (mounds[4]) { const mp = project(camM, mounds[4].position.clone().add(V(0, .2, 0))); tag('only microbial life', mp[0] - 60, mp[1] + 210, mp[0], mp[1], smooth(span(t, .7, 1.0)) * (1 - smooth(span(t, 1.6, 1.8)))); }
    const gwp = project(camM, V(.4, -3.8, 5.05)), ore = project(camM, V(.6, -6.75, 5.1));
    tag('groundwater', gwp[0] - 160, gwp[1] + 170, gwp[0], gwp[1], smooth(span(t, 2.3, 2.8)) * (1 - smooth(span(t, 3.4, 3.7))));
    tag('uranium ore', ore[0] - 170, ore[1] - 260, ore[0], ore[1], smooth(span(t, 3.62, 3.95)) * (1 - smooth(span(t, 4.2, 4.4))));
  }
  if (iris > 0) {
    const pr = k => project(camU, P(...NUC[k], .2));
    const a = pr('A'); tag('uranium atom', a[0] + 260, a[1] - 300, a[0] + 20, a[1] - 40, smooth(span(t, 4.75, 4.95)) * (1 - smooth(span(t, 5.3, 5.45))));
    const w1 = project(camU, P(470, 600, -.2)); tag('water', w1[0] + 220, w1[1] - 130, w1[0] + 40, w1[1] - 20, smooth(span(t, 4.8, 5.0)) * (1 - smooth(span(t, 5.6, 5.8))));
    tag('neutron', 260, 380, 180, 540, smooth(span(t, 5.05, 5.2)) * (1 - smooth(span(t, 5.5, 5.7))));
    const w3 = project(camU, P(470, 1520, .3)); tag('water slows it', w3[0] + 140, w3[1] - 300, w3[0] - 20, w3[1] - 20, smooth(span(t, 8.6, 8.8)) * (1 - smooth(span(t, 9.6, 9.8))));
    tag('too fast to split', 640, 1220, 470, 1585, smooth(span(t, 10.25, 10.45)) * (1 - smooth(span(t, 11.4, 11.7))));
    const th = clamp(.12 + .88 * smooth(span(t, 5.6, 7.6)) - .8 * smooth(span(t, 9.9, 11.8))), tx = 990, ty0 = 1250, ty1 = 1690, ta = smooth(span(t, 6.3, 6.7));
    if (ta > 0) { q.save(); q.globalAlpha = ta; q.fillStyle = '#1b1024'; q.beginPath(); q.roundRect(tx - 26, ty0 - 26, 52, ty1 - ty0 + 52, 26); q.fill(); q.beginPath(); q.arc(tx, ty1 + 30, 44, 0, 6.283); q.fill();
      q.fillStyle = C.heat; q.beginPath(); q.arc(tx, ty1 + 30, 30, 0, 6.283); q.fill(); const top = lerp(ty1, ty0, th); q.beginPath(); q.roundRect(tx - 12, top, 24, ty1 + 20 - top, 12); q.fill();
      q.strokeStyle = 'rgba(255,255,255,.35)'; q.lineWidth = 3; for (let i = 0; i < 6; i++) { const y = lerp(ty1, ty0, i / 5); q.beginPath(); q.moveTo(tx - 44, y); q.lineTo(tx - 30, y); q.stroke(); } q.restore(); }
    q.save(); q.globalAlpha = .7 * smooth(span(t, 4.6, 5.0)); q.font = '600 26px Manrope'; q.fillStyle = '#fff'; q.textAlign = 'left'; q.fillText('Illustration · not to scale · gauges illustrative', 40, 1860); q.restore();
    // reactor status chip (our own readout design, inspired by on screen counters in the owner's references)
    const ca = smooth(span(t, 4.85, 5.15)); if (ca > 0) { const on = t >= 5.40 && t < 10.42, pulse = on ? .55 + .45 * Math.sin(t * 12) : 0;
      q.save(); q.globalAlpha = ca; q.fillStyle = 'rgba(20,12,34,.86)'; q.beginPath(); q.roundRect(40, 380, 330, 84, 42); q.fill();
      q.fillStyle = on ? C.ore : '#6b6b7a'; q.beginPath(); q.arc(88, 422, 18 + 4 * pulse, 0, 6.283); q.fill();
      q.font = '700 30px Manrope'; q.fillStyle = 'rgba(255,255,255,.75)'; q.textAlign = 'left'; q.textBaseline = 'middle'; q.fillText('REACTOR', 122, 422);
      q.font = '800 40px Manrope'; q.fillStyle = on ? C.ore : '#cfd0dc'; q.fillText(on ? 'ON' : 'OFF', 268, 423); q.restore(); }
    // water gauge (mirrors the thermometer: heat up, water down)
    const wa = smooth(span(t, 6.3, 6.7)); if (wa > 0) { const lvl = PORES.reduce((a, p) => a + water(t, p.id), 0) / PORES.length, gx = 90, gy0 = 1250, gy1 = 1690;
      q.save(); q.globalAlpha = wa; q.fillStyle = '#1b1024'; q.beginPath(); q.roundRect(gx - 26, gy0 - 26, 52, gy1 - gy0 + 52, 26); q.fill();
      q.fillStyle = C.water; const top = lerp(gy1, gy0, lvl); if (lvl > .01) { q.beginPath(); q.roundRect(gx - 12, top, 24, gy1 + 12 - top, 12); q.fill(); }
      q.font = '700 30px Manrope'; q.fillStyle = C.waterHi; q.textAlign = 'center'; q.fillText('WATER', gx + 4, gy1 + 64); q.restore(); }
  }
  for (const k of KEYWORDS) { if (t < k.t0 || t > k.t1) continue; const a = smooth(span(t, k.t0, k.t0 + .25)) * (1 - smooth(span(t, k.t1 - .2, k.t1))), sc = .7 + .3 * outBack(span(t, k.t0, k.t0 + .35));
    q.save(); q.globalAlpha = a; q.translate(540, 250); q.scale(sc, sc); q.font = '800 84px Manrope'; q.textAlign = 'center'; q.textBaseline = 'middle'; q.lineJoin = 'round'; q.lineWidth = 14; q.strokeStyle = C.textEdge; q.strokeText(k.s, 0, 0); q.fillStyle = k.c || '#fff'; q.fillText(k.s, 0, 0); q.restore(); }
  for (const c of CAPTIONS) { if (t < c.t0 || t > c.t1) continue; const a = smooth(span(t, c.t0, c.t0 + .12)) * (1 - smooth(span(t, c.t1 - .1, c.t1)));
    q.save(); q.globalAlpha = a; q.font = '800 60px Manrope'; q.textAlign = 'center'; q.textBaseline = 'middle'; const L = wrap(c.s, 880), lh = 74, y0 = 960 - (L.length - 1) * lh / 2;
    L.forEach((l, i) => { q.lineJoin = 'round'; q.lineWidth = 12; q.strokeStyle = C.textEdge; q.strokeText(l, 540, y0 + i * lh); q.fillStyle = '#fff'; q.fillText(l, 540, y0 + i * lh); }); q.restore(); }
}

// ---------- frame ----------
function renderScene(t) {
  const iris = inOut(span(t, 4.25, 4.95));
  q.setTransform(1, 0, 0, 1, 0, 0); q.clearRect(0, 0, W, H);
  updateMacro(t); let center = project(camM, V(0, -7.0, 5.0));
  if (iris < 1) { renderer.render(macro, camM); q.drawImage(renderer.domElement, 0, 0); }
  if (iris > 0) { updateMicro(t); renderer.render(micro, camU); const R = 1300 * iris + 1;
    q.save(); q.beginPath(); q.arc(center[0], center[1], R, 0, 6.283); q.clip(); q.drawImage(renderer.domElement, 0, 0); q.restore();
    if (iris < 1) { q.strokeStyle = C.ore; q.lineWidth = 14; q.beginPath(); q.arc(center[0], center[1], R, 0, 6.283); q.stroke(); } }
  overlay(t, iris);
}
const sceneTimeFor = i => i / FPS;   // smooth 30fps: no state quantization
window.renderFrame = i => { const st = sceneTimeFor(i); renderScene(st); return st; };

// ---------- load (fonts + assets) before anything is captured ----------
window.ready = (async () => {
  for (const [u, w] of [['/assets/fonts/Manrope800.ttf', '800'], ['/assets/fonts/Manrope.ttf', '200 800']]) { const f = new FontFace('Manrope', `url(${u})`, { weight: w }); await f.load(); document.fonts.add(f); }
  await document.fonts.ready;
  const [rockS, boulder, cluster, frac] = await Promise.all(['rock_small', 'boulder_large', 'rock_cluster', 'fractured_rock'].map(loadOBJ));
  const place = (src, x, z, s, ry) => { const o = src.clone(); o.position.set(x, 0, z); o.scale.setScalar(s); o.rotation.y = ry; macro.add(o); return o; };
  const rr = rng(3);
  for (let i = 0; i < 7; i++) place(boulder, (rr() - .5) * 13, (rr() - .5) * 7 + .8, .16 + rr() * .2, rr() * 6);
  for (let i = 0; i < 10; i++) place(cluster, (rr() - .5) * 14, (rr() - .5) * 8 + .6, .14 + rr() * .14, rr() * 6);
  for (let i = 0; i < 14; i++) place(rockS, (rr() - .5) * 14, (rr() - .5) * 8 + .8, .12 + rr() * .12, rr() * 6);
  // fractured rock pieces embedded in the cut face
  const fr = rng(17); for (let i = 0; i < 16; i++) { const o = frac.clone(); o.scale.setScalar(.12 + fr() * .12); o.position.set((fr() - .5) * 12, -1 - fr() * 8.5, 5.25); if (Math.abs(o.position.y + 7) < 1.1) o.position.y -= 1.6; o.rotation.set(fr() * 3, fr() * 3, fr() * 3); macro.add(o); }
  renderer.compile(macro, camM); renderer.compile(micro, camU);
  return FRAMES;
})();
