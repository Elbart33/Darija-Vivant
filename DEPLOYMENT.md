# Guide de déploiement — Français Vivant

Ce guide part du principe que vous avez déjà le dossier `francais-vivant/` (dézippé)
sur votre machine. Tout est gratuit (0€).

---

## Étape 1 — Pousser le projet sur GitHub

### 1.1 Créer le dépôt
1. Allez sur [github.com/new](https://github.com/new)
2. Nom du dépôt : `francais-vivant` (ou ce que vous voulez)
3. Laissez-le **vide** (ne cochez ni README, ni .gitignore, ni licence — vous les avez déjà)
4. Cliquez sur **Create repository**

### 1.2 Pousser votre code local

Dans un terminal, à la racine du dossier `francais-vivant/` :

```bash
git init
git add .
git commit -m "Premier commit — Français Vivant"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/francais-vivant.git
git push -u origin main
```

> ⚠️ Le fichier `.gitignore` exclut déjà `node_modules`, `.next` et `.env.local` —
> vos clés API (si vous en utilisez) ne seront jamais poussées sur GitHub.

Vous pouvez vérifier que tout est bien en ligne en rafraîchissant la page de votre
dépôt GitHub.

---

## Étape 2 — Déployer sur Vercel (recommandé, gratuit, fait par les créateurs de Next.js)

### 2.1 Créer un compte
Allez sur [vercel.com](https://vercel.com) → **Sign Up** → connectez-vous avec votre
compte GitHub (le plus simple, ça autorise l'accès direct à vos dépôts).

### 2.2 Importer le projet
1. Sur le tableau de bord Vercel, cliquez sur **Add New... → Project**
2. Sélectionnez votre dépôt `francais-vivant` dans la liste
3. Vercel détecte automatiquement que c'est un projet **Next.js** — ne changez rien
   aux réglages de build (`next build` / `.next`)

### 2.3 Variables d'environnement (optionnel — seulement si vous activez l'IA)
Toujours sur l'écran d'import, ouvrez **Environment Variables** et ajoutez, **seulement
si vous voulez activer un fournisseur IA** :

| Nom | Valeur |
|---|---|
| `AI_PROVIDER` | `mistral` ou `groq` (Ollama ne fonctionne pas sur Vercel, voir plus bas) |
| `MISTRAL_API_KEY` | votre clé, si `AI_PROVIDER=mistral` |
| `GROQ_API_KEY` | votre clé, si `AI_PROVIDER=groq` |

Si vous laissez tout vide, l'app fonctionne parfaitement en mode 100% local
(`AI_PROVIDER=none` par défaut).

### 2.4 Déployer
Cliquez sur **Deploy**. Après 1 à 2 minutes, Vercel vous donne une URL du type :

```
https://francais-vivant.vercel.app
```

C'est en ligne, gratuit, avec HTTPS automatique. Chaque nouveau `git push` sur `main`
redéploie automatiquement.

### 2.5 (Optionnel) Domaine personnalisé
Dans le projet Vercel → **Settings → Domains**, ajoutez votre propre nom de domaine et
suivez les instructions DNS affichées (gratuit, seul le nom de domaine lui-même a un
coût si vous n'en avez pas déjà un).

---

## Étape 3 — Obtenir des clés IA gratuites (optionnel)

Vous n'avez besoin que d'**une seule** de ces options, ou d'aucune.

### Mistral AI (free tier)
1. [console.mistral.ai](https://console.mistral.ai) → créez un compte
2. **API Keys** → **Create new key**
3. Copiez la clé dans `MISTRAL_API_KEY` sur Vercel (ou dans `.env.local` en local)
4. Mettez `AI_PROVIDER=mistral`

### Groq (LLaMA 3, free tier, très rapide)
1. [console.groq.com](https://console.groq.com) → créez un compte
2. **API Keys** → **Create API Key**
3. Copiez la clé dans `GROQ_API_KEY`
4. Mettez `AI_PROVIDER=groq`

### Ollama (100% local, ne fonctionne qu'en développement local ou sur votre propre serveur)
1. Installez [ollama.com](https://ollama.com)
2. `ollama pull llama3`
3. `ollama serve` (tourne sur `http://localhost:11434`)
4. Dans `.env.local` : `AI_PROVIDER=ollama`

> Ollama ne peut pas tourner "gratuitement" sur Vercel, car Vercel n'héberge pas de
> modèle IA local. Pour du 100% local + IA, il faut soit rester en développement local,
> soit déployer sur un serveur/VPS que vous contrôlez (voir Étape 5).

---

## Étape 4 — Alternative gratuite : Netlify

Si vous préférez Netlify à Vercel :

1. [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**
2. Connectez votre GitHub, sélectionnez le dépôt
3. Build command : `npm run build`
4. Publish directory : `.next`
5. Ajoutez le plugin Next.js si demandé (`@netlify/plugin-nextjs`, Netlify le propose
   automatiquement)
6. Ajoutez vos variables d'environnement dans **Site settings → Environment variables**
   (mêmes noms que pour Vercel)
7. **Deploy site**

---

## Étape 5 — Alternative : votre propre serveur (VPS)

Pour un contrôle total (utile si vous voulez faire tourner Ollama en production, par
exemple), sur un VPS gratuit/pas cher (Oracle Cloud Free Tier, ou tout VPS ~5€/mois) :

```bash
git clone https://github.com/VOTRE-USERNAME/francais-vivant.git
cd francais-vivant
npm install
npm run build
npm run start   # démarre sur le port 3000
```

Pour que ça tourne en continu, utilisez [pm2](https://pm2.keymetrics.io/) :

```bash
npm install -g pm2
pm2 start npm --name francais-vivant -- start
pm2 save
pm2 startup
```

Mettez un reverse proxy Nginx devant pour le HTTPS (via
[Certbot](https://certbot.eff.org) gratuit) si vous exposez le site publiquement.

---

## Étape 6 — Vérifier que tout fonctionne après déploiement

Une fois l'URL en ligne, vérifiez dans l'ordre :

1. **La page d'accueil** affiche la situation du jour → OK, le rendu de base fonctionne
2. **Un flow complet** (choisir une situation → répondre → voir la correction) → OK, le
   moteur local fonctionne
3. **Revenez sur la page d'accueil, puis "Mon chemin"** → la tuile de la situation
   complétée doit être allumée → OK, `localStorage` fonctionne bien côté client
4. **Si IA activée** : le badge « enrichie par IA » doit apparaître sur la version
   naturelle → sinon, vérifiez que la variable d'environnement est bien définie et que
   vous avez redéployé après l'avoir ajoutée (Vercel/Netlify ne relit pas les env vars
   sans nouveau déploiement)

---

## Résumé rapide

| Besoin | Solution |
|---|---|
| Mise en ligne rapide, gratuite, zéro configuration | **Vercel** |
| Alternative équivalente | **Netlify** |
| IA cloud gratuite | **Mistral** ou **Groq** (une clé API, variable d'env) |
| IA 100% locale, sans cloud | **Ollama**, uniquement en local ou sur votre propre serveur |
| Contrôle total / IA locale en production | **VPS + pm2 + Nginx** |
