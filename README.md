# 🏴‍☠️ Destiny One Piece

Jeu de choix narratif inspiré de *Destiny Eleven*, dans l'univers de **One Piece**.
Pirate, Marine, révolutionnaire, agent du CP ou Chevalier Divin : tu prends les décisions, la mer décide du reste.
Le but : trouver le One Piece (ou le protéger) en allant le plus loin possible.

## Jouer
Site statique, sans build : ouvrir `index.html` via un serveur (`python3 -m http.server`) ou publier sur **GitHub Pages**
(Settings → Pages → Deploy from branch → `/root`).

## Contenu
- **Modes** : Carrière (rapide ≈10 min ou vraie saga), Défi du jour, Duel entre amis (code partageable), Mode Histoire (Luffy, Law, Baggy, Koby, Smoker, Sabo, Lucci, Ace, Robin), Quêtes & badges, Panthéon.
- **Mers** : les 4 Blues, Paradise, Calm Belt, Red Line, Nouveau Monde, Laugh Tale. Départ possible directement sur Grand Line ou dans le Nouveau Monde.
- **~60 îles canon**, des arcs majeurs aux lieux à peine mentionnés (Oykot, Tequila Wolf, Swallow, Minion, God Valley, Baterilla, Sorbet, Food Valten, Lodestar...).
- **Factions** : pirate indépendant, sous un Empereur, Corsaire, Empereur, Révolution, chasseur de primes, Marine, Gouvernement mondial, Chevalier Divin. Changements de camp aux moments clés.
- **Races** : Humain, Homme-poisson, Sirène/Triton, Mink, Géant, Longs-Bras, Longues-Jambes, Trois-Yeux, Lunarien, Tontatta (avantages, inconvénients et événements propres ; imposée dans le Défi du jour).
- **Vie rangée** : au bord de la mort, choisir de raccrocher plutôt que de risquer de mourir (score réduit).
- **Progression** : caractéristiques, fruits du démon canon et inédits (acheter, refuser, donner à l'équipage, SMILE), Haki (observation, armement, rois), armes, navire, équipage (10 max puis flotte), alliés canon.
- **Niveau** : Civil → Menace locale → Rookie → Supernova → Corsaire → YC3 → YC2 → YC1 → Yonko/Amiral → RDP.
- **Objectif** : 4 Poneglyphes routiers, un lecteur, Laugh Tale.
- **Voyages en 3D** (Three.js, intégré dans `js/vendor`) : un navire vers un diorama low-poly de l'île.
- **Partage** : texte prêt pour X/Twitter et avis de recherche WANTED en image.

## Importer toute la base One Piece
Un tutoriel complet (récupération du wiki, conversion, franciser, validation, rééquilibrage) est dans
[`docs/TUTO_DONNEES.md`](docs/TUTO_DONNEES.md). Outils : `tools/fetch-wiki.mjs`, `tools/build-data.mjs`,
`tools/validate-data.mjs`, `tools/bench.mjs`. Le jeu fonctionne sans import (`js/data/generated.js` est vide par défaut).

## Structure
- `js/engine.js` : moteur (hasard déterministe, jets, effets, navigation, fins).
- `js/data/` : îles, factions, objets, personnages, événements, légendes, badges.
- `js/main.js` : interface. `js/voyage3d.js` : 3D. `js/share.js` : avis de recherche.

Jeu de fan non officiel. One Piece © Eiichiro Oda / Shūeisha / Toei Animation.
