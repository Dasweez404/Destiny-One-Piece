// Poneglyphes, Laugh Tale, Impel Down, factions, événements génériques d'île et de mer.

const isCh = S => S.camp === 'chercheur';
const isGa = S => S.camp === 'gardien';
const isF = (...f) => S => f.includes(S.hero.faction);
const notF = (...f) => S => !f.includes(S.hero.faction);
const crewHas = role => S => S.crew.some(c => c.role === role);

// ═══════════════ POGNEGLYPHES ROUTIERS ═══════════════
export const PONE_EVENTS = [
  {
    id: 'pone_zou', pri: 20, repeat: true, emoji: '🐘', title: 'Le Poneglyphe de Zou',
    w: { isl: ['zou'], test: S => !S.pone.includes('zou') },
    x: 'Tu grimpes la patte de Zunisha, l\'éléphant millénaire. Les Minks t\'encerclent : chats, chiens, lapins... tous électriques. Au cœur de la forêt de la Baleine, la famille Kozuki a laissé un Poneglyphe rouge. Un Poneglyphe routier.',
    ch: [
      { t: 'Gagner l\'amitié des Minks', s: 'charisme', d: 4, req: isCh, rq: 'Chercheurs uniquement',
        ok: { x: 'Nekomamushi et Inuarashi te confient le secret. Tu prends un relevé du Poneglyphe routier. « Garchu ! »', e: { pone: 'zou', rel: { nekomamushi: 3 }, hl: 'a reçu le Poneglyphe des Minks' } },
        ko: { x: 'Les Minks ne te font pas confiance. Ils te jettent hors de la forêt.', e: { rel: { nekomamushi: -1 }, morale: -5 } } },
      { t: 'Prendre le relevé par la force', s: 'combat', d: 10,
        ok: { x: 'Tu bats les gardiens Minks sous la pleine lune... et tu repars avec le relevé. Zou ne t\'oubliera pas, et pas en bien.', e: { pone: 'zou', glory: 8, rel: { nekomamushi: -3 }, rep: -4 } },
        ko: { x: 'La forme Sulong des Minks à la pleine lune. Tu es carbonisé.', e: { hp: -60 } } },
      { t: 'Confisquer le relevé au nom du Gouvernement', s: 'combat', d: 8, req: isGa, rq: 'Gardiens uniquement',
        ok: { x: 'Le relevé est sous scellés. Le Gouvernement te remercie. Les Minks te maudissent.', e: { pone: 'zou', merit: 20, rel: { nekomamushi: -3 } } },
        ko: { x: 'Les Minks te repoussent violemment.', e: { hp: -45 } } },
    ],
  },
  {
    id: 'pone_wci', pri: 20, repeat: true, emoji: '🍰', title: 'Le Poneglyphe de Totto Land',
    w: { isl: ['wci'], test: S => !S.pone.includes('wci') },
    x: S => S.era === 'pre'
      ? 'Whole Cake Château. Big Mom garde son Poneglyphe routier dans sa chambre aux trésors. Une Tea Party approche ; tous les fils et filles Charlotte seront là. C\'est le moment d\'agir... ou de mourir.'
      : 'Depuis la chute de Big Mom à Wano, la famille Charlotte tient Totto Land sous la direction de Katakuri et Perospero. Le Poneglyphe routier est toujours gardé au château.',
    ch: [
      { t: 'Infiltrer la chambre aux trésors', s: 'intel', d: 10,
        ok: { x: 'Tu te glisses dans le Miroir de Brûlée. Le relevé est à toi. Personne ne l\'a vu... sauf les homies, qui ne parlent pas. En principe.', e: { pone: 'wci', glory: 10, hl: 'a volé le relevé du Poneglyphe de Big Mom' } },
        ko: { x: 'Les homies sonnent l\'alerte. Katakuri te voit venir avant que tu ne bouges.', e: { hp: -50, rel: { katakuri: -2 } } } },
      { t: S => S.era === 'pre' ? 'Faire alliance avec Big Mom (mariage politique)' : 'Négocier avec Katakuri', s: 'charisme', d: 10,
        ok: { x: S => S.era === 'pre' ? 'Big Mom t\'accepte comme allié... en échange d\'un mariage avec une de ses filles. Tu as le relevé. Et une belle-mère.' : 'Katakuri accepte, en échange d\'une dette d\'honneur. Tu as le relevé.', e: { pone: 'wci', yonko: S => S.era === 'pre' ? 'bigmom' : null, rel: { bigmom: 2, katakuri: 2 }, hl: S => S.era === 'pre' ? 'a épousé un membre de la famille Charlotte' : 'a négocié avec Katakuri' } },
        ko: { x: 'Big Mom te demande ta vie (Soul Pocus). Tu t\'en tires en perdant des années.', e: { age: 5, hp: -30, hl: 'a perdu cinq ans de vie face à Big Mom' } } },
      { t: 'Saisir le relevé (Gardien)', req: isGa, rq: 'Gardiens uniquement', s: 'combat', d: 12,
        ok: { x: 'Une opération éclair. Le relevé est confisqué. Une Empereure fulmine.', e: { pone: 'wci', merit: 25 } },
        ko: { x: 'Tu es repoussé par l\'armée de Totto Land.', e: { hp: -50 } } },
    ],
  },
  {
    id: 'pone_wano', pri: 20, repeat: true, emoji: '🗾', title: 'Le Poneglyphe de Wano',
    w: { isl: ['wano'], test: S => !S.pone.includes('wano') },
    x: S => S.era === 'pre'
      ? 'Wano, sous la botte de Kaido. Les samouraïs attendent le retour de la famille Kozuki depuis vingt ans. Le Poneglyphe routier est sous Onigashima, gardé par l\'armée des Cent Bêtes.'
      : 'Wano est libre. Momonosuke est shogun. Le Poneglyphe routier est sous la protection de la famille Kozuki, et des Chapeaux de paille.',
    ch: [
      { t: S => S.era === 'pre' ? 'Rejoindre les samouraïs et prendre Onigashima' : 'Demander la permission au Shogun', s: S => S.era === 'pre' ? 'combat' : 'charisme', d: S => S.era === 'pre' ? 16 : 4,
        ok: { x: S => S.era === 'pre' ? 'Onigashima tombe. Le relevé est à toi. Wano te considère comme un héros.' : 'Momonosuke te laisse prendre un relevé. « Pour l\'ami de Luffy ! »', e: { pone: 'wano', glory: S => S.era === 'pre' ? 20 : 5, rel: { momonosuke: 3, kinemon: 2 } } },
        ko: { x: S => S.era === 'pre' ? 'Kaido te balaie de son Kanabō. Tu te réveilles dans la prison d\'Udon.' : 'Le Shogun refuse poliment. Les samouraïs te raccompagnent.', e: { hp: -45 } } },
      { t: 'Voler le relevé en secret', s: 'vitesse', d: 12,
        ok: { x: 'Tu te faufiles comme un ninja. Le relevé est à toi.', e: { pone: 'wano', glory: 8 } },
        ko: { x: 'Les ninjas de Wano sont meilleurs que toi.', e: { hp: -40 } } },
      { t: 'Sécuriser le Poneglyphe (Gardien)', req: isGa, rq: 'Gardiens uniquement', s: 'combat', d: 12,
        ok: { x: 'Le relevé est sous scellés. Ryokugyu t\'a aidé.', e: { pone: 'wano', merit: 25, rel: { ryokugyu: 2 } } },
        ko: { x: 'Wano repousse la Marine.', e: { hp: -50 } } },
    ],
  },
  {
    id: 'pone_elbaf', pri: 20, repeat: true, emoji: '🌳', title: 'Le dernier Poneglyphe',
    w: { isl: ['elbaf'], test: S => !S.pone.includes('elbaf') },
    x: 'Elbaf, le pays des géants. On dit que le dernier Poneglyphe routier est lié à l\'histoire d\'Elbaf... ou entre les mains d\'un Empereur. L\'Arbre Adam s\'élève jusqu\'aux nuages. Les géants respectent une seule chose : la force et l\'honneur.',
    ch: [
      { t: 'Prouver sa valeur aux géants', s: 'combat', d: 14,
        ok: { x: 'Les géants frappent le sol de leurs haches en ton honneur. Ils te montrent ce que tu cherches. Le dernier relevé.', e: { pone: 'elbaf', glory: 15, rel: { dorry: 2 }, hl: 'a été honoré par les guerriers d\'Elbaf' } },
        ko: { x: 'Un géant de 20 mètres t\'écrase sous sa sandale. Tu survis par miracle.', e: { hp: -55 } } },
      { t: 'Présenter l\'invitation de Dorry et Brogy', req: S => S.flags.elbaf_invite, rq: 'Il faut avoir aidé Dorry et Brogy à Little Garden', s: 'charisme', d: 0,
        ok: { x: 'Dorry et Brogy te présentent comme leur ami. Elbaf t\'ouvre ses portes, et ses secrets.', e: { pone: 'elbaf', rel: { dorry: 3 }, glory: 5 } },
        ko: { x: 'Ils sont partis en expédition. Il faut prouver ta valeur autrement.', e: {} } },
      { t: 'Libérer Loki, le prince maudit', s: 'volonte', d: 14, req: S => S.era === 'post', rq: 'Loki n\'est pas encore enchaîné',
        ok: { x: 'Loki te regarde avec gratitude. Il connaît l\'emplacement de la dernière pièce. Tu as le relevé, et un allié terrifiant.', e: { pone: 'elbaf', rel: { loki: 4 }, glory: 10, hl: 'a libéré Loki d\'Elbaf' } },
        ko: { x: 'Les chaînes résistent. Les géants te chassent.', e: { hp: -40 } } },
      { t: 'Saisir le relevé (Gardien)', req: isGa, rq: 'Gardiens uniquement', s: 'combat', d: 14,
        ok: { x: 'Les Chevaliers Divins t\'ont aidé. Le relevé est sous scellés.', e: { pone: 'elbaf', merit: 25, rel: { shamrock: 2 } } },
        ko: { x: 'Les géants repoussent les Chevaliers Divins.', e: { hp: -55 } } },
    ],
  },
  {
    id: 'pone_shanks', pri: 0, emoji: '🔴', title: 'Le Roux',
    w: { tier: [3], test: S => S.pone.length >= 2 && !S.pone.includes('elbaf') && !S.flags.met_shanks_pone, weight: 3 },
    x: 'Un navire au drapeau à trois cicatrices barre ta route. Shanks le Roux monte à bord seul, sans arme. « Tu cherches le dernier Poneglyphe ? J\'en ai une copie. Mais pourquoi devrais-je te la donner ? »',
    ch: [
      { t: 'Lui parler de ton rêve', s: 'charisme', d: 14,
        ok: { x: 'Il te regarde longtemps, puis éclate de rire. « Ce rêve-là, il faut l\'accomplir. » Il te tend le relevé.', e: { pone: 'elbaf', rel: { shanks: 3 }, flag: 'met_shanks_pone', hl: 'a reçu un relevé des mains de Shanks' } },
        ko: { x: '« Pas encore. » Son Haki te met à genoux. Il repart.', e: { flag: 'met_shanks_pone', hp: -20 } } },
      { t: 'Le défier', s: 'combat', d: 26,
        ok: { x: 'Impossible. Et pourtant... il saigne. Il sourit. « Pas mal. » Il te laisse le relevé.', e: { pone: 'elbaf', glory: 30, rel: { shanks: 2 }, flag: 'met_shanks_pone', hl: 'a fait saigner Shanks' } },
        ko: { x: 'Un seul coup de sabre. Ton navire est coupé en deux. Tu survis.', e: { hp: -60, shipHp: -100, flag: 'met_shanks_pone' } } },
      { t: 'Refuser poliment', r: { x: 'Il hausse les épaules et repart en riant.', e: { flag: 'met_shanks_pone' } } },
    ],
  },
];

