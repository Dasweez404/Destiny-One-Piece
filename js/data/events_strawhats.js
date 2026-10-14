// L'équipage du Chapeau de paille : on peut croiser chacun de ses membres (une fois), puis l'équipage au complet.
// Chaque rencontre joue sur la réputation du groupe « Chapeau de paille » et sur le lien personnel avec le membre.

const M = [
  { id: 'luffy', name: 'Monkey D. Luffy', emoji: '👒', tier: 1, pre: 'Un garçon à chapeau de paille dévore la moitié de la taverne en riant. Il se tourne vers toi, la bouche pleine : « T\'as l\'air marrant ! T\'as de la viande ? »', post: 'Un homme à chapeau de paille, aussi puéril qu\'un enfant et aussi redouté qu\'un Empereur, te fait signe : « Hé, toi ! Viens manger, on fait la fête ! »',
    a: { t: 'Partager un festin avec lui', s: 'charisme', d: -2, ok: 'Vous finissez à chanter sur la table. Luffy te considère comme un nakama, et ça se sait.', e: { morale: 15, hp: 40, rel: { luffy: 2 }, frel: { chapeau: 2 } } },
    b: { t: 'Lui proposer un duel amical', s: 'combat', d: 4, ok: 'Tes coups le surprennent. « Shishishi ! T\'es fort ! » Il te laisse un souvenir : une bourse et son respect.', ko: 'Il te renvoie à l\'autre bout de la rue en riant. « Pas mal pour un débutant ! »', e: { glory: 4, stats: { force: 1 }, rel: { luffy: 1 } } } },
  { id: 'zoro', name: 'Roronoa Zoro', emoji: '⚔️', tier: 1, pre: 'Un sabreur aux cheveux verts dort contre un mur, trois sabres à la ceinture. Il ouvre un œil : « Si tu cherches la sortie, c\'est pas par là. Ni par là. »', post: 'Un sabreur à l\'aura écrasante, un cache-œil sur l\'œil gauche, s\'entraîne seul sur le pont. Il ne te regarde pas, mais il sait que tu es là.',
    a: { t: 'Lui demander de t\'entraîner', s: 'volonte', d: 2, ok: 'Il t\'apprend un geste : tenir son sabre un cran plus bas, souffler un cran plus tard. Une heure plus tard, tu sens la différence.', ko: 'Il se rendort. « Reviens quand tu seras prêt à t\'entraîner pour de vrai. »', e: { stats: { force: 1, volonte: 1 }, rel: { zoro: 1 }, frel: { chapeau: 1 } } },
    b: { t: 'Croiser le fer avec lui', s: 'combat', d: 5, ok: 'Une seule passe. Il range son sabre : « Tu tiens debout. C\'est déjà ça. »', ko: 'Tu ne l\'as même pas vu bouger. Ton arme est au sol.', e: { glory: 5, rel: { zoro: 1 } } } },
  { id: 'nami', name: 'Nami', emoji: '🍊', tier: 1, pre: 'Une jeune femme aux cheveux orange étudie une carte en soupirant. En te voyant, elle sourit : « Tu cherches un navigateur ? Ça se paie. »', post: 'Une navigatrice, Clima-Tact en main, dessine un itinéraire que personne d\'autre ne saurait lire. Elle t\'adresse un clin d\'œil : « Besoin d\'une prévision ? »',
    a: { t: 'Lui acheter une carte', c: S => S.tierPrime() / 6, r: { x: 'Elle te remet une carte aux annotations précises. « Pour un client sympa, la météo est offerte. »', e: { stats: { navigation: 1 }, rel: { nami: 1 }, frel: { chapeau: 1 } } } },
    b: { t: 'Négocier avec elle', s: 'charisme', d: 4, ok: 'Tu lui tiens tête. Elle rit : « Tu as de l\'avenir en affaires. » Et elle te laisse la carte à moitié prix.', ko: 'Elle te taxe. Tu paies, tu souris, tu rumines.', e: { berrys: S => S.tierPrime() / 6, stats: { navigation: 1 } } } },
  { id: 'usopp', name: 'Usopp', emoji: '🎯', tier: 1, pre: 'Un tireur au long nez raconte à une foule de gamins qu\'il a terrassé 8 000 hommes à lui seul. Il te repère : « Toi ! Tu es mon témoin. »', post: 'Le « Dieu Usopp » signe des autographes, un pistolet à plantes à la ceinture. Il te lance : « Tu veux voir un vrai tireur d\'élite ? »',
    a: { t: 'Le défier au tir', s: 'vitesse', d: 2, ok: 'Tu fais mouche à tous les coups. Il est vexé, puis admiratif.', ko: 'Il vise une boîte à cent mètres. Toi, une mouche. La boîte est intacte.', e: { stats: { vitesse: 1 }, rel: { usopp: 1 } } },
    b: { t: 'Écouter ses histoires', r: { x: 'Neuf fois sur dix c\'est faux, mais il y a un détail vrai : un raccourci par un chenal que tu ignorais.', e: { morale: 8, rel: { usopp: 1 }, frel: { chapeau: 1 } } } } },
  { id: 'sanji', name: 'Sanji', emoji: '🚬', tier: 1, pre: 'Un cuisinier blond au costume noir t\'accoste en dégainant une cigarette : « Un repas, ça se mérite. Mais pour toi, ce sera offert. »', post: 'Un cuisinier au sourire enjôleur et au pied de feu vérifie une marmite : « Ici, personne n\'a faim. Tu veux une assiette ? »',
    a: { t: 'Accepter son repas', r: { x: 'Le meilleur repas de ta vie. Tu en repars plein de force et d\'élan.', e: { hp: 999, morale: 15, rel: { sanji: 1 }, frel: { chapeau: 1 } } } },
    b: { t: 'Défier ses jambes de feu', s: 'combat', d: 4, ok: 'Tu esquives de justesse. Il hausse un sourcil : « Pas mal. »', ko: 'Un coup de talon, et tu vois des étoiles.', e: { glory: 4, rel: { sanji: 1 } } } },
  { id: 'chopper', name: 'Tony Tony Chopper', emoji: '🦌', tier: 2, pre: 'Un petit renne à chapeau rose se cache derrière une caisse en tremblant, puis te traite d\'« abruti » avec un grand sourire de fierté.', post: 'Un petit renne-médecin, sac à dos plein de remèdes, soigne un blessé : « Si tu es blessé, viens ! Je suis docteur ! »',
    a: { t: 'Te laisser soigner', r: { x: 'Chopper t\'examine et te passe un remède : tu retrouves toute ta forme.', e: { hp: 999, heal: true, rel: { chopper: 1 }, frel: { chapeau: 1 } } } },
    b: { t: 'Lui demander ses herbes', s: 'intel', d: 3, ok: 'Il te donne une pharmacie de poche : plus de PV à chaque escale pour un moment.', ko: 'Il rougit : « Ne me demande pas de vendre mes secrets, idiot ! »', e: { stats: { intel: 1 }, hp: 30 } } },
  { id: 'robin', name: 'Nico Robin', emoji: '📚', tier: 2, pre: 'Une femme à l\'air serein lit un vieux livre sur un banc. Quand tu passes, une main supplémentaire pousse doucement ton sac vers toi : « Tu as perdu ça. »', post: 'Une archéologue plonge dans un grimoire poussiéreux, quatre bras lui poussant dans le dos pour tourner les pages. Elle te sourit : « Veux-tu voir une page de l\'Histoire ? »',
    a: { t: 'Lui parler du Siècle Oublié', s: 'intel', d: 3, ok: 'Elle te livre une clé : une manière de lire les inscriptions des Poneglyphes.', ko: 'Elle sourit : « Ce n\'est pas pour tout le monde. »', e: { stats: { intel: 2 }, rel: { robin: 1 }, frel: { chapeau: 1 } } },
    b: { t: 'Lui demander son aide', s: 'charisme', d: 3, ok: 'Elle te confie des notes sur des îles que tu ne connais pas.', ko: 'Elle refuse poliment. « Chacun sa quête. »', e: { stats: { intel: 1 }, morale: 6 } } },
  { id: 'franky', name: 'Franky', emoji: '🔧', tier: 2, pre: 'Un cyborg à moitié nu, aux cheveux bleus en pointe, répare un navire en pose de super héros : « SUUUUPER ! Ton rafiot a besoin de moi, frérot ! »', post: 'Un cyborg géant, bras à canons rétractables, fait rugir un moteur : « Ça, c\'est du SUUUPER ! Un coup de main sur ton navire ? »',
    a: { t: 'Lui confier ton navire', r: { x: 'Il retape ta coque, ajoute un canon, et grave son nom sur le mât. « SUUUPER ! »', e: { shipHp: 999, ship: { mod: 'random' }, rel: { franky: 1 }, frel: { chapeau: 1 } } } },
    b: { t: 'Lui acheter des plans', s: 'intel', d: 3, ok: 'Tu repars avec de quoi améliorer ta coque.', ko: 'Il te regarde : « Frérot, c\'est trop dur pour toi. »', e: { shipHp: 60, stats: { intel: 1 } } } },
  { id: 'brook', name: 'Brook', emoji: '💀', tier: 2, pre: 'Un squelette en haut-de-forme joue du violon au bord du quai : « Yohohoho ! Puis-je voir ta culotte ? Ah non, je n\'ai pas d\'yeux. »', post: 'Un squelette musicien, chanteur de légende, donne un concert à bord. Il s\'incline : « Un morceau pour le voyageur ? Yohohoho ! »',
    a: { t: 'Écouter sa musique', r: { x: 'La mélodie te réchauffe le cœur. Ton équipage chantera cette chanson pendant des semaines.', e: { morale: 25, loyalty: 8, rel: { brook: 1 }, frel: { chapeau: 1 } } } },
    b: { t: 'Lui demander des conseils de survie', s: 'volonte', d: 3, ok: 'Il t\'apprend l\'art de rire de la mort. Tu te sens plus sûr de toi.', ko: 'Il rit trop pour rester sérieux.', e: { stats: { volonte: 1 }, morale: 6 } } },
  { id: 'jinbe', name: 'Jinbe', emoji: '🦈', tier: 2, post: true, pre: 'Un homme-poisson massif et calme observe la mer, les bras croisés : « La mer est un monde que les hommes ne comprennent pas. »', post_txt: 'Un homme-poisson massif, le barreur de l\'équipage, te salue d\'un hochement de tête : « Si tu cherches un homme d\'honneur, il est ici. »',
    a: { t: 'Lui demander des conseils pour la mer', s: 'navigation', d: 3, ok: 'Il t\'apprend à lire les courants : ton équipage navigue plus droit.', ko: 'Il t\'invite à venir plus tard : « La mer ne se hâte pas. »', e: { stats: { navigation: 2 }, rel: { jinbe: 1 }, frel: { chapeau: 1 } } },
    b: { t: 'Apprendre un peu de karaté', s: 'volonte', d: 3, ok: 'Il t\'enseigne un geste de base. Ton corps s\'en souviendra.', ko: 'Tu comprends qu\'il te faudra des années.', e: { stats: { force: 1 }, rel: { jinbe: 1 } } } },
];

