// Trames originales liées aux Empereurs, aux Corsaires, à la Marine et aux Dragons Célestes (hors canon, cohérentes avec l'univers).
const A = (id, stage) => ({ id, stage });
export const LORE_ARCS = {
  l_fils:   { name: 'Le fils prodigue', stages: 3 },
  l_cadeau: { name: 'Le cadeau empoisonné', stages: 3 },
  l_sel:    { name: 'Le pacte de sel', stages: 3 },
  l_liste:  { name: 'La liste du Gouvernement', stages: 3 },
  l_imposteur: { name: 'L\'imposteur', stages: 3 },
  l_garnison:  { name: 'La garnison oubliée', stages: 3 },
  l_convoi:    { name: 'Le convoi de poudre', stages: 3 },
  l_caprice:   { name: 'Le caprice d\'un Dragon', stages: 3 },
  l_lignee:    { name: 'La lignée', stages: 3 },
};
const ch = S => S.camp === 'chercheur', ga = S => S.camp === 'gardien';
export const LORE_EVENTS = [];
const stage = (id, n, o) => LORE_EVENTS.push({ id: `${id}_${n}`, pri: n === 1 ? 9 : 10, emoji: o.emoji, title: `${o.title} (${n}/3)`, w: { ...(n === 1 ? { weight: o.weight ?? 8, once: true } : {}), ...o.w, test: S => (n === 1 ? S.arc(id, 0) : S.arc(id, n - 1, 2)) && (o.test ? o.test(S) : true) }, ...(n === 1 ? { once: true } : {}), x: o.x, ch: o.ch });

// ═══ EMPEREURS ═══
stage('l_fils', 1, { emoji: '🧒', title: 'Le fils prodigue', w: { minTier: 3, camp: 'chercheur' }, test: S => S.hero.faction !== 'empereur',
  x: S => `Dans une taverne du port, un jeune homme au teint pâle te saisit le bras. Il ne ressemble à personne… sauf à ${S.tmpYonko().name}, dont il porte le nez. « Je suis son fils, murmure-t-il. Il veut me marier pour sceller une alliance. Je veux voir la mer. Aide-moi. »`,
  ch: [
    { t: 'Le cacher sur ton navire', r: { x: 'Tu l\'enroules dans une toile et l\'embarques. Il te remercie à voix basse.', e: { arc: A('l_fils', 1), flag: 'fils_hid', morale: 4 } } },
    { t: 'Le vendre à l\'Empereur', r: { x: 'Tu envoies un messager. Quelques heures plus tard, des hommes de l\'Empereur le récupèrent et te paient grassement. Il te regarde sans un mot.', e: { arc: A('l_fils', 1), flag: 'fils_sold', berrys: S => S.tierPrime() * 2, rep: -4 } } },
    { t: 'Refuser de te mêler de ça', r: { x: 'Tu retires ton bras. Les histoires d\'Empereurs se règlent entre Empereurs.', e: { arc: A('l_fils', 3), flag2: 'fils_over' } } },
  ] });
stage('l_fils', 2, { emoji: '🕵️', title: 'Le fils prodigue', w: {}, test: S => !S.hasFlag('fils_over'),
  x: S => S.hasFlag('fils_sold') ? 'Des rumeurs t\'arrivent : le fils prodigue a été marié de force. Un sbire de l\'Empereur t\'invite à un banquet de remerciement. Quelque chose te dit que ce n\'est pas que ça.' : 'Un navire de l\'Empereur croise ta route, puis un second. On cherche quelqu\'un à bord. « Un jeune homme, pâle, nez fin. Il vaut cher. »',
  ch: [
    { t: 'Mentir avec aplomb', s: 'charisme', d: 4, ok: { x: 'Tu les convaincs. Ils repartent bredouilles.', e: { arc: A('l_fils', 2), glory: 2 } }, ko: { x: 'Ils fouillent ton navire. Le fils est découvert, mais il s\'enfuit dans la confusion.', e: { arc: A('l_fils', 2), shipHp: -25, hp: -15 } } },
    { t: 'Les affronter', s: 'naval', d: 4, ok: { x: 'Tes bordées les repoussent. Le fils te regarde avec admiration.', e: { arc: A('l_fils', 2), glory: 4, shipHp: -20 } }, ko: { x: 'Leur flotte te met en fuite.', e: { arc: A('l_fils', 2), shipHp: -45, morale: -8 } } },
    { t: 'Livrer l\'enfant', r: { x: 'Tu cèdes. L\'Empereur t\'en saura gré, à sa manière.', e: { arc: A('l_fils', 2), flag: 'fils_sold', berrys: S => S.tierPrime(), rep: -3, flag2: 'fils_over' } } },
  ] });
