// Transition de voyage : un navire low-poly vogue vers un diorama simplifié de l'île suivante.
import * as THREE from './vendor/three.module.min.js';

let renderer = null;
let snapR = null;

function seeded(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const hash = s => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };

export function webglOK() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

const M = (color, o = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, metalness: 0.05, ...o });

function mesh(geo, mat, x = 0, y = 0, z = 0) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; return m; }

function tree(r, color = 0x2e7d32, h = 1.6) {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(0.08, 0.12, h * 0.5, 5), M(0x6d4c41), 0, h * 0.25, 0));
  g.add(mesh(new THREE.ConeGeometry(0.45 + r() * 0.2, h, 6), M(color), 0, h * 0.75, 0));
  return g;
}
function palm(r) {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(0.06, 0.1, 1.6, 5), M(0x8d6e63), 0, 0.8, 0));
  for (let i = 0; i < 5; i++) { const l = mesh(new THREE.BoxGeometry(0.9, 0.04, 0.22), M(0x43a047), 0.35, 1.6, 0); l.rotation.y = (i / 5) * Math.PI * 2; l.rotation.z = -0.4; const p = new THREE.Group(); p.add(l); p.rotation.y = (i / 5) * Math.PI * 2; g.add(p); }
  return g;
}
function house(r, wall = 0xf5e6c8, roof = 0xc0392b) {
  const g = new THREE.Group();
  const w = 0.5 + r() * 0.4, d = 0.5 + r() * 0.3, h = 0.4 + r() * 0.4;
  g.add(mesh(new THREE.BoxGeometry(w, h, d), M(wall), 0, h / 2, 0));
  const ro = mesh(new THREE.ConeGeometry(Math.max(w, d) * 0.75, 0.45, 4), M(roof), 0, h + 0.22, 0);
  ro.rotation.y = Math.PI / 4;
  g.add(ro);
  return g;
}
function scatter(group, r, n, radius, make, minR = 0) {
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, d = minR + Math.sqrt(r()) * (radius - minR);
    const o = make(i);
    o.position.x += Math.cos(a) * d; o.position.z += Math.sin(a) * d;
    o.rotation.y += r() * Math.PI;
    group.add(o);
  }
}

