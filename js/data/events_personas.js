// Scènes originales avec des personnages canon : le personnage est fidèle à lui-même, la situation est inventée.
// Un archétype fournit les trois choix (duelliste, mentor, marchand, soigneur, farceur, noble, filou, officier de la Marine).
import { CHARACTERS } from './characters.js';
import { MORE_PERSONAS } from './characters_more.js';

const firstName = id => (CHARACTERS[id]?.name || id).split(',')[0].split('(')[0].trim();
const isCh = S => S.camp === 'chercheur', isGa = S => S.camp === 'gardien';
const KINDS = {
  duelist: (id, n, t) => [
    { t: `Relever le défi de ${n}`, s: 'combat', d: 2 + t, ok: { x: `Tu tiens tête à ${n}, coup pour coup. Il hoche la tête, impressionné.`, e: { glory: 3 + t, rel: { [id]: 1 }, stats: { force: 1 } } }, ko: { x: `${n} t'écrase en quelques coups, sans méchanceté. Tu repars humilié, mais plus lucide.`, e: { hp: -20 - 8 * t, rel: { [id]: 0 } } } },
    { t: 'Demander un combat d\'entraînement', s: 'volonte', d: 1 + t, ok: { x: `Il se retient volontairement : tu progresses vite, et il te le reconnaît.`, e: { stats: { volonte: 1 }, rel: { [id]: 1 }, morale: 5 } }, ko: { x: 'Tu t\'épuises avant de comprendre ce qu\'il t\'apprend.', e: { hp: -12 } } },
    { t: 'Décliner poliment', s: 'charisme', d: 1, ok: { x: `${n} hausse les épaules : « Une autre fois. »`, e: { rel: { [id]: 0 } } }, ko: { x: 'Il y voit de la lâcheté. Il ne te le dit pas, mais ça se voit.', e: { morale: -4 } } },
  ],
  mentor: (id, n, t) => [
    { t: `Lui demander de t'enseigner`, s: 'volonte', d: 1 + t, ok: { x: `${n} te livre une leçon à sa manière : sèche, précise, mémorable.`, e: { stats: { volonte: 1, force: 1 }, rel: { [id]: 1 }, glory: 1 } }, ko: { x: 'Tu n\'as pas la patience de comprendre. Il le dit sans colère.', e: { morale: -4 } } },
    { t: 'Lui demander un conseil de route', s: 'intel', d: 1, ok: { x: 'Il te glisse un renseignement que peu de gens possèdent.', e: { stats: { navigation: 1, intel: 1 }, rel: { [id]: 1 } } }, ko: { x: 'Il sourit, énigmatique : « Cherche toi-même. »', e: {} } },
    { t: `Offrir un verre à ${n}`, c: S => S.tierPrime() / 20, r: { x: 'Vous parlez longtemps, et la conversation te fait du bien.', e: { morale: 10, rel: { [id]: 1 } } } },
  ],
  merchant: (id, n, t) => [
    { t: 'Marchander avec lui', s: 'charisme', d: 1 + t, ok: { x: `Tu obtiens un bon prix. ${n} sourit : « Tu as le sens des affaires. »`, e: { berrys: S => S.tierPrime() / 2, rel: { [id]: 1 } } }, ko: { x: 'Il te roule dans la farine, avec le sourire.', e: { berrys: S => -S.tierPrime() / 10 } } },
    { t: 'Acheter son information', c: S => S.tierPrime() / 8, r: { x: `${n} te vend un renseignement précis sur la prochaine île.`, e: { stats: { intel: 1 }, rel: { [id]: 1 } } } },
    { t: 'Proposer un échange de services', s: 'intel', d: 2 + t, ok: { x: 'Un marché équitable : il t\'aide, tu l\'aides. Tu gagnes un contact utile.', e: { berrys: S => S.tierPrime() / 4, morale: 6, rel: { [id]: 1 } } }, ko: { x: 'Il te trouve trop gourmand.', e: { rel: { [id]: -1 } } } },
  ],
  healer: (id, n, t) => [
    { t: 'Te laisser soigner', r: { x: `${n} s'occupe de toi avec une efficacité tranquille. Tu repars en forme.`, e: { hp: 999, heal: true, rel: { [id]: 1 } } } },
    { t: 'Lui parler de tes soucis', s: 'charisme', d: 1, ok: { x: 'Il t\'écoute vraiment. Quelque chose se dénoue dans ta tête.', e: { morale: 15, loyalty: 5, rel: { [id]: 1 } } }, ko: { x: 'Tu n\'arrives pas à te livrer. Il le comprend.', e: { morale: 3 } } },
    { t: 'Lui acheter des remèdes', c: S => S.tierPrime() / 10, r: { x: 'Quelques herbes et un onguent : tu t\'en serviras.', e: { hp: 40, morale: 6 } } },
  ],
  comic: (id, n, t) => [
    { t: `Te prêter au jeu de ${n}`, s: 'charisme', d: 1, ok: { x: `Vous vous amusez comme des enfants. Ton équipage rit de bon cœur en vous voyant.`, e: { morale: 18, loyalty: 6, rel: { [id]: 1 } } }, ko: { x: 'Tu te ridiculises. Ça fait rire quand même.', e: { morale: 6 } } },
    { t: 'Lui rendre la pareille avec humour', s: 'charisme', d: 2, ok: { x: `${n} éclate de rire : « T'es des nôtres ! » Il te laisse un petit cadeau.`, e: { berrys: S => S.tierPrime() / 5, morale: 10, rel: { [id]: 1 } } }, ko: { x: 'Ta blague tombe à plat.', e: { morale: -2 } } },
    { t: 'L\'ignorer poliment', r: { x: 'Il fait une grimace, puis passe à autre chose.', e: {} } },
  ],
  noble: (id, n, t) => [
    { t: 'Te présenter avec respect', s: 'charisme', d: 1 + t, ok: { x: `${n} t'accueille avec bienveillance. Une audience qui compte.`, e: { rep: 5, berrys: S => S.tierPrime() / 3, rel: { [id]: 1 } } }, ko: { x: 'Ton protocole est maladroit, mais on ne t\'en tient pas rigueur.', e: { rep: 1 } } },
    { t: 'Lui demander une faveur', s: 'charisme', d: 3 + t, ok: { x: `${n} t'offre un coup de pouce : un navire de soutien se joint à toi quelque temps.`, e: { fleet: { name: 'Escorte de faveur', power: 2 + t }, rel: { [id]: 1 } } }, ko: { x: 'La faveur est refusée avec élégance.', e: { rep: -1 } } },
    { t: 'Rester discret', r: { x: 'Tu observes de loin. Ça n\'est pas inutile.', e: { stats: { intel: 1 } } } },
  ],
  rogue: (id, n, t) => [
    { t: 'Négocier avec prudence', s: 'intel', d: 2 + t, ok: { x: `Tu obtiens un accord honorable. ${n} reste méfiant, mais honnête.`, e: { berrys: S => S.tierPrime() / 2, rel: { [id]: 1 } } }, ko: { x: 'Il te mène en bateau. Tu perds un peu de ta bourse.', e: { berrys: S => -S.tierPrime() / 8 } } },
    { t: 'Le surveiller avant d\'agir', s: 'vitesse', d: 2 + t, ok: { x: 'Tu comprends ses habitudes. Tu en tires un avantage.', e: { glory: 2, stats: { intel: 1 } } }, ko: { x: 'Il te repère immédiatement. Il ne dit rien, mais ça se paie.', e: { hp: -10 } } },
    { t: 'Le défier', s: 'combat', d: 3 + t, ok: { x: `Tu prends ${n} au dépourvu. Il recule.`, e: { glory: 3 + t, rel: { [id]: -1 } } }, ko: { x: 'Il avait prévu ton geste.', e: { hp: -25 - 6 * t } } },
  ],
  marine: (id, n, t) => [
    { t: 'Coopérer avec lui (Marine / Gouvernement)', req: isGa, rq: 'Pour les Gardiens', s: 'charisme', d: 1, ok: { x: `${n} reconnaît ta rigueur. Un rapport favorable partira ce soir.`, e: { merit: 6, rel: { [id]: 1 }, glory: 2 } }, ko: { x: 'Il te trouve brouillon. Un point de moins dans ton dossier.', e: { merit: -3 } } },
    { t: 'Éviter le contrôle (pirate)', req: isCh, rq: 'Pour les chercheurs', s: 'charisme', d: 2 + t, ok: { x: 'Ton aplomb passe. Il te laisse filer, sans enthousiasme.', e: { rel: { [id]: 0 } } }, ko: { x: 'Il flaire le mensonge. On te surveille de près pour un moment.', e: { hp: -12, rel: { [id]: -1 } } } },
    { t: 'Lui tenir tête', s: 'combat', d: 3 + t, ok: { x: `Tu le fais reculer. ${n} se souviendra de toi.`, e: { glory: 4 + t, rel: { [id]: -1 } } }, ko: { x: 'Il t\'écrase sans effort. La Marine a le bras long.', e: { hp: -28 - 6 * t } } },
  ],
};

