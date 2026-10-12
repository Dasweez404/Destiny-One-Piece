// Noms d'équipage inédits, légendes (mode Histoire), badges, comparaisons canon, défis du jour.

export const CREW_FIRST = ['Barnabé', 'Lulu', 'Gaston', 'Mira', 'Tobias', 'Zelda', 'Hector', 'Pim', 'Rosa', 'Igor', 'Nina', 'Bastien', 'Olga', 'Félix', 'Yoko', 'Anselme', 'Capucine', 'Dédé', 'Esmeralda', 'Fifi', 'Gontran', 'Hortense', 'Isidore', 'Jojo', 'Kiki', 'Léon', 'Margot', 'Népomucène', 'Octave', 'Paquita', 'Quentin', 'Raoul', 'Suzon', 'Théo', 'Ursule', 'Victor', 'Wanda', 'Xavière', 'Yvon', 'Zéphyr', 'Bao', 'Chiyo', 'Diego', 'Elio', 'Ferro', 'Gin', 'Hana', 'Ivo', 'Jun', 'Kaya-Lou', 'Lazare', 'Momo', 'Noé', 'Otto', 'Pao', 'Rémi', 'Sasha', 'Taïko', 'Umi', 'Vito'];
export const CREW_EPI = ['« Trois-Doigts »', 'la Brume', 'Pied-de-Sel', '« le Muet » (qui parle tout le temps)', 'aux Cent Dettes', 'le Rouillé', '« Gros Bras »', 'la Mouette', 'Œil-de-Verre', 'le Pleurnichard', '« Petite Ancre »', 'des Abysses', 'le Bienheureux', '« Double Ration »', 'la Lame', 'le Sourd', 'Mal-de-Mer', 'Barbe-Courte', 'la Pieuvre', '« Pas-de-Chance »', 'le Bavard', '« Mille Cicatrices »', 'la Bourrasque', 'Coup-de-Tête', 'le Tatoué', 'la Moustache', 'Dent-d\'Or', 'le Somnambule', '« Zéro Berry »', 'Ventre-Creux', 'la Sirène (qui chante faux)', 'le Pirate du Dimanche', 'Main-de-Fer', '« Boussole Cassée »', 'le Philosophe', 'la Furie', 'Crâne-Dur', 'le Gentil', 'Ombre-Longue', '« l\'Ancien Marine »'];
export const CREW_TRAITS = [
  'Ne sait pas nager. N\'a même pas de fruit du démon.', 'Parle à sa cuillère. La cuillère répond, selon lui.', 'Se perd dans les couloirs du navire.',
  'Mange pour quatre. Pèse pour deux.', 'Pleure à chaque départ d\'île.', 'Ancien Marine, garde ses réflexes de salut.',
  'Collectionne les avis de recherche des autres.', 'Ronfle comme un Roi des Mers.', 'A peur des pigeons, mais pas des Amiraux.',
  'Prétend avoir bu un verre avec Roger.', 'Écrit des poèmes sur la mer. Ils sont mauvais.', 'Toujours le premier à la bagarre, le dernier au réveil.',
  'Dit « c\'est pas moi » avant même qu\'on l\'accuse.', 'Garde une photo de sa mère dans son chapeau.', 'Ne se sépare jamais de son tonneau de saké.',
  'Veut voir l\'All Blue avant de mourir.', 'Fait des pompes pendant les tempêtes.', 'Croit que la Terre est plate (il a vu la Red Line).',
  'Chante faux, mais avec cœur.', 'A juré de ne jamais manger de poisson. Problématique.', 'Dessine des cartes au trésor imaginaires.',
  'Pense être un descendant d\'un D.', 'Rit tout le temps. On ne sait pas pourquoi.', 'Ne dort que debout, comme un cheval.',
];