// Diorama : un socle (tuile de terrain) + des éléments selon le thème de l'île
export function buildDiorama(isl) {
  const r = seeded(hash(isl.id));
  const th = isl.th || { k: 'village', g: 0x7cb342, a: 0xd9a066 };
  const G = new THREE.Group();
  const R = 6;
  // socle : terre + sable
  const base = mesh(new THREE.CylinderGeometry(R, R * 1.08, 1.4, 9), M(0x8d6e63), 0, -0.4, 0);
  base.receiveShadow = true; G.add(base);
  const sand = mesh(new THREE.CylinderGeometry(R * 1.02, R * 1.02, 0.25, 9), M(0xf0d9a0), 0, 0.35, 0);
  G.add(sand);
  const top = mesh(new THREE.CylinderGeometry(R * 0.86, R * 0.95, 0.3, 9), M(th.g), 0, 0.55, 0);
  top.receiveShadow = true; G.add(top);
  const Y = 0.7;
  const at = (o, x, z, y = Y) => { o.position.set(x, y, z); G.add(o); return o; };
  const k = th.k;
  if (k === 'village' || k === 'plaine') {
    scatter(G, r, 6, 3.5, () => { const h = house(r, 0xf5e6c8, th.a); h.position.y = Y; return h; }, 0.6);
    scatter(G, r, 8, 4.8, () => { const t = tree(r, 0x388e3c); t.position.y = Y; return t; }, 3);
    // moulin
    const mill = at(new THREE.Group(), -1.5, -1.5);
    mill.add(mesh(new THREE.CylinderGeometry(0.3, 0.45, 1.8, 6), M(0xefebe9), 0, 0.9, 0));
    const blades = mesh(new THREE.BoxGeometry(0.1, 2.2, 0.2), M(0x8d6e63), 0, 1.7, 0.45); mill.add(blades);
    const b2 = blades.clone(); b2.rotation.z = Math.PI / 2; mill.add(b2);
  } else if (k === 'ville') {
    scatter(G, r, 16, 4.5, () => { const h = house(r, [0xf5e6c8, 0xe0c9a6, 0xffe0b2][Math.floor(r() * 3)], th.a); h.position.y = Y; h.scale.y = 1 + r() * 1.5; return h; });
    const tw = at(mesh(new THREE.CylinderGeometry(0.5, 0.7, 3.5, 6), M(0xe0d6c8)), 0, 0, Y + 1.75);
    at(mesh(new THREE.ConeGeometry(0.8, 1.2, 6), M(th.a)), 0, 0, Y + 4.1);
    void tw;
  } else if (k === 'forteresse') {
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; const w = at(mesh(new THREE.BoxGeometry(2.6, 1.2, 0.4), M(0xcfd8dc)), Math.cos(a) * 4, Math.sin(a) * 4, Y + 0.6); w.rotation.y = -a + Math.PI / 2; }
    at(mesh(new THREE.BoxGeometry(2, 3, 2), M(0xeceff1)), 0, 0, Y + 1.5);
    at(mesh(new THREE.BoxGeometry(1.2, 1.5, 1.2), M(th.a)), 0, 0, Y + 3.75);
    at(mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 4), M(0x555555)), 0, 0, Y + 5.2);
    at(mesh(new THREE.BoxGeometry(0.8, 0.5, 0.02), M(0x1565c0)), 0.4, 0, Y + 5.7);
  } else if (k === 'montagne') {
    at(mesh(new THREE.ConeGeometry(3.2, 5.5, 7), M(th.g === 0xffe082 ? 0xbcaaa4 : 0x8d6e63)), 0, -0.5, Y + 2.75);
    at(mesh(new THREE.ConeGeometry(1.1, 1.9, 7), M(0xffffff)), 0, -0.5, Y + 4.6);
    at(mesh(new THREE.ConeGeometry(1.8, 3, 6), M(0x795548)), 2.2, 1.5, Y + 1.5);
    scatter(G, r, 6, 5, () => { const t = tree(r, 0x2e7d32); t.position.y = Y; return t; }, 3.6);
    if (isl.id === 'reverse') at(mesh(new THREE.BoxGeometry(0.4, 5.6, 0.6), M(0x29b6f6, { transparent: true, opacity: 0.85 })), 0, 2.2, Y + 2.6);
  } else if (k === 'desert') {
    scatter(G, r, 6, 4.5, () => { const d = mesh(new THREE.SphereGeometry(1.2, 7, 5), M(0xe6c27a)); d.scale.set(1.4, 0.35, 1); d.position.y = Y; return d; });
    const pal = at(new THREE.Group(), 0, 0);
    pal.add(mesh(new THREE.BoxGeometry(2.4, 1.2, 1.8), M(0xf5e1b0), 0, 0.6, 0));
    pal.add(mesh(new THREE.SphereGeometry(0.75, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), M(th.a), 0, 1.2, 0));
    pal.add(mesh(new THREE.CylinderGeometry(0.18, 0.18, 2.4, 6), M(0xf5e1b0), 1.1, 1.2, 0.8));
    scatter(G, r, 4, 4.8, () => { const p = palm(r); p.position.y = Y; return p; }, 2.5);
  } else if (k === 'neige') {
    top.material = M(0xffffff);
    at(mesh(new THREE.ConeGeometry(2.6, 4.5, 7), M(0xeceff1)), -1, -1, Y + 2.25);
    scatter(G, r, 12, 5, () => { const t = tree(r, 0xe8f5e9, 1.4); t.position.y = Y; return t; }, 1.5);
    if (th.a === 0xec407a) { const c = at(mesh(new THREE.SphereGeometry(0.9, 8, 6), M(0xf48fb1)), -1, -1, Y + 4.7); void c; }
  } else if (k === 'jungle') {
    scatter(G, r, 18, 5, () => { const g = new THREE.Group(); g.add(mesh(new THREE.CylinderGeometry(0.12, 0.18, 1.6, 5), M(0x5d4037), 0, 0.8, 0)); g.add(mesh(new THREE.IcosahedronGeometry(0.8 + r() * 0.5, 0), M([0x2e7d32, 0x388e3c, 0x1b5e20][Math.floor(r() * 3)]), 0, 1.9, 0)); g.position.y = Y; return g; });
    scatter(G, r, 5, 4, () => { const f = mesh(new THREE.IcosahedronGeometry(0.25, 0), M(th.a)); f.position.y = Y + 0.3; return f; });
  } else if (k === 'ciel') {
    top.material = M(0xffffff); sand.material = M(0xffffff); base.material = M(0xe3f2fd);
    scatter(G, r, 10, 6, () => { const c = mesh(new THREE.SphereGeometry(1 + r(), 7, 5), M(0xffffff)); c.position.y = -0.6; c.scale.y = 0.5; return c; }, 4);
    const tw = at(new THREE.Group(), 0, 0);
    tw.add(mesh(new THREE.CylinderGeometry(0.6, 0.9, 2.6, 8), M(0xfff8e1), 0, 1.3, 0));
    tw.add(mesh(new THREE.ConeGeometry(0.8, 1, 8), M(th.a, { metalness: 0.6, roughness: 0.3 }), 0, 3.1, 0));
    scatter(G, r, 6, 4.5, () => { const t = tree(r, 0x81c784); t.position.y = Y; return t; }, 2);
  } else if (k === 'ruines') {
    scatter(G, r, 14, 4.8, () => { const h = 0.4 + r() * 2.2; const c = mesh(new THREE.CylinderGeometry(0.22, 0.25, h, 6), M(th.a === 0x3e2723 ? 0x9e9e9e : 0xd7ccc8)); c.position.y = Y + h / 2; c.rotation.z = (r() - 0.5) * 0.4; return c; });
    scatter(G, r, 6, 4, () => { const b = mesh(new THREE.BoxGeometry(0.8, 0.3, 0.6), M(0xbdbdbd)); b.position.y = Y + 0.15; return b; });
    if (isl.id === 'ohara') { const t = at(new THREE.Group(), 0, 0); t.add(mesh(new THREE.CylinderGeometry(0.7, 1.1, 3.5, 7), M(0x3e2723), 0, 1.75, 0)); t.add(mesh(new THREE.IcosahedronGeometry(1.4, 0), M(0x424242), 0, 3.8, 0)); }
  } else if (k === 'arbre') {
    const t = at(new THREE.Group(), 0, 0);
    t.add(mesh(new THREE.CylinderGeometry(1.1, 1.8, 7, 9), M(0x5d4037), 0, 3.5, 0));
    for (let i = 0; i < 6; i++) t.add(mesh(new THREE.IcosahedronGeometry(1.6 + r(), 0), M(0x558b2f), Math.cos(i) * 1.8, 7 + r() * 1.5, Math.sin(i) * 1.8));
    scatter(G, r, 5, 5, () => { const h = house(r, 0xd7ccc8, 0x6d4c41); h.scale.setScalar(1.8); h.position.y = Y; return h; }, 3);
  } else if (k === 'volcan') {
    const c = at(mesh(new THREE.ConeGeometry(3, 4.2, 8, 1, true), M(0x6d4c41)), 0, 0, Y + 2.1); void c;
    at(mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.3, 8), M(0xff3d00, { emissive: 0xff3d00, emissiveIntensity: 0.8 })), 0, 0, Y + 3.9);
    const ice = mesh(new THREE.BoxGeometry(5, 0.3, 10), M(0xe0f7fa)); ice.position.set(-2.6, Y + 0.05, 0); G.add(ice);
  } else if (k === 'eau') {
    for (let i = -2; i <= 2; i++) { const c = mesh(new THREE.BoxGeometry(9, 0.05, 0.6), M(0x29b6f6)); c.position.set(0, Y + 0.02, i * 1.6); G.add(c); }
    scatter(G, r, 12, 4.6, () => { const h = house(r, 0xeceff1, 0x1976d2); h.position.y = Y; return h; }, 1.5);
    const f = at(new THREE.Group(), 0, 0);
    for (let i = 0; i < 4; i++) f.add(mesh(new THREE.CylinderGeometry(1.2 - i * 0.25, 1.3 - i * 0.25, 0.9, 8), M(i % 2 ? 0xb0bec5 : 0xeceff1), 0, 0.45 + i * 0.9, 0));
    f.add(mesh(new THREE.ConeGeometry(0.35, 1.2, 8), M(0x4fc3f7, { transparent: true, opacity: 0.8 }), 0, 4.2, 0));
  } else if (k === 'tour') {
    at(mesh(new THREE.CylinderGeometry(1.2, 1.6, 6, 8), M(th.g)), 0, 0, Y + 3);
    at(mesh(new THREE.ConeGeometry(1.4, 1.5, 8), M(th.a)), 0, 0, Y + 6.75);
    const gate = at(new THREE.Group(), 0, 4.2);
    gate.add(mesh(new THREE.BoxGeometry(0.5, 3.2, 0.5), M(0x37474f), -1.2, 1.6, 0));
    gate.add(mesh(new THREE.BoxGeometry(0.5, 3.2, 0.5), M(0x37474f), 1.2, 1.6, 0));
    gate.add(mesh(new THREE.BoxGeometry(3, 0.5, 0.6), M(0x37474f), 0, 3.3, 0));
  } else if (k === 'futur') {
    const egg = at(mesh(new THREE.SphereGeometry(1.8, 14, 10), M(0xfafafa, { metalness: 0.3, roughness: 0.4 })), 0, 0, Y + 2.2);
    egg.scale.y = 1.3;
    scatter(G, r, 7, 4.6, () => { const h = 1 + r() * 2.5; const t = mesh(new THREE.CylinderGeometry(0.25, 0.35, h, 6), M(th.a, { emissive: th.a, emissiveIntensity: 0.25 })); t.position.y = Y + h / 2; return t; }, 2.8);
  } else if (k === 'bulles') {
    scatter(G, r, 9, 4.6, () => { const g = new THREE.Group(); g.add(mesh(new THREE.CylinderGeometry(0.35, 0.5, 4, 6), M(0x6d4c41), 0, 2, 0)); g.add(mesh(new THREE.IcosahedronGeometry(1.2, 0), M(0x7cb342), 0, 4.4, 0)); g.position.y = Y; return g; });
    scatter(G, r, 14, 5, () => { const b = mesh(new THREE.SphereGeometry(0.2 + r() * 0.35, 10, 8), M(0xb3e5fc, { transparent: true, opacity: 0.55, metalness: 0.2, roughness: 0.1 })); b.position.y = Y + 1 + r() * 4; return b; });
  } else if (k === 'corail') {
    at(mesh(new THREE.SphereGeometry(5.4, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), M(0x81d4fa, { transparent: true, opacity: 0.25 })), 0, 0, Y);
    scatter(G, r, 14, 4.4, () => { const c = mesh(new THREE.ConeGeometry(0.25, 0.8 + r() * 1.4, 5), M([0xff8a80, 0xf48fb1, 0xffcc80][Math.floor(r() * 3)])); c.position.y = Y + 0.6; return c; });
    at(mesh(new THREE.CylinderGeometry(0.8, 1.2, 2.5, 8), M(0xfff3e0)), 0, 0, Y + 1.25);
  } else if (k === 'falaise') {
    at(mesh(new THREE.BoxGeometry(11, 6, 2.4), M(0xc62828)), 0, -1.5, Y + 3);
    const c = at(new THREE.Group(), 0, -1.5, Y + 6);
    c.add(mesh(new THREE.BoxGeometry(3, 1.5, 1.6), M(0xfff8e1), 0, 0.75, 0));
    for (const x of [-1.4, 1.4]) { c.add(mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.5, 8), M(0xfff8e1), x, 1.25, 0)); c.add(mesh(new THREE.ConeGeometry(0.4, 0.8, 8), M(0xffd54f), x, 2.9, 0)); }
  } else if (k === 'gateau') {
    const c = at(new THREE.Group(), 0, 0);
    [[2.6, 0xffcdd2], [2, 0xfff3e0], [1.4, 0xf8bbd0], [0.9, 0xffffff]].forEach(([rad, col], i) => c.add(mesh(new THREE.CylinderGeometry(rad, rad, 1, 12), M(col), 0, 0.5 + i, 0)));
    c.add(mesh(new THREE.SphereGeometry(0.35, 8, 6), M(0xd32f2f), 0, 4.3, 0));
    scatter(G, r, 10, 5, () => { const l = mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 4), M(0xffffff)); l.add(mesh(new THREE.SphereGeometry(0.3, 8, 6), M([0xff80ab, 0x80deea, 0xfff176][Math.floor(r() * 3)]), 0, 0.6, 0)); l.position.y = Y + 0.6; return l; }, 3.4);
  } else if (k === 'japon') {
    const p = at(new THREE.Group(), 0, -0.5);
    for (let i = 0; i < 4; i++) { const s = 1.8 - i * 0.35; p.add(mesh(new THREE.BoxGeometry(s, 0.7, s), M(0xfff8e1), 0, 0.35 + i * 1.0, 0)); const roof = mesh(new THREE.ConeGeometry(s * 0.95, 0.4, 4), M(th.a)); roof.position.y = 0.9 + i * 1.0; roof.rotation.y = Math.PI / 4; p.add(roof); }
    scatter(G, r, 9, 5, () => { const t = new THREE.Group(); t.add(mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.9, 5), M(0x5d4037), 0, 0.45, 0)); t.add(mesh(new THREE.IcosahedronGeometry(0.6, 0), M(0xf8bbd0), 0, 1.1, 0)); t.position.y = Y; return t; }, 2.5);
  } else if (k === 'elephant') {
    top.visible = false; sand.visible = false; base.visible = false;
    const e = new THREE.Group(); e.position.y = -0.5; G.add(e);
    const body = mesh(new THREE.SphereGeometry(3.2, 12, 9), M(0x8d6e63), 0, 4.5, 0); body.scale.set(1, 0.8, 1.3); e.add(body);
    for (const [x, z] of [[-1.6, -2.4], [1.6, -2.4], [-1.6, 2.4], [1.6, 2.4]]) e.add(mesh(new THREE.CylinderGeometry(0.8, 0.9, 4, 8), M(0x795548), x, 1.5, z));
    e.add(mesh(new THREE.SphereGeometry(1.6, 10, 8), M(0x8d6e63), 0, 5.4, 3.8));
    const trunk = mesh(new THREE.CylinderGeometry(0.35, 0.5, 3.4, 7), M(0x795548), 0, 3.6, 5); trunk.rotation.x = 0.3; e.add(trunk);
    for (let i = 0; i < 10; i++) e.add(mesh(new THREE.IcosahedronGeometry(0.6, 0), M(0x66bb6a), (r() - 0.5) * 3.5, 7, (r() - 0.5) * 5));
  } else if (k === 'brume') {
    top.material = M(0x4a3f55);
    const ship = at(mesh(new THREE.BoxGeometry(8, 1.2, 4), M(0x37474f)), 0, 0, Y + 0.6); void ship;
    scatter(G, r, 9, 4.5, () => { const t = tree(r, 0x311b92, 1.8); t.rotation.z = (r() - 0.5) * 0.5; t.position.y = Y + 1.2; return t; });
    at(mesh(new THREE.BoxGeometry(1.6, 3.4, 1.6), M(0x263238)), 1.5, 0, Y + 2.9);
  } else if (k === 'rocher') {
    scatter(G, r, 12, 4.8, () => { const s = 0.6 + r() * 1.4; const m = mesh(new THREE.DodecahedronGeometry(s, 0), M(0x5d4037)); m.position.y = Y + s * 0.6; m.scale.y = 1 + r() * 1.5; return m; });
    at(mesh(new THREE.ConeGeometry(1.5, 4, 5), M(0x3e2723)), 0, 0, Y + 2);
  } else if (k === 'navire') {
    top.visible = false; sand.visible = false; base.visible = false;
    const b = new THREE.Group(); G.add(b);
    const hull = mesh(new THREE.BoxGeometry(9, 1.6, 4), M(0x8b5a2b)); hull.position.y = 0.4; b.add(hull);
    const bow = mesh(new THREE.ConeGeometry(2, 3, 4), M(0x8b5a2b), 5.5, 0.4, 0); bow.rotation.z = -Math.PI / 2; b.add(bow);
    b.add(mesh(new THREE.BoxGeometry(5, 2, 3), M(0xfff8e1), -0.5, 2.2, 0));
    b.add(mesh(new THREE.BoxGeometry(5.4, 0.3, 3.4), M(th.a), -0.5, 3.3, 0));
    b.add(mesh(new THREE.ConeGeometry(0.9, 1.6, 6), M(0xffffff), -0.5, 4.2, 0));
  } else if (k === 'pont') {
    const br = mesh(new THREE.BoxGeometry(14, 0.6, 1.4), M(0x9e9e9e)); br.position.set(3, Y + 1.8, 0); G.add(br);
    for (let i = 0; i < 5; i++) G.add(mesh(new THREE.BoxGeometry(0.6, 2.4, 0.6), M(0x757575), -2 + i * 2.6, Y + 0.6, 0));
    scatter(G, r, 5, 4, () => { const h = house(r, 0x9e9e9e, 0x5d4037); h.position.y = Y; return h; }, 2);
  } else {
    scatter(G, r, 8, 4.5, () => { const t = tree(r); t.position.y = Y; return t; });
  }
  return G;
}

