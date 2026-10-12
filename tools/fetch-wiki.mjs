#!/usr/bin/env node
// Télécharge les articles du wiki One Piece (API MediaWiki) dans tools/cache/ : un fichier .wikitext par article.
//
// Usage :
//   node tools/fetch-wiki.mjs --category "Category:Islands" --kind islands
//   node tools/fetch-wiki.mjs --category "Category:Characters" --kind characters --limit 400
//   node tools/fetch-wiki.mjs --pages "Alabasta,Water 7" --kind islands
//   node tools/fetch-wiki.mjs --list-categories "Category:Locations"     (explorer les sous-catégories)
//
// Prérequis : accès réseau à onepiece.fandom.com (voir docs/TUTO_DONNEES.md, étape 1).
// Le script est volontairement lent et poli (1 requête / seconde, 25 pages par lot).
import fs from 'node:fs';
import path from 'node:path';

const API = process.env.OP_WIKI_API || 'https://onepiece.fandom.com/api.php';
const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => (x.startsWith('--') ? [...a, [x.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]] : a), []));
const kind = args.kind || 'islands';
const outDir = path.join(path.dirname(new URL(import.meta.url).pathname), 'cache', kind);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const UA = 'DestinyOnePiece-DataImport/1.0 (projet de jeu de fan ; contact via le dépôt GitHub)';

async function api(params) {
  const url = API + '?' + new URLSearchParams({ format: 'json', formatversion: '2', ...params });
  for (let t = 0; t < 4; t++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      if (res.ok) return await res.json();
      if (res.status === 429 || res.status >= 500) { await sleep(2000 * 2 ** t); continue; }
      throw new Error(`HTTP ${res.status} sur ${url}`);
    } catch (e) { if (t === 3) throw e; await sleep(1500 * 2 ** t); }
  }
}

async function categoryMembers(cat, type = 'page', limit = Infinity) {
  const out = []; let cont;
  do {
    const r = await api({ action: 'query', list: 'categorymembers', cmtitle: cat, cmlimit: '500', cmtype: type, ...(cont ? { cmcontinue: cont } : {}) });
    out.push(...r.query.categorymembers.map(m => m.title));
    cont = r.continue?.cmcontinue;
    await sleep(1000);
  } while (cont && out.length < limit);
  return out.slice(0, limit);
}

async function main() {
  if (args['list-categories']) {
    const subs = await categoryMembers(args['list-categories'], 'subcat');
    console.log(`${subs.length} sous-catégories de ${args['list-categories']} :\n` + subs.join('\n'));
    return;
  }
  let titles = [];
  if (args.pages) titles = String(args.pages).split(',').map(s => s.trim()).filter(Boolean);
  else if (args.category) titles = await categoryMembers(args.category, 'page', args.limit ? +args.limit : Infinity);
  else { console.error('Il faut --category, --pages ou --list-categories (voir l\'en-tête du script).'); process.exit(1); }
  titles = titles.filter(t => !/^(Category|File|Template|User|Talk|Help):/.test(t));
  fs.mkdirSync(outDir, { recursive: true });
  const todo = titles.filter(t => !fs.existsSync(path.join(outDir, fileName(t))));
  console.log(`${titles.length} articles, ${todo.length} à télécharger (le reste est déjà en cache) → ${outDir}`);
  for (let i = 0; i < todo.length; i += 25) {
    const batch = todo.slice(i, i + 25);
    const r = await api({ action: 'query', prop: 'revisions', rvprop: 'content', rvslots: 'main', titles: batch.join('|'), redirects: '1' });
    for (const p of r.query.pages || []) {
      const text = p.revisions?.[0]?.slots?.main?.content;
      if (!text) { console.warn('  (vide)', p.title); continue; }
      fs.writeFileSync(path.join(outDir, fileName(p.title)), `<!-- TITLE: ${p.title} -->\n` + text);
    }
    console.log(`  ${Math.min(i + 25, todo.length)}/${todo.length}`);
    await sleep(1000);
  }
  console.log('Terminé. Étape suivante : node tools/build-data.mjs');
}
const fileName = t => t.replace(/[^\w\-. ]+/g, '_') + '.wikitext';
main().catch(e => { console.error('Échec :', e.message, '\nSi l\'erreur est ENOTFOUND ou 403 : l\'accès réseau au wiki est bloqué (étape 1 du tutoriel).'); process.exit(1); });