// Personnages principaux et secondaires déjà dans la base : scènes inventées, personnage fidèle à lui-même
const MAJOR = [
  ['garp', 'mentor', 'Un vieil homme en manteau de la Marine, un paquet de biscuits sous le bras, t\'aborde comme si de rien n\'était : « Hé, toi ! Tu as l\'air d\'un jeune qui a du potentiel ! Viens, je t\'offre un entraînement. »'],
  ['sengoku', 'mentor', 'Un homme à la barbe fournie, un manteau de Justice sur les épaules, observe la mer d\'un air las. Il te toise : « Je n\'ai plus d\'illusions, mais j\'ai encore un conseil. À qui veut bien l\'entendre. »'],
  ['akainu', 'marine', 'Un homme au regard de braise, un manteau « Justice absolue » flottant sur ses épaules, traverse la foule sans la voir. Il s\'arrête devant toi : « Je ne tolère pas l\'incertitude. Dis-moi qui tu es. »'],
  ['kizaru', 'marine', 'Un homme élancé aux lunettes teintées, un petit sourire aux lèvres, avance en traînant les pieds : « Oooh~ qu\'est-ce que c\'est que ça ? Un pirate ? Ou un Marine ? Les deux ? »'],
  ['aokiji', 'mentor', 'Un homme endormi sur un hamac improvisé, un masque de sommeil sur le front, se redresse paresseusement : « Hm ? Un jeune ? Dis-moi, qu\'est-ce que tu cherches vraiment ? »'],
  ['fujitora', 'noble', 'Un homme aveugle, une canne-sabre à la main, avance avec un calme absolu : « Je me fie à ce que j\'entends, étranger. Dis-moi ce que tu veux dire. »'],
  ['mihawk', 'duelist', 'Un homme aux yeux de rapace, un grand sabre noir dans le dos, te contemple sans bouger. Une voix grave : « Tu cherches un adversaire à ta hauteur. Je ne suis pas sûr que tu le trouves ici. »'],
  ['shanks', 'mentor', 'Un homme à la cicatrice sur l\'œil, un bras en moins, lève sa chope d\'un geste fraternel : « Viens boire ! Les grands rêves se partagent mieux avec un verre. »'],
  ['barbeblanche', 'mentor', 'Un vieil homme gigantesque, moustache en croissant, assis dans un fauteuil roulant au milieu d\'une tempête de rires, te regarde avec bienveillance : « Viens, mon fils. Ici, on est une famille. »'],
  ['marco', 'healer', 'Un homme blond à l\'air nonchalant, un tatouage de Barbe Blanche sur la poitrine, se gratte la nuque : « Hé, tu as l\'air blessé. Je peux jeter un œil, si tu veux. »'],
  ['bigmom', 'noble', 'Une femme énorme aux cheveux roses éclate d\'un rire tonitruant : « Bwahaha ! Un invité ! Tu as des douceurs à m\'offrir ? Ou tu veux que je t\'invite à mon thé ? »'],
  ['katakuri', 'duelist', 'Un homme grand, une écharpe cachant sa bouche, mange silencieusement un beignet. Il lève un regard calme sur toi : « Je ne suis pas là pour t\'embêter. Mais je ne refuse jamais un bon combat. »'],
  ['kaido', 'rogue', 'Un colosse aux cornes, une massue sur l\'épaule, une cruche à la main, te dévisage de ses yeux de dragon : « Hé, toi. Tu veux mourir glorieusement ? Je cherche un bon combat. »'],
  ['dragon', 'mentor', 'Un homme à capuche, tatouage sur le visage, te regarde sans un mot, puis parle d\'une voix calme : « Le monde attend un changement. Toi, tu as déjà commencé à le chercher. »'],
  ['sabo', 'merchant', 'Un jeune homme élégant, haut-de-forme et tuyau en main, sourit : « Les révolutionnaires cherchent toujours des gens de confiance. Si tu as des informations, je suis preneur. »'],
  ['koala', 'merchant', 'Une jeune femme au sourire franc, un badge de la Révolution sur le col, t\'aborde : « Un passage sûr pour les opprimés, ça te dit quelque chose ? Je suis prête à négocier. »'],
  ['ace', 'duelist', 'Un jeune homme à la peau tachetée de taches de rousseur, chapeau orange, t\'adresse un sourire en coin : « Hé, toi ! Un combat amical ? Je ne me retiens pas. »'],
  ['law', 'merchant', 'Un homme au chapeau tacheté, un grand sabre sur l\'épaule, soupire : « J\'ai des informations, et j\'ai besoin de quelque chose en échange. Ça t\'intéresse ? »'],
  ['kidd', 'duelist', 'Un homme aux cheveux rouges, bras mécanique en ferraille, te heurte du regard : « Toi, là ! Tu veux un combat ? Allez, montre-moi ce que tu as ! »'],
  ['vivi', 'noble', 'Une jeune princesse aux cheveux bleus, vêtue simplement, t\'accueille chaleureusement : « Merci d\'être venu. Mon pays a besoin de gens courageux, comme toi. »'],
  ['rayleigh', 'mentor', 'Un vieil homme aux lunettes, une cigarette aux lèvres, lit un journal : « Tu me rappelles quelqu\'un. Un vieux compagnon. Dis-moi, qu\'est-ce qui te pousse en mer ? »'],
  ['crocus', 'healer', 'Un vieux médecin à la crête improbable, les mains calleuses, t\'examine d\'un œil critique : « Tu as l\'air fatigué. Un bon repas, un bon sommeil, et un bon conseil. Je ne facture pas les trois. »'],
  ['kureha', 'healer', 'Une vieille femme à la cigarette, le regard perçant, ricane : « Tu vois cette fiole ? C\'est un remède. Ou un poison. Selon mon humeur. »'],
  ['iceburg', 'merchant', 'Un homme élégant, un museau de souris sur l\'épaule, discute avec ses ouvriers : « Un navire, ça se choie. Je peux te proposer quelque chose de bien. »'],
  ['zeff', 'healer', 'Un cuisinier à la jambe de bois, une moustache en bataille, sert un plat fumant : « Mange. On discute après. Un affamé n\'écoute pas. »'],
  ['cricket', 'merchant', 'Un homme à la barbe fournie, une armure de fortune, un sourire de trésor : « Hé ! Des visiteurs ! Je cherche de l\'or depuis dix ans, tu veux m\'aider ? »'],
  ['hancock', 'noble', 'Une femme d\'une beauté éblouissante, escortée de guerrières, te toise de haut : « Les hommes sont des vermines. Mais je suis de bonne humeur. Que veux-tu ? »'],
  ['kuma', 'rogue', 'Un homme massif, un livre à la main, une patte d\'ours tatouée dans la paume, te regarde sans expression : « Je n\'ai pas de rancune. Mais j\'obéis. »'],
  ['moria', 'rogue', 'Un géant souriant, un grand chapeau noir sur la tête, joue avec des ombres : « Kishishishi ! Une ombre de plus, c\'est toujours une bonne affaire. »'],
  ['enel', 'duelist', 'Un homme torse nu, des tambours dans le dos, flotte au-dessus d\'un nuage orageux : « Je suis Dieu ici. Prouve-moi le contraire. »'],
  ['vegapunk', 'merchant', 'Un petit homme en blouse blanche, le crâne énorme, te serre la main avec enthousiasme : « Quel esprit curieux ! J\'ai justement besoin d\'un cobaye volontaire. »'],
  ['caesar', 'rogue', 'Un savant à la mâchoire carrée, un sourire de mauvais présage : « Shurororo ! Tu as des gènes intéressants. Un petit prélèvement, peut-être ? »'],
  ['smoker', 'marine', 'Un homme à la veste blanche, deux cigares aux lèvres, un jitte à la main, te regarde dans la fumée : « Pirate. Je te connais. »'],
  ['tashigi', 'marine', 'Une jeune femme aux lunettes, un sabre à la ceinture, rougit en te demandant : « Pardon, c\'est un beau sabre ! Où l\'avez-vous eu ? »'],
  ['koby', 'marine', 'Un jeune Marine, un casque trop grand sur la tête, te salue avec trop d\'enthousiasme : « Je suis Koby ! Un jour, je serai amiral. Tu peux m\'aider ? »'],
  ['hina', 'marine', 'Une femme aux cheveux roses, une cigarette aux lèvres, se tourne vers toi : « Hina est inquiète. Hina n\'aime pas les pirates. Surtout les mal rasés. »'],
  ['tsuru', 'mentor', 'Une vieille dame aux cheveux blancs, un livre sous le bras, t\'invite à la suivre : « Assieds-toi, jeune. J\'ai beaucoup à te dire sur la Justice. »'],
  ['lucci', 'rogue', 'Un homme en costume, un pigeon sur l\'épaule, t\'adresse un sourire glacial : « Nous n\'aimons pas les surprises. Mais je suis curieux de te voir au travail. »'],
  ['yamato', 'duelist', 'Une jeune guerrière à la corne de dragon, une massue à la main, te sourit : « Je veux voir le monde ! Un combat d\'abord, tu veux ? »'],
  ['pedro', 'mentor', 'Un mink félin aux moustaches fières, une épée sur le dos, te prévient : « Les Minks ne reculent pas. Mais ils savent écouter. »'],
];
for (const [id, kind, hook] of MAJOR) if (CHARACTERS[id] && KINDS[kind]) MORE_PERSONAS.push({ id, kind, hook });

