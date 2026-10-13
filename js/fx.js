// Effets de jeu : annonces plein écran, vignettes. Tout est décoratif et désactivé si l'utilisateur préfère moins d'animations.
const reduce = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
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
