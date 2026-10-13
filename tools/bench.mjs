// Banc d'essai d'équilibrage : simule des centaines de parties (profils prudent / moyen / téméraire).
// Usage : node tools/bench.mjs <prudent|moyen|temeraire> <rapide|saga> [parties] [full]
// À relancer après chaque import massif de données ou de nouveaux événements.
import * as G from '../js/engine.js';
import { START_ISLANDS, ISLANDS, SEAS } from '../js/data/islands.js';
import { FRUITS, WEAPONS, SHIP_MODELS } from '../js/data/items.js';
const [arch = 'prudent', len = 'rapide', N = 300, mode = 'sum'] = process.argv.slice(2);
let rs = 777; const r = () => (rs = (rs * 1103515245 + 12345) % 2147483648) / 2147483648;
const pk = a => a[Math.floor(r() * a.length)];
const FACS = ['pirate', 'pirate', 'pirate', 'marine', 'gouv', 'revo', 'chasseur', 'chevalier'];
const RACES = ['humain', 'humain', 'hommepoisson', 'sirene', 'mink', 'geant', 'longbras', 'longjambes', 'troisyeux', 'lunarien', 'tontatta'];
const out = []; const evStat = {}; let errors = 0;
for (let g = 0; g < +N; g++) {
  const fac = pk(FACS), race = fac === 'chevalier' ? 'humain' : pk(RACES);
  const sea = fac === 'chevalier' ? 'redline' : (r() < 0.8 ? pk(['east', 'east', 'north', 'west', 'south']) : pk(['paradise', 'nw']));
  const st = { force: 3, vitesse: 3, intel: 3, charisme: 3, navigation: 3, volonte: 3 };
  const pri = arch === 'temeraire' ? ['force', 'force', 'vitesse'] : ['force', 'volonte', 'charisme', 'intel'];
  for (let i = 0; i < 12; i++) { const k = r() < 0.6 ? pk(pri) : pk(Object.keys(st)); if (st[k] < 10) st[k]++; else i--; }
  const S = G.newGame({ seed: g * 9973 + 11, length: len, era: r() < 0.5 ? 'pre' : 'post', faction: fac, race, role: pk(['capitaine', 'capitaine', 'bretteur', 'navigateur', 'medecin', 'combattant', 'archeologue']), island: pk(START_ISLANDS[sea]), stats: st });
  const ISLANDS_SHIP = S => G.serviceActions(S).some(a => a.id === 'market');
  let steps = 0, nwTurn = null, fruitsSeen = new Set(), maxCrew = 0;
  try {
    while (S.phase !== 'end' && steps++ < 4000) {
      if (S.phase === 'event') {
        const ev = G.curEvent(S);
        const cs = G.choicesOf(S, ev).filter(c => !c.locked);
        let c;
        if (ev.id === 'fatal') {
          const up = cs.find(x => x.label.startsWith('Se relever'));
          const sub = cs.find(x => /soumettre|Corsaire|évacuation/.test(x.label));
          c = arch === 'temeraire' ? up : (sub || (up.p > 0.45 ? up : cs[0]));
        } else if (arch === 'prudent') c = [...cs].sort((a, b) => b.p - a.p)[0];
        else if (arch === 'moyen') c = r() < 0.7 ? [...cs].sort((a, b) => b.p - a.p)[0] : pk(cs);
        else c = pk(cs);
        const before = S.hero.hp;
        G.resolveChoice(S, c.i);
        const e = (evStat[ev.id] ||= { n: 0, fail: 0, dmg: 0, tier: G.tierOf(S) });
        e.n++; if (S.result.ok === false) e.fail++; e.dmg += Math.max(0, before - S.hero.hp);
      } else if (S.phase === 'result') G.afterResult(S);
      else if (S.phase === 'escale') {
        if (S.actionsLeft <= 0) { G.leaveIsland(S); continue; }
        const acts = [...G.escaleActions(S), ...G.serviceActions(S)].map(a => a.id);
        if (arch !== 'temeraire' && (S.flags.wounded || S.hero.hp < S.hero.hpMax * 0.45)) { G.doAction(S, 'rest'); }
        else if (acts.includes('favor') && arch !== 'temeraire') G.doAction(S, 'favor');
        else if (acts.includes('market') && r() < 0.5) {
          const sh = G.genShop(S);
          for (const f of sh.fruits) if (!S.hero.fruit && !S.inventory.fruits.length && S.hero.berrys > G.price(S, 0) + 1 && r() < 0.8) G.buy(S, 'fruit', f);
          for (const w of sh.weapons) if (!S.hero.weapon || WEAPONS[w].tier > WEAPONS[S.hero.weapon].tier) G.buy(S, 'weapon', w);
          S.actionsLeft--;
        } else if (ISLANDS_SHIP(S) && r() < 0.4) {
          const nxt = Object.values(SHIP_MODELS).filter(m => m.tier === S.ship.tier + 1);
          if (nxt.length) G.buy(S, 'model', pk(nxt).id);
          if (!S.ship.coated && G.tierOf(S) >= 2) G.buy(S, 'coating');
          G.buy(S, 'mod', pk(['canons', 'coque', 'voiles', 'infirmerie', 'cuisine']));
          S.actionsLeft--;
        } else if (acts.includes('tavern') && S.crew.length < (arch === 'prudent' ? 8 : 5) && r() < 0.6) {
          for (const c of G.tavernCandidates(S)) G.convinceRecruit(S, c); S.actionsLeft--;
        } else if (acts.includes('job') && r() < 0.3) G.doAction(S, 'job', pk(['port', 'prime', 'commerce']));
        else if (r() < 0.3 && G.startExplore(S)) {}
        else G.doAction(S, 'rest');
        if (S.inventory.fruits.length && !S.hero.fruit && arch !== 'prudent' || (S.inventory.fruits.length && !S.hero.fruit && FRUITS[S.inventory.fruits[0]].tier >= 3)) G.eatFruit(S, 0);
        if (S.pendingEnd) G.finish(S, S.pendingEnd.kind, S.pendingEnd.cause); else G.checkFatal(S);
      } else if (S.phase === 'nav') {
        const o = G.navOptions(S).filter(o => !o.locked && (arch === 'temeraire' || !o.early));
        const pone = o.find(x => ISLANDS[x.id].pone && !S.pone.includes(ISLANDS[x.id].pone) || x.id === 'laughtale');
        const big = o.find(x => x.big);
        const pickO = (arch !== 'moyen' || r() < 0.6) && pone ? pone : (big && r() < (len === 'saga' ? 0.3 : 0.55) ? big : pk(o));
        G.chooseDestination(S, pickO.id);
      } else if (S.phase === 'voyage') G.afterVoyage(S);
      for (const f of S.inventory.fruits) fruitsSeen.add(f);
      if (S.hero.fruit) fruitsSeen.add(S.hero.fruit.id);
      maxCrew = Math.max(maxCrew, S.crew.length);
      if (nwTurn === null && S.progress >= 3) nwTurn = S.turn;
    }
    if (S.phase !== 'end') throw new Error('stuck ' + S.phase);
    out.push({ fac, race, camp: S.endCamp, kind: S.ending.kind, prog: S.progress, lvl: S.levelIdx, bounty: S.hero.bounty, berrys: S.hero.berrys, fruits: fruitsSeen.size, ate: !!S.hero.fruit, crew: maxCrew, turn: S.turn, nwTurn, rank: S.rankIdx, combat: G.combatRating(S) });
  } catch (e) { errors++; if (errors < 4) console.log('ERR', e.message); }
}
const pct = (a, f) => Math.round(a.filter(f).length / a.length * 100);
const med = (a, f) => { const v = a.map(f).sort((x, y) => x - y); return v[v.length >> 1]; };
const line = (name, a) => `${name.padEnd(13)} n=${String(a.length).padStart(3)} mort ${String(pct(a, x => x.kind === 'death')).padStart(2)}% prison ${String(pct(a, x => x.kind === 'prison')).padStart(2)}% rangée ${String(pct(a, x => x.kind === 'rangee')).padStart(2)}% OP ${String(pct(a, x => x.kind === 'onepiece')).padStart(2)}% | prog méd ${med(a, x => x.prog)} NW ${pct(a, x => x.prog >= 3)}% pone≥1 ${pct(a, x => x.prog >= 4)}% LT ${pct(a, x => x.prog >= 8)}% | niv méd ${med(a, x => x.lvl)} RDP ${pct(a, x => x.lvl >= 9)}% | combat ${med(a, x => Math.round(x.combat))} | tours ${med(a, x => x.turn)}`;
console.log(`== ${arch} / ${len} (${out.length} parties, ${errors} erreurs)`);
console.log(line('TOUS', out));
if (mode === 'full') {
  for (const c of ['chercheur', 'gardien']) console.log(line(c, out.filter(x => x.camp === c)));
  for (const f of [...new Set(out.map(x => x.fac))]) console.log(line(f, out.filter(x => x.fac === f)));
  for (const rc of [...new Set(out.map(x => x.race))]) console.log(line(rc, out.filter(x => x.race === rc)));
  const pir = out.filter(x => x.fac === 'pirate');
  console.log(`pirates : prime méd ${G.fmtPrime(med(pir, x => x.bounty))} · fruits vus méd ${med(out, x => x.fruits)} · fruit mangé ${pct(out, x => x.ate)}% · équipage max méd ${med(out, x => x.crew)} · berrys fin méd ${G.fmtPrime(med(out, x => x.berrys))} · arrivée NW tour méd ${med(out.filter(x => x.nwTurn !== null), x => x.nwTurn)}`);
  const evs = Object.entries(evStat).filter(([, e]) => e.n >= 15).map(([id, e]) => [id, e.tier, e.n, Math.round(e.fail / e.n * 100), Math.round(e.dmg / e.n)]).sort((a, b) => b[4] - a[4]).slice(0, 12);
  console.log('événements les plus coûteux (id, rang, n, échec%, dégâts moy):'); for (const e of evs) console.log('  ', e.join(' · '));
}
