// Effets de jeu : confettis, annonces plein écran, vignettes. Tout est décoratif et désactivé si l'utilisateur préfère moins d'animations.
const reduce = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
let cv = null, cx = null, parts = [], raf = 0;

function ensureCanvas() {
  if (cv) return;
  cv = document.createElement('canvas');
  cv.id = 'fxcanvas';
  Object.assign(cv.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 70 });
  document.body.appendChild(cv);
  cx = cv.getContext('2d');
  const fit = () => { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; };
  fit(); addEventListener('resize', fit);
}
function loop() {
  cx.clearRect(0, 0, cv.width, cv.height);
  const k = devicePixelRatio;
  parts = parts.filter(p => p.life > 0 && p.y < cv.height + 40);
  for (const p of parts) {
    p.vy += p.g; p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.rot += p.vr; p.life--;
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.globalAlpha = Math.min(1, p.life / 25);
    if (p.emoji) { cx.font = `${p.s * k}px serif`; cx.fillText(p.emoji, 0, 0); }
    else { cx.fillStyle = p.c; cx.fillRect(-p.s * k / 2, -p.s * k / 4, p.s * k, p.s * k / 2); }
    cx.restore();
  }
  raf = parts.length ? requestAnimationFrame(loop) : 0;
  if (!parts.length) cx.clearRect(0, 0, cv.width, cv.height);
}
// gerbe de confettis depuis (x, y) en fractions de l'écran
export function confetti({ x = 0.5, y = 0.35, n = 50, colors = ['#f4c542', '#e8553d', '#3fa7d6', '#59c36a', '#b983ff'], emoji = null, power = 1 } = {}) {
  if (reduce()) return;
  ensureCanvas();
  const k = devicePixelRatio;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4, v = (4 + Math.random() * 7) * power * k;
    parts.push({ x: x * cv.width, y: y * cv.height, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 0.22 * k, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, s: 7 + Math.random() * 7, c: colors[i % colors.length], emoji: emoji && i % 3 === 0 ? emoji : null, life: 70 + Math.random() * 50 });
  }
  if (!raf) raf = requestAnimationFrame(loop);
}
export const fireworks = () => { for (let i = 0; i < 4; i++) setTimeout(() => confetti({ x: 0.2 + Math.random() * 0.6, y: 0.3 + Math.random() * 0.2, n: 40, power: 1.2 }), i * 260); };

// annonce plein écran (niveau, palier, guerre...)
export function banner(text, sub = '', kind = 'gold') {
  const el = document.createElement('div');
  el.className = 'bigbanner ' + kind;
  el.innerHTML = `<b>${text}</b>${sub ? `<small>${sub}</small>` : ''}`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2300);
}
// vignette colorée sur les bords de l'écran
export function vignette(kind) {
  const el = document.createElement('div');
  el.className = 'vignette ' + kind;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 700);
}
// compteur animé (nombres du HUD)
export function tick(el, from, to, fmt = v => v, ms = 500) {
  if (reduce() || !el || from === to) { if (el) el.textContent = fmt(to); return; }
  const t0 = performance.now();
  const step = t => { const u = Math.min(1, (t - t0) / ms), e = 1 - (1 - u) ** 3; el.textContent = fmt(Math.round(from + (to - from) * e)); if (u < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
