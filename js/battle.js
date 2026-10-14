// Batailles tactiques : quelques manches où l'on choisit sa tactique face à l'intention (devinée) de l'ennemi.
// Attaquer bat Feinter, Feinter bat Parer, Parer bat Attaquer. Haki, fruit et alliés offrent des coups spéciaux (une fois par bataille).
// L'état est de la donnée pure (sauvegardable) : le contenu (victoire / défaite) est relu depuis l'événement d'origine.
import { EVENTS, allChoices, navalRating, combatRating, applyEff, view, val, clamp, tierOf, allyGroups, fruitOf, log, interp, rnd, levelIdxOf } from './engine.js';
import { fruitPower } from './data/items.js';

export const TACTICS = {
  A: { name: 'Attaquer', emoji: '⚔️', beats: 'R', tip: 'bat Feinter' },
  G: { name: 'Parer', emoji: '🛡️', beats: 'A', tip: 'bat Attaquer' },
  R: { name: 'Feinter', emoji: '🌀', beats: 'G', tip: 'bat Parer' },
};
const INTENT_TXT = { A: 'préparent une charge', G: 'se mettent en garde', R: 'manœuvrent pour une feinte' };

const base = S => { const ev = EVENTS[S.battleSpec.evId]; return ev ? { ev, c: ev.ch[S.battleSpec.ci] } : { ev: null, c: null }; };
const pickIntent = S => ['A', 'G', 'R'][Math.floor(rnd(S) * 3)];
function hintFor(S, truth) {
  const obs = S.hero.haki.obs;
  const t = tierOf(S);
  const acc = obs >= 1 ? [0.95, 0.9, 0.85, 0.8][t - 1] ?? 0.8 : [0.72, 0.65, 0.6, 0.56][t - 1] ?? 0.55;
  if (rnd(S) < acc) return truth;
  const others = ['A', 'G', 'R'].filter(x => x !== truth);
  return others[Math.floor(rnd(S) * 2)];
}

export function initBattle(S) {
  const sp = S.battleSpec, naval = sp.kind === 'naval';
  const youP = Math.max(5, naval ? navalRating(S) : combatRating(S));
  const tier = tierOf(S);
  // l'ennemi suit le niveau de la mer : doux au début, plus coriace et plus nombreux ensuite ; les coups spéciaux dont tu disposes comptent dans son niveau
  const nSpecial = (S.hero.haki.obs > 0) + (S.hero.haki.arm > 0) + (S.hero.haki.roi > 0) + (fruitOf(S) && fruitOf(S).id !== 'smile' ? 1 : 0) + (S.fleet.length > 0 || allyGroups(S).length > 0 ? 1 : 0);
  const tierF = [1.1, 1.12, 1.2, 1.3][tier - 1] ?? 1.2;
  const foeP = Math.max(5, youP * (0.82 + 0.06 * (sp.d ?? 2)) * tierF * (1 + 0.05 * nSpecial)), youP2 = youP * (1 + (sp.ally || 0));
  const foeMax = [100, 112, 132, 155][tier - 1] ?? 150;
  const { ev } = base(S);
  const intent = pickIntent(S);
  S.battle = {
    title: ev?.title || 'Bataille', emoji: ev?.emoji || '⚔️', kind: sp.kind, foeName: sp.foe || (naval ? 'la flotte ennemie' : 'les troupes ennemies'),
    you: { hp: 100, max: 100, power: youP2 }, foe: { hp: foeMax, max: foeMax, power: foeP },
    round: 1, maxRounds: tier >= 3 ? 6 : 5, intent, hint: hintFor(S, intent), used: {}, last: null, log: [], fruitUsed: false,
  };
  return S.battle;
}