stage('l_fils', 3, { emoji: '🎭', title: 'Le fils prodigue', w: {}, test: S => !S.hasFlag('fils_over'),
  x: 'Une nuit, le fils prodigue te réveille. « J\'ai menti : je ne fuis pas le mariage. Je fuis ce que mon père prépare. J\'ai les plans d\'une offensive contre un autre Empereur. Je veux les remettre à quelqu\'un qui saura les utiliser. »',
  ch: [
    { t: 'Utiliser les plans contre l\'Empereur', s: 'intel', d: 5, ok: { x: 'Tu fais fuiter les plans au bon endroit : une guerre s\'évite, et ton nom circule dans la bouche des plus grands.', e: { arc: A('l_fils', 3), flag2: 'fils_over', glory: 10, rep: 8, hl: 'a déjoué l\'offensive d\'un Empereur', fruit: 'random3' } }, ko: { x: 'Les plans sont piégés : l\'Empereur te traque.', e: { arc: A('l_fils', 3), flag2: 'fils_over', hp: -35, shipHp: -35 } } },
    { t: 'Lui offrir une place dans ton équipage', r: { x: 'Il devient navigateur à tes côtés, et un ami fidèle. Un Empereur a perdu son fils, sans savoir où.', e: { arc: A('l_fils', 3), flag2: 'fils_over', recruit: { role: 'navigateur' }, morale: 12 } } },
    { t: 'Le renvoyer à son père', r: { x: 'Il te regarde sans colère, avec une tristesse que tu n\'oublieras pas.', e: { arc: A('l_fils', 3), flag2: 'fils_over', rep: -3 } } },
  ] });

stage('l_cadeau', 1, { emoji: '🎁', title: 'Le cadeau empoisonné', w: { fac: ['vassal'] },
  x: S => `${S.yonkoName()} te confie un coffre scellé : « Un présent pour un rival, en signe de paix. Tu le livreras toi-même. Tu ne l'ouvres pas. »`,
  ch: [
    { t: 'Accepter la mission', r: { x: 'Tu hisses le coffre à bord. Il est étrangement lourd.', e: { arc: A('l_cadeau', 1), merit: 4 } } },
    { t: 'Demander ce qu\'il y a dedans', s: 'charisme', d: 4, ok: { x: 'Il sourit : « De l\'or et du saké. » Tu as un doute.', e: { arc: A('l_cadeau', 1), merit: 2 } }, ko: { x: 'Son sourire se fige. « Tu poses trop de questions. »', e: { arc: A('l_cadeau', 1), merit: -4 } } },
  ] });
stage('l_cadeau', 2, { emoji: '☠️', title: 'Le cadeau empoisonné', w: {}, test: S => S.hero.faction === 'vassal',
  x: 'En mer, une odeur âcre sort du coffre. Un de tes hommes l\'ouvre : de l\'or, oui, mais saupoudré d\'une poudre grise. Le médecin pâlit : « Un poison lent. Quiconque touche cet or tombe malade en trois jours. »',
  ch: [
    { t: 'Livrer quand même', r: { x: 'Tu pars en connaissance de cause. Ton Empereur est content, un rival tombera, et tu vivras avec ça.', e: { arc: A('l_cadeau', 2), flag: 'cadeau_delivered', merit: 10, rep: -6, morale: -10 } } },
    { t: 'Prévenir le rival', s: 'charisme', d: 5, ok: { x: 'Le rival te reçoit, glacé, puis te remercie. Tu as un ennemi de moins… et un Empereur de plus à craindre.', e: { arc: A('l_cadeau', 2), flag: 'cadeau_warned', merit: -15, rep: 8, glory: 5 } }, ko: { x: 'Il croit à un piège. Ses hommes te mettent en joue.', e: { arc: A('l_cadeau', 2), hp: -30, flag: 'cadeau_warned' } } },
    { t: 'Jeter le coffre à la mer', r: { x: 'L\'or coule avec son poison. Tu devras t\'en expliquer.', e: { arc: A('l_cadeau', 2), flag: 'cadeau_sunk', merit: -6 } } },
  ] });
