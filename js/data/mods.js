// Modificateurs de carrière. Défis : gratuits, ils durcissent la partie et multiplient le score.
// Bonus : achetés au Panthéon avec des Perles (gagnées en fin de partie, succès et défis).
export const MODS = [
  { id: 'storm', kind: 'defi', emoji: '🌩️', name: 'Mer agitée', desc: 'Tous tes jets : −5 %.', mult: 1.2 },
  { id: 'hunted', kind: 'defi', emoji: '🎯', name: 'Tête mise à prix', desc: 'Tu pars avec 30 M ฿ de prime et la Marine à tes trousses.', mult: 1.2 },
  { id: 'fragile', kind: 'defi', emoji: '🩹', name: 'Fragile', desc: 'PV max −25.', mult: 1.25 },
  { id: 'broke', kind: 'defi', emoji: '🪙', name: 'Sans le sou', desc: 'Tu pars sans un berry.', mult: 1.15 },
  { id: 'rush', kind: 'defi', emoji: '⏱️', name: 'Contre la montre', desc: '3 escales de moins.', mult: 1.2 },
  { id: 'purse', kind: 'bonus', cost: 30, emoji: '💰', name: 'Bourse garnie', desc: '+3 M ฿ au départ.' },
  { id: 'hardy', kind: 'bonus', cost: 40, emoji: '💪', name: 'Solide', desc: 'PV max +15.' },
  { id: 'blade', kind: 'bonus', cost: 50, emoji: '🗡️', name: 'Arme de famille', desc: 'Tu pars avec une meilleure arme.' },
  { id: 'mate', kind: 'bonus', cost: 60, emoji: '🤝', name: 'Un compagnon', desc: 'Un équipier fidèle te rejoint dès le départ.' },
  { id: 'lucky', kind: 'bonus', cost: 90, emoji: '🍀', name: 'Bonne étoile', desc: 'Tous tes jets : +4 %.' },
  { id: 'hull', kind: 'bonus', cost: 80, emoji: '⚓', name: 'Meilleur navire', desc: 'Ton navire est d\'une classe au-dessus.' },
  { id: 'fruit', kind: 'bonus', cost: 160, emoji: '🍇', name: 'Fruit en poche', desc: 'Tu possèdes un Fruit du Démon dès le départ (à manger quand tu veux).' },
];
export const MOD = Object.fromEntries(MODS.map(m => [m.id, m]));
export const MAX_MODS = 3;
export const modMult = ids => (ids || []).reduce((a, id) => a * (MOD[id]?.mult || 1), 1);
export const pearlsFor = (score, newBadges, ok) => Math.max(1, Math.floor(score / 250)) + newBadges * 12 + (ok ? 15 : 0);
