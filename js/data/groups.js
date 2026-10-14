import { EXTRA_GROUPS } from './generated.js';
import { ORIG_GROUPS, CANON_GROUPS } from './orig_groups.js';
import { MORE_GROUPS } from './characters_more.js';
// Puissances du monde : la réputation se gagne auprès des groupes (factions, équipages, peuples),
// pas seulement des individus. Chaque personnage canon appartient à un groupe (selon l'époque).
// terr : îles où le groupe fait la loi (réductions et faveurs si ami, embuscades si hostile)
// yonko : identifiant d'Empereur correspondant (pour se placer sous sa protection)

export const GROUPS = {
  marine:     { name: 'Marine', emoji: '⚓', terr: { pre: ['shells', 'loguetown', 'marineford'], post: ['shells', 'loguetown', 'marinehq'] } },
  gov:        { name: 'Gouvernement mondial', emoji: '🕊️', terr: { pre: ['enies', 'marygeoise', 'impeldown', 'tequila'], post: ['enies', 'marygeoise', 'impeldown', 'tequila'] } },
  revo:       { name: 'Armée révolutionnaire', emoji: '🐉', terr: { pre: ['baltigo', 'momoiro'], post: ['momoiro'] } },
  pirates:    { name: 'Pirates de la nouvelle génération', emoji: '🏴‍☠️', terr: { pre: ['jaya', 'sabaody', 'whisky'], post: ['jaya', 'sabaody', 'whisky'] } },
  chapeau:    { name: 'Équipage du Chapeau de paille', emoji: '👒', terr: { pre: [], post: ['wano', 'fishman'] }, yonko: { post: 'luffy' } },
  shanks:     { name: 'Équipage du Roux', emoji: '🔴', terr: { pre: ['fuchsia', 'goa', 'sabaody'], post: ['elbaf', 'sabaody'] }, yonko: { pre: 'shanks', post: 'shanks' } },
  wb:         { name: 'Équipage de Barbe Blanche', emoji: '⚪', terr: { pre: ['sphinx', 'marineford', 'jaya'], post: [] }, yonko: { pre: 'barbeblanche' } },
  bigmom:     { name: 'Famille Charlotte', emoji: '🍰', terr: { pre: ['wci', 'foodvalten'], post: ['wci'] }, yonko: { pre: 'bigmom' } },
  kaido:      { name: 'Équipage aux Cent Bêtes', emoji: '🐉', terr: { pre: ['wano', 'punkhazard'], post: [] }, yonko: { pre: 'kaido' } },
  teach:      { name: 'Équipage de Barbe Noire', emoji: '⚫', terr: { pre: ['jaya', 'banaro'], post: ['hachinosu', 'baltigo', 'sabaody'] }, yonko: { post: 'teach' } },
  corsaires:  { name: 'Corsaires', emoji: '⚓', terr: { pre: ['alabasta', 'dressrosa', 'thriller', 'kuraigana', 'spidermiles', 'amazonlily', 'weatheria'], post: [] } },
  crossguild: { name: 'Cross Guild', emoji: '🤡', terr: { pre: ['orange'], post: ['karaibari', 'kuraigana', 'alabasta', 'loguetown'] }, yonko: { post: 'baggy' } },
  kuja:       { name: 'Pirates Kuja', emoji: '🐍', terr: { pre: ['amazonlily'], post: ['amazonlily'] } },
  minks:      { name: 'Minks de Zou', emoji: '🐾', terr: { pre: ['zou'], post: ['zou'] } },
  geants:     { name: 'Géants d\'Elbaf', emoji: '🪓', terr: { pre: ['elbaf', 'littlegarden'], post: ['elbaf', 'littlegarden'] } },
  wano:       { name: 'Samouraïs de Wano', emoji: '🗾', terr: { pre: [], post: ['wano'] } },
  ryugu:      { name: 'Royaume Ryugu', emoji: '🧜', terr: { pre: ['fishman'], post: ['fishman'] } },
  germa:      { name: 'Germa 66', emoji: '🧬', terr: { pre: ['germa'], post: ['germa'] } },
  galleyla:   { name: 'Water 7 et Galley-La', emoji: '🔨', terr: { pre: ['water7', 'pucci', 'sanfaldo', 'stpoplar'], post: ['water7', 'pucci', 'sanfaldo', 'stpoplar'] } },
  ciel:       { name: 'Peuples du ciel', emoji: '☁️', terr: { pre: ['skypiea', 'weatheria'], post: ['skypiea', 'weatheria'] } },
  vegapunk:   { name: 'Laboratoires de Vegapunk', emoji: '🧪', terr: { pre: ['karakuri'], post: ['egghead', 'karakuri'] } },
  roger:      { name: 'Les anciens de Roger', emoji: '👓', terr: { pre: ['reverse'], post: ['reverse'] } },
};
Object.assign(GROUPS, ORIG_GROUPS, CANON_GROUPS);
for (const [id, g] of Object.entries(GROUPS)) g.id = id;