// ═══════════════ LAUGH TALE ═══════════════
export const FINAL_EVENTS = [
  {
    id: 'laughtale_trial', pri: 60, repeat: true, emoji: '🌩️', title: 'La dernière barrière',
    w: { isl: ['laughtale'], test: S => !S.flags.lt_trial },
    x: S => S.camp === 'gardien'
      ? 'Laugh Tale est en vue. Mais une flotte pirate t\'a suivi jusqu\'ici : ceux qui veulent le trésor ne laisseront pas un Gardien poser le pied sur l\'île sans combattre.'
      : `Laugh Tale est en vue, au milieu de tempêtes permanentes. Mais ${S.era === 'pre' ? 'une flotte de la Marine menée par un Amiral' : 'les navires de Barbe Noire'} t'attendent devant l'unique passe. Il faut passer. Maintenant.`,
    ch: [
      { t: 'Forcer le passage', s: 'combat', d: 14,
        ok: { x: 'Tu traverses le barrage dans un fracas de bois et de Haki. La plage de Laugh Tale est sous tes pieds.', e: { flag: 'lt_trial', glory: 20, hl: 'a forcé le passage de Laugh Tale' } },
        ko: { x: 'Repoussé. Ton navire dérive, en lambeaux, jusqu\'à Lodestar. Il faudra revenir.', e: { hp: -60, shipHp: -80, goto: 'lodestar' } } },
      { t: 'Contourner par les tempêtes', s: 'navigation', d: 10,
        ok: { x: 'Personne n\'est assez fou pour suivre ta route dans les éclairs. Toi si. Tu accostes de l\'autre côté de l\'île.', e: { flag: 'lt_trial', stats: { navigation: 1 } } },
        ko: { x: 'Les tempêtes ont failli couler ton navire. Tu es renvoyé à Lodestar.', e: { shipHp: -100, hp: -30, goto: 'lodestar' } } },
    ],
  },
  {
    id: 'laughtale_ch', pri: 50, emoji: '🏴‍☠️', title: 'Laugh Tale',
    w: { isl: ['laughtale'], camp: 'chercheur' },
    x: 'La dernière île. Les quatre relevés ont dessiné la route, ton archéologue les a lus, et ton navire a survécu à l\'impossible. Sur la plage, un drapeau à moitié pourri : celui de Roger. Au cœur de l\'île, le trésor qui a lancé la Grande Ère de la Piraterie. Tu comprends pourquoi Roger a ri.',
    ch: [
      { t: 'Rire, comme Roger', r: { x: 'Tu ris. Fort. Ton équipage aussi. Le monde n\'est plus le même. Tu es le Roi des Pirates.', e: { progress: 9, hl: 'a trouvé le One Piece et a ri', flag: 'ending_laugh' } } },
      { t: 'Révéler la vérité au monde entier', r: { x: 'Grâce à un Den Den Mushi, tu révèles l\'histoire du Siècle Oublié au monde entier. Le Gouvernement Mondial tremble. Une nouvelle ère commence.', e: { progress: 9, hl: 'a révélé la vérité du Siècle Oublié au monde', flag: 'ending_reveal' } } },
      { t: 'Garder le secret et repartir', r: { x: 'Tu es le Roi des Pirates. Mais tu ne diras jamais ce que tu as vu. C\'est ton trésor.', e: { progress: 9, hl: 'a trouvé le One Piece et a gardé le secret', flag: 'ending_secret' } } },
    ],
  },
  {
    id: 'laughtale_ga', pri: 50, emoji: '🕊️', title: 'Laugh Tale',
    w: { isl: ['laughtale'], camp: 'gardien' },
    x: 'Tu as atteint Laugh Tale avant les pirates. Les quatre Poneglyphes routiers sont sous scellés. Devant toi, l\'île où Roger a ri. Ta mission : sceller le One Piece à jamais. Mais tu as lu les inscriptions sur les murs...',
    ch: [
      { t: 'Sceller le One Piece', r: { x: 'Le trésor est scellé. Personne ne le trouvera jamais. Les Cinq Doyens te félicitent. Im t\'a remarqué. Tu es le Gardien du Siècle Oublié.', e: { progress: 9, merit: 50, hl: 'a scellé le One Piece pour le Gouvernement', flag: 'ending_seal' } } },
      { t: 'Lire la vérité... et trahir le Gouvernement', s: 'volonte', d: 10,
        ok: { x: 'Tu comprends. Le Gouvernement t\'a menti toute ta vie. Tu révèles la vérité au monde. Tu deviens l\'ennemi n°1 du Gouvernement Mondial.', e: { faction: 'revo', progress: 9, hl: 'a trahi le Gouvernement à Laugh Tale et révélé la vérité', flag: 'ending_traitor' } },
        ko: { x: 'Tu ne peux pas. Ton serment est plus fort. Tu scelles le trésor, mais tu ne dormiras plus jamais.', e: { progress: 9, morale: -50, flag: 'ending_seal' } } },
      { t: 'Le détruire', s: 'force', d: 10,
        ok: { x: 'Le trésor est détruit. Plus personne ne le cherchera. Le monde ne saura jamais. Est-ce une victoire ?', e: { progress: 9, hl: 'a détruit le One Piece', flag: 'ending_destroy' } },
        ko: { x: 'Le trésor est indestructible, comme les Poneglyphes. Tu le scelles à la place.', e: { progress: 9, flag: 'ending_seal' } } },
    ],
  },
];

// ═══════════════ PRISON ═══════════════
export const PRISON_EVENTS = [
  {
    id: 'impel_arrive', pri: 100, emoji: '⛓️', title: 'Impel Down',
    w: { isl: ['impeldown'] },
    x: S => `Menottes en granit marin, tu franchis la Porte de la Justice. Magellan, le directeur au poison mortel, t'attend. ${S.hero.bounty >= 100_000_000 ? 'Avec ta prime, c\'est le Niveau 6 : l\'Enfer Éternel. Pour toujours.' : 'Niveau 4 : l\'Enfer Brûlant. Tu y cuiras lentement.'} Personne ne s'évade d'Impel Down. Presque personne.`,
    ch: [
      { t: 'Tenter l\'évasion', p: S => {
        let p = 0.06 + S.hero.stats.intel * 0.004 + S.hero.stats.force * 0.004;
        for (const c of ['ivankov', 'baggy', 'luffy', 'jinbe', 'crocodile']) if ((S.rel[c] || 0) >= 2) p += 0.04;
        return Math.min(0.3, p);
      },
        ok: { x: 'Tu bats des gardes, traverses le Niveau 5 gelé, échappes au poison de Magellan, voles un navire de la Marine et sautes dans la mer. TU T\'ES ÉVADÉ D\'IMPEL DOWN.', e: { glory: 15, bounty: 50_000_000, flag: 'escaped_impel', goto: 'random_paradise', hp: -30, hl: 'S\'EST ÉVADÉ D\'IMPEL DOWN' } },
        ko: { x: 'Magellan te rattrape. Son Hydra de poison est la dernière chose que tu vois.', e: { death: 'Mort empoisonné par Magellan pendant une tentative d\'évasion d\'Impel Down' } } },
      { t: 'Accepter le marché du Gouvernement', req: S => S.hero.bounty >= 30_000_000 && S.camp === 'chercheur', rq: 'Tu ne vaux pas assez pour un marché',
        r: { x: S => S.era === 'pre' ? 'Le Gouvernement te propose le titre de Corsaire en échange de ta loyauté. Tu sors par la grande porte.' : 'Le Gouvernement te propose de devenir informateur pour le CP. Tu sors... avec un collier explosif.', e: { faction: S => S.era === 'pre' ? 'corsaire' : 'gouv', goto: 'random_paradise', hl: 'a accepté un marché du Gouvernement à Impel Down', morale: -20 } } },
      { t: 'Attendre qu\'on vienne te chercher', p: S => {
        let p = 0.02;
        for (const c of ['luffy', 'ivankov', 'baggy', 'garp', 'dragon', 'sabo', 'shanks', 'marco']) if ((S.rel[c] || 0) >= 3) p += 0.12;
        if (S.crew.length >= 5) p += 0.05;
        return Math.min(0.6, p);
      },
        ok: { x: 'Un jour, les murs tremblent. Tes alliés sont venus te chercher. Tu sors avec eux, au milieu du chaos.', e: { goto: 'random_paradise', glory: 10, hl: 'a été libéré d\'Impel Down par ses alliés' } },
        ko: { x: 'Personne ne vient. Les années passent. Tu deviens une légende oubliée du Niveau 6.', e: { end: 'prison' } } },
    ],
  },
];

