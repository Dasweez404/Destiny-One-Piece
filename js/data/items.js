// Fruits du Démon, armes, navires, rôles d'équipage.
// Les fruits « inédits » sont des créations du jeu (le canon a déjà ses propriétaires).

export const FRUIT_TYPES = {
  paramecia: { name: 'Paramecia', emoji: '🌀' },
  zoan: { name: 'Zoan', emoji: '🐾' },
  zoan_antique: { name: 'Zoan antique', emoji: '🦖' },
  zoan_mythique: { name: 'Zoan mythique', emoji: '🐲' },
  logia: { name: 'Logia', emoji: '🌪️' },
  smile: { name: 'SMILE (artificiel)', emoji: '😁' },
};

// tier : 1 (gag) → 5 (légendaire). prix en berrys.
export const FRUITS = {
  // Paramecia
  kyabe:     { name: 'Fruit du Chou', jp: 'Kyabe Kyabe no Mi', type: 'paramecia', tier: 1, desc: 'Tu peux transformer n\'importe quel objet en chou. Les ennemis ont faim.' },
  hige:      { name: 'Fruit de la Moustache', jp: 'Hige Hige no Mi', type: 'paramecia', tier: 1, desc: 'Ta moustache pousse à volonté. Elle est très solide. Personne ne te prend au sérieux.' },
  shakkin:   { name: 'Fruit de la Dette', jp: 'Shakkin Shakkin no Mi', type: 'paramecia', tier: 2, desc: 'Ceux qui te frappent te doivent de l\'argent. Les créanciers ont peur de toi.' },
  pyon:      { name: 'Fruit du Rebond', jp: 'Pyon Pyon no Mi', type: 'paramecia', tier: 2, desc: 'Tu rebondis sur tout, même sur l\'air. Mal de mer garanti.' },
  nemu:      { name: 'Fruit du Sommeil', jp: 'Nemu Nemu no Mi', type: 'paramecia', tier: 3, desc: 'Tu endors ce que tu touches. Toi aussi, parfois.' },
  kusari:    { name: 'Fruit de la Chaîne', jp: 'Kusari Kusari no Mi', type: 'paramecia', tier: 3, desc: 'Tu produis des chaînes d\'acier depuis ton corps.' },
  hibi:      { name: 'Fruit de l\'Écho', jp: 'Hibi Hibi no Mi', type: 'paramecia', tier: 3, desc: 'Tu renvoies les sons et les chocs. Idéal pour les concerts et les coups de poing.' },
  ikari:     { name: 'Fruit de l\'Ancre', jp: 'Ikari Ikari no Mi', type: 'paramecia', tier: 3, desc: 'Tu fixes n\'importe quoi dans l\'espace, comme une ancre. Même un boulet de canon.' },
  ana:       { name: 'Fruit du Trou', jp: 'Ana Ana no Mi', type: 'paramecia', tier: 4, desc: 'Tu perces des trous dans les murs, les gens, la mer... et parfois l\'espace.' },
  kane:      { name: 'Fruit de la Cloche', jp: 'Kane Kane no Mi', type: 'paramecia', tier: 4, desc: 'Ton corps devient une cloche de bronze. Chaque coup résonne sur des kilomètres.' },
  atsu:      { name: 'Fruit de la Pression', jp: 'Atsu Atsu no Mi', type: 'paramecia', tier: 4, desc: 'Tu contrôles la pression : écrase tes ennemis ou fais exploser les navires.' },
  toki2:     { name: 'Fruit du Temps Volé', jp: 'Nusu Nusu no Mi', type: 'paramecia', tier: 5, desc: 'Tu voles quelques secondes à ceux que tu touches. Assez pour gagner n\'importe quel duel.' },
  // Zoan
  albatros:  { name: 'Fruit de l\'Oiseau, modèle Albatros', jp: 'Tori Tori no Mi', type: 'zoan', tier: 2, desc: 'Tu deviens albatros. Tu voles, tu planes, tu fais caca sur les Marines.' },
  bouledogue:{ name: 'Fruit du Chien, modèle Bouledogue', jp: 'Inu Inu no Mi', type: 'zoan', tier: 2, desc: 'Tu deviens bouledogue. Mâchoire terrible, bave aussi.' },
  tortue:    { name: 'Fruit de la Tortue', jp: 'Kame Kame no Mi', type: 'zoan', tier: 2, desc: 'Tu deviens une tortue. Carapace imprenable, vitesse discutable.' },
  gorille:   { name: 'Fruit du Singe, modèle Gorille', jp: 'Saru Saru no Mi', type: 'zoan', tier: 3, desc: 'Tu deviens gorille. Force brute et tambourinage de poitrine.' },
  ours:      { name: 'Fruit de l\'Ours, modèle Grizzly', jp: 'Kuma Kuma no Mi', type: 'zoan', tier: 3, desc: 'Tu deviens grizzly. Aucun rapport avec un certain Corsaire.' },
  // Zoan antique
  ankylo:    { name: 'Fruit du Dragon, modèle Ankylosaure', jp: 'Ryu Ryu no Mi', type: 'zoan_antique', tier: 4, desc: 'Une armure vivante avec une massue au bout de la queue.' },
  trex:      { name: 'Fruit du Dragon, modèle Tyrannosaure', jp: 'Ryu Ryu no Mi', type: 'zoan_antique', tier: 4, desc: 'Des mâchoires qui broient l\'acier. Les bras, par contre...' },
  // Zoan mythique
  minotaure: { name: 'Fruit du Bœuf, modèle Minotaure', jp: 'Ushi Ushi no Mi', type: 'zoan_mythique', tier: 5, desc: 'Un taureau titanesque qui ne se perd jamais dans un labyrinthe.' },
  thunderbird:{ name: 'Fruit de l\'Oiseau, modèle Thunderbird', jp: 'Tori Tori no Mi', type: 'zoan_mythique', tier: 5, desc: 'Un oiseau-tonnerre légendaire. Tes ailes font la pluie et l\'orage.' },
  jormungand:{ name: 'Fruit du Serpent, modèle Jörmungand', jp: 'Hebi Hebi no Mi', type: 'zoan_mythique', tier: 5, desc: 'Le serpent qui encercle le monde. Les géants d\'Elbaf te regardent bizarrement.' },
  // Logia
  kiri:      { name: 'Fruit de la Brume', jp: 'Kiri Kiri no Mi', type: 'logia', tier: 4, desc: 'Ton corps devient brume. On ne te touche plus, on ne te voit plus.' },
  kaze:      { name: 'Fruit du Vent', jp: 'Kaze Kaze no Mi', type: 'logia', tier: 5, desc: 'Tu es le vent. Plus jamais de calme plat pour ton navire.' },
  hai:       { name: 'Fruit de la Cendre', jp: 'Hai Hai no Mi', type: 'logia', tier: 4, desc: 'Tu deviens cendre : tu étouffes, tu aveugles, tu reviens de tout.' },
  shio:      { name: 'Fruit du Sel', jp: 'Shio Shio no Mi', type: 'logia', tier: 4, desc: 'Tu es le sel. Tu dessèches tout. Ironique pour un pirate qui ne sait plus nager.' },
  // SMILE
  smile:     { name: 'SMILE', jp: 'Fruit artificiel', type: 'smile', tier: 1, desc: 'Un fruit fabriqué à Punk Hazard. 1 chance sur 10 de te donner un pouvoir animal. Sinon, tu ris. Pour toujours.' },
  // Canon, disponible uniquement avant Marineford... puis au Colisée de Dressrosa
  mera:      { name: 'Fruit du Feu', jp: 'Mera Mera no Mi', type: 'logia', tier: 5, desc: 'Le fruit de Portgas D. Ace, réapparu après sa mort. Tu es le feu.', canon: true },
};
for (const [id, f] of Object.entries(FRUITS)) f.id = id;

