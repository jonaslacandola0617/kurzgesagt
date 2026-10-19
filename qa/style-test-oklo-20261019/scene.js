// Oklo style test: deterministic illustrated scene. Pure function of time.
// Output 1080x1920 @30fps; picture state evaluated at 12 states/s.
(function (root) {
'use strict';
const W = 1080, H = 1920, FPS = 30, SCENE_FPS = 12;
const VO = 0.25;                 // narration placement offset (s)
const DURATION = 12.4;           // 11.36 s speech + 0.25 lead + 0.79 protected tail

// ---------- helpers ----------
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, u) => a + (b - a) * u;
const smooth = u => { u = clamp(u); return u * u * (3 - 2 * u); };
const inOut = u => { u = clamp(u); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
const outBack = u => { u = clamp(u); const c = 1.6; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
const span = (t, a, b) => clamp((t - a) / (b - a));
const mixHex = (h1, h2, u) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const a = p(h1), b = p(h2); return 'rgb(' + a.map((v, i) => Math.round(lerp(v, b[i], u))).join(',') + ')'; };

// ---------- palette (scientific roles) ----------
const C = {
  skyTop: '#1a1440', skyMid: '#4a2463', skyLow: '#e0715a', sun: '#ffcf7a',
  hillFar: '#2f2350', hillMid: '#22193d', hillNear: '#160f2a',
  soil: ['#5b3346', '#6d3c45', '#7f4a44', '#5a3550', '#432a47', '#33203d'],
  ore: '#ffb53d', oreHi: '#ffe39a', oreDeep: '#d9781f',
  rock: ['#4a2d3e', '#5a3646', '#6a404c', '#553447'], rockBg: '#24162b', rockEdge: '#7c5260',
  uranium: '#ffbe3b', uraniumHi: '#fff0b8', uraniumLo: '#e08a1a', proton: '#ff8a4c',
  neutron: '#6ff3ff', neutronCore: '#e9fdff',
  water: '#3aa6ff', waterHi: '#9fd6ff', steam: '#eaf4ff',
  heat: '#ff5a36', text: '#ffffff', textEdge: '#140c22', tag: '#ffe39a'
};

// ---------- static layouts (seeded, computed once) ----------
const R = rng(20261019);
const stars = Array.from({ length: 90 }, () => ({ x: R() * W, y: R() * 820, r: .8 + R() * 2.2, p: R() * 6.28 }));
const grains = [];
for (let gy = -60; gy < H + 120; gy += 118) for (let gx = -60; gx < W + 120; gx += 128) {
  const n = 7 + Math.floor(R() * 3), cx = gx + (R() - .5) * 60, cy = gy + (R() - .5) * 60, rr = 52 + R() * 26;
  grains.push({ cx, cy, col: Math.floor(R() * 4), pts: Array.from({ length: n }, (_, i) => { const a = i / n * 6.283 + R() * .3; const d = rr * (.75 + R() * .35); return [Math.cos(a) * d, Math.sin(a) * d]; }) });
}
const NUC = { A: [300, 520], B: [720, 360], C: [650, 700], D: [900, 560], E: [360, 1290], F: [790, 1360], G: [250, 1640], H: [640, 1640] };
const PORES = [
  { id: 'P1', x: 470, y: 600, r: 92 }, { id: 'P2', x: 870, y: 380, r: 78 }, { id: 'P3', x: 470, y: 1520, r: 104 },
  { id: 'P4', x: 960, y: 1560, r: 80 }, { id: 'P5', x: 140, y: 1330, r: 70 }, { id: 'P6', x: 160, y: 300, r: 66 }
].map(p => ({ ...p, pts: Array.from({ length: 12 }, (_, i) => { const a = i / 12 * 6.283; return [Math.cos(a), Math.sin(a), .82 + R() * .3]; }) }));
const bgNuclei = Array.from({ length: 26 }, () => ({ x: R() * W, y: R() * H, r: 10 + R() * 9 }));
// nucleon cluster offsets for a uranium nucleus (unit radius)
const nucleons = Array.from({ length: 34 }, (_, i) => { const a = i * 2.39996, d = Math.sqrt((i + .5) / 34) * .78; return { x: Math.cos(a) * d, y: Math.sin(a) * d, p: R() < .43 }; });

// chain reaction: neutron flights [from, to, t0, t1, kind]; split times per nucleus
const SPLIT = { A: 5.40, C: 5.78, B: 5.84, D: 6.12, E: 6.30, F: 6.70, H: 9.52 };
const FLIGHTS = [
  { a: [-40, 560], b: NUC.A, t0: 5.02, t1: 5.40 },
  { a: NUC.A, b: NUC.B, t0: 5.40, t1: 5.84 }, { a: NUC.A, b: NUC.C, t0: 5.40, t1: 5.78 },
  { a: NUC.C, b: NUC.D, t0: 5.78, t1: 6.12 }, { a: NUC.C, b: NUC.E, t0: 5.78, t1: 6.30 },
  { a: NUC.E, b: NUC.F, t0: 6.30, t1: 6.70 }, { a: NUC.D, b: [1140, 120], t0: 6.12, t1: 6.45 },
  { a: NUC.F, b: [1140, 1180], t0: 6.70, t1: 7.05 }, { a: NUC.B, b: [820, -60], t0: 5.84, t1: 6.20 }
];
// moderated neutron: fast into P3, slow inside water, then splits H
const SLOW = [{ a: [-40, 1470], b: [380, 1500], t0: 8.45, t1: 8.70 }, { a: [380, 1500], b: [560, 1545], t0: 8.70, t1: 9.30 }, { a: [560, 1545], b: NUC.H, t0: 9.30, t1: 9.52 }];
// fast neutrons after the water is gone: pass by without splitting
const FAST = [{ a: [-60, 1700], b: [1140, 1560], t0: 10.10, t1: 10.42 }, { a: [-60, 420], b: [1140, 640], t0: 10.30, t1: 10.60 }, { a: [1140, 1260], b: [-60, 1420], t0: 10.55, t1: 10.85 }];

// ---------- state functions ----------
const glow = t => clamp(Object.values(SPLIT).filter(s => t >= s && s < 8).length / 6) * (1 - smooth(span(t, 9.7, 11.3)) * .9);
const heat = t => smooth(span(t, 5.4, 7.4)) * (1 - smooth(span(t, 9.8, 11.6)) * .85);
const water = (t, id) => 1 - smooth(span(t, id === 'P3' ? 9.35 : 7.7, id === 'P3' ? 9.95 : 9.85));

// ---------- drawing primitives ----------
function blob(q, cx, cy, r, pts, k = 1) {
  q.beginPath();
  const P = pts.map(([x, y, s]) => s === undefined ? [cx + x * k, cy + y * k] : [cx + x * r * s, cy + y * r * s]);
  for (let i = 0; i < P.length; i++) { const p0 = P[i], p1 = P[(i + 1) % P.length]; const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2; if (i === 0) q.moveTo(mx, my); else q.quadraticCurveTo(p0[0], p0[1], mx, my); }
  const p0 = P[0], p1 = P[1]; q.quadraticCurveTo(p0[0], p0[1], (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2); q.closePath();
}
function radial(q, x, y, r, c0, a0) { const g = q.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, c0); g.addColorStop(1, 'rgba(0,0,0,0)'); q.globalAlpha = a0; q.fillStyle = g; q.fillRect(x - r, y - r, 2 * r, 2 * r); q.globalAlpha = 1; }
function uranium(q, x, y, r, energy, t) {
  if (energy > 0) radial(q, x, y, r * 2.6, 'rgba(255,190,60,0.9)', .35 * energy);
  q.fillStyle = C.uraniumLo; q.beginPath(); q.arc(x, y, r, 0, 6.283); q.fill();
  for (const n of nucleons) { q.fillStyle = n.p ? C.proton : C.uranium; q.beginPath(); q.arc(x + n.x * r, y + n.y * r, r * .2, 0, 6.283); q.fill(); }
  q.fillStyle = 'rgba(255,240,184,0.55)'; q.beginPath(); q.ellipse(x - r * .32, y - r * .38, r * .34, r * .2, -.5, 0, 6.283); q.fill();
}
function neutron(q, x, y, dx, dy, speed, alpha = 1) {
  const len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, tail = 26 + speed * 90;
  const g = q.createLinearGradient(x, y, x - ux * tail, y - uy * tail); g.addColorStop(0, 'rgba(111,243,255,' + .9 * alpha + ')'); g.addColorStop(1, 'rgba(111,243,255,0)');
  q.strokeStyle = g; q.lineWidth = 12; q.lineCap = 'round'; q.beginPath(); q.moveTo(x, y); q.lineTo(x - ux * tail, y - uy * tail); q.stroke();
  q.globalAlpha = alpha; q.fillStyle = C.neutron; q.beginPath(); q.arc(x, y, 13, 0, 6.283); q.fill(); q.fillStyle = C.neutronCore; q.beginPath(); q.arc(x - 3, y - 3, 6, 0, 6.283); q.fill(); q.globalAlpha = 1;
}
function flight(q, f, t, speed) { if (t < f.t0 || t > f.t1) return; const u = (t - f.t0) / (f.t1 - f.t0); const x = lerp(f.a[0], f.b[0], u), y = lerp(f.a[1], f.b[1], u); neutron(q, x, y, f.b[0] - f.a[0], f.b[1] - f.a[1], speed); }
function tag(q, text, x, y, tx, ty, a) {
  if (a <= 0) return; q.save(); q.globalAlpha = a; q.strokeStyle = C.tag; q.lineWidth = 4; q.lineCap = 'round';
  q.beginPath(); q.moveTo(x, y); q.lineTo(tx, ty); q.stroke(); q.fillStyle = C.tag; q.beginPath(); q.arc(tx, ty, 7, 0, 6.283); q.fill();
  q.font = '700 40px Manrope'; q.textAlign = x < tx ? 'right' : 'left'; q.textBaseline = 'middle';
  q.lineJoin = 'round'; q.lineWidth = 9; q.strokeStyle = C.textEdge; q.strokeText(text, x + (x < tx ? -12 : 12), y); q.fillText(text, x + (x < tx ? -12 : 12), y); q.restore();
}

// ---------- macro world (surface to ore seam) ----------
const SURF = 980, SEAM = 2560;
function drawMacro(q, t) {
  const dive = inOut(span(t, 1.75, 3.45));
  const camY = lerp(0, SEAM - 600, dive);
  const zoom = lerp(1, 2.3, inOut(span(t, 3.55, 4.55)));
  const fx = 560, fy = SEAM - camY + 40;                       // zoom focus = seam centre on screen
  q.save(); q.translate(fx, fy); q.scale(zoom, zoom); q.translate(-fx, -fy); q.translate(0, -camY);
  // sky
  const g = q.createLinearGradient(0, 0, 0, SURF); g.addColorStop(0, C.skyTop); g.addColorStop(.55, C.skyMid); g.addColorStop(1, C.skyLow); q.fillStyle = g; q.fillRect(-200, -200, W + 400, SURF + 260);
  for (const s of stars) { q.globalAlpha = .45 + .55 * (.5 + .5 * Math.sin(t * 2.1 + s.p)); q.fillStyle = '#fff'; q.beginPath(); q.arc(s.x, s.y, s.r, 0, 6.283); q.fill(); }
  q.globalAlpha = 1; radial(q, 760, SURF - 40, 420, 'rgba(255,207,122,0.85)', .55); q.fillStyle = C.sun; q.beginPath(); q.arc(760, SURF - 10, 92, Math.PI, 0); q.fill();
  // hills: three parallax layers (move slower than ground while diving)
  const hill = (col, base, amp, ph, par) => { q.fillStyle = col; q.beginPath(); q.moveTo(-200, SURF + 300); for (let x = -200; x <= W + 200; x += 40) q.lineTo(x, base + par * camY * .12 - amp * (Math.sin(x * .006 + ph) * .6 + Math.sin(x * .013 + ph * 2) * .4)); q.lineTo(W + 200, SURF + 300); q.fill(); };
  hill(C.hillFar, SURF - 70, 60, 1.2, .5); hill(C.hillMid, SURF - 25, 38, 2.6, .25);
  // acacia silhouette
  q.fillStyle = C.hillNear; q.fillRect(236, SURF - 190, 18, 200); q.beginPath(); q.ellipse(245, SURF - 200, 130, 34, 0, 0, 6.283); q.fill(); q.beginPath(); q.ellipse(200, SURF - 222, 70, 24, 0, 0, 6.283); q.fill();
  q.fillRect(SURF * 0, SURF - 4, 0, 0);
  // strata
  const bands = [SURF, 1180, 1480, 1800, 2160, 2440, 4600];
  for (let i = 0; i < bands.length - 1; i++) {
    q.fillStyle = C.soil[i]; q.beginPath(); q.moveTo(-200, bands[i] + (i ? 18 * Math.sin(i) : 0));
    for (let x = -200; x <= W + 200; x += 60) q.lineTo(x, bands[i] + (i ? 22 * Math.sin(x * .004 + i * 1.7) : 4 * Math.sin(x * .02)));
    q.lineTo(W + 200, bands[i + 1] + 60); q.lineTo(-200, bands[i + 1] + 60); q.fill();
  }
  { q.fillStyle = C.soil[5]; q.fillRect(-400, 3000, W + 800, 2400);
  }
  // pebbles in strata (texture attached to layers)
  const pr = rng(7); for (let i = 0; i < 140; i++) { const x = pr() * W, y = SURF + 60 + pr() * 2300; if (Math.abs(y - SEAM) < 150) continue; q.fillStyle = 'rgba(255,255,255,0.06)'; q.beginPath(); q.ellipse(x, y, 6 + pr() * 14, 4 + pr() * 7, pr(), 0, 6.283); q.fill(); }
  // groundwater line + ore seam
  q.strokeStyle = 'rgba(58,166,255,0.55)'; q.lineWidth = 6; q.setLineDash([22, 16]); q.beginPath(); for (let x = -200; x <= W + 200; x += 40) q.lineTo(x, 1640 + 10 * Math.sin(x * .01)); q.stroke(); q.setLineDash([]);
  const reveal = smooth(span(t, 3.2, 3.9));
  radial(q, 560, SEAM + 40, 520, 'rgba(255,170,50,0.9)', .25 + .35 * reveal);
  q.fillStyle = C.oreDeep; q.beginPath(); q.moveTo(80, SEAM + 40); q.bezierCurveTo(300, SEAM - 110, 820, SEAM - 90, 1010, SEAM + 20); q.bezierCurveTo(820, SEAM + 170, 300, SEAM + 190, 80, SEAM + 40); q.fill();
  q.fillStyle = C.ore; q.beginPath(); q.moveTo(140, SEAM + 36); q.bezierCurveTo(330, SEAM - 70, 790, SEAM - 60, 950, SEAM + 22); q.bezierCurveTo(780, SEAM + 120, 330, SEAM + 140, 140, SEAM + 36); q.fill();
  const cr = rng(11); for (let i = 0; i < 26; i++) { const x = 220 + cr() * 640, y = SEAM + 30 + (cr() - .5) * 120 * (1 - Math.abs(x - 560) / 520); const s = 10 + cr() * 18; q.fillStyle = cr() < .5 ? C.oreHi : '#ffd36b'; q.beginPath(); q.moveTo(x, y - s); q.lineTo(x + s * .6, y); q.lineTo(x, y + s * .7); q.lineTo(x - s * .6, y); q.fill(); }
  q.restore();
  // labels in screen space
  tag(q, 'groundwater', 760, lerp(1640 - camY + 120, 1640 - camY + 120, 0), 640, 1640 - camY, smooth(span(t, 2.3, 2.8)) * (1 - smooth(span(t, 3.4, 3.7))));
  tag(q, 'uranium ore', 200, SEAM - camY - 250, 380, SEAM - camY - 40, smooth(span(t, 3.62, 4.0)) * (1 - smooth(span(t, 4.25, 4.45))));
}

// ---------- micro world (inside the ore) ----------
function drawMicro(q, t) {
  const push = lerp(1.0, 1.07, smooth(span(t, 4.4, 12.4)));
  q.save(); q.translate(540, 960); q.scale(push, push); q.translate(-540, -960);
  const h = heat(t);
  q.fillStyle = mixHex(C.rockBg, '#3a1a22', h); q.fillRect(-100, -100, W + 200, H + 200);
  for (const b of bgNuclei) { q.globalAlpha = .25; q.fillStyle = C.uraniumLo; q.beginPath(); q.arc(b.x, b.y, b.r, 0, 6.283); q.fill(); }
  q.globalAlpha = 1;
  for (const gr of grains) { q.fillStyle = mixHex(C.rock[gr.col], '#8a3b33', h * .55); blob(q, gr.cx, gr.cy, 0, gr.pts, 1); q.fill(); q.strokeStyle = 'rgba(255,220,200,' + (.08 + .1 * h) + ')'; q.lineWidth = 3; q.stroke(); }
  // pores with water
  for (const p of PORES) {
    q.fillStyle = '#120a18'; blob(q, p.x, p.y, p.r, p.pts); q.fill();
    const w = water(t, p.id); if (w <= 0.01) continue;
    q.save(); blob(q, p.x, p.y, p.r, p.pts); q.clip();
    const top = p.y + p.r - 2 * p.r * w; const wob = 5 * Math.sin(t * 6 + p.x);
    q.fillStyle = C.water; q.beginPath(); q.moveTo(p.x - p.r * 1.4, top + wob); q.quadraticCurveTo(p.x, top - wob, p.x + p.r * 1.4, top + wob); q.lineTo(p.x + p.r * 1.4, p.y + p.r * 1.4); q.lineTo(p.x - p.r * 1.4, p.y + p.r * 1.4); q.fill();
    q.strokeStyle = C.waterHi; q.lineWidth = 5; q.beginPath(); q.moveTo(p.x - p.r * .6, top + 14); q.lineTo(p.x - p.r * .1, top + 14); q.stroke();
    q.restore();
  }
  // bubbles / steam (spawned from pores while boiling)
  const br = rng(33);
  for (let i = 0; i < 70; i++) {
    const p = PORES[i % PORES.length], born = 7.5 + br() * 2.2, life = .9 + br() * .7, dx = (br() - .5) * p.r, sz = 7 + br() * 12;
    const u = (t - born) / life; if (u < 0 || u > 1 || water(t, p.id) < .05 && u < .1) continue;
    const y = p.y + p.r * .5 - u * (p.r * 1.6 + 120), x = p.x + dx + 8 * Math.sin(u * 9 + i);
    q.globalAlpha = (1 - u) * .9; q.strokeStyle = u < .45 ? C.waterHi : C.steam; q.fillStyle = 'rgba(234,244,255,' + (u < .45 ? .15 : .35) + ')'; q.lineWidth = 3;
    q.beginPath(); q.arc(x, y, sz * (u < .45 ? 1 : 1.4 + u), 0, 6.283); q.fill(); q.stroke();
  }
  q.globalAlpha = 1;
  // nuclei: intact or split
  for (const [k, [x, y]] of Object.entries(NUC)) {
    const s = SPLIT[k];
    if (s === undefined || t < s) { const pre = s !== undefined ? smooth(span(t, s - .1, s)) : 0; uranium(q, x + pre * 3 * Math.sin(t * 90), y, 58, glow(t) * .6 + pre, t); continue; }
    const u = span(t, s, s + .9), fl = 1 - span(t, s, s + .35);
    if (fl > 0) radial(q, x, y, 260, 'rgba(255,240,180,1)', .9 * fl);
    const d = 26 + 70 * outBack(u), a = 1 - .35 * u;
    q.globalAlpha = a; radial(q, x, y, 150, 'rgba(255,170,60,1)', .35 * (1 - u * .6)); q.fillStyle = C.uraniumLo;
    q.beginPath(); q.arc(x - d * .8, y - d * .5, 36, 0, 6.283); q.fill(); q.beginPath(); q.arc(x + d * .8, y + d * .5, 32, 0, 6.283); q.fill();
    q.fillStyle = C.proton; q.beginPath(); q.arc(x - d * .8 - 8, y - d * .5 - 6, 14, 0, 6.283); q.fill(); q.beginPath(); q.arc(x + d * .8 + 6, y + d * .5 - 4, 12, 0, 6.283); q.fill();
    q.globalAlpha = 1;
  }
  for (const f of FLIGHTS) flight(q, f, t, 1);
  SLOW.forEach((f, i) => flight(q, f, t, i === 1 ? .1 : 1));
  for (const f of FAST) flight(q, f, t, 1.6);
  q.restore();
  // foreground parallax: large dark grains near the lens, pushing faster than the rock plane
  { const fp = lerp(1.0, 1.16, smooth(span(t, 4.4, 12.4))); q.save(); q.translate(540, 960); q.scale(fp, fp); q.translate(-540, -960);
    q.fillStyle = 'rgba(14,8,20,0.92)';
    for (const [x, y, r, sd] of [[-40, 140, 190, 3], [1110, 980, 210, 5], [-60, 1180, 170, 8], [1100, 1880, 230, 9], [520, 2010, 170, 12]]) { const rr = rng(sd); blob(q, x, y, r, Array.from({ length: 9 }, (_, i) => { const a = i / 9 * 6.283; return [Math.cos(a), Math.sin(a), .8 + rr() * .3]; })); q.fill(); }
    q.restore(); }
  // overall reactor warmth
  radial(q, 540, 960, 1200, 'rgba(255,120,40,1)', .22 * glow(t));
  // thermometer (heat role)
  const th = clamp(.12 + .88 * smooth(span(t, 5.6, 7.6)) - .8 * smooth(span(t, 9.9, 11.8)));
  const tx = 990, ty0 = 1250, ty1 = 1690, ta = smooth(span(t, 6.3, 6.7));
  if (ta > 0) { q.globalAlpha = ta; q.fillStyle = '#1b1024'; q.beginPath(); q.roundRect(tx - 26, ty0 - 26, 52, ty1 - ty0 + 52, 26); q.fill(); q.beginPath(); q.arc(tx, ty1 + 30, 44, 0, 6.283); q.fill();
    q.fillStyle = C.heat; q.beginPath(); q.arc(tx, ty1 + 30, 30, 0, 6.283); q.fill(); const top = lerp(ty1, ty0, th); q.beginPath(); q.roundRect(tx - 12, top, 24, ty1 + 20 - top, 12); q.fill();
    q.strokeStyle = 'rgba(255,255,255,.35)'; q.lineWidth = 3; for (let i = 0; i < 6; i++) { const y = lerp(ty1, ty0, i / 5); q.beginPath(); q.moveTo(tx - 44, y); q.lineTo(tx - 30, y); q.stroke(); } q.globalAlpha = 1; }
  // explanatory tags
  tag(q, 'uranium atom', 560, 210, 330, 480, smooth(span(t, 4.75, 4.95)) * (1 - smooth(span(t, 5.3, 5.45))));
  tag(q, 'water', 690, 470, 530, 570, smooth(span(t, 4.8, 5.0)) * (1 - smooth(span(t, 5.6, 5.8))));
  tag(q, 'neutron', 260, 380, 180, 540, smooth(span(t, 5.05, 5.2)) * (1 - smooth(span(t, 5.5, 5.7))));
  tag(q, 'water slows it', 300, 1210, 450, 1500, smooth(span(t, 8.6, 8.8)) * (1 - smooth(span(t, 9.6, 9.8))));
  tag(q, 'too fast to split', 640, 1220, 470, 1585, smooth(span(t, 10.25, 10.45)) * (1 - smooth(span(t, 11.4, 11.7))));
  // honesty tag
  q.globalAlpha = .7 * smooth(span(t, 4.6, 5.0)); q.font = '600 26px Manrope'; q.fillStyle = '#ffffff'; q.textAlign = 'left'; q.fillText('Illustration · not to scale', 40, 1860); q.globalAlpha = 1;
}

// ---------- typography ----------
const KEYWORDS = [
  { s: '2 BILLION YEARS AGO', t0: .35, t1: 2.45 }, { s: 'OKLO, GABON', t0: 2.55, t1: 4.3 },
  { s: 'CHAIN REACTION', t0: 5.15, t1: 7.5 }, { s: 'BOILING', t0: 7.6, t1: 10.0 }, { s: 'OFF', t0: 10.4, t1: 12.4 }
];
const CAPTIONS = [
  { s: 'Two billion years ago,', t0: .25, t1: 1.86 }, { s: 'under what is now Gabon,', t0: 1.89, t1: 3.55 },
  { s: 'uranium started its own chain reaction.', t0: 3.62, t1: 6.25 }, { s: 'Then its heat boiled away', t0: 6.33, t1: 8.35 },
  { s: 'the water it needed...', t0: 8.39, t1: 10.03 }, { s: 'and it shut itself off.', t0: 10.07, t1: 12.1 }
];
function wrap(q, s, max) { const w = s.split(' '), lines = []; let cur = ''; for (const x of w) { const tr = cur ? cur + ' ' + x : x; if (q.measureText(tr).width > max && cur) { lines.push(cur); cur = x; } else cur = tr; } lines.push(cur); return lines; }
function drawKeyword(q, t) {
  for (const k of KEYWORDS) {
    if (t < k.t0 || t > k.t1) continue; const a = smooth(span(t, k.t0, k.t0 + .25)) * (1 - smooth(span(t, k.t1 - .2, k.t1))); const sc = .7 + .3 * outBack(span(t, k.t0, k.t0 + .35));
    q.save(); q.globalAlpha = a; q.translate(540, 250); q.scale(sc, sc); q.font = '800 84px Manrope'; q.textAlign = 'center'; q.textBaseline = 'middle';
    const col = k.s === 'CHAIN REACTION' ? C.ore : k.s === 'BOILING' ? C.waterHi : k.s === 'OFF' ? C.neutron : '#ffffff';
    q.lineJoin = 'round'; q.lineWidth = 14; q.strokeStyle = C.textEdge; q.strokeText(k.s, 0, 0); q.fillStyle = col; q.fillText(k.s, 0, 0); q.restore();
  }
}
function drawCaption(q, t) {
  for (const c of CAPTIONS) {
    if (t < c.t0 || t > c.t1) continue; const a = smooth(span(t, c.t0, c.t0 + .12)) * (1 - smooth(span(t, c.t1 - .1, c.t1)));
    q.save(); q.globalAlpha = a; q.font = '800 60px Manrope'; q.textAlign = 'center'; q.textBaseline = 'middle';
    const lines = wrap(q, c.s, 880), lh = 74, y0 = 960 - (lines.length - 1) * lh / 2;
    lines.forEach((l, i) => { q.lineJoin = 'round'; q.lineWidth = 12; q.strokeStyle = C.textEdge; q.strokeText(l, 540, y0 + i * lh); q.fillStyle = C.text; q.fillText(l, 540, y0 + i * lh); });
    q.restore();
  }
}

// ---------- frame ----------
function renderScene(q, t) {
  const iris = inOut(span(t, 4.25, 4.95));
  if (iris < 1) drawMacro(q, t);
  if (iris > 0) {   // connected transition: the glowing seam opens into the ore's interior
    q.save(); q.beginPath(); q.arc(560, 640, 1250 * iris + 1, 0, 6.283); q.clip(); drawMicro(q, t);
    q.restore(); if (iris < 1) { q.strokeStyle = C.ore; q.lineWidth = 14; q.beginPath(); q.arc(560, 640, 1250 * iris, 0, 6.283); q.stroke(); }
  }
  drawKeyword(q, t); drawCaption(q, t);
}
function sceneTimeFor(frameIndex) { const out = frameIndex / FPS; return Math.floor((out + 1e-8) * SCENE_FPS) / SCENE_FPS; }
function renderFrame(q, frameIndex) { const st = sceneTimeFor(frameIndex); q.setTransform(1, 0, 0, 1, 0, 0); q.clearRect(0, 0, W, H); renderScene(q, st); return st; }
root.OkloTest = { W, H, FPS, SCENE_FPS, VO, DURATION, FRAMES: Math.round(DURATION * FPS), renderFrame, sceneTimeFor, SPLIT, KEYWORDS, CAPTIONS };
})(typeof window !== 'undefined' ? window : globalThis);
