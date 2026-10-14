// Batailles navales et guerres.
// Le navire compte : le jet « naval » dépend de sa classe, de son artillerie, de son état de coque,
// de la navigation du héros, de l'équipage de pont (navigateur, timonier, tireur, charpentier) et de la flotte.
// Les guerres sont des trames à étapes (mobilisation → bataille navale → assaut) :
//   · « Déclarer la guerre » (capitaine, équipage solide) ;
//   · « Prendre part à une guerre » entre deux puissances (on choisit son camp, ou on pille les deux).

import { ISLANDS } from './islands.js';

const A = (id, stage) => ({ id, stage });
const isCh = S => S.camp === 'chercheur';
const isGa = S => S.camp === 'gardien';
const hasShipPower = S => S.ship.hp > 0;

export const WAR_ARCS = {
  war_own: { name: 'Ta guerre', stages: 3 },
  war_j1: { name: 'La guerre de la Marine', stages: 3 },
  war_j2: { name: 'La guerre de la liberté', stages: 3 },
  war_j3: { name: 'La guerre des Empereurs', stages: 3 },
};

// ═══════════════ BATAILLES NAVALES (en mer) ═══════════════
export const NAVAL_EVENTS = [
  {
    id: 'n_broadside', emoji: '💥', title: 'Duel d\'artillerie',
    w: { ctx: 'sea', weight: 9, test: hasShipPower },
    x: S => S.tier >= 3 ? `Un navire des ${S.rival().emoji} ${S.rival().name}, lourdement armé, coupe ta route et ouvre le feu sans sommation. Ses canons couvrent le pont de gerbes d'eau.` : `Un navire des ${S.rival().emoji} ${S.rival().name} te prend en chasse et envoie une première salve. Elle tombe à dix mètres. La suivante, non.`,
    ch: [
      { t: 'Répondre par une bordée', s: 'naval', d: 0,
        ok: { x: 'Ta bordée touche le mât adverse. Le navire ennemi s\'incline et fuit, laissant flotter sa cargaison.', e: { glory: 2, berrys: S => S.tierPrime() / 3, shipHp: -10, morale: 8 } },
        ko: { x: 'Tes canons sont trop lents. Leurs boulets t\'ouvrent la coque avant que tu aies pu recharger.', e: { shipHp: -35, morale: -8 } } },
      { t: 'Manœuvrer pour l\'aborder', s: 'combat', d: 2,
        ok: { x: 'Les grappins mordent. Tu prends son pont en quelques minutes, ses coffres et son drapeau.', e: { glory: 3, berrys: S => S.tierPrime() / 2, shipHp: -15 } },
        ko: { x: 'L\'abordage tourne mal : tu repars en rampant, la coque criblée.', e: { hp: -25, shipHp: -25 } } },
      { t: 'Esquiver dans le brouillard', s: 'navigation', d: 1,
        ok: { x: 'Tu te glisses dans la brume. Ils tirent dans le vide.', e: {} },
        ko: { x: 'Le brouillard ne tient pas. Ils te rattrapent.', e: { shipHp: -20 } } },
    ],
  },
  {
    id: 'n_merchant', emoji: '⚓', title: 'Un convoi marchand',
    w: { ctx: 'sea', camp: 'chercheur', weight: 4, test: S => hasShipPower(S) && S.hero.isCaptain },
    x: 'Un convoi de trois navires marchands escorté par une frégate navigue lentement. Leur cale pèse lourd. La frégate d\'escorte te voit aussi.',
    ch: [
      { t: 'Couler l\'escorte et piller le convoi', s: 'naval', d: 2,
        ok: { x: 'L\'escorte coule, les marchands se rendent. Ta cale déborde, et une des caisses contient du matériel de marine.', e: { berrys: S => S.tierPrime(), glory: 3, rep: -3, ship: { mod: 'random' }, shipHp: -15 } },
        ko: { x: 'La frégate tient bon. Tu te retires, ton navire fait eau.', e: { shipHp: -40, morale: -8 } } },
      { t: 'Prélever un « droit de passage »', s: 'charisme', d: 3,
        ok: { x: 'Le convoi paie sans combattre. Tu vis de la peur des autres.', e: { berrys: S => S.tierPrime() / 3, rep: -1 } },
        ko: { x: 'Ils appellent la Marine par escargophone. Il faut déguerpir.', e: { rep: -1 } } },
      { t: 'Les laisser passer', r: { x: 'Tu les saluent du pont. Ils ne comprennent pas ta chance.', e: { rep: 2 } } },
    ],
  },
  {
    id: 'n_blockade', emoji: '🚢', title: 'Blocus de la Marine',
    w: { ctx: 'sea', camp: 'chercheur', weight: 4, test: S => hasShipPower(S) && S.hero.faction !== 'corsaire' && S.tier >= 1 },
    x: 'Une ligne de navires de la Marine barre le détroit. Trois frégates, une canonnière, un pavillon de contre-amiral. Il n\'y a qu\'un passage, et il est devant leurs canons.',
    ch: [
      { t: 'Forcer le blocus à pleine vitesse', s: 'naval', d: 3,
        ok: { x: 'Tu passes sous leurs canons, la coque grinçante. Ton nom court sur les journaux de la Marine.', e: { glory: 4, shipHp: -25, bounty: S => S.tierPrime() / 4 } },
        ko: { x: 'Ils te coincent au milieu de la ligne. Il faut tout jeter à l\'eau pour fuir.', e: { shipHp: -50, berrys: S => -S.tierPrime() / 4, morale: -10 } } },
      { t: 'Passer de nuit, voiles noires', s: 'vitesse', d: 2,
        ok: { x: 'Personne ne te voit. Tu es de l\'autre côté avant l\'aube.', e: { stats: { vitesse: 1 } } },
        ko: { x: 'Une vigie t\'a vu. Les sirènes se déclenchent.', e: { shipHp: -25 } } },
      { t: 'Contourner par la route des récifs', s: 'navigation', d: 3,
        ok: { x: 'Le chemin est dangereux, mais tu as la carte pour. Tu perds un jour, rien d\'autre.', e: { stats: { navigation: 1 } } },
        ko: { x: 'Les récifs mordent la quille.', e: { shipHp: -35 } } },
    ],
  },
  {
    id: 'n_patrol', emoji: '⚓', title: 'Poursuite en mer',
    w: { ctx: 'sea', camp: 'gardien', weight: 7, test: hasShipPower },
    x: S => `La vigie hurle : un navire des ${S.rival().emoji} ${S.rival().name}, voiles noires, file vers le large avec un coffre qui n'est pas à lui. Ton navire est le plus proche.`,
    ch: [
      { t: 'L\'intercepter et le couler', s: 'naval', d: 1,
        ok: { x: 'Quelques bordées bien placées, et le pirate lève le drapeau blanc. Tu rapportes le coffre et les prisonniers.', e: { glory: 3, merit: 3, shipHp: -12, rep: 2 } },
        ko: { x: 'Il vous échappe, après avoir touché votre gouvernail.', e: { shipHp: -30, merit: -1 } } },
      { t: 'Le prendre en chasse jusqu\'à l\'épuiser', s: 'navigation', d: 2,
        ok: { x: 'Il finit à court de vent et d\'idées. Il se rend sans combat.', e: { glory: 2, merit: 2 } },
        ko: { x: 'Il a plus de souffle que toi.', e: { morale: -5 } } },
      { t: 'Ordonner l\'abordage', s: 'combat', d: 2,
        ok: { x: 'Tu bondis le premier. L\'équipage pirate ne te laisse pas dix secondes.', e: { glory: 4, merit: 3, hp: -10 } },
        ko: { x: 'Ils étaient plus nombreux que prévu.', e: { hp: -30, shipHp: -15 } } },
    ],
  },
  {
    id: 'n_fleet_yonko', emoji: '🏴', title: 'La flotte d\'un Empereur',
    w: { ctx: 'sea', weight: 3, minTier: 3, test: S => hasShipPower(S) && !S.hero.yonko },
    x: S => `Un mur de voiles à l'horizon : une flotte de navires aux couleurs de ${S.tmpYonko().name}. Ils t\'ont repéré. Des dizaines de canons se tournent vers toi.`,
    ch: [
      { t: 'Se battre en ordre de bataille', s: 'naval', d: 5,
        ok: { x: 'Tu coules deux navires et tu perces la ligne. Tout le Nouveau Monde en parlera.', e: { glory: 6, shipHp: -40, bounty: S => S.tierPrime() / 2 } },
        ko: { x: 'Tu es écrasé sous le nombre. Il faut sacrifier une partie de ton chargement et ton honneur pour fuir.', e: { shipHp: -60, berrys: S => -S.tierPrime() / 3, morale: -15 } } },
      { t: 'Hisser le drapeau de négociation', s: 'charisme', d: 5,
        ok: { x: 'Leur amiral te laisse passer, moyennant un « tribut de courtoisie ».', e: { berrys: S => -S.tierPrime() / 6 } },
        ko: { x: 'Ils prennent le drapeau pour une provocation.', e: { shipHp: -45, morale: -8 } } },
      { t: 'Plonger et disparaître sous l\'eau (navire enrobé)', req: S => S.ship.coated, rq: 'Navire enrobé', s: 'navigation', d: 1,
        ok: { x: 'Votre coque enrobée glisse sous les vagues. La flotte tire dans le vide.', e: { glory: 2 } },
        ko: { x: 'Leur sonar vous repère.', e: { shipHp: -30 } } },
    ],
  },
  {
    id: 'n_duel_captains', emoji: '⚔️', title: 'Défi de capitaines',
    w: { ctx: 'sea', camp: 'chercheur', weight: 3, test: S => hasShipPower(S) && S.hero.isCaptain && S.hero.berrys >= S.tierPrime() / 6 },
    x: S => `Un capitaine des ${S.rival().emoji} ${S.rival().name}, pavillon fièrement hissé, te hèle au porte-voix : « Un duel entre navires ! Le perdant donne son or. Le gagnant, la réputation. »`,
    ch: [
      { t: 'Accepter, mise : le tiers d\'un trésor', s: 'naval', d: 2,
        ok: { x: 'Votre duel de manœuvre dure une heure. Ton gouvernail ne l\'a pas laissé échapper. Il paie en riant.', e: { berrys: S => S.tierPrime() / 2, glory: 3, morale: 10 } },
        ko: { x: 'Il te prend en tenaille. Tu paies, et ta coque est marquée.', e: { berrys: S => -S.tierPrime() / 6, shipHp: -20, morale: -5 } } },
      { t: 'Refuser poliment', r: { x: 'Il crie à la lâcheté, puis s\'éloigne.', e: { rep: -1 } } },
    ],
  },
  {
    id: 'n_harbor', emoji: '🔥', title: 'Le port attaqué',
    w: { minTier: 1, weight: 5, test: S => hasShipPower(S) && !ISLANDS[S.loc].noNav && ISLANDS[S.loc].pop >= 2 },
    x: S => `Des canons grondent : une flotte ${S.hostileName()} attaque le port. Les navires marchands brûlent, les habitants courent. Ton navire est à quai, sous le feu.`,
    ch: [
      { t: 'Appareiller et couler les assaillants', s: 'naval', d: 2,
        ok: { x: 'Ton navire sort en tirant. Les assaillants se dispersent. Le port t\'offre ses remerciements et ses coffres.', e: { glory: 3, berrys: S => S.tierPrime() / 3, rep: 4, shipHp: -15, } },
        ko: { x: 'Tu sors trop tard. Ta coque prend de plein fouet les salves.', e: { shipHp: -40, rep: 0 } } },
      { t: 'Défendre les quais à terre', s: 'combat', d: 1,
        ok: { x: 'Tu repousses le débarquement sur la plage. Les habitants t\'acclament.', e: { glory: 2, rep: 5, hp: -10 } },
        ko: { x: 'Tu es débordé.', e: { hp: -30, rep: 1 } } },
      { t: 'Profiter du chaos pour piller', req: isCh, rq: 'Chercheurs uniquement', s: 'vitesse', d: 2,
        ok: { x: 'Les deux camps se tirent dessus pendant que tu remplis la cale.', e: { berrys: S => S.tierPrime() / 2, rep: -5, glory: 1 } },
        ko: { x: 'Tu es pris sur le fait.', e: { rep: -5, hp: -15 } } },
    ],
  },
];

