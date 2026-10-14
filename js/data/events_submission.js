// Soumission et dépendance : sous l'aile d'un Empereur on est à sa merci ; en Corsaire on a des passe-droits
// mais le Gouvernement et la Marine tiennent ta laisse. Le « mérite » mesure ta faveur auprès de ton protecteur.
import { GROUPS } from './groups.js';

const vas = S => S.hero.faction === 'vassal';
const cor = S => S.hero.faction === 'corsaire';

export const SUBMISSION_EVENTS = [];

// ═══════════════ SOUS UN EMPEREUR ═══════════════
SUBMISSION_EVENTS.push(
  { id: 'sm_tribute', pri: 9, cd: 'smT', emoji: '💰', title: 'Le tribut', repeat: true,
    w: { fac: ['vassal'], weight: 9, test: S => S.turn - (S.tribT ?? -9) >= 4 && S.turn - (S.smT ?? -9) >= 2 },
    x: S => `Un collecteur de ${S.yonkoName()} t'attend sur le quai, un registre sous le bras. « Part de l'Empereur. Un tiers de tes gains. Les arriérés aussi. »`,
    ch: [
      { t: 'Payer sans discuter', r: { x: 'Tu vides une partie de ta bourse. Le collecteur note ton nom en face de « bon élément ».', e: { stamp: 'tribT', berrys: S => -Math.round(S.hero.berrys / 3), merit: 4 } } },
      { t: 'Négocier un rabais', s: 'charisme', d: 3,
        ok: { x: 'Il consent à une remise, en échange d\'un service que tu lui devras plus tard.', e: { stamp: 'tribT', berrys: S => -Math.round(S.hero.berrys / 6), merit: 1 } },
        ko: { x: 'Il rit : « Tu veux que je rapporte que tu marchandes avec l\'Empereur ? » Tu paies double.', e: { stamp: 'tribT', berrys: S => -Math.round(S.hero.berrys / 2), merit: -3 } } },
      { t: 'Refuser de payer', s: 'combat', d: 5,
        ok: { x: 'Tu mets les collecteurs en déroute. Mais l\'Empereur n\'oublie jamais.', e: { stamp: 'tribT', glory: 3, merit: -10, flag: 'yonko_snub' } },
        ko: { x: 'Les hommes de l\'Empereur te punissent. Ils prennent la moitié de ta bourse en plus.', e: { stamp: 'tribT', hp: -30, berrys: S => -Math.round(S.hero.berrys / 2), merit: -8 } } },
    ] },
  { id: 'sm_whim', pri: 9, cd: 'smT', emoji: '👑', title: 'Le caprice de l\'Empereur', repeat: true,
    w: { fac: ['vassal'], weight: 7, test: S => S.turn - (S.whimT ?? -9) >= 5 && S.turn - (S.smT ?? -9) >= 2 },
    x: S => `${S.yonkoName()} te reçoit à bord de son navire amiral, une jambe sur l'accoudoir. « J'ai un caprice. Je veux quelque chose qui est à toi. » Il sourit. Ce n'est pas une question.`,
    ch: [
      { t: 'Offrir un de tes hommes', r: { x: 'Il te regarde longuement, puis désigne un de tes équipiers. L\'homme baisse les yeux et te suit du regard. L\'Empereur est content.', e: { stamp: 'whimT', crewLoss: 'lowloyal', merit: 8, loyalty: -8 } } },
      { t: 'Offrir la moitié de ta bourse', r: { x: 'Il compte, soupèse, jette. « Mmh. Ça ira. » Tu respires.', e: { stamp: 'whimT', berrysMul: 0.5, merit: 5 } } },
      { t: 'Lui rire au nez (avec respect)', s: 'charisme', d: 5,
        ok: { x: 'Il éclate de rire. « Un vassal qui a de l\'humour ! Je t\'aime bien. » Il oublie son caprice, et t\'offre même un verre.', e: { stamp: 'whimT', merit: 6, morale: 8 } },
        ko: { x: 'Le rire de l\'Empereur se fige. Ses gardes te traînent sur le pont : l\'humiliation est publique.', e: { stamp: 'whimT', hp: -30, merit: -8, morale: -15 } } },
    ] },
  { id: 'sm_test', pri: 9, cd: 'smT', emoji: '🗡️', title: 'Épreuve de loyauté', repeat: true,
    w: { fac: ['vassal'], weight: 6, test: S => S.turn - (S.testT ?? -9) >= 6 && S.merit < 30 && S.turn - (S.smT ?? -9) >= 2 },
    x: S => `Une rumeur court : l'un de tes équipiers aurait parlé à un ennemi de ${S.yonkoName()}. On te convoque. « Prouve que tu n'es pas de ceux-là. » Les yeux de l'Empereur ne quittent pas ta nuque.`,
    ch: [
      { t: 'Livrer le coupable, quel qu\'il soit', r: { x: 'Tu désignes un de tes hommes. L\'Empereur hoche la tête. Tu auras sa confiance, mais ton équipage te regarde autrement.', e: { stamp: 'testT', crewLoss: 'lowloyal', merit: 10, loyalty: -10 } } },
      { t: 'Démontrer ton innocence', s: 'intel', d: 3,
        ok: { x: 'Tu présentes des preuves. L\'affaire est classée, et le véritable espion est démasqué.', e: { stamp: 'testT', merit: 8, glory: 2 } },
        ko: { x: 'Tes preuves sont jugées insuffisantes. Tu paies pour tout le monde.', e: { stamp: 'testT', hp: -35, merit: -6, loyalty: -5 } } },
      { t: 'Défendre ton équipage', s: 'volonte', d: 4,
        ok: { x: 'Ton courage plaît à l\'Empereur : il t\'écoute, et finit par t\'approuver.', e: { stamp: 'testT', merit: 5, loyalty: 12 } },
        ko: { x: 'Il y voit de l\'insolence.', e: { stamp: 'testT', hp: -25, merit: -8 } } },
    ] },
  { id: 'sm_front', pri: 9, cd: 'smT', emoji: '🔥', title: 'En première ligne', repeat: true,
    w: { fac: ['vassal'], weight: 7, test: S => S.turn - (S.frontT ?? -9) >= 6 && S.ship.hp > 0 && S.turn - (S.smT ?? -9) >= 2 },
    x: S => `${S.yonkoName()} t'envoie sa flotte la plus faible et un ordre : « Tu iras en tête. Tu mourras peut-être. C'est le prix d'un drapeau. » Une bataille se prépare, et tu es la chair à canon.`,
    ch: [
      { t: 'Obéir : mener la première ligne', r: { x: 'Tu hisses le pavillon et fonces. L\'Empereur regarde de loin.', e: { stamp: 'frontT', battle: { evId: 'sm_front_battle', ci: 0, kind: 'naval', d: 3, foe: 'les ennemis de ton Empereur' } } } },
      { t: 'Se faire remplacer en payant', c: S => S.tierPrime() / 3, r: { x: 'Un commandant prend ta place pour une jolie somme. L\'Empereur hausse un sourcil.', e: { stamp: 'frontT', merit: -3 } } },
      { t: 'Proposer un autre plan', s: 'intel', d: 4,
        ok: { x: 'Tu convaincs l\'état-major de te laisser flanquer. On te laisse les honneurs, sans la boucherie.', e: { stamp: 'frontT', merit: 6, glory: 2 } },
        ko: { x: 'Le plan est rejeté. Tu passes quand même en première ligne.', e: { stamp: 'frontT', shipHp: -40, morale: -8 } } },
    ] },
  { id: 'sm_front_battle', emoji: '🔥', title: 'En première ligne', w: { weight: 0, test: () => false },
    ch: [{ t: 'Bataille', s: 'naval', d: 3,
      ok: { x: 'Tu tiens la ligne. La flotte de l\'Empereur passe derrière toi et écrase l\'adversaire. Ton nom revient dans la bouche de ses officiers.', e: { glory: 6, merit: 12, berrys: S => S.tierPrime() / 2 } },
      ko: { x: 'Tu es écrasé, mais tu as tenu assez longtemps. L\'Empereur te laisse la vie sauve, avec mépris.', e: { merit: 2, shipHp: -30, morale: -10 } } }] },
  { id: 'sm_reward', emoji: '🍷', title: 'À la table de l\'Empereur', repeat: true,
    w: { fac: ['vassal'], weight: 8, test: S => S.merit >= 30 && S.turn - (S.rewT ?? -9) >= 6 },
    x: S => `Tes services ont été remarqués. ${S.yonkoName()} t'invite à sa table et te fait asseoir à sa droite. « Un fidèle mérite d'être récompensé. Choisis. »`,
    ch: [
      { t: 'Demander un fruit du démon', r: { x: 'Il fait un geste. On t\'apporte un coffre : un fruit, scellé.', e: { stamp: 'rewT', fruit: 'random3', merit: -10 } } },
      { t: 'Demander des navires', r: { x: 'Il te prête une escadre. Elle est à lui, bien sûr, mais elle est sous tes ordres.', e: { stamp: 'rewT', fleet: { name: 'Escadre prêtée', power: 7 }, merit: -8 } } },
      { t: 'Demander ta liberté', s: 'charisme', d: 8,
        ok: { x: 'Il te regarde longuement, puis sourit : « Va. Mais tu ne seras plus sous ma protection. » Tu pars libre, sans ennemi.', e: { stamp: 'rewT', faction: 'pirate', glory: 5, hl: 'a obtenu sa liberté de son Empereur' } },
        ko: { x: 'Il fronce les sourcils : « Ingrat. » Tu paies cette insolence.', e: { stamp: 'rewT', hp: -30, merit: -15 } } },
    ] },
);

