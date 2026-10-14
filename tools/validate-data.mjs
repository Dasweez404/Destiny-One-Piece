#!/usr/bin/env node
// Vérifie la cohérence de TOUTES les données (écrites à la main + importées), puis joue des parties de test.
// Usage : node tools/validate-data.mjs [--games 200]
import { ISLANDS, SEAS, ROUTES, routeKeyOf } from '../js/data/islands.js';
import { CHARACTERS } from '../js/data/characters.js';
import { GROUPS, groupOfChar } from '../js/data/groups.js';
import * as G from '../js/engine.js';
import * as B from '../js/battle.js';
const games = +(process.argv[process.argv.indexOf('--games') + 1]) || 150;
const errors = [], warns = [];
const err = m => errors.push(m), warn = m => warns.push(m);

for (const [id, i] of Object.entries(ISLANDS)) {
  if (i.id !== id) err(`île ${id} : id incohérent (${i.id})`);
  if (!SEAS[i.sea]) err(`île ${id} : mer inconnue « ${i.sea} »`);
  if (![1, 2, 3].includes(i.pop)) err(`île ${id} : pop invalide (${i.pop})`);
  if (!i.name || !i.desc) err(`île ${id} : nom ou description manquants`);
  if (!i.th?.k) err(`île ${id} : thème 3D manquant`);
  if (i.needsFr) warn(`île ${id} : texte à franciser (needsFr)`);
  const key = routeKeyOf(i.sea);
  if (!i.gate && !i.noNav && !['laughtale', 'redline', 'calm'].includes(i.sea) && !(ROUTES[key] || []).includes(id)) warn(`île ${id} : absente des routes (jamais proposée)`);
}
for (const [key, route] of Object.entries(ROUTES)) for (const id of route) if (!ISLANDS[id]) err(`route ${key} : île inconnue « ${id} »`);
for (const [id, c] of Object.entries(CHARACTERS)) {
  if (typeof c.power !== 'number') err(`personnage ${id} : power invalide`);
  for (const era of ['pre', 'post']) for (const isl of c.isl?.[era] || []) if (!ISLANDS[isl]) err(`personnage ${id} : île inconnue « ${isl} » (${era})`);
  const g = groupOfChar(id, 'pre') ?? groupOfChar(id, 'post');
  if (g && !GROUPS[g]) err(`personnage ${id} : groupe inconnu « ${g} »`);
  if (!g && c.align !== 'neutre') warn(`personnage ${id} : aucun groupe (sa réputation ne comptera pour personne)`);
  if (!(c.isl?.pre?.length || c.isl?.post?.length)) warn(`personnage ${id} : aucune île (on ne le rencontrera jamais)`);
}
console.log(`Îles : ${Object.keys(ISLANDS).length} · Personnages : ${Object.keys(CHARACTERS).length} · Groupes : ${Object.keys(GROUPS).length} · Événements : ${G.ALL_EVENTS.length}`);

// parties de test automatiques : le jeu ne doit jamais planter, quelles que soient les données
let rs = 1; const r = () => (rs = (rs * 1103515245 + 12345) % 2147483648) / 2147483648; const pk = a => a[Math.floor(r() * a.length)];
let crashes = 0; const seenAll = {};
for (let g = 0; g < games; g++) {
  try {
    const S = G.newGame({ seed: g * 7 + 3, length: g % 2 ? 'saga' : 'rapide', era: g % 3 ? 'pre' : 'post', faction: pk(['pirate', 'marine', 'gouv', 'revo', 'chasseur']), role: 'capitaine', island: pk(['fuchsia', 'goa', 'loguetown', 'baterilla']), stats: { force: 6, vitesse: 5, intel: 5, charisme: 5, navigation: 4, volonte: 5 } });
    let steps = 0;
    while (S.phase !== 'end' && steps++ < 4000) {
      if (S.phase === 'event') { const cs = G.choicesOf(S, G.curEvent(S)).filter(c => !c.locked); if (!cs.length) console.log("ALL LOCKED", G.curEvent(S)?.id); G.resolveChoice(S, pk(cs).i); }
      else if (S.phase === 'result') G.afterResult(S);
      else if (S.phase === 'escale') { if (S.actionsLeft > 0) { if (!G.startExplore(S)) G.doAction(S, 'rest'); } else G.leaveIsland(S); if (S.pendingEnd) G.finish(S, S.pendingEnd.kind, S.pendingEnd.cause); else G.checkFatal(S); }
      else if (S.phase === 'nav') { const o = G.navOptions(S).filter(x => !x.locked); G.chooseDestination(S, pk(o).id); }
      else if (S.phase === 'voyage') G.afterVoyage(S);
      else if (S.phase === 'battle') { if (!S.battle) B.initBattle(S); const as = B.battleActs(S).filter(a => a.enabled); B.battleAct(S, as[Math.floor(Math.random() * as.length)].id); }
    }
    if (S.phase !== 'end') throw new Error('partie bloquée en phase ' + S.phase);
    for (const [k, v] of Object.entries(S.seen)) if (/^(gv_|n_|w_|wa_|war_|sh_|isl_)/.test(k)) seenAll[k] = (seenAll[k] || 0) + 1;
  } catch (e) { crashes++; if (crashes < 4) err(`partie ${g} : ${e.message}\n${e.stack.split("\n").slice(1,4).join("\n")}`); }
}
console.log(`${games} parties de test : ${crashes} plantage(s)`);
warns.slice(0, 25).forEach(w => console.log('  ⚠️ ', w)); if (warns.length > 25) console.log(`  ... et ${warns.length - 25} autres avertissements`);
if (process.env.SEEN) console.log(seenAll);
errors.forEach(e => console.log('  ❌', e));
console.log(errors.length ? `\n${errors.length} erreur(s) : ne pas publier.` : '\n✅ Données valides.');
process.exit(errors.length ? 1 : 0);

