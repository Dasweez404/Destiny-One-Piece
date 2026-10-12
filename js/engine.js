// Moteur : état, hasard déterministe, jets, effets, navigation, fins de partie.
import { SEAS, ISLANDS, BLUES, islandsOf, ROUTES, routeKeyOf } from './data/islands.js';
import { FACTIONS, LEVELS, levelOf, YONKO, PROGRESS } from './data/factions.js';
import { FRUITS, WEAPONS, SHIPS, ROLES, STATS, ITEMS, fruitPower, weaponPower, fruitPrice, weaponPrice, SHIP_MODELS, SHIP_MODS, DEFAULT_MODEL, FIGUREHEADS, SAIL_COLORS } from './data/items.js';
import { CHARACTERS, charsAt } from './data/characters.js';
import { ISLAND_EVENTS } from './data/events_islands.js';
import { PONE_EVENTS, FINAL_EVENTS, PRISON_EVENTS, FACTION_EVENTS, CREW_EVENTS, GENERIC_EVENTS, SEA_EVENTS, RACE_EVENTS, LOOT_EVENTS, GARDIEN_EVENTS } from './data/events_main.js';
import { RACES, raceOf } from './data/races.js';
import { GROUPS, groupOfChar, groupOfFaction, groupOfYonko, standingOf } from './data/groups.js';
import { ALT_EVENTS, PUFFING_EVENTS } from './data/events_alt.js';
import { ARC_EVENTS, ARCS } from './data/events_arcs.js';
import { CREW_FIRST, CREW_EPI, CREW_TRAITS, LEGENDS, STORY_FRUITS, CANON_CAREERS, BADGES, DAILY_GOALS, randomHeroName } from './data/meta.js';

Object.assign(FRUITS, Object.fromEntries(Object.entries(STORY_FRUITS).map(([id, f]) => [id, { ...f, id }])));

export const ALL_EVENTS = [...ISLAND_EVENTS, ...PONE_EVENTS, ...FINAL_EVENTS, ...PRISON_EVENTS, ...FACTION_EVENTS, ...CREW_EVENTS, ...GENERIC_EVENTS, ...SEA_EVENTS, ...RACE_EVENTS, ...LOOT_EVENTS, ...GARDIEN_EVENTS, ...ALT_EVENTS, ...PUFFING_EVENTS, ...ARC_EVENTS];
export const EVENTS = Object.fromEntries(ALL_EVENTS.map(e => [e.id, e]));

export const LENGTHS = {
  rapide: { name: 'Rapide', maxTurns: 20, actions: 1, age: 0.6, blueMin: 1, paraMin: 3, desc: '≈ 10 minutes. Une carrière éclair.' },
  saga: { name: 'Vraie saga', maxTurns: 40, actions: 1, age: 0.25, blueMin: 4, paraMin: 10, desc: '≈ 40 minutes. Le grand voyage.' },
};

const STAT_DC = { 1: 8, 2: 12, 3: 15, 4: 18 };
const COMBAT_DC = { 1: 11, 2: 17, 3: 25, 4: 36 };
const GLORY = { 1: 1_500_000, 2: 12_000_000, 3: 35_000_000, 4: 100_000_000 };
const TIER_PRIME = { 1: 3_000_000, 2: 30_000_000, 3: 150_000_000, 4: 500_000_000 };
const RANK_MERIT = [0, 4, 10, 18, 28, 40, 55, 72, 92, 115, 140, 170];

// ───────────── hasard déterministe (mulberry32) ─────────────
export function rnd(S) {
  S.rng = (S.rng + 0x6D2B79F5) >>> 0;
  let t = S.rng;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
export const ri = (S, a, b) => a + Math.floor(rnd(S) * (b - a + 1));
export const pick = (S, arr) => arr[Math.floor(rnd(S) * arr.length)];
export const chance = (S, p) => rnd(S) < p;
export function wpick(S, arr, wf) {
  const ws = arr.map(wf);
  const tot = ws.reduce((a, b) => a + b, 0);
  if (tot <= 0) return null;
  let r = rnd(S) * tot;
  for (let i = 0; i < arr.length; i++) { r -= ws[i]; if (r <= 0) return arr[i]; }
  return arr[arr.length - 1];
}
export const hashStr = s => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };

// ───────────── formats ─────────────
export function fmtPrime(n) {
  n = Math.round(n);
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(n >= 10_000_000_000 ? 0 : 2).replace('.', ',').replace(/,?0+$/, '') + ' milliard' + (n >= 2_000_000_000 ? 's' : '') + ' ฿';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 100_000_000 ? 0 : 1).replace('.', ',').replace(/,0$/, '') + ' M ฿';
  if (n >= 1000) return Math.round(n / 1000) + ' k ฿';
  return n + ' ฿';
}

// ───────────── dérivés ─────────────
export const islandOf = S => ISLANDS[S.loc];
export const seaOf = S => ISLANDS[S.loc]?.sea || 'east';
export const tierOf = S => SEAS[seaOf(S)].tier;
export const campOf = S => FACTIONS[S.hero.faction].camp;
export const fruitOf = S => (S.hero.fruit ? FRUITS[S.hero.fruit.id] : null);

// ───────────── navire ─────────────
export const shipModel = S => SHIP_MODELS[S.ship.model] || SHIP_MODELS[DEFAULT_MODEL[S.ship.tier]];
export function shipBonus(S, k) {
  const vals = [shipModel(S).bonus[k], ...(S.ship.mods || []).map(m => SHIP_MODS[m]?.bonus[k])].filter(v => v !== undefined);
  if (vals.some(v => typeof v === 'boolean')) return vals.some(Boolean);
  return vals.reduce((a, b) => a + b, 0);
}
export const shipMaxHp = S => Math.max(20, SHIPS[S.ship.tier - 1].hp + shipBonus(S, 'hp'));
// ───────────── puissances (réputation de groupe) ─────────────
export const grel = (S, g) => S.frel[g] || 0;
export function addGrel(S, g, v, chips) {
  if (!g || !GROUPS[g] || !v) return;
  const before = standingOf(grel(S, g));
  S.frel[g] = clamp(grel(S, g) + v, -10, 10);
  const after = standingOf(S.frel[g]);
  if (chips && before.k !== after.k) chips.push({ t: `${GROUPS[g].emoji} ${GROUPS[g].name} : ${after.emoji} ${after.name}`, k: v > 0 ? 'rel' : 'bad' });
}
export const groupsHere = S => Object.values(GROUPS).filter(g => g.terr[S.era]?.includes(S.loc));
export const friendHere = S => groupsHere(S).filter(g => grel(S, g.id) >= 3).sort((a, b) => grel(S, b.id) - grel(S, a.id))[0] || null;
export const hostileHere = S => groupsHere(S).filter(g => grel(S, g.id) <= -3).sort((a, b) => grel(S, a.id) - grel(S, b.id))[0] || null;
export const allyGroups = S => Object.values(GROUPS).filter(g => grel(S, g.id) >= 6);
// prix : réduction chez les amis, majoration chez les hostiles
export function priceMult(S) {
  const f = friendHere(S), h = hostileHere(S);
  if (f) return grel(S, f.id) >= 6 ? 0.7 : 0.85;
  if (h) return 1.3;
  return 1;
}
export const price = (S, base) => Math.round(base * priceMult(S));
export const shipSail = S => SAIL_COLORS[S.ship.sail] || FACTIONS[S.hero.faction].sail;
export const modPrice = (S, id) => price(S, SHIP_MODS[id].price * 0.75 * (1 + (tierOf(S) - 1) * 0.5));
export function modelPrice(S, id) {
  const m = SHIP_MODELS[id];
  const base = SHIPS[m.tier - 1].price * 0.8 * (m.price || 1) * (S.loc === 'water7' ? 0.7 : 1);
  return price(S, m.tier === S.ship.tier ? Math.max(1_000_000, base * 0.5) : base);
}
function setShip(S, model, chips) {
  const m = SHIP_MODELS[model];
  S.ship.tier = m.tier; S.ship.model = model;
  S.ship.coated = !!m.bonus.coated;
  S.ship.hp = shipMaxHp(S);
  chips.push({ t: `${m.emoji} Nouveau navire : ${m.name}`, k: 'epic' });
  log(S, `Nouveau navire : ${m.name}.`, 'big');
}

export function combatRating(S) {
  const h = S.hero, st = h.stats;
  let r = st.force * 1.2 + st.vitesse * 0.8 + st.volonte * 0.5;
  const f = fruitOf(S);
  if (f) r += f.id === 'smile' ? (h.fruit.smileOk ? 4 : 0) : fruitPower(f, h.fruit.awakened);
  r += h.haki.obs * 2 + h.haki.arm * 3 + h.haki.roi * 3;
  if (h.weapon) r += weaponPower(WEAPONS[h.weapon]);
  const top = [...S.crew].map(c => c.power).sort((a, b) => b - a).slice(0, 3);
  r += top.reduce((a, b) => a + b, 0) / 4;
  const friends = Object.values(GROUPS).reduce((a, g) => a + (grel(S, g.id) >= 6 ? 3 : grel(S, g.id) >= 3 ? 1 : 0), 0);
  r += Math.min(9, friends);
  r += Math.min(3, Object.entries(S.rel).filter(([id, v]) => v >= 4 && CHARACTERS[id]?.power >= 40).length);
  r += Math.min(8, S.fleet.reduce((a, f) => a + f.power, 0) / 2);
  if (h.faction === 'vassal') r += 3;
  r += raceOf(S).combat || 0;
  r += shipBonus(S, 'combat');
  if (S.flags.rokushiki) r += 2;
  if (S.flags.doctrine_absolue) r += 2;
  if (S.flags.imu_servant) r += 3;
  r *= 0.9 + S.morale / 500;
  return Math.round(r * 10) / 10;
}
// Le niveau se mérite : il est plafonné par le plus fort adversaire que tu as réellement vaincu.
export const levelCap = S => Math.round((S.maxFoe || 0) * 1.1 + 7);
export const levelIdxOf = S => LEVELS.indexOf(levelOf(Math.min(combatRating(S), levelCap(S))));
export const rawLevelIdx = S => LEVELS.indexOf(levelOf(combatRating(S)));

const ROLE_FOR_STAT = { navigation: ['navigateur', 'timonier'], intel: ['medecin', 'archeologue'], charisme: ['musicien'], force: ['charpentier', 'combattant', 'bretteur'], vitesse: ['sniper'], volonte: ['cuisinier'] };
export function statRating(S, stat) {
  const h = S.hero;
  let r = h.stats[stat] * 1.6 + levelIdxOf(S) * 0.6; // l'expérience aide en tout
  const helpers = S.crew.filter(c => ROLE_FOR_STAT[stat]?.includes(c.role));
  if (helpers.length) r += Math.min(5, Math.max(...helpers.map(c => c.power)) / 3);
  if (stat === 'vitesse') r += h.haki.obs * 2;
  if (stat === 'charisme') r += h.haki.roi * 4 + Math.min(5, Math.max(0, S.rep) / 20);
  if (stat === 'volonte') r += h.haki.roi * 2;
  if (stat === 'navigation' && S.inventory.items.includes('eternal_pose')) r += 2;
  if (stat === 'navigation') r += shipBonus(S, 'nav') * 1.2;
  if (stat === 'vitesse') r += shipBonus(S, 'stealth') * 1.2;
  const race = raceOf(S);
  if (race.mod) r += race.mod(S, stat, { th: ISLANDS[S.loc]?.th?.k }) * 1.6;
  return r;
}

const val = (v, V) => (typeof v === 'function' ? v(V) : v);

export function combatDcOf(S, ch) { return ch.D ?? COMBAT_DC[tierOf(S)] + (val(ch.d, view(S)) || 0) * 1.5; }
export function checkChance(S, ch) {
  const V = view(S);
  if (ch.p) return Math.max(0, Math.min(1, typeof ch.p === 'number' ? ch.p : ch.p(V)));
  const stat = val(ch.s, V);
  if (!stat) return 1;
  const tier = tierOf(S);
  const d = val(ch.d, V) || 0;
  let rating, dc;
  if (stat === 'combat') { rating = combatRating(S); dc = ch.D ?? COMBAT_DC[tier] + d * 1.5; }
  else { rating = statRating(S, stat); dc = ch.D ?? STAT_DC[tier] + d; }
  const spread = stat === 'combat' ? 16 : 12;
  return Math.max(0.05, Math.min(0.95, 0.5 + (rating - dc) / spread));
}
export const riskLabel = p => (p >= 0.8 ? { t: 'Sûr', k: 'safe' } : p >= 0.6 ? { t: 'Jouable', k: 'ok' } : p >= 0.4 ? { t: 'Risqué', k: 'risk' } : p >= 0.2 ? { t: 'Dangereux', k: 'danger' } : { t: 'Suicidaire', k: 'suicide' });

