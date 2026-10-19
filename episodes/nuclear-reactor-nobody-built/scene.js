// The Nuclear Reactor Nobody Built — draft v1. Low poly 3D, smooth 30fps (owner decisions 19 Oct 2026).
// Every frame is a pure function of film time t = frame / 30. Timing comes from timeline.js (actual Bernard take, machine word times).
import * as THREE from 'three';
import { OBJLoader } from '/node_modules/three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from '/node_modules/three/examples/jsm/loaders/MTLLoader.js';
import { B, CAPTIONS, DURATION } from './timeline.js';

const W = 1080, H = 1920, FPS = 30, FRAMES = Math.round(DURATION * FPS);
const ASSETS = '/assets/3d/';

// ---------- helpers ----------
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, u) => a + (b - a) * u;
const smooth = u => { u = clamp(u); return u * u * (3 - 2 * u); };
const inOut = u => { u = clamp(u); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
const outBack = u => { u = clamp(u); const c = 1.6; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
const span = (t, a, b) => clamp((t - a) / (b - a));
const win = (t, a, b, f = .25) => smooth(span(t, a, a + f)) * (1 - smooth(span(t, b - f, b)));
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const C = { ore: '#ffb53d', neutron: '#6ff3ff', water: '#3aa6ff', waterHi: '#9fd6ff', heat: '#ff5a36', proton: '#ff7a3c', uranium: '#ffbe3b', u238: '#8d93a6', tag: '#ffe39a', edge: '#140c22', bad: '#ff6b5e', good: '#7fe0a0' };
const flat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: .9, metalness: 0, ...extra });
function lowpolyRock(r, seed, detail = 0) {
  const g = new THREE.IcosahedronGeometry(r, detail), p = g.attributes.position, rr = rng(seed), key = {};
  for (let i = 0; i < p.count; i++) { const k = [p.getX(i), p.getY(i), p.getZ(i)].map(v => v.toFixed(3)).join(); if (!(k in key)) key[k] = .78 + rr() * .4; const s = key[k]; p.setXYZ(i, p.getX(i) * s, p.getY(i) * s * .85, p.getZ(i) * s); }
  g.computeVertexNormals(); return g;
}
function gradientTex(stops) { const cv = document.createElement('canvas'); cv.width = 4; cv.height = 512; const g = cv.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 512); stops.forEach(([o, c]) => gr.addColorStop(o, c)); g.fillStyle = gr; g.fillRect(0, 0, 4, 512); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; }
const glowTex = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,245,200,1)'); gr.addColorStop(.35, 'rgba(255,190,80,.6)'); gr.addColorStop(1, 'rgba(255,120,40,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(cv); })();
async function loadOBJ(name) {
  const mtl = await new MTLLoader().setPath(ASSETS).loadAsync(name + '.mtl'); mtl.preload();
  const obj = await new OBJLoader().setMaterials(mtl).setPath(ASSETS).loadAsync(name + '.obj');
  obj.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { m.flatShading = true; m.needsUpdate = true; }); } });
  return obj;
}

// ---------- renderer / output ----------
const out = document.getElementById('c'); const q = out.getContext('2d');
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
function project(cam, v) { const p = v.clone().project(cam); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; }

// =====================================================================
// LAB (1972)
// =====================================================================
const lab = new THREE.Scene(); lab.background = new THREE.Color('#3b2f2a');
lab.add(new THREE.HemisphereLight('#ffe7c4', '#4a3a30', 1.4));
const labKey = new THREE.DirectionalLight('#fff0d6', 2.2); labKey.position.set(3, 6, 5); labKey.castShadow = true; labKey.shadow.mapSize.set(2048, 2048); Object.assign(labKey.shadow.camera, { left: -6, right: 6, top: 6, bottom: -4 }); lab.add(labKey);
{ const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 10), flat('#8a6b4e')); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; lab.add(floor);
  const wall = new THREE.Mesh(new THREE.BoxGeometry(14, 5, .2), flat('#c9a46a')); wall.position.set(0, 2.5, -2.6); wall.receiveShadow = true; lab.add(wall);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(14, .5, .22), flat('#a8552f')); stripe.position.set(0, 1.1, -2.5); lab.add(stripe);
  const clock = new THREE.Mesh(new THREE.CylinderGeometry(.32, .32, .06, 20), flat('#f2ead8')); clock.rotation.x = Math.PI / 2; clock.position.set(-1.2, 3.4, -2.45); lab.add(clock); }
// instrument (mass spectrometer stand in) with live screen
const screenCv = document.createElement('canvas'); screenCv.width = 512; screenCv.height = 320; const sq = screenCv.getContext('2d');
const screenTex = new THREE.CanvasTexture(screenCv); screenTex.colorSpace = THREE.SRGBColorSpace;
const instrument = new THREE.Group();
{ const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, .9, .7), flat('#d8d2c2')); body.position.y = .45; instrument.add(body);
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(.95, .62, .04), flat('#2b2b2b')); bezel.position.set(0, .52, .36); instrument.add(bezel);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(.86, .54), new THREE.MeshBasicMaterial({ map: screenTex })); scr.position.set(0, .52, .385); instrument.add(scr);
  for (let i = 0; i < 4; i++) { const k = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .05, 10), flat('#7b2f22')); k.rotation.x = Math.PI / 2; k.position.set(-.45 + i * .1, .12, .36); instrument.add(k); }
  const vial = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, .26, 12), new THREE.MeshStandardMaterial({ color: '#d9e9ff', transparent: true, opacity: .7 })); vial.position.set(.8, .13, .15); instrument.add(vial);
  const sample = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .1, 12), flat('#4a4a3a')); sample.position.set(.8, .06, .15); instrument.add(sample); }
let scientist = null, sciHead = null, sciArmR = null, desk = null;
function drawScreen(t, mode) {
  sq.fillStyle = '#0b1a12'; sq.fillRect(0, 0, 512, 320); sq.fillStyle = '#7dff9a'; sq.font = '700 34px monospace'; sq.textAlign = 'left';
  sq.fillText('U-235 SHARE', 30, 60);
  const measured = mode === 'end' ? 1 : smooth(span(t, B.missing - .6, B.missing + .2));
  sq.font = '700 30px monospace'; sq.fillText('EXPECTED  0.720 %', 30, 140);
  sq.fillStyle = measured > .5 ? '#ff6b5e' : '#7dff9a'; sq.fillText('SAMPLE    ' + (measured > .02 ? (0.720 - 0.003 * measured).toFixed(3) : '-.---') + ' %', 30, 200);
  if (measured > .9 && Math.floor(t * 3) % 2 === 0) { sq.fillStyle = '#ff6b5e'; sq.fillText('MISMATCH', 30, 270); }
  screenTex.needsUpdate = true;
}
const camL = new THREE.PerspectiveCamera(38, W / H, .1, 100);
function updateLab(t, mode) {
  drawScreen(t, mode);
  if (mode === 'open') {
    const u = inOut(span(t, 0, 7.3)), lk = smooth(span(t, B.missing - .8, B.missing + .6));
    camL.position.set(lerp(2.6, 1.5, u), lerp(2.6, 1.9, u), lerp(7.2, 4.4, u)); camL.lookAt(lerp(0, .3, lk), lerp(1.3, 1.25, u), 0);
    if (sciHead) sciHead.rotation.y = lerp(.0, -.75, smooth(span(t, B.gabon, B.missing))) ; if (sciArmR) sciArmR.rotation.x = -.5 * smooth(span(t, B.missing, B.missing + .5));
  } else {
    const u = inOut(span(t, B.nuclear - .3, DURATION));
    camL.position.set(lerp(1.2, 3.4, u), lerp(1.8, 3.6, u), lerp(3.6, 9.5, u)); camL.lookAt(.2, lerp(1.3, 1.1, u), 0);
    if (sciHead) sciHead.rotation.y = lerp(-.6, .35, smooth(span(t, B.nobody2, B.built + .6))); if (sciArmR) sciArmR.rotation.x = -.3;
  }
  camL.updateMatrixWorld();
}

