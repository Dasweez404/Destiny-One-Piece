// Mers et îles. Uniquement des lieux canon (manga / anime), du plus célèbre au simplement mentionné.
// pop : 1 = à peine mentionnée, 2 = connue, 3 = arc majeur (événements plus gros, récompenses plus grosses)
// th  : thème du diorama 3D  (k = forme, g = couleur du sol, a = couleur d'accent)
// svc : services d'escale disponibles

export const SEAS = {
  east:      { id: 'east',      name: 'East Blue',          tier: 1, emoji: '🌅', desc: 'La mer la plus paisible du monde. Idéale pour débuter... en théorie.', sky: 0x8fd3ff, water: 0x2a8fd4 },
  north:     { id: 'north',     name: 'North Blue',         tier: 1, emoji: '❄️', desc: 'Mer froide de royaumes déchus, de légendes et de la Famille Donquixote.', sky: 0xb8cde0, water: 0x2c6e9e },
  west:      { id: 'west',      name: 'West Blue',          tier: 1, emoji: '📚', desc: 'Terre des mafias, des savants et des cicatrices du Gouvernement.', sky: 0xf2c38b, water: 0x2b7fb0 },
  south:     { id: 'south',     name: 'South Blue',         tier: 1, emoji: '🌺', desc: 'Mer chaude et rude, berceau de Supernovas violents.', sky: 0xffc9a8, water: 0x1f9bb8 },
  paradise:  { id: 'paradise',  name: 'Grand Line (Paradise)', tier: 2, emoji: '🌀', desc: 'La première moitié de Grand Line. Météo folle, Log Pose obligatoire.', sky: 0x9ab6ff, water: 0x1e6fb8 },
  calm:      { id: 'calm',      name: 'Calm Belt',          tier: 2, emoji: '🐉', desc: 'Aucun vent, aucun courant... et des Rois des Mers par centaines.', sky: 0xc8e6c9, water: 0x2e7d6b },
  redline:   { id: 'redline',   name: 'Red Line',           tier: 2, emoji: '🧱', desc: 'Le mur de continent qui coupe le monde en deux.', sky: 0xffb199, water: 0x245f8f },
  nw:        { id: 'nw',        name: 'Nouveau Monde',      tier: 3, emoji: '🔥', desc: 'La seconde moitié de Grand Line. Le territoire des Empereurs.', sky: 0x6f7fb8, water: 0x173f78 },
  laughtale: { id: 'laughtale', name: 'Laugh Tale',         tier: 4, emoji: '🏴‍☠️', desc: 'La dernière île. Celle de Gol D. Roger.', sky: 0xffd27a, water: 0x13507a },
};

export const BLUES = ['east', 'north', 'west', 'south'];