stage('l_cadeau', 3, { emoji: '⚖️', title: 'Le cadeau empoisonné', w: {}, test: S => S.hero.faction === 'vassal',
  x: S => S.hasFlag('cadeau_delivered') ? 'Le rival tombe malade, puis meurt. Les soupçons se tournent vers toi : on t\'a vu livrer le coffre. L\'Empereur te couvre… ou te sacrifie.' : S.hasFlag('cadeau_warned') ? 'Ton Empereur apprend que tu as prévenu son rival. Il te convoque, seul, sur le pont de son navire.' : 'Ton Empereur te demande des comptes sur le coffre. Tes hommes se regardent, mal à l\'aise.',
  ch: [
    { t: 'Plaider ta cause', s: 'charisme', d: 5, ok: { x: 'Il t\'écoute, puis rit : « Tu as du cran. Je te garde. »', e: { arc: A('l_cadeau', 3), merit: 8, glory: 4 } }, ko: { x: 'Il te regarde longuement. « Je ne tolère pas l\'insubordination. » Tes hommes paient pour toi.', e: { arc: A('l_cadeau', 3), hp: -40, crewLoss: 'lowloyal', merit: -10 } } },
    { t: 'Le défier ouvertement', s: 'combat', d: 12, ok: { x: 'Contre toute attente, tu tiens tête à l\'Empereur. Il éclate de rire et te libère de ses serments.', e: { arc: A('l_cadeau', 3), faction: 'pirate', glory: 20, hl: 'a tenu tête à son Empereur' } }, ko: { x: 'Il t\'écrase d\'un coup. Tu survis par miracle.', e: { arc: A('l_cadeau', 3), hp: -70, merit: -15 } } },
    { t: 'S\'incliner et obéir', r: { x: 'Tu t\'agenouilles. L\'Empereur hoche la tête. Ta place est sauve, au prix de ta fierté.', e: { arc: A('l_cadeau', 3), merit: 2, morale: -8 } } },
  ] });

stage('l_sel', 1, { emoji: '🧂', title: 'Le pacte de sel', w: { minTier: 3, camp: 'chercheur' },
  x: S => `Deux Empereurs, ${S.tmpYonko().name} et un autre, négocient une trêve sur une île neutre, avec des bols de sel partagés selon la tradition du Nouveau Monde. On t'invite comme témoin neutre. « Tu as l'air d'un homme qui voit tout et qui ne dit rien », glisse un émissaire.`,
  ch: [
    { t: 'Accepter d\'être témoin', r: { x: 'Tu t\'assois à la table, les yeux ouverts. Les deux camps t\'observent.', e: { arc: A('l_sel', 1), rep: 4 } } },
    { t: 'Demander une contrepartie', s: 'charisme', d: 4, ok: { x: 'On te paie ta présence, et on te respecte davantage.', e: { arc: A('l_sel', 1), berrys: S => S.tierPrime(), rep: 3 } }, ko: { x: 'On te rappelle que la neutralité est un honneur, pas un métier.', e: { arc: A('l_sel', 1), rep: -2 } } },
  ] });
stage('l_sel', 2, { emoji: '🗡️', title: 'Le pacte de sel', w: {},
  x: 'Au milieu de la cérémonie, un bol de sel se brise. Une lame glisse dans la manche d\'un conseiller. Quelqu\'un veut faire échouer le pacte. Tu es le seul à avoir vu le geste.',
  ch: [
    { t: 'Désarmer le conseiller en silence', s: 'vitesse', d: 4, ok: { x: 'Tu lui saisis le poignet avant qu\'il ne frappe. Les Empereurs ne verront rien.', e: { arc: A('l_sel', 2), glory: 4, stats: { vitesse: 1 } } }, ko: { x: 'Il frappe : un blessé, une panique.', e: { arc: A('l_sel', 2), hp: -25 } } },
    { t: 'Crier l\'alerte', r: { x: 'La salle se fige. Les gardes dégainent. Le conseiller est arrêté, mais la méfiance est à son comble.', e: { arc: A('l_sel', 2), rep: 3 } } },
    { t: 'Laisser faire', r: { x: 'Tu détournes les yeux. Le pacte se brise dans le sang, et tu as gardé les mains propres. En apparence.', e: { arc: A('l_sel', 2), flag: 'sel_broken', rep: -6 } } },
  ] });
stage('l_sel', 3, { emoji: '🕊️', title: 'Le pacte de sel', w: {},
  x: S => S.hasFlag('sel_broken') ? 'Le pacte a échoué. Les deux camps t\'en tiennent pour responsable : tu étais là, tu n\'as rien fait. Un émissaire de chaque Empereur te demande de te présenter.' : 'Le pacte est sauvé. Les deux Empereurs te remercient chacun à leur manière, et te demandent de choisir à qui tu veux dédier ton prochain service.',
  ch: [
    { t: 'Servir le premier Empereur', r: { x: 'Tu te places sous son aile. Le second te garde rancune.', e: { arc: A('l_sel', 3), yonko: S => S.tmpYonko().id, merit: 6, glory: 4 } } },
    { t: 'Garder ta neutralité', s: 'charisme', d: 5, ok: { x: 'Les deux Empereurs t\'accordent un sauf-conduit : tu es un « Neutre du Sel ». Rare privilège.', e: { arc: A('l_sel', 3), glory: 8, rep: 10, ship: { mod: 'cale' }, hl: 'est devenu Neutre du Sel' } }, ko: { x: 'Les deux te soupçonnent, aucun ne te protège.', e: { arc: A('l_sel', 3), rep: -4 } } },
  ] });