// =====================================================================
// EARTH (samples everywhere share 0.720 %)
// =====================================================================
const earthScene = new THREE.Scene(); earthScene.background = gradientTex([[0, '#070612'], [1, '#1c1640']]);
earthScene.add(new THREE.HemisphereLight('#cfe2ff', '#202040', 1.0));
const sun = new THREE.DirectionalLight('#fff4e0', 2.8); sun.position.set(-4, 3, 6); earthScene.add(sun);
{ const r = rng(8), a = []; for (let i = 0; i < 500; i++) { const th = r() * 6.283, ph = Math.acos(2 * r() - 1); a.push(40 * Math.sin(ph) * Math.cos(th), 40 * Math.cos(ph), 40 * Math.sin(ph) * Math.sin(th) - 10); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); earthScene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: '#fff', size: .08 }))); }
const earthGroup = new THREE.Group(); earthScene.add(earthGroup);
const SAMPLES = [[40, -100], [55, -110], [-25, 135], [48, 67], [-22, 15], [17, 8], [60, 100], [-10, -55], [62, 25], [30, 80]];
const GABON = [-1.5, 11.6];
const pinDir = ([lat, lon]) => { const a = (lon - 20) * Math.PI / 180, f = lat * Math.PI / 180; const x = Math.sin(a) * Math.cos(f), y = Math.sin(f), z = Math.cos(a) * Math.cos(f); return V(-x, y, -z); }; // model faces lon 20E at rotation pi
const pins = [];
function makePin(dir, color) { const g = new THREE.Group(); const rod = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, .22, 6), flat('#f0f0f0')); rod.position.y = .11; g.add(rod);
  const head = new THREE.Mesh(new THREE.IcosahedronGeometry(.045, 1), flat(color, { emissive: color, emissiveIntensity: .4 })); head.position.y = .23; g.add(head);
  g.position.copy(dir.clone().multiplyScalar(1.02)); g.quaternion.setFromUnitVectors(V(0, 1, 0), dir); g.userData = { dir, head }; earthGroup.add(g); return g; }
SAMPLES.forEach(s => pins.push(makePin(pinDir(s), '#7fe0a0')));
const gabonPin = makePin(pinDir(GABON), '#7fe0a0');
const camE = new THREE.PerspectiveCamera(32, W / H, .1, 200);
function earthRot(t) { return Math.PI + lerp(2.4, 0, inOut(span(t, B.natural - .3, B.this_ore + .9))); }
function updateEarth(t) {
  earthGroup.rotation.set(.18, earthRot(t), 0); const z = lerp(9.2, 6.4, inOut(span(t, B.this_ore - .2, B.less + .4)));
  camE.position.set(0, lerp(.4, -.1, span(t, B.natural, B.less)), z); camE.lookAt(0, -.05, 0); camE.updateMatrixWorld();
  pins.forEach((p, i) => { const u = outBack(span(t, B.everywhere - .3 + i * .17, B.everywhere + i * .17)); p.scale.setScalar(Math.max(.001, u)); });
  const gu = outBack(span(t, B.this_ore - .2, B.this_ore + .25)); gabonPin.scale.setScalar(Math.max(.001, gu) * 1.25);
  const bad = smooth(span(t, B.less - .3, B.less + .1)); gabonPin.userData.head.material.color.set(new THREE.Color('#7fe0a0').lerp(new THREE.Color(C.bad), bad)); gabonPin.userData.head.material.emissive.copy(gabonPin.userData.head.material.color);
}

// =====================================================================
// STUDIO (fuel rod vs rock; decay comparison; receipts)
// =====================================================================
const studio = new THREE.Scene(); studio.background = gradientTex([[0, '#1d2340'], [1, '#3b2c4d']]);
studio.add(new THREE.HemisphereLight('#d8d8ff', '#3a2a3a', 1.2));
const stKey = new THREE.DirectionalLight('#fff0dd', 2.4); stKey.position.set(3, 6, 6); stKey.castShadow = true; stKey.shadow.mapSize.set(2048, 2048); Object.assign(stKey.shadow.camera, { left: -5, right: 5, top: 6, bottom: -4 }); studio.add(stKey);
{ const plinth = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.4, .4, 40), flat('#2d2a45')); plinth.position.y = -.2; plinth.receiveShadow = true; studio.add(plinth); }
const fuelRod = new THREE.Group(); { const mat = flat('#9aa3ad', { metalness: .4, roughness: .45 }); for (let i = 0; i < 7; i++) { const a = i / 6 * 6.283, rr = i === 6 ? 0 : .22; const c = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, 2.6, 10), mat); c.position.set(Math.cos(a) * rr, 1.3, Math.sin(a) * rr); c.castShadow = true; fuelRod.add(c); }
  for (const y of [.3, 1.3, 2.3]) { const band = new THREE.Mesh(new THREE.CylinderGeometry(.36, .36, .08, 12), flat('#6b7480', { metalness: .5 })); band.position.y = y; fuelRod.add(band); } }
