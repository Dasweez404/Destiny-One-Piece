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
