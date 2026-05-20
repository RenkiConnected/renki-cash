// =============================================================================
//  CONFIGURATION FIREBASE
// =============================================================================
//  C'est le SEUL fichier à modifier pour brancher votre base de données.
//
//  1. Allez sur https://console.firebase.google.com
//  2. Créez un projet (ex: "renki-cash")
//  3. Dans "Build" > "Firestore Database" > "Créer une base de données"
//     (choisissez le mode "production", région europe-west)
//  4. Dans les paramètres du projet (roue dentée) > "Vos applications" >
//     icône Web (</>) > enregistrez l'app > copiez l'objet firebaseConfig
//  5. Collez vos valeurs ci-dessous (remplacez les "VOTRE_...")
//
//  Le README détaille chaque étape avec des captures.
// =============================================================================

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_PROJET.firebaseapp.com",
  projectId: "VOTRE_PROJET",
  storageBucket: "VOTRE_PROJET.appspot.com",
  messagingSenderId: "VOTRE_SENDER_ID",
  appId: "VOTRE_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Indique si la config a bien été remplie (sinon l'app bascule en mode local)
export const firebaseReady = !firebaseConfig.apiKey.startsWith('VOTRE_');
