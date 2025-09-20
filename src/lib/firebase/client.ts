// src/lib/firebase/client.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "studio-3569606942-35878",
  "appId": "1:646151071371:web:04422b87a9e2660cd2568e",
  "apiKey": "AIzaSyCPJZVhdNy-78KkXamoBl4dMOeNTAk3ejo",
  "authDomain": "studio-3569606942-35878.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "646151071371"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