// ═══ CORSAIRES ═══
stage('l_liste', 1, { emoji: '📜', title: 'La liste du Gouvernement', w: { fac: ['corsaire'] },
  x: 'Un pli frappé du sceau du Gouvernement : une liste de cinq noms. « Cinq pirates qui ont trop parlé, trop fait, trop pensé. Rapportez leurs têtes, Corsaire. » Le troisième nom est celui d\'un vieil ami.',
  ch: [
    { t: 'Accepter la liste', r: { x: 'Tu replies le pli. Le troisième nom te brûle les doigts.', e: { arc: A('l_liste', 1), merit: 4 } } },
    { t: 'Discuter la liste', s: 'charisme', d: 4, ok: { x: 'Un secrétaire te confie : le troisième nom est là pour t\'éprouver.', e: { arc: A('l_liste', 1), flag: 'liste_test', merit: 1 } }, ko: { x: 'On te rappelle qui commande.', e: { arc: A('l_liste', 1), merit: -5 } } },
  ] });
stage('l_liste', 2, { emoji: '🍶', title: 'La liste du Gouvernement', w: {},
  x: 'Tu retrouves ton vieil ami dans une taverne de Grand Line. Il te serre dans ses bras, sans savoir. Il parle de son rêve : retrouver une île où ses parents ont disparu. Entre deux verres, il te regarde : « Tu es bien silencieux. »',
  ch: [
    { t: 'Lui avouer la liste', r: { x: 'Il pâlit, puis sourit tristement. « Tu feras ce que tu dois. »', e: { arc: A('l_liste', 2), flag: 'liste_told', morale: -5 } } },
    { t: 'L\'avertir discrètement et lui laisser la fuite', r: { x: 'Tu lui glisses un indice. À l\'aube, son navire a disparu.', e: { arc: A('l_liste', 2), flag: 'liste_warned', rep: 4 } } },
    { t: 'Le livrer sans un mot', r: { x: 'Tu le laisses dormir. Au matin, la Marine l\'emmène. Tu ne regardes pas.', e: { arc: A('l_liste', 2), flag: 'liste_betrayed', merit: 8, berrys: S => S.tierPrime(), morale: -15 } } },
  ] });
stage('l_liste', 3, { emoji: '⚖️', title: 'La liste du Gouvernement', w: {},
  x: S => S.hasFlag('liste_betrayed') ? 'Ton ami est jugé et condamné. Il te cherche des yeux dans la foule. Quelqu\'un te tend sa dernière lettre.' : S.hasFlag('liste_warned') ? 'Le Gouvernement s\'aperçoit que la cible a fui : on t\'interroge. Un agent du Cipher Pol a lu ton dossier.' : 'Ton ami t\'a pardonné. Le Gouvernement a besoin d\'une preuve de loyauté : une exécution publique.',
  ch: [
    { t: 'Mentir au Gouvernement', s: 'intel', d: 5, ok: { x: 'Ton alibi tient. La liste se perd dans les couloirs.', e: { arc: A('l_liste', 3), merit: 3, rep: 5 } }, ko: { x: 'Ton mensonge est percé : suspension et amende.', e: { arc: A('l_liste', 3), merit: -12, berrys: S => -S.tierPrime() } } },
    { t: 'Quitter le Gouvernement', r: { x: 'Tu rends ta licence, l\'ami est libre, et vous partez ensemble. Le Gouvernement ne te le pardonnera pas.', e: { arc: A('l_liste', 3), faction: 'pirate', glory: 6, frel: { gov: -4, marine: -3 }, hl: 'a quitté les Corsaires pour un ami' } } },
    { t: 'Aller jusqu\'au bout', r: { x: 'Tu as tenu ta place, au prix d\'une chose qui ne reviendra pas.', e: { arc: A('l_liste', 3), merit: 8, morale: -10 } } },
  ] });

