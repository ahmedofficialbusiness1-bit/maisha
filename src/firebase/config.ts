
'use client';

import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_CONFIG || '{}'
);

export function initializeFirebase() {
  // Prevent initialization if config is not set.
  if (!firebaseConfig.apiKey) {
    console.error("Firebase config is not set. Please check your environment variables.");
    return { app: null, auth: null, firestore: null };
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  if (process.env.NEXT_PUBLIC_EMULATORS_ENABLED === 'true') {
    const host = window.location.hostname;
    connectAuthEmulator(auth, `http://${host}:9099`, {
      disableWarnings: true,
    });
    connectFirestoreEmulator(firestore, host, 8080);
  }

  return { app, auth, firestore };
}
