// Factions, grades et échelle de puissance.

export const FACTIONS = {
  pirate: {
    name: 'Pirate indépendant', emoji: '🏴‍☠️', camp: 'chercheur', color: 0x111111, sail: '#1b1b1b',
    desc: 'Libre comme l\'océan. Ta tête sera mise à prix.',
    crewLabel: 'Équipage', start: true,
    ranks: ['Mousse', 'Membre d\'équipage', 'Capitaine', 'Rookie notoire', 'Supernova', 'Pirate du Nouveau Monde', 'Légende vivante'],
  },
  vassal: {
    name: 'Pirate sous un Empereur', emoji: '👑', camp: 'chercheur', color: 0x4a148c, sail: '#4a148c',
    desc: 'Ton drapeau flotte sous la protection d\'un Empereur. En échange, tu obéis.',
    crewLabel: 'Équipage', start: false,
    ranks: ['Équipage affilié', 'Équipage protégé', 'Commandant de flotte', 'Commandant', 'Officier supérieur', 'Bras droit'],
  },
  corsaire: {
    name: 'Corsaire', emoji: '⚓', camp: 'chercheur', color: 0x1a237e, sail: '#283593',
    desc: 'Un pirate avec une licence du Gouvernement. Ta prime est gelée, ta liberté aussi.',
    crewLabel: 'Équipage', start: false, era: 'pre',
    ranks: ['Corsaire', 'Corsaire redouté', 'Corsaire légendaire'],
  },
  empereur: {
    name: 'Empereur', emoji: '👑', camp: 'chercheur', color: 0xb71c1c, sail: '#b71c1c',
    desc: 'L\'un des quatre souverains des mers. Le monde entier te regarde.',
    crewLabel: 'Équipage', start: false,
    ranks: ['Nouvel Empereur', 'Empereur des mers', 'Empereur incontesté'],
  },
  revo: {
    name: 'Armée Révolutionnaire', emoji: '🐉', camp: 'chercheur', color: 0x1b5e20, sail: '#2e7d32',
    desc: 'Renverser le Gouvernement Mondial. Le One Piece contient peut-être la vérité.',
    crewLabel: 'Cellule', start: true,
    ranks: ['Recrue', 'Agent de terrain', 'Officier', 'Commandant d\'armée', 'Chef d\'état-major', 'Bras droit de Dragon'],
  },
  chasseur: {
    name: 'Chasseur de primes', emoji: '🎯', camp: 'chercheur', color: 0x5d4037, sail: '#6d4c41',
    desc: 'Tu vis des têtes des autres. Tôt ou tard, le Gouvernement te proposera une licence.',
    crewLabel: 'Associés', start: true,
    ranks: ['Chasseur amateur', 'Chasseur reconnu', 'Chasseur redouté', 'Légende des chasseurs'],
  },
  marine: {
    name: 'Marine', emoji: '⚓', camp: 'gardien', color: 0xeceff1, sail: '#e3f2fd',
    desc: 'La Justice. Protéger le monde... et ce que le Gouvernement ne veut pas qu\'on trouve.',
    crewLabel: 'Escouade', start: true,
    ranks: ['Recrue', 'Matelot', 'Sergent', 'Adjudant', 'Enseigne', 'Lieutenant', 'Commandant', 'Capitaine', 'Contre-amiral', 'Vice-amiral', 'Amiral', 'Amiral en chef'],
  },
  gouv: {
    name: 'Gouvernement Mondial', emoji: '🕊️', camp: 'gardien', color: 0x263238, sail: '#eceff1',
    desc: 'Le Cipher Pol, l\'ombre du Gouvernement. Personne ne sait ce que tu fais. C\'est le but.',
    crewLabel: 'Équipe CP', start: true,
    ranks: ['Fonctionnaire', 'Agent CP1', 'Agent CP5', 'Agent CP7', 'Agent CP9', 'Agent CP0', 'Chef du CP0', 'Main droite des Cinq Doyens'],
  },
  chevalier: {
    name: 'Chevalier Divin', emoji: '⚜️', camp: 'gardien', color: 0xfff8e1, sail: '#fffde7',
    desc: 'L\'ordre des Dragons Célestes qui fait respecter la loi... entre Dragons Célestes. Et au-delà.',
    crewLabel: 'Escorte', start: true, needsOrigin: 'marygeoise',
    ranks: ['Dragon Céleste', 'Écuyer sacré', 'Chevalier Divin', 'Commandant des Chevaliers Divins', 'Membre des Cinq Doyens'],
  },
};

export const CAMPS = {
  chercheur: { name: 'Chercheur du One Piece', goal: 'Trouver le One Piece' },
  gardien: { name: 'Gardien du secret', goal: 'Protéger le One Piece' },
};

export const camp = f => FACTIONS[f].camp;

