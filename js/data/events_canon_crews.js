// Équipages canon (One Piece Encyclopédie) croisés sur la route : chacun a sa scène, ses manières et son effet.
// « stat/ok » : l'option propre à l'équipage. Les liens (rel) vont au capitaine quand il existe dans la base.
const CREWS = [
  { id: 'heart', name: 'Pirates du Heart', emoji: '🫀', cap: 'law', tier: 2, sea: ['paradise', 'nw'], eras: ['pre', 'post'], x: 'Un sous-marin jaune émerge en silence près de ton navire. Sur le pont, un homme au chapeau tacheté, un sabre sur l\'épaule, te dévisage. Autour de lui, un ours en combinaison orange et deux jeunes pirates : les Pirates du Heart. « Si tu cherches des ennuis, j\'en ai en stock. »',
    sp: { t: 'Lui demander des soins et des conseils de médecine', s: 'intel', d: 3, ok: 'Il examine tes blessures avec un détachement chirurgical. « Un conseil gratuit : ne reste pas sur ces plaies. » Tu repars regonflé.', ko: 'Il te regarde, glacé : « Mes services se paient d\'une autre façon. »', e: { hp: 999, heal: true, stats: { intel: 1 } } },
    talk: 'Il te jauge, puis hoche la tête : « Tu n\'as pas l\'air d\'un idiot. Pour un pirate. »', fight: 'Une salve de Room déstabilise tes hommes : tu comprends que tu n\'as pas le niveau… ou presque.' },
  { id: 'kidd', name: 'Pirates de Kidd', emoji: '🧲', cap: 'kidd', tier: 2, sea: ['paradise', 'nw'], eras: ['pre', 'post'], x: 'Un navire hérissé de ferraille avance sans se soucier des règles. Au sommet de la proue, un homme aux cheveux rouges, un bras mécanique forgé de ferraille aimantée, te hurle : « Hé, toi ! C\'est toi qui te prends pour quelqu\'un ? »',
    sp: { t: 'Relever son défi de force', s: 'force', d: 4, ok: 'Tu soutiens son regard et sa poigne. « Pas mal, pas mal ! » Il rit et te laisse un souvenir : un morceau de ferraille précieuse.', ko: 'Il t\'aplatit au sol : « Reviens quand t\'auras des muscles. »', e: { stats: { force: 1 }, berrys: S => S.tierPrime() / 3 } },
    talk: 'Il grogne puis te tape sur l\'épaule : « T\'as du cran. Ça me va. »', fight: 'Ses aimants arrachent tes armes. Tu perds du terrain.' },
  { id: 'firetank', name: 'Pirates du Fire Tank', emoji: '🏰', cap: 'bege', tier: 2, sea: ['paradise', 'nw'], eras: ['pre', 'post'], x: 'Un navire noir aux canons massifs, hissé de drapeaux de la mafia, te hèle poliment. Un homme en costume sombre, barbe taillée, cigare au bec, te propose un « arrangement ». À côté de lui, un garde du corps aux lunettes noires sourit sans rien dire.',
    sp: { t: 'Conclure un pacte commercial', s: 'charisme', d: 3, ok: 'Il t\'offre des conditions honnêtes, et un peu de cigare : tu repars plus riche, et protégé par son nom.', ko: 'Il te fixe, impassible. « Je n\'aime pas les gens qui marchandent mal. »', e: { berrys: S => S.tierPrime(), rep: 2 } },
    talk: 'Il te serre la main avec un sourire glacial : « Les affaires sont les affaires. »', fight: 'Ses hommes sont organisés comme une armée. Tu essuies de lourdes pertes.' },
  { id: 'hawkins', name: 'Pirates de Hawkins', emoji: '🔮', cap: 'hawkins', tier: 2, sea: ['paradise', 'nw'], eras: ['pre', 'post'], x: 'Une voile pourpre, des tarots flottant autour d\'un homme torse nu, couvert de paille, aux yeux de braise. Basil Hawkins, le « Mage », te regarde sans cligner. « J\'ai tiré tes cartes hier, étranger. Elles ne parlaient pas de gloire. »',
    sp: { t: 'Te faire lire les cartes', s: 'volonte', d: 3, ok: 'Il te livre trois cartes : un conseil, un danger, une chance. Tu sens que le destin t\'a laissé un peu de marge.', ko: 'Les cartes te sont défavorables : une mort lui apparaît. Tu repars inquiet.', e: { morale: 8, stats: { volonte: 1 } } },
    talk: 'Il te remercie pour ta « présence calme ». Tu ne sais pas si c\'est un compliment.', fight: 'Son corps de paille encaisse tout. Tu comprends vite que ce n\'est pas toi qui a la main.' },
  { id: 'bonney', name: 'Pirates de Bonney', emoji: '🍔', cap: 'bonney', tier: 2, sea: ['paradise', 'nw'], eras: ['pre', 'post'], x: 'Une jeune femme aux cheveux roses, un énorme sandwich dans chaque main, te lance un clin d\'œil. « T\'as de quoi manger ? Sinon je te prends tout. » Autour d\'elle, ses hommes gloussent. Elle semble sans danger. Sa prime dit le contraire.',
    sp: { t: 'Partager un repas avec elle', r: { x: 'Elle dévore tout ce que tu proposes, puis te remercie par un tour de passe-passe qui rajeunit ton navire… de quelques mois. Vraiment étrange.', e: { morale: 15, shipHp: 60, hp: 30 } } },
    talk: 'Elle éclate de rire : « T\'es marrant ! Reviens quand t\'auras plus de viande. »', fight: 'Son pouvoir te fait vieillir de dix ans en une seconde. Tu bats en retraite, estomaqué.' },
  { id: 'apoo', name: 'Pirates On Air', emoji: '🎸', cap: 'scratchmen_apoo', tier: 2, sea: ['paradise', 'nw'], eras: ['pre', 'post'], x: 'Une musique stridente flotte sur la mer. Un navire à la proue en forme de guitare approche : Scratchmen Apoo, l\'homme aux dreadlocks et aux trois bras, chante en frappant son corps comme un tambour. « Un public ! Ça faisait longtemps ! »',
    sp: { t: 'Jouer avec eux', s: 'charisme', d: 2, ok: 'Tu improvises un refrain, et tout l\'équipage hurle de joie. Apoo te remet un médiator en souvenir.', ko: 'Tu es faux. Mais ils sont polis.', e: { morale: 20, loyalty: 6 } },
    talk: 'Il te remercie par une sérénade endiablée.', fight: 'Ses notes sonores te sonnent. Tu repars les oreilles en feu.' },
  { id: 'urouge', name: 'Pirates du Moine Fou', emoji: '🪘', cap: 'urouge', tier: 2, sea: ['paradise'], eras: ['pre'], x: 'Un moine géant, un bouclier gravé sur le dos, boit tranquillement dans une crique en lisant un sutra. Urouge, le « Moine Fou », t\'invite : « Bois, ou pars. Mais ne me dérange pas pendant la prière. »',
    sp: { t: 'Méditer avec lui', s: 'volonte', d: 3, ok: 'Une longue nuit de silence : tu en tires une sérénité qui ne s\'achète pas.', ko: 'Tu t\'agites trop. Il soupire.', e: { stats: { volonte: 2 }, morale: 6 } },
    talk: 'Il te donne une gourde et te bénit à sa façon.', fight: 'Ses frappes sont lentes, mais précises. Tu comprends qu\'il se retient.' },
  { id: 'cavendish', name: 'Pirates Beautiful', emoji: '🌹', cap: 'cavendish', tier: 2, sea: ['paradise', 'nw'], eras: ['pre', 'post'], x: 'Une galère d\'un blanc éclatant, des fleurs partout, un capitaine aux cheveux d\'or qui se coiffe sans cesse. Cavendish, le « Prince Pirate », te toise : « Ah, un public. Tu as de la chance de me voir. Ne bouge pas, on va faire un portrait. »',
    sp: { t: 'Le flatter', s: 'charisme', d: 2, ok: 'Il roule des épaules, ravi. « Tu as bon goût. Prends ceci. » Il te lance une bourse parfumée.', ko: 'Il te trouve sans goût et te le dit longuement.', e: { berrys: S => S.tierPrime() / 3, morale: 4 } },
    talk: 'Il t\'offre une rose, puis la reprend, vexé de la voir fanée.', fight: 'Sous sa fierté vit un autre homme, bien plus dangereux. Tu t\'en souviens à tes dépens.' },
  { id: 'barto', name: 'Pirates de Bartolomeo', emoji: '🛡️', cap: 'bartolomeo', tier: 2, sea: ['paradise', 'nw'], eras: ['post'], x: 'Un navire peint en rose, des drapeaux d\'un certain chapeau de paille, une foule de fans en pâmoison. Au centre, un homme à la coiffure verte hurle d\'une voix émue : « Vous l\'avez vu ? Dites-moi que vous l\'avez vu ! »',
    sp: { t: 'Lui parler de Luffy', r: { x: 'Il pleure de joie et t\'offre tout ce qu\'il a : provisions, tapis, et sa barrière personnelle sur ton navire.', e: { morale: 15, shipHp: 40, ship: { mod: 'coque' }, frel: { chapeau: 2 } } } },
    talk: 'Il t\'offre un autographe… de Luffy, sur un cheval de bois.', fight: 'Sa barrière te renvoie tes coups. Il s\'excuse ensuite.' },
  { id: 'donquixote', name: 'Pirates Donquixote', emoji: '🦩', cap: 'doflamingo', tier: 3, sea: ['paradise', 'nw'], eras: ['pre'], x: 'Un navire rose et plumeux vogue sur les flots. Sur le pont, des hommes aux masques de clowns, des officiers à cœur de pique, et un géant blond en manteau de plumes qui te sourit d\'un air aimable… mais pas de ses yeux. « Fufufufu… Tu es sur mon terrain de jeu. »',
    sp: { t: 'Lui proposer un marché d\'information', s: 'intel', d: 5, ok: 'Il apprécie ta culture. Il te livre un renseignement précieux… et te laisse partir.', ko: 'Il apprécie moins. Une lame de fil effleure ton cou.', e: { stats: { intel: 1 }, glory: 3 } },
    talk: 'Il rit longuement : « Tu m\'amuses, petit. Pour l\'instant. »', fight: 'Un fil invisible te capture, te soulève, te relâche. Il ne se donne même pas la peine de te tuer.' },
  { id: 'baroque', name: 'Baroque Works', emoji: '🎩', cap: 'crocodile', tier: 2, sea: ['paradise'], eras: ['pre'], x: 'Une brume de sable, un navire sans nom, des agents qui s\'appellent par des numéros : Baroque Works, l\'organisation secrète de Mr. 0. Un homme en costume avec un chapeau melon te tend une carte : « Mr. 3 te souhaite la bienvenue. Rejoins-nous, ou dégage. »',
    sp: { t: 'Infiltrer leur organisation', s: 'intel', d: 4, ok: 'Tu apprends leurs codes, leurs agents, leurs habitudes. Une information qui vaut cher.', ko: 'Ils te soupçonnent : une attaque « accidentelle » te blesse.', e: { stats: { intel: 2 } } },
    talk: 'On te raye de la liste des cibles. Pour l\'instant.', fight: 'Les agents ont des pouvoirs bizarres. Tu perds ton chemin dans leur piège.' },
  { id: 'krieg', name: 'Pirates de Don Krieg', emoji: '⚔️', cap: 'krieg', tier: 1, sea: ['east'], eras: ['pre'], x: 'Une immense galère couverte de canons, armée jusqu\'aux dents, se profile. Don Krieg, le « Seigneur des Pirates », te regarde de haut : « Ceci est mon territoire. Tu n\'as pas l\'air d\'un homme à qui on dit ça deux fois. »',
    sp: { t: 'Lui voler quelques armes pendant la nuit', s: 'vitesse', d: 2, ok: 'Tu repars avec une caisse de poudre et deux pistolets.', ko: 'On te repère : une rafale te frôle.', e: { berrys: S => S.tierPrime() / 2 } },
    talk: 'Il grogne : « Pas mal. Mais reste à ta place. »', fight: 'Son armure te résiste. Tu comprends que cet homme a de la force.' },
  { id: 'buggy', name: 'Pirates du Clown', emoji: '🤡', cap: 'baggy', tier: 1, sea: ['east', 'paradise'], eras: ['pre'], x: 'Un navire aux voiles à pois, une bande de clowns, et un capitaine au nez rouge qui hurle : « Je suis le grand Baggy ! Pays-moi ou je te découpe ! » Il est drôle et dangereux, ce qui est rare.',
    sp: { t: 'Applaudir son numéro de cirque', s: 'charisme', d: 1, ok: 'Il est tellement flatté qu\'il t\'offre une carte précieuse et un peu d\'or.', ko: 'Il croit à de la moquerie : il te lance un couteau.', e: { berrys: S => S.tierPrime() / 4, morale: 8 } },
    talk: 'Il pleure de joie : « Enfin quelqu\'un qui reconnaît le talent ! »', fight: 'Ses membres volent dans tous les sens : tu ne sais plus où frapper.' },
  { id: 'foxy', name: 'Pirates de Foxy', emoji: '🦊', cap: 'foxy', tier: 2, sea: ['paradise'], eras: ['pre', 'post'], x: 'Une foule bruyante sur une île de fortune : le « Davy Back Fight », un jeu où les pirates se défient pour voler des équipiers. Foxy, le Renard argenté, se tient en juge : « Je t\'invite à jouer. Les enjeux sont simples : on gagne, on prend. »',
    sp: { t: 'Participer à un duel du Davy Back Fight', s: 'combat', d: 4, ok: 'Tu remportes la manche ! L\'équipe adverse perd un de ses meilleurs éléments, qui rejoint ta cause.', ko: 'Tu perds. Foxy prend ce qu\'il veut : un peu d\'or et beaucoup de ta fierté.', e: { recruit: { role: 'combattant' }, glory: 3 } },
    talk: 'Il rit : « On se retrouve ! Je te garde un siège. »', fight: 'Le Davy Back Fight n\'est pas un combat, c\'est une tactique. Tu en payes le prix.' },
  { id: 'moria', name: 'Pirates de Moria', emoji: '🧟', cap: 'moria', tier: 3, sea: ['paradise'], eras: ['pre'], x: 'Un brouillard glacé, une carcasse de galion aussi grande qu\'une ville flottante, des zombies qui rôdent. Thriller Bark. Au sommet d\'une tour, un géant souriant qui joue avec sa propre ombre : Gecko Moria, ex-Corsaire. « Je collectionne les ombres. Tu veux la tienne ? »',
    sp: { t: 'Négocier ton ombre', s: 'charisme', d: 5, ok: 'Il te laisse ton ombre et un trophée de combat : un peu de gloire à ses dépens.', ko: 'Il rit et la prend. Tu te sens plus lent, mais en vie.', e: { glory: 5, stats: { volonte: 1 } } },
    talk: 'Il se rengorge : « Tu as bon goût. Reviens quand tu auras de l\'ombre à vendre. »', fight: 'Ses zombies sont partout. Tu t\'échappes de justesse.' },
  { id: 'soleil', name: 'Pirates du Soleil', emoji: '☀️', cap: 'jinbe', tier: 2, sea: ['paradise', 'nw'], eras: ['pre'], x: 'Une voile ornée d\'un soleil souriant. À la barre, un homme-poisson massif, des tatouages en spirale. Les Pirates du Soleil libèrent des esclaves en mémoire de Fisher Tiger. « Tu as l\'air d\'un homme qui hésite. Décide-toi, étranger. »',
    sp: { t: 'Aider à libérer des esclaves', s: 'combat', d: 4, ok: 'Vous brisez les chaînes d\'un navire négrier. Des dizaines de familles te remercient, et leur équipage te reconnaît comme allié.', ko: 'Le navire est mieux gardé que prévu. Tu repars blessé.', e: { glory: 5, rep: 8, frel: { ryugu: 3, revo: 2 } } },
    talk: 'Il te serre la main, solennel : « Les chaînes ne se brisent pas toutes seules. »', fight: 'Le karaté des hommes-poissons te cueille : tu comprends que c\'est une leçon.' },
  { id: 'kuja', name: 'Pirates Kuja', emoji: '🐍', cap: 'hancock', tier: 2, sea: ['paradise'], eras: ['pre', 'post'], x: 'Un navire à la proue en forme de serpent, une équipe exclusivement féminine, des archères aux yeux perçants. Les Pirates Kuja, guerrières d\'Amazon Lily, croisent ta route. Leur capitaine Boa Hancock, la plus belle femme du monde, te toise : « Les hommes sont des vermines. Mais je suis généreuse. »',
    sp: { t: 'Les traiter avec respect', s: 'charisme', d: 4, ok: 'Elle te trouve moins insupportable que la moyenne. Elle te laisse un laissez-passer pour Amazon Lily.', ko: 'Elle te lance un regard de pierre. Tu es soulagé de ne pas l\'être, littéralement.', e: { rep: 6, frel: { kuja: 3 } } },
    talk: 'Elle fait un geste de la main, magnanime : « Va. Et ne reviens pas. »', fight: 'Ses flèches te manquent à peine. Tu comprends que tu es en infériorité.' },
];

