# Mettre "Français Vivant" en ligne — guide pas à pas (sans rien installer)

Vous avez seulement un compte **GitHub** et un compte **Cloudflare**. C'est largement
suffisant. Vous n'avez besoin d'installer aucun logiciel, aucune ligne de commande.
Juste votre navigateur.

Suivez les étapes **dans l'ordre**, sans en sauter aucune.

---

## Avant de commencer

1. Téléchargez le fichier `francais-vivant.zip` que je vous ai donné, s'il n'est pas
   déjà sur votre ordinateur.
2. **Décompressez-le** :
   - Sur Windows : clic droit sur le fichier → **Extraire tout**
   - Sur Mac : double-cliquez sur le fichier
   - Vous obtenez un dossier nommé `francais-vivant`
3. Gardez ce dossier ouvert dans une fenêtre, vous en aurez besoin à l'étape 2.

---

## PARTIE 1 — Créer un dépôt sur GitHub (votre espace de stockage du code)

1. Allez sur **github.com** et connectez-vous.
2. En haut à droite, cliquez sur le **+** puis **New repository**.
3. Dans **Repository name**, écrivez : `francais-vivant`
4. Laissez tout le reste par défaut (ne cochez **rien** — pas de README, pas de
   .gitignore, pas de licence).
5. Cliquez sur le bouton vert **Create repository**.

Vous arrivez sur une page presque vide avec des instructions techniques : **ignorez-les
complètement**, on ne va pas utiliser de ligne de commande.

---

## PARTIE 2 — Envoyer votre projet sur GitHub (par glisser-déposer)

