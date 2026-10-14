// Histoires originales (hors canon) : factions ennemies inventées, trames liées aux Empereurs, aux Corsaires,
// à la Marine et aux Dragons Célestes. Elles restent cohérentes avec l'univers : aucun personnage canon n'est trahi.
import { GROUPS } from './groups.js';

const A = (id, stage) => ({ id, stage });
export const ORIG_ARCS = {};
export const ORIG_EVENTS = [];

// ═══════════════ FACTIONS ORIGINALES ═══════════════
const CFG = [
  { g: 'corbeaux', minTier: 1, kind: 'naval', boss: 'le capitaine Mortimer Vass, dit « le Veuf »',
    intro: 'Dans le port, une brume épaisse stagne depuis l\'aube. Des silhouettes en capes noires s\'y faufilent : les Corbeaux de Brume, une bande de contrebandiers qui pillent sous le couvert du brouillard. L\'un d\'eux te remarque et ricane : « Ici, la brume est à nous. »',
    recur: 'Des hommes en capes noires prélèvent un « droit de brume » sur les marchands. Un enfant te glisse que le capitaine Vass n\'a jamais perdu un navire dans le brouillard.',
    sea: 'Un banc de brume surgit en pleine mer, anormalement épais. Des cloches résonnent, puis des silhouettes de navires sans lanternes se resserrent : les Corbeaux de Brume.',
    a1: 'En fouillant la cale d\'un navire abandonné, tu trouves une carte annotée : les routes de contrebande des Corbeaux, et un point de rendez-vous marqué d\'un X rouge.', a2: 'Ton enquête te mène à un phare désaffecté où les Corbeaux entreposent leur butin. Une sentinelle dort ; mais les ombres bougent derrière les fenêtres.', a3: 'Le capitaine Vass t\'attend, seul sur le pont de son navire brumeux. « J\'ai perdu ma famille dans ce brouillard. Ça ne m\'a pas rendu gentil. »',
    reward: { berrys: S => S.tierPrime() * 1.5, ship: { mod: 'vigie' } }, hl: 'a mis fin aux Corbeaux de Brume' },
  { g: 'recif', minTier: 2, kind: 'naval', boss: 'Mère Anémone, grande prêtresse de la Confrérie',
    intro: 'Sur le quai, des pèlerins en tuniques d\'algues chantent à la mer. Leurs yeux brillent d\'une ferveur trop vive. La Confrérie du Récif vénère les Rois des Mers : une sœur te tend un collier de corail. « Offre quelque chose à la mer, étranger. Ou la mer prendra ce qu\'elle voudra. »',
    recur: 'Des fidèles de la Confrérie bloquent un quai, bras levés, en rituel. Ils réclament « l\'offrande du passage » à chaque navire qui appareille.',
    sea: 'La mer s\'agite sans vent. Des barques ornées de coraux encerclent ton navire, et leurs rameurs chantent. Quelque chose de grand remue sous la coque : la Confrérie du Récif invoque une offrande.',
    a1: 'Un ancien pêcheur te confie : les prêtres de la Confrérie nourrissent un Roi des Mers dressé, qui coule les navires récalcitrants. Il te montre la crique où on le nourrit.', a2: 'Dans la crique, tu aperçois la bête : plus longue que ton navire, ses flancs couverts de chaînes. Les prêtres lui parlent comme à un dieu.', a3: 'Mère Anémone te reçoit sur son navire de corail. « Le Roi des Mers répond à mon chant. À toi de choisir : danser dans mes eaux, ou couler dans elles. »',
    reward: { glory: 6, ship: { mod: 'coque' } }, hl: 'a brisé la Confrérie du Récif' },
  { g: 'marees', minTier: 2, kind: 'land', boss: 'le directeur Aldous Pym',
    intro: 'Un entrepôt gigantesque porte l\'enseigne de la Compagnie des Marées Noires : pétrole, armes, « main-d\'œuvre ». Des gardes en livrée surveillent les quais. Un contremaître te toise : « Tu es client, concurrent ou marchandise ? Ça ne change que le prix. »',
    recur: 'Des gardes de la Compagnie escortent un convoi de caisses scellées. Quand tu t\'approches, un d\'eux murmure : « Circule. Et ne regarde pas dedans. »',
    sea: 'Un cargo lourdement armé aux couleurs de la Compagnie des Marées Noires te hèle : « Zone de transit privée. Paye le péage ou on prend la cargaison. »',
    a1: 'Un dockeur te fait signe dans une ruelle : « La Compagnie vend des gens aux Dragons Célestes. Je peux te montrer les registres. Mais il faut y entrer. »', a2: 'Tu te glisses dans l\'entrepôt de nuit. Dans les registres, des noms, des prix, et un cachet : certains acheteurs sont très haut placés.', a3: 'Le directeur Pym te reçoit dans son bureau doré. « Les affaires sont les affaires. Tu veux me détruire ? Tu détruiras un système, pas un homme. »',
    reward: { berrys: S => S.tierPrime() * 2, frel: { revo: 3, gov: -2 } }, hl: 'a démantelé la Compagnie des Marées Noires' },
  { g: 'rhon', minTier: 2, kind: 'land', boss: 'le général Brann Rhôn',
    intro: 'Un campement de mercenaires borde la route : des tentes grises, des bannières au loup, des armes entretenues avec soin. Les Chiens de Guerre de Rhôn louent leurs bras au plus offrant. Un sergent te jauge : « Un contrat ? Ou tu comptes nous gêner ? »',
    recur: 'Des Chiens de Guerre s\'entraînent en cadence sur une place. Un recruteur te lance : « Une solde, un repas, un coin pour dormir. T\'es pas obligé de savoir qui on tue. »',
    sea: 'Un convoi de transport de troupes, bannière au loup, file vers un autre port. Le chef de bord te fait signe : « Un passage payant ? Ou un duel pour le plaisir ? »',
    a1: 'Un déserteur de Rhôn te supplie de l\'aider : sa compagnie a reçu l\'ordre de massacrer un village qui refuse de payer ses taxes à son nouveau « protecteur ».', a2: 'Tu repères la route de la compagnie. Un général adjoint hésite : certains soldats n\'obéiront peut-être pas.', a3: 'Le général Brann Rhôn se tient devant son armée. « Je ne fais pas la guerre pour une cause. Je la fais pour la solde. Mais je n\'ai jamais été lâche. »',
    reward: { berrys: S => S.tierPrime(), fleet: { name: 'Compagnie de mercenaires', power: 5 } }, hl: 'a dispersé les Chiens de Guerre de Rhôn' },
  { g: 'sablier', minTier: 3, kind: 'land', boss: 'l\'archiviste Veyl',
    intro: 'Des hommes en robes grises, un sablier brodé sur le cœur, étudient les murs d\'une ruine. L\'Ordre du Sablier cherche, dit-on, la vérité sur le Siècle Oublié. L\'un d\'eux te fixe : « Tu portes des cartes qui ne sont pas de ce monde, n\'est-ce pas ? »',
    recur: 'Des moines du Sablier recopient des inscriptions anciennes dans un silence religieux. L\'un d\'eux croise ton regard et baisse la voix : « Ils nous surveillent. Ceux d\'en haut. »',
    sea: 'Un navire aux voiles couleur de cendre te suit à distance respectueuse depuis des heures. À son pavillon, un sablier brisé : l\'Ordre du Sablier t\'observe.',
    a1: 'Un moine du Sablier te confie : leur ordre cherche à protéger des vérités que le Gouvernement veut effacer. Mais un schisme est né. Les durs veulent tout révéler, quitte à brûler le monde.', a2: 'Tu découvres leur sanctuaire caché. Un des fanatiques prépare un rituel : détruire un Poneglyphe pour « précipiter la vérité ».', a3: 'L\'archiviste Veyl se tourne vers toi. « Je ne suis pas ton ennemi. Mais je ne te laisserai pas arrêter ce qui doit être. »',
    reward: { stats: { intel: 2 }, glory: 6 }, hl: 'a apaisé (ou brisé) l\'Ordre du Sablier' },
  { g: 'phares', minTier: 2, kind: 'naval', boss: 'Madame Lanterne',
    intro: 'Les phares de la côte clignotent dans un étrange rythme. Un gardien de phare te tend un petit fanal vert : « Si tu veux passer en paix, allume-le à la tombée de la nuit. » Le Syndicat des Phares contrôle les routes de nuit, et ne les partage pas gratuitement.',
    recur: 'Des gardiens de phare en uniforme discutent à voix basse d\'une cargaison sans papiers. Un d\'eux te lance : « Les phares sont à nous. Ce qui y passe aussi. »',
    sea: 'Un fanal vert s\'allume à l\'horizon, puis un autre, puis dix. Une flotte de petits navires rapides s\'approche : le Syndicat des Phares prélève son « péage de nuit ».',
    a1: 'Un vieux gardien te montre un phare éteint : « Le Syndicat éteint les phares des concurrents. Les navires s\'écrasent sur les récifs, et ils récupèrent les épaves. » Il te demande de l\'aide.', a2: 'Tu suis un convoi du Syndicat jusqu\'à sa cachette. Des épaves empilées témoignent de décennies de naufrages provoqués.', a3: 'Madame Lanterne t\'attend au sommet du plus haut phare, un fanal doré à la main. « Je guide les navires. Je sais aussi les égarer. À toi de voir si tu veux être guidé. »',
    reward: { ship: { mod: 'vigie' }, berrys: S => S.tierPrime() * 1.5 }, hl: 'a éteint le Syndicat des Phares' },
  { g: 'grise', minTier: 1, kind: 'naval', boss: 'le commodore Hale, dit « le Déserteur »',
    intro: 'Un navire gris, pavillon de la Marine raturé, mouille au large. Des hommes en uniformes sans insignes patrouillent le port : la Flotte Grise, d\'anciens Marines qui ont tourné le dos à la hiérarchie, et vivent de racket. Un caporal gris te toise : « La Marine n\'est plus ce qu\'elle était. Nous non plus. »',
    recur: 'Des déserteurs en uniformes sans insignes se plaignent de la solde, de l\'honneur, de l\'amiral qui les a vendus. Ils te regardent comme un possible recrue... ou une possible victime.',
    sea: 'Une frégate grise, aux canons orientés vers toi, te hèle d\'une voix qui sent la caserne : « Arrêt ! Contrôle de la Flotte Grise ! Montrez vos papiers ou vos coffres. »',
    a1: 'Un ancien officier de la Flotte Grise, rongé de remords, te demande de l\'aide : le commodore Hale est prêt à vendre des informations de la Marine à un Empereur.', a2: 'Tu surprends un échange secret : un émissaire de l\'Empereur, un coffre d\'or, des plans de patrouille. Si ça fuite, la Marine perd tout un secteur.', a3: 'Le commodore Hale te fait face, sabre au clair. « Ils m\'ont abandonné. J\'ai juste décidé de me vendre au plus offrant. »',
    reward: { glory: 6, merit: 10, berrys: S => S.tierPrime() }, hl: 'a abattu la Flotte Grise' },
  { g: 'fils', minTier: 2, kind: 'land', boss: 'frère Gaspard, l\'inquisiteur des Fils de Mary',
    intro: 'Des hommes en armure blanche, une croix dorée sur la poitrine, patrouillent les ruelles de la Terre Sainte. Les Fils de Mary, une milice sacrée dévouée aux Dragons Célestes, traquent « les impurs ». L\'un d\'eux te barre la route : « Prouve ta foi, ou prouve ton innocence. »',
    recur: 'Des Fils de Mary affichent des avis de recherche : « Hérétiques, esclaves évadés, révolutionnaires. » Quand tu passes, ils t\'observent trop longtemps.',
    sea: 'Un navire blanc, voiles ornées de croix, bloque la route. Un prêtre guerrier hurle : « Les eaux de la Terre Sainte ne souffrent pas les impurs ! »',
    a1: 'Une esclave en fuite se glisse à bord de ton navire : les Fils de Mary la traquent. Elle te supplie de la cacher. Elle sait où sont les chaînes que les Dragons Célestes ne veulent pas qu\'on voie.', a2: 'Les Fils de Mary fouillent les quais, navire par navire. Un officier t\'interroge : il soupçonne quelque chose.', a3: 'Frère Gaspard se dresse sur le quai, une lourde masse bénite à la main. « Les Dragons Célestes ne se trompent pas. Ceux qui les défient se trompent. »',
    reward: { glory: 8, frel: { revo: 4, gov: -3 } }, hl: 'a brisé les Fils de Mary' },
];