// ═══════════════ GUERRE DÉCLARÉE PAR LE HÉROS ═══════════════
const ownReady = S => isCh(S) && S.hero.isCaptain && hasShipPower(S) && S.crew.length >= 3 && S.lvl >= 2 && !S.hasFlag('war_own_done');
const WAR_TARGETS = [
  { k: 'marine', t: 'Une base de la Marine qui te traque', group: 'marine' },
  { k: 'pirates', t: 'Une flotte pirate rivale qui vole les îles', group: 'pirates' },
  { k: 'gov', t: 'Un seigneur corrompu du Gouvernement', group: 'gov' },
];

export const WAR_EVENTS = [
  {
    id: 'w_declare', emoji: '🏴‍☠️', title: 'Déclarer la guerre',
    w: { ctx: undefined, weight: 12, test: S => ownReady(S) && S.arc('war_own', 0), minTier: 1 },
    x: 'Ton équipage est solide, ton navire rôde, ton nom pèse. Dans la taverne, quelqu\'un murmure ce que tout le monde pense : les petites escarmouches ne suffisent plus. Il faut prendre un territoire, et faire plier un ennemi. Tes hommes attendent ton ordre.',
    ch: WAR_TARGETS.map(tg => ({
      t: `Déclarer la guerre : ${tg.t}`,
      r: { x: `Tu fais hisser le pavillon de guerre. Le message part par tous les escargophones : ${tg.group === 'marine' ? 'la Marine' : tg.group === 'gov' ? 'le Gouvernement' : 'la flotte rivale'} est prévenue.`, e: { flag: 'war_target_' + tg.k, frel: { [tg.group]: -4 }, rep: -2, arc: A('war_own', 1), morale: 10, hl: 'a déclaré la guerre' } },
    })).concat([{ t: 'Attendre : ce n\'est pas encore le moment', r: { x: 'Tes hommes râlent, mais te font confiance.', e: {} } }]),
  },
  {
    id: 'w_own1', pri: 9, emoji: '🤝', title: 'Rassembler les alliés',
    w: { test: S => S.arc('war_own', 1, 1) },
    x: 'La guerre ne se gagne pas seul. Il faut des navires, des armes, des alliés. Ton cartographe a tracé trois ports où l\'on peut recruter : un chantier naval, un clan de mercenaires, une vieille alliance de contrebandiers.',
    ch: [
      { t: 'Armer le chantier naval (navires et canons)', s: 'intel', d: 3,
        ok: { x: 'Le chantier te livre trois navires armés. Ton navire reçoit même une batterie de plus.', e: { arc: A('war_own', 2), flag: 'war_ready_sea', fleet: { name: 'Escadre de guerre', power: 6 }, ship: { mod: 'canons' }, berrys: S => -S.tierPrime() / 5 } },
        ko: { x: 'Les prix flambent. Tu arrives à t\'équiper, mais à peine.', e: { arc: A('war_own', 2), berrys: S => -S.tierPrime() / 4 } } },
      { t: 'Convaincre le clan de mercenaires', s: 'charisme', d: 3,
        ok: { x: 'Le chef te serre la main. Cinq cents lames sont à toi.', e: { arc: A('war_own', 2), flag: 'war_ready_land', fleet: { name: 'Mercenaires du clan', power: 5 } } },
        ko: { x: 'Ils veulent plus d\'or que tu n\'as.', e: { arc: A('war_own', 2), berrys: S => -S.tierPrime() / 5 } } },
      { t: 'Se passer d\'alliés : frapper tout de suite', r: { x: 'Tes hommes sourient. Pas d\'attente, pas de fuite possible.', e: { arc: A('war_own', 2), morale: 8 } } },
    ],
  },
  {
    id: 'w_own2', pri: 9, emoji: '💥', title: 'La bataille navale',
    w: { test: S => S.arc('war_own', 2, 1) },
    x: S => `Au petit matin, la flotte adverse apparaît à l'horizon, ${S.hasFlag('war_ready_sea') ? 'face à ton escadre armée.' : 'bien plus nombreuse que la tienne.'} Les canons chauffent. C'est ici que se décide qui tiendra la mer.`,
    ch: [
      { t: 'Ordre de feu : bordée générale', s: 'naval', d: S => (S.hasFlag('war_ready_sea') ? 1 : 4),
        ok: { x: 'Tes bordées taillent leur flotte en pièces. Les survivants se replient vers le port.', e: { arc: A('war_own', 3), flag: 'war_sea_won', glory: 5, shipHp: -30 } },
        ko: { x: 'Tu perds des navires, et la mer. Reste la possibilité d\'un assaut direct, désespéré.', e: { arc: A('war_own', 3), shipHp: -55, morale: -12 } } },
      { t: 'Ruse : brûlot et fausse retraite', s: 'intel', d: S => (S.hasFlag('war_ready_sea') ? 3 : 5),
        ok: { x: 'Leur amiral fonce dans le piège. Deux navires brûlent avant de comprendre.', e: { arc: A('war_own', 3), flag: 'war_sea_won', glory: 5, shipHp: -15 } },
        ko: { x: 'Le piège est éventé.', e: { arc: A('war_own', 3), shipHp: -45, morale: -10 } } },
    ],
  },
  {
    id: 'w_own3', pri: 9, emoji: '🏰', title: 'L\'assaut',
    w: { test: S => S.arc('war_own', 3, 1) },
    x: S => `La mer ${S.hasFlag('war_sea_won') ? 'est à toi' : 'ne t\'a pas été favorable'}. Reste le dernier acte : prendre le fort qui contrôle l'île. Ses murailles sont hautes, sa garnison nombreuse. Si tu gagnes, l'île t'appartient. ${S.hasFlag('war_ready_land') ? 'Tes mercenaires attendent le signal.' : ''}`,
    ch: [
      { t: 'Assaut frontal, drapeau en tête', s: 'combat', d: S => (S.hasFlag('war_sea_won') ? 1 : 4) - (S.hasFlag('war_ready_land') ? 1 : 0),
        ok: { x: 'Ton drapeau flotte sur le fort. L\'île est à toi : elle te verse un tribut, et ton nom fait trembler les ports voisins.', e: { arc: A('war_own', 4), flag2: 'war_own_done', territory: 1, glory: 8, berrys: S => S.tierPrime() * 2, rep: 6, hl: 'a conquis une île par la guerre', fleet: { name: 'Garnison conquise', power: 4 } } },
        ko: { x: 'Le fort tient. Tu te replies, blessé, avec la moitié de tes forces.', e: { arc: A('war_own', 4), flag2: 'war_own_done', hp: -40, shipHp: -30, crewLoss: true, morale: -15, rep: -3 } } },
      { t: 'Infiltrer le fort et ouvrir les portes', s: 'vitesse', d: S => (S.hasFlag('war_sea_won') ? 2 : 4),
        ok: { x: 'Les portes s\'ouvrent de l\'intérieur. Le fort tombe sans grande perte.', e: { arc: A('war_own', 4), flag2: 'war_own_done', territory: 1, glory: 6, berrys: S => S.tierPrime(), rep: 4, hl: 'a conquis une île par la guerre' } },
        ko: { x: 'Tu es repéré aux murs. La garnison te rattrape.', e: { arc: A('war_own', 4), flag2: 'war_own_done', hp: -35, morale: -10 } } },
      { t: 'Négocier la reddition', s: 'charisme', d: S => (S.hasFlag('war_sea_won') ? 3 : 7),
        ok: { x: 'Le commandant, voyant ta flotte, pose les armes. On te remet les clés de l\'île.', e: { arc: A('war_own', 4), flag2: 'war_own_done', territory: 1, glory: 4, berrys: S => S.tierPrime() / 2, rep: 6 } },
        ko: { x: 'Il refuse et riposte.', e: { arc: A('war_own', 4), flag2: 'war_own_done', hp: -25, shipHp: -20 } } },
    ],
  },
];