// ═══════════════ FACTIONS ═══════════════
export const FACTION_EVENTS = [
  {
    id: 'corsaire_offer', emoji: '⚓', title: 'Une offre du Gouvernement',
    w: { era: 'pre', fac: ['pirate', 'chasseur'], test: S => S.hero.bounty >= 70_000_000 || (S.hero.faction === 'chasseur' && S.merit >= 20), minTier: 2, weight: 4 },
    x: 'Un agent du Gouvernement, costume blanc, te tend une lettre officielle. « Le Gouvernement Mondial vous propose le titre de Grand Corsaire. Votre prime sera gelée. Vous pourrez attaquer les pirates en toute légalité. En échange, vous répondrez aux convocations. »',
    ch: [
      { t: 'Accepter le titre', r: { x: 'Tu es désormais l\'un des Sept Grands Corsaires. Ta prime est gelée. Les autres pirates te méprisent.', e: { faction: 'corsaire', rep: 5, frel: { gov: 3 }, hl: 'est devenu Grand Corsaire' } } },
      { t: 'Refuser', r: { x: 'L\'agent sourit froidement. « Comme vous voudrez. » Ta prime augmente le lendemain.', e: { glory: 3, frel: { gov: -1 } } } },
    ],
  },
  {
    id: 'yonko_offer', emoji: '👑', title: 'L\'émissaire d\'un Empereur',
    w: { fac: ['pirate', 'chasseur'], minTier: 2, test: S => S.hero.bounty >= 40_000_000, weight: 4 },
    x: S => `Un messager arrive avec un drapeau : celui de ${S.tmpYonko().name}. « Mon capitaine t'offre sa protection. Ton navire portera notre drapeau. Personne n'osera t'attaquer. En échange... tu feras ce qu'on te dit. »`,
    ch: [
      { t: 'Accepter la protection', r: { x: S => `Tu navigues désormais sous le drapeau de ${S.tmpYonko().name}. La protection est réelle. La laisse aussi.`, e: { yonko: S => S.tmpYonko().id, hl: S => `s'est placé sous la protection de ${S.tmpYonko().name}` } } },
      { t: 'Refuser poliment', s: 'charisme', d: 4,
        ok: { x: '« Respect. » L\'émissaire repart.', e: { rep: 2 } },
        ko: { x: 'L\'émissaire repart, vexé. Tu viens de te faire un ennemi puissant.', e: { flag: 'yonko_snub' } } },
      { t: 'Le jeter par-dessus bord', s: 'combat', d: 6,
        ok: { x: 'Il nage vers son navire. Tu viens de déclarer la guerre à un Empereur. Ta prime grimpe.', e: { glory: 6, flag: 'yonko_snub', hl: 'a jeté un émissaire d\'Empereur à la mer' } },
        ko: { x: 'L\'émissaire était un commandant. Tu as perdu.', e: { hp: -40 } } },
    ],
  },
  {
    id: 'revo_offer', emoji: '🐉', title: 'Un homme en cape',
    w: { notFac: ['revo', 'chevalier'], test: S => (S.frel.revo || 0) >= 3 || S.flags.revo_contact, weight: 5 },
    x: 'Un homme en cape se fond dans l\'ombre de ta cabine. « L\'Armée Révolutionnaire a entendu parler de toi. Le Gouvernement Mondial doit tomber. Veux-tu changer le monde ? »',
    ch: [
      { t: 'Rejoindre la Révolution', r: { x: 'Tu as rejoint l\'Armée Révolutionnaire. Dragon t\'attend.', e: { faction: 'revo', rel: { dragon: 1 }, hl: 'a rejoint l\'Armée Révolutionnaire' } } },
      { t: 'Refuser', r: { x: 'L\'homme disparaît comme il est venu.', e: {} } },
      { t: 'Le dénoncer (Gardien)', req: isGa, rq: 'Gardiens uniquement', s: 'combat', d: 6,
        ok: { x: 'Tu as capturé un agent révolutionnaire. Belle promotion.', e: { merit: 10, frel: { revo: -5 } } },
        ko: { x: 'Il s\'échappe dans un tourbillon de vent.', e: {} } },
    ],
  },
  {
    id: 'desertion', emoji: '🧥', title: 'La Justice a-t-elle un sens ?',
    w: { fac: ['marine', 'gouv'], test: S => S.morale < 35 || S.flags.flevance_truth || S.flags.saw_im || S.flags.godvalley, weight: 5 },
    x: 'Une nuit, tu regardes ton manteau. Ce que tu as vu... ce qu\'on t\'a ordonné de faire... Est-ce vraiment la Justice ? Un de tes subordonnés te souffle : « Je vous suivrai, quoi que vous décidiez. »',
    ch: [
      { t: 'Déserter et devenir pirate', r: { x: 'Tu jettes ton manteau à la mer. Le lendemain, ta tête est mise à prix. Te voilà pirate.', e: { faction: 'pirate', hl: 'a déserté la Marine', bounty: 30_000_000 } } },
      { t: 'Rejoindre la Révolution', r: { x: 'Tu contactes l\'Armée Révolutionnaire. Ils t\'acceptent... avec méfiance.', e: { faction: 'revo', hl: 'a trahi le Gouvernement pour la Révolution' } } },
      { t: 'Rester fidèle', s: 'volonte', d: 0,
        ok: { x: 'Tu choisis de changer la Marine de l\'intérieur. Comme Koby, comme Garp.', e: { morale: 20, merit: 5 } },
        ko: { x: 'Tu restes, mais le doute te ronge.', e: { morale: -10 } } },
    ],
  },
  {
    id: 'chevalier_chute', emoji: '⚜️', title: 'La chute d\'un Dragon Céleste',
    w: { fac: ['chevalier'], test: S => S.morale < 40 || S.turn > 6, weight: 4 },
    x: 'Tu as vu le monde d\'en bas. Les gens, les esclaves, la misère. Un vieux Dragon Céleste a fait autrefois le choix de vivre parmi les humains : Donquixote Homing. Sa famille a été massacrée.',
    ch: [
      { t: 'Renoncer à ton statut', r: { x: 'Tu n\'es plus un Dragon Céleste. Tu es humain. Le monde d\'en bas te déteste, et Marie Geoise t\'a renié.', e: { faction: 'pirate', bounty: 50_000_000, hl: 'a renoncé à son statut de Dragon Céleste' } } },
      { t: 'Renforcer ta foi', s: 'volonte', d: 0,
        ok: { x: 'Tu es un Chevalier Divin. Le monde d\'en bas n\'existe pas.', e: { merit: 10, morale: 10 } },
        ko: { x: 'Le doute s\'installe.', e: { morale: -15 } } },
    ],
  },
  {
    id: 'captain_succession', emoji: '🏴‍☠️', title: 'Le capitaine vacille',
    w: { test: S => !S.hero.isCaptain && S.crew.some(c => c.isCaptain) && S.turn >= 2, weight: 8 },
    x: S => `Ton capitaine, ${S.crew.find(c => c.isCaptain)?.name || 'le capitaine'}, n'est plus que l'ombre de lui-même. Il boit, il hésite, il a peur de Grand Line. L'équipage te regarde.`,
    ch: [
      { t: 'Prendre le commandement', s: 'charisme', d: 0,
        ok: { x: 'L\'équipage te suit. L\'ancien capitaine accepte de devenir ton second, avec soulagement.', e: { captain: true, hl: 'est devenu capitaine par acclamation' } },
        ko: { x: 'Certains te suivent, d\'autres non. Ton ancien capitaine part avec deux hommes.', e: { captain: true, crewLoss: 'random', morale: -15 } } },
      { t: 'Le défier en duel', s: 'combat', d: 0,
        ok: { x: 'Tu gagnes. L\'équipage t\'acclame. Tu es le nouveau capitaine.', e: { captain: true, glory: 2 } },
        ko: { x: 'Il gagne. Tu restes à ta place.', e: { hp: -20, morale: -5 } } },
      { t: 'Le soutenir', r: { x: 'Tu lui redonnes confiance. Il te remercie. Tu restes son bras droit.', e: { loyalty: 10, morale: 10 } } },
    ],
  },
  {
    id: 'yonko_ascension', pri: 30, emoji: '👑', title: 'Un nouvel Empereur',
    w: { camp: 'chercheur', notFac: ['empereur'], test: S => S.combat >= 66 && S.hero.bounty >= 1_500_000_000 && S.tier >= 3 },
    x: 'Le journal de Morgans titre en première page : « UN NOUVEL EMPEREUR DES MERS ». Ta photo. Ta prime. Ton équipage. Le monde entier te reconnaît comme l\'un des Quatre Empereurs.',
    ch: [
      { t: 'Accepter le titre', r: { x: 'Tu es un Empereur. Les îles viennent demander ta protection. Les Amiraux t\'ont dans le viseur.', e: { faction: 'empereur', hl: 'est devenu un Empereur des mers', fleet: { name: 'Flotte impériale', power: 8 } } } },
      { t: 'Refuser le titre (et rester libre)', r: { x: 'Tu te fiches des titres. Le monde t\'appelle Empereur quand même.', e: { faction: 'empereur', morale: 10 } } },
    ],
  },
  {
    id: 'vassal_order', emoji: '📜', title: 'Ordre de l\'Empereur',
    w: { fac: ['vassal'], weight: 5 },
    x: S => `Un Den Den Mushi sonne. La voix de ${S.yonkoName()} : « J'ai besoin de toi. Va à ${S.tmpIsland().name}. Maintenant. »`,
    ch: [
      { t: 'Obéir', r: { x: 'Tu mets le cap. Ton Empereur est satisfait.', e: { goto: S => S.tmpIsland().id, merit: 6 } } },
      { t: 'Ignorer l\'ordre', r: { x: 'Le silence au bout du fil est terrifiant.', e: { merit: -8, flag: 'yonko_snub' } } },
      { t: 'Prendre ton indépendance', s: 'combat', d: 10,
        ok: { x: 'Tu arraches le drapeau de ton Empereur. Tu es libre, et tu as un ennemi juré.', e: { faction: 'pirate', glory: 10, hl: 'a renié son Empereur' } },
        ko: { x: 'L\'Empereur envoie un commandant pour te punir.', e: { hp: -50 } } },
    ],
  },
  {
    id: 'vassal_revolt', emoji: '⚔️', title: 'Renverser son Empereur',
    w: { fac: ['vassal'], test: S => S.combat >= 58 && S.tier >= 3, weight: 6 },
    x: S => `Tu es devenu trop fort pour rester dans l'ombre de ${S.yonkoName()}. L'équipage murmure. Le moment est peut-être venu.`,
    ch: [
      { t: 'Défier ton Empereur', s: 'combat', d: 22,
        ok: { x: 'Tu as vaincu ton propre Empereur. Son territoire est à toi. Tu es le nouvel Empereur.', e: { faction: 'empereur', glory: 40, hl: 'a renversé son propre Empereur' } },
        ko: { x: 'Ton Empereur t\'écrase. Tu survis par miracle.', e: { hp: -70, merit: -20 } } },
      { t: 'Attendre encore', r: { x: 'Patience.', e: {} } },
    ],
  },
  {
    id: 'admiral_hunt', emoji: '⚓', title: 'Un Amiral sur ta route',
    w: { camp: 'chercheur', minTier: 3, test: S => S.hero.bounty >= 400_000_000, weight: 4 },
    x: S => `Le ciel change. ${S.era === 'pre' ? 'Kizaru' : 'Fujitora'} se tient debout sur l'eau devant ton navire. « Ta tête vaut beaucoup trop. »`,
    ch: [
      { t: 'Combattre l\'Amiral', s: 'combat', d: 22,
        ok: { x: 'Tu as tenu tête à un Amiral. Le monde entier en parle. Ta prime s\'envole.', e: { glory: 35, hl: 'a repoussé un Amiral' } },
        ko: { x: 'L\'Amiral te met à terre. Ton équipage te sauve en te traînant à bord.', e: { hp: -70 } } },
      { t: 'Fuir', s: 'navigation', d: 14,
        ok: { x: 'Tu as échappé à un Amiral. Ce n\'est pas rien.', e: { glory: 5 } },
        ko: { x: 'L\'Amiral coule une partie de ton navire.', e: { shipHp: -80, hp: -30, crewLoss: 'random' } } },
    ],
  },
  {
    id: 'yonko_clash', emoji: '🌊', title: 'La flotte d\'un Empereur',
    w: { camp: 'gardien', minTier: 3, weight: 4 },
    x: S => `La flotte de ${S.tmpYonko().name} croise ta route. Des dizaines de navires. Le Den Den Mushi du QG crépite : « Ne les laissez pas passer. »`,
    ch: [
      { t: 'Attaquer', s: 'combat', d: 20,
        ok: { x: 'Tu as fait reculer la flotte d\'un Empereur. Le QG t\'acclame.', e: { merit: 30, glory: 20, hl: 'a fait reculer la flotte d\'un Empereur' } },
        ko: { x: 'Ta flotte est décimée. Tu rentres avec un seul navire.', e: { hp: -60, crewLoss: 'random', shipHp: -80 } } },
      { t: 'Ordonner le repli', s: 'intel', d: 6,
        ok: { x: 'Repli tactique réussi. Pas de pertes.', e: { merit: 3 } },
        ko: { x: 'La retraite tourne au désastre.', e: { hp: -40, merit: -5 } } },
    ],
  },
  {
    id: 'pirate_hunt', emoji: '🎯', title: 'Une cible de choix',
    w: { fac: ['marine', 'gouv', 'chasseur', 'chevalier', 'corsaire'], weight: 8 },
    x: S => `Un pirate recherché pour ${S.fmtPrime(S.tierPrime())} se cache dans le port. Ta cible du jour.`,
    ch: [
      { t: 'L\'arrêter', s: 'combat', d: 0,
        ok: { x: 'Le pirate est menotté. Prime encaissée, dossier rempli.', e: { merit: 6, berrys: S => S.tierPrime() / 2, glory: 2 } },
        ko: { x: 'Il t\'échappe après t\'avoir blessé.', e: { hp: -25 } } },
      { t: 'Lui tendre un piège', s: 'intel', d: 2,
        ok: { x: 'Le piège fonctionne. Arrestation sans un coup de feu.', e: { merit: 5, berrys: S => S.tierPrime() / 2 } },
        ko: { x: 'Il a éventé le piège.', e: { morale: -5 } } },
      { t: 'Le laisser filer contre un pot-de-vin', r: { x: 'Tu empoches l\'argent. Personne ne le saura. En principe.', e: { berrys: S => S.tierPrime() / 3, rep: -3, morale: -5 } } },
    ],
  },
  {
    id: 'cp_assassinat', emoji: '🕶️', title: 'Une mission dans l\'ombre',
    w: { fac: ['gouv'], weight: 8 },
    x: 'Ordre du CP : neutraliser un savant qui en sait trop sur le Siècle Oublié. Il vit sur l\'île, dans une petite maison au bord de l\'eau.',
    ch: [
      { t: 'Exécuter la mission', s: 'vitesse', d: 0,
        ok: { x: 'Mission accomplie. Le monde ne saura jamais. Toi, tu sauras.', e: { merit: 10, morale: -15 } },
        ko: { x: 'Le savant s\'est échappé. Ton supérieur n\'est pas content.', e: { merit: -5 } } },
      { t: 'Le laisser fuir en secret', s: 'intel', d: 4,
        ok: { x: 'Tu falsifies ton rapport. Le savant est libre. Toi, tu as gagné un ami et un secret.', e: { morale: 10, frel: { revo: 2 }, flag: 'cp_mercy' } },
        ko: { x: 'Ton supérieur a des doutes.', e: { merit: -8 } } },
      { t: 'Le faire prisonnier pour l\'interroger', s: 'combat', d: 2,
        ok: { x: 'Il parle de Joy Boy, du Siècle Oublié, d\'un trésor. Tu es troublé.', e: { stats: { intel: 2 }, merit: 6 } },
        ko: { x: 'Il préfère se jeter à la mer.', e: { morale: -10 } } },
    ],
  },
  {
    id: 'revo_sabotage', emoji: '💥', title: 'Une mission de sabotage',
    w: { fac: ['revo'], weight: 8 },
    x: 'Ordre de l\'état-major : un royaume allié du Gouvernement ruine son peuple pour payer le tribut céleste. Sabote le navire du tribut.',
    ch: [
      { t: 'Faire sauter le navire', s: 'intel', d: 2,
        ok: { x: 'Le navire du tribut coule. L\'argent est redistribué au peuple. La Révolution progresse.', e: { merit: 8, glory: 3, rep: 4 } },
        ko: { x: 'Les gardes t\'ont repéré. Tu fuis sous les balles.', e: { hp: -30 } } },
      { t: 'Soulever le peuple', s: 'charisme', d: 4,
        ok: { x: 'Le peuple se soulève. Le roi s\'enfuit. Une victoire pour la Révolution.', e: { merit: 12, glory: 5, rep: 6 } },
        ko: { x: 'La révolte est réprimée dans le sang.', e: { morale: -20, hp: -20 } } },
      { t: 'Voler le tribut pour l\'équipage', r: { x: 'L\'état-major n\'apprécierait pas. Mais l\'équipage, si.', e: { berrys: 10_000_000, merit: -10, morale: 10 } } },
    ],
  },
  {
    id: 'chevalier_mission', emoji: '⚜️', title: 'La loi des Chevaliers Divins',
    w: { fac: ['chevalier'], weight: 8 },
    x: 'Un Dragon Céleste a enfreint la loi sacrée : il a frappé un autre Dragon Céleste. Les Chevaliers Divins doivent le punir. C\'est ta mission.',
    ch: [
      { t: 'Le punir', s: 'combat', d: 0,
        ok: { x: 'Justice est faite. Les Dragons Célestes te respectent... et te craignent.', e: { merit: 10 } },
        ko: { x: 'Il a de puissants gardes.', e: { hp: -30 } } },
      { t: 'Négocier', s: 'charisme', d: 2,
        ok: { x: 'Il accepte une amende. L\'affaire est close.', e: { merit: 6, berrys: 20_000_000 } },
        ko: { x: 'Il refuse. Il faudra employer la force.', e: { merit: -2 } } },
      { t: 'Fermer les yeux', r: { x: 'Personne ne le saura. Saint Garling, peut-être.', e: { merit: -5 } } },
    ],
  },
  {
    id: 'roi_awaken', pri: 40, emoji: '👑', title: 'Le Haki des Rois',
    w: { test: S => S.hero.roiPotential && S.hero.haki.roi === 0 && (S.hero.hp < S.hero.hpMax * 0.5 || S.turn >= 8) && S.tier >= 2 },
    x: S => `Tes ennemis encerclent ${S.randomCrew()?.name || 'ton équipage'}. Quelque chose explose en toi. Une onde invisible traverse l'air. Autour de toi, les hommes s'effondrent, les yeux révulsés.`,
    ch: [
      { t: 'Laisser éclater ta volonté', r: { x: 'Le Haki des Rois. Un homme sur un million le possède. Tu es l\'un d\'eux.', e: { haki: { roi: 1 }, glory: 5, hl: 'a éveillé le Haki des Rois' } } },
    ],
  },
  {
    id: 'fruit_awaken', pri: 30, emoji: '✨', title: 'L\'éveil',
    w: { test: S => S.hero.fruit && !S.hero.fruit.awakened && S.combat >= 55 && S.hero.stats.volonte >= 12 && S.hero.fruit.id !== 'smile' },
    x: 'Pendant un combat désespéré, ton fruit du démon réagit. Le monde autour de toi se met à changer : le sol, les murs, l\'air. Ton pouvoir ne s\'arrête plus à ton corps.',
    ch: [
      { t: 'Embrasser l\'éveil', r: { x: 'Ton fruit du démon s\'est éveillé. Peu de gens au monde ont atteint ce niveau.', e: { awaken: true, glory: 10, hl: 'a éveillé son fruit du démon' } } },
    ],
  },
  {
    id: 'haki_rayleigh', pri: 25, emoji: '👓', title: 'Les leçons de Rayleigh',
    w: { isl: ['sabaody'], test: S => S.flags.rayleigh_offer && S.hero.haki.obs === 0 },
    x: 'Rayleigh pose son verre. « Le Haki est en chacun de nous. Il faut juste apprendre à l\'écouter. Deux ans, ça te dit ? Ou... une semaine intensive ? »',
    ch: [
      { t: 'L\'entraînement intensif (1 semaine)', s: 'volonte', d: 4,
        ok: { x: 'Tu as appris l\'Observation et l\'Armement. Rayleigh est satisfait.', e: { haki: { obs: 1, arm: 1 } } },
        ko: { x: 'Tu as appris l\'Observation. L\'Armement viendra plus tard.', e: { haki: { obs: 1 } } } },
      { t: 'Deux ans d\'entraînement', r: { x: 'Deux ans plus tard, tu es méconnaissable. Le monde a changé aussi.', e: { age: 2, haki: { obs: 2, arm: 2 }, stats: { force: 2, vitesse: 2, volonte: 2 }, hl: 'a été entraîné deux ans par Rayleigh' } } },
    ],
  },
];

