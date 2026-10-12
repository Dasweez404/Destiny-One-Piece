#!/usr/bin/env node
// Convertit les articles du wiki (tools/cache/**) en données de jeu : js/data/generated.js
//
// Usage :
//   node tools/build-data.mjs                       (lit tools/cache/, écrit js/data/generated.js)
//   node tools/build-data.mjs --from tools/fixtures --out /tmp/test.js
//   node tools/build-data.mjs --report              (n'écrit rien, affiche seulement le bilan)
//
// Les décisions « de goût » (nom, époque, thème 3D, groupe, puissance, place dans la route) se corrigent SANS toucher
// au code dans tools/overrides.json. Voir docs/TUTO_DONNEES.md.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => (x.startsWith('--') ? [...a, [x.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]] : a), []));
const FROM = args.from ? path.resolve(args.from) : path.join(ROOT, 'tools', 'cache');
const OUT = args.out ? path.resolve(args.out) : path.join(ROOT, 'js', 'data', 'generated.js');
const readJson = (f, d) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : d);
const OVR = readJson(path.join(ROOT, 'tools', 'overrides.json'), { islands: {}, characters: {}, skip: [] });
const MAP = readJson(path.join(ROOT, 'tools', 'mapping.json'), {});
const SPINE = Object.fromEntries(Object.entries(readJson(path.join(ROOT, 'tools', 'spine-titles.json'), {})).filter(([k]) => !k.startsWith('_')));

// ───────────── utilitaires de texte ─────────────
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '');
const slug = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const rx = list => (list || []).map(([re, v]) => [new RegExp(re, 'i'), v]);
const firstMatch = (table, text) => { for (const [re, v] of table) if (re.test(text)) return v; return null; };

function stripTemplates(v) {
  v = v.replace(/\{\{\s*Nihongo\s*\|\s*([^|{}]*?)\s*\|[^{}]*\}\}/gi, '$1');
  for (let k = 0; k < 6 && /\{\{[^{}]*\}\}/.test(v); k++) v = v.replace(/\{\{[^{}]*\}\}/g, '');
  return v.replace(/\{\{[\s\S]*$/, '');
}
function clean(v = '', { keepTargets = false } = {}) {
  v = v.replace(/<ref[^>]*\/>/gi, '').replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
  v = stripTemplates(v);
  v = v.replace(/<br\s*\/?>/gi, ' ; ').replace(/<[^>]+>/g, '');
  v = v.replace(/\[\[(?:Fichier|File|Image):[^\]]*\]\]/gi, '');
  v = keepTargets ? v.replace(/\[\[([^\]|]*)\|([^\]]+)\]\]/g, '$2 ($1)').replace(/\[\[([^\]]+)\]\]/g, '$1') : v.replace(/\[\[(?:[^\]|]*\|)?([^\]]+)\]\]/g, '$1');
  v = v.replace(/\s*\([^)]*[\u3000-\u30ff\u4e00-\u9fff\uff00-\uffef][^)]*\)/g, '');   // noms japonais entre parenthèses
  return v.replace(/'{2,}/g, '').replace(/&nbsp;/g, ' ').replace(/\s*;\s*(;\s*)+/g, ' ; ').replace(/\s+/g, ' ').replace(/^[\s,;]+|[\s,;]+$/g, '');
}
const linkTargets = (v = '') => [...v.matchAll(/\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g)].map(m => m[1].trim()).filter(t => !/^(Fichier|File|Image|Catégorie)/i.test(t));

