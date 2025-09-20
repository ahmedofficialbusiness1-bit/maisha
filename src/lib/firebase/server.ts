// src/lib/firebase/server.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import * as admin from 'firebase-admin';

const firebaseConfig = {
  "projectId": "studio-3569606942-35878",
  "appId": "1:646151071371:web:04422b87a9e2660cd2568e",
  "apiKey": "AIzaSyCPJZVhdNy-78KkXamoBl4dMOeNTAk3ejo",
  "authDomain": "studio-3569606942-35878.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "646151071371"
};

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
  });
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const adminAuth = admin.auth();

export { app, auth, db, adminAuth };