stage('l_imposteur', 1, { emoji: '🪞', title: 'L\'imposteur', w: { fac: ['corsaire'] },
  x: 'Une rumeur remonte : un pirate navigue sous tes couleurs, rançonne des convois et jure agir « au nom du Corsaire ». La Marine a ouvert une enquête. Elle pense que c\'est toi.',
  ch: [
    { t: 'Enquêter pour le retrouver', s: 'intel', d: 3, ok: { x: 'Tu remontes une piste vers un port discret.', e: { arc: A('l_imposteur', 1), flag: 'imp_track' } }, ko: { x: 'On te regarde de travers dans tous les ports.', e: { arc: A('l_imposteur', 1), rep: -3 } } },
    { t: 'Se justifier auprès de la Marine', s: 'charisme', d: 4, ok: { x: 'Un amiral te croit sur parole, à contrecœur.', e: { arc: A('l_imposteur', 1), merit: 4 } }, ko: { x: 'On te met sous surveillance.', e: { arc: A('l_imposteur', 1), merit: -6 } } },
  ] });
stage('l_imposteur', 2, { emoji: '🏴', title: 'L\'imposteur', w: {},
  x: 'Tu croises enfin son navire. Il est plus petit que le tien, mais il porte ton drapeau, et son capitaine te ressemble étrangement. Il sourit en te voyant. « Ça marche bien. Les gens ont peur de toi. »',
  ch: [
    { t: 'L\'aborder', s: 'combat', d: 4, ok: { x: 'Tu le désarmes. Il rend son drapeau, humilié.', e: { arc: A('l_imposteur', 2), glory: 4, flag: 'imp_caught' } }, ko: { x: 'Il t\'échappe en abandonnant une partie de son butin.', e: { arc: A('l_imposteur', 2), hp: -20 } } },
    { t: 'Lui parler d\'abord', s: 'charisme', d: 3, ok: { x: 'Il avoue : un amiral corrompu lui paie ce travail pour te discréditer.', e: { arc: A('l_imposteur', 2), flag: 'imp_truth', stats: { intel: 1 } } }, ko: { x: 'Il ne dit rien et prend la fuite.', e: { arc: A('l_imposteur', 2) } } },
  ] });
stage('l_imposteur', 3, { emoji: '⚓', title: 'L\'imposteur', w: {},
  x: S => S.hasFlag('imp_truth') ? 'L\'imposteur t\'a désigné le responsable : un amiral, pas n\'importe lequel. Ce serait te mettre en danger, mais aussi la possibilité de te débarrasser de ta laisse.' : 'L\'affaire de l\'imposteur éclate dans la presse. La Marine t\'appelle pour faire une déclaration publique.',
  ch: [
    { t: 'Dénoncer l\'amiral corrompu', s: 'charisme', d: 6, ok: { x: 'Ton témoignage fait tomber un haut gradé. Le Gouvernement t\'accorde de nouveaux privilèges, et te surveille de plus près.', e: { arc: A('l_imposteur', 3), merit: 15, glory: 8, rep: 8, frel: { marine: 2 } } }, ko: { x: 'L\'amiral nie tout. Ton dossier s\'alourdit.', e: { arc: A('l_imposteur', 3), merit: -10, hp: -20 } } },
    { t: 'Garder le silence', r: { x: 'Tu rends l\'imposteur à la justice et tu te tais. L\'amiral reste en place… et te le fera payer.', e: { arc: A('l_imposteur', 3), merit: 4, flag: 'cs_warned' } } },
  ] });

// ═══ MARINE ═══
stage('l_garnison', 1, { emoji: '🏚️', title: 'La garnison oubliée', w: { fac: ['marine'] },
  x: 'Un document perdu dans les archives : la base G-9, sur une île reculée, n\'a plus envoyé de rapport depuis deux ans. Personne ne s\'en est inquiété. Ta mission : y aller, constater, et revenir.',
  ch: [
    { t: 'Y aller avec une escouade', r: { x: 'Tu mets le cap, une escouade à bord. Le ciel se couvre.', e: { arc: A('l_garnison', 1), loyalty: 3 } } },
    { t: 'Y aller seul, discrètement', s: 'vitesse', d: 3, ok: { x: 'Tu accoste sans te faire repérer.', e: { arc: A('l_garnison', 1), flag: 'gar_stealth' } }, ko: { x: 'Une vigie t\'a vu.', e: { arc: A('l_garnison', 1) } } },
  ] });