// ───────────── fiche (infobox) ─────────────
function findBox(text, wanted) {
  const re = /\{\{\s*([^|{}\n]*box)\b/gi;
  let m;
  while ((m = re.exec(text))) {
    if (wanted && !new RegExp(wanted, 'i').test(m[1])) continue;
    let depth = 0, i = m.index, end = -1;
    for (; i < text.length; i++) {
      if (text.startsWith('{{', i)) { depth++; i++; } else if (text.startsWith('}}', i)) { depth--; i++; if (depth === 0) { end = i + 1; break; } }
    }
    if (end < 0) continue;
    const body = text.slice(m.index + 2, end - 2);
    const parts = []; let d1 = 0, d2 = 0, cur = '';
    for (let k = 0; k < body.length; k++) {
      const two = body.slice(k, k + 2);
      if (two === '[[') { d1++; cur += two; k++; } else if (two === ']]') { d1--; cur += two; k++; }
      else if (two === '{{') { d2++; cur += two; k++; } else if (two === '}}') { d2--; cur += two; k++; }
      else if (body[k] === '|' && d1 === 0 && d2 === 0) { parts.push(cur); cur = ''; } else cur += body[k];
    }
    parts.push(cur);
    const raw = {};
    for (const p of parts.slice(1)) { const eq = p.indexOf('='); if (eq > 0) raw[p.slice(0, eq).trim().toLowerCase()] = p.slice(eq + 1); }
    return { template: parts[0].trim(), raw, endIndex: end };
  }
  return null;
}
const rawOf = (box, aliases) => { for (const a of aliases || []) if (box?.raw[a] && clean(box.raw[a])) return box.raw[a]; return ''; };
const textOf = (box, aliases, o) => clean(rawOf(box, aliases), o);

function lead(text, afterIdx) {
  const body = text.split('<!-- TEMPLATE -->')[0].slice(afterIdx);
  const para = body.split(/\n\s*\n/).map(p => clean(p.replace(/^[\s*:#=]+/, ''))).find(p => p.length > 40 && !/^(==|\{)/.test(p)) || '';
  const sentences = para.match(/[^.!?]+[.!?]+(\s|$)/g) || [para];
  let out = '';
  for (const s of sentences) { if ((out + s).length > 230) break; out += s; }
  return (out || para).trim().slice(0, 240);
}
const chapterOf = raw => { const nums = [...String(raw).matchAll(/Chapitre\s+(\d+)/gi)].map(m => +m[1]).filter(n => n > 0); return nums.length ? Math.min(...nums) : null; };

function readDir(kind) {
  const dir = path.join(FROM, kind);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.wikitext')).map(f => {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    const get = k => (new RegExp(`<!-- ${k}: (.*?) -->`).exec(raw) || [])[1];
    return { title: get('TITLE') || f.replace(/\.wikitext$/, ''), text: raw, length: +get('LENGTH') || raw.length, seaHint: get('SEA') || null };
  });
}

// ───────────── tables ─────────────
const SEA_RX = rx(MAP.seas), THEME_RX = rx(MAP.themes), GROUP_RX = rx(MAP.groups), RANK_RX = rx(MAP.rankPower);
const F = MAP.fields || {};
const handTitleToId = new Map(Object.entries(SPINE).map(([id, t]) => [norm(t), id]));

// chapitre de première apparition des îles de référence (pour placer les nouvelles îles dans l'ordre de l'histoire)
const SPINE_CH = {};
for (const page of readDir('spine')) {
  const id = [...handTitleToId].find(([n]) => n === norm(page.title))?.[1];
  const box = findBox(page.text, MAP.templates?.islands);
  const ch = chapterOf(rawOf(box, F.first));
  if (id && ch) SPINE_CH[id] = ch;
}

// ───────────── îles ─────────────
function buildIsland(page, pops) {
  const o = OVR.islands[page.title] || {};
  const box = findBox(page.text, MAP.templates?.islands);
  if (!box) return { skip: 'pas de fiche de lieu' };
  const regionTxt = textOf(box, F.region, { keepTargets: true });
  const seaFromRegion = firstMatch(SEA_RX, regionTxt);
  const sea = o.sea || seaFromRegion || page.seaHint || null;
  if (!sea) return { skip: 'mer inconnue' };
  const ch = o.ch ?? chapterOf(rawOf(box, F.first));
  if (!ch && !o.force) return { skip: 'absente du manga (anime / roman / film)' };
  const type = textOf(box, F.type);
  const nameRaw = textOf(box, F.name).split(';')[0].trim();
  const title = /^(n\/a|inconnu|\?+)?$/i.test(nameRaw) ? page.title : nameRaw;
  if (!o.force && !o.name) {
    const flt = MAP.islandFilter;
    const isIsland = new RegExp(flt.typeAllow, 'i').test(type) || new RegExp(flt.nameAllow, 'i').test(title);
    if (!isIsland || new RegExp(flt.nameDeny, 'i').test(title)) return { skip: 'pas une île (lieu interne ou bâtiment)' };
  }
  const low = (type + ' ' + lead(page.text, box.endIndex)).toLowerCase();
  const th = o.th || (() => { const k = firstMatch(THEME_RX, low) || 'village'; return { k, ...(MAP.themeColors?.[k] || MAP.themeColors?.village || { g: 8305770, a: 14194790 }) }; })();
  const name = o.name || title;
  const desc = o.desc || lead(page.text, box.endIndex) || `Un lieu de One Piece (${name}).`;
  const sub = o.sub || type.split(';')[0].slice(0, 44) || SEAS_LABEL[sea] || '';
  const pop = o.pop ?? pops(page.length);
  const svc = o.svc || (pop >= 2 ? ['tavern', 'market', 'rest'] : ['rest']);
  return {
    id: o.id || slug(page.title),
    value: { sea, pop, name, sub, desc, th: { k: th.k, g: th.g, a: th.a }, svc, ch, ...(o.era ? { era: o.era } : {}), ...(o.after ? { after: o.after } : {}), generated: true },
  };
}
const SEAS_LABEL = { east: 'East Blue', north: 'North Blue', west: 'West Blue', south: 'South Blue', paradise: 'Paradis', calm: 'Calm Belt', redline: 'Red Line', nw: 'Nouveau Monde' };

// ───────────── personnages ─────────────
function parseBounty(s) {
  const nums = [...String(s).matchAll(/\d{1,3}(?:[\s .,]\d{3})+|\d+/g)].map(m => +m[0].replace(/[\s .,]/g, ''));
  return nums.length ? Math.max(...nums) : 0;
}
function describe(occ, epithet, page, box) {
  const jobs = occ.split(';').map(x => x.replace(/\s*\(.*?\)\s*/g, '').trim()).filter(Boolean).slice(0, 2).join(', ');
  const nick = epithet && epithet.length > 2 ? ` « ${epithet.replace(/^["«»\s]+|["«»\s]+$/g, '')} »` : '';
  const out = (jobs ? jobs.charAt(0).toUpperCase() + jobs.slice(1) : lead(page.text, box?.endIndex || 0)) + nick;
  return (out || 'Un personnage de One Piece').slice(0, 120).replace(/[.\s]+$/, '') + '.';
}
function buildCharacter(page, islandIndex, islandIdsByTitle) {
  const o = OVR.characters[page.title] || {};
  const box = findBox(page.text, MAP.templates?.characters);
  if (!box && o.power === undefined) return { skip: 'pas de fiche de personnage' };
  const ch = o.ch ?? chapterOf(rawOf(box, F.first));
  if (!ch && !o.force) return { skip: 'absent du manga' };
  if (!o.force && new RegExp(MAP.deadStatus || 'décéd', 'i').test(textOf(box, F.status).split(';')[0])) return { skip: 'décédé' };
  const aff = textOf(box, F.affiliation, { keepTargets: true });
  const occ = textOf(box, F.occupation, { keepTargets: true });
  const affFirst = aff.split(';')[0];
  const group = o.group !== undefined ? o.group : (firstMatch(GROUP_RX, affFirst) || firstMatch(GROUP_RX, aff + ' ' + occ));
  const bounty = parseBounty(textOf(box, F.bounty));
  let power = o.power;
  if (power === undefined) {
    const byRank = firstMatch(RANK_RX, occ + ' ' + affFirst) || 0;
    const byBounty = bounty > 0 ? Math.round(8 + 11 * Math.log10(bounty / 1e6)) : 0;
    power = Math.max(2, Math.min(95, Math.max(byRank, byBounty) || 8));
  }
  const align = o.align || (MAP.alignByGroup || {})[group] || 'neutre';
  // îles : liens de la résidence / origine → île du jeu ou île importée
  const links = [...linkTargets(rawOf(box, F.residence)), ...linkTargets(rawOf(box, F.origin))];
  const linked = [...new Set(links.map(t => islandIdsByTitle.get(norm(t))).filter(Boolean))].filter(id => fits(id, power, islands));
  const terr = era => ((group && GROUP_TERR[group]?.[era]) || []).filter(id => fits(id, power, islands));
  const pre = o.isl?.pre || (linked.length ? linked.slice(0, 3) : terr('pre').slice(-2));
  const postFinal = o.isl?.post || o.isl?.pre || (linked.length ? linked.slice(0, 3) : terr('post').slice(-2));
  const rawName = textOf(box, F.name).split(';')[0].trim();
  const name = o.name || (/^(n\/a|inconnu|\?+)?$/i.test(rawName) ? page.title : rawName);
  const quote = o.quote || clean((/\{\{\s*citation\s*\|\s*1\s*=\s*([^|}]*)/i.exec(page.text) || [])[1] || '').replace(/^["«»\s]+|["«»\s]+$/g, '') || '...';
  const epithet = textOf(box, F.epithet).split(';')[0];
  return {
    id: o.id || slug(page.title),
    value: { id: o.id || slug(page.title), name, emoji: o.emoji || (MAP.groupEmoji || {})[group] || '🧑', align, power, isl: { pre, post: postFinal }, quote: quote.slice(0, 140), desc: o.desc || describe(occ, epithet, page, box), generated: true },
    group,
  };
}

// ───────────── exécution ─────────────
const { ISLANDS: HAND_I } = await import('../js/data/islands.js');
const { CHARACTERS: HAND_C } = await import('../js/data/characters.js');
const { GROUPS } = await import('../js/data/groups.js');
const { SEAS } = await import('../js/data/islands.js');
const MAXPOWER_BY_TIER = { 1: 30, 2: 55, 3: 999 };
const allIslands = id => HAND_I[id] || null;
const fits = (id, power, extra) => { const isl = allIslands(id) || extra[id]; return !isl || power <= MAXPOWER_BY_TIER[SEAS[isl.sea]?.tier || 3]; };
const GROUP_TERR = Object.fromEntries(Object.values(GROUPS).map(g => [g.id, { pre: g.terr.pre || [], post: g.terr.post || [] }]));
const knownIslands = new Set(Object.values(HAND_I).filter(i => !i.generated).flatMap(i => [norm(i.name), norm(i.id)]));
const knownChars = new Set(Object.values(HAND_C).filter(c => !c.generated).flatMap(c => [norm(c.id), ...c.name.split(/[,&]/).map(n => norm(n.replace(/^(sir|dr|docteur|saint)\s/i, '')))]));
const dupIsland = (title, name) => handTitleToId.has(norm(title)) || [title, name].some(t => knownIslands.has(norm(t)));
const dupChar = (title, name) => [title, name.split(',')[0]].some(t => knownChars.has(norm(t)));

const islandPages = readDir('islands').filter(p => !OVR.skip?.includes(p.title));
const lens = islandPages.map(p => p.length).sort((a, b) => a - b);
const q = f => lens[Math.min(lens.length - 1, Math.floor(lens.length * f))] || 0;
const popOf = len => (len >= q(0.88) ? 3 : len >= q(0.55) ? 2 : 1);   // 12 % d'arcs majeurs, 33 % de lieux connus, le reste à peine mentionné

// plancher de chapitre par mer : première apparition d'une île de référence dans cette mer (un lieu simplement mentionné plus tôt ne passe pas devant)
const SEA_FLOOR = {};
for (const [id, ch] of Object.entries(SPINE_CH)) { const sea = HAND_I[id]?.sea; if (sea && !['calm', 'redline', 'laughtale'].includes(sea) && ch > 5) SEA_FLOOR[sea] = Math.min(SEA_FLOOR[sea] ?? 1e9, ch); }
const islands = {}, chars = {}, groups = {}, titleToId = new Map(handTitleToId);
const report = { islands: { ok: 0, skip: {} }, characters: { ok: 0, skip: {} } };
const note = (kind, why, t) => ((report[kind].skip[why] ||= []).push(t));
for (const page of islandPages) {
  const r = buildIsland(page, popOf);
  if (r.skip) { note('islands', r.skip, page.title); continue; }
  if (!OVR.islands[page.title]?.force && dupIsland(page.title, r.value.name)) { note('islands', 'déjà dans le jeu', page.title); continue; }
  if (islands[r.id]) { note('islands', 'doublon', page.title); continue; }
  if (SEA_FLOOR[r.value.sea] && r.value.ch < SEA_FLOOR[r.value.sea] && !['east'].includes(r.value.sea)) r.value.ch = SEA_FLOOR[r.value.sea] + (r.value.ch % 7) / 10;
  islands[r.id] = r.value; titleToId.set(norm(page.title), r.id); report.islands.ok++;
}
for (const page of readDir('characters').filter(p => !OVR.skip?.includes(p.title))) {
  const r = buildCharacter(page, null, titleToId);
  if (r.skip) { note('characters', r.skip, page.title); continue; }
  if (!OVR.characters[page.title]?.force && dupChar(page.title, r.value.name)) { note('characters', 'déjà dans le jeu', page.title); continue; }
  if (chars[r.id]) { note('characters', 'doublon', page.title); continue; }
  chars[r.id] = r.value; if (r.group) groups[r.id] = r.group; report.characters.ok++;
}

const show = (kind, label) => {
  console.log(`${label} : ${report[kind].ok} convertis`);
  for (const [why, list] of Object.entries(report[kind].skip)) console.log(`   ignorés (${why}) : ${list.length}${list.length <= 6 ? ' → ' + list.join(', ') : ' → ' + list.slice(0, 5).join(', ') + '…'}`);
};
show('islands', 'Îles'); show('characters', 'Personnages');
const bySea = {}; Object.values(islands).forEach(i => { bySea[i.sea] = (bySea[i.sea] || 0) + 1; });
console.log('Îles par mer :', JSON.stringify(bySea), '· popularité :', JSON.stringify([1, 2, 3].map(p => Object.values(islands).filter(i => i.pop === p).length)));
const noIsl = Object.values(chars).filter(c => !c.isl.pre.length && !c.isl.post.length).length;
console.log(`Personnages sans île (jamais rencontrés) : ${noIsl}/${Object.keys(chars).length}`);

if (!args.report) {
  const j = o => JSON.stringify(o, null, 1);
  fs.writeFileSync(OUT, `// GÉNÉRÉ par tools/build-data.mjs le ${new Date().toISOString().slice(0, 10)} — ne pas modifier à la main.\n// Corrections : tools/overrides.json. Source des faits : One Piece Encyclopédie (wiki Fandom francophone), texte sous licence CC BY-SA 3.0.\n// ch = chapitre de première apparition (sert à ordonner les routes).\nexport const EXTRA_ISLANDS = ${j(Object.fromEntries(Object.entries(islands).map(([id, v]) => [id, { id, ...v }])))};\nexport const EXTRA_CHARACTERS = ${j(chars)};\nexport const EXTRA_GROUPS = ${j(groups)};\nexport const SPINE_CH = ${j(SPINE_CH)};\n`);
  console.log('Écrit :', path.relative(process.cwd(), OUT));
}