// ───────────── rangs ─────────────
export function rankIdxOf(S) {
  const h = S.hero, f = FACTIONS[h.faction];
  if (h.faction === 'pirate') {
    if (!h.isCaptain) return S.turn < 1 ? 0 : 1;
    let i = 2;
    if (h.bounty >= 30_000_000) i = 3;
    if (h.bounty >= 100_000_000 && S.progress >= 2) i = 4;
    if (h.bounty >= 300_000_000 && S.progress >= 3) i = 5;
    if (h.bounty >= 1_000_000_000) i = 6;
    return i;
  }
  let i = 0;
  for (let k = 0; k < f.ranks.length; k++) if (S.merit >= RANK_MERIT[k]) i = k;
  return Math.min(i, levelIdxOf(S) + 3, f.ranks.length - 1);
}
export const rankName = S => FACTIONS[S.hero.faction].ranks[rankIdxOf(S)];

// ───────────── vue (lecture seule) pour les textes d'événements ─────────────
const VIEW = {
  combat: S => combatRating(S), tier: S => tierOf(S), camp: S => campOf(S),
  fmtPrime: () => fmtPrime, tierPrime: S => () => TIER_PRIME[tierOf(S)],
  pick: S => arr => arr[Math.floor((S.tmp?.r ?? 0) * arr.length)],
  chance: S => p => chance(S, p),
  tmpYonko: S => () => S.tmp?.yonko || YONKO[S.era][0],
  tmpIsland: S => () => ISLANDS[S.tmp?.island] || ISLANDS.sabaody,
  yonkoName: S => () => (YONKO[S.era].find(y => y.id === S.hero.yonko) || YONKO.pre.find(y => y.id === S.hero.yonko) || { name: 'ton Empereur' }).name,
  randomCrew: S => () => S.crew[S.tmp?.c1 ?? 0] || S.crew[0] || { name: 'ton second' },
  twoCrew: S => () => [S.crew[S.tmp?.c1 ?? 0] || { name: 'Quelqu\'un' }, S.crew[S.tmp?.c2 ?? 1] || S.crew[0] || { name: 'quelqu\'un d\'autre' }],
  lowLoyalCrew: S => () => [...S.crew].filter(c => !c.isCaptain).sort((a, b) => a.loyalty - b.loyalty)[0] || { name: 'Quelqu\'un' },
  rankName: S => () => rankName(S),
  canRead: S => canReadPone(S),
  arc: S => (id, stage, gap = 1) => (S.arcs?.[id] ?? 0) === stage && S.turn - (S.arcT?.[id] ?? -99) >= gap,
  hasFlag: S => f => !!S.flags[f],
  rank: S => rankIdxOf(S),
  lvl: S => levelIdxOf(S),
  allyCount: S => allyGroups(S).length,
  hostileName: S => hostileHere(S)?.name || 'une bande locale',
  hostileId: S => hostileHere(S)?.id,
  hostileEmoji: S => hostileHere(S)?.emoji || '😠',
  race: S => S.hero.race || 'humain',
  raceName: S => raceOf(S).name,
};
export const view = S => new Proxy(S, { get: (t, k) => (k in VIEW ? VIEW[k](t) : t[k]) });

// ───────────── création ─────────────
export function genCrew(S, opt = {}) {
  const tier = typeof opt.tier === 'function' ? opt.tier(view(S)) : opt.tier ?? tierOf(S);
  const roles = Object.keys(ROLES).filter(r => r !== 'capitaine');
  const role = opt.role || wpick(S, roles, r => (r === 'archeologue' ? 0.4 : r === 'musicien' ? 0.7 : 1));
  return {
    id: 'c' + Math.floor(rnd(S) * 1e9).toString(36),
    name: opt.name || `${pick(S, CREW_FIRST)} ${pick(S, CREW_EPI)}`,
    role, emoji: ROLES[role].emoji,
    power: Math.max(1, tier * 3 + ri(S, -1, 4)),
    loyalty: ri(S, 55, 75),
    trait: pick(S, CREW_TRAITS),
    fruit: null,
    isCaptain: !!opt.isCaptain,
  };
}

export function newGame(o) {
  const seed = o.seed ?? Math.floor(Math.random() * 2 ** 32);
  const L = LENGTHS[o.length || 'rapide'];
  const fac = o.faction;
  const stats = { ...o.stats };
  const facBonus = { pirate: { volonte: 1, navigation: 1 }, marine: { force: 1, volonte: 1 }, gouv: { vitesse: 1, intel: 1 }, revo: { charisme: 1, volonte: 1 }, chevalier: { charisme: 2 }, chasseur: { force: 1, vitesse: 1 } }[fac] || {};
  const race = RACES[o.race] || RACES.humain;
  if (!o.legend) {
    for (const [k, v] of Object.entries(facBonus)) stats[k] += v;
    stats[ROLES[o.role].stat] += 2;
  }
  for (const [k, v] of Object.entries(race.stats)) stats[k] = Math.max(1, stats[k] + v);
  const startTier = SEAS[ISLANDS[o.island].sea].tier;
  const S = {
    v: 1, seed, rng: seed >>> 0, mode: o.mode || 'career', length: o.length || 'rapide', era: o.era || 'pre',
    legend: o.legend || null, daily: o.daily || null, duelCode: o.duelCode || null,
    hero: {
      name: o.name || randomHeroName((T => () => rnd(T))({ rng: (seed ^ 0x9e3779b9) >>> 0 })), emoji: o.emoji || (RACES[o.race] || RACES.humain).emoji, role: o.role, faction: fac, yonko: null, race: race.id,
      isCaptain: o.role === 'capitaine' || fac !== 'pirate',
      stats, hp: 100, hpMax: 100, fruit: null, haki: { obs: 0, arm: 0, roi: 0 }, roiPotential: false,
      weapon: o.weapon ?? (fac === 'marine' ? 'sabre_rouille' : fac === 'chevalier' ? 'pistolet_silex' : fac === 'chasseur' ? 'wazamono' : 'baton_bois'),
      bounty: 0, berrys: { pirate: 1_000_000, marine: 2_000_000, gouv: 3_000_000, revo: 1_000_000, chevalier: 500_000_000, chasseur: 1_500_000 }[fac], age: o.age || 17,
      origin: o.island,
    },
    crew: [], fleet: [], territory: 0,
    ship: { tier: Math.min(5, ({ marine: 2, gouv: 2, chevalier: 3 }[fac] || 1) + (startTier >= 2 ? 1 : 0) + (startTier >= 3 ? 1 : 0)), hp: 0, coated: false, name: o.shipName || 'Le Vogue-Merry', model: null, mods: [], figure: fac === 'marine' ? 'mouette' : fac === 'chevalier' ? 'dragon' : 'aucune', sail: null },
    inventory: { fruits: [], weapons: [], items: [] },
    rel: {}, frel: {}, flags: {}, seen: {}, hl: [], log: [],
    merit: 0, morale: 70, rep: 0, progress: 0, pone: [],
    loc: o.island, visited: [o.island], seaVisits: { [ISLANDS[o.island].sea]: 1 }, startSea: ISLANDS[o.island].sea,
    turn: 0, maxTurns: L.maxTurns, actionsLeft: 0, phase: 'event', cur: null, next: null, forcedNext: null,
    deathSaves: 0, factionsVisited: [fac], tmp: {}, ending: null,
  };
  S.ship.model = DEFAULT_MODEL[S.ship.tier];
  S.ship.hp = shipMaxHp(S);
  S.maxFoe = o.legend ? 22 : 0;
  S.hero.hpMax = hpMaxOf(S); S.hero.hp = S.hero.hpMax;
  S.hero.roiPotential = o.roi ?? chance(S, Math.min(0.5, (stats.charisme + stats.volonte) / 50));
  if (fac === 'pirate' && o.role !== 'capitaine') S.crew.push(genCrew(S, { role: 'capitaine', tier: 1, isCaptain: true }));
  if (o.fruit) { S.hero.fruit = { id: o.fruit, awakened: false }; }
  S.progress = { east: 0, north: 0, west: 0, south: 0, paradise: 1, calm: 1, redline: 2, nw: 3, laughtale: 8 }[ISLANDS[o.island].sea];
  if (startTier >= 2) S.hero.stats.navigation += 1;
  if (race.obs) S.hero.haki.obs = race.obs;
  addGrel(S, groupOfFaction(fac, null, S.era), 4);
  // hostilités de départ
  const START_REL = { pirate: { marine: -2, gov: -1 }, chasseur: { pirates: -2 }, revo: { gov: -4, marine: -2 }, marine: { pirates: -3, revo: -2 }, gouv: { revo: -4, pirates: -2 }, chevalier: { revo: -4, pirates: -2 } }[fac] || {};
  for (const [g, v] of Object.entries(START_REL)) addGrel(S, g, v);
  if (race.hunted) { S.hero.bounty = 50_000_000; S.frel.gov = -3; S.hl.push('était recherché dès la naissance pour être un Lunarien'); }
  log(S, `${S.hero.emoji} ${S.hero.name} (${race.name}) commence sa carrière : ${FACTIONS[fac].name}, ${ROLES[o.role].name.toLowerCase()}, à ${ISLANDS[o.island].name}.`, 'start');
  { const key = routeKeyOf(ISLANDS[o.island].sea), idx = (ROUTES[key] || []).filter(x => !ISLANDS[x].era || ISLANDS[x].era === S.era).indexOf(o.island); if (idx >= 0) S.routePos = { [key]: idx }; }
  startIsland(S, true);
  return S;
}

export function hpMaxOf(S) {
  const f = fruitOf(S);
  return Math.max(40, 100 + S.hero.stats.volonte * 4 + (f && f.type.startsWith('zoan') ? 25 : 0) + (raceOf(S).hp || 0));
}

export const log = (S, text, kind = 'info') => S.log.push({ t: S.turn, text, kind });

// ───────────── sélection d'événement ─────────────
function matches(ev, S, ctx) {
  const w = ev.w || {};
  const isl = ISLANDS[S.loc];
  if (ctx === 'sea' ? w.ctx !== 'sea' : w.ctx === 'sea') return false;
  if (w.isl && !w.isl.includes(S.loc)) return false;
  if (w.era && w.era !== S.era) return false;
  if (w.camp && w.camp !== campOf(S)) return false;
  if (w.fac && !w.fac.includes(S.hero.faction)) return false;
  if (w.notFac && w.notFac.includes(S.hero.faction)) return false;
  const tier = tierOf(S);
  if (w.tier && !w.tier.includes(tier)) return false;
  if (w.minTier && tier < w.minTier) return false;
  if (w.sea && !w.sea.includes(isl.sea)) return false;
  if (w.minProg && S.progress < w.minProg) return false;
  if ((ev.pri || ev.once) && !ev.repeat && S.seen[ev.id]) return false;
  if (ev.oncePerTurn && S.turnSeen?.[ev.id] === S.turn) return false;
  if (w.test) { try { if (!w.test(view(S))) return false; } catch { return false; } }
  return true;
}

function prepTmp(S) {
  const yon = YONKO[S.era].filter(y => y.id !== S.hero.yonko);
  const nwIsl = islandsOf(tierOf(S) >= 3 ? 'nw' : 'paradise', S.era).filter(i => i.id !== S.loc && !i.noNav);
  S.tmp = {
    r: rnd(S), yonko: pick(S, yon), island: pick(S, nwIsl)?.id,
    c1: S.crew.length ? ri(S, 0, S.crew.length - 1) : 0,
    c2: S.crew.length > 1 ? ri(S, 0, S.crew.length - 1) : 0,
  };
  if (S.crew.length > 1 && S.tmp.c2 === S.tmp.c1) S.tmp.c2 = (S.tmp.c1 + 1) % S.crew.length;
}

export function pickEvent(S, ctx, secondary = false) {
  prepTmp(S);
  const c = ALL_EVENTS.filter(e => matches(e, S, ctx));
  const prio = c.filter(e => (e.pri || 0) >= (secondary ? 8 : 9));
  if (prio.length) {
    const maxP = Math.max(...prio.map(e => e.pri));
    return { id: pick(S, prio.filter(e => e.pri === maxP)).id };
  }
  if (ctx === 'island' && !secondary && ISLANDS[S.loc].noNav) return null;
  const pool = c.filter(e => !(e.pri >= 8));
  // rencontre canon
  const chars = charsAt(S.loc, S.era).filter(ch => !S.seen['meet_' + ch.id]);
  if (ctx === 'island' && chars.length && chance(S, secondary ? 0.55 : 0.35)) return { gen: makeEncounter(S, pick(S, chars)) };
  if (!pool.length) return null;
  // en exploration et en mer : souvent une trouvaille (fruit du démon, navire, équipement)
  if ((secondary || ctx === 'sea') && chance(S, 0.3)) {
    const loot = pool.filter(e => /^(f_|sh_)/.test(e.id));
    if (loot.length) return { id: wpick(S, loot, e => (e.w?.weight || 3) / (1 + 2 * (S.seen[e.id] || 0))).id };
  }
  const ev = wpick(S, pool, e => (e.w?.weight || 3) / (1 + 3 * (S.seen[e.id] || 0)));
  return ev ? { id: ev.id } : null;
}

