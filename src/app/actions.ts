
'use server';

import {
  simulateCommodityPrice,
  type SimulateCommodityPriceInput,
  type SimulateCommodityPriceOutput,
} from '@/ai/flows/commodity-price-simulation';
import { z } from 'zod';

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
