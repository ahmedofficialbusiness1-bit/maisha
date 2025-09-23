
'use server';

import {
  simulateCommodityPrice,
  type SimulateCommodityPriceInput,
  type SimulateCommodityPriceOutput,
} from '@/ai/flows/commodity-price-simulation';
import { z } from 'zod';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getInitialUserData } from '@/components/app/game';


const SimulateCommodityPriceSchema = z.object({
  commodity: z.string().min(1, 'Commodity is required.'),
  supply: z.coerce.number().min(0, 'Supply must be a positive number.'),
  demand: z.coerce.number().min(0, 'Demand must be a positive number.'),
  worldEvents: z.string().min(1, 'World events description is required.'),
  adminAdjustment: z.coerce.number().optional(),
});

export type FormState = {
  success: boolean;
  message: string;
  data?: SimulateCommodityPriceOutput;
};


export async function runCommoditySimulation(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = SimulateCommodityPriceSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data. Please check your inputs.',
    };
  }

  const input: SimulateCommodityPriceInput = validatedFields.data;

  try {
    const output = await simulateCommodityPrice(input);
    return {
      success: true,
      message: 'Simulation successful.',
      data: output,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An unexpected error occurred during the simulation.',
    };
  }
}

// --- Authentication Actions ---

const LoginSchema = z.object({
  email: z.string().email('Barua pepe si sahihi.'),
  password: z.string().min(6, 'Nenosiri lazima liwe na angalau herufi 6.'),
});

const SignupSchema = z
  .object({
    email: z.string().email({ message: 'Tafadhali weka barua pepe sahihi.' }),
    password: z.string().min(6, { message: 'Nenosiri lazima liwe na angalau herufi 6.' }),
    'confirm-password': z.string(),
  })
  .refine((data) => data.password === data['confirm-password'], {
    message: 'Manenosiri hayafanani.',
    path: ['confirm-password'],
  });


export type AuthFormState = {
  success: boolean;
  message: string;
}

export async function login(prevState: AuthFormState, formData: FormData) {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.errors.map((e) => e.message).join(', '),
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    return {
      success: false,
      message: 'Barua pepe au nenosiri si sahihi.',
    };
  }
  
  return {
    success: true,
    message: "Umeingia kikamilifu"
  }
}


export async function signup(prevState: AuthFormState, formData: FormData) {
  const validatedFields = SignupSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.errors.map((e) => e.message).join(', '),
    };
  }
  
  const { email, password } = validatedFields.data;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    const initialData = getInitialUserData(user.uid, user.email);
    await setDoc(doc(db, 'users', user.uid), initialData);

  } catch (error: any) {
     if (error.code === 'auth/email-already-in-use') {
      return {
        success: false,
        message: 'Barua pepe hii tayari inatumika.',
      };
    }
    return {
      success: false,
      message: 'Imeshindwa kutengeneza akaunti. Tafadhali jaribu tena.',
    };
  }

  return {
    success: true,
    message: "Umejisajili kikamilifu"
  }
}
