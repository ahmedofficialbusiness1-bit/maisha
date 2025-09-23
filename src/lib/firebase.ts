
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "studio-3569606942-35878",
  appId: "1:646151071371:web:04422b87a9e2660cd2568e",
  apiKey: "AIzaSyCPJZVhdNy-78KkXamoBl4dMOeNTAk3ejo",
  authDomain: "studio-3569606942-35878.firebaseapp.com",
  messagingSenderId: "646151071371",
};


// Helper function to safely initialize and get the Firebase app
function getFirebaseApp(): FirebaseApp {
    if (!getApps().length) {
        return initializeApp(firebaseConfig);
    }
    return getApp();
}

export const app = getFirebaseApp();
export const db = getFirestore(app);