export const CANON_CREW_EVENTS = [];
for (const c of CREWS) for (const era of c.eras) {
  CANON_CREW_EVENTS.push({
    id: `cc_${c.id}_${era}`, once: true, emoji: c.emoji, title: c.name,
    w: { era, weight: 18, minTier: c.tier, sea: c.sea, test: S => !S.hasFlag('cc_met_' + c.id) },
    x: c.x,
    ch: [
      { t: `Aller à la rencontre de ${c.name.replace(/^Pirates (de |du |des )?/, '')}`, s: 'charisme', d: 2,
        ok: { x: c.talk, e: { flag: 'cc_met_' + c.id, rel: { [c.cap || 'luffy']: c.cap ? 1 : 0 }, rep: 2, glory: 1 } },
        ko: { x: 'On te congédie sèchement. Tu n\'as pas intéressé.', e: { flag: 'cc_met_' + c.id, morale: -3 } } },
      { t: c.sp.t, ...(c.sp.s ? { s: c.sp.s, d: c.sp.d, ok: { x: c.sp.ok, e: { ...c.sp.e, flag: 'cc_met_' + c.id } }, ko: { x: c.sp.ko, e: { flag: 'cc_met_' + c.id, hp: -10 } } } : { r: { x: c.sp.r.x, e: { ...c.sp.r.e, flag: 'cc_met_' + c.id } } }) },
      { t: 'Les défier au combat', s: 'combat', d: 5,
        ok: { x: 'Tu tiens tête à un équipage entier. Les récits de ton audace traversent la mer.', e: { flag: 'cc_met_' + c.id, glory: 6, rep: 4 } },
        ko: { x: c.fight, e: { flag: 'cc_met_' + c.id, hp: -30, shipHp: -20 } } },
    ],
  });
}

// les mêmes équipages se croisent aussi en pleine mer
for (const ev of [...CANON_CREW_EVENTS]) {
  CANON_CREW_EVENTS.push({ ...ev, id: ev.id.replace('cc_', 'cc_sea_'), w: { ...ev.w, ctx: 'sea', weight: 9 }, x: 'En mer : ' + ev.x.charAt(0).toLowerCase() + ev.x.slice(1) });
}
