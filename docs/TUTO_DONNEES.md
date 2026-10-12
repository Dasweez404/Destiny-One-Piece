# 📚 Tutoriel : intégrer toute la base de données One Piece

Ce guide explique comment faire entrer dans le jeu **toutes les îles et tous les personnages** du
[One Piece Wiki](https://onepiece.fandom.com), au-delà de la sélection écrite à la main (~70 îles, ~95 personnages).

> **Pourquoi ce n'est pas déjà fait ?** Dans l'environnement cloud où le jeu a été développé, le réseau bloque
> `onepiece.fandom.com` (et Wikipedia). Les données actuelles ont donc été écrites de mémoire. La chaîne d'outils
> ci-dessous est prête et testée sur des articles d'essai : il suffit de l'exécuter **là où le wiki est accessible**.

---

## 0. Vue d'ensemble

```
 wiki (API MediaWiki)
        │  tools/fetch-wiki.mjs        ← 1. télécharge le wikitext dans tools/cache/
        ▼
 tools/cache/islands/*.wikitext
 tools/cache/characters/*.wikitext
        │  tools/build-data.mjs        ← 2. convertit (règles : tools/mapping.json,
        ▼                                    corrections : tools/overrides.json)
 js/data/generated.js                  ← 3. lu automatiquement par le jeu
        │  tools/validate-data.mjs     ← 4. vérifie + joue des parties de test
        ▼
 jeu enrichi (îles dans les routes, personnages rencontrables, réputation de groupe)
```

Le jeu **fonctionne sans** `generated.js` (il est livré vide) : l'import est purement additif. Une île ou un
personnage écrit à la main n'est **jamais** remplacé.

**Ce que l'import apporte tout seul :** des îles (sur les routes, avec diorama 3D, services, événements génériques) et
des personnages (rencontres, réputation de groupe, indice de combat). **Ce qu'il n'apporte pas tout seul :** des
histoires spécifiques à chaque lieu (étape 7 : on les écrit, avec l'aide de Claude si on veut).

---

## 1. Obtenir l'accès au wiki

### Option A (la plus simple) : travailler sur ton ordinateur
1. Installe [Node.js 18+](https://nodejs.org) (aucune dépendance npm à installer).
2. Clone le dépôt et place-toi sur la branche du jeu.
3. Teste : `curl -I "https://onepiece.fandom.com/api.php?action=query&meta=siteinfo&format=json"` doit répondre `200`.
4. Fais tout le tutoriel en local, puis `git add js/data/generated.js tools/overrides.json` et pousse.

### Option B : débloquer l'accès dans l'environnement cloud
1. Menu de l'environnement dans la barre de titre de la session → **Edit** → **Network access**.
2. Soit un niveau d'accès plus large, soit ajouter `onepiece.fandom.com` aux **Allowed domains**
   (garder « Allow package managers » coché).
3. Procédure officielle : <https://code.claude.com/docs/en/cloud-environments#network-access>
4. Relance la session, puis refais le test `curl` ci-dessus.

> Erreurs fréquentes : `ENOTFOUND` ou `403` = réseau bloqué (revenir ici) · `429` = trop de requêtes
> (le script réessaie tout seul, ne le lance pas en parallèle).

---

## 2. Explorer le wiki (5 minutes)

Les noms exacts des catégories peuvent changer : **vérifie-les avant de télécharger.**

```bash
node tools/fetch-wiki.mjs --list-categories "Category:Locations"
node tools/fetch-wiki.mjs --list-categories "Category:Characters"
```

Cherche des catégories du type « Islands », « Towns », « Countries », « Blue Seas Locations », « Characters by
affiliation ». Note-les. Tu peux aussi parcourir <https://onepiece.fandom.com/wiki/Category:Locations> dans ton navigateur.

---

## 3. Télécharger les articles

```bash
# Îles et lieux (remplace la catégorie par celle que tu as trouvée à l'étape 2)
node tools/fetch-wiki.mjs --category "Category:Islands" --kind islands

# Personnages : commence petit, puis élargis
node tools/fetch-wiki.mjs --category "Category:Characters" --kind characters --limit 300

# Ou une liste précise
node tools/fetch-wiki.mjs --pages "Mokomo Dukedom,Cacao Island,Kano Country" --kind islands
```

- Le script télécharge 25 articles par requête, 1 requête par seconde, et **reprend où il s'est arrêté**
  (les articles déjà en cache ne sont pas retéléchargés).
- Le cache est dans `tools/cache/` : il est ignoré par git (taille, licence). Compte quelques minutes pour des centaines d'îles
  et plus de temps pour des milliers de personnages.
- Stratégie recommandée pour les personnages : **ne pas tout importer d'un coup.** Commence par les ~300 plus importants
  (ceux avec une prime ou un grade), joue, puis élargis. Un personnage sans île ne sera jamais rencontré.

---

## 4. Régler la conversion (mapping)

Le script lit la fiche (« infobox ») de chaque article. Les **noms de champs** de la fiche peuvent différer de ce que
j'ai supposé : vérifie sur quelques articles réels.

```bash
node tools/inspect.mjs "Alabasta"
node tools/inspect.mjs "Monkey D. Luffy" --kind characters
```

Compare avec `tools/mapping.json` → section `fields`. Exemple : si la fiche utilise `|sea =` et pas `|region =`, ajoute
`"sea"` à la liste `region`. Puis fais un essai à blanc :

```bash
node tools/build-data.mjs --report
```

Le bilan indique ce qui a été converti et ce qui a été ignoré (« mer inconnue », « pas de fiche », « déjà dans le jeu »).
Répète jusqu'à ce que le taux d'îles ignorées « mer inconnue » soit faible. Les autres sections de `mapping.json` :

| Section | Rôle |
|---|---|
| `seas` | Texte du wiki → mer du jeu (`east`, `north`, `west`, `south`, `paradise`, `calm`, `redline`, `nw`) |
| `themes` | Mots-clés → forme du diorama 3D (`desert`, `neige`, `jungle`, `ruines`, `ville`, `japon`…) |
| `groups` | Affiliation → groupe de réputation (`marine`, `revo`, `gov`, `chapeau`…) |
| `rankPower` | Grade/titre → indice de combat (Amiral = 64, Commandant = 48…) |
| `alignByGroup` | Groupe → camp du personnage |

**Puissance des personnages :** si le personnage a une prime, `puissance = 8 + 11 × log10(prime / 1 M)`
(100 M → 30, 1 Md → 41, 5 Md → 49), sinon le grade. C'est volontairement grossier : on corrige à l'étape 5.

---

## 5. Corriger et franciser (`tools/overrides.json`)

C'est le **seul** fichier que tu édites à la main. Clé = titre exact de l'article. Tous les champs sont optionnels :

```json
{
  "skip": ["Page à ne pas importer"],
  "islands": {
    "Mokomo Dukedom": {
      "name": "Duché de Mokomo", "sub": "Sur le dos de Zunisha",
      "desc": "Le duché des Minks, bâti sur un éléphant millénaire.",
      "sea": "nw", "pop": 3, "after": "zou", "era": "post",
      "th": { "k": "jungle", "g": 6511690, "a": 12921980 },
      "svc": ["tavern", "market", "rest"]
    }
  },
  "characters": {
    "Crocodile": { "name": "Sir Crocodile", "power": 38, "group": "corsaires",
                   "quote": "Les rêves, ça ne sert à rien.",
                   "isl": { "pre": ["alabasta"], "post": ["karaibari"] } }
  }
}
```

À retenir :
- `after` : id de l'île **après** laquelle l'insérer dans la route (sinon : en fin de route de sa mer).
- `era` : `"pre"` (avant Marineford) ou `"post"` (après Wano) pour les lieux qui n'existent qu'à une époque.
- `pop` : 1 = à peine mentionnée, 2 = connue, 3 = arc majeur (événements plus gros, récompenses plus grosses).
- `force: true` : importer quand même un article détecté comme « déjà dans le jeu ».
- Les îles marquées `needsFr` (texte encore en anglais) apparaissent dans le bilan : fais-les traduire par lot.

### Faire franciser avec Claude
Les textes du wiki sont sous licence **CC BY-SA** : on **réécrit** (faits, pas copie), on ne colle pas de longs passages.
Prompt type à donner à Claude avec la liste des îles `needsFr` (tu les trouves dans `js/data/generated.js`) :

```text
Pour chaque île ci-dessous, écris en français, dans le ton du jeu (humour et un peu de sérieux, 1 à 2 phrases
sans spoiler gratuit) : "name" (nom français usuel), "sub" (sous-titre court), "desc". Ne recopie pas le texte anglais.
Réponds avec un JSON valide { "<titre exact>": { "name": "...", "sub": "...", "desc": "..." } } prêt à être fusionné dans
la clé "islands" de tools/overrides.json. Îles : <colle ici titre + description anglaise>
```

---

## 6. Générer, valider, jouer

```bash
node tools/build-data.mjs              # écrit js/data/generated.js
node tools/validate-data.mjs           # cohérence + 150 parties de test automatiques
python3 -m http.server 8000            # puis ouvre http://localhost:8000
```

`validate-data.mjs` **échoue** (code de sortie 1) si une île a une mer inconnue, si un personnage cite une île inexistante,
si une route référence une île absente, ou si une partie de test plante. Il **avertit** (sans échouer) pour :
texte à franciser, île absente des routes, personnage sans groupe ou sans île.

**Règle d'or : ne publie jamais avec une erreur.** Les avertissements sont des pistes d'amélioration.

---

## 7. Aller plus loin : donner de la vie aux nouveaux lieux

Une île importée reçoit les événements génériques (taverne, marché, tyran, trésor…) et les rencontres de ses personnages.
Pour une vraie histoire locale, ajoute un événement dans `js/data/events_alt.js` (ou un nouveau fichier branché dans
`js/engine.js`, comme `events_arcs.js`).

### Format d'un événement

```js
{
  id: 'mokomo_pleine_lune', pri: 10, emoji: '🌕', title: 'La pleine lune de Mokomo',
  w: { isl: ['mokomo_dukedom'], era: 'post' },            // où / quand
  x: 'Texte d\'introduction (ou une fonction S => `...`).',
  ch: [                                                      // 2 ou 3 choix, décisifs
    { t: 'Défier un garde Mink', s: 'combat', d: 6,          // s = stat testée, d = difficulté relative
      ok: { x: 'Texte si réussite.', e: { glory: 4, rel: { nekomamushi: 2 } } },
      ko: { x: 'Texte si échec.',    e: { hp: -40 } } },
    { t: 'Offrir un festin', c: 3_000_000,                   // c = coût en berrys, pas de test : r = résultat direct
      r: { x: 'Texte.', e: { frel: { minks: 2 }, morale: 15 } } },
  ],
}
```

- **Stats testées** `s` : `combat`, `force`, `vitesse`, `intel`, `charisme`, `navigation`, `volonte`. `d` : -4 (facile) à +12 (très dur).
- **Effets** `e` : `hp`, `shipHp`, `morale`, `berrys`, `glory` (prime ou mérite selon le camp), `merit`, `rep`, `stats: {force: 1}`,
  `haki: {obs: 1}`, `fruit: 'random3'`, `weapon: 'random2'`, `recruit: true`, `rel: { <personnage>: ±n }`,
  `frel: { <groupe>: ±n }`, `faction: 'revo'`, `flag`, `arc: {id, stage}`, `capture: 'impeldown'`, `death: '...'`.
- **Conditions** : `req: S => ...` sur un choix (verrouillé si faux, masqué), `w.test: S => ...` sur l'événement,
  `w.fac`, `w.camp`, `w.minTier`, `w.era`.
- Les valeurs peuvent être des fonctions de l'état : `berrys: S => S.tierPrime() / 4`.
- **Moins de choix, plus décisifs** : vise 2 à 3 choix, avec de vrais enjeux des deux côtés.

### Faire écrire les événements par Claude
```text
Voici le fichier js/data/events_alt.js (pour le format) et l'article du wiki sur <île> (en résumé : <faits>).
Écris 2 événements pour cette île au format du jeu : 3 choix chacun, ton drôle avec une pointe de sérieux, fidèle au canon,
sans copier le texte du wiki. Respecte les clés d'effets existantes (voir docs/TUTO_DONNEES.md §7) et les ids de
personnages/groupes réellement présents (js/data/characters.js, js/data/groups.js).
```

Ensuite : `node tools/validate-data.mjs` (les 150 parties de test déclenchent les nouveaux événements).

---

## 8. Rééquilibrer après un import massif

Plus de personnages forts = plus de rencontres dangereuses. Après un gros import :

```bash
node tools/bench.mjs moyen saga 400 full
node tools/bench.mjs temeraire saga 400
```

Repères visés : en saga, un joueur « moyen » trouve le One Piece ~20-30 % du temps, un « téméraire » meurt ~40-50 %.
Leviers : `power` des personnages importés (overrides), `pop` des îles, difficultés `d` des événements, `GLORY` et
`STAT_DC` / `COMBAT_DC` dans `js/engine.js`.

---

## 9. Licence et crédits

- Le texte du One Piece Wiki est sous **CC BY-SA 3.0** : reformule, ne recopie pas de longs passages, et **cite la source**
  (déjà indiqué dans l'en-tête de `generated.js` et dans les crédits du jeu).
- One Piece © Eiichiro Oda / Shūeisha / Toei Animation. Le jeu est un projet de fan, non officiel et non commercial.
- Utilise le service poliment : cache local, 1 requête/seconde, pas de téléchargements en parallèle (déjà géré par le script).

---

## 10. Checklist

- [ ] Accès réseau au wiki confirmé (`curl` → 200)
- [ ] Catégories vérifiées (`--list-categories`)
- [ ] Îles téléchargées, personnages téléchargés (par lots)
- [ ] `inspect.mjs` : champs vérifiés, `mapping.json` ajusté
- [ ] `build-data.mjs --report` : peu d'îles ignorées pour « mer inconnue »
- [ ] `overrides.json` : noms français, `after`, `era`, puissances corrigées pour les personnages majeurs
- [ ] `build-data.mjs` puis `validate-data.mjs` ✅
- [ ] Partie de test jouée à la main (une île importée, une rencontre importée)
- [ ] `bench.mjs` : équilibre conservé
- [ ] Commit de `js/data/generated.js` et `tools/overrides.json`

## Annexe : ce que contient `generated.js`

```js
export const EXTRA_ISLANDS = { mokomo_dukedom: { sea, pop, name, sub, desc, th:{k,g,a}, svc:[], after?, era?, needsFr? } };
export const EXTRA_CHARACTERS = { nekomamushi: { id, name, emoji, align, power, isl:{pre:[],post:[]}, quote, desc } };
export const EXTRA_GROUPS = { nekomamushi: 'minks' };   // personnage → groupe de réputation
```

Groupes disponibles : `marine, gov, revo, pirates, chapeau, shanks, wb, bigmom, kaido, teach, corsaires, crossguild, kuja,
minks, geants, wano, ryugu, germa, galleyla, ciel, vegapunk, roger` (ajouter un groupe : `js/data/groups.js`).
Thèmes de diorama : `village, ville, forteresse, montagne, desert, neige, jungle, ciel, ruines, arbre, volcan, eau, tour, futur,
bulles, corail, falaise, gateau, japon, elephant, brume, rocher, navire, pont`.

---

## Addendum : import réalisé depuis le wiki français

Le jeu a été alimenté depuis **One Piece Encyclopédie (fr.onepiece.fandom.com)**, texte sous licence CC BY-SA 3.0 (crédit en pied de page).

- Sources : `tools/sources.json` (API fr + catégories par mer et pour les personnages). Les îles écrites à la main sont rattachées à leur article via `tools/spine-titles.json` (sert à l'ordre chronologique et aux doublons).
- Réseau : en environnement cloud, Node exige `NODE_USE_ENV_PROXY=1` ; `fetch-wiki.mjs` se relance tout seul avec cette variable.
- Commandes : `node tools/fetch-wiki.mjs --all` puis `node tools/build-data.mjs` (lit les fiches `{{Îles Box}}` / `{{Char box}}`, y compris les modèles séparés) puis `node tools/validate-data.mjs` et `node tools/bench.mjs moyen saga 200`.
- Corrections manuelles : `tools/overrides.json` (`skip` pour ignorer un article ou un doublon par alias, `force`, surcharges de puissance) et `islandFilter` dans `tools/mapping.json`.
- Résultat : ~38 nouvelles îles et ~157 personnages. En mode rapide, les îles importées peu importantes (pop 1) sont écartées de la route.