export const fruitPrice = f => ({ 1: 300_000, 2: 5_000_000, 3: 30_000_000, 4: 120_000_000, 5: 400_000_000 })[f.tier];
export const fruitPower = (f, awakened) => (f ? f.tier * 2.2 + (f.type === 'logia' ? 2 : 0) + (f.type === 'zoan_mythique' ? 1.5 : 0) + (awakened ? 5 : 0) : 0);

export const WEAPON_TYPES = {
  sabre: '🗡️ Sabre', double: '⚔️ Deux sabres', pistolet: '🔫 Pistolet', fusil: '🎯 Fusil',
  lance: '🔱 Lance', hache: '🪓 Hache', poings: '🥊 Gantelets', baton: '🪄 Bâton',
  kanabo: '🏏 Kanabō', fouet: '➰ Fouet', chaine: '⛓️ Chaîne', arc: '🏹 Arc',
  lancepierre: '🪃 Lance-pierre', bazooka: '💣 Bazooka', dial: '🐚 Dial', eventail: '🪭 Éventail de guerre',
  bouclier: '🛡️ Bouclier', griffes: '🐾 Griffes', ancre: '⚓ Ancre', jitte: '🪝 Jitte',
};

// tier 1-5 ; seastone : efficace contre les utilisateurs de fruits ; cursed : maudit
export const WEAPONS = {
  baton_bois:   { name: 'Bâton de marche', type: 'baton', tier: 1, desc: 'Un bâton. C\'est tout. Mais tu l\'as bien choisi.' },
  sabre_rouille:{ name: 'Sabre rouillé', type: 'sabre', tier: 1, desc: 'Trouvé dans un tonneau. Il coupe surtout les doigts de son propriétaire.' },
  pistolet_silex:{ name: 'Pistolet à silex', type: 'pistolet', tier: 1, desc: 'Un coup, puis dix minutes de rechargement.' },
  lancepierre:  { name: 'Lance-pierre de fortune', type: 'lancepierre', tier: 1, desc: 'Munitions : cailloux, œufs pourris, sauce piquante.' },
  gants_cuir:   { name: 'Gants de boxe cloutés', type: 'poings', tier: 1, desc: 'Pour ceux qui règlent tout avec les poings.' },
  chaine_ancre: { name: 'Chaîne d\'amarrage', type: 'chaine', tier: 2, desc: 'Arrachée d\'un navire. Lourde, bruyante, efficace.' },
  wazamono:     { name: 'Sabre Wazamono', type: 'sabre', tier: 2, desc: 'Un sabre de qualité, l\'un des 50 Wazamono.' },
  mousquet:     { name: 'Mousquet de la Marine', type: 'fusil', tier: 2, desc: 'Modèle réglementaire, « emprunté ».' },
  hache_bucheron:{ name: 'Hache de bûcheron d\'Elbaf (taille humaine)', type: 'hache', tier: 2, desc: 'Une hachette pour géant, donc une hache à deux mains pour toi.' },
  fouet_cuir:   { name: 'Fouet de dompteur', type: 'fouet', tier: 2, desc: 'Utilisé dans un cirque. Les lions s\'en souviennent.' },
  dial_impact:  { name: 'Dial d\'impact', type: 'dial', tier: 3, desc: 'Un coquillage de Skypiea qui stocke les chocs et les renvoie. Ton bras s\'en souviendra.' },
  eventail:     { name: 'Éventail de guerre en acier', type: 'eventail', tier: 2, desc: 'Élégant, tranchant, parfait pour les entrées dramatiques.' },
  arc_kuja:     { name: 'Arc-serpent Kuja', type: 'arc', tier: 3, desc: 'Un arc vivant, à la manière des guerrières d\'Amazon Lily.' },
  jitte_granit: { name: 'Jitte en granit marin', type: 'jitte', tier: 3, seastone: true, desc: 'Une arme en granit marin : les utilisateurs de fruits du démon s\'effondrent au contact.' },
  bazooka:      { name: 'Bazooka de Water 7', type: 'bazooka', tier: 3, desc: 'Fabriqué par un charpentier qui avait trop bu. Puissant.' },
  griffes:      { name: 'Griffes de Mink', type: 'griffes', tier: 3, desc: 'Des griffes d\'acier à la manière des guerriers de Zou.' },
  ryo_wazamono: { name: 'Sabre Ryo Wazamono', type: 'sabre', tier: 4, desc: 'L\'un des 21 grands sabres. Il a déjà coupé des navires.' },
  kanabo:       { name: 'Kanabō clouté de Wano', type: 'kanabo', tier: 4, desc: 'Une massue de fer comme celles des oni d\'Onigashima.' },
  lance_kuja:   { name: 'Lance de Sabaody en granit marin', type: 'lance', tier: 4, seastone: true, desc: 'Une lance à pointe de granit marin. Les logias détestent ça.' },
  canon_bras:   { name: 'Canon de bras de Vegapunk', type: 'bazooka', tier: 4, desc: 'Une arme laser expérimentale d\'Egghead. Ne pas viser vers soi.' },
  ancre_geante: { name: 'Ancre de navire de guerre', type: 'ancre', tier: 4, desc: 'Une ancre de 2 tonnes maniée comme une masse. Il faut un dos solide.' },
  nidai_kitetsu:{ name: 'Nidai Kitetsu', type: 'sabre', tier: 5, cursed: true, desc: 'Un sabre maudit du forgeron Kitetsu. Tous ses propriétaires sont morts. Tous.' },
  o_wazamono:   { name: 'Sabre O Wazamono', type: 'sabre', tier: 5, desc: 'L\'un des 12 suprêmes sabres. Il réclame un sabreur à sa mesure.' },
  bouclier_elbaf:{ name: 'Bouclier de guerrier d\'Elbaf', type: 'bouclier', tier: 3, desc: 'Un bouclier taillé dans le bois de l\'Arbre Adam.' },
};
for (const [id, w] of Object.entries(WEAPONS)) w.id = id;