function buildShip(sailColor, tier) {
  const s = new THREE.Group();
  const hullGeo = new THREE.BoxGeometry(3, 0.9, 1.3, 2, 1, 1);
  const pos = hullGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i);
    if (y < 0) pos.setZ(i, pos.getZ(i) * 0.45);
    if (x > 1.2) { pos.setZ(i, pos.getZ(i) * 0.3); pos.setY(i, y + 0.15); }
  }
  hullGeo.computeVertexNormals();
  s.add(mesh(hullGeo, M(tier >= 5 ? 0x8d6e63 : 0x6d4c41), 0, 0.3, 0));
  s.add(mesh(new THREE.BoxGeometry(2.6, 0.08, 1.1), M(0xd7b98e), -0.1, 0.78, 0));
  const masts = tier >= 3 ? [-0.6, 0.6] : [0];
  for (const x of masts) {
    s.add(mesh(new THREE.CylinderGeometry(0.05, 0.06, 2.6, 5), M(0x4e342e), x, 2, 0));
    const sail = mesh(new THREE.BoxGeometry(0.06, 1.3, 1.5), M(sailColor), x + 0.05, 2.1, 0);
    s.add(sail);
  }
  // figure de proue
  s.add(mesh(new THREE.SphereGeometry(0.25, 8, 6), M(0xfff3e0), 1.65, 0.85, 0));
  const flag = mesh(new THREE.BoxGeometry(0.02, 0.3, 0.5), M(0x111111), masts[masts.length - 1], 3.4, 0.25);
  s.add(flag);
  s.userData.flag = flag;
  return s;
}

