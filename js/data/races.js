// Races jouables. Humain = référence. Les autres ont des avantages ET des inconvénients.
// stats : bonus/malus de départ · hp : PV max · combat : bonus d'indice de combat
// mod(S, stat, ctx) : modificateur de jet selon le contexte · slave : cible des marchands d'esclaves

export const RACES = {
  humain: {
    name: 'Humain', emoji: '🧑', stats: {}, hp: 0, combat: 0,
    pros: ['Accepté partout', 'Seule race admise chez les Dragons Célestes'], cons: ['Aucun talent particulier'],
    desc: 'La race la plus répandue. Ni avantage, ni handicap.',
  },
  hommepoisson: {
    name: 'Homme-poisson', emoji: '🦈', stats: { force: 3, navigation: 1, charisme: -1 }, hp: 20, combat: 2, swim: true,
    pros: ['Dix fois la force d\'un humain', 'Nage et respire sous l\'eau (tant qu\'il n\'a pas de fruit)', 'Karaté homme-poisson'],
    cons: ['Discriminé à la surface : charisme réduit hors de l\'Île des Hommes-Poissons', 'Marie Geoise lui est hostile'],
    desc: 'Puissant, à l\'aise dans la mer, mais le monde d\'en haut le méprise.',
    mod: (S, stat) => (stat === 'charisme' && S.loc !== 'fishman' ? -2 : 0),
  },
  sirene: {
    name: 'Sirène / Triton', emoji: '🧜', stats: { vitesse: 2, navigation: 3, force: -1, charisme: 1 }, hp: 0, combat: 1, swim: true, slave: 3,
    pros: ['La meilleure nageuse des mers', 'Navigation exceptionnelle', 'Peut parler aux Rois des Mers (rarement)'],
    cons: ['Proie n°1 des marchands d\'esclaves', 'Lent et fragile sur terre (avant 30 ans)'],
    desc: 'Rapide comme le courant. Très recherché à Sabaody. Pour les mauvaises raisons.',
    mod: (S, stat) => (stat === 'navigation' ? 2 : 0),
  },
  mink: {
    name: 'Mink', emoji: '🐆', stats: { vitesse: 2, force: 1, intel: -1 }, hp: 10, combat: 2,
    pros: ['Electro : décharges électriques à chaque coup', 'Forme Sulong sous la pleine lune', 'Sens animaux'],
    cons: ['Supporte mal la chaleur', 'La Sulong peut faire perdre le contrôle'],
    desc: 'Un guerrier-né de Zou. Electro, fourrure et loyauté.',
    mod: (S, stat, ctx) => (stat === 'volonte' && ['desert', 'volcan'].includes(ctx.th) ? -3 : 0),
  },
  geant: {
    name: 'Géant', emoji: '🗿', stats: { force: 3, volonte: 1, vitesse: -2, intel: -1 }, hp: 50, combat: 3,
    pros: ['Force et endurance colossales', 'Respecté à Elbaf', 'Vit plus de 300 ans'],
    cons: ['Impossible de se cacher (vitesse/discrétion réduites)', 'Il lui faut un très grand navire', 'Mange énormément'],
    desc: 'Vingt mètres de muscles. Le monde est un peu étroit pour toi.',
    mod: (S, stat) => (stat === 'vitesse' ? -2 : stat === 'charisme' && S.loc === 'elbaf' ? 4 : 0),
  },
  longbras: {
    name: 'Tribu des Longs-Bras', emoji: '💪', stats: { force: 2, vitesse: 1 }, hp: 0, combat: 1, slave: 1,
    pros: ['Une allonge redoutable', 'Bonus aux armes de poing et de lancer'],
    cons: ['Recherché par les collectionneurs', 'Les vêtements ne sont jamais à ta taille'],
    desc: 'Deux coudes par bras. Personne ne frappe de plus loin.',
  },
  longjambes: {
    name: 'Tribu des Longues-Jambes', emoji: '🦵', stats: { vitesse: 3 }, hp: 0, combat: 1, slave: 1,
    pros: ['Vitesse et coups de pied foudroyants', 'Fuite facile'],
    cons: ['Recherché par les collectionneurs', 'Se cogne la tête aux plafonds'],
    desc: 'Des jambes aussi longues que ton corps. Les escaliers sont un cauchemar.',
    mod: (S, stat) => (stat === 'vitesse' ? 1 : 0),
  },
  troisyeux: {
    name: 'Tribu des Trois-Yeux', emoji: '👁️', stats: { intel: 3, volonte: 1 }, hp: 0, combat: 1, slave: 2, obs: 1,
    pros: ['Commence avec le Haki de l\'observation', 'Le troisième œil peut un jour lire les Poneglyphes'],
    cons: ['Traqué par les collectionneurs et par une certaine Empereure gourmande'],
    desc: 'Ton troisième œil voit ce que les autres ne voient pas. Tu le caches sous ta frange.',
    mod: (S, stat) => (stat === 'intel' ? 1 : 0),
  },
  lunarien: {
    name: 'Lunarien', emoji: '🔥', stats: { volonte: 2, force: 1, charisme: -1 }, hp: 35, combat: 2, slave: 2, hunted: true,
    pros: ['Presque indestructible tant que ta flamme brûle', 'Résiste au feu et aux températures extrêmes'],
    cons: ['Race « éteinte » : le Gouvernement met ta tête à prix dès la naissance', 'Ta flamme s\'éteint parfois au pire moment'],
    desc: 'Ailes noires, flamme dans le dos. Officiellement, ton peuple n\'existe plus.',
  },
  tontatta: {
    name: 'Tontatta', emoji: '🧚', stats: { vitesse: 3, force: 2, intel: -2, charisme: -1 }, hp: -30, combat: 2,
    pros: ['Minuscule, ultra-rapide et étonnamment fort', 'Passe partout sans être vu'],
    cons: ['Très naïf : on te ment facilement', 'Fragile', 'Personne ne te prend au sérieux'],
    desc: 'Vingt centimètres de courage. Tu crois tout ce qu\'on te dit.',
    mod: (S, stat) => (stat === 'charisme' ? -2 : 0),
  },
};
for (const [id, r] of Object.entries(RACES)) r.id = id;
export const raceOf = S => RACES[S.hero.race || 'humain'];
