// Vie à bord, prime et chasseurs de primes, caprices de la météo.
const hasCrew = n => S => S.crew.filter(c => !c.isCaptain).length >= n;
const bnty = m => S => S.hero.bounty >= m;
const RAW = [
  // ───── équipage ─────
  { id: 'lf_dispute', emoji: '😤', title: 'Dispute à bord', pri: 0, w: { test: hasCrew(2), weight: 12 }, cd: 'cdDispute',
    x: S => { const [a, b] = S.twoCrew(); return `${a.name} et ${b.name} en viennent aux mains sur le pont, pour une histoire de ration. Le reste de l'équipage retient son souffle : tout le monde attend de voir ce que tu vas faire.`; },
    ch: [
      { t: 'Les séparer, sans prendre parti', s: 'charisme', d: 1, ok: { x: 'Ta voix couvre le vacarme. Ils s\'excusent du bout des lèvres ; la rancune retombe.', e: { loyalty: 6, morale: 6 } }, ko: { x: 'Ils se retournent contre toi : « Mêle-toi de tes affaires ! » L\'ambiance reste lourde.', e: { loyalty: -6, morale: -8 } } },
      { t: 'Donner raison au plus ancien', r: { x: 'L\'ancien triomphe, l\'autre boude longtemps. Mais l\'ordre est rétabli.', e: { loyalty: -3, morale: 3 } } },
      { t: 'Les laisser se battre (arène à bord)', s: 'force', d: 0, ok: { x: 'Ils se défoulent, puis se payent un verre ensemble. Une vraie camaraderie en sort.', e: { loyalty: 8, morale: 8, hp: -5 } }, ko: { x: 'Quelqu\'un est blessé pour de bon. Tu as joué avec le feu.', e: { loyalty: -8, hp: -10, crewLoss: 'lowloyal' } } },
    ] },
  { id: 'lf_dream', emoji: '💭', title: 'Le rêve d\'un équipier', pri: 0, w: { test: hasCrew(1), weight: 10 }, cd: 'cdDream',
    x: S => `${S.randomCrew().name} s'assoit près de toi à la proue, la nuit. « Je ne te l'ai jamais dit... j'ai un rêve, moi aussi. » Tu sens que ta réponse comptera longtemps.`,
    ch: [
      { t: 'L\'écouter jusqu\'au bout', r: { x: 'Tu écoutes sans l\'interrompre. Il repart plus léger, et plus décidé à te suivre jusqu\'au bout.', e: { crewGrow: 1, morale: 6 } } },
      { t: 'Promettre de l\'aider à l\'atteindre', s: 'charisme', d: 1, ok: { x: 'Ta promesse l\'électrise : il s\'entraîne comme jamais.', e: { crewGrow: 2, loyalty: 6 } }, ko: { x: 'Il sent que tu promets trop vite. Il garde le silence.', e: { loyalty: -4 } } },
      { t: 'Le taquiner et passer à autre chose', r: { x: 'Il rit jaune. Rien de grave, mais un peu de confiance s\'est évaporée.', e: { loyalty: -5 } } },
    ] },
  { id: 'lf_deserter', emoji: '🚪', title: 'Quelqu\'un veut partir', pri: 0, w: { test: S => [...S.crew].some(c => !c.isCaptain && c.loyalty < 35), weight: 28 }, cd: 'cdDeser',
    x: S => `${S.lowLoyalCrew().name} fait son sac à l'escale. « Je ne vois plus où on va. Je descends ici. » Le reste de l'équipage observe en silence.`,
    ch: [
      { t: 'Le convaincre de rester', s: 'charisme', d: 2, ok: { x: 'Tes mots portent : il défait son sac. Il reste, et il s\'engage plus qu\'avant.', e: { loyalty: 10, crewGrow: 1 } }, ko: { x: 'Il secoue la tête et s\'éloigne sur le quai, sans se retourner.', e: { crewLoss: 'lowloyal', morale: -8 } } },
      { t: 'Lui offrir une part du butin', c: S => S.tierPrime() / 6, r: { x: 'Il hésite, puis serre ta main. L\'argent n\'achète pas tout, mais il aide à patienter.', e: { loyalty: 14 } } },
      { t: 'Le laisser partir avec ses affaires', r: { x: 'Tu lui souhaites bonne route. Il te remercie de ne pas avoir insisté.', e: { crewLoss: 'lowloyal', morale: -4, loyalty: 3 } } },
    ] },
  { id: 'lf_feast', emoji: '🍖', title: 'Le plat du cuisinier', pri: 0, w: { test: S => S.crew.some(c => c.role === 'cuisinier'), weight: 10 }, cd: 'cdFeast',
    x: 'Ton cuisinier a trouvé un ingrédient rare au marché. Il promet un festin « dont on parlera dans toutes les mers ». Il demande juste une chose : que personne ne touche à la marmite avant le soir.',
    ch: [
      { t: 'Lui faire confiance', r: { x: 'Un festin magnifique : même les plus bougons en redemandent.', e: { hp: 999, heal: true, morale: 22, loyalty: 8 } } },
      { t: 'Goûter en cachette avant les autres', s: 'vitesse', d: 1, ok: { x: 'Personne ne te voit... sauf le chat. Délicieux.', e: { morale: 10, hp: 20 } }, ko: { x: 'Pris sur le fait ! Le cuisinier te court après avec sa louche, et tout l\'équipage rit.', e: { morale: 14, loyalty: 3 } } },
    ] },
  // ───── primes et chasseurs ─────
  { id: 'lf_poster', emoji: '📜', title: 'Nouvelle affiche', pri: 0, w: { test: bnty(5_000_000), weight: 12 }, cd: 'cdPoster',
    x: S => `Dans un journal gratuit, ta tête s'étale en première page : « ${S.hero.name}, recherché pour ${S.hero.bounty >= 300_000_000 ? 'menace pour l\'ordre mondial' : 'pillage et rébellion'}. » La photo est floue, et ça te vexe un peu.`,
    ch: [
      { t: 'Faire encadrer l\'affiche', r: { x: 'Fierté, bien sûr. Ton équipage la signe tous ensemble.', e: { morale: 12, glory: 1 } } },
      { t: 'Offrir ta tête à un journaliste qui t\'interviewe', s: 'charisme', d: 1, ok: { x: 'Le portrait est flatteur : la légende grandit, et la prime avec.', e: { glory: 3, bounty: 12_000_000, morale: 6 } }, ko: { x: 'Il déforme tes mots. L\'article te fait passer pour un monstre.', e: { bounty: 20_000_000, frel: { marine: -1 } } } },
      { t: 'Brûler tous les exemplaires de la ville', s: 'vitesse', d: 1, ok: { x: 'Opération discrète et efficace. La rumeur peine à circuler.', e: { stats: { vitesse: 1 } } }, ko: { x: 'On te surprend au milieu du travail. Une patrouille te court après.', e: { hp: -12, bounty: 8_000_000 } } },
    ] },
  { id: 'lf_hunt_solo', emoji: '🔫', title: 'Un chasseur de primes sur le port', pri: 0, w: { test: bnty(15_000_000), weight: 14 }, cd: 'cdHunter',
    x: S => `Un chasseur de primes solitaire t'a reconnu à l'auberge. Il pose ton avis de recherche sur la table : « Rien de personnel. Dehors, on règle ça proprement. »`,
    ch: [
      { t: 'Accepter le duel', s: 'combat', d: 1, ok: { x: 'Tu l\'étends proprement. Il murmure qu\'il racontera ça dans les tavernes.', e: { glory: 3, berrys: S => S.tierPrime() / 5, bounty: 6_000_000 } }, ko: { x: 'Il est plus fort que prévu. Tu t\'échappes de justesse.', e: { hp: -28, morale: -6 } } },
      { t: 'Négocier : double le prix', s: 'charisme', d: 2, ok: { x: 'Tu lui offres le double de ce que Marine paierait. Il range son pistolet, puis te serre la main.', e: { loyalty: 4 } , berrys: S => -S.tierPrime() / 8 }, ko: { x: 'Il rit : « La parole d\'un pirate ? »', e: { hp: -15 } } },
      { t: 'Filer par la fenêtre', s: 'vitesse', d: 0, ok: { x: 'Tu disparais avant qu\'il ne referme son poing.', e: {} }, ko: { x: 'Raté, il t\'attendait dehors.', e: { hp: -20 } } },
    ] },
  { id: 'lf_hunt_pack', emoji: '🏹', title: 'La meute de chasseurs', pri: 0, w: { test: bnty(50_000_000), weight: 10 }, cd: 'cdPack',
    x: 'Une demi-douzaine de chasseurs de primes organisent leur propre battue, avec cordes, filets et un type qui sait manier le fusil à plomb. Ils t\'attendent à la sortie du port.',
    ch: [
      { t: 'Foncer dans le tas', s: 'combat', d: 2, ok: { x: 'Tu les balayes. Trois fuient, trois dorment.', e: { glory: 5, berrys: S => S.tierPrime() / 3, bounty: 12_000_000 } }, ko: { x: 'Ils te piègent sous un filet. Tu t\'en sors à grand-peine.', e: { hp: -35, morale: -8 } } },
      { t: 'Les contourner par les toits', s: 'vitesse', d: 2, ok: { x: 'Tu les laisses se regarder sans comprendre.', e: { stats: { vitesse: 1 } } }, ko: { x: 'Un fil tendu t\'attrape la cheville.', e: { hp: -22 } } },
      { t: 'Retourner le bateau et partir en mer', c: S => S.tierPrime() / 20, r: { x: 'Mieux vaut perdre une escale que sa tête.', e: { morale: -4 } } },
    ] },
  { id: 'lf_hunt_sea', emoji: '🚢', title: 'Chasseurs en mer', pri: 0, w: { ctx: 'sea', test: bnty(30_000_000), weight: 12 }, cd: 'cdSeaHunt',
    x: 'Une voile sombre te file depuis ce matin. Ce sont des chasseurs de primes à la poursuite d\'un butin : le tien. Ils se rapprochent, canons armés.',
    ch: [
      { t: 'Faire demi-tour et les aborder', s: 'combat', d: 2, ok: { x: 'Leur pont est à toi en cinq minutes. Un joli butin.', e: { glory: 4, berrys: S => S.tierPrime() / 3, bounty: 8_000_000 } }, ko: { x: 'Ils étaient mieux armés que prévu.', e: { hp: -25, shipHp: -15 } } },
      { t: 'Les semer à la voile', s: 'navigation', d: 2, ok: { x: 'Un vent favorable te porte hors d\'atteinte. Ils maudissent ton nom.', e: { morale: 6 } }, ko: { x: 'Une salve te touche à l\'arrière.', e: { shipHp: -20 } } },
    ] },
  { id: 'lf_pay', emoji: '🪙', title: 'Racheter sa tête', pri: 0, w: { test: S => S.hero.bounty >= 30_000_000 && S.hero.berrys >= S.hero.bounty / 10, weight: 8 }, cd: 'cdPay',
    x: 'Un fonctionnaire corrompu du Gouvernement te fait passer un message : pour une somme raisonnable, ton dossier pourrait « se perdre ». Il est probablement honnête, pour une fois. Probablement.',
    ch: [
      { t: 'Payer le pot-de-vin', c: S => Math.round(S.hero.bounty / 10), r: { x: 'Une partie de ton dossier disparaît. Ta prime baisse, mais pas l\'attention de la Marine.', e: { payBounty: 30_000_000 } } },
      { t: 'Refuser : une prime, ça se mérite', r: { x: 'Tu ris et tu romps le contact. Ta légende y gagne.', e: { glory: 2, morale: 6 } } },
      { t: 'Piéger le fonctionnaire', s: 'intel', d: 2, ok: { x: 'Tu retournes le piège : lettres compromettantes, valise pleine, et un ami haut placé à la Marine.', e: { berrys: S => S.tierPrime() / 3, frel: { marine: 1 } } }, ko: { x: 'Il avait prévu ton coup. Ta prime grimpe.', e: { bounty: 15_000_000 } } },
    ] },
  // ───── météo ─────
  { id: 'lf_storm', emoji: '⛈️', title: 'Tempête au large', pri: 0, w: { ctx: 'sea', weight: 12 }, cd: 'cdStorm',
    x: 'Le ciel vire au noir en quelques minutes. Les vagues montent par-dessus le bastingage, le mât craque, et tes équipiers se tournent vers toi.',
    ch: [
      { t: 'Prendre la barre toi-même', s: 'navigation', d: 2, ok: { x: 'Tu lis la mer comme un livre ouvert. Le navire passe, trempé mais intact.', e: { stats: { navigation: 1 }, glory: 2, morale: 8 } }, ko: { x: 'Une vague te balaye de la barre. Le navire en souffre.', e: { shipHp: -22, hp: -10 } } },
      { t: 'Réduire la voilure et attendre', r: { x: 'Prudent. Le temps perdu coûte moins que la coque.', e: { shipHp: -6, morale: -3 } } },
      { t: 'Laisser le navigateur décider', s: 'intel', d: 1, ok: { x: 'Il trouve une passe entre deux fronts. Sauvés.', e: { morale: 8, crewGrow: 1 } }, ko: { x: 'Il hésite, la tempête n\'attend pas.', e: { shipHp: -16 } } },
    ] },
  { id: 'lf_fog', emoji: '🌫️', title: 'Brume sur la mer', pri: 0, w: { ctx: 'sea', weight: 10 }, cd: 'cdFog',
    x: 'Une brume épaisse se lève, si dense qu\'on ne voit plus la proue. Les cloches sonnent seules, et quelque part, un autre bateau répond.',
    ch: [
      { t: 'Tendre l\'oreille et manœuvrer à vue', s: 'intel', d: 1, ok: { x: 'Tu évites un récif et croises un navire marchand sans incident.', e: { berrys: S => S.tierPrime() / 6 } }, ko: { x: 'Le récif apparaît trop tard : la coque racle.', e: { shipHp: -15 } } },
      { t: 'Allumer un grand feu à la proue', r: { x: 'Le halo guide un pêcheur égaré jusqu\'à toi. Il te remercie d\'un poisson et d\'une carte.', e: { stats: { navigation: 1 }, morale: 5 } } },
    ] },
  { id: 'lf_calm', emoji: '😶‍🌫️', title: 'Calme plat', pri: 0, w: { ctx: 'sea', weight: 10 }, cd: 'cdCalm',
    x: 'Plus un souffle de vent depuis trois jours. Les voiles pendent, les provisions s\'amenuisent, les esprits s\'échauffent.',
    ch: [
      { t: 'Faire ramer l\'équipage', s: 'volonte', d: 1, ok: { x: 'Chacun donne le meilleur de soi. Quand le vent revient, tout le monde rit d\'épuisement.', e: { loyalty: 6, morale: 6, stats: { force: 1 } } }, ko: { x: 'Fatigue, grognes, quelques disputes.', e: { morale: -10, hp: -8 } } },
      { t: 'Organiser des jeux et des concours', r: { x: 'Le moral remonte, la mer ne bouge pas.', e: { morale: 14, loyalty: 4 } } },
    ] },
];

// chaque scène a son propre délai de réapparition (5 escales)
export const LIFE_EVENTS = RAW.map(ev => { const t = ev.w.test; return { ...ev, w: { ...ev.w, test: S => (!t || t(S)) && S.turn - (S[ev.cd] ?? -99) >= 5 } }; });
