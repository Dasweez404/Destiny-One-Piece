#!/usr/bin/env node
// Télécharge l'introduction (section 0 : fiche + premier paragraphe) des articles du wiki One Piece (API MediaWiki)
// dans tools/cache/<type>/ : un fichier .wikitext par article. Wiki par défaut : One Piece Encyclopédie (français).
//
// Usage :
//   node tools/fetch-wiki.mjs --all                         (tout ce qui est décrit dans tools/sources.json + les îles de référence)
//   node tools/fetch-wiki.mjs --category "Catégorie:Villes" --kind islands --sea east --depth 1
//   node tools/fetch-wiki.mjs --pages "Alabasta,Zou" --kind islands
//   node tools/fetch-wiki.mjs --list-categories "Catégorie:Lieux"
//
// Le script est poli : 1 requête/seconde, 25 articles par lot, reprise automatique (cache).
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// Node n'utilise pas le proxy de l'environnement sans cette variable (nécessaire dans l'environnement cloud)
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const r = spawnSync(process.execPath, [...process.argv.slice(1)], { stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1', NODE_NO_WARNINGS: '1' } });
  process.exit(r.status ?? 1);
}

const HERE = path.dirname(new URL(import.meta.url).pathname);
const SOURCES = JSON.parse(fs.readFileSync(path.join(HERE, 'sources.json'), 'utf8'));
const API = process.env.OP_WIKI_API || SOURCES.api;
const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => (x.startsWith('--') ? [...a, [x.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]] : a), []));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const UA = 'DestinyOnePiece-DataImport/1.0 (projet de jeu de fan non commercial ; contact via le dépôt GitHub)';
const fileName = t => t.replace(/[^\w\-. ]+/g, '_') + '.wikitext';

async function api(params) {
  const url = API + '?' + new URLSearchParams({ format: 'json', formatversion: '2', ...params });
  for (let t = 0; t < 5; t++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      if (res.ok) return await res.json();
      if (res.status === 429 || res.status >= 500) { await sleep(2500 * 2 ** t); continue; }
      throw new Error(`HTTP ${res.status}`);
    } catch (e) { if (t === 4) throw e; await sleep(1500 * 2 ** t); }
  }
}

async function members(cat, type) {
  const out = []; let cont;
  do {
    const r = await api({ action: 'query', list: 'categorymembers', cmtitle: cat, cmlimit: '500', cmtype: type, ...(cont ? { cmcontinue: cont } : {}) });
    out.push(...r.query.categorymembers.map(m => m.title));
    cont = r.continue?.cmcontinue;
    await sleep(700);
  } while (cont);
  return out;
}
async function collect(cat, depth, seen = new Set()) {
  if (seen.has(cat)) return [];
  seen.add(cat);
  let pages = await members(cat, 'page');
  if (depth > 0) for (const sub of await members(cat, 'subcat')) pages = pages.concat(await collect(sub, depth - 1, seen));
  return [...new Set(pages)];
}