for (const c of CFG) {
  const g = c.g, gr = GROUPS[g], name = gr.name;
  const terr = S => (gr.terr[S.era] || []).includes(S.loc);
  const flagMet = 'of_met_' + g, arc = 'of_' + g, flagDown = 'of_down_' + g;
  ORIG_ARCS[arc] = { name: `Contre ${name}`, stages: 3 };
  const rare = ['corbeaux', 'rhon', 'recif'].includes(g), K = rare ? 0.9 : 3;   // les factions inventées ne doivent pas écraser les personnages canon
  const kind = c.kind, battleSkill = kind === 'naval' ? 'naval' : 'combat';
  const lose = { x: `La bataille est perdue. ${name} te laisse la vie sauve, mais ne l'oubliera pas.`, e: { hp: -30, shipHp: kind === 'naval' ? -40 : 0, frel: { [g]: 1 }, arc: A(arc, 3), flag2: 'of_over_' + g } };
  // 1. première rencontre
  ORIG_EVENTS.push({
    id: `of_first_${g}`, once: true, emoji: gr.emoji, title: name,
    w: { minTier: c.minTier, weight: Math.round(10 * K), test: S => terr(S) },
    x: c.intro,
    ch: [
      { t: 'Infiltrer leurs rangs', s: 'intel', d: 2,
        ok: { x: 'Tu te fonds dans leurs habitudes. Tu apprends leurs usages, leurs chefs et leurs failles.', e: { stats: { intel: 1 }, frel: { [g]: -1 }, flag: flagMet, flag2: flagMet + '_inf' } },
        ko: { x: 'On te démasque à la seconde étape. Tu t\'en sors avec quelques bleus et une mauvaise réputation.', e: { hp: -20, frel: { [g]: -2 }, flag: flagMet } } },
      { t: 'Les affronter', s: battleSkill, d: 3,
        ok: { x: 'Tu mets en déroute leurs éclaireurs. Ils savent désormais ton nom.', e: { glory: 3, frel: { [g]: -4 }, flag: flagMet } },
        ko: { x: 'Ils étaient plus nombreux. Tu te replies, blessé et humilié.', e: { hp: -30, shipHp: kind === 'naval' ? -25 : 0, frel: { [g]: -2 }, flag: flagMet } } },
      { t: 'Acheter la paix', c: S => S.tierPrime() / 6, r: { x: 'Tu verses un « droit de passage ». Ils prennent l\'argent et te laissent en paix. Pour l\'instant.', e: { frel: { [g]: 2 }, flag: flagMet } } },
    ],
  });
  // 2. présence récurrente en territoire
  ORIG_EVENTS.push({
    id: `of_recur_${g}`, emoji: gr.emoji, title: `${name} : sur leurs terres`,
    w: { minTier: c.minTier, weight: Math.max(1, Math.round(5 * K)), test: S => terr(S) && S.hasFlag(flagMet) },
    x: c.recur,
    ch: [
      { t: 'Leur tenir tête', s: battleSkill, d: 2,
        ok: { x: 'Ils battent en retraite. Les habitants te remercient discrètement.', e: { glory: 2, rep: 3, frel: { [g]: -2 } } },
        ko: { x: 'Ils te corrigent proprement. Tu paies pour ta fierté.', e: { hp: -22, frel: { [g]: -1 }, berrys: S => -S.tierPrime() / 10 } } },
      { t: 'Payer et éviter les ennuis', c: S => S.tierPrime() / 10, r: { x: 'On t\'adresse un signe de tête. Tu passes sans difficulté.', e: { frel: { [g]: 1 } } } },
      { t: 'Écouter leurs rumeurs', s: 'intel', d: 1,
        ok: { x: 'Tu glanes un renseignement précieux sur leurs mouvements.', e: { stats: { intel: 1 }, morale: 4 } },
        ko: { x: 'Rien d\'intéressant. On te remarque.', e: { frel: { [g]: -1 } } } },
    ],
  });
  // 3. rencontre en mer
  ORIG_EVENTS.push({
    id: `of_sea_${g}`, emoji: gr.emoji, title: `${name} en mer`,
    w: { ctx: 'sea', minTier: c.minTier, weight: Math.max(1, Math.round(3 * K)), test: S => S.ship.hp > 0 },
    x: c.sea,
    ch: [
      { t: 'Livrer combat', s: 'naval', d: 3,
        ok: { x: 'Leurs coques cèdent sous tes bordées. Ils abandonnent leur butin à la dérive.', e: { glory: 3, berrys: S => S.tierPrime() / 2, shipHp: -15, frel: { [g]: -3 } } },
        ko: { x: 'Leur tactique te surprend. Tu perds du temps, du bois et de la fierté.', e: { shipHp: -40, morale: -8, frel: { [g]: -1 } } } },
      { t: 'Leur échapper', s: 'navigation', d: 2,
        ok: { x: 'Tu les sèmes dans un chenal.', e: {} },
        ko: { x: 'Ils te rattrapent et te taxent.', e: { berrys: S => -S.tierPrime() / 8, shipHp: -15 } } },
      { t: 'Négocier', s: 'charisme', d: 3,
        ok: { x: 'Ils te laissent passer en échange d\'une information.', e: { frel: { [g]: 1 } } },
        ko: { x: 'Ils rient et te rackettent.', e: { berrys: S => -S.tierPrime() / 6 } } },
    ],
  });
  // 4. trame en 3 actes
  ORIG_EVENTS.push({
    id: `of_arc1_${g}`, pri: 9, emoji: gr.emoji, title: `Contre ${name} (1/3)`,
    w: { minTier: c.minTier, test: S => S.hasFlag(flagMet) && S.arc(arc, 0, 2) && !S.hasFlag('of_over_' + g) },
    x: c.a1,
    ch: [
      { t: 'S\'engager dans l\'affaire', r: { x: 'Tu acceptes. Ce qui commence comme un service devient une cause.', e: { arc: A(arc, 1), morale: 5 } } },
      { t: 'Négocier un tarif d\'abord', s: 'charisme', d: 2,
        ok: { x: 'On t\'offre une avance, et ta cause en est d\'autant plus nette.', e: { arc: A(arc, 1), berrys: S => S.tierPrime() / 4 } },
        ko: { x: 'Tu froisses ton interlocuteur. Il reste volontaire, mais froid.', e: { arc: A(arc, 1), morale: -3 } } },
      { t: 'Passer ton chemin', r: { x: 'Tu hausses les épaules. Les histoires des autres ne sont pas les tiennes.', e: { arc: A(arc, 3), flag2: 'of_over_' + g } } },
    ],
  });
  ORIG_EVENTS.push({
    id: `of_arc2_${g}`, pri: 10, emoji: gr.emoji, title: `Contre ${name} (2/3)`,
    w: { minTier: c.minTier, test: S => S.arc(arc, 1, 2) },
    x: c.a2,
    ch: [
      { t: 'Observer et rassembler des preuves', s: 'intel', d: 3,
        ok: { x: 'Tu acquiers un avantage décisif pour la suite.', e: { arc: A(arc, 2), flag: 'of_adv_' + g, stats: { intel: 1 } } },
        ko: { x: 'Tu es repéré, mais tu fuis avec l\'essentiel.', e: { arc: A(arc, 2), hp: -20 } } },
      { t: 'Frapper les avant-postes', s: battleSkill, d: 3,
        ok: { x: 'Tu fais tomber un avant-poste et affaiblis leur ligne.', e: { arc: A(arc, 2), flag: 'of_adv_' + g, glory: 3, frel: { [g]: -4 } } },
        ko: { x: 'Tu essuies de lourdes pertes.', e: { arc: A(arc, 2), hp: -30, shipHp: kind === 'naval' ? -30 : 0 } } },
      { t: 'Recruter des alliés locaux', s: 'charisme', d: 3,
        ok: { x: 'Des gens du coin se joignent à toi, motivés par leurs propres rancunes.', e: { arc: A(arc, 2), flag: 'of_adv_' + g, fleet: { name: 'Volontaires locaux', power: 3 } } },
        ko: { x: 'On te promet du soutien… qui ne viendra pas.', e: { arc: A(arc, 2), morale: -5 } } },
    ],
  });
  ORIG_EVENTS.push({
    id: `of_arc3_${g}`, pri: 10, emoji: gr.emoji, title: `Contre ${name} (3/3)`,
    w: { minTier: c.minTier, test: S => S.arc(arc, 2, 2) },
    x: S => `${c.a3} ${S.hasFlag('of_adv_' + g) ? 'Tu as de l\'avance sur lui, et il le sent.' : ''}`,
    ch: [
      { t: `Affronter ${c.boss.split(',')[0]} (bataille tactique)`, r: { x: 'Les lignes se forment. C\'est le moment.', e: { battle: { evId: `of_boss_${g}`, ci: 0, kind, d: 3, foe: name, ally: 0 }, arc: A(arc, 3), flag2: 'of_over_' + g } } },
      { t: 'Le provoquer en duel singulier', s: 'combat', d: 5,
        ok: { x: `Tu terrasses ${c.boss.split(',')[0]}. Sa troupe se disperse, sans chef.`, e: { arc: A(arc, 3), flag2: 'of_over_' + g, flag: flagDown, glory: 8, rep: 6, frel: { [g]: -6 }, hl: c.hl, ...c.reward } },
        ko: { x: 'Il te met à terre. Tu survis de justesse, au prix de ta réputation.', e: { arc: A(arc, 3), flag2: 'of_over_' + g, hp: -45, morale: -10 } } },
      { t: 'Lui proposer un marché', s: 'charisme', d: 5,
        ok: { x: 'Il accepte de se retirer, moyennant un tribut. Tu repars avec un accord fragile.', e: { arc: A(arc, 3), flag2: 'of_over_' + g, berrys: S => S.tierPrime(), frel: { [g]: 4 } } },
        ko: { x: 'Il refuse, ricane et te laisse partir avec une humiliation.', e: { arc: A(arc, 3), flag2: 'of_over_' + g, morale: -8 } } },
    ],
  });
  ORIG_EVENTS.push({
    id: `of_boss_${g}`, w: { weight: 0, test: () => false }, emoji: gr.emoji, title: `Contre ${name}`,
    ch: [{ t: 'Bataille', s: battleSkill, d: 3,
      ok: { x: `${c.boss.charAt(0).toUpperCase() + c.boss.slice(1)} s'effondre. ${name} se disperse, sans chef.`, e: { glory: 8, rep: 6, frel: { [g]: -6 }, flag: flagDown, hl: c.hl, ...c.reward } },
      ko: lose }],
  });
}
