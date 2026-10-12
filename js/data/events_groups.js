// Présence des grandes puissances : chaque équipage / organisation a des rencontres propres
// sur son territoire (première rencontre garantie, puis rencontres récurrentes), en mer (flotte)
// et des missions pour ceux qui sont ses amis. Tout joue sur la réputation de groupe (frel).
import { GROUPS } from './groups.js';

const isCh = S => S.camp === 'chercheur';

// eras : époques où le groupe est actif · men : quelques figures · yo : identifiant d'Empereur à rejoindre (par époque)
const CFG = [
  { g: 'crossguild', eras: ['post'], minTier: 2, men: 'Crocodile, Mihawk et Baggy', yo: { post: 'baggy' },
    intro: 'Des mercenaires de la Cross Guild, la « société » pirate qui met les têtes à prix en bourse, t\'accostent. Leurs costumes sont plus chers que ton navire. « Les primes sont un marché. Tu as de la valeur, et nous achetons. »',
    recur: 'Un recruteur de la Cross Guild passe de table en table avec un registre de primes. Il note ton nom, cherche ton prix et sourit.',
    fleet: 'Un navire de la Cross Guild croise ta route, pavillon à la tête de mort et au crochet. Un petit sbire hurle : « Ici, on prélève ! »',
    mission: 'Un émissaire de la Cross Guild te propose un contrat : escorter une cargaison de primes jusqu\'à Karai Bari. Bien payé, mais les Marines rôdent.' },
  { g: 'teach', eras: ['post'], minTier: 2, men: 'Marshall D. Teach et son équipage', yo: { post: 'teach' },
    intro: 'Des hommes de Barbe Noire patrouillent le port, des fruits du démon dans leurs sacs. L\'un d\'eux te toise : « Zehahaha ! Le capitaine aime les gens qui ont des fruits, et les gens qui n\'en ont plus aussi. »',
    recur: 'On parle à voix basse du rire du capitaine Teach. Deux de ses lieutenants ont acheté la moitié du marché aux fruits de la ville.',
    fleet: 'Une flotte noire fend la mer : les Pirates de Barbe Noire. Leurs canons sont déjà sortis, et leurs rires portent jusque sur ton pont.',
    mission: 'Un lieutenant de Barbe Noire te donne rendez-vous dans l\'arrière-salle : « Il y a un fruit dans cette ville. Ramène-le, et le capitaine t\'aura à la bonne. »' },
  { g: 'teach', eras: ['pre'], minTier: 2, men: 'Marshall D. Teach, simple second de Barbe Blanche', yo: {},
    intro: 'Un grand type edenté et jovial te verse un verre : « Zehahaha ! Je m\'appelle Teach. Je rêve d\'un fruit du démon, et d\'être capitaine un jour. » Sa mine cache autre chose.',
    recur: 'Des hommes qui ne sont pas de Barbe Blanche mais lui appartiennent traînent du côté du port. Teach est dans les parages, il écoute plus qu\'il ne parle.',
    fleet: 'Un navire sans pavillon te suit depuis un moment. À son bord, un homme jovial agite la main. Teach, en mission « personnelle ».',
    mission: 'Teach te confie un service : « Rapporte-moi des informations sur un fruit rare. Le vieux n\'a pas besoin de le savoir. »' },
  { g: 'shanks', eras: ['pre', 'post'], minTier: 1, men: 'Shanks le Roux et ses lieutenants', yo: { pre: 'shanks', post: 'shanks' },
    intro: 'Un homme borgne à la cicatrice sur l\'œil, un chapeau de paille sur la tête, lève sa chope : « Ici, on boit à la mer ! » Autour de lui, ses hommes rient. Ils ont l\'air d\'une famille et d\'une armée.',
    recur: 'Des hommes du Roux sont à quai : Ben Beckman fume une cigarette, Lucky Roo mâche un gigot. Ils discutent d\'un navire marchand qui a disparu au large.',
    fleet: 'Une voile rouge à l\'horizon : l\'Équipage du Roux. Le vieux Red Force passe tranquillement, sans tirer. L\'équipage te salue au passage.',
    mission: 'Ben Beckman te prend à part, la cigarette aux lèvres : « Le capitaine voudrait savoir qui fait peur à qui dans le coin. Tu me rends ce service ? »' },
  { g: 'wb', eras: ['pre'], minTier: 2, men: 'Barbe Blanche et ses commandants', yo: { pre: 'barbeblanche' },
    intro: 'Le pavillon à la moustache blanche flotte sur le port. « Ici, c\'est le territoire de Papa », dit un commandant en te barrant la route. Derrière lui, une famille entière d\'hommes forts et gouailleurs.',
    recur: 'Marco le Phénix bavarde avec une vieille marchande. Quelques frères de Barbe Blanche règlent une dispute à coups de poings, puis trinquent.',
    fleet: 'La moustache blanche flotte sur un navire monstrueux, la Moby Dick. L\'équipage de Barbe Blanche te regarde passer, curieux.',
    mission: 'Un commandant de Barbe Blanche te sollicite : « Un de nos frères est en difficulté sur une île voisine. Un coup de main, et Papa te devra une bière. »' },
  { g: 'bigmom', eras: ['pre'], minTier: 2, men: 'Big Mom et les Charlotte', yo: { pre: 'bigmom' },
    intro: 'Un homme-gâteau à la mine sinistre t\'arrête : « Tu es sur le territoire de Mama. Mama aime les invités. Mama aime les gens qui apportent des sucreries. Ou les âmes. »',
    recur: 'Une file d\'enfants Charlotte, chacun plus bizarre que le précédent, passe en réclamant des bonbons. Un majordome te regarde de travers.',
    fleet: 'Un navire en forme de gâteau géant manœuvre vers toi. Sur le pont, un des cent enfants de Big Mom hurle : « Du gâteau, ou la mort ! »',
    mission: 'Un Charlotte te confie un service : « Maman a faim. Rapporte-lui une recette de ce port. Sinon, ce sera ta tête. »' },
  { g: 'kaido', eras: ['pre'], minTier: 3, men: 'Kaido et ses Calamités', yo: { pre: 'kaido' },
    intro: 'Un grand type en armure te saisit au col : « Les Cent Bêtes ne laissent personne passer sans permission. » Un Smile à la bouche, il recrute à tour de bras. Autour, les prisonniers portent des fruits défectueux.',
    recur: 'Un des Calamités traîne dans le coin, un grand sabre sur l\'épaule. On dit qu\'il cherche de nouvelles recrues pour la prochaine razzia.',
    fleet: 'Un navire marqué du dragon fonce sur toi. Les Cent Bêtes ne parlent pas : ils tirent d\'abord, ils comptent les morts ensuite.',
    mission: 'Un Calamité te fait une offre : « Casse la gueule à un récalcitrant sur cette île. Les Cent Bêtes paient bien… et se souviennent. »' },
  { g: 'corsaires', eras: ['pre'], minTier: 2, men: 'les Corsaires du Gouvernement', yo: {},
    intro: 'Un navire de corsaire est à quai. Son capitaine, protégé par la lettre du Gouvernement, boit tranquillement. Autour de lui, les Marines n\'osent pas le regarder en face.',
    recur: 'Des hommes d\'un Corsaire règlent leurs comptes dans une ruelle. Leur patron, dit-on, a un accord avec le Gouvernement : ils sont intouchables.',
    fleet: 'Un navire arbore le pavillon d\'un Corsaire. Il ne t\'attaque pas, mais la menace est claire : sa route est la sienne.',
    mission: 'Un Corsaire t\'envoie un messager : « Un service contre un autre. Je te laisse tranquille si tu me rends la pareille. »' },
];

