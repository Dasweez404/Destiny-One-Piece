// Haltes saisonnières : sur Grand Line, chaque île a son propre climat. Une île minuscule apparaît en route,
// et c'est l'hiver, l'automne, le printemps ou l'été, quelle que soit la saison du reste du monde. Courte escale, pas de coût de temps.
const S_ = (season, n, o) => ({
  id: `se_${season}_${n}`, once: true, emoji: o.emoji, title: o.title,
  w: { ctx: 'sea', weight: 12, test: S => S.tier >= 1 && !S.hasFlag(`se_${season}_${n}`) },
  x: o.x,
  ch: [
    ...o.ch.map(c => c.r ? { t: c.t, r: { x: c.r.x, e: { ...c.r.e, flag: `se_${season}_${n}` } } } : { t: c.t, s: c.s, d: c.d, ok: { x: c.ok, e: { ...c.g, flag: `se_${season}_${n}` } }, ko: { x: c.ko, e: { ...c.b, flag: `se_${season}_${n}` } } }),
    { t: 'Passer ton chemin', r: { x: 'Tu regardes l\'île s\'éloigner. Parfois, l\'horizon suffit.', e: { flag: `se_${season}_${n}` } } },
  ],
});
export const SEASON_EVENTS = [
  S_('hiver', 1, { emoji: '❄️', title: 'Une île d\'hiver',
    x: 'Au milieu d\'une mer tiède, une petite île blanche surgit de la brume : ici, c\'est l\'hiver, malgré la saison du reste du monde (sur Grand Line, chaque île a son climat). Une fumée monte d\'une cabane de pierre, au bord d\'une source chaude.',
    ch: [
      { t: 'Faire halte aux sources chaudes', r: { x: 'L\'eau fumante dénoue chaque muscle. Ton équipage chante des chansons de marins dans la vapeur.', e: { hp: 999, heal: true, morale: 15, loyalty: 5 } } },
      { t: 'Troquer des fourrures avec les trappeurs', s: 'charisme', d: 1, ok: 'Une vieille trappeuse te fait un prix : tu repars chaudement équipé et un peu plus riche d\'histoires.', ko: 'Les trappeurs sont durs en affaires. Tu paies plus cher que prévu.', g: { hp: 25, morale: 8, stats: { volonte: 1 } }, b: { berrys: S => -S.tierPrime() / 10 } },
      { t: 'Escalader la colline gelée pour la vue', s: 'volonte', d: 2, ok: 'Au sommet, tu embrasses toute la mer d\'un regard. Quelque chose en toi se stabilise.', ko: 'Le froid te mord. Tu redescends en frissonnant.', g: { stats: { volonte: 1, navigation: 1 } }, b: { hp: -15 } },
    ] }),
  S_('hiver', 2, { emoji: '⛄', title: 'Le village des bonshommes de neige',
    x: 'Une île minuscule, couverte de neige poudreuse et de mille bonshommes de neige, tous orientés vers la mer. Un enfant te fait signe : « C\'est la fête de l\'hiver ! Tu veux participer au concours de sculpture ? »',
    ch: [
      { t: 'Sculpter ton propre bonhomme', s: 'charisme', d: 0, ok: 'Le tien est tellement drôle qu\'on l\'adopte comme mascotte de l\'île. Tu repars avec un petit trophée.', ko: 'Ton bonhomme s\'effondre à l\'applaudissement. On rit gentiment.', g: { morale: 15, berrys: S => S.tierPrime() / 8 }, b: { morale: 6 } },
      { t: 'Participer à la bataille de boules de neige', s: 'vitesse', d: 1, ok: 'Tu esquives tout et tu gagnes la bataille. Les enfants te portent en triomphe.', ko: 'Tu reçois une boule en plein visage. Tu ris.', g: { morale: 12, stats: { vitesse: 1 } }, b: { morale: 5 } },
    ] }),
  S_('automne', 1, { emoji: '🍂', title: 'Une île d\'automne',
    x: 'Un îlot rond, couvert d\'érables rouges et dorés, apparaît derrière un banc de brume : ici, c\'est l\'automne, malgré les saisons ailleurs. Des feuilles tombent sans cesse, et une odeur de pommes cuites flotte sur la mer.',
    ch: [
      { t: 'Participer à la récolte', s: 'force', d: 1, ok: 'Tu cueilles, portes, remplis des paniers. Les habitants te donnent une part généreuse : fruits, cidre, un peu de berrys.', ko: 'Tu casses plus de paniers que tu n\'en remplis.', g: { berrys: S => S.tierPrime() / 5, hp: 25, morale: 8 }, b: { morale: 2 } },
      { t: 'Chercher des champignons rares', s: 'intel', d: 2, ok: 'Tu rapportes de quoi préparer un ragoût de légende : ton équipage s\'en souviendra.', ko: 'Tu confonds un champignon toxique. Tu as la nausée jusqu\'au soir.', g: { morale: 15, hp: 30 }, b: { hp: -15 } },
      { t: 'Faire la fête du cidre', r: { x: 'Une soirée de chants et de feux de camp. Tu repars l\'esprit léger, la cale pleine de petites jarres.', e: { morale: 18, loyalty: 5 } } },
    ] }),
  S_('automne', 2, { emoji: '🍁', title: 'Le sentier des feuilles',
    x: 'Sur une île-sentier couverte de feuilles, un vieil homme balaie sans fin. « Les feuilles tombent. On les balaie. Elles retombent. C\'est un exercice de patience. Tu veux essayer ? »',
    ch: [
      { t: 'Balayer avec lui, en silence', s: 'volonte', d: 1, ok: 'Une heure plus tard, tu comprends. Ton esprit est plus calme, ta frappe plus nette.', ko: 'Tu perds patience au bout de dix minutes.', g: { stats: { volonte: 1 }, morale: 8 }, b: { morale: 0 } },
      { t: 'Lui demander des histoires de marins', s: 'charisme', d: 1, ok: 'Il en a vu, de toutes les couleurs. Il te donne un renseignement utile.', ko: 'Il hoche la tête sans répondre.', g: { stats: { intel: 1 } }, b: {} },
    ] }),
  S_('printemps', 1, { emoji: '🌸', title: 'Une île de printemps',
    x: 'Un petit îlot rose, couvert de cerisiers en fleurs, flotte sur une mer d\'huile : ici, c\'est le printemps, malgré la saison du reste du monde. Des pétales volent jusqu\'à ton navire. Un pique-nique est en cours sur la plage.',
    ch: [
      { t: 'Te joindre au pique-nique', r: { x: 'Le saké, les onigiri, les rires. Ton équipage s\'attache un peu plus à toi.', e: { morale: 20, loyalty: 8, hp: 30 } } },
      { t: 'Participer au concours de poésie', s: 'intel', d: 2, ok: 'Ton haïku fait pleurer l\'assemblée. On te remet un éventail comme trophée.', ko: 'Ton poème est… original. On applaudit par politesse.', g: { stats: { intel: 1, charisme: 1 }, morale: 10 }, b: { morale: 4 } },
      { t: 'Chercher une rencontre romantique', s: 'charisme', d: 3, ok: 'Une rencontre charmante, inattendue. Ton cœur et ton moral sont gonflés pour des jours.', ko: 'On te pose un lapin gentiment.', g: { morale: 22 }, b: { morale: -2 } },
    ] }),
  S_('printemps', 2, { emoji: '🌷', title: 'Le champ de tulipes',
    x: 'Une île plate, entièrement couverte de tulipes de toutes les couleurs. Un fleuriste ambulant te tend un bouquet : « Une fleur de plus, un sourire de plus. Un marchand m\'a dit que certaines de ces fleurs valent plus que de l\'or. »',
    ch: [
      { t: 'Négocier un lot de fleurs rares', s: 'charisme', d: 2, ok: 'Tu repars avec une cargaison qui se vendra très bien à la prochaine escale.', ko: 'Tu paies cher pour un lot de fleurs ordinaires.', g: { berrys: S => S.tierPrime() / 2 }, b: { berrys: S => -S.tierPrime() / 8 } },
      { t: 'Cueillir pour ton équipage', r: { x: 'Chacun garde une tulipe sur sa couchette. Le moral est radieux.', e: { morale: 15, loyalty: 4 } } },
    ] }),
  S_('ete', 1, { emoji: '☀️', title: 'Une île d\'été',
    x: 'Sur une mer d\'azur, une petite île de sable blanc s\'étend sous un soleil éclatant : ici, c\'est l\'été, quelle que soit la saison ailleurs. Des parasols, des hamacs, une plage entière en fête. Un festival de pêche est en cours.',
    ch: [
      { t: 'Faire la fête sur la plage', r: { x: 'Soleil, musique, saké glacé. Ton équipage dort sur le sable cette nuit-là, heureux.', e: { morale: 22, loyalty: 8, hp: 30 } } },
      { t: 'Participer au concours de pêche', s: 'vitesse', d: 2, ok: 'Tu attrapes le plus gros poisson du festival : on te couvre de lauriers (et de berrys).', ko: 'Tu ne pêches que des algues.', g: { berrys: S => S.tierPrime() / 3, morale: 10 }, b: { morale: 3 } },
      { t: 'Plonger pour explorer l\'épave du lagon', s: 'navigation', d: 2, ok: 'Tu retrouves un coffre incrusté de coraux : un petit trésor.', ko: 'Un banc de méduses t\'oblige à remonter.', g: { berrys: S => S.tierPrime() / 2, glory: 1 }, b: { hp: -12 } },
    ] }),
  S_('ete', 2, { emoji: '🎆', title: 'Le festival de feux d\'artifice',
    x: 'Une île de bord de mer, des guirlandes de lampions, des stands de nourriture, et des feux d\'artifice qui explosent sur l\'eau. Un forain te lance : « Entrez, entrez ! Le meilleur festival de l\'été, vous ne le regretterez pas ! »',
    ch: [
      { t: 'Gagner un lot au tir', s: 'vitesse', d: 2, ok: 'Tu touches dix cibles d\'affilée : un lot de berrys et un vieux compas ornemental.', ko: 'Tu rates tout. L\'ambiance, elle, est magnifique.', g: { berrys: S => S.tierPrime() / 4, stats: { vitesse: 1 } }, b: { morale: 5 } },
      { t: 'Regarder les feux d\'artifice depuis le pont', r: { x: 'Les couleurs s\'étalent sur l\'eau. Ton équipage se tait un instant, puis applaudit.', e: { morale: 20, loyalty: 5 } } },
    ] }),
];