// Ultimatums : soumets-toi ou disparais (en territoire d'Empereur, ou en mer face à sa flotte)
const YONKO_CFG = [
  { g: 'bigmom', era: 'pre', yo: 'bigmom', n: 'Big Mom', say: 'La Famille Charlotte te cerne. « Mama aime les gens qui apportent des gâteaux. Ou leur âme. Choisis. »' },
  { g: 'kaido', era: 'pre', yo: 'kaido', n: 'Kaido', say: 'Des hommes en armure t\'encerclent. « Les Cent Bêtes ne laissent personne passer sans permission. Rejoins-nous, ou on te démonte. »' },
  { g: 'wb', era: 'pre', yo: 'barbeblanche', n: 'Barbe Blanche', say: 'Un commandant de Barbe Blanche te barre la route. « Ici, c\'est le territoire de Papa. Tu veux faire partie de la famille ? Ça se mérite. »' },
  { g: 'shanks', era: 'pre', yo: 'shanks', n: 'le Roux', say: 'Un lieutenant du Roux te toise en souriant. « Le capitaine apprécie les pirates qui ont du cran. Tu as le choix : sous son drapeau, ou face à ses canons. »' },
  { g: 'teach', era: 'post', yo: 'teach', n: 'Barbe Noire', say: 'Les hommes de Barbe Noire rient autour de toi. « Zehahaha ! Le capitaine aime les fruits. Et les gens qui ont des fruits. Rejoins-nous, ou on te les prend. »' },
  { g: 'crossguild', era: 'post', yo: 'baggy', n: 'la Cross Guild', say: 'Un émissaire de la Cross Guild te tend un contrat. « Les primes sont un marché. Signe, et tu es protégé. Refuse, et tu es en vente. »' },
];
for (const c of YONKO_CFG) {
  const terr = S => (GROUPS[c.g].terr[c.era] || []).includes(S.loc);
  SUBMISSION_EVENTS.push({
    id: `sm_ultimatum_${c.g}`, emoji: GROUPS[c.g].emoji, title: `Ultimatum : ${c.n}`, once: true,
    w: { era: c.era, weight: 12, minTier: 2, test: S => terr(S) && !S.hero.yonko && S.hero.faction !== 'empereur' && S.camp === 'chercheur' },
    x: c.say,
    ch: [
      { t: `Se soumettre à ${c.n}`, r: { x: `Tu plies le genou. On te remet un pavillon, une liste de « services » et un rappel : à partir de maintenant, ta vie appartient à ${c.n}.`, e: { yonko: c.yo, berrys: S => -Math.round(S.hero.berrys / 4), merit: 3, hl: `s'est soumis à ${c.n}` } } },
      { t: 'Négocier des conditions', s: 'charisme', d: 5,
        ok: { x: `Tu obtiens un accord honorable : protection contre loyauté, sans tribut la première année.`, e: { yonko: c.yo, merit: 6, rep: 3, hl: `a négocié son allégeance à ${c.n}` } },
        ko: { x: 'Ils prennent ta fierté pour une insulte. On te remet à ta place à coups de poing, puis on te laisse choisir à nouveau.', e: { hp: -35, morale: -10 } } },
      { t: 'Refuser et se battre', s: 'combat', d: 6,
        ok: { x: 'Tu ouvres une brèche et sors du cercle. Ils ne t\'oublieront pas.', e: { glory: 5, frel: { [c.g]: -5 }, rep: 3 } },
        ko: { x: 'On te rosse, on te dépouille, on te traîne devant leur chef : la suite dépend de son humeur.', e: { hp: -50, berrysMul: 0.5, frel: { [c.g]: -3 }, morale: -12 } } },
    ],
  });
}
SUBMISSION_EVENTS.push({
  id: 'sm_fleet_summons', emoji: '🏴', title: 'Convoqué par une flotte', repeat: true,
  w: { ctx: 'sea', weight: 4, minTier: 3, test: S => !S.hero.yonko && S.hero.faction !== 'empereur' && S.camp === 'chercheur' && S.turn - (S.fsT ?? -9) >= 8 },
  x: S => `Une flotte de ${S.tmpYonko().name} te prend en chasse. Un porte-voix claque : « Tu navigues sur nos eaux. Tu as une minute pour te présenter ou être coulé. »`,
  ch: [
    { t: 'Hisser le pavillon blanc et obéir', r: { x: 'Tu suis la flotte jusqu\'à son navire amiral. Un homme en descend, te jauge, et te propose un marché que tu ne peux pas refuser.', e: { stamp: 'fsT', yonko: S => S.tmpYonko().id, berrys: S => -Math.round(S.hero.berrys / 5), merit: 2 } } },
    { t: 'Tenter de fuir', s: 'navigation', d: 6,
      ok: { x: 'Tu les sèmes dans un chenal. Ils n\'abandonneront pas, mais ils ne t\'ont pas.', e: { stamp: 'fsT', glory: 3 } },
      ko: { x: 'Leurs canons te touchent à la poupe. On te remorque.', e: { stamp: 'fsT', shipHp: -50, hp: -15, morale: -10, yonko: S => S.tmpYonko().id } } },
    { t: 'Négocier un passage', s: 'charisme', d: 5,
      ok: { x: 'Leur amiral te laisse passer contre un tribut modéré.', e: { stamp: 'fsT', berrys: S => -Math.round(S.hero.berrys / 8) } },
      ko: { x: 'Il rit : « Tu n\'as rien à offrir. » Les canons se chargent.', e: { stamp: 'fsT', shipHp: -35, hp: -15 } } },
  ],
});