// Mode Histoire : revivre et faire mieux qu'une légende
export const LEGENDS = [
  {
    id: 'luffy', name: 'Monkey D. Luffy', emoji: '👒', era: 'pre', faction: 'pirate', role: 'capitaine', sea: 'east', island: 'fuchsia', age: 17,
    stats: { force: 8, vitesse: 6, intel: 2, charisme: 9, navigation: 1, volonte: 10 }, fruit: 'gomu', weapon: null, roi: true,
    canon: 'Empereur, 3 relevés de Poneglyphes routiers, prime de 3 milliards.', target: { progress: 7, label: 'Obtenir les 4 Poneglyphes routiers' },
    intro: 'Un garçon au chapeau de paille quitte Fuchsia en barque. Il veut devenir le Roi des Pirates. Il ne sait pas nager. Il ne sait pas naviguer.',
  },
  {
    id: 'law', name: 'Trafalgar D. Water Law', emoji: '💉', era: 'pre', faction: 'pirate', role: 'medecin', sea: 'north', island: 'swallow', age: 18,
    stats: { force: 6, vitesse: 7, intel: 10, charisme: 6, navigation: 4, volonte: 8 }, fruit: 'ope', weapon: 'ryo_wazamono',
    canon: 'Supernova, Corsaire, vaincu par Barbe Noire avant d\'atteindre un Poneglyphe.', target: { progress: 4, label: 'Obtenir 1 Poneglyphe routier' },
    intro: 'Le survivant de Flevance. Il a mangé le fruit qui a coûté la vie à Corazon. Il a un plan. Il a toujours un plan.',
  },
  {
    id: 'baggy', name: 'Baggy le Clown', emoji: '🤡', era: 'pre', faction: 'pirate', role: 'capitaine', sea: 'east', island: 'orange', age: 37,
    stats: { force: 4, vitesse: 4, intel: 4, charisme: 10, navigation: 4, volonte: 3 }, fruit: 'bara', weapon: 'pistolet_silex',
    canon: 'Devenu Empereur par un incroyable malentendu.', target: { faction: 'empereur', label: 'Devenir Empereur (et mériter le titre)' },
    intro: 'Ancien mousse de Roger. Le monde le prend pour un génie. Il est surtout très, très chanceux.',
  },
  {
    id: 'koby', name: 'Koby', emoji: '🌸', era: 'pre', faction: 'marine', role: 'combattant', sea: 'east', island: 'shells', age: 16,
    stats: { force: 4, vitesse: 5, intel: 6, charisme: 6, navigation: 3, volonte: 9 }, fruit: null, weapon: null,
    canon: 'Capitaine, Héros de Rocky Port, membre du SWORD.', target: { rank: 8, label: 'Devenir Contre-amiral' },
    intro: 'L\'ex-mousse d\'Alvida a enfin rejoint la Marine. Il veut devenir Amiral. Il pleure beaucoup.',
  },
  {
    id: 'smoker', name: 'Smoker', emoji: '💨', era: 'pre', faction: 'marine', role: 'combattant', sea: 'east', island: 'loguetown', age: 34,
    stats: { force: 8, vitesse: 6, intel: 6, charisme: 5, navigation: 4, volonte: 9 }, fruit: 'moku', weapon: 'jitte_granit',
    canon: 'Vice-amiral, commandant de la G-5.', target: { rank: 9, label: 'Devenir Vice-amiral' },
    intro: 'Le Chasseur blanc, capitaine à Loguetown. Il fait ce qu\'il veut de sa justice.',
  },
  {
    id: 'sabo', name: 'Sabo', emoji: '🎩', era: 'pre', faction: 'revo', role: 'combattant', sea: 'east', island: 'goa', age: 17,
    stats: { force: 9, vitesse: 8, intel: 7, charisme: 7, navigation: 4, volonte: 8 }, fruit: null, weapon: 'baton_bois',
    canon: 'Chef d\'état-major de l\'Armée Révolutionnaire, héritier du Mera Mera.', target: { rank: 4, label: 'Devenir Chef d\'état-major' },
    intro: 'Un fils de noble qui a fui le royaume de Goa. Il a survécu à un tir de Dragon Céleste. Il a oublié pourquoi il se bat, mais il se bat.',
  },
  {
    id: 'lucci', name: 'Rob Lucci', emoji: '🐆', era: 'pre', faction: 'gouv', role: 'combattant', sea: 'paradise', island: 'water7', age: 28,
    stats: { force: 10, vitesse: 9, intel: 6, charisme: 3, navigation: 4, volonte: 9 }, fruit: 'neko_leopard', weapon: null,
    canon: 'Agent du CP9, puis du CP0. Battu deux fois par Luffy.', target: { rank: 5, label: 'Atteindre le CP0' },
    intro: 'Agent infiltré chez Galley-La depuis cinq ans. Son pigeon parle à sa place. Sa mission : les plans de Pluton.',
  },
  {
    id: 'ace', name: 'Portgas D. Ace', emoji: '🔥', era: 'pre', faction: 'pirate', role: 'capitaine', sea: 'south', island: 'baterilla', age: 17,
    stats: { force: 9, vitesse: 7, intel: 5, charisme: 8, navigation: 5, volonte: 9 }, fruit: 'mera', weapon: null, roi: true,
    canon: 'Commandant de la 2e flotte de Barbe Blanche, mort à Marineford.', target: { progress: 4, label: 'Survivre et obtenir 1 Poneglyphe routier' },
    intro: 'Le fils de Roger. Il porte le nom de sa mère. Il se demande s\'il méritait de naître.',
  },
  {
    id: 'robin', name: 'Nico Robin', emoji: '📚', era: 'pre', faction: 'pirate', role: 'archeologue', sea: 'west', island: 'ohara', age: 8,
    stats: { force: 3, vitesse: 5, intel: 10, charisme: 5, navigation: 4, volonte: 8 }, fruit: 'hana', weapon: null,
    canon: 'Seule survivante d\'Ohara, archéologue des Chapeaux de paille.', target: { progress: 8, label: 'Atteindre Laugh Tale' },
    intro: 'Huit ans, et déjà une prime de 79 millions. Ohara brûle derrière toi. Un géant t\'a dit : « Un jour tu trouveras des amis. »',
  },
];