const hasBox = t => /\{\{\s*[^|{}\n]*box\b/i.test(t);
// modèles « sans paramètre » cités au début de l'article ({{Zoro}}) : candidats à une fiche séparée
const IGNORED_TPL = /^(spoil|citation|onglets|pagesbloquées|ébauche|ébauche|à? ?vérifier|infobox|manga-anime|nihongo|qref|portail|dablink|homonymie|redirection|navbox)/i;
const simpleTemplates = t => [...t.slice(0, 1500).matchAll(/\{\{\s*([^|{}\n#]{2,60}?)\s*\}\}/g)].map(m => m[1].trim()).filter(n => !IGNORED_TPL.test(n));
async function download(titles, kind, hints = {}) {
  const dir = path.join(HERE, 'cache', kind);
  fs.mkdirSync(dir, { recursive: true });
  titles = titles.filter(t => !/^(Catégorie|Fichier|Modèle|Utilisateur|Discussion|Aide|Category|File|Template):/.test(t));
  const todo = titles.filter(t => !fs.existsSync(path.join(dir, fileName(t))));
  console.log(`  ${kind} : ${titles.length} articles, ${todo.length} à télécharger`);
  for (let i = 0; i < todo.length; i += 25) {
    const batch = todo.slice(i, i + 25);
    const r = await api({ action: 'query', prop: 'revisions|info', rvprop: 'content', rvslots: 'main', rvsection: '0', titles: batch.join('|'), redirects: '1' });
    const pages = (r.query.pages || []).filter(p => !p.missing);
    // fiches séparées : « {{Nom}} » dans l'intro sans boîte → on récupère « Modèle:Nom »
    const cands = {};
    for (const p of pages) { const t = p.revisions?.[0]?.slots?.main?.content || ''; if (t && !hasBox(t)) cands[p.title] = simpleTemplates(t); }
    const names = [...new Set(Object.values(cands).flat())];
    const bodies = {};
    for (let k = 0; k < names.length; k += 40) {
      const tr = await api({ action: 'query', prop: 'revisions', rvprop: 'content', rvslots: 'main', titles: names.slice(k, k + 40).map(n => 'Modèle:' + n).join('|'), redirects: '1' });
      for (const p of tr.query.pages || []) { const c = p.revisions?.[0]?.slots?.main?.content || ''; if (hasBox(c)) bodies[p.title.replace(/^Modèle:/, '').toLowerCase()] = c; }
      for (const rd of tr.query.redirects || []) { const to = bodies[rd.to.replace(/^Modèle:/, '').toLowerCase()]; if (to) bodies[rd.from.replace(/^Modèle:/, '').toLowerCase()] = to; }
      await sleep(700);
    }
    const tpl = {};
    for (const [title, list] of Object.entries(cands)) { const hit = list.find(n => bodies[n.toLowerCase()]); if (hit) tpl[title] = bodies[hit.toLowerCase()]; }
    for (const p of pages) {
      let text = p.revisions?.[0]?.slots?.main?.content;
      if (!text) continue;
      if (/^#(REDIRECTION|REDIRECT)/i.test(text.trim())) continue;
      if (tpl[p.title]) text += `\n<!-- TEMPLATE -->\n${tpl[p.title]}`;
      const hint = hints[p.title] || hints[batch.find(b => b.toLowerCase() === p.title.toLowerCase())] || '';
      fs.writeFileSync(path.join(dir, fileName(p.title)), `<!-- TITLE: ${p.title} -->\n<!-- LENGTH: ${p.length || 0} -->\n${hint ? `<!-- SEA: ${hint} -->\n` : ''}${text}`);
    }
    console.log(`    ${Math.min(i + 25, todo.length)}/${todo.length}`);
    await sleep(800);
  }
}

async function main() {
  if (args['list-categories']) {
    const subs = await members(args['list-categories'], 'subcat');
    console.log(`${subs.length} sous-catégories de ${args['list-categories']} :\n` + subs.join('\n'));
    return;
  }
  if (args.all) {
    for (const kind of ['islands', 'characters']) {
      const hints = {}; const all = [];
      for (const s of SOURCES[kind]) {
        console.log(`Catégorie ${s.category} (profondeur ${s.depth || 0})`);
        const pages = await collect(s.category, s.depth || 0);
        pages.forEach(p => { if (s.sea && !hints[p]) hints[p] = s.sea; });
        all.push(...pages);
      }
      await download([...new Set(all)], kind, hints);
    }
    // îles de référence (écrites à la main) : utiles pour l'ordre chronologique et le rattachement des personnages
    const spine = Object.entries(JSON.parse(fs.readFileSync(path.join(HERE, 'spine-titles.json'), 'utf8'))).filter(([k]) => !k.startsWith('_')).map(([, v]) => v);
    await download(spine, 'spine');
    console.log('Terminé. Étape suivante : node tools/build-data.mjs');
    return;
  }
  const kind = args.kind || 'islands';
  let titles = [];
  const hints = {};
  if (args.pages) titles = String(args.pages).split(',').map(s => s.trim()).filter(Boolean);
  else if (args.category) { titles = await collect(args.category, +(args.depth || 0)); if (args.sea) titles.forEach(t => (hints[t] = args.sea)); }
  else { console.error('Il faut --all, --category, --pages ou --list-categories (voir l\'en-tête du script).'); process.exit(1); }
  await download(titles, kind, hints);
  console.log('Terminé. Étape suivante : node tools/build-data.mjs');
}
main().catch(e => { console.error('Échec :', e.message, '\nSi l\'erreur est ENOTFOUND ou 403 : l\'accès réseau au wiki est bloqué (étape 1 du tutoriel).'); process.exit(1); });