const mk = (m, era) => ({
  id: `sh_${m.id}_${era}`, once: true, cd: 'shT', emoji: m.emoji, title: `${m.name}`,
  w: { era, weight: 2, minTier: m.tier, test: S => !S.hasFlag('sh_met_' + m.id) && S.turn - (S.shT ?? -9) >= 7 },
  x: era === 'post' && m.post_txt ? m.post_txt : m[era === 'post' ? 'post' : 'pre'] === true ? m.pre : (era === 'post' && typeof m.post === 'string' ? m.post : m.pre),
  ch: [
    { t: m.a.t, ...(m.a.s ? { s: m.a.s, d: m.a.d, ok: { x: m.a.ok, e: { ...m.a.e, flag: 'sh_met_' + m.id } }, ko: { x: m.a.ko || m.a.ok, e: { flag: 'sh_met_' + m.id, rel: m.a.e?.rel } } } : { c: m.a.c, r: { x: m.a.r.x, e: { ...m.a.r.e, flag: 'sh_met_' + m.id } } }) },
    { t: m.b.t, s: m.b.s, d: m.b.d, ok: { x: m.b.ok, e: { ...m.b.e, flag: 'sh_met_' + m.id } }, ko: { x: m.b.ko, e: { flag: 'sh_met_' + m.id, hp: -10 } } },
    { t: 'Passer ton chemin', r: { x: 'Tu hoches la tête et tu t\'éloignes. Ça aurait pu être une belle rencontre.', e: {} } },
  ],
});
export const SH_EVENTS = [];
for (const m of M) for (const era of ['pre', 'post']) { if (m.id === 'jinbe' && era === 'pre') continue; SH_EVENTS.push(mk(m, era)); }

