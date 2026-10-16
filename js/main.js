import { sfx, isMuted, setMuted } from './sfx.js';
import { banner, vignette } from './fx.js';
// Interface : écrans, rendu, interactions.
import * as G from './engine.js';
import * as B from './battle.js';
import { SEAS, ISLANDS, START_SEAS, START_ISLANDS } from './data/islands.js';
import { FACTIONS, FACTION_HOME, LEVELS, PROGRESS, ERAS, YONKO, CAMPS } from './data/factions.js';
import { FRUITS, FRUIT_TYPES, WEAPONS, WEAPON_TYPES, SHIPS, ROLES, STATS, ITEMS, fruitPrice, weaponPrice, SHIP_MODELS, SHIP_MODS, FIGUREHEADS, SAIL_COLORS } from './data/items.js';
import { CHARACTERS } from './data/characters.js';
import { LEGENDS, BADGES, DAILY_GOALS, randomHeroName } from './data/meta.js';
import { RACES, racePoints, RACE_HOME } from './data/races.js';
import { GROUPS, groupOfChar, standingOf } from './data/groups.js';
import { drawPoster, posterBlob } from './share.js';

const app = document.getElementById('app');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const STAT_KEYS = Object.keys(STATS);
const pointsOf = f => racePoints(RACES[f.race] || RACES.humain);
// répartit au hasard les points restants (jamais au-dessus de 10)
function trimStats(f) { let over = STAT_KEYS.reduce((a, k) => a + f.stats[k] - 3, 0) - pointsOf(f), guard = 200; while (over > 0 && guard--) { const k = [...STAT_KEYS].sort((a, b) => f.stats[b] - f.stats[a])[0]; f.stats[k]--; over--; } }
function fillRandom(f) {
  let left = pointsOf(f) - STAT_KEYS.reduce((a, k) => a + f.stats[k] - 3, 0), guard = 400;
  while (left > 0 && guard--) { const k = STAT_KEYS[Math.floor(Math.random() * STAT_KEYS.length)]; if (f.stats[k] < 10) { f.stats[k]++; left--; } }
  while (left < 0 && guard--) { const k = STAT_KEYS[Math.floor(Math.random() * STAT_KEYS.length)]; if (f.stats[k] > 1) { f.stats[k]--; left++; } }
}

// ───────────── stockage local (tout est optionnel) ─────────────
const store = {
  get(k, d) { try { const v = localStorage.getItem('dop.' + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('dop.' + k, JSON.stringify(v)); } catch { /* stockage indisponible */ } },
  del(k) { try { localStorage.removeItem('dop.' + k); } catch { /* idem */ } },
};

const U = {
  screen: 'home', modal: null, tab: 'profil', sub: null, S: null,
  anim: store.get('anim', !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches),
  view: store.get('view', 'top'),
  form: null, voyaging: false, toast: null, posterUrl: null, saved: false,
};

function defaultForm(mode = 'career') {
  return { mode, length: 'rapide', era: 'pre', name: '', race: 'humain', faction: 'pirate', role: 'capitaine', sea: 'east', island: 'fuchsia', stats: Object.fromEntries(STAT_KEYS.map(k => [k, 3])), shipName: '', age: 17 };
}

// ───────────── rendu ─────────────
function render() {
  const S = U.S;
  let html = '';
  if (U.screen === 'home') html = vHome();
  else if (U.screen === 'create') html = vCreate();
  else if (U.screen === 'game' && S) html = vGame(S);
  else if (U.screen === 'pantheon') html = vPantheon();
  else if (U.screen === 'badges') html = vBadges();
  else if (U.screen === 'daily') html = vDaily();
  else if (U.screen === 'duel') html = vDuel();
  else if (U.screen === 'story') html = vStory();
  else if (U.screen === 'rules') html = vRules();
  app.innerHTML = html + (U.modal ? vModal() : '');
  // transitions : l'écran entre en scène seulement quand il change vraiment
  { const key = [U.screen, S?.phase, S?.cur?.id ?? S?.cur?.gen?.id, U.sub?.kind, S?.turn, U.modal].join(':'), changed = key !== U.lastKey; U.lastKey = key;
    app.classList.toggle('enter', changed); 
    if (changed) document.querySelectorAll('.choice,.act,.dest,.fxc,.item').forEach((el, i) => el.style.setProperty('--i', Math.min(i, 9))); }
  if (U.screen === 'game' && S) hudFeedback(S); else U.prevHud = null;
  if (U.screen === 'game' && S?.phase === 'result' && S.result && U.sfxFor !== S.result) { U.sfxFor = S.result; if (S.result.ok === true) { sfx.win(); } else if (S.result.ok === false) { sfx.lose(); vignette('bad'); } }
  if (U.screen === 'game' && S?.phase === 'voyage' && !U.voyaging) runVoyage();
  if (U.screen === 'game' && S?.phase === 'end') { mountPoster(); if (U.endFx !== S) { U.endFx = S; if (S.ending?.kind === 'onepiece') { sfx.level(); } else if (S.ending?.kind === 'death') vignette('bad'); } }
  if (U.screen === 'game' && U.anim) { mountThumbs(); mountShipPrev(); }
}

// retours visuels : variations de PV, berrys, moral, navire, prime... flottent à l'écran
function hudFeedback(S) {
  const cur = { hp: S.hero.hp, gold: S.hero.berrys, mor: S.morale, ship: S.ship.hp, bounty: S.hero.bounty, prog: S.progress, crew: S.crew.length, lvl: G.levelIdxOf(S), fr: Object.fromEntries(Object.keys(GROUPS).map(g => [g, G.grel(S, g)])), S };
  const p = U.prevHud; U.prevHud = cur;
  if (!p || p.S !== S) return;
  const items = [];
  const fr = {}; for (const g of Object.keys(GROUPS)) fr[g] = G.grel(S, g);
  if (p.fr) for (const g of Object.keys(fr)) { const dv = fr[g] - (p.fr[g] || 0); if (dv) items.push({ t: `${GROUPS[g].emoji} ${dv > 0 ? '♥' : '✖'}${Math.abs(dv)}`, k: dv > 0 ? 'up' : 'down' }); }
  const d = (k, em, fmt = v => v, cls) => { const v = cur[k] - p[k]; if (v) items.push({ t: `${em} ${v > 0 ? '+' : '−'}${fmt(Math.abs(v))}`, k: v > 0 ? 'up' : 'down' }); };
  d('hp', '❤️', v => Math.round(v)); d('ship', '🚢', v => Math.round(v)); d('gold', '💰', G.fmtPrime); d('mor', '😄', v => v); d('bounty', '📜', G.fmtPrime);
  if (cur.crew !== p.crew) items.push({ t: `👥 ${cur.crew > p.crew ? '+' : '−'}${Math.abs(cur.crew - p.crew)}`, k: cur.crew > p.crew ? 'up' : 'down' });
  if (cur.prog > p.prog) items.push({ t: `🎯 ${PROGRESS[G.campOf(S)][cur.prog]}`, k: 'gold' });
  if (cur.lvl > p.lvl) items.push({ t: `⭐ Niveau ${LEVELS[cur.lvl].name}`, k: 'gold' });
  if (!items.length) return;
  if (cur.lvl > p.lvl) { banner('⭐ NIVEAU SUPÉRIEUR', LEVELS[cur.lvl].name); } else if (cur.prog > p.prog) { banner('🎯 NOUVEAU PALIER', PROGRESS[G.campOf(S)][cur.prog], 'blue'); }
  if (cur.lvl > p.lvl || cur.prog > p.prog) sfx.level(); else if (cur.hp < p.hp || cur.ship < p.ship) sfx.hit(); else if (cur.gold > p.gold) sfx.coin();
  let box = document.getElementById('floats');
  if (!box) { box = document.createElement('div'); box.id = 'floats'; document.body.appendChild(box); }
  items.slice(0, 6).forEach((it, i) => { const el = document.createElement('span'); el.className = 'fl ' + it.k; el.textContent = it.t; el.style.animationDelay = i * 0.12 + 's'; box.appendChild(el); setTimeout(() => el.remove(), 2200 + i * 120); });
  const hud = document.querySelector('.hud');
  if (hud) { const bad = cur.hp < p.hp || cur.ship < p.ship; hud.classList.add(bad ? 'flash-bad' : 'flash-good'); setTimeout(() => hud.classList.remove('flash-bad', 'flash-good'), 700); }
  if (p.hp - cur.hp >= 20) { document.body.classList.add('shake'); setTimeout(() => document.body.classList.remove('shake'), 450); }
}

// miniatures 3D des îles sur les cartes de destination
const THUMBS = {};
async function mountThumbs() {
  const els = [...document.querySelectorAll('[data-thumb]')].filter(e => !THUMBS[e.dataset.thumb]);
  if (!els.length) return;
  try {
    const V = await import('./voyage3d.js');
    if (!V.webglOK()) return;
    for (const el of els) {
      const id = el.dataset.thumb, isl = ISLANDS[id], sea = SEAS[isl.sea];
      await new Promise(r => setTimeout(r, 0));
      THUMBS[id] = V.snapshotIsland(isl, 160, 160, sea.sky, sea.water);
      const cur = document.querySelector(`[data-thumb="${id}"]`);
      if (cur && THUMBS[id]) cur.innerHTML = `<img src="${THUMBS[id]}" alt="">`;
    }
  } catch (e) { console.warn('miniatures indisponibles', e); }
}

// message éphémère, sans redessiner la page (sinon on casserait l'animation de voyage)
let toastTimer = 0;
function toast(t) {
  let el = document.getElementById('toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = t;
  el.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.style.display = 'none'; }, 2200);
}

// ───────────── accueil ─────────────
function vHome() {
  const save = store.get('save', null);
  const daily = store.get('daily.' + G.todayStr(), null);
  return `
  <div class="home">
    <div class="logo">
      <div class="logo-skull">🏴‍☠️</div>
      <h1>Destiny <span>One Piece</span></h1>
      <p class="tag">Pirate, Marine, Révolutionnaire ou Dragon Céleste : tu choisis, la mer décide.</p>
    </div>
    <div class="menu">
      ${save ? `<button class="btn big gold" data-act="resume">⏯️ Reprendre : ${esc(save.hero.name)} <small>${esc(ISLANDS[save.loc].name)} · tour ${save.turn}</small></button>` : ''}
      <button class="btn big gold" data-act="quick">⚡ Partie express <small>Un perso au hasard, tu pars tout de suite</small></button>
      <button class="btn big" data-act="new">🧭 Carrière <small>Crée ton perso et construis ta légende</small></button>
      <button class="btn big" data-act="go" data-arg="daily">📅 Défi du jour ${daily ? '<small>✅ Joué aujourd\'hui</small>' : '<small>Un profil imposé, un objectif, le même pour tous</small>'}</button>
      <button class="btn big" data-act="go" data-arg="duel">⚔️ Duel entre amis <small>Même départ, deux destins</small></button>
      <button class="btn big" data-act="go" data-arg="story">📖 Mode Histoire <small>Revis une légende et fais mieux</small></button>
      <div class="menu-row">
        <button class="btn" data-act="go" data-arg="pantheon">🏛️ Panthéon</button>
        <button class="btn" data-act="go" data-arg="badges">🎖️ Quêtes</button>
        <button class="btn" data-act="go" data-arg="rules">❓ Règles</button>
      </div>
      <label class="opt"><input type="checkbox" data-act="toggleSfx" ${isMuted() ? '' : 'checked'}> Sons</label>
    <label class="opt"><input type="checkbox" data-act="toggleAnim" ${U.anim ? 'checked' : ''}> Animation 3D des voyages</label>
      ${vViewPick()}
    </div>
    <p class="foot">Jeu de fan non officiel, non commercial. One Piece © Eiichiro Oda / Shūeisha / Toei Animation.<br>Données inspirées du One Piece Wiki (Fandom, CC BY-SA 3.0).</p>
  </div>`;
}