// ═══════════════ CORSAIRE : PASSE-DROITS ET LAISSE ═══════════════
SUBMISSION_EVENTS.push(
  { id: 'cs_summons', pri: 9, cd: 'csgT', emoji: '📯', title: 'Ordre du Gouvernement', repeat: true,
    w: { fac: ['corsaire'], weight: 9, test: S => S.turn - (S.csT ?? -9) >= 4 && S.turn - (S.csgT ?? -9) >= 2 },
    x: 'Un messager en uniforme gris accoste. Il te tend un pli scellé à l\'effigie du Gouvernement. « Nous avons besoin de vos services, Corsaire. Un pirate à éliminer. Ce n\'est pas une demande. »',
    ch: [
      { t: 'Obéir et livrer la cible', s: 'combat', d: 4,
        ok: { x: 'Le pirate est livré. Le Gouvernement te remercie du bout des lèvres : ta licence est confirmée pour un temps.', e: { stamp: 'csT', merit: 8, berrys: S => S.tierPrime(), glory: 3, frel: { gov: 2, marine: 1 } } },
        ko: { x: 'Tu échoues. On te le fait comprendre : « Ne revenez pas les mains vides. »', e: { stamp: 'csT', hp: -30, merit: -6, frel: { gov: -1 } } } },
      { t: 'Négocier une contrepartie', s: 'charisme', d: 4,
        ok: { x: 'Tu obtiens des primes avancées et un sauf-conduit pour la prochaine escale.', e: { stamp: 'csT', berrys: S => S.tierPrime() / 2, merit: 2 } },
        ko: { x: 'On te rappelle qui tient la laisse : une retenue sur ta part.', e: { stamp: 'csT', berrys: S => -Math.round(S.hero.berrys / 5), merit: -4 } } },
      { t: 'Refuser', r: { x: 'Le messager prend note. « Votre dossier sera transmis aux Cinq Doyens. » Tu viens de te faire remarquer.', e: { stamp: 'csT', merit: -12, flag: 'cs_warned', frel: { gov: -3, marine: -2 } } } },
    ] },
  { id: 'cs_tax', pri: 9, cd: 'csgT', emoji: '🏦', title: 'La part du Gouvernement', repeat: true,
    w: { fac: ['corsaire'], weight: 7, test: S => S.turn - (S.ctT ?? -9) >= 5 && S.hero.berrys > 0 && S.turn - (S.csgT ?? -9) >= 2 },
    x: 'Un trésorier du Gouvernement t\'attend avec un registre : « Trente pour cent de vos prises, selon l\'accord corsaire. Vous les avez déclarées, n\'est-ce pas ? »',
    ch: [
      { t: 'Déclarer et payer', r: { x: 'Tu verses ta part. On t\'applaudit poliment. Tu as une licence, après tout.', e: { stamp: 'ctT', berrys: S => -Math.round(S.hero.berrys * 0.3), merit: 4 } } },
      { t: 'Dissimuler une partie', s: 'intel', d: 4,
        ok: { x: 'Le trésorier ne voit rien. Tu gardes l\'essentiel.', e: { stamp: 'ctT', berrys: S => -Math.round(S.hero.berrys * 0.1) } },
        ko: { x: 'Un contrôle surprise te surprend. Amende, et retrait de faveurs.', e: { stamp: 'ctT', berrys: S => -Math.round(S.hero.berrys * 0.5), merit: -8, flag: 'cs_warned' } } },
      { t: 'Contester le montant', s: 'charisme', d: 3,
        ok: { x: 'Tu obtiens une remise : l\'administration n\'aime pas les scènes publiques.', e: { stamp: 'ctT', berrys: S => -Math.round(S.hero.berrys * 0.2) } },
        ko: { x: 'On t\'inscrit sur une liste de « Corsaires à surveiller ».', e: { stamp: 'ctT', berrys: S => -Math.round(S.hero.berrys * 0.3), merit: -5, flag: 'cs_warned' } } },
    ] },
  { id: 'cs_privilege', emoji: '📜', title: 'Le sauf-conduit', repeat: true,
    w: { fac: ['corsaire'], weight: 7, test: S => S.turn - (S.cpT ?? -9) >= 5 },
    x: 'Un officier de la Marine reconnaît ta licence à la coupe de ton pavillon. Il salue du bout des doigts : « Corsaire. Je ne vous ai pas vu. Mon capitaine peut vous offrir un ravitaillement officiel, si vous le souhaitez. »',
    ch: [
      { t: 'Accepter le ravitaillement', r: { x: 'Tu repars les cales pleines et la coque réparée. C\'est ça, un passe-droit.', e: { stamp: 'cpT', hp: 999, shipHp: 999, morale: 12, berrys: S => S.tierPrime() / 4, frel: { marine: 1 } } } },
      { t: 'Demander à passer un blocus', s: 'charisme', d: 2,
        ok: { x: 'L\'officier fait lever la chaîne. Tu passes sans tirer un coup.', e: { stamp: 'cpT', glory: 2, morale: 8 } },
        ko: { x: 'L\'officier se raidit : « Pas aujourd\'hui, Corsaire. »', e: { stamp: 'cpT', morale: -4 } } },
      { t: 'Faire valoir tes droits de pillage', s: 'combat', d: 3,
        ok: { x: 'Tu pilles un repaire de pirates sous protection officielle : personne n\'ose rien dire.', e: { stamp: 'cpT', berrys: S => S.tierPrime(), glory: 3, frel: { pirates: -2 } } },
        ko: { x: 'Le repaire était mieux défendu. Tu rentres bredouille.', e: { stamp: 'cpT', hp: -25 } } },
    ] },
  { id: 'cs_leash', pri: 9, cd: 'csgT', emoji: '⚓', title: 'Convoqué à Marineford', repeat: true,
    w: { fac: ['corsaire'], weight: 6, test: S => S.turn - (S.clT ?? -9) >= 6 && S.turn - (S.csgT ?? -9) >= 2 },
    x: 'Un amiral t\'envoie un Den Den Mushi : « Votre présence est requise à Marineford. Pas de discussion. » Un Corsaire est libre, tant qu\'on ne lui rappelle pas qu\'il ne l\'est pas.',
    ch: [
      { t: 'Se présenter en personne', r: { x: 'Tu écoutes un long discours sur la « responsabilité des Corsaires ». On te remet une mission et des honneurs de façade.', e: { stamp: 'clT', merit: 6, morale: -8, frel: { marine: 2 } } } },
      { t: 'Envoyer un émissaire', s: 'charisme', d: 3,
        ok: { x: 'L\'émissaire fait bonne impression. L\'amiral se contente de ça.', e: { stamp: 'clT', merit: 2 } },
        ko: { x: 'L\'amiral prend ça pour un affront personnel.', e: { stamp: 'clT', merit: -8, frel: { marine: -2 }, flag: 'cs_warned' } } },
      { t: 'Ignorer l\'appel', r: { x: 'Tu raccroches. Quelque part, un amiral note ton nom sur une liste.', e: { stamp: 'clT', merit: -12, flag: 'cs_warned', frel: { marine: -3 } } } },
    ] },
  { id: 'cs_revoke', emoji: '⚖️', title: 'La licence en péril', pri: 9,
    w: { fac: ['corsaire'], test: S => S.hasFlag('cs_warned') && S.merit < 15 && !S.hasFlag('cs_revoke_done') },
    x: 'Un pli frappé du sceau des Cinq Doyens : « Vos manquements répétés remettent en cause votre statut de Corsaire. Vous êtes convoqué pour une audition. Il est encore temps de racheter votre licence. »',
    ch: [
      { t: 'Racheter sa licence (pot-de-vin)', c: S => S.tierPrime(), r: { x: 'Une enveloppe change de main. L\'affaire est « réglée ». Pour cette fois.', e: { unflag: 'cs_warned', flag2: 'cs_revoke_done', merit: 12 } } },
      { t: 'Faire ses preuves par une mission', s: 'combat', d: 5,
        ok: { x: 'Tu mènes l\'opération à bien. Les Doyens retiennent leur plume.', e: { unflag: 'cs_warned', flag2: 'cs_revoke_done', merit: 18, glory: 4 } },
        ko: { x: 'La mission échoue. La licence est suspendue : tu es redevenu un simple pirate, avec une prime gelée qu\'on dégèle d\'un coup.', e: { flag2: 'cs_revoke_done', faction: 'pirate', hp: -25, hl: 'a perdu sa licence de Corsaire' } } },
      { t: 'Rendre sa licence et reprendre la mer', r: { x: 'Tu jettes la licence aux pieds du messager. Tu es libre. Et traqué.', e: { flag2: 'cs_revoke_done', faction: 'pirate', glory: 4, frel: { gov: -4, marine: -4 }, hl: 'a renoncé à sa licence de Corsaire' } } },
    ] },
);
