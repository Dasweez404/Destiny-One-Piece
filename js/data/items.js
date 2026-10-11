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
  // ── Canon ── (doublons assumés : dans ce jeu, un fruit peut « réapparaître » ailleurs)
  mera:      { name: 'Fruit du Feu', jp: 'Mera Mera no Mi', type: 'logia', tier: 5, desc: 'Le fruit de Portgas D. Ace, réapparu après sa mort. Tu es le feu.', canon: true },
  hie:       { name: 'Fruit du Gel', jp: 'Hie Hie no Mi', type: 'logia', tier: 5, desc: 'Celui d\'Aokiji. Tu gèles la mer d\'un geste.', canon: true },
  moku_c:    { name: 'Fruit de la Fumée', jp: 'Moku Moku no Mi', type: 'logia', tier: 4, desc: 'Celui de Smoker. Tu es la fumée blanche.', canon: true },
  suna:      { name: 'Fruit du Sable', jp: 'Suna Suna no Mi', type: 'logia', tier: 4, desc: 'Celui de Crocodile. Tu dessèches tout ce que tu touches.', canon: true },
  goro:      { name: 'Fruit de la Foudre', jp: 'Goro Goro no Mi', type: 'logia', tier: 5, desc: 'Celui d\'Enel. Tu es la foudre... et tu entends tout.', canon: true },
  pika:      { name: 'Fruit de la Lumière', jp: 'Pika Pika no Mi', type: 'logia', tier: 5, desc: 'Celui de Kizaru. Rapide comme la lumière.', canon: true },
  magu:      { name: 'Fruit du Magma', jp: 'Magu Magu no Mi', type: 'logia', tier: 5, desc: 'Celui d\'Akainu. Le pouvoir le plus destructeur des Logia.', canon: true },
  yami:      { name: 'Fruit des Ténèbres', jp: 'Yami Yami no Mi', type: 'logia', tier: 5, desc: 'Celui de Barbe Noire. Tu absorbes tout, même les pouvoirs des autres.', canon: true },
  gasu:      { name: 'Fruit du Gaz', jp: 'Gasu Gasu no Mi', type: 'logia', tier: 4, desc: 'Celui de Caesar Clown. Shurororo !', canon: true },
  yuki:      { name: 'Fruit de la Neige', jp: 'Yuki Yuki no Mi', type: 'logia', tier: 3, desc: 'Celui de Monet. Tu es la tempête de neige.', canon: true },
  numa:      { name: 'Fruit du Marais', jp: 'Numa Numa no Mi', type: 'logia', tier: 3, desc: 'Celui de Caribou. Ton corps est un marais sans fond.', canon: true },
  mori:      { name: 'Fruit de la Forêt', jp: 'Mori Mori no Mi', type: 'logia', tier: 5, desc: 'Celui de Ryokugyu. Tu es la forêt, et tu te nourris de la terre.', canon: true },
  gura:      { name: 'Fruit du Tremblement', jp: 'Gura Gura no Mi', type: 'paramecia', tier: 5, desc: 'Celui de Barbe Blanche. Le pouvoir de détruire le monde.', canon: true },
  ito:       { name: 'Fruit du Fil', jp: 'Ito Ito no Mi', type: 'paramecia', tier: 5, desc: 'Celui de Doflamingo. Des fils plus tranchants que l\'acier.', canon: true },
  mochi:     { name: 'Fruit du Mochi', jp: 'Mochi Mochi no Mi', type: 'paramecia', tier: 5, desc: 'Celui de Katakuri. Un Paramecia spécial, proche du Logia.', canon: true },
  soru:      { name: 'Fruit de l\'Âme', jp: 'Soru Soru no Mi', type: 'paramecia', tier: 5, desc: 'Celui de Big Mom. Tu prends les années de vie des gens.', canon: true },
  zushi:     { name: 'Fruit de la Gravité', jp: 'Zushi Zushi no Mi', type: 'paramecia', tier: 5, desc: 'Celui de Fujitora. Tu fais tomber les météores.', canon: true },
  nikyu:     { name: 'Fruit du Coussinet', jp: 'Nikyu Nikyu no Mi', type: 'paramecia', tier: 5, desc: 'Celui de Kuma. Tu repousses tout, même la douleur des autres.', canon: true },
  jiki:      { name: 'Fruit du Magnétisme', jp: 'Jiki Jiki no Mi', type: 'paramecia', tier: 4, desc: 'Celui d\'Eustass Kid. Le métal t\'obéit.', canon: true },
  doku:      { name: 'Fruit du Poison', jp: 'Doku Doku no Mi', type: 'paramecia', tier: 4, desc: 'Celui de Magellan. Le poison qui tue tout.', canon: true },
  mero:      { name: 'Fruit de l\'Amour', jp: 'Mero Mero no Mi', type: 'paramecia', tier: 4, desc: 'Celui de Boa Hancock. Ceux qui te désirent se changent en pierre.', canon: true },
  kage:      { name: 'Fruit de l\'Ombre', jp: 'Kage Kage no Mi', type: 'paramecia', tier: 4, desc: 'Celui de Gecko Moria. Tu voles les ombres.', canon: true },
  horo:      { name: 'Fruit du Spectre', jp: 'Horo Horo no Mi', type: 'paramecia', tier: 3, desc: 'Celui de Perona. Tes fantômes rendent les gens dépressifs.', canon: true },
  bari:      { name: 'Fruit de la Barrière', jp: 'Bari Bari no Mi', type: 'paramecia', tier: 4, desc: 'Celui de Bartolomeo. Des barrières indestructibles.', canon: true },
  hobi:      { name: 'Fruit du Jouet', jp: 'Hobi Hobi no Mi', type: 'paramecia', tier: 4, desc: 'Celui de Sugar. Tu transformes les gens en jouets, et le monde les oublie.', canon: true },
  toshi:     { name: 'Fruit de l\'Âge', jp: 'Toshi Toshi no Mi', type: 'paramecia', tier: 3, desc: 'Celui de Bonney. Tu changes l\'âge des gens (et le tien).', canon: true },
  shiro:     { name: 'Fruit du Château', jp: 'Shiro Shiro no Mi', type: 'paramecia', tier: 4, desc: 'Celui de Capone Bege. Ton corps est une forteresse.', canon: true },
  sube:      { name: 'Fruit de la Glisse', jp: 'Sube Sube no Mi', type: 'paramecia', tier: 2, desc: 'Celui d\'Alvida. Tout glisse sur toi, même les coups. Et tu deviens superbe.', canon: true },
  bane:      { name: 'Fruit du Ressort', jp: 'Bane Bane no Mi', type: 'paramecia', tier: 2, desc: 'Celui de Bellamy. Tes jambes deviennent des ressorts.', canon: true },
  supa:      { name: 'Fruit de la Lame', jp: 'Supa Supa no Mi', type: 'paramecia', tier: 3, desc: 'Celui de Mr. 1. Tout ton corps est une lame.', canon: true },
  doru:      { name: 'Fruit de la Cire', jp: 'Doru Doru no Mi', type: 'paramecia', tier: 3, desc: 'Celui de Mr. 3. Ta cire est dure comme l\'acier.', canon: true },
  kilo:      { name: 'Fruit du Poids', jp: 'Kilo Kilo no Mi', type: 'paramecia', tier: 2, desc: 'Celui de Miss Valentine. De 1 à 10 000 kilos.', canon: true },
  noro:      { name: 'Fruit de la Lenteur', jp: 'Noro Noro no Mi', type: 'paramecia', tier: 2, desc: 'Celui de Foxy. Ton rayon ralentit tout pendant 30 secondes.', canon: true },
  awa:       { name: 'Fruit de la Bulle', jp: 'Awa Awa no Mi', type: 'paramecia', tier: 2, desc: 'Celui de Kalifa. Tes bulles lavent la force des gens.', canon: true },
  mane:      { name: 'Fruit du Mime', jp: 'Mane Mane no Mi', type: 'paramecia', tier: 2, desc: 'Celui de Bon Clay. Tu copies le visage de quiconque tu touches.', canon: true },
  chiyu:     { name: 'Fruit du Soin', jp: 'Chiyu Chiyu no Mi', type: 'paramecia', tier: 3, desc: 'Celui de Mansherry. Tes larmes soignent toutes les blessures.', canon: true },
  ishi:      { name: 'Fruit de la Pierre', jp: 'Ishi Ishi no Mi', type: 'paramecia', tier: 4, desc: 'Celui de Pica. Tu fusionnes avec la roche.', canon: true },
  ope_c:     { name: 'Fruit de l\'Opération', jp: 'Ope Ope no Mi', type: 'paramecia', tier: 5, desc: 'Celui de Law. Le fruit ultime, qui peut même offrir l\'immortalité.', canon: true },
  phenix:    { name: 'Fruit de l\'Oiseau, modèle Phénix', jp: 'Tori Tori no Mi', type: 'zoan_mythique', tier: 5, desc: 'Celui de Marco. Des flammes bleues qui régénèrent tout.', canon: true },
  seiryu:    { name: 'Fruit du Poisson, modèle Dragon Azur', jp: 'Uo Uo no Mi', type: 'zoan_mythique', tier: 5, desc: 'Celui de Kaido. Un dragon qui crache le feu et commande les nuages.', canon: true },
  daibutsu:  { name: 'Fruit de l\'Homme, modèle Bouddha', jp: 'Hito Hito no Mi', type: 'zoan_mythique', tier: 5, desc: 'Celui de Sengoku. Un Bouddha géant aux ondes de choc dévastatrices.', canon: true },
  okuchi:    { name: 'Fruit du Chien, modèle Okuchi no Makami', jp: 'Inu Inu no Mi', type: 'zoan_mythique', tier: 5, desc: 'Celui de Yamato. Le loup divin qui protège Wano.', canon: true },
  hito_c:    { name: 'Fruit de l\'Homme', jp: 'Hito Hito no Mi', type: 'zoan', tier: 2, desc: 'Celui de Chopper. Un animal qui devient humain... ou l\'inverse.', canon: true },
  ptera:     { name: 'Fruit du Dragon, modèle Ptéranodon', jp: 'Ryu Ryu no Mi', type: 'zoan_antique', tier: 4, desc: 'Celui de King. Un reptile volant indestructible.', canon: true },
  mammouth:  { name: 'Fruit de l\'Éléphant, modèle Mammouth', jp: 'Zou Zou no Mi', type: 'zoan_antique', tier: 4, desc: 'Celui de Jack. Une force titanesque.', canon: true },
  leopard_c: { name: 'Fruit du Chat, modèle Léopard', jp: 'Neko Neko no Mi', type: 'zoan', tier: 4, desc: 'Celui de Rob Lucci. Un léopard de combat.', canon: true },
  gomu_c:    { name: 'Fruit de l\'Homme, modèle Nika', jp: 'Hito Hito no Mi', type: 'zoan_mythique', tier: 5, desc: 'Le fruit du « Dieu du Soleil ». Le Gouvernement l\'appelait Gomu Gomu. Si tu le manges... le monde va trembler.', canon: true },
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