// ═══════════════ PRENDRE PART À UNE GUERRE ═══════════════
// Trois scénarios, chacun avec deux camps. On choisit un camp (ou on pille les deux), puis bataille navale, puis mêlée.
const SCENARIOS = [
  { id: 'war_j1', name: 'La guerre de la Marine', a: { g: 'marine', n: 'la Marine' }, b: { g: 'pirates', n: 'la coalition pirate' }, okA: S => isGa(S) || ['corsaire', 'chasseur'].includes(S.hero.faction), okB: S => !isGa(S), w: { minTier: 1 },
    intro: 'Une grande flotte de la Marine et une coalition de pirates se font face au large, des centaines de navires. Le moindre bateau compte, et les deux camps cherchent des renforts. Ton navire est à portée de canon.' },
  { id: 'war_j2', name: 'La guerre de la liberté', a: { g: 'revo', n: 'l\'Armée révolutionnaire' }, b: { g: 'gov', n: 'les forces du Gouvernement' }, okA: S => !isGa(S), okB: S => isGa(S) || S.hero.faction === 'corsaire', w: { minTier: 2 },
    intro: 'Un royaume entier s\'est soulevé. L\'Armée révolutionnaire débarque pour le soutenir, et les forces du Gouvernement ferment le blocus. Chaque navire qui passe doit choisir.' },
  { id: 'war_j3', name: 'La guerre des Empereurs', a: { g: 'bigmom', n: 'la flotte des Charlotte' }, b: { g: 'kaido', n: 'les Cent Bêtes' }, okA: S => !isGa(S), okB: S => !isGa(S), w: { minTier: 3, era: 'pre' },
    intro: 'Deux flottes d\'Empereurs se déchirent dans les eaux du Nouveau Monde. Tu es pris au milieu. Les deux camps cherchent des renforts, et les perdants perdent tout.' },
  { id: 'war_j3', name: 'La guerre des Empereurs', a: { g: 'shanks', n: 'la flotte du Roux' }, b: { g: 'teach', n: 'les Pirates de Barbe Noire' }, okA: S => !isGa(S), okB: S => !isGa(S), w: { minTier: 3, era: 'post' },
    intro: 'Deux flottes d\'Empereurs se déchirent dans les eaux du Nouveau Monde. Tu es pris au milieu. Les deux camps cherchent des renforts, et les perdants perdent tout.' },
];

