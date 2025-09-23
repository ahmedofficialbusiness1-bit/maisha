// This file can be removed or repurposed if not using Lucia.
// For now, it defines the User type for Firebase.
import type { User as FirebaseUser } from 'firebase/auth';

// We can create a more specific user type if needed
export type User = {
    uid: string;
    username: string;
};

export type AuthenticatedUser = FirebaseUser;