export function makeEncounter(S, ch) {
  const camp = campOf(S);
  const friendly = (ch.align === 'marine' || ch.align === 'gov') === (camp === 'gardien');
  const dcComb = ch.power * 1.05 + 4;
  const choices = [
    { t: `Sympathiser avec ${ch.name.split(',')[0]}`, s: 'charisme', d: friendly ? -2 : 5,
      ok: { x: `« ${ch.quote} » Vous discutez longuement. ${ch.name.split(',')[0]} se souviendra de toi.`, e: { rel: { [ch.id]: 2 } } },
      ko: { x: `${ch.name.split(',')[0]} te regarde à peine. Ce n'était pas le bon moment.`, e: { rel: { [ch.id]: -1 } } } },
    { t: `Défier ${ch.name.split(',')[0]} en combat`, s: 'combat', D: dcComb,
      ok: { x: `Contre toute attente, tu prends le dessus sur ${ch.name.split(',')[0]} ! Les témoins n'en reviennent pas.`, e: { fruit: ch.power >= 20 && chance(S, 0.2) ? 'random' : null, glory: Math.ceil(ch.power / 4), rel: { [ch.id]: ch.align === 'pirate' || ch.align === 'yonko' ? 1 : -2 }, hl: ch.power >= 30 ? `a battu ${ch.name.split(',')[0]} en duel` : null, merit: camp === 'gardien' && !friendly ? Math.ceil(ch.power / 5) : 0 } },
      ko: { x: `${ch.name.split(',')[0]} t'envoie au tapis sans forcer. « ${ch.quote} »`, e: { hp: -Math.round(15 + ch.power * 0.6), rel: { [ch.id]: -1 } } } },
    { t: 'Lui demander un conseil', s: 'intel', d: 0,
      ok: { x: `${ch.name.split(',')[0]} te donne un conseil précieux. Tu progresses.`, e: { stats: { [pick(S, Object.keys(STATS))]: 1 }, rel: { [ch.id]: 1 } } },
      ko: { x: 'Tu n\'as pas tout compris. Mais tu as essayé.', e: {} } },
  ];
  if (!friendly && ch.power >= 40) choices.push({ t: 'Filer discrètement', s: 'vitesse', d: 0, ok: { x: 'Tu t\'éclipses avant que ça dégénère.', e: {} }, ko: { x: 'On t\'a vu partir. Un coup dans le dos en guise d\'au revoir.', e: { hp: -15 } } });
  return { id: 'meet_' + ch.id, emoji: ch.emoji, title: `Rencontre : ${ch.name}`, x: `${ch.desc} ${ch.name.split(',')[0]} est là, devant toi.`, ch: choices, char: ch.id };
}

export const curEvent = S => (S.cur?.gen ? S.cur.gen : S.cur?.id ? EVENTS[S.cur.id] : null);

const isFiller = c => c.r && !c.c && !c.s && !c.p && Object.keys(c.r.e || {}).every(k => ['morale', 'hp', 'rep', 'flag'].includes(k));
export function choicesOf(S, ev) {
  const V = view(S);
  const all = (ev.ch || []).map((c, i) => {
    let locked = false, lockText = '';
    if (c.req && !c.req(V)) { locked = true; lockText = c.rq || 'Indisponible'; }
    const cost = val(c.c, V);
    if (!locked && cost && S.hero.berrys < cost) { locked = true; lockText = `Il faut ${fmtPrime(cost)}`; }
    const stat = val(c.s, V);
    const p = c.p || stat ? checkChance(S, c) : 1;
    return { i, label: val(c.t, V), stat, cost, locked, lockText, p, risk: c.p || stat ? riskLabel(p) : null, filler: isFiller(c) };
  });
  // moins de choix, plus décisifs : on masque les choix verrouillés et les « remplissages »
  let out = all.filter(c => !c.locked);
  if (out.length < 2) out = all.filter(c => !c.locked || out.length === 0 || true).slice(0, 3);
  for (let k = out.length - 1; k >= 0 && out.length > 3; k--) if (out[k].filler) out.splice(k, 1);
  return out;
}

// ───────────── effets ─────────────
function gainBounty(S, amount, chips) {
  if (amount <= 0 || S.hero.faction === 'corsaire') return;
  S.hero.bounty += amount;
  chips.push({ t: `Prime +${fmtPrime(amount)}`, k: 'bounty' });
}