studio.add(fuelRod);
const studioRock = new THREE.Group(); studio.add(studioRock);
const specks = []; { const r = rng(55), m = new THREE.MeshStandardMaterial({ color: '#ffd36b', emissive: '#ffb53d', emissiveIntensity: .8 }); for (let i = 0; i < 26; i++) { const s = new THREE.Mesh(new THREE.IcosahedronGeometry(.035 + r() * .03, 0), m); const th = r() * 6.283, ph = r() * 1.4 + .2; s.position.set(Math.sin(ph) * Math.cos(th) * .72, .55 + Math.cos(ph) * .55, Math.sin(ph) * Math.sin(th) * .72); studioRock.add(s); specks.push(s); } }
// decay grids: 20x20 atoms; amber = U-235 share
const N = 400, gridGeo = new THREE.IcosahedronGeometry(.075, 0);
const amberMat = flat(C.uranium, { emissive: '#ff9a20', emissiveIntensity: .35 }), greyMat = flat(C.u238);
const grid = new THREE.InstancedMesh(gridGeo, greyMat, N), gridAmber = new THREE.InstancedMesh(gridGeo, amberMat, 16);
grid.castShadow = gridAmber.castShadow = true; studio.add(grid, gridAmber);
const AMBER_IDX = (() => { const r = rng(91), s = new Set(); while (s.size < 16) s.add(Math.floor(r() * N)); return [...s]; })();
const camS = new THREE.PerspectiveCamera(36, W / H, .1, 100); const dummy = new THREE.Object3D();
function updateStudio(t, mode) {
  fuelRod.visible = studioRock.visible = grid.visible = gridAmber.visible = false;
  if (mode === 'compare') {
    fuelRod.visible = studioRock.visible = true;
    const rodIn = outBack(span(t, B.like - .2, B.like + .35)), rodOut = smooth(span(t, B.nobody + .2, B.nobody + .8));
    fuelRod.position.set(-.8, lerp(4, 0, rodIn) - 5 * rodOut, 0); fuelRod.rotation.y = t * .3;
    const rockIn = outBack(span(t, B.but_rock - .1, B.but_rock + .4)); studioRock.position.set(lerp(4, .85, rockIn) - .85 * smooth(span(t, B.nobody + .4, B.nobody + 1.2)), 0, 0); studioRock.rotation.y = t * .2; studioRock.scale.setScalar(.9);
    camS.position.set(0, 2.4, 9.6); camS.lookAt(0, 1.2, 0);
  } else if (mode === 'decay') {
    grid.visible = gridAmber.visible = true;
    const share = lerp(3.0, 0.72, inOut(span(t, B.cant, B.enough))); const nAmber = Math.round(N * share / 100);
    let k = 0; for (let i = 0; i < N; i++) { const x = (i % 20 - 9.5) * .2, z = (Math.floor(i / 20) - 9.5) * .2; dummy.position.set(x, .12 + .02 * Math.sin(i * 1.7 + t), z); dummy.scale.setScalar(1); dummy.updateMatrix(); grid.setMatrixAt(i, dummy.matrix); }
    AMBER_IDX.forEach((idx, j) => { const x = (idx % 20 - 9.5) * .2, z = (Math.floor(idx / 20) - 9.5) * .2; const alive = j < nAmber ? 1 : 0, fadeU = clamp(N * share / 100 - j); dummy.position.set(x, .14, z); dummy.scale.setScalar(Math.max(.001, j < nAmber ? 1.25 : fadeU * 1.25)); dummy.updateMatrix(); gridAmber.setMatrixAt(j, dummy.matrix); });
    grid.instanceMatrix.needsUpdate = gridAmber.instanceMatrix.needsUpdate = true;
    const u = inOut(span(t, B.cant - .3, B.enough + .6)); camS.position.set(lerp(3.6, 2.2, u), lerp(5.6, 4.6, u), lerp(5.2, 4.4, u)); camS.lookAt(0, 0, 0);
  } else if (mode === 'receipts') {
    studioRock.visible = true; studioRock.position.set(0, 0, 0); studioRock.rotation.y = t * .15; studioRock.scale.setScalar(1.5);
    specks.forEach((s, i) => { s.material.emissiveIntensity = .6 + .5 * Math.sin(t * 3 + i); });
    const u = inOut(span(t, B.receipts - 1, B.fundamental)); camS.position.set(lerp(0, .5, u), lerp(2.2, 1.6, u), lerp(8.2, 9.4, u)); camS.lookAt(0, lerp(1.0, .2, u), 0);
  }
  camS.updateMatrixWorld();
}

// =====================================================================
// MACRO: barren surface 2 billion years ago + cutaway to the ore seam
// =====================================================================
const macro = new THREE.Scene(); macro.background = gradientTex([[0, '#1a1440'], [.45, '#4a2463'], [.75, '#c4566a'], [1, '#f0915e']]);
macro.add(new THREE.HemisphereLight('#8a6fd0', '#5a3a2a', 1.1));
const mKeyL = new THREE.DirectionalLight('#ffd2a0', 2.6); mKeyL.position.set(6, 7, 9); mKeyL.castShadow = true; mKeyL.shadow.mapSize.set(2048, 2048); Object.assign(mKeyL.shadow.camera, { left: -10, right: 10, top: 10, bottom: -12, near: 1, far: 40 }); macro.add(mKeyL);
{ const r = rng(5), a = []; for (let i = 0; i < 240; i++) a.push((r() - .5) * 90, 6 + r() * 40, -40 - r() * 10); const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); macro.add(new THREE.Points(g, new THREE.PointsMaterial({ color: '#fff', size: .22, transparent: true, opacity: .8 }))); }
{ const s = new THREE.Mesh(new THREE.IcosahedronGeometry(2.6, 2), new THREE.MeshBasicMaterial({ color: '#ffd27a' })); s.position.set(4, 1.2, -28); macro.add(s); }
for (const [x, z, s, col] of [[-9, -18, 7, '#2f2350'], [6, -20, 9, '#2a1f48'], [0, -14, 5, '#3a2a55']]) { const m = new THREE.Mesh(lowpolyRock(1, x * 7 + 3, 1), flat(col)); m.scale.set(s * 1.6, s * .55, s); m.position.set(x, -.4, z); macro.add(m); }
{ const g = new THREE.PlaneGeometry(16, 10, 24, 15); g.rotateX(-Math.PI / 2); const p = g.attributes.position, r = rng(9); for (let i = 0; i < p.count; i++) { if (p.getZ(i) < 4.9) p.setY(i, r() * .22); } g.computeVertexNormals(); const m = new THREE.Mesh(g, flat('#8c6a56')); m.receiveShadow = true; macro.add(m); }
{ const river = new THREE.Mesh(new THREE.PlaneGeometry(16, 2.2, 16, 2), new THREE.MeshStandardMaterial({ color: '#3f86c9', roughness: .2, metalness: .1, flatShading: true, transparent: true, opacity: .9 })); river.rotation.x = -Math.PI / 2; river.rotation.z = .18; river.position.set(0, .26, -1.2); macro.add(river); }
const mounds = []; { const r = rng(77); for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(lowpolyRock(.35 + r() * .25, 900 + i, 0), flat(i % 2 ? '#6f7f4a' : '#8a8a55')); m.scale.y = .45; const x = -6 + i * 1.5 + (r() - .5) * .6; m.position.set(x, .08, -1.2 + (x * -.18) + (r() < .5 ? -.9 : .9)); m.castShadow = true; macro.add(m); mounds.push(m); } }
macro.fog = new THREE.Fog('#b8607a', 22, 60);
for (const [top, bot, col] of [[0, -1.2, '#7a4a3a'], [-1.2, -3.0, '#9a6240'], [-3.0, -4.6, '#6e4a52'], [-4.6, -6.1, '#5a3550'], [-6.1, -8.0, '#4a2c45'], [-8.0, -11, '#33203d']]) { const m = new THREE.Mesh(new THREE.BoxGeometry(16, top - bot, 10), flat(col)); m.position.set(0, (top + bot) / 2, 0); m.receiveShadow = true; macro.add(m); }
const gwMat = new THREE.MeshStandardMaterial({ color: '#3aa6ff', transparent: true, opacity: .45, roughness: .3, emissive: '#1a4f8a', emissiveIntensity: .5 });
const gw = new THREE.Mesh(new THREE.BoxGeometry(16, 1.0, .08), gwMat); gw.position.set(0, -3.8, 5.04); macro.add(gw);
const seep = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1, .06), new THREE.MeshStandardMaterial({ color: '#3aa6ff', transparent: true, opacity: .55, emissive: '#1a4f8a', emissiveIntensity: .6 })); macro.add(seep);
const oreMat = new THREE.MeshStandardMaterial({ color: '#b8641a', emissive: '#ff8a1a', emissiveIntensity: .3, flatShading: true, roughness: .6 });
{ const lens = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 2), oreMat); lens.scale.set(3.3, .72, 1.2); lens.position.set(0, -7.0, 4.55); macro.add(lens); }
const crystalMat = new THREE.MeshStandardMaterial({ color: '#ffe39a', emissive: '#ffb53d', emissiveIntensity: .5, flatShading: true });
{ const r = rng(12); for (let i = 0; i < 18; i++) { const c = new THREE.Mesh(new THREE.OctahedronGeometry(.16 + r() * .18, 0), crystalMat); const x = (r() - .5) * 5.2; c.position.set(x, -7.0 + (r() - .5) * .9 * (1 - Math.abs(x) / 3.3), 5.08 + r() * .2); c.rotation.set(r() * 3, r() * 3, r() * 3); c.scale.y = 1.6; macro.add(c); } }
const oreLight = new THREE.PointLight('#ffa040', 0, 9, 1.6); oreLight.position.set(0, -7, 6.4); macro.add(oreLight);
const camM = new THREE.PerspectiveCamera(40, W / H, .1, 200);
// reactor state for the ore glow in the rhythm and today shots (0..1)
function rhythmGlow(t) { // accelerating on/off pulses, time compressed
  if (t < B.half - .3) return 1; const u = (t - (B.half - .3)); const period = lerp(1.6, .35, smooth(span(t, B.half, B.years1))); const ph = (u / period) % 1; return ph < .2 ? 1 : .15; }