export const weaponPrice = w => ({ 1: 200_000, 2: 2_000_000, 3: 12_000_000, 4: 60_000_000, 5: 250_000_000 })[w.tier];
export const weaponPower = w => (w ? w.tier * 1.8 : 0);

export const SHIPS = [
  { tier: 1, name: 'Barque', emoji: '🛶', hp: 40, crew: 3, price: 0 },
  { tier: 2, name: 'Caravelle', emoji: '⛵', hp: 70, crew: 6, price: 5_000_000 },
  { tier: 3, name: 'Brick', emoji: '🚢', hp: 110, crew: 10, price: 30_000_000 },
  { tier: 4, name: 'Galion', emoji: '🛳️', hp: 160, crew: 10, price: 120_000_000 },
  { tier: 5, name: 'Navire en bois d\'Adam', emoji: '🌳', hp: 230, crew: 10, price: 400_000_000 },
];

export const ROLES = {
  capitaine:   { name: 'Capitaine', emoji: '🏴‍☠️', stat: 'charisme', desc: 'Tu mènes. Les autres suivent (en principe).' },
  bretteur:    { name: 'Bretteur', emoji: '⚔️', stat: 'force', desc: 'L\'épée d\'abord, les questions ensuite.' },
  combattant:  { name: 'Combattant', emoji: '🥋', stat: 'force', desc: 'Les poings, les pieds, la tête si besoin.' },
  navigateur:  { name: 'Navigateur', emoji: '🧭', stat: 'navigation', desc: 'Sans toi, tout le monde finit dans le Calm Belt.' },
  cuisinier:   { name: 'Cuisinier', emoji: '🍖', stat: 'volonte', desc: 'Le moral de l\'équipage passe par l\'estomac.' },
  medecin:     { name: 'Médecin', emoji: '🩺', stat: 'intel', desc: 'Tu recouds les gens. Parfois tu les sauves de la mort.' },
  sniper:      { name: 'Sniper', emoji: '🎯', stat: 'vitesse', desc: 'Tu touches ce que tu vises. Tu mens aussi un peu.' },
  charpentier: { name: 'Charpentier', emoji: '🔨', stat: 'force', desc: 'Le navire, c\'est ton enfant.' },
  musicien:    { name: 'Musicien', emoji: '🎻', stat: 'charisme', desc: 'Il faut bien chanter le Saké de Binks.' },
  archeologue: { name: 'Archéologue', emoji: '📜', stat: 'intel', desc: 'Tu sais lire les Poneglyphes. C\'est un crime, d\'ailleurs.' },
  timonier:    { name: 'Timonier', emoji: '☸️', stat: 'navigation', desc: 'Tu tiens la barre même dans un cyclone.' },
};