export function applyEff(S, e = {}, chips = [], mult = null) {
  const V = view(S);
  const h = S.hero, tier = tierOf(S), camp = campOf(S);
  const E = {};
  for (const [k, v] of Object.entries(e)) E[k] = val(v, V);
  if (mult) for (const k of ['hp', 'shipHp', 'morale', 'berrys', 'rep', 'merit', 'glory', 'bounty', 'loyalty']) {
    if (typeof E[k] === 'number' && E[k]) E[k] = Math.round(E[k] * (E[k] > 0 ? mult.good : mult.bad));
  }
  if (E.glory) {
    const g = E.glory;
    if (camp === 'chercheur' && !['chasseur', 'corsaire'].includes(h.faction)) gainBounty(S, g * GLORY[tier], chips);
    if (camp === 'gardien' && S.era === 'post' && h.faction === 'marine') { const cg = Math.round(g * GLORY[tier] * 0.3); h.bounty += cg; chips.push({ t: `Prime Cross Guild +${fmtPrime(cg)}`, k: 'bounty' }); }
    if (camp === 'gardien' || ['chasseur', 'corsaire', 'revo', 'vassal'].includes(h.faction)) { S.merit += g; chips.push({ t: `Mérite +${g}`, k: 'good' }); }
    S.rep += Math.ceil(g / 2);
    if (camp === 'chercheur' && g > 0) { const loot = Math.round(g * GLORY[tier] * 0.2); h.berrys += loot; chips.push({ t: `Butin +${fmtPrime(loot)}`, k: 'money' }); }
  }
  if (E.bounty) gainBounty(S, E.bounty, chips);
  if (E.merit) { S.merit = Math.max(0, S.merit + E.merit); chips.push({ t: `Mérite ${E.merit > 0 ? '+' : ''}${E.merit}`, k: E.merit > 0 ? 'good' : 'bad' }); }
  if (E.rep) { S.rep += E.rep; chips.push({ t: `Réputation ${E.rep > 0 ? '+' : ''}${E.rep}`, k: E.rep > 0 ? 'good' : 'bad' }); }
  if (E.berrys) { const b = Math.round(E.berrys); h.berrys = Math.max(0, h.berrys + b); chips.push({ t: `${b > 0 ? '+' : '-'}${fmtPrime(Math.abs(b))}`, k: b > 0 ? 'money' : 'bad' }); }
  if (E.berrysMul !== undefined) { h.berrys = Math.round(h.berrys * E.berrysMul); chips.push({ t: E.berrysMul > 1 ? 'Fortune doublée !' : 'Fortune perdue !', k: E.berrysMul > 1 ? 'money' : 'bad' }); }
  if (E.morale) { S.morale = clamp(S.morale + E.morale, 0, 100); chips.push({ t: `Moral ${E.morale > 0 ? '+' : ''}${E.morale}`, k: E.morale > 0 ? 'good' : 'bad' }); }
  if (E.stats) for (let [k, v] of Object.entries(E.stats)) { if (v > 0 && S.length === 'rapide' && v >= 2) v = Math.ceil(v * 1.25); h.stats[k] = clamp(h.stats[k] + v, 1, Math.max(h.stats[k], 22)); chips.push({ t: `${STATS[k].emoji} ${STATS[k].name} ${v > 0 ? '+' : ''}${v}`, k: v > 0 ? 'stat' : 'bad' }); }
  if (E.haki) for (const [k, v] of Object.entries(E.haki)) {
    if (k === 'roi') {
      if (v === 'reveal') { if (h.roiPotential && h.haki.roi === 0) { h.haki.roi = 1; chips.push({ t: '👑 Haki des Rois éveillé !', k: 'epic' }); S.hl.push('a éveillé le Haki des Rois'); } continue; }
      if (!h.roiPotential) { if (h.haki.roi === 0) continue; }
      h.roiPotential = true;
    }
    const before = h.haki[k];
    h.haki[k] = clamp(h.haki[k] + v, 0, 3);
    if (h.haki[k] > before) chips.push({ t: `${{ obs: '👁️ Haki de l\'observation', arm: '🛡️ Haki de l\'armement', roi: '👑 Haki des Rois' }[k]} ${before === 0 ? 'débloqué' : 'niv. ' + h.haki[k]}`, k: 'epic' });
  }
  if (E.hp) {
    const dmg = E.hp < 0 ? Math.round(E.hp * (1 - Math.min(0.3, h.haki.arm * 0.07 + h.haki.obs * 0.03))) : E.hp;
    h.hp = clamp(h.hp + dmg, -999, h.hpMax);
    chips.push({ t: `PV ${dmg > 0 ? '+' : ''}${dmg}`, k: dmg > 0 ? 'good' : 'bad' });
  }
  if (E.shipHp) { const max = shipMaxHp(S); S.ship.hp = clamp(S.ship.hp + E.shipHp, -1, max); chips.push({ t: `Navire ${E.shipHp > 0 ? '+' : ''}${E.shipHp}`, k: E.shipHp > 0 ? 'good' : 'bad' }); }
  if (E.ship) {
    if (E.ship.tier) {
      const nt = E.ship.tier === '+1' ? Math.min(5, S.ship.tier + 1) : Math.max(S.ship.tier, E.ship.tier);
      if (nt !== S.ship.tier) { const keepCoat = S.ship.coated; setShip(S, DEFAULT_MODEL[nt], chips); S.ship.coated = S.ship.coated || keepCoat; }
    }
    if (E.ship.model && SHIP_MODELS[E.ship.model]) setShip(S, E.ship.model, chips);
    if (E.ship.mod) { const ids = Object.keys(SHIP_MODS).filter(k => !S.ship.mods.includes(k)); const id = E.ship.mod === 'random' ? (ids.length ? pick(S, ids) : null) : E.ship.mod; if (id && !S.ship.mods.includes(id)) { S.ship.mods.push(id); chips.push({ t: `${SHIP_MODS[id].emoji} ${SHIP_MODS[id].name} installé(e)`, k: 'epic' }); } }
    if (E.ship.coated && !S.ship.coated) { S.ship.coated = true; chips.push({ t: '🫧 Navire enrobé (coating)', k: 'good' }); }
  }
  if (E.fruit) {
    let id = E.fruit;
    if (id.startsWith('random')) id = randomFruit(S, +id.slice(6) || null);
    if (id && FRUITS[id]) { S.inventory.fruits.push(id); chips.push({ t: `🍇 Fruit : ${FRUITS[id].name}`, k: 'epic' }); }
  }
  if (E.weapon) {
    let id = E.weapon;
    if (id.startsWith('random')) id = randomWeapon(S, +id.slice(6) || tier);
    if (id && WEAPONS[id]) {
      if (!h.weapon || WEAPONS[id].tier > WEAPONS[h.weapon].tier) { if (h.weapon) S.inventory.weapons.push(h.weapon); h.weapon = id; chips.push({ t: `⚔️ Équipé : ${WEAPONS[id].name}`, k: 'epic' }); }
      else { S.inventory.weapons.push(id); chips.push({ t: `⚔️ Cale : ${WEAPONS[id].name}`, k: 'good' }); }
    }
  }
  if (E.item && ITEMS[E.item]) { S.inventory.items.push(E.item); chips.push({ t: `${ITEMS[E.item].emoji} ${ITEMS[E.item].name}`, k: 'good' }); }
  if (E.recruit) {
    const max = 10;
    const opt = E.recruit === true ? {} : E.recruit;
    const c = genCrew(S, opt);
    if (S.crew.length < max) { S.crew.push(c); chips.push({ t: `${c.emoji} Recrue : ${c.name}`, k: 'epic' }); log(S, `${c.name} (${ROLES[c.role].name}) rejoint ${FACTIONS[h.faction].crewLabel.toLowerCase()}.`, 'crew'); }
    else { S.fleet.push({ name: `Équipage de ${c.name}`, power: Math.ceil(c.power / 3) }); chips.push({ t: `⛵ Flotte : équipage de ${c.name}`, k: 'epic' }); }
  }
  if (E.crewLoss && S.crew.length) {
    let idx;
    const cand = S.crew.map((c, i) => [c, i]).filter(([c]) => !c.isCaptain || h.isCaptain);
    if (cand.length) {
      if (E.crewLoss === 'lowloyal') idx = cand.sort((a, b) => a[0].loyalty - b[0].loyalty)[0][1];
      else idx = (S.tmp?.c1 !== undefined && S.crew[S.tmp.c1] && cand.some(([, i]) => i === S.tmp.c1)) ? S.tmp.c1 : pick(S, cand)[1];
      const [c] = S.crew.splice(idx, 1);
      chips.push({ t: `💔 ${c.name} quitte l'équipage`, k: 'bad' });
      log(S, `${c.name} a quitté ${FACTIONS[h.faction].crewLabel.toLowerCase()}.`, 'crew');
    }
  }
  if (E.loyalty) { for (const c of S.crew) c.loyalty = clamp(c.loyalty + E.loyalty, 0, 100); chips.push({ t: `Loyauté ${E.loyalty > 0 ? '+' : ''}${E.loyalty}`, k: E.loyalty > 0 ? 'good' : 'bad' }); }
  if (E.rel) for (const [k, v] of Object.entries(E.rel)) {
    if (!CHARACTERS[k]) continue;
    S.rel[k] = clamp((S.rel[k] || 0) + v, -5, 5);
    addGrel(S, groupOfChar(k, S.era), v, chips);
    chips.push({ t: `${CHARACTERS[k].emoji} ${CHARACTERS[k].name.split(',')[0]} ${v > 0 ? '♥' : '✖'}${Math.abs(v)}`, k: v > 0 ? 'rel' : 'bad' });
  }
  if (E.frel) for (const [k, v] of Object.entries(E.frel)) addGrel(S, k, v, chips);
  if (E.flag) S.flags[E.flag] = true;
  if (E.flag2) S.flags[E.flag2] = true;
  if (E.arc) {
    (S.arcs ||= {})[E.arc.id] = E.arc.stage; (S.arcT ||= {})[E.arc.id] = S.turn;
    const A = ARCS[E.arc.id];
    if (A) { const done = E.arc.stage >= A.stages; chips.push({ t: `📖 ${A.name} : ${done ? 'terminée' : `étape ${E.arc.stage}/${A.stages}`}`, k: 'level' }); log(S, `📖 Trame « ${A.name} » : ${done ? 'dénouement' : 'étape ' + E.arc.stage}.`, 'big'); }
  }
  if (E.unflag) delete S.flags[E.unflag];
  if (E.hl) S.hl.push(E.hl);
  if (E.territory) { S.territory += E.territory; chips.push({ t: '🏝️ Territoire +1', k: 'good' }); }
  if (E.fleet) { S.fleet.push(E.fleet); chips.push({ t: `⛵ Flotte : ${E.fleet.name}`, k: 'epic' }); }
  if (E.captain && !h.isCaptain) { h.isCaptain = true; const old = S.crew.find(c => c.isCaptain); if (old) { old.isCaptain = false; old.role = 'combattant'; old.emoji = ROLES.combattant.emoji; } chips.push({ t: '🏴‍☠️ Tu es capitaine !', k: 'epic' }); log(S, `${h.name} devient capitaine.`, 'big'); }
  if (E.awaken && h.fruit) { h.fruit.awakened = true; chips.push({ t: '✨ Fruit éveillé', k: 'epic' }); }
  if (E.giveFruit && S.inventory.fruits.length && S.crew.length) giveFruit(S, 0, S.tmp?.c1 ?? 0, chips);
  if (E.age) { h.age += E.age; chips.push({ t: `+${E.age} an${E.age > 1 ? 's' : ''}`, k: 'info' }); }
  if (E.yonko) { setYonko(S, E.yonko, chips); }
  if (E.faction && E.faction !== h.faction) changeFaction(S, E.faction, chips);
  if (E.pone && !S.pone.includes(E.pone)) {
    S.pone.push(E.pone);
    S.inventory.items.push('poneglyph_rubbing');
    S.progress = Math.max(S.progress, Math.min(7, 3 + S.pone.length));
    chips.push({ t: `🗿 Poneglyphe routier ${S.pone.length}/4`, k: 'epic' });
    log(S, `${campOf(S) === 'gardien' ? 'Poneglyphe routier sécurisé' : 'Relevé de Poneglyphe routier obtenu'} (${S.pone.length}/4).`, 'big');
  }
  if (E.progress) S.progress = Math.max(S.progress, E.progress);
  if (E.goto) {
    let g = E.goto;
    if (g === 'random_paradise') g = pick(S, islandsOf('paradise', S.era).filter(i => !i.noNav && !i.gate && i.id !== 'enies')).id;
    if (ISLANDS[g]) { S.forcedNext = g; chips.push({ t: `🧭 Cap forcé : ${ISLANDS[g].name}`, k: 'info' }); }
  }
  if (E.capture) { S.forcedNext = 'impeldown'; S.flags.captured = true; chips.push({ t: '⛓️ Capturé !', k: 'bad' }); S.hl.push('a été capturé et envoyé à Impel Down'); }
  if (E.death) { S.pendingEnd = { kind: 'death', cause: E.death }; }
  if (E.end === 'rangee') { S.pendingEnd = { kind: 'rangee', cause: 'A choisi une vie bien rangée' }; }
  if (E.heal) { delete S.flags.wounded; }
  if (E.evac) S.evacs = (S.evacs || 0) + 1;
  if (E.hpSet) { h.hp = E.hpSet; S.deathSaves++; chips.push({ t: `PV ${E.hpSet}`, k: 'info' }); }
  if (E.end === 'prison') { S.pendingEnd = { kind: 'prison', cause: 'Enfermé à vie au Niveau 6 d\'Impel Down' }; }
  postUpdate(S, chips);
  return chips;
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function setYonko(S, id, chips) {
  const y = [...YONKO.pre, ...YONKO.post].find(y => y.id === id);
  if (!y) return;
  if (S.hero.faction === 'empereur') return;
  if (campOf(S) === 'gardien') { S.flags.secret_vassal = id; chips.push({ t: `🤝 Pacte secret avec ${y.name}`, k: 'info' }); return; }
  S.hero.yonko = id;
  changeFaction(S, 'vassal', chips);
  addGrel(S, groupOfYonko(id, S.era), 3, chips);
  chips.push({ t: `${y.emoji} Sous le drapeau de ${y.name}`, k: 'epic' });
}

export function changeFaction(S, fac, chips = []) {
  const h = S.hero, old = h.faction;
  if (old === fac) return;
  if (FACTIONS[fac].era && FACTIONS[fac].era !== S.era) return;
  const oldCamp = FACTIONS[old].camp;
  h.faction = fac;
  if (FACTIONS[fac].camp !== oldCamp) addGrel(S, groupOfFaction(old, h.yonko, S.era), -4, chips);
  addGrel(S, groupOfFaction(fac, h.yonko, S.era), 3, chips);
  if (!S.factionsVisited.includes(fac)) S.factionsVisited.push(fac);
  S.merit = Math.floor(S.merit / 2);
  if (fac === 'pirate' || fac === 'empereur' || fac === 'revo' || fac === 'vassal') h.isCaptain = true;
  if (oldCamp === 'gardien' && FACTIONS[fac].camp === 'chercheur') {
    const b = Math.max(h.bounty, 20_000_000 * tierOf(S) ** 2);
    if (b > h.bounty) { h.bounty = b; chips.push({ t: `Traître ! Prime : ${fmtPrime(b)}`, k: 'bounty' }); }
  }
  if (fac !== 'vassal') h.yonko = null;
  chips.push({ t: `${FACTIONS[fac].emoji} Nouvelle faction : ${FACTIONS[fac].name}`, k: 'epic' });
  log(S, `${h.name} rejoint : ${FACTIONS[fac].name}.`, 'big');
}

export function randomFruit(S, tier) {
  const owned = new Set([S.hero.fruit?.id, ...S.inventory.fruits, ...S.crew.map(c => c.fruit)].filter(Boolean));
  const pool = Object.values(FRUITS).filter(f => f.id !== 'smile' && !owned.has(f.id) && (!tier || f.tier <= tier));
  if (!pool.length) return 'smile';
  const t = tier || tierOf(S) + 1;
  return wpick(S, pool, f => (f.tier <= t ? 3 : 0.6) / (1 + Math.abs(f.tier - t)) * (f.canon ? 0.8 : 1))?.id;
}
export function randomWeapon(S, tier) {
  const pool = Object.values(WEAPONS).filter(w => w.tier <= Math.max(1, tier) && w.tier >= Math.max(1, tier - 1));
  return pick(S, pool.length ? pool : Object.values(WEAPONS)).id;
}

export function eatFruit(S, idx, chips = []) {
  const id = S.inventory.fruits[idx];
  if (!id) return chips;
  if (S.hero.fruit) { chips.push({ t: 'Un deuxième fruit te ferait exploser !', k: 'bad' }); return chips; }
  S.inventory.fruits.splice(idx, 1);
  const f = FRUITS[id];
  S.hero.fruit = { id, awakened: false };
  if (id === 'smile') {
    const ok = chance(S, 0.1);
    S.hero.fruit.smileOk = ok;
    if (ok) { chips.push({ t: '😁 SMILE réussi ! Un pouvoir animal !', k: 'epic' }); S.hl.push('a réussi un SMILE (1 chance sur 10)'); }
    else { chips.push({ t: '😂 SMILE raté : tu ris pour toujours', k: 'bad' }); S.flags.smile_fail = true; S.hl.push('a raté un SMILE et ne peut plus s\'arrêter de rire'); S.morale = clamp(S.morale + 20, 0, 100); }
  } else {
    chips.push({ t: `🍇 Tu as mangé le ${f.name} !`, k: 'epic' });
    S.hl.push(`a mangé le ${f.name}`);
  }
  log(S, `${S.hero.name} mange le ${f.name}. Il ne sait plus nager.`, 'big');
  S.hero.hpMax = hpMaxOf(S);
  postUpdate(S, chips);
  return chips;
}

export function giveFruit(S, fidx, cidx, chips = []) {
  const id = S.inventory.fruits[fidx], c = S.crew[cidx];
  if (!id || !c) return chips;
  if (c.fruit) { chips.push({ t: `${c.name} a déjà un fruit`, k: 'bad' }); return chips; }
  S.inventory.fruits.splice(fidx, 1);
  const f = FRUITS[id];
  c.fruit = id;
  if (id === 'smile' && !chance(S, 0.1)) { c.trait = 'A raté un SMILE. Rit en permanence, même en pleurant.'; chips.push({ t: `😂 ${c.name} a raté son SMILE`, k: 'bad' }); }
  else { c.power += f.tier * 2; chips.push({ t: `🍇 ${c.name} a mangé le ${f.name}`, k: 'epic' }); }
  c.loyalty = clamp(c.loyalty + 20, 0, 100);
  log(S, `${c.name} a mangé le ${f.name}.`, 'crew');
  return chips;
}

export function sellFruit(S, idx, chips = []) {
  const id = S.inventory.fruits[idx];
  if (!id) return chips;
  const p = Math.round(fruitPrice(FRUITS[id]) * 0.6);
  S.inventory.fruits.splice(idx, 1);
  S.hero.berrys += p;
  chips.push({ t: `Vendu : +${fmtPrime(p)}`, k: 'money' });
  return chips;
}

export function equipWeapon(S, idx) {
  const id = S.inventory.weapons[idx];
  if (!id) return;
  S.inventory.weapons.splice(idx, 1);
  if (S.hero.weapon) S.inventory.weapons.push(S.hero.weapon);
  S.hero.weapon = id;
}

export function sellWeapon(S, idx, chips = []) {
  const id = S.inventory.weapons[idx];
  if (!id) return chips;
  const p = Math.round(weaponPrice(WEAPONS[id]) * 0.5);
  S.inventory.weapons.splice(idx, 1);
  S.hero.berrys += p;
  chips.push({ t: `Vendu : +${fmtPrime(p)}`, k: 'money' });
  return chips;
}

// vérifications après chaque changement : promotions, mort, naufrage
function postUpdate(S, chips) {
  const h = S.hero;
  h.hpMax = hpMaxOf(S);
  const ri = rankIdxOf(S);
  if (S.rankIdx !== undefined && ri > S.rankIdx) {
    chips.push({ t: `🎖️ Promotion : ${FACTIONS[h.faction].ranks[ri]}`, k: 'epic' });
    log(S, `Promotion : ${FACTIONS[h.faction].ranks[ri]}.`, 'big');
    if (campOf(S) === 'gardien') S.flags.promoted_pending = true;
  }
  S.rankIdx = ri;
  const li = levelIdxOf(S);
  if (S.levelIdx !== undefined && li > S.levelIdx) { chips.push({ t: `${LEVELS[li].emoji} Niveau : ${LEVELS[li].name}`, k: 'level' }); log(S, `Nouveau niveau de puissance : ${LEVELS[li].name}.`, 'big'); }
  S.levelIdx = Math.max(S.levelIdx || 0, li);
  if (S.ship.hp <= 0) {
    chips.push({ t: '🌊 Ton navire a coulé !', k: 'bad' });
    log(S, `${S.ship.name} a coulé.`, 'big');
    S.hl.push('a vu son navire couler');
    S.ship.tier = Math.max(1, S.ship.tier - 2); S.ship.model = DEFAULT_MODEL[S.ship.tier]; S.ship.mods = []; S.ship.hp = shipMaxHp(S); S.ship.coated = false;
    S.morale = clamp(S.morale - 25, 0, 100);
    if (S.crew.length && chance(S, 0.5)) { const [c] = S.crew.splice(ri % S.crew.length, 1); chips.push({ t: `💔 ${c.name} a disparu en mer`, k: 'bad' }); }
    if (h.fruit) h.hp -= 20;
  }
  if (h.hp <= 0 && !S.pendingEnd && !S.flags.wounded) {
    // premier K.O. : on survit, mais avec des conséquences. Le suivant (avant repos) peut tuer.
    S.flags.wounded = true;
    h.hp = Math.round(h.hpMax * 0.2);
    chips.push({ t: '🤕 K.O. ! Blessé grave : un nouveau K.O. avant de te soigner peut être fatal', k: 'bad' });
    const roll = rnd(S);
    if (campOf(S) === 'chercheur' && tierOf(S) >= 2 && roll < 0.2 && S.loc !== 'impeldown' && S.hero.bounty >= 50_000_000) {
      S.forcedNext = 'impeldown'; S.flags.captured = true; chips.push({ t: '⛓️ Capturé pendant que tu étais à terre !', k: 'bad' }); S.hl.push('a été capturé, inconscient');
    } else if (roll < 0.5 && h.berrys > 0) {
      const lost = Math.round(h.berrys * (shipBonus(S, 'vault') ? 0.2 : 0.4)); h.berrys -= lost; chips.push({ t: `On t'a détroussé : -${fmtPrime(lost)}`, k: 'bad' });
    } else if (S.crew.length > 1 && roll < 0.7) {
      const cand = S.crew.filter(c => !c.isCaptain);
      if (cand.length) { const c = pick(S, cand); S.crew.splice(S.crew.indexOf(c), 1); chips.push({ t: `💔 ${c.name} a été capturé en te couvrant`, k: 'bad' }); log(S, `${c.name} a été perdu en couvrant la retraite.`, 'crew'); }
    } else { S.morale = clamp(S.morale - 20, 0, 100); chips.push({ t: 'Moral -20', k: 'bad' }); }
    log(S, `${h.name} est mis K.O.`, 'ko');
  } else if (h.hp <= 0 && !S.pendingEnd) {
    const doc = S.crew.find(c => c.role === 'medecin');
    const pDoc = doc ? 0.6 * 0.6 ** S.deathSaves : 0;
    const pWill = Math.min(0.35, h.stats.volonte * 0.015) * 0.5 ** S.deathSaves;
    if (doc && chance(S, pDoc)) { h.hp = 15; S.deathSaves++; doc.loyalty = clamp(doc.loyalty + 15, 0, 100); chips.push({ t: `🩺 ${doc.name} t'a sauvé de la mort !`, k: 'epic' }); S.hl.push(`a été ramené d'entre les morts par son médecin ${doc.name}`); }
    else if (chance(S, pWill)) { h.hp = 1; S.deathSaves++; chips.push({ t: '🔥 Tu refuses de mourir !', k: 'epic' }); S.hl.push('a refusé de mourir'); }
    else S.fatal = { cause: S.deathCause || 'Mort au combat' };
  }
}

// ───────────── déroulement ─────────────
export function startIsland(S, first = false) {
  S.cur = pickEvent(S, 'island');
  S.phase = S.cur ? 'event' : 'escale';
  if (!S.cur) S.actionsLeft = LENGTHS[S.length].actions;
  if (first && !S.cur) S.phase = 'escale';
}

export function resolveChoice(S, i) {
  const ev = curEvent(S);
  const c = ev.ch[i];
  const V = view(S);
  const cost = val(c.c, V);
  if (c.req && !c.req(V)) return null;
  if (cost && S.hero.berrys < cost) return null;
  const chips = [];
  if (cost) { S.hero.berrys -= cost; chips.push({ t: `-${fmtPrime(cost)}`, k: 'bad' }); }
  const stat = val(c.s, V);
  let ok = true, p = 1;
  let roll = null;
  if (c.p || stat) { p = checkChance(S, c); roll = rnd(S); ok = roll < p; }
  let reinf = null, res_feat = false;
  if (!ok && stat === 'combat' && !c.r) {
    S.reinf ||= {};
    const cand = allyGroups(S).filter(g => (S.reinf[g.id] ?? -9) < S.turn - 2);
    if (cand.length && rnd(S) < 0.35) { reinf = pick(S, cand); S.reinf[reinf.id] = S.turn; ok = true; }
  }
  const res = c.r || (ok ? c.ok : c.ko);
  if (ok && stat === 'combat' && !reinf && !c.r) {
    // les adversaires anonymes (taverne, mer, brigands) comptent moins que les affrontements nommés
    const dc = ev.char ? CHARACTERS[ev.char].power * 1.05 + 4 : combatDcOf(S, c) * (/^(g_|s_|r_|f_|sh_)/.test(ev.id) ? 0.8 : 1);
    if (dc > (S.maxFoe || 0)) { S.maxFoe = Math.round(dc); res_feat = true; }
  }
  S.deathCause = ev.char ? `Tué par ${CHARACTERS[ev.char].name.split(',')[0]}` : deathCauseFor(S, ev);
  const text = interp(S, val(res.x, V));
  const e = res.e || {};
  applyEff(S, e, chips, c.r ? null : ok ? { good: 1.35, bad: 1 } : { good: 1, bad: 1.3 });
  S.seen[ev.id] = (S.seen[ev.id] || 0) + 1;
  if (ev.oncePerTurn) (S.turnSeen ||= {})[ev.id] = S.turn;
  if (ev.id.startsWith('pone_') && ok === false && !c.r) (S.poneTry ||= {})[S.loc] = S.turn;
  log(S, `${ev.emoji || '•'} ${ev.title} — ${val(c.t, V)} → ${c.r ? 'fait' : ok ? 'réussi' : 'échec'}.`, ok ? 'ok' : 'ko');
  if (res_feat) chips.push({ t: `🏆 Exploit : adversaire de niveau ${S.maxFoe} vaincu`, k: 'level' });
  if (reinf) chips.unshift({ t: `🤝 Renforts : ${reinf.emoji} ${reinf.name} !`, k: 'epic' });
  S.result = { title: ev.title, emoji: ev.emoji, choice: val(c.t, V), text: reinf ? `${reinf.emoji} Au pire moment, des renforts de ${reinf.name} surgissent et retournent la situation ! ` + text : text, chips, ok: c.r ? null : ok, p, roll, reinf: reinf?.name, stat: stat || (c.p ? 'chance' : null), next: res.next };
  S.phase = 'result';
  return S.result;
}

function deathCauseFor(S, ev) {
  const isl = ISLANDS[S.loc];
  return `Mort pendant « ${ev.title} » (${isl.name})`;
}

export function interp(S, txt) {
  if (!txt) return '';
  return txt
    .replaceAll('{nom}', S.hero.name)
    .replaceAll('{bateau}', S.ship.name)
    .replaceAll('{membre}', S.crew[S.tmp?.c1 ?? 0]?.name || 'ton second')
    .replaceAll('{ile}', ISLANDS[S.loc].name)
    .replaceAll('{titre}', rankName(S))
    .replaceAll('{equipage}', FACTIONS[S.hero.faction].crewLabel.toLowerCase());
}

// après l'écran de résultat
export function afterResult(S) {
  S.result = null;
  if (S.pendingEnd) return finish(S, S.pendingEnd.kind, S.pendingEnd.cause);
  if (checkFatal(S)) return;
  if (S.progress >= 9) return finish(S, 'onepiece');
  if (S.ctx === 'sea') { S.ctx = null; const dest = S.forcedNext || S.next; S.forcedNext = null; return arrive(S, dest); }
  if (S.forcedNext && (S.forcedNext === 'impeldown' || ISLANDS[S.loc].noNav)) { S.phase = 'nav'; return; }
  // Laugh Tale : les événements s'enchaînent (épreuve puis trésor)
  if (S.loc === 'laughtale') { const ev = pickEvent(S, 'island'); if (ev) { S.cur = ev; S.phase = 'event'; return; } }
  if (S.phase === 'result') {
    if (S.inEscale) { S.phase = 'escale'; return; }
    S.phase = 'escale';
    S.actionsLeft = S.loc === 'impeldown' ? 0 : LENGTHS[S.length].actions;
    S.inEscale = true;
  }
}

export function leaveIsland(S) {
  S.inEscale = false;
  if (S.turn >= S.maxTurns - 1 && !S.forcedNext) return finish(S, 'temps');
  S.phase = 'nav';
}

// ───────────── navigation ─────────────
export function canReadPone(S) {
  return S.crew.some(c => c.role === 'archeologue') || S.hero.role === 'archeologue' || S.flags.can_read_pone || S.hero.stats.intel >= 18 || (S.rel.robin || 0) >= 3;
}

// la liste est tirée une fois puis figée (sinon un nouveau tirage au clic pourrait faire disparaître l'île choisie)
export function navOptions(S) {
  const key = [S.turn, S.loc, S.forcedNext, S.pone.length, S.ship.coated, canReadPone(S), S.hero.faction, S.visited.length, !!S.flags.knows_skypiea].join('|');
  if (S.navCache?.key === key) return S.navCache.opts;
  const opts = computeNav(S);
  S.navCache = { key, opts };
  return opts;
}

// Route linéaire : on avance toujours vers l'avant, avec un choix entre deux îles.
function routeAhead(S) {
  const key = routeKeyOf(ISLANDS[S.loc].sea);
  const route = (ROUTES[key] || []).filter(id => { const i = ISLANDS[id]; return (!i.era || i.era === S.era) && !(S.length === 'rapide' && i.generated && i.pop < 3) && !(i.generated && i.pop < 2); });
  const camp = campOf(S);
  // position sur la route : seules les arrivées choisies font avancer (pas les renvois forcés) ; ce qui est derrière toi est derrière toi
  const cur = S.routePos?.[key] ?? -1;
  const ahead = route.filter((id, k) => k > cur && !S.visited.includes(id)
    && !(id === 'marineford' && camp !== 'gardien' && S.progress < 2)
    && !(id === 'skypiea' && !S.flags.knows_skypiea));
  // on ne saute jamais un Poneglyphe non obtenu : la route s'arrête sur lui
  const stop = ahead.findIndex(id => ISLANDS[id].pone && !S.pone.includes(ISLANDS[id].pone));
  if (stop >= 0) ahead.splice(stop + 1);
  const retry = route.filter(id => ISLANDS[id].pone && S.visited.includes(id) && !S.pone.includes(ISLANDS[id].pone) && (S.poneTry?.[id] ?? -9) <= S.turn - 6 && id !== S.loc);
  return { key, route, cur, ahead, retry };
}

// pour l'interface : une frise de la route avec la position actuelle
export function routeView(S) {
  const { route, ahead } = routeAhead(S);
  const fork = new Set(ahead.slice(0, 2));
  return route.map(id => ({ id, name: ISLANDS[id].name, state: id === S.loc ? 'here' : S.visited.includes(id) ? 'done' : fork.has(id) ? 'next' : 'later' }));
}

function computeNav(S) {
  if (S.forcedNext) return [{ id: S.forcedNext, forced: true, label: ISLANDS[S.forcedNext].name, sub: 'Tu n\'as pas le choix.' }];
  const isl = ISLANDS[S.loc], sea = isl.sea, L = LENGTHS[S.length];
  const camp = campOf(S);
  const nv = id => !S.visited.includes(id);
  const opts = [];
  const enter = (i, extra = {}) => opts.push({ id: i.id, label: i.name, sub: i.sub, pop: i.pop, sea: i.sea, ...extra });
  const { ahead, retry } = routeAhead(S);
  const fork = ahead.slice(0, 2);
  const forkOpts = () => {
    fork.forEach((id, k) => enter(ISLANDS[id], { route: fork.length > 1 ? (k === 0 ? 'A' : 'B') : null }));
    retry.forEach(id => enter(ISLANDS[id], { retry: true, label: `Retenter : ${ISLANDS[id].name}`, sub: 'Le Poneglyphe t\'attend toujours' }));
  };
  if (BLUES.includes(sea)) {
    forkOpts();
    if ((S.seaVisits[sea] || 0) >= L.blueMin || !ahead.length) enter(ISLANDS.reverse, { big: true, label: 'Cap sur Grand Line !', sub: 'Reverse Mountain — la mer change de niveau' });
    else opts.push({ id: 'reverse', label: 'Cap sur Grand Line ! (trop tôt ?)', sub: `Il est conseillé de visiter ${L.blueMin} île(s) d'abord`, big: true, early: true });
  } else if (sea === 'paradise' || sea === 'calm') {
    if (S.loc === 'sabaody') {
      if (S.ship.coated) enter(ISLANDS.fishman, { big: true, label: 'Plonger vers l\'Île des Hommes-Poissons', sub: 'Sous la Red Line, vers le Nouveau Monde' });
      else opts.push({ id: 'fishman', label: 'Île des Hommes-Poissons', sub: 'Il faut faire enrober le navire (coating) au chantier naval', locked: true });
      enter(ISLANDS.marygeoise, { big: true, label: camp === 'gardien' ? 'Monter à Marie Geoise' : 'Infiltrer Marie Geoise', sub: camp === 'gardien' ? 'La Terre Sainte, puis le Nouveau Monde' : 'Très risqué. Par la Red Line, vers le Nouveau Monde', danger: camp !== 'gardien' });
    } else {
      forkOpts();
      if (nv('sabaody') && ((S.seaVisits.paradise || 0) + (S.seaVisits.calm || 0) >= L.paraMin || !ahead.length)) enter(ISLANDS.sabaody, { big: true, sub: 'Dernière étape avant la Red Line' });
      else if (!nv('sabaody')) {
        if (S.ship.coated) enter(ISLANDS.fishman, { big: true, label: 'Plonger vers l\'Île des Hommes-Poissons', sub: 'Vers le Nouveau Monde' });
        enter(ISLANDS.marygeoise, { big: true, label: camp === 'gardien' ? 'Monter à Marie Geoise' : 'Infiltrer Marie Geoise', sub: 'Vers le Nouveau Monde', danger: camp !== 'gardien' });
      }
    }
  } else if (sea === 'redline' || sea === 'nw' || sea === 'laughtale') {
    forkOpts();
    if (sea === 'nw' && S.pone.length >= 4 && canReadPone(S)) enter(ISLANDS.laughtale, { big: true, label: 'Cap sur Laugh Tale', sub: 'Les quatre relevés indiquent la route' });
    else if (sea === 'nw' && S.pone.length >= 4) opts.push({ id: 'laughtale', label: 'Laugh Tale', sub: 'Personne ne sait lire les Poneglyphes à bord (archéologue requis)', locked: true });
    if (!opts.some(o => !o.locked)) {
      // route épuisée : on reprend les îles restantes, sinon n'importe quelle île de la mer
      let rest = islandsOf('nw', S.era).filter(i => nv(i.id) && !i.noNav);
      if (!rest.length) rest = islandsOf('nw', S.era).filter(i => i.id !== S.loc && !i.noNav);
      rest.slice(0, 2).forEach(i => enter(i));
    }
  }
  return opts;
}

export function chooseDestination(S, id) {
  if (S.phase !== 'nav') return false;
  const opt = navOptions(S).find(o => o.id === id);
  if (!opt || opt.locked) return false;
  S.next = id;
  S.arrivedForced = !!opt.forced;
  S.forcedNext = null;
  S.phase = 'voyage';
  return true;
}

// appelé après l'animation de voyage
export function afterVoyage(S) {
  const dest = ISLANDS[S.next];
  const tierDest = SEAS[dest.sea].tier;
  const p = (dest.id === 'impeldown' || dest.id === 'laughtale' ? 0 : [0, 0.3, 0.42, 0.5, 0][tierDest]) * (shipBonus(S, 'lookout') ? 0.65 : 1);
  if (chance(S, p)) {
    const saveLoc = S.loc;
    // les événements de mer se basent sur la mer de destination
    S.loc = S.next;
    const ev = pickEvent(S, 'sea');
    S.loc = saveLoc;
    if (ev) { S.cur = ev; S.ctx = 'sea'; S.phase = 'event'; S.seaLoc = S.next; return; }
  }
  arrive(S, S.next);
}

export function arrive(S, id) {
  const isl = ISLANDS[id];
  const L = LENGTHS[S.length];
  const prevSea = ISLANDS[S.loc].sea;
  S.loc = id;
  S.next = null;
  { const key = routeKeyOf(isl.sea), idx = (ROUTES[key] || []).filter(x => !ISLANDS[x].era || ISLANDS[x].era === S.era).indexOf(id);
    if (idx >= 0 && !S.arrivedForced) (S.routePos ||= {})[key] = Math.max(S.routePos?.[key] ?? -1, idx);
    S.arrivedForced = false; }
  if (!S.visited.includes(id)) S.visited.push(id);
  S.seaVisits[isl.sea] = (S.seaVisits[isl.sea] || 0) + 1;
  S.turn++;
  S.hero.age = Math.round((S.hero.age + L.age) * 100) / 100;
  // progression
  const gate = { reverse: 1, sabaody: 2, fishman: 2, marygeoise: 2, laughtale: 8 }[id];
  if (gate) S.progress = Math.max(S.progress, gate);
  if (SEAS[isl.sea].tier >= 2) S.progress = Math.max(S.progress, 1);
  if (isl.sea === 'nw') S.progress = Math.max(S.progress, 3);
  if (prevSea !== isl.sea) log(S, `${SEAS[isl.sea].emoji} Entrée en ${SEAS[isl.sea].name}.`, 'big');
  log(S, `⚓ Arrivée : ${isl.name}.`, 'nav');
  if (campOf(S) === 'gardien') { const sal = Math.round(TIER_PRIME[SEAS[isl.sea].tier] / 15 * (1 + rankIdxOf(S) / 3)); S.hero.berrys += sal; log(S, `Solde : +${fmtPrime(sal)}.`, 'info'); }
  // repos naturel
  const doc = S.crew.some(c => c.role === 'medecin');
  S.hero.hp = Math.min(S.hero.hpMax, S.hero.hp + 10 + (doc ? 10 : 0));
  if (S.flags.wounded && (doc || S.hero.hp >= S.hero.hpMax * 0.6)) { delete S.flags.wounded; log(S, doc ? 'Le médecin de bord a soigné tes blessures graves.' : 'Tes blessures graves ont cicatrisé.', 'info'); }
  if (S.crew.some(c => c.role === 'charpentier')) S.ship.hp = Math.min(shipMaxHp(S), S.ship.hp + 15);
  // effets du navire à chaque escale
  if (shipBonus(S, 'heal')) S.hero.hp = Math.min(S.hero.hpMax, S.hero.hp + shipBonus(S, 'heal'));
  if (shipBonus(S, 'morale')) S.morale = clamp(S.morale + shipBonus(S, 'morale'), 0, 100);
  if (shipBonus(S, 'income')) { const g = Math.round(TIER_PRIME[SEAS[isl.sea].tier] * shipBonus(S, 'income')); S.hero.berrys += g; log(S, `Commerce à bord : +${fmtPrime(g)}.`, 'info'); }
  // la loyauté baisse si le moral est bas
  if (S.morale < 30) for (const c of S.crew) c.loyalty = Math.max(0, c.loyalty - 5);
  S.inEscale = false;
  postUpdate(S, []);
  startIsland(S);
}

// ───────────── escale ─────────────
export const shipAvailable = S => ISLANDS[S.loc].svc?.includes('ship') || S.crew.some(c => c.role === 'charpentier');
// une amélioration du navire est-elle à ta portée ?
export function shipUpgradeReady(S) {
  const next = Object.values(SHIP_MODELS).filter(m => m.tier === S.ship.tier + 1);
  if (next.some(m => S.hero.berrys >= modelPrice(S, m.id))) return 'model';
  const cheapest = Object.keys(SHIP_MODS).filter(id => !S.ship.mods.includes(id)).map(id => modPrice(S, id)).sort((a, b) => a - b)[0];
  if (cheapest && S.hero.berrys >= cheapest) return 'mod';
  if (S.ship.hp < shipMaxHp(S) * 0.7) return 'repair';
  return null;
}

export function serviceActions(S) {
  const isl = ISLANDS[S.loc];
  const svc = new Set(isl.svc || []);
  const camp = campOf(S);
  const acts = [];
  if (svc.has('tavern') || isl.pop >= 2 || S.crew.length < 3) acts.push({ id: 'tavern', emoji: '🍺', label: 'Taverne', sub: S.crew.length >= 10 ? 'Équipage complet : recruter pour ta flotte' : 'Recruter' });
  if (svc.has('market') || svc.has('forge')) acts.push({ id: 'market', emoji: '🛒', label: svc.has('market') ? 'Marché' : 'Forge', sub: svc.has('market') ? 'Fruits, armes' : 'Armes' });
  acts.push({ id: 'job', emoji: '💼', label: 'Gagner des berrys', sub: 'Port, prime, commerce, casino' });
  if (svc.has('marinebase') && camp === 'gardien') acts.push({ id: 'report', emoji: '📋', label: 'Rapport à la base', sub: 'Solde, soins, mérite' });
  if (svc.has('govbase') && camp === 'gardien') acts.push({ id: 'report', emoji: '📋', label: 'Rapport au Gouvernement', sub: 'Solde, mérite' });
  if (svc.has('marinebase') && camp === 'chercheur') acts.push({ id: 'raid', emoji: '💥', label: 'Attaquer la base Marine', sub: 'Gros risque, grosse prime' });
  acts.push({ id: 'news', emoji: '📰', label: 'Lire le journal', sub: 'Rumeurs et nouvelles' });
  return acts;
}

export function escaleActions(S) {
  const isl = ISLANDS[S.loc];
  const svc = new Set(isl.svc || []);
  const out = [];
  // le chantier naval ne consomme jamais d'action : on peut améliorer son navire à chaque escale
  if (svc.has('ship')) { const up = shipUpgradeReady(S); out.push({ id: 'ship', free: true, emoji: '🔨', label: 'Chantier naval', sub: up === 'model' ? '⬆️ Un nouveau navire est à ta portée !' : up === 'mod' ? '⬆️ Un aménagement est à ta portée' : up === 'repair' ? '🔧 Ta coque a besoin de soins' : 'Navires, aménagements, apparence (gratuit)', badge: !!up }); }
  else if (S.crew.some(c => c.role === 'charpentier')) out.push({ id: 'ship', free: true, emoji: '🔧', label: 'Atelier du charpentier', sub: 'Réparer, aménager, décorer (gratuit)', badge: shipUpgradeReady(S) === 'repair' });
  if (S.actionsLeft <= 0) return out;
  const main = [
    { id: 'train', emoji: '🏋️', label: 'S\'entraîner', sub: svc.has('dojo') ? 'Dojo sur place : progrès doublés' : 'Améliore une caractéristique' },
    { id: 'rest', emoji: '🍖', label: 'Festin et repos', sub: 'Soigne, remonte le moral' },
    { id: 'explore', emoji: '🗺️', label: 'Explorer l\'île', sub: 'Un nouvel événement' },
    { id: 'services', emoji: '🏪', label: 'Services du port', sub: 'Taverne, marché, boulots, rapport...' },
  ];
  const fr = friendHere(S);
  if (fr && S.favorTurn !== S.turn) main.push({ id: 'favor', emoji: fr.emoji, label: `Faveur : ${fr.name}`, sub: grel(S, fr.id) >= 6 ? 'Tes alliés t\'aident (soins, navire, berrys)' : 'Tes amis te donnent un coup de main' });
  return [...main, ...out];
}

export function genShop(S) {
  const isl = ISLANDS[S.loc], tier = tierOf(S);
  const svc = new Set(isl.svc || []);
  const shop = { fruits: [], weapons: [] };
  if (svc.has('market')) {
    const nF = 1 + (tier >= 2 ? 1 : 0) + (isl.pop >= 3 ? 1 : 0) + (chance(S, 0.5) ? 1 : 0);
    for (let i = 0; i < nF; i++) { const id = chance(S, 0.2) ? 'smile' : randomFruit(S, Math.min(5, tier + 1)); if (id && !shop.fruits.includes(id)) shop.fruits.push(id); }
  }
  const nW = svc.has('forge') ? 4 : 2;
  for (let i = 0; i < nW; i++) { const id = randomWeapon(S, Math.min(5, tier + (svc.has('forge') ? 1 : 0))); if (!shop.weapons.includes(id)) shop.weapons.push(id); }
  return shop;
}

export function tavernCandidates(S) {
  const c = [genCrew(S, {}), genCrew(S, { tier: tierOf(S) + 1 })];
  if (ISLANDS[S.loc].pop >= 3 && chance(S, 0.5)) c.splice(1, 0, genCrew(S, {}));
  return c;
}
export const recruitPrice = (S, c) => price(S, c.power * 90_000 * tierOf(S) ** 2 * (S.crew.length < 2 ? 0.6 : 1) * (1 + Math.max(0, S.crew.length - 4) * 0.25));
// chance de convaincre : facile pour un petit équipage, plus dur pour les fortes têtes
export const recruitChance = (S, c) => Math.min(0.95, checkChance(S, { s: 'charisme', d: (c.power - tierOf(S) * 3) / 2 + (S.crew.length - 2) * 3 }) + (S.hero.isCaptain ? 0.05 : 0));

export function doAction(S, id, arg) {
  const chips = [];
  const isl = ISLANDS[S.loc], tier = tierOf(S);
  const svc = new Set(isl.svc || []);
  let text = '';
  switch (id) {
    case 'train': {
      const stat = arg;
      // rendements décroissants : plus la caractéristique est haute, plus elle est dure à monter
      const tries = svc.has('dojo') ? 2 : 1;
      let n = 0;
      for (let k = 0; k < tries; k++) if (chance(S, clamp((17 - S.hero.stats[stat] - n) / 12, 0.1, 0.85))) n++;
      if (n) applyEff(S, { stats: { [stat]: n } }, chips);
      else chips.push({ t: 'Aucun progrès cette fois', k: 'info' });
      text = svc.has('dojo') ? 'Le dojo local te pousse dans tes retranchements.' : 'Tu t\'entraînes sur le pont, jour et nuit.';
      if (tier >= 2 && chance(S, 0.05 + S.hero.stats.volonte * 0.004)) {
        const k = S.hero.haki.obs <= S.hero.haki.arm ? 'obs' : 'arm';
        if (S.hero.haki[k] < 3) { applyEff(S, { haki: { [k]: 1 } }, chips); text += ' Soudain, tu sens quelque chose de nouveau... le Haki !'; }
      }
      break;
    }
    case 'rest': {
      const cook = S.crew.some(c => c.role === 'cuisinier') || S.inventory.items.includes('recette_sanji');
      applyEff(S, { hp: 40 + (cook ? 25 : 0), morale: 12 + (cook ? 8 : 0), loyalty: 3 }, chips);
      if (S.flags.wounded) { delete S.flags.wounded; chips.push({ t: '🩹 Blessures soignées', k: 'good' }); }
      if (S.crew.some(c => c.role === 'charpentier')) applyEff(S, { shipHp: 30 }, chips);
      text = cook ? 'Ton cuisinier prépare un festin légendaire. Tout le monde chante.' : 'Un festin improvisé et une bonne nuit de sommeil.';
      break;
    }
    case 'favor': {
      const fr = friendHere(S);
      if (!fr) break;
      S.favorTurn = S.turn;
      const ally = grel(S, fr.id) >= 6;
      applyEff(S, { hp: ally ? 999 : 40, shipHp: ally ? 999 : 50, berrys: TIER_PRIME[tier] / (ally ? 3 : 8), morale: 10 }, chips);
      if (ally && S.flags.wounded) { delete S.flags.wounded; chips.push({ t: '🩹 Blessures soignées', k: 'good' }); }
      text = ally ? `${fr.name} te reçoit comme l'un des siens : soins, réparations et une bourse bien remplie.` : `${fr.name} te donne un coup de main : un repas, quelques planches, un peu d'argent.`;
      break;
    }
    case 'job': {
      const tp = TIER_PRIME[tier];
      if (arg === 'port') { applyEff(S, { berrys: tp / 10, stats: chance(S, 0.3) ? { force: 1 } : {} }, chips); text = 'Tu décharges des caisses toute la journée. Mal au dos, mais payé.'; }
      if (arg === 'prime') {
        const p = checkChance(S, { s: 'combat', d: 0 });
        if (chance(S, p)) { applyEff(S, { berrys: tp / 2.5, glory: 1 }, chips); text = 'Un petit pirate recherché dans le coin : tu le livres à la Marine et touches la prime.'; }
        else { applyEff(S, { hp: -20 }, chips); text = 'Ta cible se défend mieux que prévu. Tu repars bredouille et cabossé.'; S.deathCause = `Tué en chassant une prime à ${isl.name}`; }
      }
      if (arg === 'casino') {
        const stake = Math.min(S.hero.berrys, tp / 3);
        if (chance(S, 0.45)) { applyEff(S, { berrys: stake * 1.5 }, chips); text = 'La chance te sourit : la table est à toi.'; }
        else { applyEff(S, { berrys: -stake }, chips); text = 'Le croupier sourit. Toi, moins.'; }
      }
      if (arg === 'commerce') {
        const p = checkChance(S, { s: 'charisme', d: -2 });
        const gain = tp / 4 * (1 + shipBonus(S, 'income') * 5);
        if (chance(S, p)) { applyEff(S, { berrys: gain }, chips); text = 'Tu revends ta cargaison au meilleur prix. Belle affaire.'; }
        else { applyEff(S, { berrys: gain / 4 }, chips); text = 'Les marchands du coin sont coriaces. Petit bénéfice quand même.'; }
      }
      break;
    }
    case 'report': {
      const sal = TIER_PRIME[tier] / 6 * (1 + rankIdxOf(S) / 3);
      applyEff(S, { berrys: sal, merit: 3, hp: 30 }, chips);
      text = 'Ton rapport est accepté. Solde versée, infirmerie, félicitations du supérieur.';
      break;
    }
    case 'news': {
      const rumors = [
        [() => !S.flags.knows_skypiea, 'On raconte qu\'un courant marin, le Knock Up Stream, propulse les navires jusqu\'aux îles du ciel.', { flag: 'knows_skypiea' }],
        [() => tier >= 2 && S.pone.length < 4, 'Les Poneglyphes routiers seraient à Zou, Totto Land, Wano... et le dernier, peut-être, à Elbaf ou entre les mains d\'un Empereur.', { stats: { intel: 1 } }],
        [() => !canReadPone(S), 'Seuls les archéologues d\'Ohara savaient lire les Poneglyphes. Il paraît que certains ont survécu.', { stats: { intel: 1 } }],
        [() => true, 'Les primes du jour : ton nom n\'y est pas. Ou si, en petit.', { morale: 3 }],
        [() => tier >= 2, 'Il paraît que le Haki s\'éveille dans les situations désespérées. Ou chez un bon maître.', { stats: { volonte: 1 } }],
        [() => true, 'Morgans annonce un tirage spécial : « Qui sera le prochain Roi des Pirates ? »', { morale: 5 }],
      ].filter(r => r[0]());
      const r = pick(S, rumors);
      applyEff(S, r[2], chips);
      text = r[1];
      break;
    }
    case 'raid': {
      const p = checkChance(S, { s: 'combat', d: 4 });
      if (chance(S, p)) { applyEff(S, { glory: 6, berrys: TIER_PRIME[tier] / 3, weapon: 'random' + Math.min(5, tier + 1) }, chips); text = 'La base tombe. Tu pilles l\'armurerie et le coffre. Ta prime va exploser.'; }
      else { applyEff(S, { hp: -45, glory: 2 }, chips); text = 'Les canons de la base te repoussent. Tu fuis en laissant du sang sur les quais.'; S.deathCause = `Abattu en attaquant la base Marine de ${isl.name}`; }
      break;
    }
  }
  S.actionsLeft--;
  return { text, chips };
}

export function buy(S, kind, id) {
  const chips = [];
  const discount = S.loc === 'water7' ? 0.7 : 1;
  if (kind === 'fruit') { const p = price(S, fruitPrice(FRUITS[id])); if (S.hero.berrys < p) return null; S.hero.berrys -= p; S.inventory.fruits.push(id); chips.push({ t: `🍇 Acheté : ${FRUITS[id].name}`, k: 'epic' }); }
  if (kind === 'weapon') { const p = price(S, weaponPrice(WEAPONS[id])); if (S.hero.berrys < p) return null; S.hero.berrys -= p; applyEff(S, { weapon: id }, chips); }
  if (kind === 'repair') { const max = shipMaxHp(S); const p = Math.round((max - S.ship.hp) * 20_000 * tierOf(S)); if (S.hero.berrys < p) return null; S.hero.berrys -= p; S.ship.hp = max; chips.push({ t: '🔨 Navire réparé', k: 'good' }); }
  if (kind === 'model') { const m = SHIP_MODELS[id]; if (!m || m.tier < S.ship.tier || m.tier > S.ship.tier + 1 || id === S.ship.model) return null; const p = modelPrice(S, id); if (S.hero.berrys < p) return null; S.hero.berrys -= p; setShip(S, id, chips); }
  if (kind === 'mod') { if (!SHIP_MODS[id] || S.ship.mods.includes(id)) return null; const p = modPrice(S, id); if (S.hero.berrys < p) return null; S.hero.berrys -= p; S.ship.mods.push(id); if (SHIP_MODS[id].bonus.hp) S.ship.hp += SHIP_MODS[id].bonus.hp; chips.push({ t: `${SHIP_MODS[id].emoji} ${SHIP_MODS[id].name} installé(e)`, k: 'epic' }); }
  if (kind === 'figure') { const p = 1_000_000; if (!FIGUREHEADS[id] || S.hero.berrys < p) return null; S.hero.berrys -= p; S.ship.figure = id; S.morale = clamp(S.morale + 5, 0, 100); chips.push({ t: `${FIGUREHEADS[id].emoji} Figure de proue : ${FIGUREHEADS[id].name}`, k: 'good' }); }
  if (kind === 'sail') { const p = 300_000; if (!SAIL_COLORS[id] || S.hero.berrys < p) return null; S.hero.berrys -= p; S.ship.sail = id; chips.push({ t: `Voiles : ${id}`, k: 'good' }); }
  if (kind === 'upgrade') { const nt = S.ship.tier + 1; if (nt > 5) return null; const p = Math.round(SHIPS[nt - 1].price * discount); if (S.hero.berrys < p) return null; S.hero.berrys -= p; applyEff(S, { ship: { tier: nt } }, chips); }
  if (kind === 'coating') { const p = 3_000_000; if (S.hero.berrys < p) return null; S.hero.berrys -= p; applyEff(S, { ship: { coated: true } }, chips); }
  if (kind === 'recruit') {
    const c = id; const p = recruitPrice(S, c);
    if (S.hero.berrys < p) return null;
    S.hero.berrys -= p;
    if (S.crew.length < 10) { S.crew.push(c); chips.push({ t: `${c.emoji} Recrue : ${c.name}`, k: 'epic' }); log(S, `${c.name} (${ROLES[c.role].name}) rejoint ${FACTIONS[S.hero.faction].crewLabel.toLowerCase()}.`, 'crew'); }
    else { S.fleet.push({ name: `Équipage de ${c.name}`, power: Math.ceil(c.power / 3) }); chips.push({ t: `⛵ Flotte : équipage de ${c.name}`, k: 'epic' }); }
  }
  postUpdate(S, chips);
  return chips;
}

export function convinceRecruit(S, c) {
  const p = recruitChance(S, c);
  const ok = chance(S, p);
  const chips = [];
  if (ok) {
    if (S.crew.length < 10) { S.crew.push(c); chips.push({ t: `${c.emoji} Recrue : ${c.name}`, k: 'epic' }); log(S, `${c.name} (${ROLES[c.role].name}) rejoint ${FACTIONS[S.hero.faction].crewLabel.toLowerCase()}.`, 'crew'); }
    else { S.fleet.push({ name: `Équipage de ${c.name}`, power: Math.ceil(c.power / 3) }); chips.push({ t: `⛵ Flotte : équipage de ${c.name}`, k: 'epic' }); }
  } else chips.push({ t: `${c.name} refuse`, k: 'bad' });
  postUpdate(S, chips);
  return { ok, chips };
}

export function startExplore(S) {
  S.actionsLeft--;
  const ev = pickEvent(S, 'island', true);
  if (!ev) return false;
  S.cur = ev;
  S.phase = 'event';
  return true;
}

// ───────────── fin de partie ─────────────
const GRADES = ['F', 'E', 'D', 'C', 'B', 'B+', 'A', 'A+', 'S', 'S+'];

export function finish(S, kind, cause) {
  const h = S.hero;
  S.endCamp = campOf(S);
  S.endSea = ISLANDS[S.loc].sea;
  const li = levelIdxOf(S);
  S.levelIdx = Math.max(S.levelIdx || 0, li);
  const lv = LEVELS[S.levelIdx];
  const rank = rankName(S);
  const camp = S.endCamp;
  let title, epitaph;
  const age = Math.floor(h.age);
  if (kind === 'death') { title = 'Mort'; epitaph = `${cause}, à ${age} ans.`; }
  else if (kind === 'prison') { title = 'Prisonnier à vie'; epitaph = `Oublié au Niveau 6 d'Impel Down à ${age} ans.`; }
  else if (kind === 'onepiece') {
    if (camp === 'chercheur') { title = S.hero.faction === 'revo' ? 'Libérateur du monde' : 'Roi des Pirates'; epitaph = S.flags.ending_reveal ? `A révélé la vérité du Siècle Oublié au monde, à ${age} ans.` : S.flags.ending_secret ? `Roi des Pirates à ${age} ans. N'a jamais dit ce qu'il a trouvé.` : `Roi des Pirates à ${age} ans. A ri, comme Roger.`; }
    else if (S.flags.ending_imu) { title = 'Main d\'Im'; epitaph = `A remis le One Piece à Im en personne, à ${age} ans. Son nom est désormais effacé de toutes les mémoires.`; }
    else { title = 'Gardien du Siècle Oublié'; epitaph = S.flags.ending_destroy ? `A détruit le One Piece à ${age} ans. Le monde ne saura jamais.` : `A scellé le One Piece à ${age} ans. Im connaît son nom.`; }
  } else if (kind === 'rangee') {
    title = 'Une vie bien rangée';
    const R = [
      `A quitté la mer à ${age} ans pour ouvrir un bar à ${ISLANDS[S.loc].name}. Ne parle jamais de son passé.`,
      `S'est retiré à ${age} ans pour élever des chèvres, comme Sengoku.`,
      `Est devenu pêcheur à ${ISLANDS[h.origin].name} à ${age} ans. Il regarde parfois l'horizon trop longtemps.`,
      `A ouvert une école de navigation à ${age} ans. Ses élèves ne le croient pas quand il raconte ses aventures.`,
      `A épousé quelqu'un de bien à ${age} ans et a rangé ${h.weapon ? 'son arme' : 'ses poings'} au grenier.`,
      `Est devenu cuisinier sur un ferry à ${age} ans. On dit qu'il frappe les clients qui gaspillent.`,
    ];
    epitaph = R[Math.floor(rnd(S) * R.length)];
  } else if (kind === 'retire') { title = 'Retraite anticipée'; epitaph = `A raccroché à ${age} ans pour ouvrir un bar à ${ISLANDS[S.loc].name}.`; }
  else { title = S.progress >= 4 ? 'Légende des mers' : 'Fin de l\'aventure'; epitaph = `Sa légende s'arrête à ${age} ans, ${S.progress >= 3 ? 'quelque part dans le Nouveau Monde' : 'loin du One Piece'}.`; }
  // comparaison canon
  const cands = CANON_CAREERS.map(c => ({ c, d: Math.abs(c.p - S.progress) * 1.5 + Math.abs(c.l - S.levelIdx) + (c.camp !== camp ? 4 : 0) + ((c.f === 'revo') !== (h.faction === 'revo') ? 2.5 : 0) }));
  cands.sort((a, b) => a.d - b.d);
  const like = cands[Math.floor(rnd(S) * Math.min(2, cands.length))].c;
  const mult = { death: 0.6, prison: 0.7, rangee: 0.8, retire: 0.9 }[kind] ?? 1;
  const score = Math.round(mult * (S.progress * 1000 + Math.log10(h.bounty + 1) * 40 + S.levelIdx * 120 + rankIdxOf(S) * 40 + S.crew.length * 15 + S.pone.length * 100 + (kind === 'death' || kind === 'prison' ? 0 : 200)));
  S.ending = { kind, title, cause, epitaph, grade: GRADES[S.progress], score, like, level: lv, rank, progressLabel: require_PROGRESS(camp)[S.progress] };
  // objectifs
  if (S.daily) { const g = DAILY_GOALS.find(g => g.id === S.daily.goal); S.challengeOk = !!g?.test(S); }
  if (S.legend) {
    const L = LEGENDS.find(l => l.id === S.legend), t = L.target;
    S.challengeOk = (t.progress === undefined || S.progress >= t.progress) && (t.faction === undefined || S.hero.faction === t.faction) && (t.rank === undefined || rankIdxOf(S) >= t.rank) && !(S.legend === 'ace' && kind === 'death');
  }
  S.ending.badges = BADGES.filter(b => { try { return b.test(S); } catch { return false; } }).map(b => b.id);
  S.phase = 'end';
  log(S, `🏁 ${title}. ${epitaph}`, 'big');
  return S.ending;
}
const require_PROGRESS = camp => PROGRESS[camp];

export function shareText(S) {
  const h = S.hero, E = S.ending;
  const f = h.fruit ? FRUITS[h.fruit.id].name : 'Aucun fruit';
  const haki = ['obs', 'arm', 'roi'].filter(k => h.haki[k]).map(k => ({ obs: '👁️', arm: '🛡️', roi: '👑' }[k])).join('') || '—';
  const hls = [...new Set(S.hl)].slice(-3);
  const lines = [
    `🏴‍☠️ DESTINY ONE PIECE${S.daily ? ' · Défi du ' + S.daily.date : ''}${S.legend ? ' · Histoire : ' + LEGENDS.find(l => l.id === S.legend).name : ''}`,
    `${h.emoji} ${h.name} (${raceOf(S).name}) — ${FACTIONS[h.faction].emoji} ${E.rank}`,
    `${E.level.emoji} Niveau ${E.level.name} · 💰 ${h.bounty ? fmtPrime(h.bounty) : 'Pas de prime'}`,
    `🗺️ ${E.progressLabel} (${S.progress}/9) · 🏝️ ${S.visited.length} îles · 👥 ${S.crew.length}`,
    `🍇 ${f} · Haki ${haki}`,
    `⚰️ ${E.epitaph}`,
    ...hls.map(x => `• ${x}`),
    `🪞 Carrière à la ${E.like.n}`,
    `Note : ${E.grade}${S.challengeOk !== undefined && (S.daily || S.legend) ? (S.challengeOk ? ' · ✅ Défi réussi' : ' · ❌ Défi raté') : ''}`,
  ];
  if (S.duelCode) lines.push(`⚔️ Duel : ${S.duelCode}`);
  lines.push('#DestinyOnePiece');
  return lines.join('\n');
}

// ───────────── Défi du jour & Duel ─────────────
export function todayStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function dailySetup(date) {
  const T = { rng: hashStr('destiny-one-piece-' + date) };
  const faction = pick(T, ['pirate', 'pirate', 'marine', 'revo', 'gouv', 'chasseur']);
  const sea = wpick(T, ['east', 'north', 'west', 'south', 'paradise', 'nw'], s => ({ east: 4, north: 2, west: 1, south: 1, paradise: 2, nw: 1 }[s]));
  const START = { east: ['fuchsia', 'goa', 'shells', 'sirop', 'cocoyasi', 'loguetown', 'shimotsuki', 'oykot'], north: ['flevance', 'swallow', 'spidermiles', 'lvneel', 'germa'], west: ['ohara', 'godvalley'], south: ['baterilla', 'sorbet'], paradise: ['whisky', 'drum', 'alabasta', 'jaya', 'water7', 'sabaody'], nw: ['dressrosa', 'wano', 'elbaf', 'sphinx', 'prodence', 'lodestar'] };
  const island = pick(T, START[sea]);
  const roles = Object.keys(ROLES).filter(r => faction === 'pirate' || r !== 'capitaine' || true);
  const role = pick(T, roles);
  const stats = { force: 3, vitesse: 3, intel: 3, charisme: 3, navigation: 3, volonte: 3 };
  for (let i = 0; i < 12; i++) { const k = pick(T, Object.keys(stats)); if (stats[k] < 10) stats[k]++; else i--; }
  const camp = FACTIONS[faction].camp;
  const goals = DAILY_GOALS.filter(g => !g.camp || g.camp === camp);
  const goal = pick(T, goals).id;
  const race = faction === 'chevalier' || chance(T, 0.45) ? 'humain' : pick(T, Object.keys(RACES).filter(r => r !== 'humain'));
  return { date, faction, sea, island, role, stats, race, era: pick(T, ['pre', 'post']), length: 'rapide', seed: hashStr('seed-' + date), goal };
}

const b64e = s => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64d = s => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));
const STAT_KEYS = ['force', 'vitesse', 'intel', 'charisme', 'navigation', 'volonte'];

