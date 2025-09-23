
import { initializeApp, getApps, getApp, type App, type ServiceAccount, cert } from 'firebase-admin/app';

function getAdminApp(): App {
    if (getApps().length) {
        return getApp();
    }
    
    // In a production environment, you would use environment variables
    // For this context, we will check if they exist, otherwise use placeholders.
    // The build environment will replace these placeholders.
    const serviceAccount: ServiceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID || "studio-3569606942-35878",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-g2nmy@studio-3569606942-35878.iam.gserviceaccount.com",
        // The private key is injected from environment variables.
        privateKey: process.env.FIREBASE_PRIVATE_KEY || "",
    };

    return initializeApp({
        credential: cert(serviceAccount)
    });
}

export const adminApp = getAdminApp();