// ───────────── Personnalisation du navire ─────────────
// Modèles par rang : chaque amélioration propose plusieurs coques au choix.
// bonus : hp (coque), nav (navigation), combat, morale (par escale), heal (PV par escale), income (berrys par escale, x prime du rang), stealth (vitesse), coated
export const SHIP_MODELS = {
  barque:     { tier: 1, name: 'Barque', emoji: '🛶', desc: 'Deux rames, une voile, beaucoup d\'espoir.', bonus: {} },
  radeau:     { tier: 1, name: 'Radeau de fortune', emoji: '🪵', desc: 'Des tonneaux, des cordes, et ça flotte. La plupart du temps.', bonus: { hp: -10, morale: 1 } },
  canot:      { tier: 1, name: 'Canot de pêche', emoji: '🎣', desc: 'Il sent le poisson, mais on mange toujours.', bonus: { heal: 4 } },
  caravelle:  { tier: 2, name: 'Caravelle', emoji: '⛵', desc: 'Le navire des débuts de légende. Équilibré.', bonus: { hp: 15 } },
  sloop:      { tier: 2, name: 'Sloop rapide', emoji: '💨', desc: 'Fin et nerveux, il remonte au vent.', bonus: { nav: 2 } },
  cotre:      { tier: 2, name: 'Cotre de contrebandier', emoji: '🕶️', desc: 'Un double fond pour cacher ce qui doit l\'être.', bonus: { stealth: 2, income: 0.02 }, price: 0.8 },
  brick:      { tier: 3, name: 'Brick de combat', emoji: '🚢', desc: 'Deux mâts et une batterie de canons.', bonus: { combat: 2 } },
  sousmarin:  { tier: 3, name: 'Sous-marin', emoji: '🟡', desc: 'Comme celui d\'un certain chirurgien. Discret, et déjà prêt pour les profondeurs.', bonus: { stealth: 3, coated: true, hp: -10 } },
  restaurant: { tier: 3, name: 'Navire-restaurant', emoji: '🍽️', desc: 'Une vraie cuisine à bord. L\'équipage ne veut plus en descendre.', bonus: { morale: 4, heal: 8 } },
  galion:     { tier: 4, name: 'Galion de guerre', emoji: '🛳️', desc: 'Trois ponts, quarante canons. On l\'entend arriver.', bonus: { combat: 4 } },
  marchand:   { tier: 4, name: 'Galion marchand', emoji: '💰', desc: 'Une cale immense : tu commerces à chaque escale.', bonus: { income: 0.08, hp: 20 } },
  aubes:      { tier: 4, name: 'Navire à aubes de Water 7', emoji: '⚙️', desc: 'Des roues à aubes et un moteur au cola. Il avance même sans vent.', bonus: { nav: 3, hp: 10 } },
  adam:       { tier: 5, name: 'Navire en bois d\'Adam', emoji: '🌳', desc: 'Le bois le plus solide du monde. Le rêve de tout charpentier.', bonus: { hp: 40, nav: 2, combat: 2, morale: 2 } },
  baleine:    { tier: 5, name: 'Navire-baleine', emoji: '🐋', desc: 'Une forteresse flottante à tête de baleine, comme le Moby Dick.', bonus: { hp: 80, combat: 5 } },
  celeste:    { tier: 5, name: 'Navire-nuage', emoji: '☁️', desc: 'Des Dials de vent et des voiles de nuage de Skypiea. Rapide comme la brise.', bonus: { nav: 5, stealth: 2 } },
};
for (const [id, m] of Object.entries(SHIP_MODELS)) m.id = id;
export const DEFAULT_MODEL = { 1: 'barque', 2: 'caravelle', 3: 'brick', 4: 'galion', 5: 'adam' };