export function battleActs(S) {
  const B = S.battle, h = S.hero, out = [];
  for (const [id, t] of Object.entries(TACTICS)) out.push({ id, emoji: t.emoji, label: t.name, sub: t.tip, kind: 'tac', enabled: true });
  const hk = h.haki, sealed = h.faction === 'chevalier' || (h.pacte || 0) > 0;
  if ((h.pacte || 0) >= 2) out.push({ id: 'pacte', emoji: '⛓️', label: h.pacte >= 3 ? 'Pacte des abysses' : 'Pacte des Profondeurs', sub: 'Force surhumaine (coup renforcé)', kind: 'sp', enabled: !B.used.pacte });
  if (!sealed && hk.roi > 0) out.push({ id: 'roi', emoji: '👑', label: 'Haki des Rois', sub: 'L\'ennemi vacille : il ne riposte pas', kind: 'sp', enabled: !B.used.roi });
  if (!sealed && hk.arm > 0) out.push({ id: 'arm', emoji: '🛡️', label: 'Haki de l\'armement', sub: 'Coup renforcé, à coup sûr', kind: 'sp', enabled: !B.used.arm });
  if (!sealed && hk.obs > 0) out.push({ id: 'obs', emoji: '👁️', label: 'Haki de l\'observation', sub: 'Tu lis son jeu : contre parfait', kind: 'sp', enabled: !B.used.obs });
  const f = fruitOf(S);
  if (f && f.id !== 'smile') out.push({ id: 'fruit', emoji: '🍇', label: f.name, sub: 'Attaque dévastatrice (coûte des PV)', kind: 'sp', enabled: !B.used.fruit });
  if (S.fleet.length > 0 || allyGroups(S).length > 0) out.push({ id: 'allies', emoji: '🤝', label: 'Appeler tes alliés', sub: 'Renforts : soins et salve', kind: 'sp', enabled: !B.used.allies });
  return out;
}

const WIN = {
  naval: ['Ta bordée touche en plein dans le mille !', 'Tu coupes sa route et tes canons parlent.', 'Ta manœuvre te place au bon endroit : salve parfaite.'],
  land: ['Ton coup passe sa garde !', 'Tu profites de l\'ouverture pour frapper fort.', 'Ta tactique fait mouche.'],
};
const LOSE = {
  naval: ['Ils anticipent ta manœuvre : leurs canons te touchent de plein fouet.', 'Tu es pris en tenaille, la coque gémit.', 'Une salve te surprend à découvert.'],
  land: ['Ils lisent ton jeu et te cueillent.', 'Tu te retrouves à découvert : coup sévère.', 'Mauvais pari : on te frappe en retour.'],
};
const TIE = ['Les deux camps se heurtent sans percée.', 'Échange de coups, personne ne cède.', 'Un choc brutal mais indécis.'];
const pickT = (S, a) => a[Math.floor(rnd(S) * a.length)];

export function battleAct(S, act) {
  const B = S.battle; if (!B) return null;
  const naval = B.kind === 'naval';
  let deal = 0, take = 0, text = '', outcome = 'tie';
  const I = B.intent;
  const spec = { roi: ['La pression du Haki des Rois fige l\'ennemi : il ne peut pas riposter !', 1.0, 0], arm: ['Ton Haki de l\'armement noircit ton coup : il frappe de plein fouet !', 1.35, 0.15], obs: ['Ton Haki de l\'observation te souffle chaque geste : contre parfait !', 1.15, 0.05], pacte: ['Ta marque brûle : une force surhumaine qui n\'est pas la tienne déferle !', 1.6, 0.1], fruit: ['Tu déchaînes le pouvoir de ton fruit !', 1.7, 0.5], allies: ['Tes alliés surgissent : salve de renfort et blessés relevés !', 0.8, 0.3] };
  if (spec[act]) {
    if (B.used[act]) return null;
    B.used[act] = true;
    [text, deal, take] = [spec[act][0], spec[act][1], spec[act][2]]; outcome = 'special';
    if (act === 'allies') B.you.hp = Math.min(B.you.max, B.you.hp + 20);
    if (act === 'fruit') B.fruitUsed = true;
  } else {
    const T = TACTICS[act]; if (!T) return null;
    if (T.beats === I) { deal = 1.0; take = 0.15; outcome = 'win'; text = pickT(S, WIN[naval ? 'naval' : 'land']); }
    else if (TACTICS[I].beats === act) { deal = 0.15; take = 1.0; outcome = 'lose'; text = pickT(S, LOSE[naval ? 'naval' : 'land']); }
    else { deal = 0.55; take = 0.55; text = pickT(S, TIE); }
  }
  const rt = clamp(B.you.power / B.foe.power, 0.6, 1.6), rf = clamp(B.foe.power / B.you.power, 0.6, 1.6);
  const dFoe = Math.round(28 * deal * rt * (0.85 + 0.3 * rnd(S)));
  const dYou = Math.round(28 * take * rf * (0.85 + 0.3 * rnd(S)));
  B.foe.hp = Math.max(0, B.foe.hp - dFoe); B.you.hp = Math.max(0, B.you.hp - dYou);
  B.last = { act, intent: I, outcome, text, dFoe, dYou, round: B.round, id: (B.last?.id ?? 0) + 1 };
  B.log.push(`Manche ${B.round} : ${text} (ennemi −${dFoe}${dYou ? ` · toi −${dYou}` : ''})`);
  B.round++;
  if (B.foe.hp <= 0 || B.you.hp <= 0 || B.round > B.maxRounds) return endBattle(S);
  B.intent = pickIntent(S); B.hint = hintFor(S, B.intent);
  return B.last;
}

