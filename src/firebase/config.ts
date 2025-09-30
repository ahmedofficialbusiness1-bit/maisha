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
    // This function can be called on the client and the server.
    // On the server, it will be called with the environment variables set
    // by the hosting provider.
    //
    // On the client, it will be called with the config object above.
    const apps = getApps();
    if (apps.length > 0) {
        return getApp();
    }
    return initializeApp(firebaseConfig);
}

export const app = initializeFirebase();
