// Avis de recherche (WANTED) en image, pour partager sa carrière.
import { FACTIONS } from './data/factions.js';
import { fmtPrime } from './engine.js';

function wrap(ctx, text, x, y, maxW, lh) {
  const words = text.split(' ');
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, y); line = w; y += lh; }
    else line = test;
  }
  if (line) ctx.fillText(line, x, y);
  return y + lh;
}

export async function drawPoster(S) {
  try { await document.fonts.load('80px "Pirata One"'); } catch { /* police non disponible : repli */ }
  const W = 720, H = 1040;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d');
  const h = S.hero, E = S.ending;
  const gardien = S.endCamp === 'gardien';
  // papier
  const g = x.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, 700);
  g.addColorStop(0, '#f6e7c4'); g.addColorStop(1, '#d9b97f');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  // taches
  for (let i = 0; i < 60; i++) {
    x.fillStyle = `rgba(120,80,30,${Math.random() * 0.06})`;
    x.beginPath(); x.arc(Math.random() * W, Math.random() * H, Math.random() * 40, 0, Math.PI * 2); x.fill();
  }
  x.strokeStyle = '#5a3d1e'; x.lineWidth = 6; x.strokeRect(24, 24, W - 48, H - 48);
  x.lineWidth = 2; x.strokeRect(36, 36, W - 72, H - 72);
  x.fillStyle = '#3b2a1a'; x.textAlign = 'center';
  const title = gardien ? 'JUSTICE' : E.kind === 'onepiece' ? 'LÉGENDE' : 'WANTED';
  x.font = '110px "Pirata One", Georgia, serif';
  x.fillText(title, W / 2, 150);
  // portrait
  const px = 90, py = 185, pw = W - 180, ph = 400;
  x.fillStyle = '#efe0bd'; x.fillRect(px, py, pw, ph);
  x.strokeStyle = '#3b2a1a'; x.lineWidth = 4; x.strokeRect(px, py, pw, ph);
  const sky = x.createLinearGradient(0, py, 0, py + ph);
  sky.addColorStop(0, '#c9d9e0'); sky.addColorStop(1, '#efe0bd');
  x.fillStyle = sky; x.fillRect(px + 4, py + 4, pw - 8, ph - 8);
  x.font = '230px serif';
  x.fillText(h.emoji, W / 2, py + 300);
  if (h.fruit) { x.font = '60px serif'; x.fillText('🍇', px + pw - 50, py + 70); }
  if (h.haki.roi) { x.font = '60px serif'; x.fillText('👑', px + 50, py + 70); }
  x.fillStyle = '#3b2a1a';
  x.font = '64px "Pirata One", Georgia, serif';
  x.fillText(gardien ? FACTIONS[h.faction].name.toUpperCase() : (E.kind === 'death' ? 'DEAD' : 'DEAD OR ALIVE'), W / 2, py + ph + 70);
  x.font = '72px "Pirata One", Georgia, serif';
  const nm = h.name.length > 18 ? h.name.slice(0, 17) + '…' : h.name;
  x.fillText(nm, W / 2, py + ph + 150);
  x.font = 'bold 54px Georgia, serif';
  const prime = h.bounty ? fmtPrime(h.bounty).replace(' ฿', '') + ' ฿' : (gardien ? E.rank : '0 ฿');
  x.fillText(prime, W / 2, py + ph + 225);
  x.font = 'italic 24px Georgia, serif';
  x.fillStyle = '#5a3d1e';
  let y = wrap(x, `${E.rank === E.level.name ? E.rank : E.rank + ' · ' + E.level.name} · ${E.progressLabel}`, W / 2, py + ph + 275, W - 140, 30);
  x.font = '22px Georgia, serif';
  wrap(x, `« ${E.epitaph} »`, W / 2, y + 6, W - 140, 28);
  x.font = 'bold 26px Georgia, serif';
  x.fillStyle = '#7a1f1f';
  x.fillText(`Note ${E.grade}`, 130, H - 70);
  x.fillStyle = '#3b2a1a';
  x.font = '30px "Pirata One", Georgia, serif';
  x.fillText('MARINE', W - 130, H - 66);
  x.font = '16px Georgia, serif';
  x.fillText('Destiny One Piece', W / 2, H - 46);
  return c;
}

export async function posterBlob(S) {
  const c = await drawPoster(S);
  return new Promise(r => c.toBlob(r, 'image/png'));
}
