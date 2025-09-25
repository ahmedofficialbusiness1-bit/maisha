import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';

const firebaseConfig: FirebaseOptions = {
  "projectId": "studio-3569606942-35878",
  "appId": "1:646151071371:web:04422b87a9e2660cd2568e",
  "apiKey": "AIzaSyCPJZVhdNy-78KkXamoBl4dMOeNTAk3ejo",
  "authDomain": "studio-3569606942-35878.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "646151071371",
  "storageBucket": "studio-3569606942-35878.appspot.com",
  "databaseURL": "https://studio-3569606942-35878-default-rtdb.firebaseio.com"
};

// Initialize Firebase
function initializeFirebase() {
    if (!firebaseConfig.apiKey) {
        return null;
    }
    
    const apps = getApps();
    if (apps.length > 0) {
        return getApp();
    }
    
    return initializeApp(firebaseConfig);
}

export const app = initializeFirebase();