for (const sc of SCENARIOS) {
  const id = sc.id, suffix = sc.w.era ? '_' + sc.w.era : '';
  const side = k => 'wj_' + id + '_' + k;
  const mine = S => (S.hasFlag(side('a')) ? sc.a : S.hasFlag(side('b')) ? sc.b : null);
  const others = S => (S.hasFlag(side('a')) ? sc.b : sc.a);
  WAR_EVENTS.push(
    {
      id: id + '_open' + suffix, emoji: '⚔️', title: sc.name,
      w: { ctx: undefined, weight: 11, ...sc.w, test: S => hasShipPower(S) && (sc.okA(S) || sc.okB(S)) && S.arc(id, 0) && !S.seen[id + '_done'] && S.lvl >= 1 },
      x: sc.intro,
      ch: [
        { t: `Combattre avec ${sc.a.n}`, req: sc.okA, rq: 'Pas pour ton camp', r: { x: `Tu hisses les couleurs de ${sc.a.n}. On t\'assigne l\'aile droite.`, e: { flag: side('a'), arc: A(id, 1), frel: { [sc.a.g]: 3, [sc.b.g]: -3 } } } },
        { t: `Combattre avec ${sc.b.n}`, req: sc.okB, rq: 'Pas pour ton camp', r: { x: `Tu rejoins ${sc.b.n}. On te confie la ligne de mer.`, e: { flag: side('b'), arc: A(id, 1), frel: { [sc.b.g]: 3, [sc.a.g]: -3 } } } },
        { t: 'Rester en retrait et piller les épaves', req: isCh, rq: 'Chercheurs uniquement', s: 'vitesse', d: 2,
          ok: { x: 'Pendant que les deux camps s\'entre-tuent, ta cale se remplit. Personne ne te demande rien.', e: { berrys: S => S.tierPrime() * 1.5, glory: 1, rep: -4, flag2: id + '_done', arc: A(id, 3) } },
          ko: { x: 'Un navire t\'a vu piller. Il t\'envoie une bordée.', e: { shipHp: -25, flag2: id + '_done', arc: A(id, 3) } } },
        { t: 'Fuir la zone', r: { x: 'Tu t\'éloignes de la bataille, honteux ou soulagé.', e: { morale: -3, flag2: id + '_done', arc: A(id, 3) } } },
      ],
    },
    {
      id: id + '_sea' + suffix, pri: 9, emoji: '💥', title: 'Bataille navale',
      w: { ...sc.w, test: S => S.arc(id, 1, 1) },
      x: S => `La ligne de bataille est formée. Ton navire est au centre de la ligne de ${mine(S)?.n ?? 'ton camp'}. En face, ${others(S).n}.`,
      ch: [
        { t: 'Charger l\'ennemi, bordées à bout portant', s: 'naval', d: 3,
          ok: { x: 'Ton navire crève la ligne ennemie. Une vague de panique fait plier leur aile.', e: { arc: A(id, 2), flag: side('sea'), glory: 4, shipHp: -30 } },
          ko: { x: 'La ligne ennemie tient. Ton navire encaisse un feu nourri.', e: { arc: A(id, 2), shipHp: -50, morale: -10 } } },
        { t: 'Soutenir les navires alliés et couvrir le flanc', s: 'naval', d: 1,
          ok: { x: 'Tes tirs de couverture sauvent trois navires alliés. Leur amiral te le rendra.', e: { arc: A(id, 2), flag: side('sea'), glory: 3, shipHp: -15, frel: S => ({ [mine(S)?.g ?? sc.a.g]: 2 }) } },
          ko: { x: 'Tu es pris en tenaille et dois te retirer.', e: { arc: A(id, 2), shipHp: -35 } } },
        { t: 'Passer une escadre ennemie à l\'abordage', s: 'combat', d: 3,
          ok: { x: 'Tu prends un navire amiral. Le moral ennemi s\'effondre.', e: { arc: A(id, 2), flag: side('sea'), glory: 5, hp: -15, shipHp: -20 } },
          ko: { x: 'Ton abordage est repoussé avec pertes.', e: { arc: A(id, 2), hp: -30, shipHp: -30 } } },
      ],
    },
    {
      id: id + '_land' + suffix, pri: 9, emoji: '🔥', title: 'La mêlée',
      w: { ...sc.w, test: S => S.arc(id, 2, 1) },
      x: S => `${S.hasFlag(side('sea')) ? 'La mer est dégagée, ' : 'La mer a été dure, '}la bataille se joue maintenant à terre, sur la grève et dans les ruines du port. ${mine(S)?.n ?? 'Ton camp'} compte sur toi pour percer la ligne de ${others(S).n}.`,
      ch: [
        { t: 'Mener la charge', s: 'combat', d: S => 3 - (S.hasFlag(side('sea')) ? 2 : 0),
          ok: { x: 'Ta charge fait plier la ligne ennemie. La victoire est à ton camp, et tout le monde sait qui a tenu l\'aile.', e: { arc: A(id, 3), flag2: id + '_done', glory: 8, berrys: S => S.tierPrime() * 2, rep: 8, merit: 5, frel: S => ({ [mine(S)?.g ?? sc.a.g]: 4, [others(S).g]: -3 }), hl: 'a combattu dans une grande guerre' } },
          ko: { x: 'Ton camp perd la bataille. Tu te replies, blessé, avec les survivants.', e: { arc: A(id, 3), flag2: id + '_done', hp: -45, crewLoss: true, morale: -15, rep: -2 } } },
        { t: 'Capturer le chef adverse', s: 'combat', d: S => 5 - (S.hasFlag(side('sea')) ? 2 : 0),
          ok: { x: 'Tu t\'ouvres un chemin jusqu\'au commandant ennemi. Quand tu le ramènes, la bataille s\'arrête.', e: { arc: A(id, 3), flag2: id + '_done', glory: 12, berrys: S => S.tierPrime() * 3, rep: 12, merit: 8, frel: S => ({ [mine(S)?.g ?? sc.a.g]: 6, [others(S).g]: -5 }), hl: 'a décidé d\'une grande guerre en capturant le chef ennemi' } },
          ko: { x: 'L\'opération échoue : tu es blessé, ton camp perd du terrain.', e: { arc: A(id, 3), flag2: id + '_done', hp: -50, morale: -15 } } },
        { t: 'Veiller sur les blessés et évacuer les civils', s: 'volonte', d: 1,
          ok: { x: 'Les civils et les blessés te doivent la vie. Les deux camps l\'apprennent.', e: { arc: A(id, 3), flag2: id + '_done', rep: 12, glory: 2, morale: 10, frel: S => ({ [mine(S)?.g ?? sc.a.g]: 2 }) } },
          ko: { x: 'L\'évacuation tourne court.', e: { arc: A(id, 3), flag2: id + '_done', hp: -20, rep: 2 } } },
      ],
    },
  );
}
// les scénarios 3 ont deux versions (avant / après) qui partagent la même trame
for (const ev of WAR_EVENTS) if (ev.w && ev.w.ctx === undefined) delete ev.w.ctx;

