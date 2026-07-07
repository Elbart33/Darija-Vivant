# Français Vivant
https://91a58110.francais-vivant.pages.dev/situation/banque-carte
Une application web gratuite qui aide des adultes francophones-darija (Maroc, 45–60 ans,
niveau A2+/B1) à transformer un français **fonctionnel mais instable** en français
**naturel, fluide et précis** — à partir de situations de vie réelles (médecin, téléphone,
administration, courses...).

L'utilisateur ne voit jamais de niveau CECRL, de catégorie grammaticale ou de chatbot IA.
Il voit seulement : une situation, une phrase qu'il écrit, et une version corrigée +
naturelle de cette phrase.

---

## 1. Installation

Prérequis : [Node.js](https://nodejs.org) ≥ 18.

```bash
git clone <votre-repo>
cd francais-vivant
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000). C'est tout — **aucune base de
données, aucun backend, aucune clé API n'est requise** pour que l'app fonctionne
entièrement.

### Build de production

```bash
npm run build
npm run start
```

---

## 2. Activer l'IA (optionnel, toujours à 0€)

Par défaut, `AI_PROVIDER=none` : l'app tourne à 100% sur son moteur local.

Pour activer un enrichissement IA (reformulation plus naturelle), copiez `.env.example`
vers `.env.local` et choisissez **un seul** fournisseur gratuit :

```bash
cp .env.example .env.local
```

| Fournisseur | Coût | Configuration |
|---|---|---|
| **Aucun (recommandé pour démarrer)** | 0€ | `AI_PROVIDER=none` |
| Mistral AI (free tier) | 0€ avec quota gratuit | `AI_PROVIDER=mistral` + `MISTRAL_API_KEY` |
| Groq (LLaMA 3, free tier) | 0€ avec quota gratuit | `AI_PROVIDER=groq` + `GROQ_API_KEY` |
| Ollama (100% local) | 0€, tourne sur votre machine | `AI_PROVIDER=ollama`, lancez `ollama serve` |

Si la clé est absente, si le quota est dépassé, ou si le réseau est indisponible,
l'application **ne casse jamais** : elle revient silencieusement au moteur local.
C'est une exigence d'architecture, pas un simple filet de sécurité — voir
`lib/engine/aiLayer.ts`.

---

## 3. Utilisation

1. **Accueil** — une situation du jour est proposée (déterministe, basée sur la date),
   avec les autres situations disponibles en dessous.
2. **Situation** — l'utilisateur lit un contexte court, répond à une question de
   compréhension, puis écrit sa propre phrase comme il la dirait à l'oral.
3. **Correction / Avant-Après** — la phrase est analysée en deux temps :
   - **Correction** : les erreurs fossilisées sont corrigées (grammaire, accords,
     confusions phonologiques comme B/P, tournures figées).
   - **Version naturelle** : la phrase déjà correcte est enrichie vers un registre plus
     naturel et idiomatique (localement, et via IA si activée).
   Les différences sont surlignées, avec une explication courte, et une option
   « Voir en darija » discrète pour chaque point.
4. **À revoir** — les erreurs qui reviennent le plus souvent, calculées depuis la
   mémoire locale (`localStorage`), pour une révision ciblée.
5. **Mon chemin** — une progression **visuelle et non numérique** (tuiles qui
   s'allument, régularité des jours de pratique) — jamais de score ni de niveau affiché.

---

## 4. Architecture

```
/app
  page.tsx                  → Accueil (situation du jour)
  situation/[id]/page.tsx   → Flow complet : contexte → compréhension → saisie → résultat
  review/page.tsx           → Erreurs fréquentes + phrases à revoir
  progress/page.tsx         → Progression visuelle non numérique
  api/ai/route.ts           → Route serveur qui appelle le fournisseur IA configuré

/components
  SituationCard.tsx         → Carte de situation (accueil)
  BeforeAfter.tsx           → Composant central : avant / correction / version naturelle
  DiffView.tsx              → Surlignage des différences mot à mot
  CoachNote.tsx             → Explication courte + option "voir en darija"
  ProgressVisual.tsx        → Tuiles + régularité (pas de chiffres)
  Header.tsx, Icon.tsx      → Navigation et icônes

/lib
  engine/correctionEngine.ts → MOTEUR LOCAL : recalibrage + développement (règles JSON)
  engine/diff.ts              → Diff mot-à-mot (LCS) pour le surlignage
  engine/aiLayer.ts           → Appel client vers /api/ai, échec silencieux garanti
  engine/providers/           → mistral.ts / groq.ts / ollama.ts (serveur uniquement)
  storage/userMemory.ts       → Lecture/écriture localStorage (tentatives, fréquences)

/data
  situations.json    → Situations de vie (jamais de niveau CECRL visible)
  errors.json         → Règles de correction (recalibrage) : regex → remplacement
  corrections.json    → Règles d'enrichissement (développement) : registre plus naturel
  idioms.json          → Expressions idiomatiques liées aux situations

/hooks
  useAnalysis.ts      → Orchestration : moteur local + tentative IA + fusion du résultat
  useUserMemory.ts    → Hook React autour de la mémoire localStorage

/types
  index.ts            → Types partagés (Situation, AnalysisResult, UserMemory, ...)
```

### Les deux moteurs pédagogiques invisibles

- **🔧 Recalibrage** (`applyRecalibrage`) : corrige les erreurs fossilisées via des
  règles regex déclaratives dans `data/errors.json` (grammaire, accords de genre,
  confusions phonologiques B/P, tournures figées comme « esque »).
- **🌱 Développement** (`applyDeveloppement`) : à partir d'une phrase déjà correcte,
  propose une reformulation plus naturelle via `data/corrections.json`, puis — si un
  fournisseur IA est configuré — une reformulation encore plus riche via
  `lib/engine/aiLayer.ts`.

L'utilisateur ne voit jamais ces deux noms : il voit seulement un bloc « Correction »
et un bloc « Version naturelle ».

### Pourquoi l'app marche sans IA et sans backend

- Toute la logique pédagogique (correction + enrichissement de base) est **encodée en
  données JSON statiques** + un moteur de règles TypeScript pur, exécuté côté client.
- La mémoire utilisateur (tentatives, fréquence des erreurs, progression) vit dans
  `localStorage` du navigateur — aucune base de données requise.
- La couche IA est un bonus optionnel appelé via une route serveur Next.js
  (`/api/ai`), qui échoue toujours proprement vers `{ ok: false }` si aucune clé
  n'est configurée, si le quota est dépassé, ou si le réseau est absent.

### Ajouter une situation, une règle ou un idiome

Tout se fait en éditant les fichiers JSON dans `/data` — aucun changement de code
n'est nécessaire :

- Nouvelle situation → ajouter un objet dans `situations.json`.
- Nouvelle erreur fréquente → ajouter une règle `{ pattern, flags, replacement,
  explanationFr, explanationDarija }` dans `errors.json`.
- Nouvelle tournure à enrichir → ajouter une règle dans `corrections.json`.
- Nouvelle expression idiomatique → ajouter un objet dans `idioms.json`, référencé par
  `idiomIds` dans une situation.

---

## 5. Stack technique

- **Next.js 14** (App Router) + **TypeScript**
- **TailwindCSS** (palette personnalisée inspirée des zelliges marocains, pas de
  thème par défaut)
- **localStorage** pour toute la persistance (pas de backend obligatoire)
- Couche IA optionnelle et interchangeable : **Mistral AI**, **Groq (LLaMA 3)**, ou
  **Ollama** en local — un seul à la fois, jamais requis

---

## 6. Interdits respectés

- Pas de gamification lourde (badges, points, niveaux tape-à-l'œil)
- Pas de CECRL visible nulle part dans l'UI
- Pas de chatbot IA visible — le « coach darija » est une note contextuelle discrète
- Pas de backend obligatoire
- Pas de dépendance unique à une IA cloud payante