function endBattle(S) {
  const B = S.battle, V = view(S), tier = tierOf(S);
  const win = B.foe.hp <= 0 || (B.you.hp > 0 && B.foe.hp / B.foe.max < B.you.hp / B.you.max);
  const { ev, c } = base(S);
  const out = c ? (win ? c.ok : c.ko) : null;
  const taken = B.you.max - Math.max(0, B.you.hp);
  const heroLoss = Math.round(taken * 0.16 * (1 + tier * 0.15)) + (B.fruitUsed ? 3 + tier * 2 : 0);
  const shipLoss = B.kind === 'naval' ? Math.round(taken * 0.45) : 0;
  const e = { ...(out?.e || {}) };
  const sum = (k, v) => { e[k] = (typeof e[k] === 'function' ? e[k](V) : e[k] ?? 0) - v; };
  if (heroLoss) sum('hp', heroLoss);
  if (shipLoss) sum('shipHp', shipLoss);
  if (win) e.glory = (typeof e.glory === 'number' ? e.glory : 0) + 1;
  const chips = [];
  S.deathCause = `Tombé au cours de la bataille : ${B.title}`;
  applyEff(S, e, chips, null);
  S.combo = win ? Math.min(5, (S.combo || 0) + 1) : 0;
  const base0 = out ? interp(S, val(out.x, V)) : '';
  const summary = win ? `Victoire ! ${B.foeName.charAt(0).toUpperCase() + B.foeName.slice(1)} plie.` : `Défaite : ${B.foeName} garde le terrain.`;
  S.result = { title: B.title, emoji: B.emoji, choice: 'Bataille', text: `${summary} ${base0}`.trim(), chips, ok: win, p: null, roll: null, stat: null, battle: true, rounds: B.log.slice(), next: null };
  S.lastRes = { title: B.title, emoji: B.emoji, choice: 'Bataille', text: S.result.text, ok: win, turn: S.turn };
  log(S, `⚔️ ${B.title} — bataille ${win ? 'gagnée' : 'perdue'}.`, win ? 'ok' : 'ko');
  if (win) S.hl.push(`a remporté une bataille : ${B.title}`);
  S.battle = null; S.battleSpec = null;
  S.phase = 'result';
  return S.result;
}

// Choix « Livrer bataille » ajouté à un événement à partir de son jet le plus difficile (naval ou combat)
export function battleChoice(ev, ci, kind, d = 2, foe) {
  const b = ev.ch[ci];
  return {
    t: kind === 'naval' ? '⚔️ Livrer bataille (tactique)' : '⚔️ Mener la bataille (tactique)', keep: true,
    r: { x: kind === 'naval' ? 'Les lignes se forment : tes canons contre les leurs. Tu prends le commandement.' : 'Les lignes se heurtent. Tu prends la tête de la bataille.', e: { battle: { evId: ev.id, ci, kind, d, foe } } },
    _base: b,
  };
}