stage('l_garnison', 2, { emoji: '🕯️', title: 'La garnison oubliée', w: {},
  x: 'La base est à moitié en ruine. Les quelques hommes qui restent vivent de pêche et de troc. Leur capitaine est un vieux Marine, borgne, qui te regarde comme un spectre : « Personne n\'est venu. Alors on s\'est organisés. On protège le village. »',
  ch: [
    { t: 'Les remettre en ordre', s: 'charisme', d: 4, ok: { x: 'Tu leur rends un uniforme et des rations. Ils pleurent de gratitude.', e: { arc: A('l_garnison', 2), merit: 6, flag: 'gar_loyal' } }, ko: { x: 'Ils ne te reconnaissent pas comme supérieur.', e: { arc: A('l_garnison', 2), morale: -5 } } },
    { t: 'Fermer les yeux sur leur système', r: { x: 'Tu ne fais pas de rapport sur l\'économie parallèle qu\'ils ont montée. Ils t\'en seront reconnaissants.', e: { arc: A('l_garnison', 2), flag: 'gar_loyal', rep: 4, merit: -3 } } },
    { t: 'Les dénoncer', r: { x: 'Tu notes tout dans ton rapport. Ils te regardent partir, sans rancune.', e: { arc: A('l_garnison', 2), merit: 10, rep: -6 } } },
  ] });
stage('l_garnison', 3, { emoji: '🏴‍☠️', title: 'La garnison oubliée', w: {},
  x: 'Tu es sur le point de repartir quand une flotte pirate apparaît à l\'horizon : ils ont appris que la base est faible, et veulent piller le village. La garnison te regarde. Ils ne te demanderont rien, mais ils savent.',
  ch: [
    { t: 'Défendre la base (bataille tactique)', r: { x: 'Tu hisses les couleurs de la Marine sur la vieille tour. Les canons rouillés tonnent.', e: { arc: A('l_garnison', 3), battle: { evId: 'l_garnison_battle', ci: 0, kind: 'naval', d: 3, foe: 'la flotte pirate', ally: 0.25 } } } },
    { t: 'Négocier avec les pirates', s: 'charisme', d: 6, ok: { x: 'Tu leur proposes un marché qu\'ils ne peuvent refuser : un sauf-conduit contre leur départ.', e: { arc: A('l_garnison', 3), merit: 6, glory: 4 } }, ko: { x: 'Ils pillent ce qu\'ils peuvent et repartent.', e: { arc: A('l_garnison', 3), merit: -8, shipHp: -20 } } },
  ] });
LORE_EVENTS.push({ id: 'l_garnison_battle', w: { weight: 0, test: () => false }, emoji: '⚓', title: 'La garnison oubliée',
  ch: [{ t: 'Bataille', s: 'naval', d: 3,
    ok: { x: 'Les pirates fuient devant les canons rouillés et la rage de désespérés. La base G-9 retrouve un nom, et tes hommes une raison de rester.', e: { glory: 6, merit: 14, rep: 8, hl: 'a sauvé une base oubliée de la Marine', fleet: { name: 'Garnison G-9', power: 4 } } },
    ko: { x: 'La base tombe. Tu sauves les hommes, mais pas les murs.', e: { merit: -4, shipHp: -35, morale: -10 } } }] });

stage('l_convoi', 1, { emoji: '📦', title: 'Le convoi de poudre', w: { camp: 'gardien' },
  x: 'Ordre du QG : escorter trois cargos de poudre jusqu\'à une base du Nouveau Monde. « Pas un tonneau ne manque. Les pirates sont à l\'affût. »',
  ch: [
    { t: 'Prendre la tête du convoi', r: { x: 'Tu hisses le pavillon d\'escorte. Les navires se mettent en ligne.', e: { arc: A('l_convoi', 1) } } },
    { t: 'Fermer la marche', r: { x: 'Tu surveilles l\'arrière, là où les pirates frappent d\'ordinaire.', e: { arc: A('l_convoi', 1), flag: 'conv_rear' } } },
  ] });
stage('l_convoi', 2, { emoji: '🔥', title: 'Le convoi de poudre', w: {},
  x: 'En pleine mer, un des cargos explose sans cause apparente. Un second, puis un troisième, ont des mèches rongées. Un saboteur se cache parmi l\'équipage d\'escorte.',
  ch: [
    { t: 'Fouiller les équipages', s: 'intel', d: 4, ok: { x: 'Tu mets la main sur le traître : un sergent corrompu.', e: { arc: A('l_convoi', 2), flag: 'conv_traitor', glory: 3 } }, ko: { x: 'Tu perds un cargo supplémentaire.', e: { arc: A('l_convoi', 2), shipHp: -25 } } },
    { t: 'Sécuriser les cargos restants', s: 'force', d: 3, ok: { x: 'Tu stabilises la situation.', e: { arc: A('l_convoi', 2) } }, ko: { x: 'Une explosion te blesse.', e: { arc: A('l_convoi', 2), hp: -25 } } },
  ] });
