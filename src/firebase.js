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
  apiKey: "AIzaSyBqQHKSIjQxaf11PeIJD3Ye62s5cQLSXi4",
  authDomain: "renki-cash.firebaseapp.com",
  projectId: "renki-cash",
  storageBucket: "renki-cash.firebasestorage.app",
  messagingSenderId: "765577601082",
  appId: "1:765577601082:web:f56f086b7b06c5097d9503"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Indique si la config a bien été remplie (sinon l'app bascule en mode local)
export const firebaseReady = !firebaseConfig.apiKey.startsWith('VOTRE_');