1. Sur cette même page de votre dépôt vide, cherchez le lien texte qui dit
   **"uploading an existing file"** (c'est un lien bleu, au milieu du texte
   d'instructions). Cliquez dessus.
   - Si vous ne le trouvez pas : allez dans l'onglet **Code** de votre dépôt, puis
     cliquez sur le bouton **Add file** → **Upload files**.
2. Une page s'ouvre avec une grande zone qui dit **"Drag files here..."**.
3. Ouvrez le dossier `francais-vivant` décompressé à l'étape précédente sur votre
   ordinateur.
4. **Sélectionnez tout le contenu** du dossier (pas le dossier lui-même, ce qui est
   à l'intérieur) :
   - Cliquez sur un fichier, puis appuyez sur **Ctrl+A** (Windows) ou **Cmd+A** (Mac)
     pour tout sélectionner.
5. **Glissez-déposez** cette sélection dans la zone grise de la page GitHub.
   - Cela peut prendre 1 à 2 minutes selon votre connexion — GitHub garde
     automatiquement l'organisation des dossiers (`app`, `components`, `data`, etc.),
     vous n'avez rien à faire de plus.
6. Une fois l'envoi terminé, tout en bas de la page, dans **Commit changes**, laissez
   le message par défaut et cliquez sur le bouton vert **Commit changes**.

Vous devriez maintenant voir tous vos fichiers et dossiers (`app`, `components`,
`data`, `lib`, `README.md`...) affichés dans votre dépôt GitHub. **C'est fait pour
cette partie.**

---

## PARTIE 3 — Mettre le site en ligne avec Cloudflare Pages

1. Allez sur **dash.cloudflare.com** et connectez-vous.
2. Dans le menu de gauche, cherchez **Workers & Pages** et cliquez dessus.
3. Cliquez sur le bouton **Create** (ou **Create application**), en haut à droite.
4. Choisissez l'onglet **Pages**, puis **Connect to Git**.
5. Cloudflare vous demande d'autoriser l'accès à votre compte GitHub :
   cliquez sur **Connect GitHub**, puis autorisez l'accès (vous pouvez choisir
   "All repositories" ou juste `francais-vivant`).
6. Une liste de vos dépôts GitHub apparaît. Cliquez sur **francais-vivant**, puis sur
   **Begin setup**.
7. Vous arrivez sur un écran **"Set up builds and deployments"**. Remplissez
   exactement comme ceci :

   | Champ | Valeur à écrire |
   |---|---|
   | **Framework preset** | Choisissez **Next.js** dans la liste déroulante |
   | **Build command** | `npx @cloudflare/next-on-pages@1` |
   | **Build output directory** | `.vercel/output/static` |

   Ces deux dernières valeurs se remplissent normalement toutes seules si vous
   choisissez le preset **Next.js** — vérifiez juste qu'elles correspondent au
   tableau ci-dessus, sinon corrigez-les à la main.

8. Ne touchez à rien d'autre. Cliquez sur le bouton **Save and Deploy**.
9. Cloudflare va maintenant construire votre site — vous voyez des lignes de texte
   défiler (c'est normal, c'est technique, vous n'avez rien à faire). Cela prend
   généralement **2 à 4 minutes** la première fois.
10. Quand c'est terminé, un message **"Success"** apparaît avec un lien du type :

    ```
    https://francais-vivant-xxx.pages.dev
    ```

    **Cliquez sur ce lien : votre site est en ligne.** 🎉

À partir de maintenant, chaque fois que vous modifierez un fichier sur GitHub, votre
site se mettra à jour automatiquement en 2-3 minutes, sans que vous ayez à revenir sur
Cloudflare.

---

## PARTIE 4 — Vérifier que tout fonctionne

Sur votre site en ligne (l'adresse `...pages.dev`) :

1. La page d'accueil doit afficher une situation du jour (ex : "Prendre un
   rendez-vous chez le médecin") → si oui, c'est bon signe.
2. Cliquez sur **Commencer**, lisez le contexte, répondez à la question, puis écrivez
   une phrase et cliquez sur **Voir ma correction** → vous devez voir apparaître une
   correction et une version naturelle.
3. Cliquez sur **Mon chemin** en haut → une tuile doit être allumée pour la situation
   que vous venez de faire.

Si les 3 fonctionnent, **tout est bon**, votre site est pleinement opérationnel — sans
avoir eu besoin d'activer d'IA.

---

## PARTIE 5 (optionnelle) — Activer l'IA gratuite

Ce n'est **pas nécessaire**, le site fonctionne très bien sans. Si vous voulez quand
même enrichir les phrases avec une IA gratuite :

1. Créez un compte gratuit sur **console.mistral.ai**, puis allez dans **API Keys** →
   **Create new key**, et copiez la clé (une longue suite de lettres/chiffres).
2. Retournez sur **dash.cloudflare.com → Workers & Pages → francais-vivant**.
3. Allez dans l'onglet **Settings → Environment variables**.
4. Cliquez sur **Add variable** et ajoutez, une par une :
   - Nom : `AI_PROVIDER` — Valeur : `mistral`
   - Nom : `MISTRAL_API_KEY` — Valeur : *(collez votre clé copiée)*
5. Cliquez sur **Save**.
6. Allez dans l'onglet **Deployments**, cliquez sur les trois petits points du dernier
   déploiement, puis **Retry deployment** (pour que le site prenne en compte les
   nouvelles variables).
7. Après 2-3 minutes, refaites une correction sur le site : un petit badge
   **"enrichie par IA"** doit apparaître sur la version naturelle.

---

## Pour modifier le site plus tard (ajouter une situation, changer un texte...)

Vous n'avez pas besoin de tout re-uploader :

1. Allez sur votre dépôt GitHub, ouvrez le fichier que vous voulez modifier (par
   exemple `data/situations.json`).
2. Cliquez sur l'icône **crayon** (Edit this file), en haut à droite du fichier.
3. Modifiez le texte directement dans la page.
4. En bas, cliquez sur **Commit changes**.
5. Cloudflare redéploie automatiquement votre site en 2-3 minutes — pas besoin de
   retourner sur Cloudflare.

---

## En cas de blocage

- **"Build failed" sur Cloudflare** → vérifiez que les 3 champs de la Partie 3, étape 7
  sont exactement corrects, puis dans l'onglet **Deployments**, cliquez sur le
  déploiement en échec pour lire le message d'erreur, et copiez-le-moi ici, je vous
  aiderai à le corriger.
- **Le site s'affiche mais est cassé (pas de style, texte brut)** → attendez 1 minute
  et rafraîchissez complètement la page (Ctrl+F5 ou Cmd+Shift+R).
- **Un fichier ne s'est pas envoyé sur GitHub** → recommencez juste la Partie 2 avec
  **Add file → Upload files**, ça n'écrasera pas ce qui existe déjà correctement.

Dites-moi à quelle étape vous en êtes, ou collez-moi un message d'erreur si vous en
voyez un — je vous guide à la suite.