// ═══════════════ ÉQUIPAGE ═══════════════
export const CREW_EVENTS = [
  {
    id: 'crew_party', emoji: '🎉', title: 'Fête à bord',
    w: { test: S => S.crew.length >= 2, weight: 4 },
    x: S => `${S.randomCrew().name} sort le saké. Tout l'équipage chante le Saké de Binks jusqu'à l'aube.`,
    ch: [
      { t: 'Faire la fête', r: { x: 'Une soirée mémorable. Tout le monde est plus soudé.', e: { morale: 20, loyalty: 10, hp: -5 } } },
      { t: 'Organiser un concours de bras de fer', s: 'force', d: -2,
        ok: { x: 'Tu gagnes. Ton équipage t\'admire.', e: { loyalty: 10, morale: 10 } },
        ko: { x: 'Ton cuisinier te bat. Humiliation.', e: { morale: 15, hl: 'a perdu au bras de fer contre son cuisinier' } } },
    ],
  },
  {
    id: 'crew_dispute', emoji: '😤', title: 'Dispute à bord',
    w: { test: S => S.crew.length >= 2, weight: 3 },
    x: S => {
      const [a, b] = S.twoCrew();
      return `${a.name} et ${b.name} se battent sur le pont. L'un accuse l'autre d'avoir mangé sa part de viande. L'équipage attend ta réaction.`;
    },
    ch: [
      { t: 'Les séparer et trancher', s: 'charisme', d: 0,
        ok: { x: 'Tu calmes tout le monde. Ils se serrent la main.', e: { loyalty: 5 } },
        ko: { x: 'L\'un des deux boude pendant des semaines.', e: { loyalty: -10, morale: -10 } } },
      { t: 'Les laisser régler ça au poing', r: { x: 'Ils se battent jusqu\'à épuisement, puis rient ensemble. Les marins sont comme ça.', e: { morale: 5 } } },
      { t: 'Racheter de la viande pour tout le monde', c: 500_000, r: { x: 'Problème résolu. Tout le monde t\'adore.', e: { morale: 15, loyalty: 5 } } },
    ],
  },
  {
    id: 'crew_leave', emoji: '👋', title: 'Un départ',
    w: { test: S => S.crew.some(c => c.loyalty < 30 && !c.isCaptain), weight: 6 },
    x: S => `${S.lowLoyalCrew().name} a fait son sac. « Je ne crois plus en cet équipage. »`,
    ch: [
      { t: 'Le convaincre de rester', s: 'charisme', d: 4,
        ok: { x: 'Il défait son sac. « Bon. Encore une île. »', e: { loyalty: 10 } },
        ko: { x: 'Il part. L\'équipage est sous le choc.', e: { crewLoss: 'lowloyal', morale: -10 } } },
      { t: 'Le laisser partir', r: { x: 'Il part. Tu lui souhaites bonne chance.', e: { crewLoss: 'lowloyal', morale: -5 } } },
    ],
  },
  {
    id: 'crew_fruit', emoji: '🍇', title: 'Un fruit pour l\'équipage',
    w: { test: S => S.crew.length >= 1 && S.inventory.fruits.length > 0, weight: 3 },
    x: S => `${S.randomCrew().name} regarde le fruit du démon dans la cale avec envie. « Capitaine... et si je le mangeais ? »`,
    ch: [
      { t: 'Le lui donner', r: { x: 'Il le mange. Il a un pouvoir maintenant. Il est fou de joie.', e: { giveFruit: 'random' } } },
      { t: 'Le garder', r: { x: 'Il est déçu.', e: { loyalty: -5 } } },
    ],
  },
  {
    id: 'crew_sacrifice', emoji: '💔', title: 'Un sacrifice',
    w: { test: S => S.crew.length >= 3 && S.tier >= 2 && S.hero.hp < S.hero.hpMax * 0.6, weight: 2 },
    x: S => `L'ennemi te vise d'un coup mortel. ${S.randomCrew().name} se jette devant toi.`,
    ch: [
      { t: 'Le repousser et encaisser toi-même', s: 'volonte', d: 4,
        ok: { x: 'Tu encaisses. Vous survivez tous les deux. L\'équipage est soudé à jamais.', e: { hp: -30, loyalty: 20, morale: 10 } },
        ko: { x: 'Tu encaisses. C\'est terrible.', e: { hp: -50, loyalty: 15 } } },
      { t: 'Le laisser faire', r: { x: 'Il te sauve la vie. Il ne se relève pas. Ton équipage pleure. Ton cœur aussi.', e: { crewLoss: 'random', morale: -30, stats: { volonte: 2 }, hl: 'a perdu un membre d\'équipage qui s\'est sacrifié pour lui' } } },
    ],
  },
  {
    id: 'crew_dream', emoji: '🌠', title: 'Le rêve d\'un compagnon',
    w: { test: S => S.crew.length >= 2, weight: 3 },
    x: S => `Sur le pont, la nuit, ${S.randomCrew().name} te parle de son rêve : voir la mer de toutes les mers, All Blue. Ou être le meilleur dans son art. Ou retrouver quelqu'un.`,
    ch: [
      { t: 'Lui promettre de l\'aider', r: { x: 'Il te sourit. Il ne l\'oubliera jamais.', e: { loyalty: 15 } } },
      { t: 'Se moquer de lui', r: { x: 'Il ne te parle plus pendant des jours.', e: { loyalty: -15, morale: -5 } } },
    ],
  },
  {
    id: 'crew_betrayal', emoji: '🗡️', title: 'Trahison',
    w: { test: S => S.crew.some(c => c.loyalty < 20) && S.hero.bounty > 20_000_000, weight: 3 },
    x: S => `${S.lowLoyalCrew().name} a vendu ta position à la Marine contre une récompense. Des navires de guerre approchent.`,
    ch: [
      { t: 'Combattre la Marine', s: 'combat', d: 4,
        ok: { x: 'Tu repousses la Marine. Le traître a disparu.', e: { crewLoss: 'lowloyal', glory: 4 } },
        ko: { x: 'Tu fuis avec de lourdes pertes.', e: { crewLoss: 'lowloyal', hp: -30, shipHp: -30 } } },
      { t: 'Fuir', s: 'navigation', d: 2,
        ok: { x: 'Tu échappes à la Marine. Le traître est resté sur le quai.', e: { crewLoss: 'lowloyal' } },
        ko: { x: 'La Marine te rattrape.', e: { crewLoss: 'lowloyal', hp: -30 } } },
    ],
  },
];