stage('l_convoi', 3, { emoji: '🏴‍☠️', title: 'Le convoi de poudre', w: {},
  x: 'À la sortie du passage, la flotte pirate attend : ils savaient la route. Le saboteur n\'était qu\'un maillon. Il faut protéger ce qui reste du convoi.',
  ch: [
    { t: 'Livrer bataille pour protéger le convoi', r: { x: 'Tu ordonnes la manœuvre. Les canons se tournent.', e: { arc: A('l_convoi', 3), battle: { evId: 'l_convoi_battle', ci: 0, kind: 'naval', d: 3, foe: 'la flotte pirate', ally: 0.2 } } } },
    { t: 'Sacrifier un cargo pour disperser l\'ennemi', s: 'intel', d: 5, ok: { x: 'Le cargo explose au milieu des pirates : le reste arrive à bon port.', e: { arc: A('l_convoi', 3), merit: 10, glory: 5 } }, ko: { x: 'L\'explosion rate sa cible.', e: { arc: A('l_convoi', 3), merit: -6, shipHp: -30 } } },
  ] });
LORE_EVENTS.push({ id: 'l_convoi_battle', w: { weight: 0, test: () => false }, emoji: '📦', title: 'Le convoi de poudre',
  ch: [{ t: 'Bataille', s: 'naval', d: 3,
    ok: { x: 'Le convoi arrive à bon port, ses poudres intactes. Le QG te cite à l\'ordre du jour.', e: { glory: 7, merit: 14, berrys: S => S.tierPrime() / 2, hl: 'a protégé un convoi de poudre de la Marine' } },
    ko: { x: 'Le convoi est dispersé : la poudre est perdue, les hommes sauvés.', e: { merit: -5, shipHp: -35 } } }] });

// ═══ CHEVALIERS DIVINS ═══
stage('l_caprice', 1, { emoji: '👑', title: 'Le caprice d\'un Dragon', w: { fac: ['chevalier'] },
  x: 'Un Dragon Céleste de ta famille t\'appelle à son palais : « Je veux un navire, un vrai, qui soit à moi. Prends celui d\'un de ces vulgaires pirates. Et que ça se fasse vite. »',
  ch: [
    { t: 'Obéir sans poser de question', r: { x: 'Tu fais préparer un détachement. Le Dragon sourit.', e: { arc: A('l_caprice', 1), merit: 4 } } },
    { t: 'Tenter de le dissuader', s: 'charisme', d: 5, ok: { x: 'Il bougonne, mais se laisse convaincre de choisir un navire « moins vulgaire ».', e: { arc: A('l_caprice', 1), flag: 'cap_soft', merit: 2 } }, ko: { x: 'Il te foudroie du regard : « Je n\'ai pas demandé ton avis. »', e: { arc: A('l_caprice', 1), merit: -6 } } },
  ] });
stage('l_caprice', 2, { emoji: '🚢', title: 'Le caprice d\'un Dragon', w: {},
  x: 'Le navire désigné appartient à un marchand honnête, père de famille. Ses voiles sont fraîches, sa coque propre. Il tremble en voyant ton détachement : « Je n\'ai rien fait. »',
  ch: [
    { t: 'Saisir le navire', r: { x: 'Tu le saisis. Le marchand ne dit rien, il baisse la tête.', e: { arc: A('l_caprice', 2), flag: 'cap_took', merit: 10, rep: -8 } } },
    { t: 'Lui offrir une compensation en secret', c: S => S.tierPrime(), r: { x: 'Tu lui glisses une bourse. Il comprend, et disparaît avec sa famille.', e: { arc: A('l_caprice', 2), flag: 'cap_paid', rep: 6, merit: -4 } } },
    { t: 'Désobéir', r: { x: 'Tu fais demi-tour. Le Dragon va entendre parler de ça.', e: { arc: A('l_caprice', 2), flag: 'cap_defied', merit: -12 } } },
  ] });