function updateMacro(t, mode) {
  let pos, look;
  if (mode === 'surface') { const u = inOut(span(t, B.about2b - 1.1, B.close + 1.5)); pos = V(lerp(1.4, .6, u), lerp(3.4, 2.4, u), lerp(26, 22, u)); look = V(0, lerp(.6, .1, u), 0);
    oreMat.emissiveIntensity = .2; crystalMat.emissiveIntensity = .3; oreLight.intensity = 0; seep.visible = false;
  } else if (mode === 'dive') {
    const d = inOut(span(t, B.groundwater - .2, B.ore_soak + .2)); pos = V(.8, 2.4, 22).lerp(V(-.3, -5.6, 15.5), d); look = V(0, .1, 0).lerp(V(0, -6.2, 5), d);
    const z = inOut(span(t, B.ore_soak + .1, B.water_slows + .4)); pos.lerp(V(0, -7, 9), z); look.lerp(V(0, -7, 5), z);
    const s = smooth(span(t, B.groundwater + .4, B.ore_soak + .3)); seep.visible = s > 0; seep.scale.y = Math.max(.01, 2.6 * s); seep.position.set(0, -4.3 - 1.3 * s, 5.08);
    oreMat.emissiveIntensity = .2 + .2 * s; crystalMat.emissiveIntensity = .3 + .3 * s; oreLight.intensity = 2 * s;
  } else if (mode === 'rhythm' || mode === 'today') {
    const u = inOut(span(t, B.half - .4, B.years1 + .4)); pos = V(0, -6.3, lerp(10.5, 15.5, u)); look = V(0, -6.6, 5);
    const g = mode === 'rhythm' ? rhythmGlow(t) : lerp(.6, .05, smooth(span(t, B.cant - .2, B.today + .8))); seep.visible = true; seep.scale.y = 2.6; seep.position.set(0, -5.6, 5.08);
    oreMat.emissiveIntensity = .15 + .6 * g; crystalMat.emissiveIntensity = .2 + .8 * g; oreLight.intensity = 6 * g;
  }
  pos.x += .2 * Math.sin(t * .5); camM.position.copy(pos); camM.lookAt(look); camM.updateMatrixWorld();
}

// =====================================================================
// MICRO: inside the ore
// =====================================================================
const P = (x, y, z = 0) => V((x - 540) / 100, -(y - 960) / 100, z);
const micro = new THREE.Scene(); micro.background = new THREE.Color('#1c1124');
const uHemi = new THREE.HemisphereLight('#b9a0ff', '#3a1a22', 1.2); micro.add(uHemi);
{ const k = new THREE.DirectionalLight('#ffe2c0', 2.2); k.position.set(-6, 8, 10); micro.add(k); }
const reactorLight = new THREE.PointLight('#ff8a3a', 0, 30, 1.2); reactorLight.position.set(0, 1, 6); micro.add(reactorLight);
const rockMats = ['#4a2d3e', '#5a3646', '#6a404c', '#553447'].map(c => flat(c, { emissive: '#ff3a1a', emissiveIntensity: 0 }));
{ const r = rng(20261019); for (let gy = -60; gy < H + 120; gy += 130) for (let gx = -60; gx < W + 120; gx += 140) { const m = new THREE.Mesh(lowpolyRock(.55 + r() * .25, Math.floor(r() * 1e6), 0), rockMats[Math.floor(r() * 4)]); m.position.copy(P(gx + (r() - .5) * 60, gy + (r() - .5) * 60, -1.1 - r() * .8)); m.rotation.set(r() * 3, r() * 3, r() * 3); micro.add(m); } }
const NUC = { A: [300, 520], B: [720, 360], C: [650, 700], D: [900, 560], E: [360, 1290], F: [790, 1360], G: [250, 1640], H: [640, 1640] };
// fission times: first cascade, then the restart
const S1 = B.split, SPLIT = { A: S1, C: S1 + 1.0, B: S1 + 1.15, D: S1 + 1.7, E: B.chain + .2, F: B.chain + .9, H: B.again - .1 };
const protonMat = flat(C.proton, { emissive: '#ff5a1a', emissiveIntensity: .15, roughness: .5 }), nMatN = flat(C.uranium, { emissive: '#ffa020', emissiveIntensity: .15, roughness: .5 });
const nucleonGeo = new THREE.IcosahedronGeometry(.17, 1);
function nucleusGroup(n, seed) { const g = new THREE.Group(), r = rng(seed); for (let i = 0; i < n; i++) { const a = i * 2.39996, d = Math.sqrt((i + .5) / n), u = r() * 2 - 1, rad = n > 20 ? .58 : .42; const m = new THREE.Mesh(nucleonGeo, r() < .43 ? protonMat : nMatN); m.position.set(Math.cos(a) * d * rad * Math.sqrt(1 - u * u), Math.sin(a) * d * rad * Math.sqrt(1 - u * u), u * d * rad); g.add(m); } return g; }
const nuclei = {}; for (const [k, [x, y]] of Object.entries(NUC)) { const whole = nucleusGroup(34, x + y), fa = nucleusGroup(17, x), fb = nucleusGroup(17, y), root = new THREE.Group(); root.position.copy(P(x, y, .2)); root.add(whole, fa, fb); micro.add(root); nuclei[k] = { root, whole, fa, fb }; }
const halos = {}; for (const [k, [x, y]] of Object.entries(NUC)) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: .32, blending: THREE.AdditiveBlending, depthWrite: false })); s.position.copy(P(x, y, -.1)); s.scale.setScalar(2.4); micro.add(s); halos[k] = s; }
const flashes = {}; for (const k of Object.keys(SPLIT)) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false })); s.position.copy(P(...NUC[k], .8)); micro.add(s); flashes[k] = s; }
{ const r = rng(44); for (let i = 0; i < 22; i++) { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(.11 + r() * .08, 0), nMatN); m.position.copy(P(r() * W, r() * H, -.5)); micro.add(m); } }
const PORES = [{ id: 'P1', x: 470, y: 600, r: 92 }, { id: 'P2', x: 870, y: 380, r: 78 }, { id: 'P3', x: 470, y: 1520, r: 104 }, { id: 'P4', x: 960, y: 1560, r: 80 }, { id: 'P5', x: 140, y: 1330, r: 70 }, { id: 'P6', x: 160, y: 300, r: 66 }];
const waterMat = new THREE.MeshStandardMaterial({ color: C.water, transparent: true, opacity: .82, roughness: .15, flatShading: true, emissive: '#0a3a80', emissiveIntensity: .35 });
for (const p of PORES) { const cav = new THREE.Mesh(new THREE.CircleGeometry(p.r / 100 * 1.05, 9), new THREE.MeshBasicMaterial({ color: '#0d0712' })); cav.position.copy(P(p.x, p.y, -.35)); micro.add(cav); const w = new THREE.Mesh(lowpolyRock(p.r / 100, p.x * 3 + p.y, 1), waterMat); w.position.copy(P(p.x, p.y, -.2)); w.scale.z = .5; micro.add(w); p.mesh = w; }
// water level: full, boiled away, refilled
const water = t => (1 - smooth(span(t, B.boiled, B.without + .6))) + smooth(span(t, B.seeped - .2, B.switched - .3));
const heat = t => smooth(span(t, S1 + .3, B.heat + .6)) * (1 - smooth(span(t, B.cooled - .3, B.seeped))) + .55 * smooth(span(t, B.again, B.half));
const glow = t => { const n = Object.values(SPLIT).filter(s => t >= s && s < B.heat).length / 6; const off = smooth(span(t, B.without, B.stopped + .4)); const on2 = smooth(span(t, B.again - .2, B.half)); return clamp(n * (1 - off) + .8 * on2); };
const bubbleMat = new THREE.MeshStandardMaterial({ color: '#dff0ff', transparent: true, opacity: .7, roughness: .1, flatShading: true });
const bubbles = []; { const br = rng(33); for (let i = 0; i < 80; i++) { const p = PORES[i % PORES.length]; const m = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), bubbleMat.clone()); micro.add(m); bubbles.push({ m, p, born: B.boiled - .2 + br() * 2.6, life: .9 + br() * .7, dx: (br() - .5) * p.r, sz: 7 + br() * 12, i }); } }
const nMat = new THREE.MeshBasicMaterial({ color: C.neutron }), trailMat = new THREE.MeshBasicMaterial({ color: C.neutron, transparent: true, opacity: .45 });
const FLIGHTS = [
  { a: [-40, 1470], b: [380, 1500], t0: B.water_slows - .2, t1: B.water_slows + .25 }, { a: [380, 1500], b: [560, 1545], t0: B.water_slows + .25, t1: B.neutrons + .9, slow: 1 },
  { a: [560, 1545], b: [400, 760], t0: B.neutrons + .9, t1: S1 - .55 }, { a: [400, 760], b: NUC.A, t0: S1 - .55, t1: S1 },
  { a: NUC.A, b: NUC.C, t0: S1, t1: SPLIT.C }, { a: NUC.A, b: NUC.B, t0: S1, t1: SPLIT.B }, { a: NUC.C, b: NUC.D, t0: SPLIT.C, t1: SPLIT.D }, { a: NUC.C, b: NUC.E, t0: SPLIT.C, t1: SPLIT.E },
  { a: NUC.E, b: NUC.F, t0: SPLIT.E, t1: SPLIT.F }, { a: NUC.D, b: [1140, 120], t0: SPLIT.D, t1: SPLIT.D + .35 }, { a: NUC.F, b: [1140, 1180], t0: SPLIT.F, t1: SPLIT.F + .35 }, { a: NUC.B, b: [820, -60], t0: SPLIT.B, t1: SPLIT.B + .35 },
  { a: [-60, 1700], b: [1140, 1560], t0: B.without + .2, t1: B.without + .5, fast: 1 }, { a: [-60, 420], b: [1140, 640], t0: B.without + .5, t1: B.without + .8, fast: 1 }, { a: [1140, 1260], b: [-60, 1420], t0: B.stopped - .3, t1: B.stopped, fast: 1 },
  { a: [-40, 1500], b: [470, 1520], t0: B.switched - .6, t1: B.switched - .2 }, { a: [470, 1520], b: NUC.H, t0: B.switched - .2, t1: SPLIT.H, slow: 1 }];
