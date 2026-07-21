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

export const firebaseReady = !firebaseConfig.apiKey.startsWith('VOTRE_');