// ═══════════════ ÉVÉNEMENTS D'ÎLE GÉNÉRIQUES ═══════════════
export const GENERIC_EVENTS = [
  {
    id: 'g_tavern_brawl', emoji: '🍺', title: 'Bagarre de taverne',
    w: { weight: 5 },
    x: 'Dans la taverne du port, un pirate ivre renverse ta boisson et te traite de « mousse ». Toute la salle attend ta réaction.',
    ch: [
      { t: 'Lui casser une chaise sur la tête', s: 'combat', d: -2,
        ok: { x: 'La chaise se brise, le pirate aussi. La taverne t\'offre une tournée.', e: { glory: 1, morale: 5 } },
        ko: { x: 'Il avait beaucoup d\'amis. Tu finis dans la rue.', e: { hp: -20 } } },
      { t: 'Lui offrir un verre', s: 'charisme', d: -4,
        ok: { x: 'Il te raconte des histoires de Grand Line. Il s\'avère que c\'est un ancien navigateur.', e: { stats: { navigation: 1 } } },
        ko: { x: 'Il boit ton verre et part sans payer.', e: { berrys: -100_000 } } },
      { t: 'Partir sans rien dire', r: { x: 'Tu évites les ennuis. Mais tu as soif.', e: {} } },
    ],
  },
  {
    id: 'g_hunters', emoji: '🎯', title: 'Chasseurs de primes',
    w: { camp: 'chercheur', test: S => S.hero.bounty > 0 && S.hero.faction !== 'corsaire', weight: 5 },
    x: S => `Ton avis de recherche est cloué à la porte de la taverne. ${S.fmtPrime(S.hero.bounty)}. Trois chasseurs de primes te barrent la route.`,
    ch: [
      { t: 'Se battre', s: 'combat', d: 0,
        ok: { x: 'Ils repartent en rampant. Ta légende grandit.', e: { glory: 2 } },
        ko: { x: 'Ils te blessent avant que ton équipage n\'intervienne.', e: { hp: -25 } } },
      { t: 'Fuir par les toits', s: 'vitesse', d: 0,
        ok: { x: 'Tu les sèmes.', e: {} },
        ko: { x: 'Tu tombes du toit.', e: { hp: -15 } } },
      { t: 'Les recruter', s: 'charisme', d: 4,
        ok: { x: 'Ils deviennent tes alliés. L\'un d\'eux rejoint ton équipage.', e: { recruit: { role: 'combattant' } } },
        ko: { x: 'Ils rient, puis attaquent.', e: { hp: -20 } } },
    ],
  },
  {
    id: 'g_marine_patrol', emoji: '⚓', title: 'Patrouille de la Marine',
    w: { camp: 'chercheur', test: S => S.hero.faction !== 'corsaire', weight: 5 },
    x: 'Une patrouille de la Marine fouille le port. Un commandant compare les visages aux avis de recherche.',
    ch: [
      { t: 'Les attaquer', s: 'combat', d: 2,
        ok: { x: 'La patrouille est repoussée. Ta prime augmente.', e: { glory: 3 } },
        ko: { x: 'Tu es blessé et dois fuir.', e: { hp: -30 } } },
      { t: 'Se déguiser', s: 'intel', d: 0,
        ok: { x: 'Un faux nez, une moustache : personne ne te reconnaît.', e: {} },
        ko: { x: 'Le commandant arrache ta fausse moustache. Course-poursuite.', e: { hp: -15, glory: 1 } } },
      { t: 'Se rendre (pour rire)', r: { x: 'Ils ne te croient pas. « Va-t\'en, plaisantin. »', e: { hl: 'a essayé de se rendre à la Marine et n\'a pas été cru' } } },
    ],
  },
  {
    id: 'g_tyrant', emoji: '👿', title: 'Un tyran local',
    w: { weight: 5 },
    x: 'Un petit seigneur de guerre écrase l\'île sous les taxes. Les habitants te supplient de les aider.',
    ch: [
      { t: 'Renverser le tyran', s: 'combat', d: 0,
        ok: { x: 'Le tyran est vaincu. L\'île est libre. Les habitants te remercient avec un festin.', e: { glory: 3, rep: 4, hp: 20, morale: 10 } },
        ko: { x: 'Ses gardes te repoussent.', e: { hp: -25 } } },
      { t: 'Négocier avec lui', s: 'charisme', d: 2,
        ok: { x: 'Il baisse les taxes. Les gens sont soulagés.', e: { rep: 2 } },
        ko: { x: 'Il te met à l\'amende.', e: { berrys: -500_000 } } },
      { t: 'Prendre sa place', s: 'combat', d: 2, req: notF('marine', 'gouv', 'revo'), rq: 'Pas pour toi',
        ok: { x: 'Tu es le nouveau seigneur de l\'île. Les habitants... ne sont pas sûrs que ce soit mieux.', e: { glory: 3, berrys: 3_000_000, rep: -2, territory: 1 } },
        ko: { x: 'Le tyran te repousse.', e: { hp: -25 } } },
    ],
  },
  {
    id: 'g_festival', emoji: '🎆', title: 'Fête de l\'île',
    w: { weight: 4 },
    x: 'C\'est jour de fête sur l\'île : feux d\'artifice, concours de mangeurs, danses. Tout le monde est invité.',
    ch: [
      { t: 'Participer au concours de mangeurs', s: 'volonte', d: -2,
        ok: { x: 'Tu as mangé 47 brochettes. Tu as gagné. Tu ne peux plus bouger.', e: { berrys: 1_000_000, hp: 20, hl: 'a gagné un concours de mangeurs' } },
        ko: { x: 'Tu as vomi au bout de la 3e brochette.', e: { morale: -5 } } },
      { t: 'Danser toute la nuit', r: { x: 'L\'équipage se détend enfin.', e: { morale: 20, hp: 10 } } },
      { t: 'Voler dans les poches des fêtards', s: 'vitesse', d: 0, req: notF('marine', 'chevalier'), rq: 'Pas pour toi',
        ok: { x: 'Belle récolte.', e: { berrys: 2_000_000, rep: -2 } },
        ko: { x: 'On t\'a vu.', e: { rep: -4, hp: -10 } } },
    ],
  },
  {
    id: 'g_old_master', emoji: '🧓', title: 'Un vieux maître',
    w: { minTier: 2, weight: 3 },
    x: 'Un vieil homme pêche sur le quai. Quand tu passes, il t\'arrête d\'un regard. « Tu as du potentiel. Mais tu ne sais pas encore écouter. »',
    ch: [
      { t: 'Lui demander de t\'enseigner', s: 'volonte', d: 2,
        ok: { x: 'Il t\'apprend à sentir les présences. Le Haki de l\'observation.', e: { haki: { obs: 1 } } },
        ko: { x: 'Il te fait porter des seaux d\'eau pendant trois jours. Tu as des muscles.', e: { stats: { force: 1 } } } },
      { t: 'Le provoquer', s: 'combat', d: 8,
        ok: { x: 'Il sourit. « Pas mal. » Il t\'apprend l\'Armement.', e: { haki: { arm: 1 } } },
        ko: { x: 'Il te met KO avec sa canne à pêche.', e: { hp: -25, hl: 'a été mis KO par un vieux pêcheur' } } },
      { t: 'Ignorer le vieux fou', r: { x: 'Il rit dans ton dos.', e: {} } },
    ],
  },
  {
    id: 'g_treasure_map', emoji: '🗺️', title: 'Une carte au trésor',
    w: { weight: 3 },
    x: 'Un enfant te vend une carte au trésor pour 1000 berrys. Elle a l\'air vraie. Ou du moins, pas trop fausse.',
    ch: [
      { t: 'Suivre la carte', s: 'intel', d: 0,
        ok: { x: 'Un vrai trésor ! Pièces d\'or et un objet mystérieux.', e: { berrys: S => S.tierPrime() / 4, fruit: S => S.chance(0.25) ? 'random' : null } },
        ko: { x: 'La croix mène à un nid de serpents.', e: { hp: -20 } } },
      { t: 'Revendre la carte plus cher', s: 'charisme', d: 0,
        ok: { x: 'Tu la revends 10 fois son prix à un pirate crédule.', e: { berrys: 500_000 } },
        ko: { x: 'Personne n\'en veut.', e: {} } },
    ],
  },
  {
    id: 'g_gambling', emoji: '🎲', title: 'Tripot clandestin',
    w: { weight: 3 },
    x: 'Un tripot clandestin. Dés, cartes, et un croupier aux yeux de serpent. On dit qu\'on peut gagner une fortune. Ou tout perdre.',
    ch: [
      { t: 'Tout miser', p: () => 0.4,
        ok: { x: 'JACKPOT ! Tu as doublé ta fortune.', e: { berrysMul: 2, hl: 'a doublé sa fortune au jeu' } },
        ko: { x: 'Tu as tout perdu. Même ta chemise.', e: { berrysMul: 0, morale: -15, hl: 'a perdu toute sa fortune au jeu' } } },
      { t: 'Jouer prudemment', s: 'intel', d: 0,
        ok: { x: 'Petit gain.', e: { berrys: S => S.tierPrime() / 10 } },
        ko: { x: 'Petite perte.', e: { berrys: S => -S.tierPrime() / 20 } } },
      { t: 'Démasquer le tricheur', s: 'combat', d: 0,
        ok: { x: 'Le croupier trichait. Tu récupères la caisse.', e: { berrys: S => S.tierPrime() / 5, glory: 1 } },
        ko: { x: 'Les gros bras du tripot te jettent dehors.', e: { hp: -20 } } },
    ],
  },
  {
    id: 'g_sickness', emoji: '🤒', title: 'Épidémie',
    w: { weight: 3 },
    x: 'Une fièvre ravage le village. Les médecins sont débordés.',
    ch: [
      { t: 'Aider à soigner les malades', s: 'intel', d: 0,
        ok: { x: 'Tu sauves des vies. Le village t\'adore.', e: { rep: 5, stats: { intel: 1 } } },
        ko: { x: 'Tu attrapes la fièvre.', e: { hp: -30 } } },
      { t: 'Faire appel au médecin de bord', req: crewHas('medecin'), rq: 'Il te faut un médecin', r: { x: 'Ton médecin fait des merveilles. Le village est sauvé.', e: { rep: 6, loyalty: 5 } } },
      { t: 'Partir avant d\'être contaminé', r: { x: 'Sage, mais pas glorieux.', e: { rep: -1 } } },
    ],
  },
  {
    id: 'g_slavers', emoji: '⛓️', title: 'Marchands d\'esclaves',
    w: { minTier: 2, weight: 3 },
    x: 'Des marchands d\'esclaves embarquent des prisonniers dans une cale. Direction Sabaody.',
    ch: [
      { t: 'Libérer les prisonniers', s: 'combat', d: 2, req: notF('chevalier'), rq: 'Tu es leur client',
        ok: { x: 'Les prisonniers sont libres. L\'un d\'eux veut te suivre.', e: { glory: 3, rep: 5, recruit: true, frel: { revo: 1 } } },
        ko: { x: 'Les marchands sont bien armés.', e: { hp: -30 } } },
      { t: 'Les dénoncer à la Marine', s: 'charisme', d: 0,
        ok: { x: 'La Marine intervient. Pour une fois.', e: { rep: 3 } },
        ko: { x: 'La Marine fait semblant de ne pas voir. Ils sont payés.', e: { morale: -10 } } },
      { t: 'Regarder ailleurs', r: { x: 'Tu regardes ailleurs. Ce n\'est pas ton problème. Hein ?', e: { morale: -10 } } },
    ],
  },
  {
    id: 'g_tenryu', emoji: '🫧', title: 'Un Dragon Céleste en visite',
    w: { minTier: 2, weight: 2 },
    x: 'Un Dragon Céleste en bulle de verre traverse la ville sur le dos d\'un esclave. Tout le monde doit s\'agenouiller. Il pointe du doigt une jeune femme : « Celle-là sera ma 13e épouse. »',
    ch: [
      { t: 'Le frapper', s: 'combat', d: 4, req: notF('chevalier'), rq: 'C\'est ton cousin',
        ok: { x: 'Ton poing traverse la bulle. Tu viens de déclencher un Buster Call potentiel. Mais quel plaisir.', e: { glory: 10, bounty: 20_000_000, frel: { gov: -4 }, flag: 'punched_tenryu', hl: 'a frappé un Dragon Céleste' } },
        ko: { x: 'Ses gardes t\'arrêtent. Un amiral est en route.', e: { capture: 'impeldown' } } },
      { t: 'Aider la jeune femme à fuir', s: 'vitesse', d: 2,
        ok: { x: 'Elle est sauvée, et personne ne t\'a vu.', e: { rep: 4 } },
        ko: { x: 'Les gardes te repèrent. Fuite en catastrophe.', e: { hp: -20 } } },
      { t: 'S\'agenouiller', r: { x: 'Tu t\'agenouilles. Tu détestes ça.', e: { morale: -15 } } },
    ],
  },
  {
    id: 'g_rival', emoji: '⚔️', title: 'Un rival',
    w: { weight: 4 },
    x: S => `Un équipage rival te provoque sur le port. Leur capitaine a la même prime que toi, à peu près. Il veut prouver qu'il est meilleur.`,
    ch: [
      { t: 'Accepter le duel', s: 'combat', d: 2,
        ok: { x: 'Tu gagnes. Leur capitaine te jure loyauté.', e: { glory: 4, fleet: S => S.hero.isCaptain && S.camp === 'chercheur' ? { name: 'Équipage rival soumis', power: 2 } : null } },
        ko: { x: 'Tu perds. Ils se moquent de toi jusqu\'au départ.', e: { hp: -30, morale: -10 } } },
      { t: 'Proposer une alliance', s: 'charisme', d: 2,
        ok: { x: 'Une alliance de pirates ! Vous trinquez.', e: { fleet: S => S.camp === 'chercheur' ? { name: 'Alliance de pirates', power: 2 } : null, rep: 2 } },
        ko: { x: 'Ils refusent.', e: {} } },
      { t: 'Les ignorer', r: { x: 'Ils te traitent de lâche.', e: { rep: -1 } } },
    ],
  },
  {
    id: 'g_weapon_smith', emoji: '🔨', title: 'Un forgeron excentrique',
    w: { weight: 3 },
    x: 'Un vieux forgeron te montre une arme dans sa boutique poussiéreuse. « Elle n\'a pas trouvé de propriétaire depuis 20 ans. Peut-être toi ? »',
    ch: [
      { t: 'Prendre l\'arme en main', s: 'volonte', d: 2,
        ok: { x: 'L\'arme réagit à ta volonté. Le forgeron te l\'offre.', e: { weapon: S => `random${Math.min(5, S.tier + 1)}` } },
        ko: { x: 'Elle te glisse des mains et tombe sur ton pied.', e: { hp: -10 } } },
      { t: 'Lui acheter', c: S => S.tierPrime() / 3, r: { x: 'Belle arme.', e: { weapon: S => `random${S.tier}` } } },
    ],
  },
  {
    id: 'g_fortune', emoji: '🃏', title: 'La diseuse de bonne aventure',
    w: { weight: 2 },
    x: 'Une diseuse de bonne aventure tire les cartes pour toi. « Je vois... la mort. Ou un grand destin. Les cartes hésitent. »',
    ch: [
      { t: 'Écouter la suite', s: 'intel', d: 0,
        ok: { x: '« Ta route passe par une île que tu n\'attends pas. » Tu sens que c\'est important.', e: { stats: { intel: 1 }, flag: 'prophecy' } },
        ko: { x: '« Tu mourras... un jour. » Merci.', e: {} } },
      { t: 'Lui demander les numéros gagnants', r: { x: 'Elle te lance un regard noir.', e: {} } },
    ],
  },
  {
    id: 'g_photographer', emoji: '📸', title: 'La News Coo',
    w: { weight: 2 },
    x: 'Une mouette journaliste, la News Coo, se pose sur ton navire. Un photographe de Morgans veut un cliché exclusif pour le journal.',
    ch: [
      { t: 'Prendre la pose la plus héroïque', r: { x: 'La photo fait la une ! Ta notoriété explose.', e: { glory: 3, rep: 2 } } },
      { t: 'Faire une grimace', r: { x: 'La photo fait la une. Pour les mauvaises raisons.', e: { glory: 2, hl: 'a fait une grimace en une du journal mondial' } } },
      { t: 'Chasser le photographe', r: { x: 'Morgans n\'est pas content. Un article désobligeant sort sur toi.', e: { rep: -2 } } },
    ],
  },
  {
    id: 'g_volunteer', emoji: '🙋', title: 'Un volontaire sur le quai',
    w: { test: S => S.crew.length < 6, weight: 9 },
    x: S => `À peine amarré, quelqu'un t'attend sur le quai, sac sur l'épaule. « J'ai entendu parler de toi. Je veux partir en mer. Je sais me rendre utile. »${S.crew.length < 2 ? ' Ton navire a l\'air bien vide, il faut dire.' : ''}`,
    ch: [
      { t: 'Bienvenue à bord !', r: { x: 'Une poignée de main, un sac jeté sur le pont, et te voilà un de plus.', e: { recruit: true, morale: 5 } } },
      { t: 'Lui faire passer un test d\'abord', s: 'intel', d: -4,
        ok: { x: 'Tu as bien jugé : c\'est quelqu\'un de solide, et il en amène un autre.', e: { recruit: { tier: S => S.tier + 1 }, loyalty: 5 } },
        ko: { x: 'Le test était trop dur. Il embarque quand même, un peu vexé.', e: { recruit: true } } },
      { t: 'Refuser', r: { x: 'Il repart en traînant les pieds.', e: {} } },
    ],
  },
  {
    id: 'g_stowaway', emoji: '🧒', title: 'Un passager clandestin',
    w: { weight: 4 },
    x: 'Dans un tonneau de pommes, tu trouves un gamin. Il veut rejoindre ton équipage. Il a l\'air plein de talent. Et de faim.',
    ch: [
      { t: 'L\'accepter dans l\'équipage', r: { x: 'Il saute de joie.', e: { recruit: { tier: 1 } } } },
      { t: 'Le déposer au port', r: { x: 'Il pleure. Tu culpabilises.', e: { morale: -5 } } },
    ],
  },
  {
    id: 'g_black_market', emoji: '🕶️', title: 'Marché noir',
    w: { minTier: 2, weight: 3 },
    x: 'Un homme louche te propose un fruit du démon « garanti authentique ». Il te fait un prix.',
    ch: [
      { t: 'Acheter le fruit', c: S => S.tierPrime() / 2, r: { x: 'Tu as un fruit du démon. Authentique ? Qui sait.', e: { fruit: S => S.chance(0.85) ? 'random' : 'smile' } } },
      { t: 'Le dénoncer', s: 'combat', d: 0, req: isGa, rq: 'Gardiens uniquement',
        ok: { x: 'Arrestation. Le fruit est saisi... et finit dans ta cale.', e: { merit: 5, fruit: 'random' } },
        ko: { x: 'Il disparaît.', e: {} } },
      { t: 'Le voler', s: 'vitesse', d: 4, req: isCh, rq: 'Chercheurs uniquement',
        ok: { x: 'Tu as volé le fruit !', e: { fruit: 'random', rep: -2 } },
        ko: { x: 'Ses gardes du corps te tabassent.', e: { hp: -30 } } },
    ],
  },
  {
    id: 'g_sea_king_port', emoji: '🐉', title: 'Un Roi des Mers attaque',
    w: { minTier: 2, weight: 2 },
    x: 'Un Roi des Mers énorme sort de l\'eau et attaque le port. Les habitants fuient.',
    ch: [
      { t: 'L\'affronter', s: 'combat', d: 4,
        ok: { x: 'Tu l\'as assommé. Le port t\'offre un festin de Roi des Mers rôti.', e: { glory: 4, rep: 5, hp: 30 } },
        ko: { x: 'Il t\'avale presque.', e: { hp: -40 } } },
      { t: 'Évacuer les habitants', s: 'charisme', d: 0,
        ok: { x: 'Tout le monde est sain et sauf.', e: { rep: 4 } },
        ko: { x: 'Le chaos est total.', e: { morale: -5 } } },
    ],
  },
  {
    id: 'g_wanted', emoji: '📜', title: 'Ton premier avis de recherche',
    pri: 9,
    w: { camp: 'chercheur', test: S => S.hero.bounty > 0 && !S.flags.first_wanted },
    x: S => `Le journal arrive. Dedans : ton premier avis de recherche ! ${S.fmtPrime(S.hero.bounty)}. Ta photo est ratée, mais c'est toi.`,
    ch: [
      { t: 'L\'encadrer', r: { x: 'Il trônera dans ta cabine pour toujours.', e: { flag: 'first_wanted', item: 'wanted_poster', morale: 15 } } },
      { t: 'L\'envoyer à ta famille', r: { x: 'Ta mère pleure. De fierté ? De honte ?', e: { flag: 'first_wanted', morale: 10 } } },
      { t: 'Râler parce que la prime est trop basse', r: { x: 'L\'équipage rit.', e: { flag: 'first_wanted', morale: 5, hl: S => `a râlé sur sa première prime de ${S.fmtPrime(S.hero.bounty)}` } } },
    ],
  },
  {
    id: 'g_promotion', emoji: '🎖️', title: 'Une cérémonie',
    pri: 9, repeat: true,
    w: { camp: 'gardien', test: S => S.flags.promoted_pending },
    x: S => `Une cérémonie a lieu en ton honneur. Tu es promu ${S.rankName()}.`,
    ch: [
      { t: 'Saluer', r: { x: 'Fierté.', e: { unflag: 'promoted_pending', morale: 10 } } },
      { t: 'Faire un discours', s: 'charisme', d: 0,
        ok: { x: 'Ton discours émeut l\'assemblée.', e: { unflag: 'promoted_pending', rep: 3 } },
        ko: { x: 'Tu bégaies. On rit.', e: { unflag: 'promoted_pending' } } },
    ],
  },
  {
    id: 'g_marine_training', emoji: '🏋️', title: 'Entraînement militaire',
    w: { fac: ['marine', 'gouv'], weight: 4 },
    x: 'Un instructeur te propose une session de Rokushiki, les six techniques secrètes du CP.',
    ch: [
      { t: 'Apprendre le Soru', s: 'vitesse', d: 2,
        ok: { x: 'Tu te déplaces plus vite que l\'œil.', e: { stats: { vitesse: 2 } } },
        ko: { x: 'Tu as trébuché.', e: { stats: { vitesse: 1 } } } },
      { t: 'Apprendre le Tekkai', s: 'volonte', d: 2,
        ok: { x: 'Ton corps est dur comme le fer.', e: { stats: { volonte: 2 } } },
        ko: { x: 'Tu as un bleu.', e: { stats: { volonte: 1 } } } },
      { t: 'Apprendre le Shigan', s: 'force', d: 2,
        ok: { x: 'Ton doigt est une balle.', e: { stats: { force: 2 } } },
        ko: { x: 'Tu t\'es tordu le doigt.', e: { stats: { force: 1 }, hp: -5 } } },
    ],
  },
  {
    id: 'g_archeologue', emoji: '📜', title: 'Un archéologue clandestin',
    w: { minTier: 2, test: S => S.pone.length >= 1 && !S.canRead, weight: 9 },
    x: 'Dans l\'arrière-salle d\'une librairie, un vieil homme recopie des symboles anciens à la bougie. Il a fui Ohara il y a vingt ans. Il sait lire les Poneglyphes, et le Gouvernement le cherche encore.',
    ch: [
      { t: 'Le convaincre de rejoindre ton équipage', s: 'charisme', d: 2,
        ok: { x: 'Il range ses pinceaux. « Je veux voir la vérité avant de mourir. » Il embarque.', e: { recruit: { role: 'archeologue', tier: 3, name: 'Le vieux d\'Ohara' } } },
        ko: { x: 'Il a trop peur. Il disparaît dans la nuit. Mais il t\'a laissé une feuille de notes.', e: { stats: { intel: 2 } } } },
      { t: 'Lui acheter une grammaire des Poneglyphes', c: S => S.tierPrime(), r: { x: 'Un carnet couvert de symboles et de traductions. Avec de la patience, tu sauras lire les Poneglyphes.', e: { flag: 'can_read_pone', stats: { intel: 1 } } } },
      { t: 'Le livrer au Gouvernement', req: isGa, rq: 'Gardiens uniquement', r: { x: 'Un archéologue de moins. Le Gouvernement te remercie. Tu confisques ses notes, au cas où.', e: { merit: 10, flag: 'can_read_pone', morale: -10 } } },
    ],
  },
  {
    id: 'g_bounty_target', emoji: '🎯', title: 'Le chasseur traqué',
    w: { fac: ['chasseur'], weight: 6 },
    x: S => `Un pirate recherché pour ${S.fmtPrime(S.tierPrime() * 2)} vient d'accoster. Un gros poisson.`,
    ch: [
      { t: 'L\'attaquer de front', s: 'combat', d: 4,
        ok: { x: 'Belle prise ! La Marine te paie la prime.', e: { berrys: S => S.tierPrime() * 2, merit: 6, glory: 2 } },
        ko: { x: 'Il était plus fort que prévu.', e: { hp: -35 } } },
      { t: 'Le suivre jusqu\'à son repaire', s: 'intel', d: 2,
        ok: { x: 'Tu as trouvé tout son équipage. Double prime.', e: { berrys: S => S.tierPrime() * 3, merit: 8 } },
        ko: { x: 'Il t\'a repéré.', e: { hp: -20 } } },
      { t: 'Lui proposer de faire équipe', s: 'charisme', d: 4,
        ok: { x: 'Il rejoint tes associés.', e: { recruit: { role: 'combattant', tier: S => S.tier + 1 } } },
        ko: { x: 'Il rit et part.', e: {} } },
    ],
  },
];

