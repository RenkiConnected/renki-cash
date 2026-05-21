// =============================================================================
//  CONFIGURATION FIREBASE
// =============================================================================
//  Vos vraies cles sont DEJA integrees ci-dessous. La sauvegarde en ligne
//  partagee est donc ACTIVE : toute modification est enregistree dans Firebase
//  et visible par tous les appareils.
//
//  (Si un jour vous changez de projet Firebase, remplacez les valeurs ci-dessous
//   par celles affichees dans Console Firebase > Parametres du projet > Vos applications.)
// =============================================================================

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBqQHKSIjQxaf11PeIJD3Ye62s5cQLSXi4",
  authDomain: "renki-cash.firebaseapp.com",
  projectId: "renki-cash",
  storageBucket: "renki-cash.firebasestorage.app",
  messagingSenderId: "765577601082",
  appId: "1:765577601082:web:f56f086b7b06c5097d9503",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Indique si la config a bien ete remplie (sinon l'app bascule en mode local)
export const firebaseReady = !firebaseConfig.apiKey.startsWith('VOTRE_');