export const STATS = {
  force: { name: 'Force', emoji: '💪' },
  vitesse: { name: 'Vitesse', emoji: '💨' },
  intel: { name: 'Intelligence', emoji: '🧠' },
  charisme: { name: 'Charisme', emoji: '✨' },
  navigation: { name: 'Navigation', emoji: '🧭' },
  volonte: { name: 'Volonté', emoji: '🔥' },
};

export const ITEMS = {
  vivre_card: { name: 'Vivre Card', emoji: '📄', desc: 'Un morceau de papier qui indique la position de son propriétaire.' },
  eternal_pose: { name: 'Eternal Pose', emoji: '🧭', desc: 'Pointe toujours vers la même île. Permet de choisir sa route.' },
  den_den: { name: 'Den Den Mushi', emoji: '🐌', desc: 'Un escargophone. Tu peux appeler à l\'aide.' },
  recette_sanji: { name: 'Livre de recettes du Baratie', emoji: '📕', desc: 'Le moral de l\'équipage remonte plus vite.' },
  poneglyph_rubbing: { name: 'Relevé de Poneglyphe', emoji: '🗿', desc: 'Une copie d\'un Poneglyphe routier.' },
  tresor_carte: { name: 'Carte au trésor douteuse', emoji: '🗺️', desc: 'Peut-être un trésor. Peut-être un piège.' },
  wanted_poster: { name: 'Avis de recherche encadré', emoji: '🖼️', desc: 'Ta première prime. Tu l\'as encadrée.' },
  seastone_menottes: { name: 'Menottes en granit marin', emoji: '⛓️', desc: 'Pour capturer un utilisateur de fruit. Ou être capturé.' },
};
