#!/usr/bin/env node
// Convertit les articles du wiki (tools/cache/**) en données de jeu : js/data/generated.js
//
// Usage :
//   node tools/build-data.mjs                       (lit tools/cache/, écrit js/data/generated.js)
//   node tools/build-data.mjs --from tools/fixtures --out /tmp/test.js
//   node tools/build-data.mjs --report              (n'écrit rien, affiche seulement le bilan)
//
// Les décisions « de goût » (nom français, époque, thème 3D, groupe, puissance) peuvent être corrigées
// SANS toucher au code dans tools/overrides.json. Voir docs/TUTO_DONNEES.md.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => (x.startsWith('--') ? [...a, [x.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]] : a), []));
const FROM = args.from ? path.resolve(args.from) : path.join(ROOT, 'tools', 'cache');
const OUT = args.out ? path.resolve(args.out) : path.join(ROOT, 'js', 'data', 'generated.js');
const overridesPath = path.join(ROOT, 'tools', 'overrides.json');
const OVR = fs.existsSync(overridesPath) ? JSON.parse(fs.readFileSync(overridesPath, 'utf8')) : { islands: {}, characters: {}, skip: [] };
const MAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools', 'mapping.json'), 'utf8'));

// ───────────── analyse du wikitext ─────────────
function clean(v = '') {
  return v
    .replace(/<ref[^>]*\/>/gi, '').replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '')
    .replace(/<br\s*\/?>/gi, ', ').replace(/<[^>]+>/g, '')
    .replace(/\{\{[^{}]*\}\}/g, '').replace(/\{\{[^{}]*\}\}/g, '')
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]+)\]\]/g, '$1')
    .replace(/'{2,}/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').replace(/^[\s,;]+|[\s,;]+$/g, '');
}

function findInfobox(text) {
  const m = /\{\{\s*([^|{}\n]*infobox[^|{}\n]*)/i.exec(text);
  if (!m) return null;
  let depth = 0, i = m.index, end = -1;
  for (; i < text.length; i++) {
    if (text.startsWith('{{', i)) { depth++; i++; }
    else if (text.startsWith('}}', i)) { depth--; i++; if (depth === 0) { end = i + 1; break; } }
  }
  if (end < 0) return null;
  const body = text.slice(m.index + 2, end - 2);
  // découpe sur les « | » de premier niveau (hors [[ ]] et {{ }})
  const parts = []; let d1 = 0, d2 = 0, cur = '';
  for (let k = 0; k < body.length; k++) {
    const two = body.slice(k, k + 2);
    if (two === '[[') { d1++; cur += two; k++; } else if (two === ']]') { d1--; cur += two; k++; }
    else if (two === '{{') { d2++; cur += two; k++; } else if (two === '}}') { d2--; cur += two; k++; }
    else if (body[k] === '|' && d1 === 0 && d2 === 0) { parts.push(cur); cur = ''; } else cur += body[k];
  }
  parts.push(cur);
  const fields = {};
  for (const p of parts.slice(1)) {
    const eq = p.indexOf('=');
    if (eq > 0) fields[p.slice(0, eq).trim().toLowerCase()] = clean(p.slice(eq + 1));
  }
  return { template: parts[0].trim(), fields, endIndex: end };
}

const pick = (fields, aliases) => { for (const a of aliases) if (fields[a]) return fields[a]; return ''; };
const lead = (text, after) => clean(text.slice(after).split(/\n==/)[0].split('\n').filter(l => l.trim() && !l.startsWith('{') && !l.startsWith('|') && !l.startsWith('[[File')).slice(0, 3).join(' ')).slice(0, 220);
const slug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const rx = list => list.map(([re, v]) => [new RegExp(re, 'i'), v]);
const firstMatch = (table, text) => { for (const [re, v] of table) if (re.test(text)) return v; return null; };

function readDir(kind) {
  const dir = path.join(FROM, kind);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.wikitext')).map(f => {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    const title = (/<!-- TITLE: (.*?) -->/.exec(raw) || [, f.replace(/\.wikitext$/, '')])[1];
    return { title, text: raw };
  });
}

