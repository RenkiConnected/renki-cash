# Renki Cash — version partagée (Firebase)

Application web de **reprise mobile en magasin** aux couleurs de Coriolis Telecom.

Cette version stocke les données dans **Firebase**, ce qui signifie que toute
modification faite par une personne (prix, couleurs, modèles, logo…) est
**immédiatement visible par tous les appareils** et reste enregistrée.
L'accès au tableau de bord est protégé par un **mot de passe**.

> Si vous ne configurez pas Firebase, l'application fonctionne quand même :
> elle bascule automatiquement sur un stockage local (réglages propres à chaque appareil).

---

## Sommaire

1. [Lancer le projet en local](#1-lancer-le-projet-en-local)
2. [Créer et brancher Firebase (le cœur du sujet)](#2-créer-et-brancher-firebase)
3. [Mot de passe du tableau de bord](#3-mot-de-passe-du-tableau-de-bord)
4. [Mettre en ligne sur Vercel](#4-mettre-en-ligne-sur-vercel)
5. [Poser sur GitHub](#5-poser-sur-github)
6. [Sécurité : à lire](#6-sécurité--à-lire)
7. [Structure des fichiers](#7-structure-des-fichiers)

---

## 1. Lancer le projet en local

Installez [Node.js](https://nodejs.org) (version 18+). Puis, dans le dossier :

```bash
npm install      # à faire une seule fois (installe React, Firebase, etc.)
npm run dev      # lance le site en local
```

Ouvrez l'adresse affichée (généralement http://localhost:5173).

---

## 2. Créer et brancher Firebase

C'est l'étape qui rend les données partagées. Comptez 5 minutes.

### a) Créer le projet
1. Allez sur https://console.firebase.google.com et connectez-vous (compte Google).
2. Cliquez **« Créer un projet »**, nommez-le `renki-cash`, validez (vous pouvez
   désactiver Google Analytics, ce n'est pas nécessaire).

### b) Créer la base de données
3. Dans le menu de gauche : **Build → Firestore Database → Créer une base de données**.
4. Choisissez **« Démarrer en mode production »**, région **europe-west** (Belgique),
   puis **Activer**.

### c) Coller les règles de sécurité
5. Onglet **« Règles »** de Firestore : remplacez tout le contenu par celui du
   fichier `firestore.rules` (fourni dans ce projet), puis **Publier**.

### d) Récupérer votre clé de configuration
6. En haut à gauche, cliquez la **roue dentée → Paramètres du projet**.
7. Onglet **« Général »**, descendez à **« Vos applications »**, cliquez l'icône
   **Web** `</>`. Donnez un surnom (`renki-cash`), cliquez **Enregistrer l'application**.
8. Firebase affiche un bloc `const firebaseConfig = { ... }`. **Copiez ces valeurs.**

### e) Coller la clé dans le projet
9. Ouvrez le fichier **`src/firebase.js`** et remplacez les `"VOTRE_..."` par vos
   vraies valeurs. Exemple :

```js
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXX",
  authDomain: "renki-cash.firebaseapp.com",
  projectId: "renki-cash",
  storageBucket: "renki-cash.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
};
```

C'est tout. Relancez `npm run dev` : vos modifications sont désormais partagées.
Testez en ouvrant le site sur deux navigateurs : un changement sur l'un apparaît
sur l'autre.

---

## 3. Mot de passe du tableau de bord

Le tableau de bord est protégé. Le mot de passe est défini en haut du fichier
**`src/RenkiCash.jsx`** :

```js
const DASHBOARD_PASSWORD = 'Raphael2232';
```

Pour le changer, modifiez simplement cette ligne. Un bouton **« Verrouiller »**
dans le tableau de bord permet de re-protéger l'accès à tout moment.

---

## 4. Mettre en ligne sur Vercel

1. Poussez le projet sur GitHub (voir section suivante).
2. Sur [vercel.com](https://vercel.com), connectez-vous avec GitHub.
3. **Add New… → Project**, sélectionnez le dépôt `renki-cash`.
4. Vercel détecte Vite automatiquement → cliquez **Deploy**.

> Vercel héberge le site ; Firebase stocke les données. Les deux travaillent
> ensemble : pas besoin de reconfigurer Firebase, votre clé est déjà dans le code.

---

## 5. Poser sur GitHub

```bash
git init
git add .
git commit -m "Renki Cash — version Firebase"
git remote add origin https://github.com/VOTRE-NOM/renki-cash.git
git branch -M main
git push -u origin main
```

> `node_modules/` n'est pas envoyé (normal, recréé par `npm install`).

---

## 6. Sécurité : à lire

- Le **mot de passe** protège l'accès au tableau de bord côté application. Pour un
  usage en magasin (empêcher un client de modifier les prix), c'est adapté.
- À savoir : un mot de passe écrit dans le code d'un site web reste techniquement
  visible par quelqu'un d'avancé qui inspecte la page. Ce n'est pas un coffre-fort.
- Les **règles Firestore** fournies autorisent l'écriture sur le seul document de
  config. Pour une protection renforcée plus tard, activez l'**authentification
  Firebase** (comptes e-mail/mot de passe) et passez la règle d'écriture à
  `if request.auth != null`. Je peux vous préparer cette version si besoin.

---

## 7. Structure des fichiers

```
renki-cash/
├── index.html
├── package.json          ← dépendances (dont firebase)
├── vite.config.js
├── firestore.rules       ← règles de sécurité à coller dans la console Firebase
├── .gitignore
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── index.css
    ├── firebase.js       ← ★ VOS CLÉS FIREBASE ICI
    ├── storage.js        ← couche de stockage (Firebase ou local)
    └── RenkiCash.jsx      ← l'application + mot de passe du dashboard
```

---

*Renki Cash — reprise mobile en magasin. Données partagées via Firebase.*
