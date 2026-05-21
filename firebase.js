// =============================================================================
//  COUCHE DE STOCKAGE PARTAGE
// =============================================================================
//  - Si Firebase est configure (firebase.js rempli) : lecture/ecriture dans
//    Firestore. Toute modification est alors visible par TOUS les appareils.
//  - Sinon : repli automatique sur le stockage local du navigateur.
//
//  Donnees stockees dans : collection "renki" / document "config"
// =============================================================================

import { db, firebaseReady } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const DOC_REF = firebaseReady && db ? doc(db, 'renki', 'config') : null;

// --- Chargement initial -------------------------------------------------------
export async function loadConfig() {
  if (DOC_REF) {
    try {
      const snap = await getDoc(DOC_REF);
      if (snap.exists()) return snap.data();
      return {};
    } catch (e) {
      console.error('Firebase load error:', e);
      return {};
    }
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

// --- Sauvegarde d'une cle -----------------------------------------------------
export async function saveKey(key, value) {
  if (DOC_REF) {
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

// --- Ecoute temps reel (Firebase uniquement) ----------------------------------
export function subscribeConfig(callback) {
  if (!DOC_REF) return () => {};
  return onSnapshot(DOC_REF, (snap) => {
    if (snap.exists()) callback(snap.data());
  }, (e) => console.error('Firebase subscribe error:', e));
}

export { firebaseReady };