// L'équipage au complet : repas d'alliance, bataille côte à côte, ou duel avec le capitaine
const met = S => ['luffy', 'zoro', 'nami', 'usopp', 'sanji', 'chopper', 'robin', 'franky', 'brook', 'jinbe'].filter(id => S.hasFlag('sh_met_' + id)).length + 3 * ['trio', 'trio2', 'trio3'].filter(b => S.hasFlag('sh_band_' + b)).length;
SH_EVENTS.push({
  id: 'sh_crew', once: true, cd: 'shT', emoji: '🏴‍☠️', title: 'L\'équipage au chapeau de paille',
  w: { weight: 14, minTier: 2, test: S => met(S) >= 3 && S.turn - (S.shT ?? -9) >= 5 },
  x: 'Un navire à la figure de proue de lion jaune surgit de la brume. À son bord, des visages que tu as déjà croisés : ils te reconnaissent. « Hé ! C\'est le gars de l\'autre fois ! » crie Luffy. Quelqu\'un hurle qu\'un navire de guerre approche derrière toi. L\'équipage te propose d\'unir vos voiles.',
  ch: [
    { t: 'Combattre à leurs côtés', r: { x: 'Vos deux navires se placent en ligne. Luffy hurle : « Allons-y, nakama ! »', e: { battle: { evId: 'sh_crew_battle', ci: 0, kind: 'naval', d: 3, foe: 'la flotte de la Marine', ally: 0.4 }, frel: { chapeau: 3 } } } },
    { t: 'Partager un festin d\'alliance', r: { x: 'Vous trinquez toute la nuit. Quand tu repars, tu as de nouveaux amis, du ravitaillement, et un navire en meilleur état.', e: { frel: { chapeau: 4 }, hp: 999, shipHp: 999, morale: 25, berrys: S => S.tierPrime() / 2, hl: 'a fêté une alliance avec l\'équipage au chapeau de paille' } } },
    { t: 'Défier Luffy en duel', s: 'combat', d: 9,
      ok: { x: 'Tu parviens à lui toucher le menton. Il éclate de rire : « T\'es incroyable ! »', e: { glory: 10, rel: { luffy: 2 }, frel: { chapeau: 2 } } },
      ko: { x: 'Un seul coup. Tu traverses trois cabanes. « Désolé ! Ça va ? »', e: { hp: -35, frel: { chapeau: 1 } } } },
  ],
});
// bataille associée : les deux issues sont relues ici (victoire ou défaite côte à côte)
SH_EVENTS.push({
  id: 'sh_crew_battle', emoji: '⚓', title: 'La bataille avec l\'équipage', w: { weight: 0, test: () => false },
  ch: [{ t: 'Bataille', s: 'naval', d: 3,
    ok: { x: 'Votre double ligne brise la flotte ennemie. Les Chapeaux de paille hurlent de joie, et ton nom est cité dans leurs récits.', e: { glory: 8, berrys: S => S.tierPrime(), frel: { chapeau: 3, marine: -2 }, rel: { luffy: 1 }, hl: 'a combattu aux côtés des Chapeaux de paille' } },
    ko: { x: 'La bataille est perdue, mais l\'équipage te sauve in extremis.', e: { shipHp: -30, frel: { chapeau: 2 } } } }],
});

