// =============================================================================
//  COUCHE DE STOCKAGE PARTAGÉ
// =============================================================================
//  - Si Firebase est configuré (firebase.js rempli) : lecture/écriture dans
//    Firestore. Toute modification est alors visible par TOUS les appareils.
//  - Sinon : repli automatique sur le stockage local du navigateur, pour que
//    l'app fonctionne même sans configuration (chaque appareil garde ses réglages).
//
//  Les données partagées sont stockées dans un seul document Firestore :
//    collection "renki" / document "config"
// =============================================================================

import { db, firebaseReady } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const DOC_REF = firebaseReady ? doc(db, 'renki', 'config') : null;

// --- Chargement initial -------------------------------------------------------
export async function loadConfig() {
  if (firebaseReady) {
    try {
      const snap = await getDoc(DOC_REF);
      if (snap.exists()) return snap.data();
    } catch (e) {
      console.error('Firebase load error:', e);
    }
    return {};
  }
  // Repli local
  const out = {};
  for (const key of ['theme', 'products', 'brands', 'pricing']) {
    try {
      const v = localStorage.getItem('renki:' + key);
      if (v) out[key] = JSON.parse(v);
    } catch (e) { /* ignore */ }
  }
  return out;
}

// --- Sauvegarde d'une clé -----------------------------------------------------
export async function saveKey(key, value) {
  if (firebaseReady) {
    try {
      await setDoc(DOC_REF, { [key]: value }, { merge: true });
    } catch (e) {
      console.error('Firebase save error:', e);
    }
    return;
  }
  try {
    localStorage.setItem('renki:' + key, JSON.stringify(value));
  } catch (e) { /* ignore */ }
}

// --- Écoute en temps réel (Firebase uniquement) -------------------------------
//  Permet de voir instantanément les changements faits par un autre appareil.
export function subscribeConfig(callback) {
  if (!firebaseReady) return () => {};
  return onSnapshot(DOC_REF, (snap) => {
    if (snap.exists()) callback(snap.data());
  }, (e) => console.error('Firebase subscribe error:', e));
}

export { firebaseReady };
