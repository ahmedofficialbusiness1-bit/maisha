import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'studio-3569606942-35878',
  appId: '1:646151071371:web:04422b87a9e2660cd2568e',
  storageBucket: 'studio-3569606942-35878.firebasestorage.app',
  apiKey: 'AIzaSyCPJZVhdNy-78KkXamoBl4dMOeNTAk3ejo',
  authDomain: 'studio-3569606942-35878.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '646151071371',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