const enemyOf = cfg => cfg.g;
const GNAME = g => GROUPS[g].name;
const E = (cfg, era) => cfg.yo?.[era];

export const GROUP_EVENTS = [];
for (const cfg of CFG) {
  const g = cfg.g, gr = GROUPS[g];
  for (const era of cfg.eras) {
    const tag = `${g}_${era}`;
    const terrOk = S => (gr.terr[era] || []).includes(S.loc);
    const base = { era, minTier: cfg.minTier };
    // 1. première rencontre sur le territoire (prioritaire, une fois)
    GROUP_EVENTS.push({
      id: `gv_first_${tag}`, pri: 9, emoji: gr.emoji, title: gr.name,
      w: { ...base, test: S => terrOk(S) },
      x: cfg.intro,
      ch: [
        { t: 'Gagner leur sympathie', s: 'charisme', d: 1,
          ok: { x: `Tu fais bonne impression. ${gr.name} te traite en égal, et les langues se délient.`, e: { frel: { [g]: 3 }, rep: 2, berrys: S => S.tierPrime() / 6 } },
          ko: { x: 'Tu as dit un mot de trop. Ils te regardent froidement.', e: { frel: { [g]: -1 } } } },
        { t: 'Leur montrer ce que tu vaux', s: 'combat', d: 2,
          ok: { x: 'Tu fais taire le plus bruyant. Ils respectent la force, et se souviendront de toi.', e: { frel: { [g]: 1 }, glory: 3, rep: 1 } },
          ko: { x: 'Ils te rossent poliment, puis te remettent à la porte.', e: { frel: { [g]: -2 }, hp: -25 } } },
        { t: 'Payer le « droit de passage »', c: S => S.tierPrime() / 8,
          r: { x: 'Tu verses la somme. On t\'adresse un signe de tête : la paix, pour l\'instant.', e: { frel: { [g]: 2 } } } },
        ...(E(cfg, era) ? [{ t: 'Demander à rejoindre leur flotte', req: S => isCh(S) && !S.hero.yonko && S.tier >= 2, rq: 'Chercheurs sans Empereur, Grand Line', s: 'charisme', d: 4,
          ok: { x: `On accepte ton serment. Tu navigues désormais sous le pavillon de ${gr.name}.`, e: { yonko: E(cfg, era), frel: { [g]: 2 }, hl: `a juré fidélité à ${gr.name}` } },
          ko: { x: 'On rit de toi : il faudra faire tes preuves.', e: { morale: -3 } } }] : []),
        { t: 'Les défier ouvertement', s: 'combat', d: 5,
          ok: { x: 'Ils ne s\'attendaient pas à ça. Tu leur arraches une partie de leur butin, mais leur chef va l\'apprendre.', e: { glory: 5, berrys: S => S.tierPrime(), frel: { [g]: -4 }, rep: 4 } },
          ko: { x: 'Un défi trop grand. Ils t\'écrasent, puis te laissent sur le quai.', e: { hp: -45, frel: { [g]: -3 }, morale: -8 } } },
      ],
    });
    // 2. rencontres récurrentes
    GROUP_EVENTS.push({
      id: `gv_recur_${tag}`, emoji: gr.emoji, title: `${gr.name} : de passage`,
      w: { ...base, weight: 7, test: S => terrOk(S) },
      x: cfg.recur,
      ch: [
        { t: 'Leur payer un verre et écouter', c: S => S.tierPrime() / 20,
          r: { x: 'Les confidences vont bon train. Tu apprends un secret d\'île et gagnes un peu de leur confiance.', e: { frel: { [g]: 1 }, stats: { intel: 1 } } } },
        { t: 'Leur proposer un marché', s: 'charisme', d: 2,
          ok: { x: 'Ils ont besoin de bras. Tu gagnes ta part, et une bonne réputation.', e: { berrys: S => S.tierPrime() / 3, frel: { [g]: 1 } } },
          ko: { x: 'Ils te congédient, agacés.', e: { frel: { [g]: -1 } } } },
        { t: 'Les provoquer', s: 'combat', d: 3,
          ok: { x: 'Quelques coups de poing plus tard, ils te respectent plus que tu ne t\'y attendais.', e: { glory: 3, frel: { [g]: -1 }, rep: 2 } },
          ko: { x: 'Ils étaient plus nombreux. Tu t\'en tires avec des bleus.', e: { hp: -20, frel: { [g]: -2 } } } },
      ],
    });
    // 2b. présence itinérante : leurs hommes se croisent un peu partout dans les mers de leur niveau
    GROUP_EVENTS.push({
      id: `gv_roam_${tag}`, emoji: gr.emoji, title: `${gr.name} : des hommes en ville`,
      w: { ...base, weight: 6, test: S => !terrOk(S) && !S.isl_noNav },
      x: S => `${cfg.recur} Ils ne sont pas chez eux ici, mais ils sont partout.`,
      ch: [
        { t: 'Lier conversation', s: 'charisme', d: 1,
          ok: { x: 'Tu fais connaissance. Ils parlent de leur chef avec un mélange de fierté et de crainte.', e: { frel: { [g]: 1 }, stats: { intel: 1 } } },
          ko: { x: 'Ils te regardent de haut.', e: { frel: { [g]: -1 } } } },
        { t: 'Leur chercher des noises', s: 'combat', d: 2,
          ok: { x: 'Tu les ridiculises devant tout le port. Leur chef va entendre parler de toi.', e: { glory: 3, rep: 2, frel: { [g]: -2 } } },
          ko: { x: 'Ils te corrigent proprement.', e: { hp: -25, frel: { [g]: -1 } } } },
        { t: 'Passer son chemin', r: { x: 'Tu évites les ennuis.', e: {} } },
      ],
    });
    // 3. flotte en mer
    GROUP_EVENTS.push({
      id: `gv_fleet_${tag}`, emoji: gr.emoji, title: `La flotte : ${gr.name}`,
      w: { ...base, ctx: 'sea', weight: 5, test: S => S.ship.hp > 0 },
      x: cfg.fleet,
      ch: [
        { t: 'Hisser leurs couleurs en signe de respect', s: 'charisme', d: 1,
          ok: { x: 'Leur capitaine répond d\'un salut. La route est libre, et ton nom circule dans leurs rangs.', e: { frel: { [g]: 2 } } },
          ko: { x: 'Ils prennent ton geste pour une moquerie.', e: { frel: { [g]: -1 }, shipHp: -15 } } },
        { t: 'Leur tenir tête en bataille navale', s: 'naval', d: 3,
          ok: { x: 'Ta bordée les fait reculer. C\'est un acte de guerre, et ils s\'en souviendront.', e: { glory: 4, shipHp: -25, frel: { [g]: -3 }, berrys: S => S.tierPrime() / 2 } },
          ko: { x: 'Leur puissance de feu est écrasante.', e: { shipHp: -45, frel: { [g]: -2 }, morale: -8 } } },
        { t: 'Passer au large à toute voile', s: 'navigation', d: 2,
          ok: { x: 'Tu les distances sans qu\'ils bougent. Ils ne te poursuivent pas.', e: {} },
          ko: { x: 'Un tir de semonce abîme ton gouvernail.', e: { shipHp: -20 } } },
      ],
    });
    // 4. mission pour un ami
    GROUP_EVENTS.push({
      id: `gv_mission_${tag}`, emoji: gr.emoji, title: `Service rendu à ${gr.name}`,
      w: { ...base, weight: 9, test: S => S.grel(g) >= 3 && S.hero.berrys >= 0 },
      x: cfg.mission,
      ch: [
        { t: 'Accepter la mission', s: 'combat', d: 3,
          ok: { x: 'Mission accomplie. Le message revient avec ta réputation : tu es désormais quelqu\'un à qui on confie des choses.', e: { frel: { [g]: 3 }, berrys: S => S.tierPrime(), glory: 3, rep: 2, hl: `a rendu un service à ${gr.name}` } },
          ko: { x: 'Tu échoues. Ils sont déçus, sans te le reprocher.', e: { frel: { [g]: -1 }, hp: -25 } } },
        { t: 'Négocier une meilleure récompense', s: 'charisme', d: 3,
          ok: { x: 'Ils te paient plus que prévu, par respect pour ton audace.', e: { frel: { [g]: 2 }, berrys: S => S.tierPrime() * 1.5 } },
          ko: { x: 'Ils ont déjà dit non une fois.', e: { frel: { [g]: -1 } } } },
        { t: 'Refuser poliment', r: { x: 'Ils haussent les épaules. L\'offre ne reviendra peut-être pas.', e: { frel: { [g]: -1 } } } },
      ],
    });
  }
}