// ═══════════════ ALLIANCES ET FLOTTES : elles pèsent dans les batailles ═══════════════
const callAllies = (ev, stage) => {
  const base = ev.ch[0];
  const pick = k => { const e = base[k]?.e || {}; return { arc: e.arc, flag: e.flag, flag2: e.flag2 }; };
  const clean = o => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
  ev.ch.unshift({
    t: 'Appeler tes alliés et ta flotte', req: S => S.fleet.length > 0 || S.allyCount > 0, rq: 'Aucune flotte ni allié',
    p: S => Math.min(0.92, 0.4 + S.fleetPower * 0.03 + S.allyCount * 0.12),
    ok: { x: 'Des voiles alliées surgissent de l\'horizon, pavillons au vent. Ta flotte se déploie, et la bataille bascule.', e: { glory: 5, morale: 10, shipHp: -5, ...clean(pick('ok')) } },
    ko: { x: 'Les renforts arrivent trop tard : ta flotte paie le prix de ton appel.', e: { shipHp: -30, fleetLoss: true, morale: -6, ...clean(pick('ko')) } },
  });
};
for (const ev of [...NAVAL_EVENTS, ...WAR_EVENTS]) if (/^(n_broadside|n_blockade|n_fleet_yonko|w_own2|w_own3|war_j\d_(sea|land))/.test(ev.id) && ev.ch?.[0]) callAllies(ev);