// Fruits canon pour le mode Histoire uniquement
export const STORY_FRUITS = {
  gomu: { name: 'Fruit du Caoutchouc', jp: 'Gomu Gomu no Mi', type: 'zoan_mythique', tier: 4, desc: 'Officiellement du caoutchouc. Officieusement, le Fruit de l\'Homme, modèle Nika.', canon: true, story: true },
  ope: { name: 'Fruit de l\'Opération', jp: 'Ope Ope no Mi', type: 'paramecia', tier: 5, desc: 'Le fruit ultime : tu opères tout ce qui est dans ta Room.', canon: true, story: true },
  bara: { name: 'Fruit de la Découpe', jp: 'Bara Bara no Mi', type: 'paramecia', tier: 2, desc: 'Ton corps se démonte. Les sabres ne te coupent pas. Tes pieds restent au sol.', canon: true, story: true },
  moku: { name: 'Fruit de la Fumée', jp: 'Moku Moku no Mi', type: 'logia', tier: 4, desc: 'Tu es la fumée blanche.', canon: true, story: true },
  neko_leopard: { name: 'Fruit du Chat, modèle Léopard', jp: 'Neko Neko no Mi', type: 'zoan', tier: 4, desc: 'Un léopard de combat.', canon: true, story: true },
  hana: { name: 'Fruit de l\'Éclosion', jp: 'Hana Hana no Mi', type: 'paramecia', tier: 3, desc: 'Tu fais pousser tes membres sur n\'importe quelle surface.', canon: true, story: true },
};

