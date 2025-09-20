'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'studio-3569606942-35878',
  appId: '1:646151071371:web:04422b87a9e2660cd2568e',
  apiKey: 'AIzaSyCPJZVhdNy-78KkXamoBl4dMOeNTAk3ejo',
  authDomain: 'studio-3569606942-35878.firebaseapp.com',
};

const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