function vRules() {
  return `${backBar('Règles')}
  <div class="page card">
    <h2>Comment ça marche</h2>
    <p>Tu ne contrôles pas les combats : tu prends les <b>décisions</b>, et le destin (les dés) fait le reste. Chaque choix indique la caractéristique utilisée et le niveau de risque.</p>
    <h3>🎯 Le but</h3>
    <p><b>Chercheurs</b> (pirates, révolutionnaires, chasseurs, Corsaires, Empereurs) : trouver le One Piece. <b>Gardiens</b> (Marine, Gouvernement, Chevaliers Divins) : le protéger. Dans les deux cas : réunir les 4 <b>Poneglyphes routiers</b> (Zou, Totto Land, Wano, Elbaf), savoir les lire, puis atteindre <b>Laugh Tale</b>. Va le plus loin possible.</p>
    <h3>🧭 Tu n'es pas Luffy</h3>
    <p>Tu choisis ta route. Sur les grandes îles, le destin tire au sort entre l'arc que l'on connaît (Arlong, Crocodile, Enies Lobby...) et une autre histoire. Tu peux revivre le parcours canon... ou pas du tout.</p>
    <h3>🧭 Une route, deux chemins</h3>
    <p>Chaque mer a sa route, dans un ordre logique. À chaque étape, tu choisis entre <b>les deux prochaines îles</b> (A ou B) : celle que tu laisses reste la suivante. Pas de zigzag : on avance. Les Poneglyphes manqués peuvent être retentés plus tard.</p>
    <h3>📖 Les trames</h3>
    <p>Pour les Gardiens, certaines histoires se déroulent en plusieurs étapes, à plusieurs escales d'intervalle : le supérieur corrompu, le Buster Call, SWORD, les épreuves d'Amiral, l'infiltration du CP, la Réverie, l'esclave évadé, et... le Trône Vide.</p>
    <h3>🗺️ Le voyage</h3>
    <p>À chaque île : un événement, puis une <b>escale</b> (entraînement, taverne, marché, chantier naval...). Ensuite tu choisis ta prochaine destination. Les Blues sont faciles, Grand Line beaucoup moins, le Nouveau Monde est un cimetière.</p>
    <h3>🤕 Blessures, mort... ou vie rangée</h3>
    <p>Un premier K.O. te laisse <b>blessé grave</b> (et coûte cher). Un second K.O. avant de te soigner te met <b>au bord du gouffre</b> : tu peux tenter de te relever (et risquer la mort définitive) ou <b>choisir une vie bien rangée</b>, qui termine la carrière avec un score réduit. Tu peux aussi prendre ta retraite à tout moment depuis le menu ☰. La capture mène à Impel Down, dont on s'évade... rarement.</p>
    <h3>💪 Puissance et rang</h3>
    <p>Ton <b>indice de combat</b> combine tes caractéristiques, ton fruit, ton Haki, ton arme, ton équipage, tes alliés et ta flotte. Mais le <b>rang</b> (Rookie, Supernova, Corsaire, YC3... jusqu'à RDP) se mérite : il est plafonné par le <b>plus fort adversaire que tu as vraiment vaincu</b>. Pour être reconnu au niveau d'un Corsaire, il faut en avoir battu un de ce calibre.</p>
    <h3>⚓ Les escales</h3>
    <p>Une seule action par île : t'entraîner, te reposer, explorer, ou utiliser un service du port (taverne, marché, boulots, rapport). Le <b>chantier naval est gratuit</b> et ne consomme pas d'action : améliore ton navire à chaque escale. Les choix sont peu nombreux mais décisifs : les échecs font plus mal, les réussites rapportent plus.</p>
    <h3>🧬 Races</h3>
    <p>Humain (la référence), Homme-poisson, Sirène, Mink, Géant, Longs-Bras, Longues-Jambes, Trois-Yeux, Lunarien, Tontatta. Chaque race a ses avantages et ses inconvénients, et ses propres événements. Imposée dans le Défi du jour.</p>
    <h3>🍇 Fruits du Démon</h3>
    <p>Un seul par personne. Tu peux le refuser, le garder dans la cale, le vendre, ou le donner à un membre d'équipage. Attention aux SMILE.</p>
    <h3>🔀 Factions</h3>
    <p>À des moments clés, tu pourras changer de camp : Corsaire, protégé d'un Empereur, Révolution, désertion... Certains passages sont plus faciles que d'autres.</p>
  </div>`;
}

function vViewPick() {
  return `<div class="viewpick">🎥 Vue du voyage : <button class="chip ${U.view === 'top' ? 'on' : ''}" data-act="view" data-arg="top">🗺️ Du dessus</button><button class="chip ${U.view === 'side' ? 'on' : ''}" data-act="view" data-arg="side">🌊 Ras de l'eau</button></div>`;
}

function backBar(title) {
  return `<div class="topbar"><button class="btn ghost" data-act="home">← Accueil</button><h2>${esc(title)}</h2></div>`;
}