NAVAL_EVENTS.push(
  {
    id: 'n_hunters', emoji: '🎯', title: 'Chasseurs de primes en mer',
    w: { ctx: 'sea', camp: 'chercheur', weight: 6, test: S => hasShipPower(S) && S.hero.bounty >= 3_000_000 },
    x: 'Trois navires de chasseurs de primes convergent sur toi. Ils ont ton avis de recherche épinglé sur le mât, et ils comptent sur la prime.',
    ch: [
      { t: 'Les couler à coups de canon', s: 'naval', d: 1,
        ok: { x: 'Leurs coques éclatent. Tu récupères leurs réserves et ils renoncent à t\'approcher.', e: { glory: 3, berrys: S => S.tierPrime() / 3, shipHp: -15 } },
        ko: { x: 'Ils sont plus nombreux que prévu : tu passes de justesse.', e: { shipHp: -35, berrys: S => -S.tierPrime() / 6 } } },
      { t: 'Les prendre à l\'abordage', s: 'combat', d: 2,
        ok: { x: 'Tu balaies leurs ponts. Leurs avis de recherche, toi tu les gardes en souvenir.', e: { glory: 4, hp: -10, rep: 2 } },
        ko: { x: 'Tu es débordé et blessé.', e: { hp: -30, shipHp: -15 } } },
    ],
  },
  {
    id: 'n_ghost', emoji: '👻', title: 'Le vaisseau fantôme',
    w: { ctx: 'sea', weight: 4, test: S => hasShipPower(S) && S.tier >= 2 },
    x: 'Un brouillard glacé. Dans la brume, un galion déchiré, ses voiles en lambeaux, glisse sans équipage visible. Ses canons s\'ouvrent un à un, seuls.',
    ch: [
      { t: 'Foncer et le faire couler', s: 'naval', d: 3,
        ok: { x: 'Le galion s\'effondre en poussière. Dans les débris : un coffre verdâtre et un vieux livre de bord.', e: { glory: 4, berrys: S => S.tierPrime() / 2, ship: { mod: 'random' }, shipHp: -20 } },
        ko: { x: 'Des canons que tu ne vois pas te touchent par-dessous.', e: { shipHp: -45, morale: -10 } } },
      { t: 'Traverser la brume sans bruit', s: 'vitesse', d: 2,
        ok: { x: 'Le fantôme ne t\'a pas vu. Il disparaît dans la brume.', e: { stats: { vitesse: 1 } } },
        ko: { x: 'Un frisson, puis une salve.', e: { shipHp: -25, morale: -6 } } },
    ],
  },
  {
    id: 'n_smuggler', emoji: '📦', title: 'La cargaison des contrebandiers',
    w: { ctx: 'sea', weight: 5, test: S => hasShipPower(S) },
    x: 'Un navire sans pavillon file en dehors des routes, très bas sur l\'eau : il est chargé jusqu\'à la gueule. Les contrebandiers t\'aperçoivent et jettent des tonneaux pour alléger la poursuite.',
    ch: [
      { t: 'Le rattraper et saisir la cargaison', s: 'naval', d: 2,
        ok: { x: 'Tu le coinces contre un récif. La cargaison est à toi, et personne ne portera plainte.', e: { berrys: S => S.tierPrime() * 0.8, glory: 2, shipHp: -10 } },
        ko: { x: 'Il disparaît dans un chenal que tu n\'as pas vu.', e: { morale: -4, shipHp: -15 } } },
      { t: 'Le laisser filer, ramasser les tonneaux', r: { x: 'Quelques tonneaux de rhum et de poudre flottent. C\'est toujours ça.', e: { berrys: S => S.tierPrime() / 8, morale: 6 } } },
    ],
  },
);