export function playVoyage(container, o) {
  return new Promise(resolve => {
    if (!webglOK()) { resolve(); return; }
    const W = container.clientWidth || 360, H = container.clientHeight || 300;
    if (!renderer) {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.shadowMap.enabled = true;
    }
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(W, H);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const sky = new THREE.Color(o.sky ?? 0x8fd3ff);
    if (o.storm) sky.multiplyScalar(0.55);
    scene.background = sky;
    scene.fog = new THREE.Fog(sky, 30, 90);
    const cam = new THREE.PerspectiveCamera(48, W / H, 0.1, 200);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x335577, 0.9));
    const sun = new THREE.DirectionalLight(0xfff1d6, 1.4);
    sun.position.set(12, 20, 8); sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20 });
    scene.add(sun);

    // océan low-poly animé
    const oGeo = new THREE.PlaneGeometry(160, 160, 60, 60);
    oGeo.rotateX(-Math.PI / 2);
    const base = Float32Array.from(oGeo.attributes.position.array);
    const ocean = new THREE.Mesh(oGeo, new THREE.MeshStandardMaterial({ color: o.water ?? 0x2a8fd4, flatShading: true, roughness: 0.4, metalness: 0.1 }));
    ocean.receiveShadow = true;
    scene.add(ocean);

    const island = buildDiorama(o.island);
    island.position.set(0, 0, -26);
    island.rotation.y = 0.5;
    scene.add(island);

    const ship = buildShip(o.sail ?? '#f5f5f5', o.shipTier || 1);
    ship.rotation.y = Math.PI / 2;
    scene.add(ship);

    // nuages
    const clouds = [];
    const rr = seeded(hash(o.island.id + 'c'));
    for (let i = 0; i < 9; i++) {
      const c = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5 + rr() * 2, 0), M(o.storm ? 0x777777 : 0xffffff));
      c.scale.y = 0.45; c.position.set((rr() - 0.5) * 70, 14 + rr() * 6, -10 - rr() * 50);
      scene.add(c); clouds.push(c);
    }
    // pluie (Grand Line orageuse)
    let rain = null;
    if (o.storm) {
      const n = 900, g = new THREE.BufferGeometry(), p = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { p[i * 3] = (rr() - 0.5) * 50; p[i * 3 + 1] = rr() * 25; p[i * 3 + 2] = (rr() - 0.5) * 60 - 10; }
      g.setAttribute('position', new THREE.BufferAttribute(p, 3));
      rain = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xcfd8dc, size: 0.12 }));
      scene.add(rain);
    }

    const DUR = o.duration || 4200;
    const t0 = performance.now();
    let done = false, raf = 0;
    const finish = () => {
      if (done) return; done = true;
      cancelAnimationFrame(raf);
      container.removeEventListener('pointerdown', finish);
      scene.traverse(obj => { if (obj.geometry) obj.geometry.dispose(); if (obj.material) obj.material.dispose(); });
      renderer.renderLists.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      resolve();
    };
    container.addEventListener('pointerdown', finish);

    const ease = t => t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
    const frame = now => {
      const el = now - t0, t = Math.min(1, el / DUR), time = el / 1000;
      // vagues
      const pos = oGeo.attributes.position;
      const amp = o.storm ? 0.55 : 0.25;
      for (let i = 0; i < pos.count; i++) {
        const x = base[i * 3], z = base[i * 3 + 2];
        pos.array[i * 3 + 1] = Math.sin(x * 0.25 + time * 1.6) * amp + Math.cos(z * 0.3 + time * 1.3) * amp;
      }
      pos.needsUpdate = true;
      oGeo.computeVertexNormals();
      // navire : du premier plan vers l'île
      const e = ease(t);
      const z = 10 - e * 26;
      const x = Math.sin(e * Math.PI) * 4;
      ship.position.set(x, Math.sin(time * 2.2) * 0.15 + 0.05, z);
      ship.rotation.z = Math.sin(time * 1.8) * 0.06;
      ship.rotation.x = Math.cos(time * 1.4) * 0.04;
      ship.rotation.y = Math.PI / 2 + Math.cos(e * Math.PI) * 0.25;
      ship.userData.flag.rotation.y = Math.sin(time * 6) * 0.3;
      island.rotation.y = 0.5 + t * 0.35;
      for (const c of clouds) c.position.x += 0.01;
      if (rain) { const rp = rain.geometry.attributes.position; for (let i = 0; i < rp.count; i++) { let y = rp.array[i * 3 + 1] - 0.5; if (y < 0) y = 25; rp.array[i * 3 + 1] = y; } rp.needsUpdate = true; }
      if (o.storm && Math.random() < 0.008) scene.background = new THREE.Color(0xffffff); else scene.background = sky;
      // caméra : derrière le navire, puis s'élève sur le diorama
      const camZ = ship.position.z + 9 - e * 2, camY = 4.5 + e * 6;
      cam.position.set(ship.position.x * 0.6 + 6 - e * 4, camY, camZ);
      cam.lookAt(island.position.x * e + ship.position.x * (1 - e), 1.5 + e * 1.5, island.position.z * (0.35 + e * 0.65) + ship.position.z * (0.65 - e * 0.65));
      renderer.render(scene, cam);
      if (t < 1) raf = requestAnimationFrame(frame);
      else setTimeout(finish, 550);
    };
    raf = requestAnimationFrame(frame);
  });
}

// Aperçu fixe d'une île (écran de navigation, en option)
export function snapshotIsland(isl, w = 240, h = 160, sky = 0x8fd3ff, water = 0x2a8fd4) {
  if (!webglOK()) return null;
  if (!snapR) snapR = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  const rd = snapR;
  rd.setSize(w, h);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(sky);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x335577, 1));
  const sun = new THREE.DirectionalLight(0xffffff, 1.2); sun.position.set(10, 20, 10); scene.add(sun);
  const sea = new THREE.Mesh(new THREE.CircleGeometry(40, 24).rotateX(-Math.PI / 2), M(water)); scene.add(sea);
  const d = buildDiorama(isl); d.rotation.y = 0.6; scene.add(d);
  const cam = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
  cam.position.set(11, 9, 13); cam.lookAt(0, 1.5, 0);
  rd.render(scene, cam);
  const url = rd.domElement.toDataURL('image/png');
  scene.traverse(obj => { if (obj.geometry) obj.geometry.dispose(); if (obj.material) obj.material.dispose(); });
  rd.renderLists.dispose();
  return url;
}