// personnage → groupe (une chaîne, ou { pre, post } si ça change avec l'époque)
const CG = {
  luffy: 'chapeau', zoro: 'chapeau', nami: 'chapeau', usopp: 'chapeau', sanji: 'chapeau', chopper: 'chapeau', robin: 'chapeau', franky: 'chapeau', brook: 'chapeau',
  jinbe: { pre: 'ryugu', post: 'chapeau' },
  shanks: 'shanks', beckman: 'shanks',
  barbeblanche: 'wb', marco: 'wb', ace: 'wb',
  bigmom: 'bigmom', katakuri: 'bigmom',
  kaido: 'kaido', king: 'kaido',
  teach: 'teach',
  baggy: { pre: 'pirates', post: 'crossguild' }, alvida: { pre: 'pirates', post: 'crossguild' },
  mihawk: { pre: 'corsaires', post: 'crossguild' }, crocodile: { pre: 'corsaires', post: 'crossguild' },
  doflamingo: 'corsaires', moria: 'corsaires', hancock: 'kuja',
  kuma: 'revo', dragon: 'revo', sabo: 'revo', koala: 'revo', ivankov: 'revo',
  law: 'pirates', kidd: 'pirates', bonney: 'pirates', bege: 'pirates', hawkins: 'pirates', urouge: 'pirates', bellamy: 'pirates', foxy: 'pirates', cavendish: 'pirates', bartolomeo: 'pirates', krieg: 'pirates', arlong: 'pirates', kuro: 'pirates',
  drake: 'marine', garp: 'marine', sengoku: 'marine', akainu: 'marine', kizaru: 'marine', aokiji: { pre: 'marine', post: 'teach' }, fujitora: 'marine', ryokugyu: 'marine', smoker: 'marine', tashigi: 'marine', koby: 'marine', helmeppo: 'marine', morgan: 'marine', hina: 'marine', tsuru: 'marine',
  magellan: 'gov', hannyabal: 'gov', lucci: 'gov', kaku: 'gov', spandam: 'gov', charlos: 'gov', saturn: 'gov', garling: 'gov', shamrock: 'gov', im: 'gov',
  vegapunk: 'vegapunk', caesar: 'kaido',
  nekomamushi: 'minks', pedro: 'minks',
  dorry: 'geants', loki: 'geants', saul: 'geants',
  kinemon: 'wano', momonosuke: 'wano', yamato: { pre: 'wano', post: 'chapeau' },
  iceburg: 'galleyla',
  enel: 'ciel',
  rayleigh: 'roger', shakky: 'roger', crocus: 'roger', laboon: 'roger',
  judge: 'germa',
  law: { pre: 'heart', post: 'heart' }, kidd: 'kidd', killer: 'kidd', bege: 'firetank', crocodile: { pre: 'baroque', post: 'crossguild' }, doflamingo: 'donquixote', trebol: 'donquixote', diamante: 'donquixote', pica: 'donquixote', jinbe: { pre: 'soleil', post: 'chapeau' },
};
export function groupOfChar(id, era) {
  const g = CG[id] ?? EXTRA_GROUPS[id] ?? MORE_GROUPS[id];
  return typeof g === 'object' ? g?.[era] : g;
}

// groupe naturel d'une faction du héros
export function groupOfFaction(fac, yonko, era) {
  if (fac === 'marine') return 'marine';
  if (fac === 'gouv' || fac === 'chevalier') return 'gov';
  if (fac === 'revo') return 'revo';
  if (fac === 'corsaire') return 'corsaires';
  if (fac === 'vassal' && yonko) return groupOfYonko(yonko, era);
  return null;
}
export function groupOfYonko(yid, era) {
  return Object.values(GROUPS).find(g => g.yonko && (g.yonko[era] === yid || g.yonko.pre === yid || g.yonko.post === yid))?.id || null;
}

export const STANDING = [
  { min: 6, name: 'Allié', emoji: '🤝', k: 'ally' },
  { min: 3, name: 'Ami', emoji: '🙂', k: 'friend' },
  { min: -2, name: 'Neutre', emoji: '😐', k: 'neutral' },
  { min: -5, name: 'Hostile', emoji: '😠', k: 'hostile' },
  { min: -99, name: 'Ennemi juré', emoji: '☠️', k: 'enemy' },
];
export const standingOf = v => STANDING.find(s => (v || 0) >= s.min);