// ═══════════════ ÉVÉNEMENTS EN MER ═══════════════
export const SEA_EVENTS = [
  {
    id: 's_storm', emoji: '⛈️', title: 'Tempête',
    w: { ctx: 'sea', weight: 5 },
    x: S => S.tier >= 2 ? 'Le ciel de Grand Line devient fou : grêle, éclairs, puis un cyclone. Le Log Pose s\'affole.' : 'Une tempête éclate. Les vagues dépassent le mât.',
    ch: [
      { t: 'Tenir la barre', s: 'navigation', d: 0,
        ok: { x: 'Tu traverses la tempête. L\'équipage t\'acclame.', e: { stats: { navigation: 1 }, morale: 5 } },
        ko: { x: 'Le mât se brise. Il faut réparer.', e: { shipHp: -30, hp: -10 } } },
      { t: 'Contourner la tempête', s: 'intel', d: -2,
        ok: { x: 'Tu as perdu du temps, mais pas de bois.', e: {} },
        ko: { x: 'La tempête t\'a rattrapé.', e: { shipHp: -20 } } },
    ],
  },
  {
    id: 's_seaking', emoji: '🐉', title: 'Roi des Mers',
    w: { ctx: 'sea', weight: 5 },
    x: 'Une ombre gigantesque sous la coque. Un Roi des Mers ouvre une gueule à avaler ton navire entier.',
    ch: [
      { t: 'L\'assommer', s: 'combat', d: 2,
        ok: { x: 'Un coup sur le nez. Il fuit. Ou il est devenu ton dîner.', e: { glory: 2, hp: 15, morale: 10 } },
        ko: { x: 'Il mord la coque.', e: { shipHp: -35, hp: -20 } } },
      { t: 'Fuir à toutes voiles', s: 'navigation', d: 0,
        ok: { x: 'Tu le distances.', e: {} },
        ko: { x: 'Il te poursuit et mord la poupe.', e: { shipHp: -25 } } },
      { t: 'L\'apprivoiser', s: 'charisme', d: 10,
        ok: { x: 'Il te suit comme un chien. Il tire même ton navire.', e: { hl: 'a apprivoisé un Roi des Mers', fleet: { name: 'Roi des Mers apprivoisé', power: 3 } } },
        ko: { x: 'Il n\'était pas d\'humeur.', e: { hp: -30 } } },
    ],
  },
  {
    id: 's_warship', emoji: '🚢', title: 'Navire de guerre',
    w: { ctx: 'sea', camp: 'chercheur', test: S => S.hero.faction !== 'corsaire', weight: 4 },
    x: 'Un navire de guerre de la Marine à l\'horizon. Les canons sont pointés vers toi. Un vice-amiral est à bord.',
    ch: [
      { t: 'Aborder le navire', s: 'combat', d: 4,
        ok: { x: 'Le navire de guerre est à toi. Les Marines nagent vers une île proche.', e: { glory: 5, berrys: S => S.tierPrime() / 3 } },
        ko: { x: 'Les boulets de canon pleuvent.', e: { shipHp: -40, hp: -30 } } },
      { t: 'Coup de Burst !', s: 'navigation', d: 2,
        ok: { x: 'Ton navire décolle. Les Marines ont la mâchoire qui tombe.', e: {} },
        ko: { x: 'Tu es rattrapé et bombardé.', e: { shipHp: -30 } } },
      { t: 'Hisser le drapeau blanc', s: 'charisme', d: 4,
        ok: { x: 'Le vice-amiral, amusé, te laisse partir. « Pour cette fois. »', e: {} },
        ko: { x: 'Ils ne te croient pas.', e: { shipHp: -30, hp: -20 } } },
    ],
  },
  {
    id: 's_pirate_ship', emoji: '🏴‍☠️', title: 'Navire pirate',
    w: { ctx: 'sea', weight: 4 },
    x: S => S.camp === 'gardien' ? 'Un navire pirate en vue. Leur drapeau est connu. Ils fuient en te voyant.' : 'Un navire pirate en vue. Ils hissent le drapeau noir et chargent les canons.',
    ch: [
      { t: 'Combattre', s: 'combat', d: 0,
        ok: { x: 'Victoire ! Tu récupères leur butin.', e: { glory: 3, merit: 4, berrys: S => S.tierPrime() / 4 } },
        ko: { x: 'Ils te pillent.', e: { berrys: S => -S.tierPrime() / 6, hp: -25 } } },
      { t: 'Parlementer', s: 'charisme', d: 0,
        ok: { x: 'Échange d\'informations et de rhum.', e: { stats: { navigation: 1 } } },
        ko: { x: 'Ils tirent.', e: { shipHp: -20 } } },
    ],
  },
  {
    id: 's_ghost', emoji: '👻', title: 'Navire fantôme',
    w: { ctx: 'sea', weight: 2 },
    x: 'Dans le brouillard, un navire fantôme. Pas de lumière, pas de vie. Juste une mélodie de violon.',
    ch: [
      { t: 'Monter à bord', s: 'volonte', d: 2,
        ok: { x: 'Tu y trouves un trésor oublié et un vieux journal de bord.', e: { berrys: S => S.tierPrime() / 3, stats: { intel: 1 } } },
        ko: { x: 'Tu entends des choses qui ne devraient pas exister. Tu fuis.', e: { morale: -15 } } },
      { t: 'Passer son chemin', r: { x: 'La mélodie te poursuit dans tes rêves.', e: {} } },
    ],
  },
  {
    id: 's_barrel', emoji: '🛢️', title: 'Un tonneau à la dérive',
    w: { ctx: 'sea', weight: 3 },
    x: 'Un tonneau flotte. Dessus, écrit à la main : « Offrande aux dieux des mers ».',
    ch: [
      { t: 'L\'ouvrir', p: () => 0.5,
        ok: { x: 'Du saké et de la nourriture. Parfait.', e: { morale: 15, hp: 20 } },
        ko: { x: 'C\'était une fusée de signalisation. Un navire de guerre arrive.', e: { hp: -15, glory: 1 } } },
      { t: 'Le laisser', r: { x: 'Sage.', e: {} } },
    ],
  },
  {
    id: 's_survivor', emoji: '🛟', title: 'Un naufragé',
    w: { ctx: 'sea', weight: 5 },
    x: 'Un homme accroché à une planche, à moitié mort. Il a l\'air de savoir se battre.',
    ch: [
      { t: 'Le repêcher', r: { x: 'Reconnaissant, il demande à rejoindre ton équipage.', e: { recruit: true } } },
      { t: 'Lui jeter de l\'eau et repartir', r: { x: 'Il te maudit.', e: { morale: -3 } } },
    ],
  },
  {
    id: 's_knockup', emoji: '🌋', title: 'Le Knock Up Stream',
    w: { ctx: 'sea', sea: ['paradise'], test: S => !S.visited.includes('skypiea'), weight: 2 },
    x: 'La mer devient sombre. Un courant ascendant se prépare : le Knock Up Stream. Il peut propulser un navire jusqu\'au ciel... ou le pulvériser.',
    ch: [
      { t: 'Foncer dans le courant', s: 'navigation', d: 4,
        ok: { x: 'Ton navire monte, monte, monte... jusqu\'à la mer blanche. Skypiea !', e: { goto: 'skypiea', hl: 'a pris le Knock Up Stream' } },
        ko: { x: 'Le courant te recrache.', e: { shipHp: -50, hp: -20 } } },
      { t: 'L\'éviter', r: { x: 'Le ciel attendra.', e: {} } },
    ],
  },
  {
    id: 's_calmbelt', emoji: '🌊', title: 'Dérive dans le Calm Belt',
    w: { ctx: 'sea', tier: [2], weight: 2 },
    x: 'Plus de vent. Plus de courant. Ton navire a dérivé dans le Calm Belt. Des yeux énormes s\'ouvrent sous la surface.',
    ch: [
      { t: 'Ramer pour en sortir', s: 'force', d: 4,
        ok: { x: 'Tu sors du Calm Belt à la force des bras.', e: { stats: { force: 1 } } },
        ko: { x: 'Un Roi des Mers soulève le navire. Tu atterris sur une île.', e: { goto: S => S.chance(0.5) ? 'amazonlily' : 'rusukaina', shipHp: -30 } } },
      { t: 'Attendre en silence', s: 'volonte', d: 2,
        ok: { x: 'Les monstres ne t\'ont pas remarqué. Le vent revient.', e: {} },
        ko: { x: 'Un Roi des Mers t\'a remarqué.', e: { shipHp: -40, hp: -20 } } },
    ],
  },
  {
    id: 's_puffing', emoji: '🚂', title: 'Le Puffing Tom',
    w: { ctx: 'sea', sea: ['paradise'], weight: 2 },
    x: 'Un train sur l\'eau ! Le Puffing Tom fonce vers toi sur ses rails sous-marins.',
    ch: [
      { t: 'Le suivre jusqu\'à Water 7', r: { x: 'Le train te mène à la cité de l\'eau.', e: { goto: 'water7' } } },
      { t: 'Le laisser passer', r: { x: 'Tchou-tchou.', e: {} } },
    ],
  },
  {
    id: 's_hunger', emoji: '🍗', title: 'Plus de vivres',
    w: { ctx: 'sea', weight: 3 },
    x: 'Quelqu\'un a mangé toutes les réserves de viande. L\'équipage a faim.',
    ch: [
      { t: 'Pêcher', s: 'force', d: -2,
        ok: { x: 'Un énorme poisson. Festin.', e: { hp: 15, morale: 10 } },
        ko: { x: 'Tu as pêché une botte.', e: { morale: -10, hp: -10 } } },
      { t: 'Trouver le coupable', s: 'intel', d: 0,
        ok: { x: 'C\'était le cuisinier. Ironique.', e: { morale: 5 } },
        ko: { x: 'Tout le monde s\'accuse.', e: { loyalty: -5 } } },
      { t: 'Ouvrir le livre de recettes du Baratie', req: S => S.inventory.items.includes('recette_sanji'), rq: 'Il te faut le livre de recettes', r: { x: 'Avec trois fois rien, tu fais un festin.', e: { morale: 20, hp: 20 } } },
    ],
  },
  {
    id: 's_mermaid', emoji: '🧜‍♀️', title: 'Une sirène',
    w: { ctx: 'sea', weight: 2 },
    x: 'Une sirène nage autour de ton navire. Elle chante une mélodie et te regarde avec curiosité.',
    ch: [
      { t: 'Lui parler', s: 'charisme', d: 0,
        ok: { x: 'Elle te parle des courants secrets. Tu navigues mieux.', e: { stats: { navigation: 1 } } },
        ko: { x: 'Elle s\'enfuit.', e: {} } },
      { t: 'La protéger de chasseurs d\'esclaves qui la suivent', s: 'combat', d: 2,
        ok: { x: 'Les chasseurs sont repoussés. Elle t\'offre une perle.', e: { berrys: S => S.tierPrime() / 3, rep: 3 } },
        ko: { x: 'Ils étaient nombreux.', e: { hp: -25 } } },
    ],
  },
  {
    id: 's_news', emoji: '📰', title: 'Le journal du jour',
    w: { ctx: 'sea', weight: 3 },
    x: S => {
      const pre = ['Portgas D. Ace capturé par Barbe Noire !', 'Les Chapeaux de paille ont brûlé le drapeau d\'Enies Lobby !', 'Un nouveau Corsaire nommé !', 'Kaido aurait encore tenté de se suicider !', 'Big Mom organise une Tea Party !', 'Une prime de 400 millions pour un rookie !'];
      const post = ['La Cross Guild met une prime sur l\'Amiral Fujitora !', 'Egghead en état de siège !', 'Le Gouvernement nie l\'existence de Joy Boy.', 'Baggy, Empereur malgré lui !', 'Barbe Noire capture un vice-amiral !', 'Vegapunk parle au monde entier !'];
      return 'La News Coo dépose le journal. À la une : « ' + S.pick(S.era === 'pre' ? pre : post) + ' »';
    },
    ch: [
      { t: 'Lire attentivement', r: { x: 'Le monde bouge. Tu prends des notes.', e: { stats: { intel: 1 } } } },
      { t: 'Faire des avions en papier', r: { x: 'L\'équipage s\'amuse.', e: { morale: 5 } } },
    ],
  },
  {
    id: 's_buster', emoji: '💣', title: 'Buster Call',
    w: { ctx: 'sea', camp: 'chercheur', test: S => S.hero.bounty >= 300_000_000, minTier: 2, weight: 2 },
    x: 'Dix navires de guerre et cinq vice-amiraux. Un Buster Call. Pour toi.',
    ch: [
      { t: 'Traverser le barrage', s: 'combat', d: 14,
        ok: { x: 'Tu as survécu à un Buster Call. Peu de gens peuvent en dire autant.', e: { glory: 20, hl: 'a survécu à un Buster Call' } },
        ko: { x: 'Ton navire est en lambeaux. Tu survis.', e: { shipHp: -100, hp: -50, crewLoss: 'random' } } },
      { t: 'Plonger sous l\'eau', s: 'navigation', d: 10, req: S => S.ship.coated, rq: 'Il faut un navire enrobé',
        ok: { x: 'Le coating te sauve. Tu passes sous la flotte.', e: { glory: 6 } },
        ko: { x: 'La bulle éclate presque.', e: { shipHp: -60 } } },
    ],
  },
  {
    id: 's_yonko_call', emoji: '🐌', title: 'Un appel inattendu',
    w: { ctx: 'sea', minTier: 3, weight: 2 },
    x: S => `Le Den Den Mushi sonne. Une voix grave : ${S.tmpYonko().name}. « J'ai entendu parler de toi. On devrait se voir. »`,
    ch: [
      { t: 'Accepter la rencontre', s: 'charisme', d: 10,
        ok: { x: S => `${S.tmpYonko().name} t'a jaugé. Il te respecte.`, e: { rel: S => ({ [S.tmpYonko().id]: 2 }), glory: 5 } },
        ko: { x: 'La rencontre tourne mal.', e: { hp: -40 } } },
      { t: 'Raccrocher', r: { x: 'Le Den Den Mushi fait une drôle de tête.', e: { flag: 'yonko_snub' } } },
    ],
  },
  {
    id: 's_vander', emoji: '🏴', title: 'Le Hollandais Volant',
    w: { ctx: 'sea', sea: ['paradise', 'redline'], weight: 1 },
    x: 'Un navire fantôme tiré par un Roi des Mers : le Hollandais Volant de Vander Decken IX. Il lance des haches qui suivent leur cible.',
    ch: [
      { t: 'Esquiver les haches', s: 'vitesse', d: 4,
        ok: { x: 'Tu évites tout. Il s\'éloigne en hurlant le nom d\'une sirène.', e: { glory: 3 } },
        ko: { x: 'Une hache te frôle.', e: { hp: -30 } } },
      { t: 'Contre-attaquer', s: 'combat', d: 6,
        ok: { x: 'Vander Decken s\'enfuit.', e: { glory: 5 } },
        ko: { x: 'Son Roi des Mers attaque.', e: { shipHp: -40 } } },
    ],
  },
  {
    id: 's_island_turtle', emoji: '🐢', title: 'L\'île qui bouge',
    w: { ctx: 'sea', weight: 1 },
    x: 'Une île en vue... qui bouge. C\'est une tortue géante. Ou un poisson-île.',
    ch: [
      { t: 'Débarquer dessus', s: 'volonte', d: 0,
        ok: { x: 'Tu y trouves des fruits délicieux. L\'animal ne s\'en rend même pas compte.', e: { hp: 30, morale: 10 } },
        ko: { x: 'L\'île plonge. Tu remontes à la nage.', e: { hp: -20 } } },
      { t: 'L\'éviter', r: { x: 'Elle plonge. Tu as bien fait.', e: {} } },
    ],
  },
];