// Rencontres « en bande » : les Chapeaux de paille se croisent généralement à plusieurs
const band = (id, ids, o) => ({
  id: `sh_band_${id}`, once: true, cd: 'shT', emoji: o.emoji, title: o.title,
  w: { weight: 9, minTier: o.tier, test: S => S.turn - (S.shT ?? -9) >= 7 && !S.hasFlag('sh_band_' + id) },
  x: o.x,
  ch: [
    { t: o.a.t, ...(o.a.s ? { s: o.a.s, d: o.a.d, ok: { x: o.a.ok, e: { ...o.a.e, flag: 'sh_band_' + id, rel: Object.fromEntries(ids.map(i => [i, 1])), frel: { chapeau: 2 } } }, ko: { x: o.a.ko, e: { flag: 'sh_band_' + id, morale: -3 } } } : { r: { x: o.a.r, e: { ...o.a.e, flag: 'sh_band_' + id, rel: Object.fromEntries(ids.map(i => [i, 1])), frel: { chapeau: 2 } } } }) },
    { t: o.b.t, s: o.b.s, d: o.b.d, ok: { x: o.b.ok, e: { ...o.b.e, flag: 'sh_band_' + id } }, ko: { x: o.b.ko, e: { flag: 'sh_band_' + id, hp: -20 } } },
    { t: 'Les saluer et repartir', r: { x: 'Un signe de la main, un chapeau de paille qui s\'agite au loin. Ils sont déjà passés à autre chose.', e: { flag: 'sh_band_' + id } } },
  ],
});
SH_EVENTS.push(
  band('trio', ['luffy', 'zoro', 'sanji'], { emoji: '👒', title: 'Luffy, Zoro et Sanji', tier: 1,
    x: 'Trois silhouettes se disputent sur le quai : un garçon à chapeau de paille réclame de la viande, un sabreur aux cheveux verts proteste qu\'on ne le laisse pas dormir, et un cuisinier blond leur reproche de salir sa cuisine. Une scène de ménage classique, chez ces gens-là. Le garçon te repère : « Hé ! Toi ! Tu veux bouffer avec nous ? »',
    a: { t: 'Dîner avec eux', r: 'Le cuisinier sert un festin improvisé. Le sabreur s\'endort sur la table, le garçon dévore tout, et tu repars avec un ventre plein et des amis.', e: { hp: 999, morale: 20, loyalty: 6 } },
    b: { t: 'Relever un défi à trois', s: 'combat', d: 6, ok: 'Tu leur tiens tête un instant, à leur surprise. « Pas mal ! » hurle le garçon, tandis que le sabreur grogne un respect bourru.', ko: 'Un seul coup de pied, un seul geste de sabre, et tu te retrouves sur le dos. Ils s\'excusent, vaguement.', e: { glory: 6, stats: { force: 1 } } } }),
  band('trio2', ['nami', 'usopp', 'chopper'], { emoji: '🧭', title: 'Nami, Usopp et Chopper', tier: 1,
    x: 'Une navigatrice, un tireur au long nez et un petit renne à chapeau rose négocient avec un marchand. La navigatrice a l\'œil sur ta bourse. Le tireur raconte l\'histoire de sa vie à quiconque l\'écoute. Le renne soigne un chat errant. « Tu as besoin de quelque chose ? » demande-t-elle, avec un sourire dangereusement avenant.',
    a: { t: 'Acheter une carte et des remèdes', s: 'charisme', d: 2, ok: 'Elle te fait un prix d\'ami. Le tireur ajoute un conseil pas totalement faux. Le renne te glisse un onguent. Tu repars bien équipé.', ko: 'Elle te fait payer au prix fort. Ils sont adorables, mais ils ne sont pas des enfants de chœur.', e: { stats: { navigation: 1 }, hp: 40, morale: 8 } },
    b: { t: 'Les aider avec le marchand', s: 'intel', d: 3, ok: 'Tu démasques les arnaques du marchand. Ils te remercient chaleureusement, et la navigatrice te rembourse en cartes.', ko: 'Le marchand te dépasse en ruse. Ils s\'en sortent sans toi.', e: { berrys: S => S.tierPrime() / 3, rep: 3 } } }),
  band('trio3', ['robin', 'franky', 'brook'], { emoji: '🎻', title: 'Robin, Franky et Brook', tier: 2,
    x: 'Sur un petit navire, une archéologue lit en silence, un cyborg répare le mât en chantant, et un squelette en haut-de-forme joue du violon. La musique se mêle au bruit des marteaux. « Un invité ! » s\'exclame le squelette. « Et sans culotte, je ne peux pas dire s\'il est charmant ! »',
    a: { t: 'Écouter leur concert improvisé', r: 'La mélodie, le rythme des marteaux, la voix du squelette : un instant parfait. Ton équipage se joint à eux pour un refrain.', e: { morale: 25, loyalty: 8 } },
    b: { t: 'Leur demander de l\'aide pour ton navire et tes cartes', s: 'intel', d: 3, ok: 'Le cyborg refait ta coque, l\'archéologue t\'explique un détail de navigation sur une carte ancienne.', ko: 'Ils sont trop occupés pour toi.', e: { shipHp: 80, stats: { intel: 1 }, ship: { mod: 'random' } } } }),
);