for (const f of FLIGHTS) { f.ball = new THREE.Mesh(new THREE.IcosahedronGeometry(.13, 1), nMat); f.trail = new THREE.Mesh(new THREE.CylinderGeometry(.07, 0, 1, 6), trailMat); micro.add(f.ball, f.trail); }
const camU = new THREE.PerspectiveCamera(43.6, W / H, .1, 100);
function updateMicro(t) {
  camU.position.set(.15 * Math.sin(t * .5), .1 * Math.cos(t * .4), lerp(24, 22.3, smooth(span(t, B.water_slows, B.half)))); camU.lookAt(0, 0, 0); camU.updateMatrixWorld();
  const h = heat(t), g = glow(t), wl = clamp(water(t));
  rockMats.forEach(m => m.emissiveIntensity = .06 * h); micro.background.set(new THREE.Color('#1c1124').lerp(new THREE.Color('#3a1520'), h));
  reactorLight.intensity = 45 * g; uHemi.color.set(new THREE.Color('#b9a0ff').lerp(new THREE.Color('#ffb08a'), h));
  for (const [k, n] of Object.entries(nuclei)) {
    const s = SPLIT[k], split = s !== undefined && t >= s, bx = (NUC[k][0] - 540) / 100, by = -(NUC[k][1] - 960) / 100;
    n.whole.visible = !split; n.fa.visible = n.fb.visible = split; n.root.rotation.set(.3 * Math.sin(t * .7 + bx), t * .35 + by, 0);
    const pre = (!split && s !== undefined) ? smooth(span(t, s - .1, s)) : 0; n.root.position.x = bx + .03 * pre * Math.sin(t * 90);
    if (split) { const u = span(t, s, s + .9), d = (26 + 70 * outBack(u)) / 100; n.fa.position.set(-d * .8, d * .5, 0); n.fb.position.set(d * .8, -d * .5, 0); n.fa.scale.setScalar(1 - .2 * u); n.fb.scale.setScalar(1 - .2 * u); }
    halos[k].material.opacity = (split ? .12 : .32);
    if (flashes[k]) { const f = split ? 1 - span(t, s, s + .4) : 0; flashes[k].material.opacity = f; flashes[k].scale.setScalar(.1 + 5.5 * f); }
  }
  for (const p of PORES) { p.mesh.visible = wl > .02; p.mesh.scale.set(.25 + .75 * wl, .15 + .85 * wl, .5 * wl + .05); p.mesh.position.y = -(p.y - 960) / 100 - (1 - wl) * p.r / 100 * .6; }
  for (const b of bubbles) { const u = (t - b.born) / b.life, on = u >= 0 && u <= 1; b.m.visible = on; if (!on) continue; const y = b.p.y + b.p.r * .5 - u * (b.p.r * 1.6 + 120), x = b.p.x + b.dx + 8 * Math.sin(u * 9 + b.i); b.m.position.copy(P(x, y, .3)); b.m.scale.setScalar(b.sz / 100 * (u < .45 ? 1 : 1.4 + u)); b.m.material.opacity = .75 * (1 - u); }
  for (const f of FLIGHTS) { const on = t >= f.t0 && t <= f.t1; f.ball.visible = f.trail.visible = on; if (!on) continue; const u = (t - f.t0) / (f.t1 - f.t0), a = P(...f.a, .5), b = P(...f.b, .5), pos = a.clone().lerp(b, u), dir = b.clone().sub(a).normalize(); f.ball.position.copy(pos); const len = f.slow ? .25 : f.fast ? 2.4 : 1.1; f.trail.scale.set(1, len, 1); f.trail.position.copy(pos.clone().addScaledVector(dir, -len / 2)); f.trail.quaternion.setFromUnitVectors(V(0, -1, 0), dir); }
}