// Progression vers l'objectif final (0 → 9)
export const PROGRESS = {
  chercheur: [
    'Prendre la mer',
    'Entrer sur Grand Line',
    'Atteindre la Red Line',
    'Entrer dans le Nouveau Monde',
    '1er Poneglyphe routier',
    '2e Poneglyphe routier',
    '3e Poneglyphe routier',
    '4e Poneglyphe routier',
    'Atteindre Laugh Tale',
    'Trouver le One Piece',
  ],
  gardien: [
    'Prêter serment',
    'Entrer sur Grand Line',
    'Atteindre la Red Line',
    'Entrer dans le Nouveau Monde',
    '1er Poneglyphe routier sécurisé',
    '2e Poneglyphe routier sécurisé',
    '3e Poneglyphe routier sécurisé',
    '4e Poneglyphe routier sécurisé',
    'Atteindre Laugh Tale',
    'Sceller le One Piece',
  ],
};

// Échelle de puissance (« examiner son niveau »). Seuils sur l'indice de combat.
export const LEVELS = [
  { id: 'civil',     name: 'Civil',              min: 0,  emoji: '🧑', desc: 'Un passant. Le genre qui meurt dans un flashback.' },
  { id: 'local',     name: 'Menace locale',      min: 12, emoji: '🗡️', desc: 'Tu fais peur dans un village d\'East Blue.' },
  { id: 'rookie',    name: 'Rookie de Paradise', min: 18, emoji: '🌀', desc: 'Niveau Bellamy. Tu survis sur Grand Line.' },
  { id: 'supernova', name: 'Supernova',          min: 25, emoji: '💫', desc: 'Niveau Sabaody pré-ellipse. Le Gouvernement te connaît.' },
  { id: 'corsaire',  name: 'Niveau Corsaire / Vice-amiral', min: 33, emoji: '⚓', desc: 'Niveau Crocodile, Moria, un Vice-amiral solide.' },
  { id: 'yc3',       name: 'YC3',                min: 41, emoji: '🥉', desc: 'Commandant d\'Empereur de 3e rang. Niveau Jack, Smoothie, Jozu.' },
  { id: 'yc2',       name: 'YC2',                min: 50, emoji: '🥈', desc: 'Commandant d\'Empereur de 2e rang. Niveau Queen, Cracker, Lucky Roux.' },
  { id: 'yc1',       name: 'YC1',                min: 60, emoji: '🥇', desc: 'Bras droit d\'Empereur. Niveau Katakuri, Marco, King, Ben Beckman.' },
  { id: 'yonko',     name: 'Yonko / Amiral',     min: 72, emoji: '👑', desc: 'Un des sommets du monde. Niveau Empereur ou Amiral.' },
  { id: 'rdp',       name: 'RDP',                min: 88, emoji: '🏴‍☠️', desc: 'Niveau Roi des Pirates. Roger, Barbe Blanche à son apogée, Garp jeune.' },
];

export const levelOf = rating => {
  let lv = LEVELS[0];
  for (const l of LEVELS) if (rating >= l.min) lv = l;
  return lv;
};

// Empereurs selon l'époque
export const YONKO = {
  pre: [
    { id: 'shanks', name: 'Shanks le Roux', emoji: '🔴', terr: 'Nouveau Monde (côté Red Line)' },
    { id: 'barbeblanche', name: 'Barbe Blanche', emoji: '⚪', terr: 'Sphinx et 47 îles' },
    { id: 'bigmom', name: 'Big Mom', emoji: '🍰', terr: 'Totto Land' },
    { id: 'kaido', name: 'Kaido aux Cent Bêtes', emoji: '🐉', terr: 'Wano' },
  ],
  post: [
    { id: 'shanks', name: 'Shanks le Roux', emoji: '🔴', terr: 'Elbaf et alentours' },
    { id: 'teach', name: 'Barbe Noire', emoji: '⚫', terr: 'Hachinosu' },
    { id: 'luffy', name: 'Monkey D. Luffy', emoji: '👒', terr: 'Wano, Île des Hommes-Poissons' },
    { id: 'baggy', name: 'Baggy le Clown', emoji: '🤡', terr: 'Karai Bari (Cross Guild)' },
  ],
};

export const ERAS = {
  pre: { id: 'pre', name: 'Grande Ère de la Piraterie', sub: 'Avant Marineford', desc: 'Barbe Blanche, Kaido, Big Mom et Shanks règnent. Les Corsaires existent. Luffy vient de partir de Fuchsia.' },
  post: { id: 'post', name: 'La Nouvelle Ère', sub: 'Après Wano', desc: 'Luffy et Baggy sont Empereurs. Les Corsaires sont abolis, la Cross Guild met des primes sur les Marines.' },
};

// Chez soi : les îles où chaque faction a ses appuis (léger avantage aux jets, soins, prix)
export const FACTION_HOME = {
  marine: ['marineford', 'marinehq', 'shells', 'loguetown'],
  gouv: ['enies', 'impeldown', 'marygeoise'],
  chevalier: ['marygeoise'],
  chasseur: ['sabaody', 'whisky', 'jaya'],
  revo: ['baltigo', 'momoiro'],
  corsaire: ['alabasta', 'dressrosa', 'kuraigana', 'thriller'],
};
