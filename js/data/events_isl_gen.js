// Trames locales pour les îles issues du wiki : une situation d'arrivée construite sur la description de l'île
// (selon son type : ville, village, désert, montagne...), puis des suites quelques escales plus tard.
import { ISLANDS } from './islands.js';

const hash = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const A = (id, stage) => ({ id, stage });
const firstSentence = d => { const m = (d || '').replace(/\s+/g, ' ').match(/^(.{40,260}?[.!])(\s|$)/); return m ? m[1] : (d || '').slice(0, 220); };

// type d'île → situations. Chaque situation : texte d'accroche + 3 choix (jet, succès, échec)
const KIT = {
  ville: [
    { hook: 'Le port est en effervescence : marchands, mouchards et soldats se croisent dans les ruelles. Une affaire se prépare, et tout le monde a l\'air d\'en savoir plus que toi.',
      ch: [
        { t: 'Enquêter dans les bas-fonds', s: 'intel', d: 1, ok: 'Tu démêles le vrai du faux et tu mets la main sur un renseignement précieux.', ko: 'On t\'a repéré : on te dépouille d\'un peu de ta bourse.', g: { berrys: S => S.tierPrime() / 3, stats: { intel: 1 } }, b: { berrys: S => -S.tierPrime() / 6 } },
        { t: 'Proposer tes services à un notable', s: 'charisme', d: 1, ok: 'Le notable te confie une tâche bien payée et te recommande à d\'autres.', ko: 'Il te regarde de haut : tu n\'es pas de la bonne société.', g: { berrys: S => S.tierPrime() / 2, rep: 3 }, b: { morale: -4 } },
        { t: 'Régler ça à la force', s: 'combat', d: 2, ok: 'Quelques coups bien placés et la ville te regarde autrement.', ko: 'La garde locale t\'attend à la sortie.', g: { glory: 3, rep: 2 }, b: { hp: -20, rep: -2 } },
      ] },
    { hook: 'Une rumeur circule : un trésor de contrebande est caché quelque part dans la ville, et plusieurs bandes s\'apprêtent à le chercher.',
      ch: [
        { t: 'Suivre les indices en solitaire', s: 'intel', d: 2, ok: 'Tu découvres la cache avant les autres. Une partie du butin est à toi.', ko: 'Tu tombes sur une bande rivale, qui n\'apprécie pas ta curiosité.', g: { berrys: S => S.tierPrime() * 0.8, glory: 1 }, b: { hp: -18 } },
        { t: 'T\'allier à une bande locale', s: 'charisme', d: 2, ok: 'Vous partagez le butin et les risques. Tu repars avec de nouveaux contacts.', ko: 'Ils te trahissent à la dernière minute.', g: { berrys: S => S.tierPrime() / 2, rep: 2 }, b: { berrys: S => -S.tierPrime() / 6 } },
        { t: 'Ignorer la rumeur et travailler au port', r: { x: 'Un travail honnête, sans histoires. Ta bourse s\'en ressent, ton dos aussi.', e: { berrys: S => S.tierPrime() / 8, morale: 3 } } },
      ] },
  ],
  village: [
    { hook: 'Le village est paisible en apparence, mais les habitants parlent à voix basse et évitent de regarder vers la colline. Un étranger comme toi est toujours observé.',
      ch: [
        { t: 'Gagner la confiance des villageois', s: 'charisme', d: 0, ok: 'Au bout d\'une heure, on t\'offre un repas et une histoire : un danger menace le village.', ko: 'Les portes restent closes.', g: { hp: 25, morale: 8, rep: 3 }, b: { morale: -3 } },
        { t: 'Monter inspecter la colline', s: 'vitesse', d: 1, ok: 'Tu surprends des pillards en train de rôder. Ils décampent à ton approche.', ko: 'Tu tombes dans une embuscade et t\'en tires de justesse.', g: { glory: 2, rep: 4 }, b: { hp: -18 } },
        { t: 'Proposer ton aide contre un peu d\'argent', s: 'force', d: 1, ok: 'Tu fais le travail de trois hommes. Les villageois t\'en sont reconnaissants.', ko: 'Tu casses plus que tu ne répares.', g: { berrys: S => S.tierPrime() / 4, rep: 2 }, b: { berrys: S => -S.tierPrime() / 10 } },
      ] },
    { hook: 'C\'est jour de fête au village. Des danses, des tonneaux, des défis entre voisins. On te tend une chope sans te demander ton avis.',
      ch: [
        { t: 'Participer au concours de force', s: 'force', d: 1, ok: 'Tu remportes le concours et l\'admiration de tous.', ko: 'Tu perds contre un forgeron de soixante ans. Les enfants se moquent.', g: { glory: 2, morale: 10 }, b: { morale: -6 } },
        { t: 'Danser et chanter', s: 'charisme', d: 0, ok: 'Le village chante ton nom jusqu\'à l\'aube.', ko: 'Tu marches sur trois pieds. On rit, gentiment.', g: { morale: 12, rep: 3 }, b: { morale: 2 } },
        { t: 'Parler aux anciens', s: 'intel', d: 1, ok: 'Un ancien te confie une légende locale qui aiguise ta compréhension du monde.', ko: 'Ils radotent. Tu t\'endors.', g: { stats: { intel: 1 }, morale: 4 }, b: {} },
      ] },
  ],
  desert: [
    { hook: 'Le sable s\'étend à perte de vue, le soleil écrase la plaine. Les puits sont rares, les mirages nombreux, et les bandits connaissent chaque dune.',
      ch: [
        { t: 'Traverser de nuit, à l\'étoile', s: 'navigation', d: 1, ok: 'Tu atteins l\'oasis avec une gourde encore à moitié pleine.', ko: 'Tu tournes en rond. Le soleil te cuit.', g: { hp: 20, stats: { navigation: 1 } }, b: { hp: -25 } },
        { t: 'Chercher un guide local', s: 'charisme', d: 1, ok: 'Un nomade accepte de te guider, contre un peu de ta réputation.', ko: 'Les guides se méfient des étrangers.', g: { rep: 3, morale: 6 }, b: { morale: -5 } },
        { t: 'Piller un convoi de caravaniers', s: 'combat', d: 3, ok: 'Tu les surprends à la tombée du jour. Leurs réserves sont à toi.', ko: 'Les caravaniers étaient mieux armés que prévu.', g: { berrys: S => S.tierPrime() * 0.8, rep: -3 }, b: { hp: -30 } },
      ] },
  ],
  montagne: [
    { hook: 'Les pentes sont abruptes, la brume avale les sentiers. Des cloches lointaines indiquent qu\'une communauté vit là-haut, et ne reçoit pas souvent.',
      ch: [
        { t: 'Escalader la voie directe', s: 'force', d: 2, ok: 'Tu atteins le sommet avant la nuit. Le panorama vaut le détour, et tu y trouves un abri.', ko: 'Une pierre cède sous ton pied.', g: { stats: { force: 1 }, morale: 8 }, b: { hp: -22 } },
        { t: 'Emprunter le sentier des pèlerins', s: 'volonte', d: 1, ok: 'La marche te fait du bien. Les moines te donnent le gîte.', ko: 'Le froid te saisit.', g: { hp: 30, stats: { volonte: 1 } }, b: { hp: -12 } },
        { t: 'Interroger les marchands de passage', s: 'intel', d: 1, ok: 'Ils te vendent un renseignement utile contre quelques berrys.', ko: 'Ils t\'ont vendu une fausse carte.', g: { stats: { intel: 1 } }, b: { berrys: S => -S.tierPrime() / 8 } },
      ] },
  ],
  ciel: [
    { hook: 'Ici, tout flotte : les nuages font office de sol, de mer et de monnaie. Les habitants te regardent comme un étranger tombé du ciel — ce que tu es, en un sens.',
      ch: [
        { t: 'Apprendre les coutumes locales', s: 'intel', d: 1, ok: 'On t\'accueille en invité d\'honneur. Quelques conseils sur les courants d\'air te seront utiles.', ko: 'Tu commets une gaffe. On te le fait payer.', g: { stats: { navigation: 1 }, morale: 8 }, b: { berrys: S => -S.tierPrime() / 8 } },
        { t: 'Participer à une course de vagues', s: 'vitesse', d: 2, ok: 'Tu glisses sur les nuages comme sur l\'eau. La foule applaudit.', ko: 'Tu tombes entre deux nuages. Heureusement, ils amortissent.', g: { glory: 2, stats: { vitesse: 1 } }, b: { hp: -15 } },
        { t: 'Marchander tes marchandises', s: 'charisme', d: 1, ok: 'Les coquillages et les dials se vendent bien ici.', ko: 'Les prix sont absurdes.', g: { berrys: S => S.tierPrime() / 3 }, b: { berrys: S => -S.tierPrime() / 10 } },
      ] },
  ],
  ruines: [
    { hook: 'Des colonnes brisées, des pierres couvertes de lierre : une civilisation oubliée a laissé sa trace. Quelque chose bouge dans l\'ombre des ruines.',
      ch: [
        { t: 'Explorer méthodiquement', s: 'intel', d: 2, ok: 'Tu retrouves une chambre scellée et en rapportes des objets de valeur.', ko: 'Un piège se referme sur toi.', g: { berrys: S => S.tierPrime() / 2, stats: { intel: 1 } }, b: { hp: -25 } },
        { t: 'Affronter ce qui rôde', s: 'combat', d: 3, ok: 'Tu mets en fuite la créature : elle gardait un petit trésor.', ko: 'La créature était plus forte que prévu.', g: { glory: 3, berrys: S => S.tierPrime() / 3 }, b: { hp: -30 } },
        { t: 'Ne pas s\'y attarder', r: { x: 'Tu ne trouves ni gloire ni ennui. Tu repars, intrigué.', e: {} } },
      ] },
  ],
  neige: [
    { hook: 'Le froid est mordant, la neige tombe à gros flocons. Des traces fraîches mènent vers une cabane dont la cheminée fume encore.',
      ch: [
        { t: 'Suivre les traces', s: 'vitesse', d: 1, ok: 'Tu trouves un chasseur en difficulté. Il te remercie en te soignant.', ko: 'Tu perds les traces. Le froid te ronge.', g: { hp: 35, morale: 6 }, b: { hp: -20 } },
        { t: 'Chercher un abri et attendre', s: 'volonte', d: 1, ok: 'Tu tiens bon. La tempête passe, et ta résistance se renforce.', ko: 'La nuit est longue.', g: { stats: { volonte: 1 } }, b: { hp: -12 } },
        { t: 'Troquer tes provisions contre de la fourrure', s: 'charisme', d: 1, ok: 'Un marché honnête : tu repars bien équipé.', ko: 'On te vend une fourrure déchirée.', g: { hp: 20, berrys: S => -S.tierPrime() / 12 }, b: { berrys: S => -S.tierPrime() / 8 } },
      ] },
  ],
  volcan: [
    { hook: 'La terre tremble, une fumée soufrée s\'élève du cratère. Les habitants vivent ici depuis toujours, et disent que la montagne parle.',
      ch: [
        { t: 'Escalader jusqu\'au cratère', s: 'volonte', d: 3, ok: 'Tu rapportes une pierre de lave rare. Un forgeron en offrira un bon prix.', ko: 'La chaleur te terrasse.', g: { berrys: S => S.tierPrime() / 2, stats: { volonte: 1 } }, b: { hp: -28 } },
        { t: 'Aider à évacuer un village', s: 'force', d: 1, ok: 'Tu sauves des familles entières. On te couvrira de cadeaux.', ko: 'Un éboulement te surprend.', g: { rep: 6, berrys: S => S.tierPrime() / 4 }, b: { hp: -20 } },
        { t: 'Étudier les phénomènes', s: 'intel', d: 2, ok: 'Tu comprends le cycle de l\'éruption. Les habitants te remercient.', ko: 'Trop de fumée pour travailler.', g: { stats: { intel: 1 }, rep: 3 }, b: { hp: -10 } },
      ] },
  ],
  futur: [
    { hook: 'Des machines étranges ronronnent dans les rues : cette île est en avance de plusieurs siècles. Les habitants sont curieux, un peu inquiets, et très bavards.',
      ch: [
        { t: 'Visiter les laboratoires', s: 'intel', d: 2, ok: 'Une invention t\'est offerte : elle améliorera ton navire.', ko: 'Une machine s\'emballe.', g: { ship: { mod: 'random' }, stats: { intel: 1 } }, b: { hp: -18 } },
        { t: 'Proposer un échange de bons procédés', s: 'charisme', d: 2, ok: 'Ils te donnent du matériel contre un service rendu.', ko: 'Ils te demandent plus que tu ne peux offrir.', g: { shipHp: 80, berrys: S => S.tierPrime() / 4 }, b: {} },
        { t: 'Ne toucher à rien', r: { x: 'Tu admires de loin. Parfois, mieux vaut ne pas comprendre.', e: { morale: 3 } } },
      ] },
  ],
};
KIT.japon = KIT.village; KIT.default = KIT.village;