// ───────────── îles ─────────────
const SEA_RX = rx(MAP.seas);
const THEME_RX = rx(MAP.themes);
function buildIsland({ title, text }) {
  const ib = findInfobox(text);
  const f = ib?.fields || {};
  const o = OVR.islands[title] || {};
  const region = pick(f, MAP.fields.region) + ' ' + pick(f, MAP.fields.affiliation);
  let sea = o.sea || firstMatch(SEA_RX, region) || firstMatch(SEA_RX, text.slice(0, 2500));
  if (!sea) return { skip: 'mer inconnue' };
  const low = text.toLowerCase();
  const size = text.length, arcs = (low.match(/\barc\b/g) || []).length;
  const pop = o.pop ?? (size > 14000 || arcs >= 6 ? 3 : size > 4500 ? 2 : 1);
  const th = o.th || (() => { const k = firstMatch(THEME_RX, low.slice(0, 6000)) || 'village'; return { k, ...(MAP.themeColors[k] || MAP.themeColors.village) }; })();
  const name = o.name || (pick(f, MAP.fields.englishName) || title).replace(/\s*\(.*?\)\s*/g, '').trim();
  const desc = o.desc || lead(text, ib?.endIndex || 0) || `Une île de One Piece (${title}).`;
  const sub = o.sub || (pick(f, MAP.fields.region) || '').split(',')[0].slice(0, 40) || sea;
  const svc = o.svc || (pop >= 2 ? ['tavern', 'market', 'rest'] : ['rest']);
  return {
    id: o.id || slug(title),
    value: { sea, pop, name, sub, desc, th: { k: th.k, g: th.g, a: th.a }, svc, ...(o.era ? { era: o.era } : {}), ...(o.after ? { after: o.after } : {}), ...(o.gate ? { gate: true } : {}), generated: true, ...(o.needsFr === false ? {} : { needsFr: !o.name && !o.desc }) },
  };
}

// ───────────── personnages ─────────────
const GROUP_RX = rx(MAP.groups);
const ALIGN_BY_GROUP = MAP.alignByGroup;
const RANK_POWER = rx(MAP.rankPower);
function parseBounty(s) { const m = /([\d][\d,. ]*)/.exec(s.replace(/\s/g, '')); return m ? +m[1].replace(/[,. ]/g, '') : 0; }
function buildCharacter({ title, text }, islandIds) {
  const ib = findInfobox(text);
  const f = ib?.fields || {};
  const o = OVR.characters[title] || {};
  if (!ib && !o.power) return { skip: 'pas de fiche' };
  const aff = pick(f, MAP.fields.affiliation) + ' ' + pick(f, MAP.fields.occupation);
  const group = o.group !== undefined ? o.group : firstMatch(GROUP_RX, aff);
  const bounty = parseBounty(pick(f, MAP.fields.bounty));
  let power = o.power;
  if (power === undefined) {
    const byRank = firstMatch(RANK_POWER, aff);
    const byBounty = bounty > 0 ? Math.round(8 + 11 * Math.log10(bounty / 1e6)) : 0;
    power = Math.max(byRank || 0, byBounty) || 8;
    power = Math.max(2, Math.min(95, power));
  }
  const align = o.align || ALIGN_BY_GROUP[group] || 'neutre';
  const where = (pick(f, MAP.fields.origin) + ' ' + pick(f, MAP.fields.residence)).toLowerCase();
  const isl = o.isl || { pre: islandIds.filter(id => where.includes(id.replace(/_/g, ' '))).slice(0, 3), post: [] };
  if (!o.isl) isl.post = isl.pre;
  const name = o.name || (pick(f, MAP.fields.englishName) || title).replace(/\s*\(.*?\)\s*/g, '').trim();
  return {
    id: o.id || slug(title),
    value: { id: o.id || slug(title), name, emoji: o.emoji || MAP.groupEmoji[group] || '🧑', align, power, isl, quote: o.quote || '...', desc: o.desc || (pick(f, MAP.fields.occupation) || 'Un personnage de One Piece.').slice(0, 140), generated: true },
    group,
  };
}