export function duelEncode(o) {
  const p = [o.seed.toString(36), o.faction, o.role, o.island, o.era, o.length, STAT_KEYS.map(k => o.stats[k]).join('.'), o.race || 'humain'].join('~');
  return 'OP-' + b64e(p);
}
export function duelDecode(code) {
  try {
    const [seed, faction, role, island, era, length, st, race] = b64d(code.trim().replace(/^OP-/i, '')).split('~');
    const v = st.split('.').map(Number);
    if (!FACTIONS[faction] || !ROLES[role] || !ISLANDS[island] || !LENGTHS[length] || v.length !== 6) return null;
    return { seed: parseInt(seed, 36), faction, role, island, era: era === 'post' ? 'post' : 'pre', length, stats: Object.fromEntries(STAT_KEYS.map((k, i) => [k, v[i]])), race: RACES[race] ? race : 'humain' };
  } catch { return null; }
}

// ───────────── au bord de la mort : mourir ou ranger les voiles ─────────────
export function checkFatal(S) {
  if (!S.fatal) return false;
  const cause = S.fatal.cause;
  S.fatal = null;
  const doc = S.crew.some(c => c.role === 'medecin');
  const p = Math.max(0.08, Math.min(0.6, 0.2 + S.hero.stats.volonte * 0.015 + (doc ? 0.12 : 0)) * 0.75 ** S.deathSaves);
  S.cur = { gen: {
    id: 'fatal', emoji: '💀', title: 'Au bord du gouffre',
    x: `Tu es à terre. Le sang, le sel, le bruit lointain de ton équipage qui crie ton nom. Encore un coup et c'est fini (${cause.toLowerCase()}). Une petite voix te souffle qu'il existe une autre vie : une maison, un jardin, des journées sans canons.`,
    ch: [
      { t: 'Ranger les voiles : choisir une vie bien rangée', r: { x: 'Tu lâches prise. Ton équipage te ramène à terre. Tu ne reprendras jamais la mer. Ta légende s\'arrête là, mais toi, tu vis.', e: { end: 'rangee' } } },
      ...submitChoices(S),
      { t: 'Se relever une dernière fois', p, ok: { x: 'Tu te relèves. Personne ne comprend comment. Toi non plus. Mais tu es debout.', e: { hpSet: 15, hl: 's\'est relevé alors qu\'il était déjà mort' } }, ko: { x: 'Tu essaies. Ton corps refuse.', e: { death: cause } } },
    ],
  } };
  S.phase = 'event';
  return true;
}