// ═══════════════ RACES ═══════════════
const isR = (...r) => S => r.includes(S.race);
export const RACE_EVENTS = [
  {
    id: 'r_slavers', emoji: '⛓️', title: 'Des chasseurs d\'esclaves',
    w: { test: S => ['sirene', 'troisyeux', 'lunarien', 'longbras', 'longjambes'].includes(S.race) && S.tier <= 2, weight: 5 },
    x: S => `Trois hommes aux sourires trop larges te suivent depuis le port. Sur leur manteau : le logo d'une maison de ventes de Sabaody. Pour eux, un ${S.raceName} vaut une fortune.`,
    ch: [
      { t: 'Leur tendre une embuscade', s: 'combat', d: 0,
        ok: { x: 'Ils finissent ligotés dans leurs propres filets. Tu libères deux autres prisonniers dans leur cale.', e: { glory: 3, rep: 3, recruit: true } },
        ko: { x: 'Un filet en granit marin. Tu te débats, tu mords, tu t\'échappes de justesse.', e: { hp: -30 } } },
      { t: 'Te fondre dans la foule', s: 'vitesse', d: 2,
        ok: { x: 'Tu les sèmes dans les ruelles.', e: {} },
        ko: { x: 'Ils te rattrapent. Ton équipage te récupère au prix d\'une bagarre et de beaucoup d\'argent.', e: { hp: -20, berrys: S => -S.tierPrime() / 4 } } },
      { t: 'Les dénoncer à la Marine', s: 'charisme', d: 4,
        ok: { x: 'Un Marine honnête existe. Il les arrête.', e: { frel: { marine: 1 } } },
        ko: { x: 'Le Marine prend leur argent et détourne les yeux.', e: { morale: -10 } } },
    ],
  },
  {
    id: 'r_discrimination', emoji: '🦈', title: 'Pas de poissons ici',
    w: { test: S => S.race === 'hommepoisson' && S.loc !== 'fishman', weight: 5 },
    x: 'À l\'entrée de la taverne, une pancarte : « Interdit aux hommes-poissons ». Le patron te regarde comme un monstre. Des clients ricanent.',
    ch: [
      { t: 'Défoncer la pancarte', s: 'combat', d: -2,
        ok: { x: 'La pancarte vole, la porte aussi. Personne ne rit plus. Les plus jeunes te regardent avec admiration.', e: { glory: 2, rep: -2 } },
        ko: { x: 'Toute la taverne te tombe dessus. Tu repars avec des bleus et beaucoup de colère.', e: { hp: -20, morale: -10 } } },
      { t: 'Rester calme, comme Otohime', s: 'volonte', d: 2,
        ok: { x: 'Tu entres quand même et paies ta tournée. Un vieux pêcheur vient s\'asseoir avec toi. Petit à petit.', e: { stats: { volonte: 1 }, rep: 4 } },
        ko: { x: 'Tu pars. Ça te ronge.', e: { morale: -15 } } },
    ],
  },
  {
    id: 'r_sulong', emoji: '🌕', title: 'La pleine lune',
    w: { test: S => S.race === 'mink' && S.tier >= 2, weight: 4 },
    x: 'Le ciel se dégage. La lune est pleine. Ton poil blanchit, tes yeux s\'allument : la forme Sulong. Une puissance immense... et un contrôle fragile.',
    ch: [
      { t: 'Maîtriser la Sulong', s: 'volonte', d: 4,
        ok: { x: 'Tu gardes le contrôle. Ta force a décuplé et tu t\'en souviendras.', e: { stats: { force: 2, vitesse: 1 }, hl: 'a maîtrisé la forme Sulong' } },
        ko: { x: 'Tu perds le contrôle et tu ravages le port. Ton équipage t\'arrose d\'eau de mer pour te calmer.', e: { hp: -20, loyalty: -10, shipHp: -20 } } },
      { t: 'Se cacher dans la cale jusqu\'au matin', r: { x: 'Prudent. Rien ne se passe. Mais tu entends la lune t\'appeler.', e: {} } },
    ],
  },
  {
    id: 'r_giant_ship', emoji: '🗿', title: 'Trop grand pour ce navire',
    w: { test: S => S.race === 'geant' && S.ship.tier < 3, weight: 6 },
    x: S => `${S.ship.name} gîte dangereusement à chaque fois que tu bouges. Tu dors à moitié dans l'eau, les jambes par-dessus bord. L'équipage n'ose rien dire.`,
    ch: [
      { t: 'Ramer toi-même pour aller plus vite', s: 'force', d: -4,
        ok: { x: 'Le navire file comme une flèche. L\'équipage applaudit.', e: { stats: { force: 1 }, morale: 10 } },
        ko: { x: 'La rame casse. Et un morceau de coque.', e: { shipHp: -25 } } },
      { t: 'Promettre un plus grand navire', r: { x: 'L\'équipage hoche la tête. Il faudra des berrys.', e: { morale: -5 } } },
    ],
  },
  {
    id: 'r_lunarien', emoji: '🔥', title: 'Les yeux du Gouvernement',
    w: { test: S => S.race === 'lunarien', weight: 4 },
    x: 'Un homme en costume blanc te fixe depuis le quai. Il parle à un escargophone. Tu as entendu le mot « Lunarien ». Le CP sait que tu existes.',
    ch: [
      { t: 'L\'éliminer avant qu\'il ne parle', s: 'combat', d: 4,
        ok: { x: 'L\'agent ne fera pas son rapport. Mais d\'autres viendront.', e: { glory: 3, frel: { gov: -1 } } },
        ko: { x: 'Rokushiki. Il est fort. Ta flamme te sauve de justesse.', e: { hp: -35 } } },
      { t: 'Allumer ta flamme et l\'effrayer', s: 'charisme', d: 2,
        ok: { x: 'Il lâche son escargophone et s\'enfuit. Le port entier a vu tes ailes noires.', e: { glory: 2, hl: 'a déployé ses ailes de Lunarien en public' } },
        ko: { x: 'Ta flamme s\'éteint au pire moment. Il éclate de rire et prend une photo.', e: { bounty: 30_000_000 } } },
      { t: 'Lever l\'ancre immédiatement', r: { x: 'Tu fuis. Une fois de plus.', e: { morale: -8 } } },
    ],
  },
  {
    id: 'r_tontatta', emoji: '🧚', title: 'Un marchand très convaincant',
    w: { test: S => S.race === 'tontatta', weight: 5 },
    x: 'Un marchand te jure que ce caillou gris est « un œuf de Roi des Mers légendaire qui exauce les vœux ». Il ne coûte que toutes tes économies. Ça a l\'air vrai.',
    ch: [
      { t: 'L\'acheter, évidemment !', r: { x: 'C\'était un caillou. Tu l\'as appelé Gérard. Tu l\'aimes quand même.', e: { berrys: S => -Math.min(S.hero.berrys * 0.5, S.tierPrime()), morale: 10, hl: 'a acheté un caillou nommé Gérard' } } },
      { t: 'Demander l\'avis de l\'équipage', s: 'intel', d: 0,
        ok: { x: 'Ton équipage t\'a sauvé de l\'arnaque. Tu es un peu vexé.', e: { loyalty: 5 } },
        ko: { x: 'Ton équipage n\'était pas là. Tu l\'as acheté. Gérard est ton ami maintenant.', e: { berrys: S => -Math.min(S.hero.berrys * 0.5, S.tierPrime()) } } },
    ],
  },
  {
    id: 'r_troisyeux', emoji: '👁️', title: 'La voix de toutes choses',
    w: { test: S => S.race === 'troisyeux' && S.pone.length >= 1 && !S.flags.can_read_pone, weight: 8 },
    x: 'En touchant le relevé du Poneglyphe, ton troisième œil s\'ouvre tout seul. Les symboles se mettent à... parler. Comme une voix très ancienne.',
    ch: [
      { t: 'Écouter la voix', s: 'volonte', d: 2,
        ok: { x: 'Tu comprends. Tu sais lire les Poneglyphes. Comme ton peuple l\'a toujours pu, paraît-il.', e: { flag: 'can_read_pone', haki: { obs: 1 }, hl: 'a lu un Poneglyphe grâce à son troisième œil' } },
        ko: { x: 'La voix est trop forte. Tu t\'évanouis. Il faudra réessayer.', e: { hp: -15 } } },
      { t: 'Refermer l\'œil, ça fait peur', r: { x: 'Tu remets ta frange. Pour l\'instant.', e: {} } },
    ],
  },
  {
    id: 'r_sirene_seaking', emoji: '🐉', title: 'Un Roi des Mers curieux',
    w: { ctx: 'sea', test: S => S.race === 'sirene' || S.race === 'hommepoisson', weight: 4 },
    x: 'Un Roi des Mers gigantesque remonte à côté du navire. L\'équipage panique. Toi, tu plonges : sous l\'eau, tu te sens chez toi.',
    ch: [
      { t: 'Lui parler', s: 'charisme', d: 6,
        ok: { x: 'Il t\'écoute. Il guide ton navire à travers les courants les plus rapides.', e: { stats: { navigation: 2 }, hl: 'a parlé à un Roi des Mers' } },
        ko: { x: 'Il ne comprend pas. Il te renvoie sur le pont d\'un coup de queue.', e: { hp: -20 } } },
      { t: 'L\'éloigner du navire en nageant', s: 'vitesse', d: 0,
        ok: { x: 'Il te suit, puis se lasse. Le navire est sauf.', e: { loyalty: 5 } },
        ko: { x: 'Il mord la coque au passage.', e: { shipHp: -30 } } },
    ],
  },
  {
    id: 'r_elbaf_home', pri: 15, emoji: '🪓', title: 'Retour au pays',
    w: { isl: ['elbaf'], test: S => S.race === 'geant' },
    x: 'Les guerriers d\'Elbaf te reconnaissent comme l\'un des leurs. Ici, personne ne te trouve trop grand.',
    ch: [
      { t: 'Festoyer avec les guerriers', r: { x: 'Un festin de géant. Tu te sens enfin à ta taille.', e: { hp: 200, morale: 30, rel: { dorry: 2 }, flag: 'elbaf_invite' } } },
      { t: 'Défier un champion d\'Elbaf', s: 'combat', d: 4,
        ok: { x: 'Tu as gagné l\'honneur des géants. Ils te confieront tout.', e: { glory: 6, flag: 'elbaf_invite', rel: { dorry: 3 } } },
        ko: { x: 'Tu perds avec honneur. C\'est ce qui compte ici.', e: { hp: -30, flag: 'elbaf_invite' } } },
    ],
  },
];