const tierOfPower = p => (p <= 12 ? 0 : p <= 30 ? 1 : 2);
export const PERSONA_EVENTS = [];
for (const p of MORE_PERSONAS) {
  const c = CHARACTERS[p.id]; if (!c || !KINDS[p.kind]) continue;
  const n = firstName(p.id), t = tierOfPower(c.power);
  const eras = [c.isl.pre?.length ? 'pre' : null, c.isl.post?.length ? 'post' : null].filter(Boolean);
  const eraList = eras.length ? eras : ['pre', 'post'];
  for (const era of eraList) {
    const base = { id: `pe_${p.id}_${era}`, once: true, emoji: c.emoji, title: n, w: { era, weight: 10, minTier: Math.max(1, t + (c.power > 12 ? 0 : 0)), test: S => !S.hasFlag('pe_met_' + p.id) }, x: p.hook, ch: KINDS[p.kind](p.id, n, t) };
    for (const ch of base.ch) for (const k of ['r', 'ok', 'ko']) if (ch[k]) { const e = { ...(ch[k].e || {}), flag: 'pe_met_' + p.id }; if (e.rel) { e.rel = Object.fromEntries(Object.entries(e.rel).filter(([, v]) => v)); if (!Object.keys(e.rel).length) delete e.rel; } ch[k].e = e; }
    PERSONA_EVENTS.push(base);
    PERSONA_EVENTS.push({ ...base, id: `pe_sea_${p.id}_${era}`, w: { ...base.w, ctx: 'sea', weight: 5 }, x: 'En mer : ' + p.hook.charAt(0).toLowerCase() + p.hook.slice(1) });
  }
}