// se soumettre pour survivre (temporairement : on peut reprendre sa liberté plus tard)
function submitChoices(S) {
  const out = [];
  const camp = campOf(S), fac = S.hero.faction;
  if (camp === 'chercheur' && fac !== 'vassal' && fac !== 'empereur' && tierOf(S) >= 2 && !S.flags.submitted) {
    const ys = YONKO[S.era];
    const y = [...ys].sort((a, b) => grel(S, groupOfYonko(b.id, S.era)) - grel(S, groupOfYonko(a.id, S.era)))[0];
    out.push({ t: `Se soumettre à ${y.name} pour survivre`, r: { x: `Tu plantes le drapeau de ${y.name} sur ton mât. Ses hommes te ramassent, ses médecins te recousent. Tu es en vie... et tu as un maître. Pour l'instant.`, e: { yonko: y.id, hpSet: 60, heal: true, morale: -20, flag: 'submitted', hl: `s'est soumis à ${y.name} pour survivre` } } });
  }
  if (camp === 'chercheur' && S.era === 'pre' && fac !== 'corsaire' && S.hero.bounty >= 30_000_000 && !S.flags.was_corsaire) {
    out.push({ t: 'Accepter de devenir Corsaire (laisse du Gouvernement)', r: { x: 'Un agent du Gouvernement s\'agenouille à côté de toi. « Signez, et on vous soigne. » Tu signes. Tu es Corsaire. Ta liberté a un prix.', e: { faction: 'corsaire', hpSet: 60, heal: true, morale: -15, flag: 'was_corsaire', hl: 'est devenu Corsaire pour sauver sa peau' } } });
  }
  if (camp === 'gardien') {
    const n = S.evacs || 0;
    out.push({ t: `Appeler une évacuation d'urgence${n ? ' (encore ?)' : ''}`, p: Math.max(0.1, 0.75 - n * 0.3), ok: { x: 'Un navire de secours te récupère à temps. Tu survis, mais ton dossier en prend un coup.', e: { hpSet: 50, heal: true, merit: -10 - n * 10, morale: -15, evac: true } }, ko: { x: 'Les secours arrivent trop tard.', e: { death: 'Mort en attendant une évacuation qui n\'est jamais venue' } } });
  }
  return out;
}
