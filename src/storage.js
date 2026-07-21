import { db, firebaseReady } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const DOC_REF = firebaseReady ? doc(db, 'renki', 'config') : null;

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
  const out = {};
  for (const key of ['theme', 'products', 'brands', 'pricing', 'history', 'shops', 'sellers']) {
    try {
      const v = localStorage.getItem('renki:' + key);
      if (v) out[key] = JSON.parse(v);
    } catch (e) { /* ignore */ }
  }
  return out;
}

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

export function subscribeConfig(callback) {
  if (!firebaseReady) return () => {};
  return onSnapshot(DOC_REF, (snap) => {
    if (snap.exists()) callback(snap.data());
  }, (e) => console.error('Firebase subscribe error:', e));
}

export { firebaseReady };