// =====================================================================
// 2D overlays
// =====================================================================
function tag(text, x, y, tx, ty, a) {
  if (a <= 0) return; q.save(); q.globalAlpha = a; q.strokeStyle = C.tag; q.lineWidth = 4; q.lineCap = 'round'; q.beginPath(); q.moveTo(x, y); q.lineTo(tx, ty); q.stroke();
  q.fillStyle = C.tag; q.beginPath(); q.arc(tx, ty, 7, 0, 6.283); q.fill(); q.font = '700 40px Manrope'; q.textAlign = x < tx ? 'right' : 'left'; q.textBaseline = 'middle';
  q.lineJoin = 'round'; q.lineWidth = 9; q.strokeStyle = C.edge; const X = x + (x < tx ? -12 : 12); q.strokeText(text, X, y); q.fillText(text, X, y); q.restore();
}
function label(text, x, y, a, { size = 44, color = '#fff', align = 'center', weight = 800 } = {}) { if (a <= 0) return; q.save(); q.globalAlpha = a; q.font = `${weight} ${size}px Manrope`; q.textAlign = align; q.textBaseline = 'middle'; q.lineJoin = 'round'; q.lineWidth = Math.max(8, size * .2); q.strokeStyle = C.edge; q.strokeText(text, x, y); q.fillStyle = color; q.fillText(text, x, y); q.restore(); }
function chip(text, value, x, y, on, a) { if (a <= 0) return; q.save(); q.globalAlpha = a; q.fillStyle = 'rgba(20,12,34,.86)'; q.beginPath(); q.roundRect(x, y, 330, 84, 42); q.fill(); q.fillStyle = on ? C.ore : '#6b6b7a'; q.beginPath(); q.arc(x + 48, y + 42, 18, 0, 6.283); q.fill(); q.font = '700 30px Manrope'; q.fillStyle = 'rgba(255,255,255,.75)'; q.textAlign = 'left'; q.textBaseline = 'middle'; q.fillText(text, x + 82, y + 42); q.font = '800 40px Manrope'; q.fillStyle = on ? C.ore : '#cfd0dc'; q.fillText(value, x + 228, y + 43); q.restore(); }
function vgauge(x, y0, y1, level, color, name, a, marks = []) { if (a <= 0) return; q.save(); q.globalAlpha = a; q.fillStyle = '#1b1024'; q.beginPath(); q.roundRect(x - 26, y0 - 26, 52, y1 - y0 + 52, 26); q.fill(); q.fillStyle = color; const top = lerp(y1, y0, clamp(level)); if (level > .005) { q.beginPath(); q.roundRect(x - 12, top, 24, y1 + 12 - top, 12); q.fill(); }
  for (const [lv, txt, col] of marks) { const y = lerp(y1, y0, lv); q.strokeStyle = col; q.lineWidth = 4; q.beginPath(); q.moveTo(x - 34, y); q.lineTo(x + 34, y); q.stroke(); q.font = '700 30px Manrope'; q.fillStyle = col; q.textAlign = 'left'; q.textBaseline = 'middle'; q.lineWidth = 8; q.strokeStyle = C.edge; q.strokeText(txt, x + 46, y); q.fillText(txt, x + 46, y); }
  q.font = '700 30px Manrope'; q.fillStyle = color; q.textAlign = 'center'; q.fillText(name, x + 4, y1 + 64); q.restore(); }
function counter(title, value, a, y = 330) { if (a <= 0) return; q.save(); q.globalAlpha = a; q.textAlign = 'center'; q.textBaseline = 'middle'; q.font = '700 30px Manrope'; q.fillStyle = 'rgba(255,255,255,.75)'; q.lineJoin = 'round'; q.lineWidth = 8; q.strokeStyle = C.edge; q.strokeText(title, 540, y - 54); q.fillText(title, 540, y - 54); q.font = '800 92px Manrope'; q.lineWidth = 16; q.strokeText(value, 540, y + 10); q.fillStyle = '#fff'; q.fillText(value, 540, y + 10); q.restore(); }
const KEYWORDS = [
  { s: '1972', t0: .25, t1: B.gabon - .1 }, { s: 'OKLO MINE, GABON', t0: B.gabon, t1: B.natural - .1 },
  { s: 'NOBODY BUILT IT', t0: B.nobody, t1: B.about2b - .4, c: C.tag },
  { s: 'CHAIN REACTION', t0: B.chain, t1: B.heat - .1, c: C.ore }, { s: 'BOILING', t0: B.boiled, t1: B.without, c: C.waterHi }, { s: 'OFF', t0: B.stopped - .2, t1: B.cooled, c: '#cfd0dc' },
  { s: 'ON AGAIN', t0: B.switched, t1: B.half - .1, c: C.ore }, { s: 'TOO LITTLE FUEL', t0: B.natural2, t1: B.enough + .7, c: C.bad },
  { s: 'THE NUCLEAR REACTOR', t0: B.nobody2 - .4, t1: DURATION, y: 230 }, { s: 'NOBODY BUILT', t0: B.nobody2 - .2, t1: DURATION, y: 330, c: C.ore }];