// Aménagements à installer au chantier naval
export const SHIP_MODS = {
  canons:     { name: 'Batterie de canons', emoji: '💣', price: 4_000_000, desc: '+2 au combat.', bonus: { combat: 2 } },
  coque:      { name: 'Coque renforcée', emoji: '🛡️', price: 3_000_000, desc: '+40 de coque.', bonus: { hp: 40 } },
  voiles:     { name: 'Voilure de course', emoji: '🪁', price: 3_000_000, desc: '+2 en navigation.', bonus: { nav: 2 } },
  infirmerie: { name: 'Infirmerie', emoji: '🩺', price: 2_500_000, desc: '+8 PV à chaque escale.', bonus: { heal: 8 } },
  cuisine:    { name: 'Grande cuisine', emoji: '🍖', price: 2_000_000, desc: '+3 de moral à chaque escale.', bonus: { morale: 3 } },
  vigie:      { name: 'Nid-de-pie', emoji: '🔭', price: 1_500_000, desc: 'Moins de mauvaises rencontres en mer.', bonus: { lookout: true } },
  cale:       { name: 'Cale secrète', emoji: '🗝️', price: 2_000_000, desc: 'Moitié moins de berrys perdus quand tu es mis K.O.', bonus: { vault: true } },
  burst:      { name: 'Coup de Burst', emoji: '🚀', price: 12_000_000, desc: 'Un canon à air qui fait voler le navire : +3 navigation.', bonus: { nav: 3 } },
  aquarium:   { name: 'Aquarium-salon', emoji: '🐠', price: 6_000_000, desc: 'Un salon avec vue sur un aquarium. +2 de moral à chaque escale.', bonus: { morale: 2, heal: 3 } },
};

export const FIGUREHEADS = {
  aucune: { name: 'Aucune', emoji: '▫️', color: 0xfff3e0 },
  mouton: { name: 'Tête de mouton', emoji: '🐑', color: 0xffffff },
  lion:   { name: 'Lion solaire', emoji: '🦁', color: 0xffa726 },
  dragon: { name: 'Dragon', emoji: '🐉', color: 0x43a047 },
  sirene: { name: 'Sirène', emoji: '🧜', color: 0xf48fb1 },
  crane:  { name: 'Crâne', emoji: '💀', color: 0xeeeeee },
  mouette:{ name: 'Mouette', emoji: '🕊️', color: 0x90caf9 },
  baleine:{ name: 'Baleine', emoji: '🐳', color: 0x78909c },
  serpent:{ name: 'Serpent de mer', emoji: '🐍', color: 0x7e57c2 },
};

export const SAIL_COLORS = {
  noir: '#1b1b1b', blanc: '#f5f5f5', rouge: '#b71c1c', bleu: '#1565c0', vert: '#2e7d32', violet: '#6a1b9a', or: '#f9a825', rose: '#f06292', rayé: '#e0e0e0',
};