// Comparaison avec une carrière canon (comme Destiny Eleven compare aux vrais footballeurs)
export const CANON_CAREERS = [
  { n: 'Alvida', camp: 'chercheur', p: 0, l: 1, why: 'beaucoup d\'ambition, une massue, peu de résultats' },
  { n: 'Baggy (avant l\'ellipse)', camp: 'chercheur', p: 0, l: 1, why: 'un rêve immense, une île canonnée, et un ego démontable' },
  { n: 'Foxy le Renard Argenté', camp: 'chercheur', p: 1, l: 1, why: 'un jeu truqué et une carrière à reculons' },
  { n: 'Bellamy la Hyène', camp: 'chercheur', p: 1, l: 2, why: 'tu as ri des rêveurs, puis le rêve t\'a rattrapé' },
  { n: 'Don Krieg', camp: 'chercheur', p: 1, l: 2, why: 'le plus fort d\'East Blue... jusqu\'à Grand Line' },
  { n: 'Ace', camp: 'chercheur', p: 3, l: 5, why: 'un feu magnifique, trop vite éteint' },
  { n: 'Bartolomeo', camp: 'chercheur', p: 3, l: 3, why: 'une barrière impénétrable et un cœur de fan' },
  { n: 'Crocodile', camp: 'chercheur', p: 2, l: 4, why: 'du sable, des plans, et une carrière qui s\'enlise' },
  { n: 'Doflamingo', camp: 'chercheur', p: 3, l: 5, why: 'un roi des fils qui a fini dans la cage' },
  { n: 'Eustass Kid', camp: 'chercheur', p: 3, l: 6, why: 'beaucoup de bruit et un bras de métal' },
  { n: 'Trafalgar Law', camp: 'chercheur', p: 3, l: 7, why: 'un plan brillant, puis Barbe Noire' },
  { n: 'Marco le Phénix', camp: 'chercheur', p: 3, l: 7, why: 'le bras droit éternel' },
  { n: 'Big Mom', camp: 'chercheur', p: 4, l: 8, why: 'un Poneglyphe, une fringale et une chute à Wano' },
  { n: 'Kaido', camp: 'chercheur', p: 4, l: 8, why: 'invincible... jusqu\'à ce qu\'il ne le soit plus' },
  { n: 'Barbe Noire', camp: 'chercheur', p: 5, l: 8, why: 'des trahisons, des fruits volés et une route vers le sommet' },
  { n: 'Monkey D. Luffy', camp: 'chercheur', p: 6, l: 8, why: 'de East Blue à Empereur, toujours en riant' },
  { n: 'Shanks le Roux', camp: 'chercheur', p: 3, l: 8, why: 'Empereur, sans jamais être pressé de trouver le trésor' },
  { n: 'Gol D. Roger', camp: 'chercheur', p: 9, l: 9, why: 'le Roi des Pirates, celui qui a ri' },
  { n: 'Barbe Blanche', camp: 'chercheur', p: 3, l: 9, why: 'l\'homme le plus fort du monde, qui voulait juste une famille' },
  { n: 'Koala', f: 'revo', camp: 'chercheur', p: 2, l: 4, why: 'une révolutionnaire au grand cœur' },
  { n: 'Sabo', f: 'revo', camp: 'chercheur', p: 3, l: 6, why: 'le chef d\'état-major qui a hérité du Feu' },
  { n: 'Monkey D. Dragon', f: 'revo', camp: 'chercheur', p: 3, l: 8, why: 'l\'homme le plus recherché du monde' },
  { n: 'Le capitaine Morgan', camp: 'gardien', p: 0, l: 1, why: 'une main-hache et un ego surdimensionné' },
  { n: 'Spandam', camp: 'gardien', p: 2, l: 0, why: 'beaucoup de pouvoir, aucun courage' },
  { n: 'Helmeppo', camp: 'gardien', p: 1, l: 3, why: 'un fils à papa devenu un vrai Marine' },
  { n: 'Tashigi', camp: 'gardien', p: 3, l: 3, why: 'une sabreuse obstinée' },
  { n: 'Smoker', camp: 'gardien', p: 3, l: 4, why: 'la justice à sa façon' },
  { n: 'Koby', camp: 'gardien', p: 3, l: 5, why: 'du mousse pleurnichard au Héros de Rocky Port' },
  { n: 'Rob Lucci', camp: 'gardien', p: 3, l: 6, why: 'la justice des ténèbres, deux défaites et un léopard' },
  { n: 'Saint Charlos', camp: 'gardien', p: 2, l: 0, why: 'une bulle, une sirène, et une baffe historique' },
  { n: 'Akainu', camp: 'gardien', p: 3, l: 8, why: 'la justice absolue, sans pitié' },
  { n: 'Sengoku', camp: 'gardien', p: 3, l: 8, why: 'un Bouddha avec une chèvre' },
  { n: 'Monkey D. Garp', camp: 'gardien', p: 3, l: 9, why: 'un héros qui refusait toutes les promotions' },
  { n: 'Saint Figarland Garling', camp: 'gardien', p: 3, l: 8, why: 'Héros de God Valley devenu Doyen' },
  { n: 'Im', camp: 'gardien', p: 9, l: 9, why: 'le Trône Vide n\'est pas si vide' },
];