function overlays(t, shot) {
  const fmtYears = n => n.toLocaleString('en-US');
  if (shot === 'lab1') { const v = project(camL, V(.8, 1.3, .2)); tag('uranium sample', v[0] - 120, v[1] - 300, v[0], v[1], win(t, B.uranium1, B.gabon + .6)); const s = project(camL, V(.0, 1.3, .4)); tag('U-235 share', s[0] + 120, s[1] + 330, s[0], s[1], win(t, B.missing - .2, B.natural - .1)); }
  if (shot === 'earth') {
    const up = outBack(span(t, B.everywhere, B.everywhere + .3));
    pins.forEach((p, i) => { const w = p.getWorldPosition(V(0, 0, 0)).clone(); const dir = w.clone().normalize(); if (dir.z < .25) return; const s = project(camE, p.userData.head.getWorldPosition(V(0, 0, 0))); label('0.720 %', s[0], s[1] - 44, win(t, B.everywhere + i * .17, B.this_ore + .2) * smooth((dir.z - .25) * 4), { size: 38, color: C.good }); });
    const g = project(camE, gabonPin.userData.head.getWorldPosition(V(0, 0, 0))); const bad = smooth(span(t, B.less - .3, B.less + .1));
    label(bad > .5 ? 'GABON 0.717 %' : 'GABON', g[0], g[1] - 70, win(t, B.this_ore + .1, B.like, .2), { size: 50, color: bad > .5 ? C.bad : '#fff' });
    counter('U-235 SHARE OF NATURAL URANIUM', '0.72 %', win(t, B.share, B.this_ore - .1));
  }
  if (shot === 'compare') { const r = project(camS, fuelRod.getWorldPosition(V(0, 2.8, 0))); label('used reactor fuel', r[0], r[1] - 40, win(t, B.like + .3, B.nobody + .3), { size: 38, color: C.tag }); const k = project(camS, studioRock.getWorldPosition(V(0, 1.3, 0))); label('ore from Gabon', k[0], k[1] - 30, win(t, B.but_rock + .3, B.about2b - .4), { size: 38, color: C.tag }); }
  if (shot === 'surface') {
    const ago = Math.round(lerp(54, 2e9, inOut(span(t, B.about2b - .5, B.ago + .4)))); counter('YEARS AGO', fmtYears(ago), win(t, B.about2b - .7, B.groundwater, .3));
    const share = lerp(.0072, .03, inOut(span(t, B.richer, B.three + .5))); vgauge(110, 1180, 1700, share / .05, C.ore, 'U-235', win(t, B.richer - .2, B.groundwater + .2), [[.0072 / .05, '0.72 % today', '#cfd0dc'], [.04 / .05, 'reactor fuel 3–5 %', C.good]].filter((m, i) => i === 0 || t > B.close - .2));
    label((share * 100).toFixed(1) + ' %', 110, 1120, win(t, B.richer, B.groundwater + .2), { size: 46, color: C.ore });
    if (mounds[4]) { const m = project(camM, mounds[4].position.clone().add(V(0, .2, 0))); tag('only microbial life', m[0] - 60, m[1] + 210, m[0], m[1], win(t, B.about2b + .6, B.richer)); }
  }
  if (shot === 'dive') { const g = project(camM, V(.4, -3.8, 5.05)); tag('groundwater', g[0] - 160, g[1] + 170, g[0], g[1], win(t, B.groundwater + .1, B.ore_soak)); const o = project(camM, V(.6, -6.75, 5.1)); tag('uranium ore', o[0] - 170, o[1] - 260, o[0], o[1], win(t, B.ore_soak - .2, B.water_slows + .2)); }
  if (shot === 'micro') {
    const w3 = project(camU, P(470, 1520, .3)); tag('water slows the neutron', w3[0] + 130, w3[1] - 320, w3[0] - 20, w3[1] - 20, win(t, B.water_slows + .3, B.split - .2));
    const a = project(camU, P(...NUC.A, .2)); tag('uranium-235', a[0] + 260, a[1] - 260, a[0] + 20, a[1] - 40, win(t, B.neutrons, B.split + .2));
    tag('too fast to split', 640, 1220, 470, 1585, win(t, B.without + .3, B.cooled));
    chip('REACTOR', glow(t) > .3 ? 'ON' : 'OFF', 40, 380, glow(t) > .3, smooth(span(t, B.water_slows, B.water_slows + .3)));
    vgauge(90, 1250, 1690, clamp(water(t)), C.water, 'WATER', smooth(span(t, B.heat - .4, B.heat)));
    vgauge(990, 1250, 1690, .12 + .88 * heat(t), C.heat, 'HEAT', smooth(span(t, B.heat - .4, B.heat)));
    label('Illustration · not to scale', 40, 1860, .7, { size: 26, align: 'left', weight: 600 });
  }
  if (shot === 'rhythm') {
    const on = rhythmGlow(t) > .5; chip('REACTOR', on ? 'ON' : 'OFF', 375, 560, on, smooth(span(t, B.half - .3, B.half)));
    label('≈ 30 min ON', 300, 720, win(t, B.half, B.years1 + .2), { size: 40, color: C.ore }); label('≈ 2.5 h OFF', 780, 720, win(t, B.off - .2, B.years1 + .2), { size: 40, color: '#cfd0dc' });
    const yrs = Math.round(lerp(0, 150000, smooth(span(t, B.hundred - 1, B.years1 + .5)))); counter('YEARS OF OPERATION', fmtYears(yrs) + (yrs >= 100000 ? '+' : ''), win(t, B.hundred - 1.1, B.cant - .1));
    label('time sped up · estimate', 540, 1860, .7, { size: 26, weight: 600 });
  }
  if (shot === 'today') {
    const ago = Math.round(lerp(2e9, 0, inOut(span(t, B.cant - .2, B.today + .5)))); counter(ago > 0 ? 'YEARS AGO' : '', ago > 0 ? fmtYears(ago) : 'TODAY', win(t, B.cant - .4, B.decays - .1, .2));
  }
  if (shot === 'decay') {
    const share = lerp(3.0, .72, inOut(span(t, B.cant, B.enough))); counter('U-235 SHARE', share.toFixed(2) + ' %', 1, 300);
    label('U-235 half life ≈ 0.7 billion years', 540, 1360, win(t, B.decays, B.receipts - .5), { size: 36, color: C.ore }); label('U-238 half life ≈ 4.5 billion years', 540, 1430, win(t, B.rest - .4, B.receipts - .5), { size: 36, color: '#cfd0dc' });
    label('Illustration · 400 atoms, not to scale', 540, 1860, .7, { size: 26, weight: 600 });
  }
  if (shot === 'receipts') {
    const k = project(camS, studioRock.getWorldPosition(V(0, 0, 0)).add(V(.9, 1.6, .9))); tag('fission leftovers', k[0] + 140, k[1] - 220, k[0], k[1], win(t, B.leftovers - .3, B.fundamental + .4));
    const a = win(t, B.fundamental, DURATION, .3), hold = smooth(span(t, B.changed, B.changed + .5));
    if (a > 0) { q.save(); q.globalAlpha = a; q.fillStyle = 'rgba(20,12,34,.88)'; q.beginPath(); q.roundRect(120, 1180, 840, 520, 40); q.fill(); q.restore();
      label('fine structure constant  α ≈ 1/137', 540, 1250, a, { size: 40, color: '#fff' });
      q.save(); q.globalAlpha = a; q.strokeStyle = 'rgba(255,255,255,.3)'; q.lineWidth = 3; q.strokeRect(190, 1330, 700, 180); q.fillStyle = 'rgba(127,224,160,.25)'; q.fillRect(190, 1420 - 6 * hold, 700, 12 * hold);
      q.strokeStyle = C.good; q.lineWidth = 6; q.beginPath(); q.moveTo(190, 1420); q.lineTo(190 + 700 * smooth(span(t, B.changed, B.twob + .6)), 1420); q.stroke(); q.restore();
      label('2 billion years ago', 230, 1560, a * smooth(span(t, B.twob - .2, B.twob + .3)), { size: 30, align: 'left', color: '#cfd0dc', weight: 700 }); label('today', 850, 1560, a * smooth(span(t, B.twob - .2, B.twob + .3)), { size: 30, align: 'right', color: '#cfd0dc', weight: 700 });
      label('changed by less than 1 part in 10,000,000', 540, 1640, a * smooth(span(t, B.less2, B.less2 + .4)), { size: 34, color: C.good }); }
  }
  for (const k of KEYWORDS) { if (t < k.t0 || t > k.t1) continue; const a = smooth(span(t, k.t0, k.t0 + .25)) * (1 - smooth(span(t, k.t1 - .2, k.t1))), sc = .7 + .3 * outBack(span(t, k.t0, k.t0 + .35));
    q.save(); q.globalAlpha = a; q.translate(540, k.y || 190); q.scale(sc, sc); q.font = '800 80px Manrope'; q.textAlign = 'center'; q.textBaseline = 'middle'; q.lineJoin = 'round'; q.lineWidth = 14; q.strokeStyle = C.edge; q.strokeText(k.s, 0, 0); q.fillStyle = k.c || '#fff'; q.fillText(k.s, 0, 0); q.restore(); }
  for (const c of CAPTIONS) { if (t < c.t0 || t > c.t1) continue; const a = smooth(span(t, c.t0, c.t0 + .12)) * (1 - smooth(span(t, c.t1 - .1, c.t1)));
    q.save(); q.globalAlpha = a; q.font = '800 60px Manrope'; q.textAlign = 'center'; q.textBaseline = 'middle'; const words = c.s.split(' '), L = []; let cur = ''; for (const x of words) { const tr = cur ? cur + ' ' + x : x; if (q.measureText(tr).width > 880 && cur) { L.push(cur); cur = x; } else cur = tr; } L.push(cur);
    const y0 = 960 - (L.length - 1) * 37; L.forEach((l, i) => { q.lineJoin = 'round'; q.lineWidth = 12; q.strokeStyle = C.edge; q.strokeText(l, 540, y0 + i * 74); q.fillStyle = '#fff'; q.fillText(l, 540, y0 + i * 74); }); q.restore(); }
}