// ───────────── création ─────────────
function vCreate() {
  const f = U.form;
  const used = STAT_KEYS.reduce((a, k) => a + f.stats[k] - 3, 0);
  const total = pointsOf(f), left = total - used;
  const isDuelJoin = f.mode === 'duel' && f.locked;
  const lock = f.locked ? 'disabled' : '';
  const seaOpts = START_SEAS.filter(s => s.id !== 'redline' || f.faction === 'chevalier');
  const facs = Object.entries(FACTIONS).filter(([, x]) => x.start);
  const rolePreview = ROLES[f.role];
  return `${backBar(f.mode === 'duel' ? (isDuelJoin ? 'Rejoindre un duel' : 'Créer un duel') : 'Nouvelle carrière')}
  <div class="page create">
    ${isDuelJoin ? `<div class="card note">⚔️ Profil imposé par le code de duel. Choisis juste ton nom et ton apparence.</div>` : ''}
    <section class="card">
      <h3>🏷️ Identité</h3>
      <div class="row gap"><input class="inp" maxlength="24" placeholder="Laisse vide pour un nom au hasard" value="${esc(f.name)}" data-input="name"><button class="btn sm" data-act="randname" title="Nom au hasard">🎲</button></div>
      <div class="row"><input class="inp" maxlength="28" placeholder="Nom du navire (optionnel)" value="${esc(f.shipName)}" data-input="shipName"></div>
    </section>
    <section class="card">
      <h3>🧬 Race</h3>
      <div class="grid2">${Object.values(RACES).map(r => `<button class="pick ${f.race === r.id ? 'on' : ''}" data-act="f" data-k="race" data-arg="${r.id}" ${lock || (f.faction === 'chevalier' && r.id !== 'humain') ? 'disabled' : ''}><span class="e">${r.emoji}</span><b>${r.name}</b><small>${esc(r.desc)}</small></button>`).join('')}</div>
      ${(() => { const r = RACES[f.race]; const st = Object.entries(r.stats).map(([k, v]) => `${v > 0 ? '+' : ''}${v} ${STATS[k].name}`).join(', '); return `<div class="racebox"><p><b>${r.emoji} ${r.name}</b>${st ? ` · ${st}` : ''}${r.hp ? ` · ${r.hp > 0 ? '+' : ''}${r.hp} PV` : ''}${r.combat ? ` · +${r.combat} combat` : ''}${(RACE_HOME[r.id] || []).length ? ` · 🏠 ${RACE_HOME[r.id].map(i => esc(ISLANDS[i]?.name || i)).join(', ')}` : ''}</p><ul class="pc">${r.pros.map(x => `<li class="pro">✅ ${esc(x)}</li>`).join('')}${r.cons.map(x => `<li class="con">⚠️ ${esc(x)}</li>`).join('')}</ul></div>`; })()}
      ${f.faction === 'chevalier' ? '<p class="hint">Les Dragons Célestes sont tous humains.</p>' : ''}
    </section>
    <section class="card">
      <h3>⏳ Partie</h3>
      <div class="seg">${Object.entries(G.LENGTHS).map(([id, l]) => `<button class="${f.length === id ? 'on' : ''}" data-act="f" data-k="length" data-arg="${id}" ${lock}><b>${l.name}</b><small>${l.desc}</small></button>`).join('')}</div>
      <div class="seg">${Object.values(ERAS).map(e => `<button class="${f.era === e.id ? 'on' : ''}" data-act="f" data-k="era" data-arg="${e.id}" ${lock}><b>${e.name}</b><small>${e.sub}</small></button>`).join('')}</div>
      <p class="hint">${esc(ERAS[f.era].desc)}</p>
    </section>
    <section class="card">
      <h3>🏳️ Faction</h3>
      <div class="grid2">${facs.map(([id, x]) => `<button class="pick ${f.faction === id ? 'on' : ''}" data-act="f" data-k="faction" data-arg="${id}" ${lock}><span class="e">${x.emoji}</span><b>${x.name}</b><small>${esc(x.desc)}${x.needsOrigin ? ' (né à Marie Geoise)' : ''}</small></button>`).join('')}</div>
      <p class="hint">Corsaire, protégé d'un Empereur et Empereur se gagnent en cours de route.</p>
    </section>
    <section class="card">
      <h3>🎭 Rôle</h3>
      <div class="chips">${Object.entries(ROLES).map(([id, r]) => `<button class="chip ${f.role === id ? 'on' : ''}" data-act="f" data-k="role" data-arg="${id}" ${lock}>${r.emoji} ${r.name}</button>`).join('')}</div>
      <p class="hint">${rolePreview.emoji} ${esc(rolePreview.desc)} <b>+2 ${STATS[rolePreview.stat].name}</b>.${f.faction === 'pirate' && f.role !== 'capitaine' ? ' Tu commences sous les ordres d\'un autre capitaine.' : ''}</p>
    </section>
    <section class="card">
      <h3>🌊 Point de départ</h3>
      <div class="chips">${seaOpts.map(s => `<button class="chip ${f.sea === s.id ? 'on' : ''}" data-act="f" data-k="sea" data-arg="${s.id}" ${lock}>${SEAS[s.id].emoji} ${s.label}</button>`).join('')}</div>
      <p class="hint">${esc(START_SEAS.find(s => s.id === f.sea)?.hint)}</p>
      <select class="inp" data-input="island" ${lock}>${(START_ISLANDS[f.sea] || []).map(id => `<option value="${id}" ${f.island === id ? 'selected' : ''}>${esc(ISLANDS[id].name)} — ${esc(ISLANDS[id].sub)}</option>`).join('')}</select>
      <p class="hint">${esc(ISLANDS[f.island]?.desc)}</p>
      <div class="row"><label>Âge de départ <input class="inp sm" type="number" min="10" max="60" value="${f.age}" data-input="age" ${lock}></label></div>
    </section>
    <section class="card">
      <h3>📊 Caractéristiques <span class="pts ${left ? '' : 'zero'}">${left} / ${total} point${total > 1 ? 's' : ''} (selon ta race)</span></h3>
      ${f.locked ? '' : '<div class="row"><button class="btn sm" data-act="randstats">🎲 Répartir au hasard</button></div>'}
      ${STAT_KEYS.map(k => `<div class="statrow"><span>${STATS[k].emoji} ${STATS[k].name}</span>
        <button class="sbtn" data-act="stat" data-k="${k}" data-arg="-1" ${lock || f.stats[k] <= 1 ? 'disabled' : ''}>−</button>
        <b>${f.stats[k]}</b>
        <button class="sbtn" data-act="stat" data-k="${k}" data-arg="1" ${lock || left <= 0 || f.stats[k] >= 10 ? 'disabled' : ''}>+</button>
        <span class="bar"><i style="width:${f.stats[k] * 10}%"></i></span></div>`).join('')}
      <p class="hint">Bonus automatiques : rôle (+2) et faction (+1/+1).</p>
    </section>
    ${vRecap(f)}
    ${f.mode === 'duel' && !f.locked ? `<p class="hint center">Une fois lancé, un code de duel apparaîtra : envoie-le à tes amis pour qu'ils partent du même profil.</p>` : ''}
    <button class="btn big gold" data-act="launch">⛵ Prendre la mer</button>
    ${!f.locked && left > 0 ? `<p class="hint center">Les ${left} point${left > 1 ? 's' : ''} restant${left > 1 ? 's' : ''} seront répartis au hasard.</p>` : ''}
  </div>`;
}

// ───────────── jeu ─────────────
// à la Reigns : jauges d'affection (vert = aimé, rouge = détesté), centrées sur 0
function vAffinity(S) {
  const gs = Object.values(GROUPS).map(g => ({ g, v: G.grel(S, g.id) })).filter(x => x.v !== 0).sort((a, b) => Math.abs(b.v) - Math.abs(a.v)).slice(0, 5);
  const combo = S.combo >= 2 ? `<span class="combo" title="Réussites enchaînées : +5 % de gains par niveau">🔥×${S.combo}</span>` : '';
  if (!gs.length && !combo) return '';
  return `<div class="affs">${combo}${gs.map(({ g, v }) => `<span class="gauge ${v > 0 ? 'love' : 'hate'}" title="${esc(g.name)} : ${standingOf(v).name} (${v > 0 ? '+' : ''}${v})"><em>${g.emoji}</em><i class="track"><i style="width:${Math.abs(v) * 5}%;${v > 0 ? 'left:50%' : 'right:50%'}"></i></i></span>`).join('')}</div>`;
}
function vHud(S) {
  const h = S.hero;
  const hpPct = Math.max(0, Math.round(h.hp / h.hpMax * 100));
  const lv = LEVELS[G.levelIdxOf(S)];
  return `<header class="hud">
    <div class="hud-top">
      <button class="hud-id" data-act="exam">${h.emoji}<div><b>${esc(h.name)}</b><small>${RACES[h.race || 'humain'].emoji} ${esc(RACES[h.race || 'humain'].name)} · ${FACTIONS[h.faction].emoji} ${esc(G.rankName(S))}</small><small>${lv.emoji} ${esc(lv.name)}</small></div></button>
      <div class="hud-btns"><button class="btn sm" data-act="exam">🔍 Examiner</button><button class="btn sm ghost" data-act="menu">☰</button></div>
    </div>
    <div class="hud-stats">
      <span class="hp ${S.flags.wounded ? 'wounded' : ''}" title="Points de vie">❤️ <span class="bar"><i style="width:${hpPct}%"></i></span> <b>${Math.max(0, h.hp)}</b>/${h.hpMax}${S.flags.wounded ? ' 🤕' : ''}</span>
      <span class="chips">
        <span class="chip" title="Berrys">💰 ${G.fmtPrime(h.berrys)}</span>
        <span class="chip" title="Moral de l'équipage">${S.morale >= 60 ? '😄' : S.morale >= 30 ? '😐' : '😞'} ${S.morale}</span>
        ${h.bounty ? `<span class="chip" title="Prime">📜 ${G.fmtPrime(h.bounty)}</span>` : ''}
        <span class="chip ${S.turn >= S.maxTurns - 4 ? 'late' : ''}" title="Escales / limite">⏳ ${S.turn}/${S.maxTurns}</span>
      </span>
    </div>
    ${vAffinity(S)}
    <div class="goalbar" title="${esc(PROGRESS[G.campOf(S)][Math.min(9, S.progress + 1)] || '')}">${PROGRESS[G.campOf(S)].map((x, i) => `<i class="${i <= S.progress ? 'on' : ''} ${i === S.progress + 1 ? 'next' : ''}" title="${esc(x)}"></i>`).join('')}<span>🗺️ ${esc(PROGRESS[G.campOf(S)][S.progress])} <small>→ ${esc(PROGRESS[G.campOf(S)][Math.min(9, S.progress + 1)])}</small></span></div>
  </header>`;
}

function vLoc(S) {
  const isl = ISLANDS[S.loc], sea = SEAS[isl.sea];
  return `<div class="loc" style="--sea:#${sea.water.toString(16).padStart(6, '0')}">
    <span class="locthumb" data-thumb="${S.loc}">${THUMBS[S.loc] ? `<img src="${THUMBS[S.loc]}" alt="">` : sea.emoji}</span>
    <div class="locmain">${G.homeBonuses(S).length ? `<span class="homepill" title="Léger avantage aux jets et au combat, prix réduits, accueil qui soigne">🏠 ${esc(G.homeBonuses(S).map(b => b.label).join(' · '))}</span>` : ''}<span class="sea">${sea.emoji} ${esc(sea.name)}${G.groupsHere(S).map(g => { const st = standingOf(G.grel(S, g.id)); return ` <i class="gtag ${st.k}" title="${esc(g.name)} : ${st.name}">${g.emoji} ${st.emoji}</i>`; }).join('')}</span><h2>${esc(isl.name)}</h2><small>${esc(isl.sub)} · ${'★'.repeat(isl.pop)}${'☆'.repeat(3 - isl.pop)}</small></div>
    <div class="age">${Math.floor(S.hero.age)} ans<br><small>${esc(S.ship.name)} ${G.shipModel(S).emoji}</small></div>
  </div>`;
}

function vGame(S) {
  if (S.phase === 'end') return vEnd(S);
  if (U.intro) return vHud(S) + `<main class="game">${vIntro(S)}</main>`;
  let body = '';
  if (S.phase === 'event') body = vEvent(S);
  else if (S.phase === 'result') body = vResult(S);
  else if (S.phase === 'escale') body = vEscale(S);
  else if (S.phase === 'nav') body = vNav(S);
  else if (S.phase === 'voyage') body = vVoyage(S);
  else if (S.phase === 'battle') { if (!S.battle) B.initBattle(S); body = vBattle(S); }
  return vHud(S) + `<main class="game">${S.phase !== 'voyage' ? vLoc(S) : ''}${body}</main>`;
}

const STAT_LABEL = s => (s === 'pacte' ? '⛓️ Pacte d\'Imu' : s === 'haki_obs' ? '👁️ Haki d\'observation' : s === 'haki_arm' ? '🛡️ Haki d\'armement' : s === 'haki_roi' ? '👑 Haki des Rois' : s === 'fruit' ? '🍇 Pouvoir du fruit' : s === 'combat' ? '⚔️ Combat' : s === 'naval' ? '⚓ Combat naval' : STATS[s] ? `${STATS[s].emoji} ${STATS[s].name}` : '🎲 Chance');

// ───────────── bataille tactique ─────────────
function vBattle(S) {
  const b = S.battle, acts = B.battleActs(S);
  const pct = x => Math.max(0, Math.round(x.hp / x.max * 100));
  const hint = b.hint, hintTxt = { A: 'préparent une charge', G: 'se mettent en garde', R: 'manœuvrent pour une feinte' }[hint];
  const sure = S.hero.haki.obs >= 1;
  const last = b.last;
  const lastTxt = last ? `<div class="blast ${last.outcome}"><b>Manche ${last.round}</b> · ${esc(last.text)} <i class="dmg">ennemi −${last.dFoe}</i>${last.dYou ? ` <i class="dmg you">toi −${last.dYou}</i>` : ''}</div>` : '';
  const tac = acts.filter(a => a.kind === 'tac'), sp = acts.filter(a => a.kind === 'sp');
  return `<section class="card battle ${b.kind}">
    <h3><span class="e">${b.emoji}</span> ${esc(b.title)} <span class="pts">Manche ${Math.min(b.round, b.maxRounds)} / ${b.maxRounds}</span></h3>
    <div class="forces">
      <div class="side you"><span>${b.kind === 'naval' ? '⛵' : '🧑‍✈️'} Ton camp</span><i class="hb"><i style="width:${pct(b.you)}%"></i></i><small>${Math.max(0, b.you.hp)} / ${b.you.max}</small></div>
      <div class="vs">VS</div>
      <div class="side foe"><span>${b.kind === 'naval' ? '🏴' : '👹'} ${esc(b.foeName.replace(/^./, c => c.toUpperCase()))}</span><i class="hb"><i style="width:${pct(b.foe)}%"></i></i><small>${Math.max(0, b.foe.hp)} / ${b.foe.max}</small></div>
    </div>
    <p class="intent">${sure ? '👁️' : '🔭'} ${sure ? 'Tu lis leur jeu : ils' : 'Il semble que l\'ennemi'} ${hintTxt}${sure ? '.' : '… (pas sûr)'}</p>
    ${lastTxt}
    <div class="tacs">${tac.map(a => `<button class="tac" data-act="btac" data-arg="${a.id}"><span class="e">${a.emoji}</span><b>${a.label}</b><small>${a.sub}</small></button>`).join('')}</div>
    ${sp.length ? `<h4>✨ Coups spéciaux (une fois par bataille)</h4><div class="tacs sp">${sp.map(a => `<button class="tac special" data-act="btac" data-arg="${a.id}" ${a.enabled ? '' : 'disabled'}><span class="e">${a.emoji}</span><b>${a.label}</b><small>${a.sub}</small></button>`).join('')}</div>` : ''}
  </section>`;
}

const TUTO = () => store.get('tuto', false) ? '' : `<div class="tuto"><b>👋 Comment jouer</b><ol><li>Lis la situation, puis touche un choix.</li><li>Après chaque choix, les boutons sont verrouillés environ une seconde : pas de faux clic.</li><li>Les <b>jauges</b> en haut montrent ta vie, ton argent et ton moral. ⭐ = l'option conseillée.</li></ol><button class="btn sm gold" data-act="tutoOk">J'ai compris</button></div>`;
function vEvent(S) {
  const ev = G.curEvent(S);
  const V = G.view(S);
  const text = G.interp(S, typeof ev.x === 'function' ? ev.x(V) : ev.x);
  const chs = G.choicesOf(S, ev);
  return `${TUTO()}<section class="card event ${S.ctx === 'sea' ? 'at-sea' : ''}">
    ${S.ctx === 'sea' ? `<div class="kicker">🌊 En mer, vers ${esc(ISLANDS[S.next].name)}</div>` : ''}
    <h3><span class="e">${ev.emoji || '❗'}</span> ${esc(ev.title)}</h3>
    <p class="story">${esc(text)}</p>
    <div class="choices">${chs.map((c, n) => `
      <button class="choice ${c.locked ? 'locked' : ''} ${c.risk ? 'rk-' + c.risk.k : ''}" data-act="choose" data-arg="${c.i}" ${c.locked ? 'disabled' : ''}>
        <span class="num">${n + 1}</span>
        <span class="lbl">${esc(c.label)}</span>
        <span class="meta">
          ${c.stat ? `<i class="tag">${STAT_LABEL(c.stat)}</i>` : ''}
          ${!c.stat && c.risk ? `<i class="tag">🎲 Chance</i>` : ''}
          ${c.risk ? `<i class="risk ${c.risk.k}">${c.risk.t}</i>` : ''}
          ${c.tw ? `<i class="tag tw" title="Même un choix sûr peut réserver une surprise">🎭 ${Math.round(c.tw * 100)} % d'imprévu</i>` : ''}
          ${c.cost ? `<i class="tag cost">💰 ${G.fmtPrime(c.cost)}</i>` : ''}
          ${c.aff?.length ? `<i class="aff" title="Jauges concernées">${c.aff.map(a => `<b>${a.emoji}</b>`).join('')}</i>` : ''}
          ${c.locked ? `<i class="tag lock">🔒 ${esc(c.lockText)}</i>` : ''}
        </span>
      </button>`).join('')}</div>
  </section>`;
}

function chipsHtml(chips) {
  return `<div class="fx">${(chips || []).map(c => `<span class="fxc ${c.k}">${esc(c.t)}</span>`).join('')}</div>`;
}

function vResult(S) {
  const r = S.result;
  const cls = r.ok === null ? 'neutral' : r.ok ? 'win' : 'lose';
  return `<section class="card result ${cls}">
    <div class="banner">${r.ok === null ? (r.emoji || '📜') + ' ' + esc(r.title) : r.ok ? '✅ Réussite' : '❌ Échec'}${r.ok !== null && r.p != null ? `<small>${Math.round(r.p * 100)} % de chances</small>` : ''}</div>
    <p class="choice-made">« ${esc(r.choice)} »</p>
    ${r.roll !== null && r.roll !== undefined ? `<div class="roll"><div class="rollbar"><div class="zone" style="width:${Math.round(r.p * 100)}%"></div><div class="mark" style="left:${Math.round(r.roll * 100)}%"></div></div><small>${r.stat && r.stat !== 'chance' ? STAT_LABEL(r.stat) + ' · ' : ''}il fallait tomber dans la zone verte</small></div>` : ''}
    <p class="story">${esc(r.text)}</p>
    ${chipsHtml(r.chips)}
    <button class="btn big gold" data-act="continue">Continuer ➜</button>
  </section>`;
}

const hasShop = S => { const svc = ISLANDS[S.loc].svc || []; return svc.some(x => x === 'market' || x === 'forge' || x === 'ship') || S.crew.some(c => c.role === 'charpentier'); };
function vEscale(S) {
  if (U.sub) return vSub(S);
  const acts = G.escaleActions(S);
  const rec = S.actionsLeft > 0 ? G.recommendedAction(S) : null;
  const isl = ISLANDS[S.loc];
  return `<section class="card escale">
    <h3>⚓ Escale ${S.actionsLeft > 0 ? `<span class="pts">${S.actionsLeft} action${S.actionsLeft > 1 ? 's' : ''}</span>` : ''}</h3>
    <p class="hint">${esc(isl.desc)}</p>
    ${S.flags.wounded ? '<p class="warn">🤕 Tu es <b>blessé grave</b>. Un nouveau K.O. peut être fatal : pense à te reposer (ou à embarquer un médecin).</p>' : ''}
    <div class="acts">${acts.map(a => `<button class="act ${a.badge ? 'upg' : ''} ${a.free ? 'free' : ''} ${a.id === rec ? 'rec' : ''}" data-act="action" data-arg="${a.id}">${a.id === rec ? '<i class="star">⭐ Conseillé</i>' : ''}<span class="e">${a.emoji}</span><span class="t"><b>${esc(a.label)}</b><small>${esc(a.sub)}</small></span></button>`).join('')}</div>${S.actionsLeft <= 0 ? '<p class="hint">Plus d\'action sur cette île. Le chantier naval reste ouvert.</p>' : ''}
    <div class="row gap">
      ${hasShop(S) ? `<button class="btn" data-act="action" data-arg="market">🛒 Boutique${G.shipUpgradeReady(S) ? ' <i class="dot">⬆️</i>' : ''}</button>` : ''}
      <button class="btn" data-act="exam" data-arg="cale">🎒 Cale ${S.inventory.fruits.length ? `<i class="dot">${S.inventory.fruits.length}🍇</i>` : ''}</button>
      <button class="btn gold grow" data-act="leave">⛵ Lever l'ancre</button>
    </div>
  </section>`;
}

// « Marché & chantier » : deux onglets d'un même lieu
function portTabs(S, sb, html) {
  const svc = ISLANDS[S.loc].svc || [];
  const hasM = svc.includes('market') || svc.includes('forge');
  const hasS = svc.includes('ship') || S.crew.some(c => c.role === 'charpentier');
  if (!(hasM && hasS)) return html;
  const tab = (id, label) => `<button class="btn sm ${sb.kind === id ? 'gold' : 'ghost'}" data-act="porttab" data-arg="${id === 'market' ? 'market' : 'ship'}">${label}</button>`;
  return html.replace(/^(<section[^>]*>)/, `$1<div class="row gap porttabs">${tab('market', '🛒 Marché')}${tab('ship', '🔨 Chantier')}</div>`);
}
function vSub(S) {
  const sb = U.sub;
  const tier = G.tierOf(S);
  if (sb.kind === 'done') return `<section class="card result neutral"><div class="banner">${sb.emoji || '⚓'} ${esc(sb.title || 'Escale')}</div><p class="story">${esc(sb.text)}</p>${chipsHtml(sb.chips)}<button class="btn big gold" data-act="subclose">OK</button></section>`;
  if (sb.kind === 'services') return `<section class="card"><h3>🏪 Services du port</h3><p class="hint">La boutique est gratuite ; les autres services consomment ton action.</p>
    <div class="acts">${G.serviceActions(S).map(a => `<button class="act" data-act="service" data-arg="${a.id}"><span class="e">${a.emoji}</span><span class="t"><b>${esc(a.label)}</b><small>${esc(a.sub)}</small></span></button>`).join('')}</div>
    <button class="btn ghost" data-act="subcancel">← Retour</button></section>`;
  if (sb.kind === 'job') {
    const tp = { 1: 3_000_000, 2: 30_000_000, 3: 150_000_000, 4: 500_000_000 }[tier];
    const pp = G.checkChance(S, { s: 'combat', d: 0 }), pc = G.checkChance(S, { s: 'charisme', d: -2 });
    const opt = (id, e, t, sub, risk) => `<button class="act" data-act="job" data-arg="${id}"><span class="e">${e}</span><b>${t}</b><small>${sub}</small>${risk ? `<i class="risk ${G.riskLabel(risk).k}">${Math.round(risk * 100)} %</i>` : ''}</button>`;
    return `<section class="card"><h3>💼 Gagner des berrys</h3><p class="hint">Bourse : ${G.fmtPrime(S.hero.berrys)}. Une seule activité par escale.</p>
      <div class="acts">
        ${opt('port', '⚓', 'Travailler au port', `Sûr · +${G.fmtPrime(tp / 10)}`)}
        ${opt('prime', '🎯', 'Chasser une prime locale', `Combat · +${G.fmtPrime(tp / 2.5)}`, pp)}
        ${opt('commerce', '💰', 'Faire du commerce', `Charisme · jusqu'à +${G.fmtPrime(tp / 4 * (1 + G.shipBonus(S, 'income') * 5))}`, pc)}
        ${opt('casino', '🎰', 'Jouer au casino', `45 % de chances · mise ${G.fmtPrime(Math.min(S.hero.berrys, tp / 3))}`)}
      </div>
      <button class="btn ghost" data-act="subcancel">← Retour</button></section>`;
  }
  const weakest = [...STAT_KEYS].sort((a, b) => S.hero.stats[a] - S.hero.stats[b])[0];
  if (sb.kind === 'train') return `<section class="card"><h3>🏋️ Entraînement</h3><p class="hint">Quelle caractéristique travailler ? Plus elle est haute, plus elle est dure à faire progresser.</p>
    <div class="grid2">${STAT_KEYS.map(k => `<button class="pick ${k === weakest ? 'rec' : ''}" data-act="train" data-arg="${k}"><span class="e">${STATS[k].emoji}</span><b>${STATS[k].name}${k === weakest ? ' ⭐' : ''}</b><small>Actuel : ${S.hero.stats[k]}</small></button>`).join('')}</div>
    <button class="btn ghost" data-act="subcancel">Annuler</button></section>`;
  if (sb.kind === 'tavern') return `<section class="card"><h3>🍺 Taverne</h3><p class="hint">${S.crew.length >= 10 ? 'Ton équipage est complet : une recrue amènera son propre équipage dans ta flotte.' : `${FACTIONS[S.hero.faction].crewLabel} : ${S.crew.length}/10.`} Tu peux tenter ta chance avec chacun.</p>
    ${sb.cands.map((c, i) => {
      const st = sb.status?.[i];
      const p = G.recruitChance(S, c);
      const price = G.recruitPrice(S, c);
      return `<div class="crewcard ${st ? 'st-' + st : ''}"><div class="ce">${c.emoji}</div><div class="ci"><b>${esc(c.name)}</b><small>${ROLES[c.role].name} · Puissance ${c.power}</small><em>${esc(c.trait)}</em></div>
        <div class="cb">${st === 'ok' ? '<b class="okc">✅ A rejoint ton équipage</b>' : st === 'ko' ? '<b class="koc">❌ A refusé</b>' : `<button class="btn sm gold" data-act="hire" data-arg="${i}" ${S.hero.berrys < price ? 'disabled' : ''}>Payer ${G.fmtPrime(price)}</button>
        <button class="btn sm" data-act="convince" data-arg="${i}">Convaincre <i class="risk ${G.riskLabel(p).k}">${Math.round(p * 100)} %</i></button>`}</div></div>`;
    }).join('')}
    <button class="btn gold" data-act="subfinish">${sb.used ? 'Quitter la taverne' : '← Retour (sans utiliser d\'action)'}</button></section>`;
  if (sb.kind === 'market') return portTabs(S, sb, `<section class="card"><h3>🛒 ${ISLANDS[S.loc].svc?.includes('market') ? 'Marché' : 'Forge'}</h3>
    <p class="hint">Bourse : ${G.fmtPrime(S.hero.berrys)}. Les fruits achetés vont dans la cale.</p>
    ${sb.shop.fruits.length ? `<h4>🍇 Fruits du Démon</h4>${sb.shop.fruits.map((id, i) => { const f = FRUITS[id], p = G.price(S, fruitPrice(f)); return `<div class="item"><div><b>${FRUIT_TYPES[f.type].emoji} ${esc(f.name)}</b> <small>${esc(f.jp)} · ${FRUIT_TYPES[f.type].name} · ${'★'.repeat(f.tier)}</small><em>${esc(f.desc)}</em></div><button class="btn sm gold" data-act="buy" data-k="fruit" data-arg="${i}" ${S.hero.berrys < p || sb.bought?.includes('f' + i) ? 'disabled' : ''}>${sb.bought?.includes('f' + i) ? 'Acheté' : G.fmtPrime(p)}</button></div>`; }).join('')}` : '<p class="hint">Aucun fruit du démon à vendre ici.</p>'}
    <h4>⚔️ Armes</h4>${sb.shop.weapons.map((id, i) => { const w = WEAPONS[id], p = G.price(S, weaponPrice(w)); return `<div class="item"><div><b>${esc(w.name)}</b> <small>${WEAPON_TYPES[w.type]} · ${'★'.repeat(w.tier)}${w.seastone ? ' · granit marin' : ''}${w.cursed ? ' · maudit' : ''}</small><em>${esc(w.desc)}</em></div><button class="btn sm gold" data-act="buy" data-k="weapon" data-arg="${i}" ${S.hero.berrys < p || sb.bought?.includes('w' + i) ? 'disabled' : ''}>${sb.bought?.includes('w' + i) ? 'Acheté' : G.fmtPrime(p)}</button></div>`; }).join('')}
    <p class="hint">Arme actuelle : ${S.hero.weapon ? esc(WEAPONS[S.hero.weapon].name) + ' ' + '★'.repeat(WEAPONS[S.hero.weapon].tier) : 'aucune'}</p>
    <button class="btn gold" data-act="subfinish">Fermer la boutique</button></section>`);
  if (sb.kind === 'ship') return portTabs(S, sb, vShipyard(S, sb));
  return '';
}

function vRoute(S) {
  const rv = G.routeView(S);
  if (rv.length < 2) return '';
  const done = rv.filter(x => x.state === 'done' || x.state === 'here').length;
  return `<div class="routebar" title="Route de ${esc(SEAS[ISLANDS[S.loc].sea].name)}">
    <div class="rdots">${rv.map(x => `<i class="rd ${x.state}" title="${esc(x.name)}"></i>`).join('')}</div>
    <small>🧭 Étape ${done}/${rv.length} de la route${rv.find(x => x.state === 'next') ? ' · deux chemins s\'offrent à toi' : ''}</small>
  </div>`;
}

function vNav(S) {
  const opts = G.navOptions(S);
  const camp = G.campOf(S);
  const gates = opts.filter(o => o.big);
  const paths = opts.filter(o => !o.big);
  const card = o => {
    const isl = ISLANDS[o.id], sea = SEAS[isl.sea];
    const pone = isl.pone && !S.pone.includes(isl.pone);
    return `<button class="dest ${o.big ? 'big' : ''} ${o.locked ? 'locked' : ''} ${o.danger || o.early ? 'danger' : ''}" data-act="sail" data-arg="${o.id}" ${o.locked ? 'disabled' : ''} style="--sea:#${sea.water.toString(16).padStart(6, '0')}">
        ${o.route ? `<span class="rtag">${o.route}</span>` : ''}
        <span class="de" data-thumb="${o.id}">${THUMBS[o.id] ? `<img src="${THUMBS[o.id]}" alt="">` : sea.emoji}</span>
        <span class="dt"><b>${esc(o.label)}</b><small>${esc(o.sub || isl.sub)}</small>
        <span class="dm">${'★'.repeat(isl.pop)}${'☆'.repeat(3 - isl.pop)} · ${esc(sea.name)}${pone ? ` · 🗿 Poneglyphe ${camp === 'gardien' ? 'à sécuriser' : 'routier'}` : ''}${o.danger ? ' · ⚠️ Danger' : ''}${o.early ? ' · ⚠️ Tôt' : ''}</span></span>
      </button>`;
  };
  return `<section class="card nav">
    <h3>🧭 Prochaine étape</h3>
    ${vRoute(S)}
    ${opts.length === 1 && opts[0].forced ? '<p class="warn">Les événements ne te laissent pas le choix.</p>' : '<p class="hint">Le voyage avance toujours vers l\'avant. Les îles ★★★ sont des arcs majeurs : plus dangereuses, plus lucratives.</p>'}
    ${paths.length ? `<div class="dests">${paths.map(card).join('')}</div>` : ''}
    ${gates.length ? `<h4 class="gatehead">${paths.length ? 'Ou franchir la prochaine frontière' : 'La route continue'}</h4><div class="dests">${gates.map(card).join('')}</div>` : ''}
  </section>`;
}

function vVoyage(S) {
  const isl = ISLANDS[S.next];
  return `<div class="voyage" id="voyage"><div class="vcap"><small>${SEAS[isl.sea].emoji} ${esc(SEAS[isl.sea].name)}</small><b>Cap sur ${esc(isl.name)}</b><em>Touchez pour passer</em></div>
    <div class="vfallback"><div class="vboat">⛵</div><div class="vwaves">〰️〰️〰️〰️〰️〰️</div></div></div>`;
}

async function runVoyage() {
  const S = U.S;
  U.voyaging = true;
  const el = document.getElementById('voyage');
  const isl = ISLANDS[S.next], sea = SEAS[isl.sea];
  let used3d = false;
  if (U.anim && el) {
    try {
      const V = await import('./voyage3d.js');
      if (V.webglOK()) {
        used3d = true;
        el.classList.add('three');
        await V.playVoyage(el, { view: U.view, from: ISLANDS[S.loc], island: isl, sky: sea.sky, water: sea.water, sail: G.shipSail(S), shipTier: S.ship.tier, look: shipLook(S), storm: sea.tier >= 2 && (G.hashStr(isl.id + S.turn) % 3 === 0), duration: 4200 });
      }
    } catch (e) { console.warn('3D indisponible', e); }
  }
  if (!used3d) await new Promise(r => setTimeout(r, U.anim ? 1400 : 250));
  U.voyaging = false;
  G.afterVoyage(S);
  save();
  render();
  window.scrollTo(0, 0);
}

// ───────────── fin ─────────────
function vEnd(S) {
  const E = S.ending, h = S.hero;
  const camp = S.endCamp;
  const newBadges = U.newBadges || [];
  const leg = S.legend ? LEGENDS.find(l => l.id === S.legend) : null;
  const goal = S.daily ? DAILY_GOALS.find(g => g.id === S.daily.goal) : null;
  return `<main class="game end">
    <section class="card endcard ${E.kind}">
      <div class="kicker">${E.kind === 'death' ? '⚰️' : E.kind === 'prison' ? '⛓️' : E.kind === 'onepiece' ? '🏴‍☠️' : '🌅'} Fin de carrière</div>
      <h2>${esc(E.title)}</h2>
      <p class="epitaph">« ${esc(E.epitaph)} »</p>
      <div class="why"><b>Pourquoi cette fin ?</b><p>${esc(E.why)}</p><small>📍 ${esc(E.where)} · Escale ${esc(E.turns)}</small>${E.timeline?.length ? `<ul class="hl">${E.timeline.map(l => `<li><small>Escale ${l.t + 1}</small> ${esc(l.text)}</li>`).join('')}</ul>` : ''}</div>
      <div class="poster" id="poster"><div class="hint">Impression de l'avis de recherche...</div></div>
      <div class="grade">Note <b>${E.grade}</b> <small>Score ${E.score}</small></div>
      ${leg ? `<div class="challenge ${S.challengeOk ? 'ok' : 'ko'}">📖 ${esc(leg.name)} : ${esc(leg.target.label)} — ${S.challengeOk ? '✅ Tu as fait mieux que la légende !' : '❌ La légende reste invaincue.'}<small>Canon : ${esc(leg.canon)}</small></div>` : ''}
      ${goal ? `<div class="challenge ${S.challengeOk ? 'ok' : 'ko'}">📅 Défi du ${esc(S.daily.date)} : ${esc(goal.label)} — ${S.challengeOk ? '✅ Réussi' : '❌ Raté'}</div>` : ''}
      <div class="like">🪞 Ta carrière ressemble à celle de <b>${esc(E.like.n)}</b> : ${esc(E.like.why)}.</div>
      <div class="sumgrid">
        <div><small>Faction</small><b>${FACTIONS[h.faction].emoji} ${esc(FACTIONS[h.faction].name)}</b></div>
        <div><small>Grade</small><b>${esc(E.rank)}</b></div>
        <div><small>Niveau</small><b>${E.level.emoji} ${esc(E.level.name)}</b></div>
        <div><small>Prime</small><b>${h.bounty ? G.fmtPrime(h.bounty) : '—'}</b></div>
        <div><small>Objectif</small><b>${esc(E.progressLabel)} (${S.progress}/9)</b></div>
        <div><small>Voyage</small><b>${S.visited.length} îles · ${Math.floor(h.age)} ans</b></div>
        <div><small>Fruit</small><b>${h.fruit ? esc(FRUITS[h.fruit.id].name) + (h.fruit.awakened ? ' ✨' : '') : 'Aucun'}</b></div>
        <div><small>${h.pacte ? 'Pacte' : 'Haki'}</small><b>${h.pacte ? `${G.PACTE[h.pacte].short} ${esc(G.PACTE[h.pacte].name)}` : ['obs', 'arm', 'roi'].filter(k => h.haki[k]).map(k => ({ obs: '👁️', arm: '🛡️', roi: '👑' }[k]) + h.haki[k]).join(' ') || 'Aucun'}</b></div>
        <div><small>${FACTIONS[h.faction].crewLabel}</small><b>${S.crew.length} membre${S.crew.length > 1 ? 's' : ''}${S.fleet.length ? ` + ${S.fleet.length} en flotte` : ''}</b></div>
        <div><small>Camp</small><b>${esc(CAMPS[camp].name)}</b></div>
      </div>
      ${S.hl.length ? `<h4>✨ Moments forts</h4><ul class="hl">${[...new Set(S.hl)].slice(-8).map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      ${newBadges.length ? `<h4>🎖️ Nouvelles quêtes accomplies</h4><div class="badges">${newBadges.map(id => { const b = BADGES.find(b => b.id === id); return `<div class="badge on"><span>${b.emoji}</span><b>${esc(b.name)}</b></div>`; }).join('')}</div>` : ''}
      <h4>📣 Partager</h4>
      <textarea class="share" readonly rows="9">${esc(G.shareText(S))}</textarea>
      <div class="row gap wrap">
        <button class="btn gold" data-act="copy">📋 Copier le texte</button>
        <button class="btn" data-act="sharenative">📤 Partager</button>
        <button class="btn" data-act="tweet">𝕏 Poster</button>
        <button class="btn" data-act="dlposter">🖼️ Télécharger l'avis</button>
      </div>
      <div class="row gap wrap">
        <button class="btn" data-act="journal">📜 Journal de bord</button>
        <button class="btn gold grow" data-act="replay">🔁 Rejouer</button>
        <button class="btn ghost" data-act="home">🏠 Accueil</button>
      </div>
    </section>
  </main>`;
}

async function mountPoster() {
  const el = document.getElementById('poster');
  if (!el) return;
  if (U.posterUrl) { el.innerHTML = `<img src="${U.posterUrl}" alt="Avis de recherche">`; return; }
  const c = await drawPoster(U.S);
  U.posterUrl = c.toDataURL('image/png');
  const el2 = document.getElementById('poster');
  if (el2) el2.innerHTML = `<img src="${U.posterUrl}" alt="Avis de recherche">`;
}

// ───────────── fenêtre « Examiner » ─────────────
function vModal() {
  if (U.modal === 'duelcode') return `<div class="modal" data-act="closemodal"><div class="sheet small">
    <h3>⚔️ Code de duel</h3><p>Envoie ce code à tes amis : ils partiront exactement du même profil, avec la même graine.</p>
    <textarea class="share" readonly rows="2">${esc(U.S.duelCode)}</textarea>
    <div class="row gap"><button class="btn gold" data-act="copyduel">📋 Copier</button><button class="btn ghost" data-act="closemodal">C'est parti !</button></div></div></div>`;
  if (U.modal === 'menu') return `<div class="modal" data-act="closemodal"><div class="sheet small">
    <h3>☰ Menu</h3>
    <button class="btn" data-act="exam">🔍 Examiner</button>
    <button class="btn" data-act="journal">📜 Journal de bord</button>
    <label class="opt"><input type="checkbox" data-act="toggleAnim" ${U.anim ? 'checked' : ''}> Animation 3D</label>
    ${vViewPick()}
    <button class="btn" data-act="retire">🍻 Prendre sa retraite (finir la carrière)</button>
    <button class="btn ghost" data-act="home">🏠 Sauvegarder et quitter</button>
    <button class="btn ghost" data-act="closemodal">Fermer</button></div></div>`;
  if (U.modal === 'confirmRetire') return `<div class="modal" data-act="closemodal"><div class="sheet small">
    <h3>Prendre sa retraite ?</h3><p>Ta carrière s'arrête ici, ${esc(ISLANDS[U.S.loc].name)}. Elle rejoindra le Panthéon.</p>
    <div class="row gap"><button class="btn gold" data-act="retireYes">Oui, raccrocher</button><button class="btn ghost" data-act="closemodal">Non</button></div></div></div>`;
  const S = U.S;
  if (!S) return '';
  const tabs = [['profil', '🧍 Profil'], ['niveau', '📈 Niveau'], ['equipage', '⛵ Navire & équipage'], ['cale', '🎒 Cale'], ['relations', '🤝 Puissances'], ['journal', '📜 Journal']];
  let body = '';
  if (U.tab === 'profil') body = tProfil(S);
  if (U.tab === 'niveau') body = tNiveau(S);
  if (U.tab === 'equipage') body = tEquipage(S);
  if (U.tab === 'cale') body = tCale(S);
  if (U.tab === 'relations') body = tRelations(S);
  if (U.tab === 'journal') body = tJournal(S);
  return `<div class="modal" data-act="closemodal"><div class="sheet">
    <div class="tabs">${tabs.map(([id, l]) => `<button class="${U.tab === id ? 'on' : ''}" data-act="tab" data-arg="${id}">${l}</button>`).join('')}<button class="x" data-act="closemodal">✕</button></div>
    <div class="tabbody">${body}</div></div></div>`;
}

function tProfil(S) {
  const h = S.hero, f = h.fruit ? FRUITS[h.fruit.id] : null, w = h.weapon ? WEAPONS[h.weapon] : null;
  const camp = G.campOf(S);
  const yon = h.yonko ? [...YONKO.pre, ...YONKO.post].find(y => y.id === h.yonko) : null;
  return `<div class="prof">
    <div class="pbig">${h.emoji}</div>
    <div><h3>${esc(h.name)}</h3><p>${FACTIONS[h.faction].emoji} ${esc(FACTIONS[h.faction].name)} · ${esc(G.rankName(S))}${yon ? ` · ${yon.emoji} ${esc(yon.name)}` : ''}</p>
    <p>${RACES[h.race || 'humain'].emoji} ${RACES[h.race || 'humain'].name} · ${ROLES[h.role].emoji} ${ROLES[h.role].name}${h.isCaptain && h.faction === 'pirate' && h.role !== 'capitaine' ? ' · 🏴‍☠️ capitaine' : ''} · ${Math.floor(h.age)} ans · né(e) à ${esc(ISLANDS[h.origin].name)}</p>
    <p>${esc(ERAS[S.era].name)} · ${G.LENGTHS[S.length].name}</p></div></div>
  ${(() => { const homes = [...(RACE_HOME[h.race || 'humain'] || []), ...(FACTION_HOME[h.faction] || [])]; return `<p class="hint">🏠 <b>Chez toi</b> (léger avantage aux jets et au combat, prix réduits, accueil qui soigne) : ${homes.length ? [...new Set(homes)].map(i => esc(ISLANDS[i]?.name || i)).join(', ') : (h.race || 'humain') === 'humain' ? 'les humains sont accueillis partout : −3 % sur les prix.' : 'aucune île particulière.'}</p>`; })()}
  <div class="statlist">${STAT_KEYS.map(k => `<div class="statrow"><span>${STATS[k].emoji} ${STATS[k].name}</span><b>${h.stats[k]}</b><span class="bar"><i style="width:${Math.min(100, h.stats[k] / 22 * 100)}%"></i></span></div>`).join('')}</div>
  <div class="kv">
    <div><small>❤️ Vie</small><b>${Math.max(0, h.hp)}/${h.hpMax}${S.flags.wounded ? ' 🤕 blessé grave' : ''}</b></div>
    <div><small>⚔️ Indice de combat</small><b>${G.combatRating(S)}</b></div>
    <div><small>📜 Prime</small><b>${h.bounty ? G.fmtPrime(h.bounty) : '—'}${h.faction === 'corsaire' ? ' (gelée)' : ''}</b></div>
    <div><small>🎖️ Mérite</small><b>${S.merit}</b></div>
    <div><small>💰 Berrys</small><b>${G.fmtPrime(h.berrys)}</b></div>
    <div><small>🌟 Réputation</small><b>${S.rep}</b></div>
    <div><small>🍇 Fruit</small><b>${f ? `${esc(f.name)}${h.fruit.awakened ? ' ✨ éveillé' : ''}${f.id === 'smile' ? (h.fruit.smileOk ? ' (réussi)' : ' (raté 😂)') : ''}` : 'Aucun'}</b>${f ? `<em>${esc(f.desc)}</em>` : ''}</div>
    <div><small>🗡️ Arme</small><b>${w ? `${esc(w.name)} ${'★'.repeat(w.tier)}` : 'Aucune'}</b>${w ? `<em>${WEAPON_TYPES[w.type]}</em>` : ''}</div>
    ${h.pacte ? `<div><small>⛓️ Pacte d'Imu</small><b>${esc(G.PACTE[h.pacte].name)}</b></div><p class="hint">${esc(G.PACTE[h.pacte].desc)}</p>` : `<div><small>🌀 Haki</small><b>👁️ ${h.haki.obs} · 🛡️ ${h.haki.arm} · 👑 ${h.haki.roi || (h.roiPotential ? '?' : '0')}</b></div>`}
    <div><small>🏝️ Territoires</small><b>${S.territory}</b></div>
  </div>
  <h4>🗺️ ${esc(CAMPS[camp].goal)}</h4>
  <ol class="track">${PROGRESS[camp].map((p, i) => `<li class="${i <= S.progress ? 'done' : ''} ${i === S.progress + 1 ? 'next' : ''}">${i <= S.progress ? '✅' : i === S.progress + 1 ? '➡️' : '▫️'} ${esc(p)}</li>`).join('')}</ol>
  <p class="hint">Lire les Poneglyphes : ${G.canReadPone(S) ? '✅ possible' : '❌ il te faut un archéologue (ou une grammaire, ou 18 en intelligence)'}.</p>`;
}

function tNiveau(S) {
  const r = G.combatRating(S), li = G.levelIdxOf(S);
  const cap = G.levelCap(S), raw = G.rawLevelIdx(S);
  return `<p>Indice de combat : <b>${r}</b> · Plafond de reconnaissance : <b>${cap}</b></p>
  ${raw > li ? `<p class="warn">💪 Tu as la force d'un <b>${esc(LEVELS[raw].name)}</b>, mais personne ne te reconnaît à ce rang : tu n'as pas encore vaincu d'adversaire de ce calibre. Plus fort adversaire vaincu : <b>${S.maxFoe || 'aucun'}</b>.</p>` : `<p class="hint">Le rang se mérite : il est plafonné par le plus fort adversaire que tu as vaincu (${S.maxFoe || 'aucun'}).</p>`}
  <ol class="ladder">${[...LEVELS].reverse().map((l) => { const i = LEVELS.indexOf(l); return `<li class="${i === li ? 'me' : i < li ? 'below' : ''}"><span>${l.emoji}</span><div><b>${esc(l.name)}</b> <small>≥ ${l.min}</small><em>${esc(l.desc)}</em></div>${i === li ? '<i>◀ toi</i>' : ''}</li>`; }).join('')}</ol>
  <p class="hint">L'indice combine Force, Vitesse, Volonté, fruit, Haki, arme, équipage (les 3 meilleurs), alliés canon (relation ≥ 3), flotte et moral.</p>`;
}

function tEquipage(S) {
  return `${vShipCard(S)}
  <h4>${FACTIONS[S.hero.faction].crewLabel} (${S.crew.length}/10)</h4>
  ${S.crew.length ? S.crew.map(c => `<div class="crewcard"><div class="ce">${c.emoji}</div><div class="ci"><b>${esc(c.name)}${c.isCaptain ? ' 🏴‍☠️ (capitaine)' : ''}</b><small>${ROLES[c.role].name} · Puissance ${G.crewPower(c)}${c.weapon ? ` (⚔️ ${esc(WEAPONS[c.weapon].name)})` : ''} · Loyauté ${c.loyalty}${c.fruit ? ` · 🍇 ${esc(FRUITS[c.fruit].name)}` : ''}</small><em>${esc(c.trait)}</em>${c.weapon ? `<button class="btn sm ghost" data-act="unequipcrew" data-arg="${S.crew.indexOf(c)}">Retirer l'arme</button>` : ''}</div></div>`).join('') : '<p class="hint">Personne pour l\'instant. La taverne, les naufragés et les rencontres sont tes meilleurs viviers.</p>'}
  ${S.fleet.length ? `<h4>⛵ Flotte (${S.fleet.length})</h4><ul class="hl">${S.fleet.map(f => `<li>${esc(f.name)} · puissance ${f.power}</li>`).join('')}</ul>` : ''}`;
}

function tCale(S) {
  const inv = S.inventory;
  return `${U.screen === 'game' && S.phase === 'escale' && hasShop(S) ? '<button class="btn sm gold" data-act="shopfromcale">🛒 Aller à la boutique (gratuit)</button>' : ''}
  <h4>🍇 Fruits du Démon</h4>
  ${inv.fruits.length ? inv.fruits.map((id, i) => { const f = FRUITS[id]; return `<div class="item col"><div><b>${FRUIT_TYPES[f.type].emoji} ${esc(f.name)}</b> <small>${esc(f.jp)} · ${FRUIT_TYPES[f.type].name} · ${'★'.repeat(f.tier)}</small><em>${esc(f.desc)}</em></div>
    <div class="row gap wrap"><button class="btn sm gold" data-act="eat" data-arg="${i}" ${S.hero.fruit ? 'disabled' : ''}>${S.hero.fruit ? 'Tu as déjà un fruit' : 'Manger'}</button>
    ${S.crew.length ? `<select class="inp sm" id="give${i}">${S.crew.map((c, j) => `<option value="${j}" ${c.fruit ? 'disabled' : ''}>${esc(c.name)}${c.fruit ? ' (a déjà un fruit)' : ''}</option>`).join('')}</select><button class="btn sm" data-act="give" data-arg="${i}">Donner</button>` : ''}
    <button class="btn sm ghost" data-act="sellfruit" data-arg="${i}">Vendre ${G.fmtPrime(fruitPrice(f) * 0.6)}</button></div></div>`; }).join('') : '<p class="hint">Aucun fruit dans la cale.</p>'}
  <h4>⚔️ Armes</h4>
  ${S.hero.weapon ? `<p>Équipée : <b>${esc(WEAPONS[S.hero.weapon].name)}</b> ${'★'.repeat(WEAPONS[S.hero.weapon].tier)}</p>` : ''}
  ${inv.weapons.length ? inv.weapons.map((id, i) => { const w = WEAPONS[id]; return `<div class="item"><div><b>${esc(w.name)}</b> <small>${WEAPON_TYPES[w.type]} · ${'★'.repeat(w.tier)}</small></div><div class="row gap"><button class="btn sm" data-act="equip" data-arg="${i}">Équiper</button>${S.crew.length ? `<select class="inp sm" id="wcrew${i}">${S.crew.map((c, j) => `<option value="${j}">${esc(c.name)}${c.weapon ? ' (armé)' : ''}</option>`).join('')}</select><button class="btn sm" data-act="equipcrew" data-arg="${i}">À l'équipage</button>` : ''}<button class="btn sm ghost" data-act="sellweapon" data-arg="${i}">Vendre</button></div></div>`; }).join('') : '<p class="hint">Aucune arme de rechange.</p>'}
  <h4>📦 Objets</h4>
  ${inv.items.length ? `<ul class="hl">${[...new Set(inv.items)].map(id => `<li>${ITEMS[id].emoji} <b>${esc(ITEMS[id].name)}</b>${inv.items.filter(x => x === id).length > 1 ? ' ×' + inv.items.filter(x => x === id).length : ''} — ${esc(ITEMS[id].desc)}</li>`).join('')}</ul>` : '<p class="hint">Rien.</p>'}`;
}

function tRelations(S) {
  const groups = Object.values(GROUPS).map(g => ({ g, v: G.grel(S, g.id), chars: Object.entries(S.rel).filter(([id]) => CHARACTERS[id] && groupOfChar(id, S.era) === g.id) })).filter(x => x.v || x.chars.length).sort((a, b) => b.v - a.v);
  const loose = Object.entries(S.rel).filter(([id]) => CHARACTERS[id] && !groupOfChar(id, S.era));
  const charRow = ([id, v]) => { const c = CHARACTERS[id]; return `<div class="relrow small"><span class="ce">${c.emoji}</span><div><b>${esc(c.name.split(',')[0])}</b></div><span class="hearts ${v >= 0 ? 'pos' : 'neg'}">${v >= 0 ? '♥'.repeat(v) || '·' : '✖'.repeat(-v)}</span></div>`; };
  return `<p class="hint">Ta réputation se joue auprès des <b>puissances</b> : chaque rencontre avec un de leurs membres compte pour tout le groupe.</p>
  <div class="legend-st"><span class="gtag ally">🤝 Allié (≥ 6)</span> renforts en combat (35 %), +3 combat, -30 % sur leurs îles, grosse faveur, aide à Impel Down · <span class="gtag friend">🙂 Ami (≥ 3)</span> +1 combat, -15 % et petite faveur sur leurs îles · <span class="gtag hostile">😠 Hostile (≤ -3)</span> embuscades et +30 % sur leurs îles</div>
  ${groups.length ? groups.map(({ g, v, chars }) => { const st = standingOf(v); const terr = g.terr[S.era] || []; return `<div class="grp ${st.k}">
    <div class="grph"><span class="ge">${g.emoji}</span><div><b>${esc(g.name)}</b><small>${terr.length ? 'Territoire : ' + terr.map(t => esc(ISLANDS[t].name)).join(', ') : 'Pas de territoire'}</small></div><span class="gtag ${st.k}">${st.emoji} ${st.name} <small>${v > 0 ? '+' : ''}${v}</small></span></div>
    <div class="gbar"><i style="left:50%;width:${Math.abs(v) * 5}%;${v < 0 ? 'transform:translateX(-100%)' : ''}"></i></div>
    ${chars.length ? chars.sort((a, b) => b[1] - a[1]).map(charRow).join('') : ''}
  </div>`; }).join('') : '<p class="hint">Aucune puissance ne te connaît encore.</p>'}
  ${loose.length ? `<h4>Autres rencontres</h4>${loose.map(charRow).join('')}` : ''}`;
}

function tJournal(S) {
  return `<ol class="journal">${[...S.log].reverse().map(l => `<li class="${l.kind}"><small>${l.t}</small> ${esc(l.text)}</li>`).join('')}</ol>`;
}

// ───────────── Panthéon, badges, défi, duel, histoire ─────────────
function vPantheon() {
  const P = store.get('pantheon', []);
  return `${backBar('🏛️ Panthéon')}<div class="page">
    ${P.length ? P.map((p, i) => `<details class="card pan"><summary><span class="g">${p.grade}</span><span class="pe">${p.emoji}</span><div><b>${esc(p.name)}</b><small>${esc(p.faction)} · ${esc(p.rank)} · ${esc(p.level)} · ${p.bounty ? G.fmtPrime(p.bounty) : '—'}</small><em>${esc(p.epitaph)}</em></div><span class="sc">#${i + 1}<small>${p.score}</small></span></summary>
      <textarea class="share" readonly rows="8">${esc(p.share)}</textarea><button class="btn sm" data-act="copytxt" data-arg="${i}">📋 Copier</button></details>`).join('') : '<div class="card"><p>Ton Panthéon est vide. Va écrire ta légende !</p></div>'}
  </div>`;
}

function vBadges() {
  const got = store.get('badges', []);
  return `${backBar('🎖️ Quêtes & badges')}<div class="page"><p class="hint center">${got.length}/${BADGES.length} accomplies</p>
    <div class="badges">${BADGES.map(b => `<div class="badge ${got.includes(b.id) ? 'on' : ''}"><span>${got.includes(b.id) ? b.emoji : '❔'}</span><b>${esc(b.name)}</b><small>${esc(b.desc)}</small></div>`).join('')}</div></div>`;
}

function vDaily() {
  const date = G.todayStr();
  const d = G.dailySetup(date);
  const done = store.get('daily.' + date, null);
  const goal = DAILY_GOALS.find(g => g.id === d.goal);
  return `${backBar('📅 Défi du jour')}<div class="page"><div class="card">
    <h3>Défi du ${date}</h3>
    <p class="goal">🎯 Objectif : <b>${esc(goal.label)}</b></p>
    <div class="kv">
      <div><small>Faction</small><b>${FACTIONS[d.faction].emoji} ${FACTIONS[d.faction].name}</b></div>
      <div><small>Rôle</small><b>${ROLES[d.role].emoji} ${ROLES[d.role].name}</b></div>
      <div><small>Race</small><b>${RACES[d.race].emoji} ${RACES[d.race].name}</b></div>
      <div><small>Départ</small><b>${esc(ISLANDS[d.island].name)} (${SEAS[ISLANDS[d.island].sea].name})</b></div>
      <div><small>Époque</small><b>${ERAS[d.era].name}</b></div>
    </div>
    <div class="statlist">${STAT_KEYS.map(k => `<div class="statrow"><span>${STATS[k].emoji} ${STATS[k].name}</span><b>${d.stats[k]}</b><span class="bar"><i style="width:${d.stats[k] * 10}%"></i></span></div>`).join('')}</div>
    <p class="hint">Même profil et même graine pour tout le monde aujourd'hui. Partie rapide.</p>
    ${done ? `<div class="challenge ${done.ok ? 'ok' : 'ko'}">${done.ok ? '✅ Réussi' : '❌ Raté'} — ${esc(done.epitaph)} (note ${done.grade})</div><textarea class="share" readonly rows="7">${esc(done.share)}</textarea><button class="btn" data-act="copydaily">📋 Copier mon résultat</button>` : ''}
    <div class="row"><input class="inp" maxlength="24" placeholder="Ton nom de pirate" value="${esc(U.dailyName || '')}" data-input="dailyName"></div>
    <button class="btn big gold" data-act="startDaily">${done ? '🔁 Rejouer (non compté)' : '⛵ Relever le défi'}</button>
  </div></div>`;
}

function vDuel() {
  return `${backBar('⚔️ Duel entre amis')}<div class="page">
    <div class="card"><h3>Créer un duel</h3><p>Crée un personnage, lance la partie : un code s'affiche. Envoie-le à tes amis, ils partiront du même profil et de la même graine. Comparez vos destins à la fin !</p>
      <button class="btn big gold" data-act="newduel">🧭 Créer mon profil de duel</button></div>
    <div class="card"><h3>Rejoindre un duel</h3>
      <div class="row"><input class="inp" placeholder="Code (OP-...)" value="${esc(U.duelCode || '')}" data-input="duelCode"></div>
      <button class="btn big" data-act="joinduel">⚔️ Rejoindre</button></div>
  </div>`;
}

function vStory() {
  const done = store.get('legends', {});
  return `${backBar('📖 Mode Histoire')}<div class="page"><p class="hint center">Revis la carrière d'une légende, avec son profil d'origine. Feras-tu mieux ?</p>
    ${LEGENDS.map(l => `<div class="card legend">
      <div class="lh"><span class="pe">${l.emoji}</span><div><b>${esc(l.name)}</b><small>${FACTIONS[l.faction].emoji} ${FACTIONS[l.faction].name} · ${esc(ISLANDS[l.island].name)} · ${ERAS[l.era].name}</small></div>${done[l.id] ? '<span class="ok">✅</span>' : ''}</div>
      <p class="story">${esc(l.intro)}</p>
      <p class="hint">Canon : ${esc(l.canon)}</p>
      <p class="goal">🎯 Fais mieux : <b>${esc(l.target.label)}</b></p>
      <div class="row gap"><select class="inp sm" data-input="storyLen"><option value="rapide" ${U.storyLen !== 'saga' ? 'selected' : ''}>Rapide</option><option value="saga" ${U.storyLen === 'saga' ? 'selected' : ''}>Saga</option></select>
      <button class="btn gold grow" data-act="startStory" data-arg="${l.id}">Revivre cette histoire</button></div>
    </div>`).join('')}</div>`;
}

// ───────────── navire : aperçu, fiche, chantier ─────────────
function shipLook(S) {
  return { tier: S.ship.tier, model: S.ship.model, figure: S.ship.figure, figColor: FIGUREHEADS[S.ship.figure]?.color, sail: G.shipSail(S), striped: S.ship.sail === 'rayé' };
}
const SHIPPREV = {};
async function mountShipPrev() {
  const els = [...document.querySelectorAll('[data-shipprev]')];
  if (!els.length || !U.S) return;
  const look = shipLook(U.S), key = JSON.stringify(look);
  if (!SHIPPREV[key]) {
    try {
      const V = await import('./voyage3d.js');
      if (!V.webglOK()) return;
      SHIPPREV[key] = V.snapshotShip(look, 360, 200);
    } catch { return; }
  }
  for (const el of document.querySelectorAll('[data-shipprev]')) el.innerHTML = `<img src="${SHIPPREV[key]}" alt="Ton navire">`;
}
const BONUS_TXT = { hp: v => `${v > 0 ? '+' : ''}${v} coque`, nav: v => `+${v} navigation`, combat: v => `+${v} combat`, morale: v => `+${v} moral/escale`, heal: v => `+${v} PV/escale`, income: v => `commerce +${Math.round(v * 100)} %`, stealth: v => `+${v} discrétion`, coated: () => 'enrobé', lookout: () => 'moins de mauvaises rencontres', vault: () => 'berrys protégés' };
const bonusText = b => Object.entries(b || {}).map(([k, v]) => BONUS_TXT[k]?.(v)).filter(Boolean).join(' · ') || 'aucun bonus';

function vShipCard(S) {
  const m = G.shipModel(S);
  return `<div class="shipcard">
    <div class="shipprev" data-shipprev>${m.emoji}</div>
    <div><b>${esc(S.ship.name)}</b><small>${m.emoji} ${esc(m.name)} · rang ${S.ship.tier} · coque ${S.ship.hp}/${G.shipMaxHp(S)}${S.ship.coated ? ' · 🫧 enrobé' : ''}</small>
    <small>${FIGUREHEADS[S.ship.figure]?.emoji || ''} ${esc(FIGUREHEADS[S.ship.figure]?.name || '')} · voiles ${S.ship.sail ? esc(S.ship.sail) : 'aux couleurs de ta faction'}</small>
    <small>${esc(bonusText(m.bonus))}</small>
    ${S.ship.mods.length ? `<div class="mods">${S.ship.mods.map(id => `<span class="chip on">${SHIP_MODS[id].emoji} ${esc(SHIP_MODS[id].name)}</span>`).join('')}</div>` : ''}</div>
  </div>`;
}

function vShipyard(S, sb) {
  const max = G.shipMaxHp(S);
  const repair = Math.round((max - S.ship.hp) * 20_000 * G.tierOf(S));
  const models = sb.limited ? [] : Object.values(SHIP_MODELS).filter(m => m.id !== S.ship.model && (m.tier === S.ship.tier || m.tier === S.ship.tier + 1));
  const mods = Object.entries(SHIP_MODS);
  const tabs = [['coque', '🔨 Coque'], ...(sb.limited ? [] : [['modele', '🚢 Navires']]), ['amenag', '⚙️ Modules'], ['look', '🎨 Style']];
  const t = sb.tab || 'coque';
  let body = '';
  if (t === 'coque') body = `
    <div class="item"><div><b>Réparer la coque</b><em>${S.ship.hp}/${max}</em></div><button class="btn sm" data-act="buy" data-k="repair" ${S.ship.hp >= max || S.hero.berrys < repair ? 'disabled' : ''}>${S.ship.hp >= max ? 'Intact' : G.fmtPrime(repair)}</button></div>
    ${!S.ship.coated && !sb.limited && S.hero.faction !== 'marine' ? `<div class="item"><div><b>🫧 Coating (enrobage)</b><em>Indispensable pour plonger vers l'Île des Hommes-Poissons.</em></div><button class="btn sm" data-act="buy" data-k="coating" ${S.hero.berrys < 3_000_000 ? 'disabled' : ''}>${G.fmtPrime(3_000_000)}</button></div>` : ''}`;
  if (t === 'modele') body = models.length ? models.map(m => { const p = G.modelPrice(S, m.id); return `<div class="item"><div><b>${m.emoji} ${esc(m.name)}</b> <small>${m.tier > S.ship.tier ? '⬆️ rang supérieur' : '↔️ même rang'} · coque ${SHIPS[m.tier - 1].hp + (m.bonus.hp || 0)}</small><em>${esc(m.desc)} <b>${esc(bonusText(m.bonus))}</b></em></div><button class="btn sm gold" data-act="buy" data-k="model" data-arg="${m.id}" ${S.hero.berrys < p ? 'disabled' : ''}>${G.fmtPrime(p)}</button></div>`; }).join('') + (S.loc === 'water7' ? '<p class="hint">Remise de Water 7 : -30 % !</p>' : '') + '<p class="hint">Tes aménagements suivent sur le nouveau navire. Le coating, lui, est à refaire (sauf sous-marin).</p>' : '<p class="hint">Ton navire est déjà le meilleur du monde.</p>';
  if (t === 'amenag') body = mods.map(([id, m]) => { const own = S.ship.mods.includes(id); const p = Math.round(G.modPrice(S, id) * (sb.limited ? 1.3 : 1)); return `<div class="item"><div><b>${m.emoji} ${esc(m.name)}</b><em>${esc(m.desc)}</em></div>${own ? '<span class="okc">✅ Installé</span>' : `<button class="btn sm gold" data-act="buy" data-k="mod" data-arg="${id}" ${S.hero.berrys < p ? 'disabled' : ''}>${G.fmtPrime(p)}</button>`}</div>`; }).join('');
  if (t === 'look') body = `
    <h4>Figure de proue <small>(1 M ฿)</small></h4>
    <div class="chips">${Object.entries(FIGUREHEADS).map(([id, f]) => `<button class="chip ${S.ship.figure === id ? 'on' : ''}" data-act="buy" data-k="figure" data-arg="${id}" ${S.ship.figure === id || S.hero.berrys < 1_000_000 ? 'disabled' : ''}>${f.emoji} ${esc(f.name)}</button>`).join('')}</div>
    <h4>Couleur des voiles <small>(300 k ฿)</small></h4>
    <div class="chips">${Object.entries(SAIL_COLORS).map(([id, c]) => `<button class="chip sailchip ${S.ship.sail === id ? 'on' : ''}" data-act="buy" data-k="sail" data-arg="${id}" ${S.ship.sail === id || S.hero.berrys < 300_000 ? 'disabled' : ''}><i style="background:${id === 'rayé' ? 'repeating-linear-gradient(0deg,#e0e0e0 0 4px,#c62828 4px 8px)' : c}"></i>${esc(id)}</button>`).join('')}</div>
    <h4>Nom du navire <small>(gratuit)</small></h4>
    <div class="row gap"><input class="inp" maxlength="28" id="shipname" value="${esc(S.ship.name)}"><button class="btn sm" data-act="rename">Renommer</button></div>`;
  return `<section class="card"><h3>🔨 ${sb.limited ? 'Atelier du charpentier' : 'Chantier naval'}</h3>
    ${vShipCard(S)}
    <p class="hint">Bourse : ${G.fmtPrime(S.hero.berrys)}${sb.limited ? ' · Ton charpentier bricole ce qu\'il peut ici (+30 % sur les aménagements, pas de nouveau navire).' : ''}</p>
    <div class="tabs inline">${tabs.map(([id, l]) => `<button class="${t === id ? 'on' : ''}" data-act="shiptab" data-arg="${id}">${l}</button>`).join('')}</div>
    ${body}
    <button class="btn gold" data-act="subfinish">${sb.used ? 'Terminer' : '← Retour (sans utiliser d\'action)'}</button></section>`;
}

function vRecap(f) {
  const r = RACES[f.race], fa = FACTIONS[f.faction], ro = ROLES[f.role], isl = ISLANDS[f.island];
  return `<section class="card recap">
    <div class="pbig">${RACES[f.race].emoji}</div>
    <div><h3>${esc(f.name || 'Nom tiré au hasard')}</h3>
    <p>${r.emoji} <b>${esc(r.name)}</b> · ${fa.emoji} ${esc(fa.name)} · ${ro.emoji} ${esc(ro.name)}</p>
    <p>${SEAS[isl.sea].emoji} ${esc(isl.name)} · ${f.age} ans · ${esc(ERAS[f.era].name)} · ${G.LENGTHS[f.length].name}</p></div>
  </section>`;
}

function vIntro(S) {
  const h = S.hero, r = RACES[h.race || 'humain'], camp = G.campOf(S), isl = ISLANDS[S.loc];
  const L = S.legend ? LEGENDS.find(l => l.id === S.legend) : null;
  return `<section class="card intro">
    <div class="kicker">${S.mode === 'daily' ? '📅 Défi du jour' : S.mode === 'story' ? '📖 Mode Histoire' : S.mode === 'duel' ? '⚔️ Duel' : '🧭 Nouvelle carrière'}</div>
    <div class="recap"><div class="pbig">${h.emoji}</div><div><h2>${esc(h.name)}</h2>
      <p>${r.emoji} <b>${esc(r.name)}</b> · ${FACTIONS[h.faction].emoji} ${esc(FACTIONS[h.faction].name)} · ${ROLES[h.role].emoji} ${esc(ROLES[h.role].name)}</p>
      <p>${Math.floor(h.age)} ans · ${SEAS[isl.sea].emoji} ${esc(isl.name)}</p></div></div>
    <p class="story">${L ? esc(L.intro) : `${esc(isl.desc)} C'est ici que tout commence. ${camp === 'gardien' ? 'Ton serment : protéger le secret du One Piece, quoi qu\'il en coûte.' : 'Ton rêve : trouver le One Piece. Ou au moins une bonne histoire à raconter.'}`}</p>
    ${S.daily ? `<p class="goal">🎯 ${esc(DAILY_GOALS.find(g => g.id === S.daily.goal).label)}</p>` : ''}
    ${L ? `<p class="goal">🎯 ${esc(L.target.label)}</p>` : `<p class="goal">🎯 ${esc(CAMPS[camp].goal)} : 4 Poneglyphes routiers, puis Laugh Tale.</p>`}
    <ul class="pc">${r.pros.map(x => `<li class="pro">✅ ${esc(x)}</li>`).join('')}${r.cons.map(x => `<li class="con">⚠️ ${esc(x)}</li>`).join('')}</ul>
    ${vShipCard(S)}
    <button class="btn big gold" data-act="beginIntro">⚓ Lever l'ancre !</button>
  </section>`;
}

// ───────────── actions ─────────────
function save() {
  if (U.S && U.S.phase !== 'end') store.set('save', U.S);
}

function startGame(opts) {
  U.S = G.newGame(opts);
  U.screen = 'game'; U.modal = null; U.sub = null; U.posterUrl = null; U.saved = false; U.newBadges = []; U.intro = true;
  save();
  render();
  window.scrollTo(0, 0);
}

function onEnd() {
  const S = U.S;
  if (S.phase !== 'end' || U.saved) return;
  U.saved = true;
  store.del('save');
  const E = S.ending;
  const P = store.get('pantheon', []);
  P.push({ name: S.hero.name, emoji: S.hero.emoji, faction: FACTIONS[S.hero.faction].name, rank: E.rank, level: E.level.name, bounty: S.hero.bounty, epitaph: E.epitaph, grade: E.grade, score: E.score, share: G.shareText(S), date: Date.now(), mode: S.mode });
  P.sort((a, b) => b.score - a.score);
  store.set('pantheon', P.slice(0, 30));
  const got = new Set(store.get('badges', []));
  U.newBadges = E.badges.filter(b => !got.has(b));
  E.badges.forEach(b => got.add(b));
  store.set('badges', [...got]);
  if (S.daily && !store.get('daily.' + S.daily.date, null) && !S.daily.replay) store.set('daily.' + S.daily.date, { ok: S.challengeOk, epitaph: E.epitaph, grade: E.grade, share: G.shareText(S) });
  if (S.legend && S.challengeOk) { const L = store.get('legends', {}); L[S.legend] = true; store.set('legends', L); }
}

async function copy(text) {
  try { await navigator.clipboard.writeText(text); toast('Copié ! 📋'); }
  catch { toast('Copie impossible : sélectionne le texte à la main.'); }
}

function act(name, el) {
  const arg = el.dataset.arg, k = el.dataset.k;
  const S = U.S;
  switch (name) {
    case 'home': save(); U.screen = 'home'; U.modal = null; U.sub = null; break;
    case 'go': U.screen = arg; break;
    case 'new': U.form = defaultForm('career'); U.screen = 'create'; break;
    case 'resume': U.S = store.get('save', null); if (U.S) { U.screen = 'game'; U.sub = null; U.posterUrl = null; U.saved = false; } break;
    case 'toggleAnim': U.anim = el.checked; store.set('anim', U.anim); return;
    case 'view': U.view = arg; store.set('view', arg); break;
    case 'f': {
      const f = U.form;
      f[k] = arg;
      if (k === 'race') trimStats(f);
      if (k === 'faction') { if (arg === 'chevalier') { f.sea = 'redline'; f.island = 'marygeoise'; f.race = 'humain'; } else if (f.sea === 'redline') { f.sea = 'east'; f.island = 'fuchsia'; } }
      if (k === 'sea') { f.island = START_ISLANDS[arg][0]; }
      break;
    }
    case 'randstats': { const f = U.form; for (const q of STAT_KEYS) f.stats[q] = 3; fillRandom(f); break; }
    case 'randname': U.form.name = randomHeroName(); break;
    case 'stat': { const f = U.form; f.stats[k] = Math.max(1, Math.min(10, f.stats[k] + +arg)); break; }
    case 'quick': {
      const f = defaultForm('career');
      const races = Object.keys(RACES).filter(r => r !== 'geant' && r !== 'lunarien');
      f.race = races[Math.floor(Math.random() * races.length)] || 'humain';
      const seas = ['east', 'east', 'north', 'west', 'south'];
      f.sea = seas[Math.floor(Math.random() * seas.length)]; f.island = START_ISLANDS[f.sea][0];
      fillRandom(f);
      startGame({ mode: 'career', length: 'rapide', era: 'pre', name: randomHeroName(), race: f.race, faction: 'pirate', role: 'capitaine', island: f.island, stats: { ...f.stats }, age: 17 });
      return;
    }
    case 'launch': {
      const f = U.form;
      if (!f.locked) fillRandom(f);
      const o = { mode: f.mode, length: f.length, era: f.era, name: f.name.trim() || randomHeroName(), race: f.race, faction: f.faction, role: f.role, island: f.island, stats: { ...f.stats }, shipName: f.shipName.trim() || undefined, age: +f.age || 17 };
      if (f.mode === 'duel') {
        o.seed = f.seed ?? Math.floor(Math.random() * 2 ** 31);
        o.duelCode = G.duelEncode({ seed: o.seed, faction: o.faction, role: o.role, island: o.island, era: o.era, length: o.length, stats: o.stats, race: o.race });
      }
      startGame(o);
      if (o.duelCode) { U.modal = 'duelcode'; render(); }
      return;
    }
    case 'exam': U.modal = 'exam'; U.tab = arg || U.tab || 'profil'; break;
    case 'btac': { const r = B.battleAct(S, arg); if (r?.dYou >= 25) { document.body.classList.add('shake'); setTimeout(() => document.body.classList.remove('shake'), 450); } if (r) sfx[r.dYou > r.dFoe ? 'hit' : 'coin'](); save(); break; }
    case 'tutoOk': store.set('tuto', true); break;
    case 'menu': U.modal = 'menu'; break;
    case 'toggleSfx': setMuted(!isMuted()); if (!isMuted()) sfx.coin(); break;
    case 'journal': U.modal = 'exam'; U.tab = 'journal'; break;
    case 'tab': U.tab = arg; break;
    case 'closemodal': U.modal = null; break;
    case 'retire': U.modal = 'confirmRetire'; break;
    case 'retireYes': U.modal = null; G.finish(S, 'retire'); onEnd(); break;
    case 'choose': {
      if (!S || S.phase !== 'event') return;
      if (Date.now() - (U.lastScroll || 0) < 250) return;
      G.resolveChoice(S, +arg);
      save(); break;
    }
    case 'continue':
      G.afterResult(S);
      if (S.phase === 'end') onEnd();
      save(); window.scrollTo(0, 0); break;
    case 'action': {
      if (S.actionsLeft <= 0 && arg !== 'ship' && arg !== 'market') return;
      if (arg === 'services') { U.sub = { kind: 'services' }; save(); break; }
      if (arg === 'train') U.sub = { kind: 'train' };
      else if (arg === 'tavern') { if (S.escCache?.turn !== S.turn) S.escCache = { turn: S.turn }; S.escCache.tavern ||= { cands: G.tavernCandidates(S), status: {} }; U.sub = { kind: 'tavern', cands: S.escCache.tavern.cands, status: S.escCache.tavern.status }; }
      else if (arg === 'market' && !ISLANDS[S.loc].svc?.some(x => x === 'market' || x === 'forge')) U.sub = { kind: 'ship', limited: !ISLANDS[S.loc].svc?.includes('ship') };
      else if (arg === 'market') { if (S.escCache?.turn !== S.turn) S.escCache = { turn: S.turn }; S.escCache.shop ||= { shop: G.genShop(S), bought: [] }; U.sub = { kind: 'market', shop: S.escCache.shop.shop, bought: S.escCache.shop.bought }; }
      else if (arg === 'job') U.sub = { kind: 'job' };
      else if (arg === 'ship') U.sub = { kind: 'ship', limited: !ISLANDS[S.loc].svc?.includes('ship') };
      else if (arg === 'explore') {
        if (!G.startExplore(S)) U.sub = { kind: 'done', emoji: '🗺️', title: 'Exploration', text: 'Tu fais le tour de l\'île. Rien de spécial... à part une belle vue.', chips: [] };
      } else {
        const fr = G.friendHere(S);
        const titles = { rest: ['💪', 'Se préparer'], report: ['📋', 'Rapport'], news: ['📰', 'Le journal'], raid: ['💥', 'Attaque de la base'], favor: [fr?.emoji || '🤝', 'Faveur'] };
        const r = G.doAction(S, arg);
        U.sub = { kind: 'done', emoji: titles[arg][0], title: titles[arg][1], text: r.text, chips: r.chips };
        if (S.pendingEnd) { G.finish(S, S.pendingEnd.kind, S.pendingEnd.cause); U.sub = null; onEnd(); }
        else if (G.checkFatal(S)) U.sub = null;
      }
      save(); break;
    }
    case 'job': { const titles = { port: '⚓ Travail au port', prime: '🎯 Chasse à la prime', casino: '🎰 Casino', commerce: '💰 Commerce' }; const r = G.doAction(S, 'job', arg); U.sub = { kind: 'done', emoji: '💼', title: titles[arg], text: r.text, chips: r.chips }; if (S.pendingEnd) { G.finish(S, S.pendingEnd.kind, S.pendingEnd.cause); U.sub = null; onEnd(); } else if (G.checkFatal(S)) U.sub = null; save(); break; }
    case 'train': { const r = G.doAction(S, 'train', arg); U.sub = { kind: 'done', emoji: '🏋️', title: 'Entraînement', text: r.text, chips: r.chips }; save(); break; }
    case 'hire': { const sb = U.sub; if (sb.status?.[+arg]) return; const c = sb.cands[+arg]; const chips = G.buy(S, 'recruit', c); if (!chips) return; (sb.status ||= {})[+arg] = 'ok'; sb.used = true; toast(`${c.name} trinque avec toi et pose son sac à bord.`); save(); break; }
    case 'convince': { const sb = U.sub; if (sb.status?.[+arg]) return; const c = sb.cands[+arg]; const r = G.convinceRecruit(S, c); (sb.status ||= {})[+arg] = r.ok ? 'ok' : 'ko'; sb.used = true; toast(r.ok ? `Ton discours fait mouche. ${c.name} te suit !` : `${c.name} hausse les épaules et retourne à sa chope.`); save(); break; }
    case 'buy': {
      let chips;
      if (k === 'fruit') { chips = G.buy(S, 'fruit', U.sub.shop.fruits[+arg]); if (chips) U.sub.bought.push('f' + arg); }
      else if (k === 'weapon') { chips = G.buy(S, 'weapon', U.sub.shop.weapons[+arg]); if (chips) U.sub.bought.push('w' + arg); }
      else if (k === 'mod' && U.sub.limited) { const p = Math.round(G.modPrice(S, arg) * 0.3); if (S.hero.berrys < G.modPrice(S, arg) + p) return; S.hero.berrys -= p; chips = G.buy(S, 'mod', arg); if (!chips) S.hero.berrys += p; }
      else chips = G.buy(S, k, arg);
      if (chips) { toast(chips.map(c => c.t).join(' · ') || 'Fait'); U.sub.used = true; }
      save(); break;
    }
    case 'service': { U.sub = null; const fake = document.createElement('i'); fake.dataset.arg = arg; return act('action', fake); }
    case 'subfinish': if (U.sub?.used && !['ship', 'market'].includes(U.sub.kind)) S.actionsLeft--; U.sub = null; save(); break;
    case 'shiptab': U.sub.tab = arg; break;
    case 'rename': { const v = document.getElementById('shipname')?.value.trim(); if (v) { S.ship.name = v.slice(0, 28); toast('Navire renommé : ' + S.ship.name); save(); } break; }
    case 'beginIntro': U.intro = false; window.scrollTo(0, 0); break;
    case 'subcancel': U.sub = null; break;
    case 'shopfromcale': U.modal = null; { const fake = document.createElement('i'); fake.dataset.arg = 'market'; return act('action', fake); }
    case 'porttab': {
      if (arg === 'ship') U.sub = { kind: 'ship', limited: !ISLANDS[S.loc].svc?.includes('ship'), used: U.sub?.used };
      else { if (S.escCache?.turn !== S.turn) S.escCache = { turn: S.turn }; S.escCache.shop ||= { shop: G.genShop(S), bought: [] }; U.sub = { kind: 'market', shop: S.escCache.shop.shop, bought: S.escCache.shop.bought, used: U.sub?.used }; }
      break;
    }
    case 'subclose': U.sub = null; break;
    case 'leave': U.sub = null; G.leaveIsland(S); if (S.phase === 'end') onEnd(); save(); window.scrollTo(0, 0); break;
    case 'sail': {
      if (Date.now() - (U.lastScroll || 0) < 250) return;
      if (G.chooseDestination(S, arg)) { save(); }
      break;
    }
    case 'eat': { const chips = G.eatFruit(S, +arg); toast(chips.map(c => c.t).join(' · ')); save(); break; }
    case 'give': { const sel = document.getElementById('give' + arg); const chips = G.giveFruit(S, +arg, +(sel?.value || 0)); toast(chips.map(c => c.t).join(' · ')); save(); break; }
    case 'sellfruit': { const chips = G.sellFruit(S, +arg); toast(chips.map(c => c.t).join(' · ')); save(); break; }
    case 'equip': G.equipWeapon(S, +arg); save(); break;
    case 'equipcrew': { const sel = document.getElementById('wcrew' + arg); if (G.equipCrewWeapon(S, +arg, +(sel?.value || 0))) toast('Arme confiée à ' + S.crew[+(sel?.value || 0)].name); save(); break; }
    case 'unequipcrew': G.unequipCrewWeapon(S, +arg); save(); break;
    case 'sellweapon': { const chips = G.sellWeapon(S, +arg); toast(chips.map(c => c.t).join(' · ')); save(); break; }
    case 'copy': return copy(G.shareText(S));
    case 'copytxt': return copy(store.get('pantheon', [])[+arg]?.share || '');
    case 'copydaily': return copy(store.get('daily.' + G.todayStr(), {}).share || '');
    case 'tweet': window.open('https://x.com/intent/post?text=' + encodeURIComponent(G.shareText(S)), '_blank', 'noopener'); return;
    case 'sharenative': {
      (async () => {
        try {
          const blob = await posterBlob(S);
          const file = new File([blob], 'destiny-one-piece.png', { type: 'image/png' });
          if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], text: G.shareText(S) });
          else if (navigator.share) await navigator.share({ text: G.shareText(S) });
          else copy(G.shareText(S));
        } catch { /* partage annulé */ }
      })();
      return;
    }
    case 'dlposter': {
      (async () => {
        const c = await drawPoster(S);
        const a = document.createElement('a');
        a.href = c.toDataURL('image/png'); a.download = `wanted-${S.hero.name.replace(/\W+/g, '_')}.png`; a.click();
      })();
      return;
    }
    case 'replay': {
      if (S.legend) { startStoryGame(S.legend, S.length); return; }
      if (S.daily) { startDailyGame(true); return; }
      U.form = defaultForm(S.mode === 'duel' ? 'duel' : 'career'); U.screen = 'create'; break;
    }
    case 'startDaily': startDailyGame(!!store.get('daily.' + G.todayStr(), null)); return;
    case 'newduel': U.form = defaultForm('duel'); U.screen = 'create'; break;
    case 'joinduel': {
      const d = G.duelDecode(U.duelCode || '');
      if (!d) { toast('Code invalide'); return; }
      U.form = { ...defaultForm('duel'), ...d, sea: ISLANDS[d.island].sea, locked: true };
      U.screen = 'create'; break;
    }
    case 'startStory': startStoryGame(arg, U.storyLen || 'rapide'); return;
    default: return;
  }
  render();
}

