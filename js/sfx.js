// Petits bruitages synthétisés (aucun fichier audio) — coupés si l'utilisateur le demande.
let ctx = null, muted = false;
try { muted = localStorage.getItem('dop_mute') === '1'; } catch {}
export const isMuted = () => muted;
export function setMuted(v) { muted = v; try { localStorage.setItem('dop_mute', v ? '1' : '0'); } catch {} }
function tone(freq, dur, type = 'triangle', at = 0, vol = 0.07, slide = 0) {
  if (muted) return;
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + at;
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + dur + 0.02);
  } catch {}
}
export const sfx = {
  win: () => { tone(523, 0.12); tone(659, 0.12, 'triangle', 0.09); tone(784, 0.2, 'triangle', 0.18); },
  lose: () => { tone(220, 0.25, 'sawtooth', 0, 0.05, -90); tone(150, 0.3, 'sawtooth', 0.15, 0.05, -60); },
  coin: () => { tone(988, 0.07, 'square', 0, 0.04); tone(1319, 0.14, 'square', 0.07, 0.04); },
  hit: () => tone(110, 0.18, 'square', 0, 0.08, -50),
  level: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, 'triangle', i * 0.09, 0.07)); },
  combo: n => tone(440 + n * 80, 0.12, 'triangle', 0, 0.06),
  click: () => tone(660, 0.04, 'square', 0, 0.025),
};