// =====================================================================
// shot list
// =====================================================================
function shotAt(t) {
  if (t < B.natural - .15) return 'lab1';
  if (t < B.like - .15) return 'earth';
  if (t < B.about2b - .9) return 'compare';
  if (t < B.groundwater - .2) return 'surface';
  if (t < B.water_slows - .25) return 'dive';
  if (t < B.half - .4) return 'micro';
  if (t < B.cant - .25) return 'rhythm';
  if (t < B.decays - .25) return 'today';
  if (t < B.receipts - 1.2) return 'decay';
  if (t < B.nuclear - .35) return 'receipts';
  return 'lab2';
}
function renderShot(shot, t) {
  if (shot === 'lab1' || shot === 'lab2') { updateLab(t, shot === 'lab1' ? 'open' : 'end'); renderer.render(lab, camL); }
  else if (shot === 'earth') { updateEarth(t); renderer.render(earthScene, camE); }
  else if (shot === 'compare' || shot === 'decay' || shot === 'receipts') { updateStudio(t, shot); renderer.render(studio, camS); }
  else if (shot === 'micro') { updateMicro(t); renderer.render(micro, camU); }
  else { updateMacro(t, shot); renderer.render(macro, camM); }
  q.drawImage(renderer.domElement, 0, 0);
}
function renderScene(t) {
  q.setTransform(1, 0, 0, 1, 0, 0); q.clearRect(0, 0, W, H);
  const shot = shotAt(t);
  if (shot === 'micro' && t < B.water_slows + .45) { // iris from the seam into the ore interior
    updateMacro(t, 'dive'); renderer.render(macro, camM); q.drawImage(renderer.domElement, 0, 0);
    const c = project(camM, V(0, -7, 5)), R = 1300 * inOut(span(t, B.water_slows - .25, B.water_slows + .45)) + 1;
    updateMicro(t); renderer.render(micro, camU); q.save(); q.beginPath(); q.arc(c[0], c[1], R, 0, 6.283); q.clip(); q.drawImage(renderer.domElement, 0, 0); q.restore();
    q.strokeStyle = C.ore; q.lineWidth = 14; q.beginPath(); q.arc(c[0], c[1], R, 0, 6.283); q.stroke();
  } else renderShot(shot, t);
  // short dip to dark on cuts between unrelated contexts
  const cuts = [B.natural - .15, B.like - .15, B.about2b - .9, B.half - .4, B.decays - .25, B.receipts - 1.2, B.nuclear - .35];
  for (const c of cuts) { const d = Math.abs(t - c); if (d < .12) { q.fillStyle = `rgba(8,6,16,${(1 - d / .12) * .85})`; q.fillRect(0, 0, W, H); } }
  overlays(t, shot);
  const fo = smooth(span(t, DURATION - .6, DURATION)); if (fo > 0) { q.fillStyle = `rgba(8,6,16,${fo})`; q.fillRect(0, 0, W, H); }
}
window.renderFrame = i => { const t = i / FPS; renderScene(t); return t; };

window.ready = (async () => {
  for (const [u, w] of [['/assets/fonts/Manrope800.ttf', '800'], ['/assets/fonts/Manrope.ttf', '200 800']]) { const f = new FontFace('Manrope', `url(${u})`, { weight: w }); await f.load(); document.fonts.add(f); }
  await document.fonts.ready;
  const [sci, deskM, shelf, cabinet, chair, earth, rockS, boulder, cluster, frac] = await Promise.all(['scientist_labcoat', 'office_desk', 'bookshelf', 'glass_cabinet', 'office_chair', 'earth', 'rock_small', 'boulder_large', 'rock_cluster', 'fractured_rock'].map(loadOBJ));
  // lab layout (sizes normalised from bounding boxes)
  const fit = (o, h) => { const b = new THREE.Box3().setFromObject(o), s = h / (b.max.y - b.min.y); o.scale.setScalar(s); return o; };
  desk = fit(deskM.clone(), .78); desk.position.set(.3, 0, 0); lab.add(desk);
  instrument.position.set(.1, .78, .05); lab.add(instrument);
  const sh = fit(shelf.clone(), 2.2); sh.position.set(-2.3, 0, -2.2); lab.add(sh);
  const cb = fit(cabinet.clone(), 2.0); cb.position.set(2.6, 0, -2.1); lab.add(cb);
  const ch = fit(chair.clone(), 1.0); ch.position.set(-.4, 0, .9); ch.rotation.y = 2.6; lab.add(ch);
  scientist = fit(sci, 1.8); scientist.position.set(-.65, 0, .7); scientist.rotation.y = .6; lab.add(scientist);
  // simple rig: head group and right arm pivots (part names from the asset's own groups)
  const parts = {}; scientist.traverse(o => { if (o.isMesh) parts[o.name] = o; });
  scientist.updateMatrixWorld(true);
  sciHead = new THREE.Group(); sciHead.position.set(0, 1.56, 0); scientist.add(sciHead); ['head', 'face', 'hair', 'neck'].forEach(n => parts[n] && sciHead.attach(parts[n]));
  sciArmR = new THREE.Group(); sciArmR.position.set(-.23, 1.456, .005); scientist.add(sciArmR); ['arm_R', 'sleeve_R', 'hand_R'].forEach(n => parts[n] && sciArmR.attach(parts[n]));
  // earth
  const eb = new THREE.Box3().setFromObject(earth), ec = eb.getCenter(V(0, 0, 0)); earth.position.sub(ec); earthGroup.add(earth);
  // studio rock (ore)
  const rk = frac.clone(); fit(rk, 1.1); rk.traverse(o => { if (o.isMesh) o.material = flat('#5d4a3e'); }); studioRock.add(rk);
  // macro props
  const place = (src, x, z, sc, ry) => { const o = src.clone(); o.position.set(x, 0, z); o.scale.setScalar(sc); o.rotation.y = ry; macro.add(o); };
  const rr = rng(3); for (let i = 0; i < 7; i++) place(boulder, (rr() - .5) * 13, (rr() - .5) * 7 + .8, .16 + rr() * .2, rr() * 6);
  for (let i = 0; i < 10; i++) place(cluster, (rr() - .5) * 14, (rr() - .5) * 8 + .6, .14 + rr() * .14, rr() * 6);
  for (let i = 0; i < 14; i++) place(rockS, (rr() - .5) * 14, (rr() - .5) * 8 + .8, .12 + rr() * .12, rr() * 6);
  const fr = rng(17); for (let i = 0; i < 16; i++) { const o = frac.clone(); o.scale.setScalar(.12 + fr() * .12); o.position.set((fr() - .5) * 12, -1 - fr() * 8.5, 5.25); if (Math.abs(o.position.y + 7) < 1.1) o.position.y -= 1.6; o.rotation.set(fr() * 3, fr() * 3, fr() * 3); macro.add(o); }
  return FRAMES;
})();