function startDailyGame(replay) {
  const d = G.dailySetup(G.todayStr());
  startGame({ mode: 'daily', length: 'rapide', era: d.era, seed: d.seed, name: (U.dailyName || '').trim() || randomHeroName(), race: d.race, faction: d.faction, role: d.role, island: d.island, stats: d.stats, daily: { date: d.date, goal: d.goal, replay } });
}

function startStoryGame(id, length) {
  const L = LEGENDS.find(l => l.id === id);
  startGame({ mode: 'story', length, era: L.era, name: L.name, emoji: L.emoji, faction: L.faction, role: L.role, island: L.island, stats: { ...L.stats }, fruit: L.fruit, weapon: L.weapon, legend: L.id, roi: !!L.roi, age: L.age });
}

// ───────────── écouteurs ─────────────
// anti-clic accidentel : pas de validation juste après un défilement ou un changement d'écran
window.addEventListener('scroll', () => { U.lastScroll = Date.now(); }, { passive: true });
let touchY = null;
document.addEventListener('touchstart', e => { touchY = e.touches[0]?.clientY ?? null; }, { passive: true });
document.addEventListener('touchmove', e => { if (touchY !== null && Math.abs((e.touches[0]?.clientY ?? touchY) - touchY) > 8) U.lastScroll = Date.now(); }, { passive: true });
// demi-seconde de blocage après chaque choix : aucun faux clic ne peut enchaîner deux décisions
const COOLDOWN_MS = 900;
const COOLDOWN_ACTS = new Set(['choose', 'sail', 'continue', 'btac', 'action', 'leave', 'service', 'job', 'subfinish']);
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]');
  if (!t) return;
  if (t.classList.contains('modal') && e.target !== t) return;
  if (t.dataset.act === 'toggleAnim') return act('toggleAnim', t);
  if (t.dataset.act === 'copyduel') return copy(U.S.duelCode);
  if (t.disabled) return;
  const a = t.dataset.act;
  if (COOLDOWN_ACTS.has(a)) { if (Date.now() < (U.lockUntil || 0)) return; U.lockUntil = Date.now() + COOLDOWN_MS; }
  act(a, t);
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.act === 'toggleAnim') return act('toggleAnim', t);
  const k = t.dataset.input;
  if (!k) return;
  if (k === 'island') { U.form.island = t.value; render(); }
  else if (k === 'storyLen') U.storyLen = t.value;
  else if (k === 'age') U.form.age = Math.max(10, Math.min(60, +t.value || 17));
});
document.addEventListener('input', e => {
  const k = e.target.dataset.input;
  if (!k) return;
  if (k === 'name' || k === 'shipName') U.form[k] = e.target.value;
  if (k === 'dailyName') U.dailyName = e.target.value;
  if (k === 'duelCode') U.duelCode = e.target.value;
});
document.addEventListener('keydown', e => {
  if (U.screen !== 'game' || U.modal || !U.S || e.target.matches('input, textarea, select')) return;
  const S = U.S;
  const n = parseInt(e.key, 10);
  if (S.phase === 'event' && n >= 1 && n <= 9) {
    const chs = G.choicesOf(S, G.curEvent(S));
    const c = chs[n - 1];
    if (c && !c.locked && Date.now() >= (U.lockUntil || 0)) { U.lockUntil = Date.now() + COOLDOWN_MS; G.resolveChoice(S, c.i); save(); render(); }
  } else if ((e.key === 'Enter' || e.key === ' ') && S.phase === 'result') { e.preventDefault(); if (Date.now() >= (U.lockUntil || 0)) { U.lockUntil = Date.now() + COOLDOWN_MS; act('continue', e.target); } }
});

// démarrage
render();
