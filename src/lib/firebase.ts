
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "studio-3569606942-35878",
  appId: "1:646151071371:web:04422b87a9e2660cd2568e",
  apiKey: "AIzaSyCPJZVhdNy-78KkXamoBl4dMOeNTAk3ejo",
  authDomain: "studio-3569606942-35878.firebaseapp.com",
  messagingSenderId: "646151071371",
};

// Initialize Firebase
const apps = getApps();
const firebaseApp = apps.length ? apps[0] : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