// Badges (Quêtes) : test sur l'état final de la carrière
export const BADGES = [
  { id: 'first_bounty', emoji: '📜', name: 'Tête mise à prix', desc: 'Obtenir une prime.', test: S => S.hero.bounty > 0 },
  { id: 'big_bounty', emoji: '💰', name: 'Supernova', desc: 'Prime de 100 millions ou plus.', test: S => S.hero.bounty >= 100_000_000 },
  { id: 'billion', emoji: '💎', name: 'Ennemi public', desc: 'Prime de 1 milliard ou plus.', test: S => S.hero.bounty >= 1_000_000_000 },
  { id: 'grandline', emoji: '🌀', name: 'Bienvenue sur Grand Line', desc: 'Entrer sur Grand Line.', test: S => S.progress >= 1 },
  { id: 'newworld', emoji: '🔥', name: 'Le Nouveau Monde', desc: 'Entrer dans le Nouveau Monde.', test: S => S.progress >= 3 },
  { id: 'pone1', emoji: '🗿', name: 'Lecteur de pierre', desc: 'Obtenir un Poneglyphe routier.', test: S => S.pone.length >= 1 },
  { id: 'pone4', emoji: '🗺️', name: 'La route du trésor', desc: 'Obtenir les 4 Poneglyphes routiers.', test: S => S.pone.length >= 4 },
  { id: 'laughtale', emoji: '🏝️', name: 'Laugh Tale', desc: 'Atteindre la dernière île.', test: S => S.progress >= 8 },
  { id: 'onepiece', emoji: '🏴‍☠️', name: 'Roi des Pirates', desc: 'Trouver le One Piece.', test: S => S.progress >= 9 && S.endCamp === 'chercheur' },
  { id: 'guardian', emoji: '🕊️', name: 'Gardien du Siècle Oublié', desc: 'Sceller le One Piece.', test: S => S.progress >= 9 && S.endCamp === 'gardien' },
  { id: 'fruit', emoji: '🍇', name: 'Plus jamais la mer', desc: 'Manger un fruit du démon.', test: S => !!S.hero.fruit },
  { id: 'smile_fail', emoji: '😂', name: 'Hahahahaha', desc: 'Rater un SMILE et rire pour toujours.', test: S => S.flags.smile_fail },
  { id: 'chou', emoji: '🥬', name: 'Le pouvoir du chou', desc: 'Manger le Fruit du Chou.', test: S => S.hero.fruit?.id === 'kyabe' },
  { id: 'awaken', emoji: '✨', name: 'Éveil', desc: 'Éveiller son fruit du démon.', test: S => S.hero.fruit?.awakened },
  { id: 'roi', emoji: '👑', name: 'Un sur un million', desc: 'Éveiller le Haki des Rois.', test: S => S.hero.haki.roi > 0 },
  { id: 'haki3', emoji: '🌀', name: 'Les trois Haki', desc: 'Maîtriser les trois formes de Haki.', test: S => S.hero.haki.obs > 0 && S.hero.haki.arm > 0 && S.hero.haki.roi > 0 },
  { id: 'crew10', emoji: '👥', name: 'Équipage complet', desc: 'Avoir 10 membres d\'équipage.', test: S => S.crew.length >= 10 },
  { id: 'fleet', emoji: '⛵', name: 'Grande Flotte', desc: 'Avoir au moins 3 équipages alliés.', test: S => S.fleet.length >= 3 },
  { id: 'adam', emoji: '🌳', name: 'Bois d\'Adam', desc: 'Posséder un navire en bois d\'Adam.', test: S => S.ship.tier >= 5 },
  { id: 'yonko', emoji: '👑', name: 'Empereur des mers', desc: 'Devenir Empereur.', test: S => S.hero.faction === 'empereur' },
  { id: 'corsaire', emoji: '⚓', name: 'Grand Corsaire', desc: 'Devenir Corsaire.', test: S => S.factionsVisited?.includes('corsaire') },
  { id: 'admiral', emoji: '🎖️', name: 'Amiral', desc: 'Atteindre le grade d\'Amiral.', test: S => S.hero.faction === 'marine' && S.rankIdx >= 10 },
  { id: 'cp0', emoji: '🕶️', name: 'Le masque blanc', desc: 'Atteindre le CP0.', test: S => S.hero.faction === 'gouv' && S.rankIdx >= 5 },
  { id: 'traitor', emoji: '🔀', name: 'Girouette', desc: 'Changer de faction au moins 2 fois.', test: S => (S.factionsVisited?.length || 1) >= 3 },
  { id: 'fallen', emoji: '⚜️', name: 'Dragon déchu', desc: 'Commencer Chevalier Divin et finir pirate.', test: S => S.factionsVisited?.[0] === 'chevalier' && S.camp === 'chercheur' },
  { id: 'impel', emoji: '⛓️', name: 'L\'évadé', desc: 'S\'évader d\'Impel Down.', test: S => S.flags.escaped_impel },
  { id: 'tenryu', emoji: '👊', name: 'Lèse-majesté', desc: 'Frapper un Dragon Céleste.', test: S => S.flags.punched_tenryu },
  { id: 'enies', emoji: '🔥', name: 'Déclaration de guerre', desc: 'Brûler le drapeau d\'Enies Lobby.', test: S => S.hl.some(h => h.includes('drapeau du Gouvernement')) },
  { id: 'east_death', emoji: '🪦', name: 'Mort à East Blue', desc: 'Mourir dans la mer la plus faible du monde.', test: S => S.ending?.kind === 'death' && S.endSea === 'east' },
  { id: 'gl_direct', emoji: '🌪️', name: 'Pas de rodage', desc: 'Commencer sur Grand Line et atteindre le Nouveau Monde.', test: S => S.startSea === 'paradise' && S.progress >= 3 },
  { id: 'nw_direct', emoji: '☄️', name: 'Suicidaire', desc: 'Commencer dans le Nouveau Monde et obtenir un Poneglyphe.', test: S => S.startSea === 'nw' && S.pone.length >= 1 },
  { id: 'rich', emoji: '🤑', name: 'Milliardaire', desc: 'Avoir 1 milliard de berrys.', test: S => S.hero.berrys >= 1_000_000_000 },
  { id: 'broke', emoji: '🪙', name: 'Fauché', desc: 'Finir sans un berry.', test: S => S.hero.berrys <= 0 },
  { id: 'luffy_friend', emoji: '👒', name: 'Ami du Chapeau de paille', desc: 'Être ami avec Luffy.', test: S => (S.rel.luffy || 0) >= 3 },
  { id: 'shanks', emoji: '🔴', name: 'Mise ta vie sur ce chapeau', desc: 'Gagner le respect de Shanks.', test: S => (S.rel.shanks || 0) >= 3 },
  { id: 'old', emoji: '👴', name: 'Vieux loup de mer', desc: 'Finir sa carrière après 50 ans.', test: S => S.hero.age >= 50 },
  { id: 'survivor', emoji: '🩺', name: 'Pas encore', desc: 'Être sauvé de la mort.', test: S => S.deathSaves > 0 },
  { id: 'daily', emoji: '📅', name: 'Défi relevé', desc: 'Réussir un Défi du jour.', test: S => S.mode === 'daily' && S.challengeOk },
  { id: 'legend', emoji: '📖', name: 'Plus fort que la légende', desc: 'Faire mieux qu\'une légende en mode Histoire.', test: S => S.mode === 'story' && S.challengeOk },
  { id: 'saga', emoji: '📚', name: 'Une vraie saga', desc: 'Visiter 30 îles en une carrière.', test: S => S.visited.length >= 30 },
];

