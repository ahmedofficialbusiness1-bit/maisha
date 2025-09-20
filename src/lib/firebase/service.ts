
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './client';
import type { UserData } from '@/components/app/game';

const USERS_COLLECTION = 'users';

export async function saveUserData(uid: string, data: UserData): Promise<void> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    // Use setDoc with merge: true to create or update the document
    await setDoc(userDocRef, data, { merge: true });
  } catch (error) {
    console.error("Error saving user data: ", error);
  }
}

export async function loadUserData(uid: string): Promise<UserData | null> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      // We need to handle cases where new fields are added to UserData
      // and are missing from the saved document.
      const savedData = docSnap.data() as UserData;
      
      // Ensure all top-level fields exist, providing defaults if they don't.
      const defaults: Partial<UserData> = {
        notifications: [],
        transactions: [],
        playerStocks: [],
        bondListings: [],
      };

      return { ...defaults, ...savedData };

    } else {
      console.log("No such document for user:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error loading user data: ", error);
    return null;
  }
}

    