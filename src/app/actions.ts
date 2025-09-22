
'use server';

import {
  simulateCommodityPrice,
  type SimulateCommodityPriceInput,
  type SimulateCommodityPriceOutput,
} from '@/ai/flows/commodity-price-simulation';
import { z } from 'zod';
import {auth} from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { redirect } from 'next/navigation';

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

const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Manenosiri hayafanani.",
    path: ["confirmPassword"],
});


export async function signup(prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = SignupSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            success: false,
            message: validatedFields.error.flatten().fieldErrors.confirmPassword?.[0] || 'Data si sahihi, tafadhali jaribu tena.',
        };
    }

    const { email, password } = validatedFields.data;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        return { success: true, message: 'Umefanikiwa kujisajili!' };
    } catch (error: any) {
        let message = 'Hitilafu imetokea wakati wa kujisajili.';
        if (error.code === 'auth/email-already-in-use') {
            message = 'Barua pepe hii tayari imeshasajiliwa.';
        }
        return { success: false, message };
    }
}


const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Nenosiri linahitajika.'),
});

export async function login(prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Barua pepe au nenosiri si sahihi.',
        };
    }

    const { email, password } = validatedFields.data;

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
        return { success: false, message: 'Barua pepe au nenosiri si sahihi.' };
    }
    
    // Redirect to dashboard upon successful login
    redirect('/dashboard');
}

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