// ═══════════════ FRUITS DU DÉMON & NAVIRES : plus d'occasions ═══════════════
export const LOOT_EVENTS = [
  {
    id: 'f_tree', emoji: '🍇', title: 'Un fruit aux motifs de spirale',
    w: { weight: 7 },
    x: 'Au fond d\'un verger abandonné, un fruit étrange pend à une branche : des spirales sur toute la peau. Les oiseaux l\'évitent. Un fruit du démon ?',
    ch: [
      { t: 'Le cueillir', s: 'vitesse', d: -2,
        ok: { x: 'Il est à toi. Il a un goût d\'ordure, paraît-il. Tu décideras plus tard.', e: { fruit: 'random' } },
        ko: { x: 'Un singe est plus rapide que toi. Il le mange. Il s\'envole. Tu as vu un singe s\'envoler.', e: { morale: -5, hl: 'a vu un singe manger un fruit du démon sous son nez' } } },
      { t: 'Le laisser : trop risqué', r: { x: 'La mer, c\'est quand même pratique.', e: {} } },
    ],
  },
  {
    id: 'f_merchant', emoji: '🧺', title: 'Le marchand de fruits ambulant',
    w: { weight: 6 },
    x: S => `Un vieil homme pousse une charrette couverte d'un drap. « Psst. Des fruits du démon, garantis. Enfin... presque tous. » Il soulève le drap : trois fruits bizarres.`,
    ch: [
      { t: 'Acheter le plus cher', c: S => S.tierPrime() * 0.8, r: { x: 'Tu repars avec un fruit du démon. Le vieux compte ses billets en souriant.', e: { fruit: S => `random${Math.min(5, S.tier + 2)}` } } },
      { t: 'Acheter le moins cher', c: S => S.tierPrime() / 5, r: { x: 'Un fruit du démon pour une bouchée de pain. C\'est sûrement une arnaque. Ou pas.', e: { fruit: S => S.chance(0.6) ? `random${Math.min(5, S.tier)}` : 'smile' } } },
      { t: 'Marchander', s: 'charisme', d: 2,
        ok: { x: 'Il finit par te le céder à moitié prix.', e: { fruit: S => `random${Math.min(5, S.tier + 1)}`, berrys: S => -S.tierPrime() / 4 } },
        ko: { x: 'Il te traite de radin et repart.', e: {} } },
    ],
  },
  {
    id: 'f_fishbelly', emoji: '🐟', title: 'Dans le ventre du poisson',
    w: { ctx: 'sea', weight: 5 },
    x: 'Ton cuisinier vide un énorme poisson pêché le matin. Il pousse un cri : dans l\'estomac, un fruit intact, couvert de spirales.',
    ch: [
      { t: 'Le garder dans la cale', r: { x: 'Un fruit du démon tombé du ciel. Ou plutôt de la mer.', e: { fruit: 'random' } } },
      { t: 'Le revendre au prochain port', r: { x: 'Tu le revends à un collectionneur.', e: { berrys: S => S.tierPrime() / 2 } } },
    ],
  },
  {
    id: 'f_float', emoji: '🌊', title: 'Un coffret à la dérive',
    w: { ctx: 'sea', weight: 4 },
    x: 'Un petit coffret verrouillé flotte près de la coque, frappé du sceau du Gouvernement Mondial. Un transport de fruits du démon aurait coulé dans le coin.',
    ch: [
      { t: 'Le repêcher et l\'ouvrir', s: 'force', d: 0,
        ok: { x: 'Le cadenas cède. À l\'intérieur, sur du velours : un fruit du démon.', e: { fruit: S => `random${Math.min(5, S.tier + 1)}` } },
        ko: { x: 'Le cadenas est en granit marin. Tu le gardes en espérant un jour l\'ouvrir.', e: { item: 'seastone_menottes' } } },
      { t: 'Le rendre à la Marine', req: S => S.camp === 'gardien', rq: 'Gardiens uniquement', r: { x: 'Le contenu est confisqué... et ton supérieur te le confie « pour les besoins de la mission ».', e: { fruit: 'random', merit: 3 } } },
      { t: 'Le laisser couler', r: { x: 'C\'était peut-être un piège.', e: {} } },
    ],
  },
  {
    id: 'f_auction', emoji: '🔨', title: 'Une vente aux enchères',
    w: { minTier: 2, weight: 4 },
    x: 'Une vente aux enchères clandestine se tient dans l\'arrière-salle d\'un casino. Le lot vedette : un fruit du démon « de catégorie légendaire ». Les enchères montent vite.',
    ch: [
      { t: 'Enchérir jusqu\'au bout', c: S => S.tierPrime() * 1.5, r: { x: 'Adjugé ! Le commissaire-priseur te remet le fruit sous les applaudissements.', e: { fruit: 'random5', hl: 'a remporté un fruit légendaire aux enchères' } } },
      { t: 'Voler le lot pendant la vente', s: 'vitesse', d: 6, req: S => S.hero.faction !== 'marine', rq: 'Pas pour un Marine',
        ok: { x: 'Les lumières s\'éteignent, le fruit disparaît. Toi aussi.', e: { fruit: 'random4', rep: -3 } },
        ko: { x: 'Les gardes du casino te tombent dessus.', e: { hp: -35 } } },
      { t: 'Regarder', r: { x: 'Le fruit part pour une fortune.', e: {} } },
    ],
  },
  {
    id: 'sh_wright', emoji: '🔧', title: 'Un charpentier itinérant',
    w: { weight: 4 },
    x: S => `Un charpentier barbu, caisse à outils sur l'épaule, fait le tour du port. Il regarde ${S.ship.name} d'un œil critique. « Joli bateau. Mais il lui manque quelque chose. Je te fais un prix. »`,
    ch: [
      { t: 'Le laisser installer un aménagement', c: S => S.tierPrime() / 4, r: { x: 'Trois jours de marteau et de jurons. Ton navire a un nouvel équipement.', e: { ship: { mod: 'random' }, shipHp: 30 } } },
      { t: 'Lui demander une révision complète', c: S => S.tierPrime() / 8, r: { x: 'La coque est comme neuve.', e: { shipHp: 300 } } },
      { t: 'L\'engager', s: 'charisme', d: 2,
        ok: { x: 'Il range ses outils dans ta cale. Il fait partie de l\'équipage.', e: { recruit: { role: 'charpentier' } } },
        ko: { x: 'Il préfère sa liberté.', e: {} } },
    ],
  },
  {
    id: 'sh_sale', emoji: '🏷️', title: 'Navire à vendre',
    w: { test: S => S.ship.tier < 5, weight: 4 },
    x: S => `Sur le quai, un navire flambant neuf avec une pancarte : « À VENDRE, propriétaire parti précipitamment ». Le capitaine du port te fait un clin d'œil : il veut s'en débarrasser vite.`,
    ch: [
      { t: 'L\'acheter à prix cassé', c: S => [0, 2_000_000, 12_000_000, 50_000_000, 160_000_000][S.ship.tier], r: { x: 'Tu signes. Un nouveau navire, et une affaire en or.', e: { ship: { tier: '+1' } } } },
      { t: 'Le voler', s: 'navigation', d: 4, req: S => S.camp === 'chercheur', rq: 'Chercheurs uniquement',
        ok: { x: 'Tu largues les amarres en pleine nuit. Personne ne t\'a vu.', e: { ship: { tier: '+1' }, rep: -3 } },
        ko: { x: 'Les gardes du port t\'attendaient.', e: { hp: -25 } } },
      { t: 'Passer', r: { x: 'Ton navire te suffit. Il est fidèle.', e: { morale: 3 } } },
    ],
  },
  {
    id: 'sh_wreck', emoji: '⚓', title: 'Une épave intacte',
    w: { ctx: 'sea', weight: 3 },
    x: 'Un navire échoué sur un banc de sable, sans équipage. La coque est intacte, les canons aussi. Que s\'est-il passé ? Mystère.',
    ch: [
      { t: 'Récupérer son équipement', s: 'force', d: 0,
        ok: { x: 'Tu démontes ce qui peut l\'être et l\'installes sur ton navire.', e: { ship: { mod: 'random' } } },
        ko: { x: 'Le banc de sable s\'effondre. Tu repars avec quelques planches.', e: { shipHp: 30 } } },
      { t: 'Le renflouer et en faire ton navire', s: 'navigation', d: 4, req: S => S.ship.tier < 5, rq: 'Ton navire est déjà le meilleur',
        ok: { x: 'Marée haute, cordes tendues, l\'épave flotte. Elle est à toi.', e: { ship: { tier: '+1' } } },
        ko: { x: 'Tu as abîmé ton propre navire en essayant.', e: { shipHp: -30 } } },
      { t: 'Fouiller la cabine du capitaine', s: 'intel', d: 2,
        ok: { x: 'Un journal de bord et un coffre.', e: { berrys: S => S.tierPrime() / 3, stats: { navigation: 1 } } },
        ko: { x: 'La porte était piégée.', e: { hp: -20 } } },
    ],
  },
];