stage('l_caprice', 3, { emoji: '😤', title: 'Le caprice d\'un Dragon', w: {},
  x: S => S.hasFlag('cap_defied') ? 'Le Dragon exige ta tête, ou du moins ton humiliation publique.' : 'Le Dragon, ravi de son nouveau jouet, l\'emmène en promenade… et le fait couler aussitôt, par jeu. Il rit. Il demande un autre navire.',
  ch: [
    { t: 'Accepter encore', r: { x: 'Tu t\'enfonces dans ta fonction. Les Dragons n\'oublient pas ceux qui obéissent.', e: { arc: A('l_caprice', 3), merit: 8, morale: -12 } } },
    { t: 'Lui faire comprendre le coût', s: 'intel', d: 6, ok: { x: 'Tu glisses que le Gouvernement s\'inquiète de la facture. Il boude, puis renonce.', e: { arc: A('l_caprice', 3), merit: 6, rep: 6, glory: 4 } }, ko: { x: 'Il te fait fouetter pour l\'insolence.', e: { arc: A('l_caprice', 3), hp: -40, merit: -6 } } },
    { t: 'Renoncer à ton rang', r: { x: 'Tu jettes ton insigne devant lui. Il hurle. Tu pars, libre, et traqué.', e: { arc: A('l_caprice', 3), faction: 'revo', glory: 8, frel: { gov: -5 }, hl: 'a renoncé à son rang de Dragon Céleste' } } },
  ] });

stage('l_lignee', 1, { emoji: '🕯️', title: 'La lignée', w: { fac: ['chevalier'] },
  x: 'Dans les couloirs du palais, un jeune Dragon Céleste de ton rang te prend à part. « Je veux te confier un secret : j\'ai un ami, un esclave du palais, qui m\'apprend à lire les vieux textes. Si on le découvre, il mourra. Si on me découvre, je serai déshérité. »',
  ch: [
    { t: 'Promettre le silence', r: { x: 'Tu hoches la tête. Tu portes désormais un secret.', e: { arc: A('l_lignee', 1), flag: 'lig_secret' } } },
    { t: 'Le dénoncer au Gouvernement', r: { x: 'Tu transmets l\'information. Les gardes viennent le chercher à l\'aube.', e: { arc: A('l_lignee', 3), merit: 8, rep: -8, flag2: 'lig_over' } } },
  ] });
stage('l_lignee', 2, { emoji: '📖', title: 'La lignée', w: {}, test: S => !S.hasFlag('lig_over'),
  x: 'Le jeune Dragon t\'amène en cachette dans une pièce close : un recueil de textes anciens, annotés de la main de son ami esclave. Certaines pages parlent d\'un royaume disparu. « Ils vont les brûler. Aide-moi à les sauver. »',
  ch: [
    { t: 'Copier les textes en secret', s: 'intel', d: 5, ok: { x: 'Tu transcris des pages entières. Quelque chose te dit que tu tiens une partie de l\'Histoire.', e: { arc: A('l_lignee', 2), stats: { intel: 2 }, flag: 'lig_copied' } }, ko: { x: 'Un garde te surprend, mais te prend pour un curieux.', e: { arc: A('l_lignee', 2), hp: -15 } } },
    { t: 'Faire sortir l\'esclave du palais', s: 'vitesse', d: 5, ok: { x: 'Vous quittez le palais de nuit. L\'esclave pleure en voyant la mer.', e: { arc: A('l_lignee', 2), flag: 'lig_freed', rep: 8 } }, ko: { x: 'Vous êtes repérés. L\'esclave est repris.', e: { arc: A('l_lignee', 2), hp: -25 } } },
  ] });
stage('l_lignee', 3, { emoji: '⚖️', title: 'La lignée', w: {}, test: S => !S.hasFlag('lig_over'),
  x: S => S.hasFlag('lig_freed') ? 'L\'esclave est libre et le jeune Dragon pleure de joie. Mais le Gouvernement a découvert la fuite : on te convoque.' : 'L\'esclave est condamné à l\'oubli. Le jeune Dragon te supplie de lui laisser une dernière chance. Quelqu\'un a parlé.',
  ch: [
    { t: 'Assumer seul la responsabilité', r: { x: 'Tu endosses la faute. On te punit, sans te briser, par respect pour ton nom.', e: { arc: A('l_lignee', 3), flag2: 'lig_over', hp: -30, merit: -10, rep: 10, hl: 'a protégé un secret à Mary Geoise' } } },
    { t: 'Accuser un autre', r: { x: 'Un serviteur paie pour toi. Tu t\'en sors, pas indemne.', e: { arc: A('l_lignee', 3), flag2: 'lig_over', merit: 6, morale: -12 } } },
    { t: 'Fuir Mary Geoise avec le jeune Dragon', r: { x: 'Vous quittez la Terre Sainte à bord d\'un navire de nuit. C\'est la fin de ta carrière de Dragon Céleste, et le début d\'autre chose.', e: { arc: A('l_lignee', 3), flag2: 'lig_over', faction: 'revo', glory: 10, frel: { gov: -5, revo: 4 }, hl: 'a fui Mary Geoise avec un Dragon Céleste' } } },
  ] });