// ───────────── doublons avec les données déjà dans le jeu ─────────────
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '');
const { ISLANDS: HAND_I } = await import('../js/data/islands.js');
const { CHARACTERS: HAND_C } = await import('../js/data/characters.js');
const knownIslands = new Set(Object.values(HAND_I).filter(i => !i.generated).flatMap(i => [norm(i.name), norm(i.id)]));
const knownChars = new Set(Object.values(HAND_C).filter(c => !c.generated).flatMap(c => [norm(c.id), ...c.name.split(/[,&]/).map(n => norm(n.replace(/^(sir|dr|docteur|saint)\s/i, '')))]));
const dupIsland = (title, name) => [title, name].some(t => knownIslands.has(norm(t)));
const dupChar = (title, name) => [title, name.split(',')[0]].some(t => knownChars.has(norm(t)));

// ───────────── exécution ─────────────
const islands = {}, chars = {}, groups = {}; const report = { islands: { ok: 0, skip: [] }, characters: { ok: 0, skip: [] } };
for (const page of readDir('islands')) {
  if (OVR.skip?.includes(page.title)) continue;
  const r = buildIsland(page);
  if (!r.skip && !OVR.islands[page.title]?.force && dupIsland(page.title, r.value.name)) r.skip = 'déjà dans le jeu';
  if (r.skip) { report.islands.skip.push(`${page.title} (${r.skip})`); continue; }
  if (islands[r.id]) { report.islands.skip.push(`${page.title} (doublon de ${r.id})`); continue; }
  islands[r.id] = r.value; report.islands.ok++;
}
for (const page of readDir('characters')) {
  if (OVR.skip?.includes(page.title)) continue;
  const r = buildCharacter(page, Object.keys(islands));
  if (!r.skip && !OVR.characters[page.title]?.force && dupChar(page.title, r.value.name)) r.skip = 'déjà dans le jeu';
  if (r.skip) { report.characters.skip.push(`${page.title} (${r.skip})`); continue; }
  if (chars[r.id]) { report.characters.skip.push(`${page.title} (doublon de ${r.id})`); continue; }
  chars[r.id] = r.value; if (r.group) groups[r.id] = r.group; report.characters.ok++;
}

console.log(`Îles : ${report.islands.ok} converties, ${report.islands.skip.length} ignorées`);
report.islands.skip.slice(0, 15).forEach(s => console.log('   ignorée :', s));
console.log(`Personnages : ${report.characters.ok} convertis, ${report.characters.skip.length} ignorés`);
report.characters.skip.slice(0, 15).forEach(s => console.log('   ignoré :', s));
const todoFr = Object.values(islands).filter(i => i.needsFr).length;
if (todoFr) console.log(`À franciser : ${todoFr} îles (voir « Étape 5 » du tutoriel).`);

if (!args.report) {
  const j = o => JSON.stringify(o, null, 2);
  fs.writeFileSync(OUT, `// GÉNÉRÉ par tools/build-data.mjs le ${new Date().toISOString().slice(0, 10)} — ne pas modifier à la main.\n// Corrections : tools/overrides.json. Source des faits : One Piece Wiki (Fandom), texte sous licence CC BY-SA 3.0.\nexport const EXTRA_ISLANDS = ${j(islands)};\nexport const EXTRA_CHARACTERS = ${j(chars)};\nexport const EXTRA_GROUPS = ${j(groups)};\n`);
  console.log('Écrit :', path.relative(process.cwd(), OUT));
}
