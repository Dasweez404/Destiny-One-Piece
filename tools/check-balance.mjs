// Vérifie l'équilibre du jeu : lance des parties simulées et échoue si un taux sort de sa fourchette.
// Usage : node tools/check-balance.mjs [parties]   (défaut 120)
import { execFileSync } from 'node:child_process';
const N = process.argv[2] || '120';
const CASES = [
  { a: ['moyen', 'saga'], op: [18, 42], mort: [0, 10] },
  { a: ['moyen', 'rapide'], op: [5, 22], mort: [0, 10] },
  { a: ['temeraire', 'saga'], op: [2, 20], mort: [25, 65] },
];
let fail = 0, md = '| Cas | One Piece % | Morts % | Verdict |\n|---|---|---|---|\n';
for (const c of CASES) {
  const out = execFileSync('node', ['tools/bench.mjs', ...c.a, N], { encoding: 'utf8' });
  const line = out.split('\n').find(l => l.startsWith('TOUS')) || '';
  const m = /mort\s+(\d+)%.*OP\s+(\d+)%/.exec(line);
  if (!m || /\b[1-9]\d* erreurs/.test(out) && !/\(\d+ parties, 0 erreurs\)/.test(out)) { console.error(`❌ ${c.a.join(' ')} : sortie illisible ou erreurs\n${out}`); fail++; continue; }
  const mort = +m[1], op = +m[2];
  const ok = op >= c.op[0] && op <= c.op[1] && mort >= c.mort[0] && mort <= c.mort[1];
  if (!ok) fail++;
  console.log(`${ok ? '✅' : '❌'} ${c.a.join(' ')} : One Piece ${op}% (attendu ${c.op.join('–')}), morts ${mort}% (attendu ${c.mort.join('–')})`);
  md += `| ${c.a.join(' ')} | ${op} (${c.op.join('–')}) | ${mort} (${c.mort.join('–')}) | ${ok ? '✅' : '❌'} |\n`;
}
if (process.env.GITHUB_STEP_SUMMARY) (await import('node:fs')).appendFileSync(process.env.GITHUB_STEP_SUMMARY, '### Équilibre du jeu\n' + md);
process.exit(fail ? 1 : 0);