export const ISLANDS = {
  // ───────────── EAST BLUE ─────────────
  fuchsia:    { sea: 'east', pop: 3, name: 'Village de Fuchsia', sub: 'Dawn Island', desc: 'Un petit village de moulins. Le bar de Makino sert du lait aux futurs Rois.', th: { k: 'village', g: 0x7fbf5a, a: 0xd9a066 }, svc: ['tavern', 'rest'] },
  goa:        { sea: 'east', pop: 2, name: 'Royaume de Goa', sub: 'Dawn Island', desc: 'Une ville haute qui brille, et le Gray Terminal qui pue en contrebas.', th: { k: 'ville', g: 0x9aa36b, a: 0xe8e0c8 }, svc: ['market', 'tavern', 'dojo'] },
  shells:     { sea: 'east', pop: 2, name: 'Shells Town', sub: 'Base Marine 153', desc: 'Une base Marine tenue jadis par le capitaine Morgan à la main-hache.', th: { k: 'forteresse', g: 0xa9b38d, a: 0xf2f2f2 }, svc: ['marinebase', 'market', 'rest'] },
  orange:     { sea: 'east', pop: 2, name: 'Orange Town', sub: 'Îles Organ', desc: 'Une ville fantôme depuis que Baggy le Clown l\'a canonnée. Un chien garde encore la boutique.', th: { k: 'ville', g: 0xd9a35b, a: 0xff8c42 }, svc: ['market', 'rest'] },
  animaux:    { sea: 'east', pop: 1, name: 'Île aux Animaux Rares', sub: 'East Blue', desc: 'Peuplée d\'animaux bizarres... et d\'un homme coincé dans un coffre depuis 20 ans.', th: { k: 'jungle', g: 0x5ea84a, a: 0xc94f7c }, svc: ['rest'] },
  sirop:      { sea: 'east', pop: 3, name: 'Village de Sirop', sub: 'Gecko Islands', desc: 'Un village tranquille, un manoir, une pente fatale et un menteur au grand cœur.', th: { k: 'village', g: 0x8cc66a, a: 0xc0392b }, svc: ['tavern', 'ship', 'rest'] },
  baratie:    { sea: 'east', pop: 3, name: 'Le Baratie', sub: 'Restaurant flottant', desc: 'Le restaurant-navire de Zeff « Jambe Rouge ». Les cuisiniers se battent mieux que les pirates.', th: { k: 'navire', g: 0x8b5a2b, a: 0xf4d03f }, svc: ['tavern', 'rest'] },
  cocoyasi:   { sea: 'east', pop: 3, name: 'Village de Cocoyasi', sub: 'Conomi Islands', desc: 'Des mandariniers, un village sous la coupe d\'hommes-poissons, et Arlong Park au bord de l\'eau.', th: { k: 'village', g: 0x76b852, a: 0xf39c12 }, svc: ['tavern', 'market', 'rest'] },
  loguetown:  { sea: 'east', pop: 3, name: 'Loguetown', sub: 'La ville du début et de la fin', desc: 'Là où Gol D. Roger fut exécuté. Dernière escale avant Grand Line.', th: { k: 'ville', g: 0xb5a789, a: 0x34495e }, svc: ['market', 'forge', 'ship', 'tavern', 'marinebase', 'rest'] },
  shimotsuki: { sea: 'east', pop: 2, name: 'Village de Shimotsuki', sub: 'East Blue', desc: 'Le dojo Isshin de Koshiro, où un garçon aux cheveux verts a perdu 2001 fois.', th: { k: 'japon', g: 0x6fa860, a: 0x8e4b2a }, svc: ['dojo', 'forge', 'rest'] },
  tequila:    { sea: 'east', pop: 1, name: 'Tequila Wolf', sub: 'Le Pont Infini', desc: 'Un pont colossal construit depuis 700 ans par des esclaves du Gouvernement.', th: { k: 'pont', g: 0x9e9e9e, a: 0x5d4037 }, svc: ['rest'] },
  oykot:      { sea: 'east', pop: 1, name: 'Royaume d\'Oykot', sub: 'East Blue', desc: 'Un royaume dont on ne parle qu\'à la Rêverie... et dont les gens ont faim.', th: { k: 'ville', g: 0xa1887f, a: 0xffd54f }, svc: ['market', 'rest'] },

  // ───────────── NORTH BLUE ─────────────
  flevance:   { sea: 'north', pop: 2, name: 'Flevance', sub: 'La Ville Blanche', desc: 'Un pays jadis riche de plomb ambré. Aujourd\'hui, des ruines blanches et un silence de mort.', th: { k: 'ruines', g: 0xeceff1, a: 0xb0bec5 }, svc: ['rest'] },
  swallow:    { sea: 'north', pop: 1, name: 'Île de Swallow', sub: 'North Blue', desc: 'Une île froide où un ours polaire karatéka s\'est un jour fait des amis.', th: { k: 'neige', g: 0xf5f5f5, a: 0x6d8b74 }, svc: ['tavern', 'ship', 'rest'] },
  spidermiles:{ sea: 'north', pop: 2, name: 'Spider Miles', sub: 'Décharge de North Blue', desc: 'Une ville-poubelle où la Famille Donquixote a pris racine.', th: { k: 'ruines', g: 0x7b6f5a, a: 0xe91e63 }, svc: ['market', 'forge', 'tavern'] },
  lvneel:     { sea: 'north', pop: 2, name: 'Royaume de Lvneel', sub: 'North Blue', desc: 'Le pays de Montblanc Noland, « le menteur » qui disait avoir vu une cité d\'or.', th: { k: 'ville', g: 0x8fa36b, a: 0xffc107 }, svc: ['market', 'tavern', 'ship', 'rest'] },
  minion:     { sea: 'north', pop: 1, name: 'Île de Minion', sub: 'North Blue', desc: 'Une île enneigée. Un fruit y a changé de main au prix d\'une vie.', th: { k: 'neige', g: 0xffffff, a: 0x4e342e }, svc: ['rest'] },
  germa:      { sea: 'north', pop: 3, name: 'Royaume de Germa', sub: 'Nation itinérante', desc: 'Un royaume sans terre, posé sur des escargots géants. Les Vinsmoke y fabriquent des soldats.', th: { k: 'forteresse', g: 0x546e7a, a: 0x1e88e5 }, svc: ['forge', 'market', 'ship'] },

  // ───────────── WEST BLUE ─────────────
  ohara:      { sea: 'west', pop: 2, name: 'Ohara', sub: 'L\'île des savants', desc: 'Il ne reste que des ruines et l\'Arbre de la Connaissance calciné. Le Buster Call ne laisse rien.', th: { k: 'ruines', g: 0x8d8d6b, a: 0x3e2723 }, svc: ['rest'] },
  godvalley:  { sea: 'west', pop: 2, name: 'God Valley', sub: 'Île effacée des cartes', desc: 'L\'île où Roger et Garp ont fait équipe contre Rocks. Officiellement, elle n\'a jamais existé.', th: { k: 'ruines', g: 0x9e7f5b, a: 0x6a1b9a }, svc: ['rest'] },

  // ───────────── SOUTH BLUE ─────────────
  baterilla:  { sea: 'south', pop: 2, name: 'Baterilla', sub: 'South Blue', desc: 'Une petite île tropicale. Une femme y a porté un enfant vingt mois pour le protéger.', th: { k: 'village', g: 0x9ccc65, a: 0xff7043 }, svc: ['tavern', 'rest'] },
  sorbet:     { sea: 'south', pop: 2, name: 'Royaume de Sorbet', sub: 'South Blue', desc: 'Un royaume dont un ancien roi tyran a été chassé par un pasteur au cœur de Bouddha.', th: { k: 'ville', g: 0xc5e1a5, a: 0x8d6e63 }, svc: ['market', 'tavern', 'ship', 'rest'] },

  // ───────────── GRAND LINE : PARADISE ─────────────
  reverse:    { sea: 'paradise', pop: 3, name: 'Reverse Mountain', sub: 'Cap des Jumeaux', desc: 'Une montagne que l\'on grimpe par un canal. Au pied, une baleine attend encore son équipage.', th: { k: 'montagne', g: 0x8d6e63, a: 0xb71c1c }, svc: ['rest'], gate: true },
  whisky:     { sea: 'paradise', pop: 2, name: 'Whisky Peak', sub: 'Île Cactus', desc: 'Une ville qui accueille les pirates avec des fêtes... et des chasseurs de primes.', th: { k: 'desert', g: 0xc0a080, a: 0x388e3c }, svc: ['tavern', 'market', 'rest'] },
  littlegarden:{ sea: 'paradise', pop: 2, name: 'Little Garden', sub: 'Île préhistorique', desc: 'Jungle de dinosaures où deux géants se battent en duel depuis cent ans.', th: { k: 'jungle', g: 0x33691e, a: 0x8d6e63 }, svc: ['dojo', 'rest'] },
  drum:       { sea: 'paradise', pop: 3, name: 'Royaume de Drum', sub: 'Île Sakura', desc: 'Des montagnes de neige, des lapins géants et une sorcière de 139 ans.', th: { k: 'neige', g: 0xfafafa, a: 0xec407a }, svc: ['rest', 'market'] },
  alabasta:   { sea: 'paradise', pop: 3, name: 'Alabasta', sub: 'Royaume du désert', desc: 'Un royaume de sable, une guerre civile et un Corsaire qui joue au héros dans son casino.', th: { k: 'desert', g: 0xe6c27a, a: 0x6d4c41 }, svc: ['market', 'forge', 'tavern', 'rest'] },
  jaya:       { sea: 'paradise', pop: 2, name: 'Jaya', sub: 'Mock Town', desc: 'La ville des rires et des rêves brisés. Ici on se moque de ceux qui croient aux îles célestes.', th: { k: 'ville', g: 0x7cb342, a: 0x5d4037 }, svc: ['tavern', 'market', 'ship', 'forge'] },
  skypiea:    { sea: 'paradise', pop: 3, name: 'Skypiea', sub: 'Île céleste', desc: 'Une mer de nuages, des Dials et un « dieu » qui foudroie les impies.', th: { k: 'ciel', g: 0xffffff, a: 0xffd54f }, svc: ['market', 'rest'] },
  longring:   { sea: 'paradise', pop: 1, name: 'Long Ring Long Land', sub: 'Paradise', desc: 'Des îles étirées, des animaux étirés, et Foxy le Renard Argenté qui veut ton équipage.', th: { k: 'plaine', g: 0x9ccc65, a: 0xf5f5f5 }, svc: ['rest'] },
  water7:     { sea: 'paradise', pop: 3, name: 'Water 7', sub: 'La cité de l\'eau', desc: 'Des canaux, des Yagara Bulls, les meilleurs charpentiers du monde et un train des mers.', th: { k: 'eau', g: 0xb0bec5, a: 0x29b6f6 }, svc: ['ship', 'market', 'forge', 'tavern', 'rest'] },
  enies:      { sea: 'paradise', pop: 3, name: 'Enies Lobby', sub: 'Île judiciaire', desc: 'Le tribunal du Gouvernement Mondial, sous un soleil éternel. Derrière : la Porte de la Justice.', th: { k: 'tour', g: 0xd7ccc8, a: 0x1565c0 }, svc: ['govbase'] },
  thriller:   { sea: 'paradise', pop: 3, name: 'Thriller Bark', sub: 'Triangle de Florian', desc: 'Un navire-île peuplé de zombies et de fantômes négatifs.', th: { k: 'brume', g: 0x4a3f55, a: 0x9575cd }, svc: ['rest'] },
  sabaody:    { sea: 'paradise', pop: 3, name: 'Archipel des Sabaody', sub: 'Mangroves géantes', desc: 'Des bulles, une maison de ventes d\'esclaves, des Dragons Célestes et onze Supernovas.', th: { k: 'bulles', g: 0x8bc34a, a: 0x81d4fa }, svc: ['ship', 'market', 'forge', 'tavern', 'rest'], gate: true },
  boin:       { sea: 'paradise', pop: 1, name: 'Archipel Boin', sub: 'Île des Bois', desc: 'Une jungle de plantes carnivores où un sniper a appris à faire pousser ses munitions.', th: { k: 'jungle', g: 0x2e7d32, a: 0xd81b60 }, svc: ['dojo', 'rest'] },
  karakuri:   { sea: 'paradise', pop: 1, name: 'Île Karakuri', sub: 'Baldimore', desc: 'L\'île natale de Vegapunk, pleine de machines oubliées.', th: { k: 'futur', g: 0xf5f5f5, a: 0xff9800 }, svc: ['forge', 'ship', 'rest'] },
  momoiro:    { sea: 'paradise', pop: 1, name: 'Île Momoiro', sub: 'Royaume de Kamabakka', desc: 'Le royaume des okamas d\'Ivankov. On y apprend la cuisine d\'attaque... et la danse.', th: { k: 'jungle', g: 0xf48fb1, a: 0xffeb3b }, svc: ['dojo', 'tavern', 'rest'] },
  weatheria:  { sea: 'paradise', pop: 1, name: 'Weatheria', sub: 'Île céleste', desc: 'Une île de savants météorologues qui flotte dans le ciel.', th: { k: 'ciel', g: 0xe3f2fd, a: 0x90caf9 }, svc: ['dojo', 'rest'] },
  torino:     { sea: 'paradise', pop: 1, name: 'Royaume de Torino', sub: 'Paradise', desc: 'Une île d\'oiseaux géants où les humains sont minuscules... et parfois au menu.', th: { k: 'jungle', g: 0xaed581, a: 0xff7043 }, svc: ['rest'] },
  banaro:     { sea: 'paradise', pop: 1, name: 'Île de Banaro', sub: 'Paradise', desc: 'Les ruines d\'un village rasé par un duel entre le feu et les ténèbres.', th: { k: 'ruines', g: 0x8d6e63, a: 0xff5722 }, svc: ['rest'] },
  kuraigana:  { sea: 'paradise', pop: 1, name: 'Île de Kuraigana', sub: 'Château de Shikkearu', desc: 'Un royaume en ruine peuplé de babouins qui imitent les sabreurs.', th: { k: 'ruines', g: 0x5d4037, a: 0x212121 }, svc: ['dojo', 'rest'] },
  marineford: { sea: 'paradise', pop: 3, name: 'Marineford', sub: 'Quartier Général de la Marine', desc: 'La forteresse de la Justice, au cœur de Paradise.', th: { k: 'forteresse', g: 0xcfd8dc, a: 0x0d47a1 }, svc: ['marinebase', 'forge', 'rest'], era: 'pre' },

  // ───────────── CALM BELT ─────────────
  amazonlily: { sea: 'calm', pop: 2, name: 'Amazon Lily', sub: 'L\'île des femmes', desc: 'L\'île des Kujas, interdite aux hommes. L\'Impératrice est la plus belle femme du monde (dixit elle).', th: { k: 'jungle', g: 0x66bb6a, a: 0xab47bc }, svc: ['dojo', 'rest'] },
  impeldown:  { sea: 'calm', pop: 3, name: 'Impel Down', sub: 'La Grande Prison', desc: 'Six niveaux d\'enfer sous la mer. Personne ne s\'en évade. Presque.', th: { k: 'tour', g: 0x37474f, a: 0xd32f2f }, svc: [], noNav: true },
  rusukaina:  { sea: 'calm', pop: 1, name: 'Île de Rusukaina', sub: 'Calm Belt', desc: 'Une île hostile aux saisons changeantes, faite pour s\'entraîner ou mourir.', th: { k: 'montagne', g: 0x558b2f, a: 0x6d4c41 }, svc: ['dojo'] },

  // ───────────── RED LINE ─────────────
  fishman:    { sea: 'redline', pop: 3, name: 'Île des Hommes-Poissons', sub: '10 000 mètres sous la mer', desc: 'Le palais Ryugu, des sirènes et une bulle géante sous la Red Line.', th: { k: 'corail', g: 0xff8a80, a: 0x4fc3f7 }, svc: ['market', 'tavern', 'rest'], gate: true },
  marygeoise: { sea: 'redline', pop: 3, name: 'Marie Geoise', sub: 'La Terre Sainte', desc: 'La cité des Dragons Célestes, au sommet de la Red Line.', th: { k: 'falaise', g: 0xc62828, a: 0xfff8e1 }, svc: ['govbase', 'rest'], gate: true },

  // ───────────── NOUVEAU MONDE ─────────────
  punkhazard: { sea: 'nw', pop: 2, name: 'Punk Hazard', sub: 'Île brûlante et gelée', desc: 'Moitié feu, moitié glace, et un savant fou qui fabrique du gaz toxique.', th: { k: 'volcan', g: 0xe0f7fa, a: 0xff3d00 }, svc: ['rest'] },
  dressrosa:  { sea: 'nw', pop: 3, name: 'Dressrosa', sub: 'Royaume de l\'amour et des jouets', desc: 'Des fleurs, des corridas, des jouets vivants et un Colisée où l\'on gagne des fruits du démon.', th: { k: 'ville', g: 0xf8bbd0, a: 0xfbc02d }, svc: ['market', 'forge', 'tavern', 'ship', 'rest'] },
  greenbit:   { sea: 'nw', pop: 1, name: 'Green Bit', sub: 'Royaume des Tontattas', desc: 'Une île forestière reliée à Dressrosa par un pont de fer, peuplée de petits êtres.', th: { k: 'jungle', g: 0x43a047, a: 0xffeb3b }, svc: ['rest'] },
  zou:        { sea: 'nw', pop: 3, name: 'Zou', sub: 'Duché de Mokomo', desc: 'Une île sur le dos d\'un éléphant millénaire. Les Minks y gardent un Poneglyphe routier.', th: { k: 'elephant', g: 0x8d6e63, a: 0x66bb6a }, svc: ['rest', 'dojo'], pone: 'zou' },
  wci:        { sea: 'nw', pop: 3, name: 'Whole Cake Island', sub: 'Totto Land', desc: 'Un pays de friandises où tout est vivant. Un Poneglyphe routier y est gardé jalousement.', th: { k: 'gateau', g: 0xffcdd2, a: 0x8d6e63 }, svc: ['market', 'rest'], pone: 'wci' },
  wano:       { sea: 'nw', pop: 3, name: 'Pays de Wano', sub: 'Onigashima', desc: 'Un pays fermé de samouraïs, de cerisiers et de sabres légendaires. Un Poneglyphe routier y dort.', th: { k: 'japon', g: 0x7cb342, a: 0xe53935 }, svc: ['forge', 'dojo', 'market', 'rest'], pone: 'wano' },
  egghead:    { sea: 'nw', pop: 3, name: 'Egghead', sub: 'L\'île du futur', desc: 'Le laboratoire de Vegapunk, une île d\'été éternel bourrée de technologie.', th: { k: 'futur', g: 0xe1f5fe, a: 0xff4081 }, svc: ['forge', 'ship', 'rest'] },
  elbaf:      { sea: 'nw', pop: 3, name: 'Elbaf', sub: 'Le pays des Géants', desc: 'L\'Arbre Adam, des guerriers colossaux et des secrets plus vieux que le Gouvernement.', th: { k: 'arbre', g: 0x689f38, a: 0x5d4037 }, svc: ['forge', 'dojo', 'ship', 'tavern', 'rest'], pone: 'elbaf' },
  sphinx:     { sea: 'nw', pop: 1, name: 'Sphinx', sub: 'Île natale de Barbe Blanche', desc: 'Un village pauvre que Barbe Blanche a toujours protégé.', th: { k: 'village', g: 0xaed581, a: 0xe0e0e0 }, svc: ['rest', 'tavern'] },
  prodence:   { sea: 'nw', pop: 1, name: 'Royaume de Prodence', sub: 'Nouveau Monde', desc: 'Le royaume d\'Elizabello II, qui frappe une fois par heure... en théorie.', th: { k: 'ville', g: 0xbcaaa4, a: 0x1976d2 }, svc: ['market', 'rest'] },
  baltigo:    { sea: 'nw', pop: 1, name: 'Baltigo', sub: 'Ancien QG révolutionnaire', desc: 'Une île de terre blanche. La base de Dragon, jusqu\'à ce que Barbe Noire passe par là.', th: { k: 'desert', g: 0xf5f5f5, a: 0x9e9e9e }, svc: ['rest'] },
  hachinosu:  { sea: 'nw', pop: 2, name: 'Hachinosu', sub: 'Île de la Ruche', desc: 'Ancien repaire des Pirates de Rocks, devenu la base de Barbe Noire.', th: { k: 'rocher', g: 0x5d4037, a: 0x212121 }, svc: ['market', 'tavern'], era: 'post' },
  karaibari:  { sea: 'nw', pop: 2, name: 'Karai Bari', sub: 'QG de la Cross Guild', desc: 'L\'île où Baggy, Crocodile et Mihawk mettent des primes... sur les Marines.', th: { k: 'ville', g: 0xbcaaa4, a: 0xd32f2f }, svc: ['market', 'tavern', 'forge'], era: 'post' },
  marinehq:   { sea: 'nw', pop: 3, name: 'QG de la Marine', sub: 'Ancienne base G-1', desc: 'Le nouveau Quartier Général, installé dans le Nouveau Monde après Marineford.', th: { k: 'forteresse', g: 0xcfd8dc, a: 0x0d47a1 }, svc: ['marinebase', 'forge', 'rest'], era: 'post' },
  foodvalten: { sea: 'nw', pop: 1, name: 'Food Valten', sub: 'Ancien royaume', desc: 'Un royaume rasé par une crise de fringale de Big Mom.', th: { k: 'ruines', g: 0xbcaaa4, a: 0xff80ab }, svc: ['rest'] },
  lodestar:   { sea: 'nw', pop: 2, name: 'Lodestar', sub: 'Dernière île du Log Pose', desc: 'La dernière île qu\'un Log Pose peut indiquer. Au-delà, seuls les Poneglyphes guident.', th: { k: 'montagne', g: 0x795548, a: 0xffd54f }, svc: ['ship', 'market', 'rest'] },

  // ───────────── LAUGH TALE ─────────────
  laughtale:  { sea: 'laughtale', pop: 3, name: 'Laugh Tale', sub: 'La dernière île', desc: 'Roger y a ri. Toi aussi, peut-être.', th: { k: 'montagne', g: 0xffe082, a: 0xffffff }, svc: [], noNav: true },
};