// Objectifs du Défi du jour
export const DAILY_GOALS = [
  { id: 'bounty', label: 'Atteindre une prime de 150 millions', camp: 'chercheur', test: S => S.hero.bounty >= 150_000_000 },
  { id: 'bounty2', label: 'Atteindre une prime de 500 millions', camp: 'chercheur', test: S => S.hero.bounty >= 500_000_000 },
  { id: 'nw', label: 'Entrer dans le Nouveau Monde', test: S => S.progress >= 3 },
  { id: 'pone', label: 'Obtenir un Poneglyphe routier', test: S => S.pone.length >= 1 },
  { id: 'level', label: 'Atteindre le niveau Supernova', test: S => S.levelIdx >= 3 },
  { id: 'yc3', label: 'Atteindre le niveau YC3', test: S => S.levelIdx >= 5 },
  { id: 'crew', label: 'Recruter 6 membres d\'équipage', test: S => S.crew.length >= 6 },
  { id: 'survive', label: 'Survivre jusqu\'au bout', test: S => S.ending?.kind !== 'death' && S.ending?.kind !== 'prison' },
  { id: 'rank', label: 'Atteindre le 5e grade de ta faction', camp: 'gardien', test: S => S.rankIdx >= 4 },
  { id: 'haki', label: 'Débloquer un Haki', test: S => S.hero.haki.obs + S.hero.haki.arm + S.hero.haki.roi > 0 },
];

// Noms de héros générés quand le joueur n'en choisit pas
export const HERO_SURNAMES = ['Brisecôte', 'Ventclair', 'Marsouin', 'Corsac', 'Flibuste', 'Malbec', 'Saumure', 'Grog', 'Tempête', 'Lagune', 'Kraken', 'Boucanier', 'Sabrevent', 'Rocaille', 'Mistral', 'Barracuda', 'Écume', 'Goéland', 'Cormoran', 'Hardiesse', 'Marée', 'Tribord', 'Bâbord', 'Sel-Noir', 'Foudrevent', 'Pavillon'];
export function randomHeroName(rand = Math.random) {
  const p = a => a[Math.floor(rand() * a.length)];
  const r = rand();
  if (r < 0.06) return `${p(HERO_SURNAMES)} D. ${p(CREW_FIRST)}`;
  if (r < 0.5) return `${p(CREW_FIRST)} ${p(CREW_EPI)}`.replace(/ \(.*\)$/, '');
  return `${p(CREW_FIRST)} ${p(HERO_SURNAMES)}`;
}