const fx = (g, base = {}) => ({ ...base, ...g });
function build(isl) {
  const kit = KIT[isl.th?.k] || KIT.default;
  const sit = kit[hash(isl.id) % kit.length];
  const intro = firstSentence(isl.desc);
  const id = 'isl_' + isl.id;
  const flagOf = i => `${id}_c${i}`;
  return {
    id, pri: 9, emoji: isl.emoji || '📍', title: isl.name,
    w: { isl: [isl.id] },
    x: `${intro} ${sit.hook}`,
    ch: sit.ch.map((c, i) => c.r
      ? { t: c.t, r: { x: c.r.x, e: { ...c.r.e, flag: flagOf(i) + 'k', arc: A(id, 1) } } }
      : { t: c.t, s: c.s, d: c.d,
          ok: { x: c.ok, e: { ...c.g, flag: flagOf(i) + 'g', arc: A(id, 1) } },
          ko: { x: c.ko, e: { ...c.b, flag: flagOf(i) + 'b', arc: A(id, 1) } } }),
  };
}
const follow = isl => {
  const id = 'isl_' + isl.id;
  const good = S => [0, 1, 2].some(i => S.hasFlag(`${id}_c${i}g`));
  return {
    id: id + '_2', pri: 9, emoji: isl.emoji || '📍', title: `Des nouvelles de ${isl.name}`,
    w: { test: S => S.arc(id, 1, 2) },
    x: S => good(S)
      ? `Quelques jours après ton passage à ${isl.name}, un messager te rattrape : ton coup de main a fait parler de toi, et quelqu\'un souhaite te remercier à sa façon.`
      : `Quelques jours après ton passage à ${isl.name}, une rumeur te rattrape : tes mésaventures là-bas ont fait rire (ou grincer des dents) les mauvaises personnes.`,
    ch: [
      { t: 'Répondre à l\'appel', s: 'charisme', d: 1,
        ok: { x: S => good(S) ? 'On t\'accueille en héros. Un petit cadeau t\'attend, et une promesse de revoir ton navire à bon port.' : 'Tu rattrapes la situation avec tact : personne ne t\'en veut.', e: { berrys: S => S.tierPrime() / 3, rep: 3, arc: A(id, 2) } },
        ko: { x: 'Le message est arrivé trop tard. L\'occasion est passée.', e: { arc: A(id, 2) } } },
      { t: 'Ignorer', r: { x: 'Tu hausses les épaules. Les rumeurs finissent toujours par se tasser.', e: { arc: A(id, 2) } } },
    ],
  };
};

export const ISL_GEN_EVENTS = [];
for (const isl of Object.values(ISLANDS)) {
  if (!isl.generated || isl.noNav) continue;
  ISL_GEN_EVENTS.push(build(isl), follow(isl));
}