// L'appel d'un allié : une puissance dont tu es l'ami te demande de combattre à ses côtés.
const FOES = { marine: 'pirates', gov: 'revo', revo: 'gov', pirates: 'marine', chapeau: 'marine', shanks: 'teach', wb: 'marine', bigmom: 'kaido', kaido: 'bigmom', teach: 'shanks', corsaires: 'revo', crossguild: 'marine', kuja: 'marine', minks: 'kaido', geants: 'pirates', wano: 'kaido', ryugu: 'pirates', germa: 'revo', galleyla: 'gov', ciel: 'pirates', vegapunk: 'gov', roger: 'marine' };
for (const [g, foe] of Object.entries(FOES)) {
  WAR_EVENTS.push({
    id: 'wa_' + g, once: true, emoji: '📯', title: 'L\'appel d\'un allié',
    w: { weight: 10, test: S => S.grel(g) >= 6 && S.lvl >= 1 && hasShipPower(S) },
    x: S => `Un messager de ${g === 'marine' ? 'la Marine' : 'tes alliés'} accoste en urgence : leur camp est attaqué par ${foe === 'marine' ? 'la Marine' : foe === 'gov' ? 'le Gouvernement' : foe === 'revo' ? 'les révolutionnaires' : foe === 'pirates' ? 'une coalition pirate' : 'un rival'} et ils ont besoin de bras. « Tu nous dois bien ça, ami. »`,
    ch: [
      { t: 'Prendre la tête de la bataille navale', s: 'naval', d: 2,
        ok: { x: 'Ta flotte brise la ligne ennemie. Tes alliés te portent en triomphe.', e: { glory: 6, berrys: S => S.tierPrime() * 1.5, frel: { [g]: 3, [foe]: -3 }, shipHp: -20, hl: 'a répondu à l\'appel d\'un allié et gagné la bataille' } },
        ko: { x: 'La bataille est perdue, mais tes alliés te savent gré d\'être venu.', e: { shipHp: -45, frel: { [g]: 1 }, morale: -8 } } },
      { t: 'Mener l\'assaut à terre', s: 'combat', d: 2,
        ok: { x: 'Tu fais plier le front ennemi. La victoire est à ton camp.', e: { glory: 6, berrys: S => S.tierPrime() * 1.5, frel: { [g]: 3, [foe]: -3 }, hp: -15, hl: 'a répondu à l\'appel d\'un allié et gagné la bataille' } },
        ko: { x: 'Tu te replies, blessé, mais présent.', e: { hp: -40, frel: { [g]: 1 } } } },
      { t: 'Envoyer ta flotte sans te déplacer', req: S => S.fleet.length > 0, rq: 'Il faut une flotte', p: S => Math.min(0.9, 0.45 + S.fleetPower * 0.04),
        ok: { x: 'Ta flotte prend ta place et revient couverte de gloire.', e: { glory: 3, frel: { [g]: 2, [foe]: -2 }, berrys: S => S.tierPrime() / 2 } },
        ko: { x: 'Ta flotte est battue, et ton allié se demande où tu étais.', e: { fleetLoss: true, frel: { [g]: -1 } } } },
    ],
  });
}
