#!/usr/bin/env node
// Affiche la fiche (infobox) d'un article déjà téléchargé : sert à vérifier les noms de champs avant de régler tools/mapping.json.
// Usage : node tools/inspect.mjs "Alabasta" [--kind islands]
import fs from 'node:fs';
import path from 'node:path';
const root = path.join(path.dirname(new URL(import.meta.url).pathname), 'cache');
const title = process.argv[2], kind = process.argv.includes('--kind') ? process.argv[process.argv.indexOf('--kind') + 1] : null;
if (!title) { console.error('Usage : node tools/inspect.mjs "Titre de l\'article" [--kind islands|characters]'); process.exit(1); }
const dirs = kind ? [kind] : fs.existsSync(root) ? fs.readdirSync(root) : [];
for (const d of dirs) {
  const f = path.join(root, d, title.replace(/[^\w\-. ]+/g, '_') + '.wikitext');
  if (!fs.existsSync(f)) continue;
  const raw = fs.readFileSync(f, 'utf8');
  const m = /\{\{\s*[^|{}\n]*infobox[\s\S]*?\n\}\}/i.exec(raw);
  console.log(`== ${title} (${d}) — ${raw.length} caractères`);
  console.log(m ? m[0].slice(0, 2500) : '(aucune infobox trouvée : voir le début du texte)\n' + raw.slice(0, 800));
  process.exit(0);
}
console.error('Article introuvable dans tools/cache/. Télécharge-le d\'abord avec tools/fetch-wiki.mjs.');