for (const [id, isl] of Object.entries(ISLANDS)) isl.id = id;

export function islandsOf(sea, era) {
  return Object.values(ISLANDS).filter(i => i.sea === sea && (!i.era || i.era === era));
}

// îles de départ possibles par « mer natale »
export const START_SEAS = [
  { id: 'east', label: 'East Blue', hint: 'Facile. La mer la plus faible du monde.' },
  { id: 'north', label: 'North Blue', hint: 'Facile. Royaumes froids et mafia Donquixote.' },
  { id: 'west', label: 'West Blue', hint: 'Facile. Peu d\'îles avant Grand Line.' },
  { id: 'south', label: 'South Blue', hint: 'Facile. Peu d\'îles, gens rudes.' },
  { id: 'paradise', label: 'Grand Line (Paradise)', hint: 'Difficile. Pas de rodage.' },
  { id: 'nw', label: 'Nouveau Monde', hint: 'Très difficile. Les Empereurs ne font pas de cadeau.' },
  { id: 'redline', label: 'Marie Geoise', hint: 'Réservé aux Dragons Célestes.' },
];

export const START_ISLANDS = {
  east: ['fuchsia', 'goa', 'shells', 'sirop', 'cocoyasi', 'loguetown', 'shimotsuki', 'oykot'],
  north: ['flevance', 'swallow', 'spidermiles', 'lvneel', 'germa'],
  west: ['ohara', 'godvalley'],
  south: ['baterilla', 'sorbet'],
  paradise: ['whisky', 'drum', 'alabasta', 'jaya', 'water7', 'sabaody'],
  nw: ['dressrosa', 'wano', 'elbaf', 'sphinx', 'prodence', 'lodestar'],
  redline: ['marygeoise'],
};
