'use server';

/**
 * @fileOverview Simulates commodity prices based on supply, demand, and world events.
 *
 * - simulateCommodityPrice - A function that simulates the commodity price.
 * - SimulateCommodityPriceInput - The input type for the simulateCommodityPrice function.
 * - SimulateCommodityPriceOutput - The return type for the simulateCommodityPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateCommodityPriceInputSchema = z.object({
  commodity: z.string().describe('The commodity to simulate the price for.'),
  supply: z.number().describe('The current supply of the commodity.'),
  demand: z.number().describe('The current demand for the commodity.'),
  worldEvents: z.string().describe('A description of relevant world events.'),
  adminAdjustment: z
    .number()
    .optional()
    .describe(
      'Optional manual adjustment to the price by the game administrator.'
    ),
});
export type SimulateCommodityPriceInput = z.infer<
  typeof SimulateCommodityPriceInputSchema
>;

const SimulateCommodityPriceOutputSchema = z.object({
  price: z.number().describe('The simulated price of the commodity.'),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the simulated price, considering supply, demand, world events, and admin adjustments.'
    ),
});
export type SimulateCommodityPriceOutput = z.infer<
  typeof SimulateCommodityPriceOutputSchema
>;

export async function simulateCommodityPrice(
  input: SimulateCommodityPriceInput
): Promise<SimulateCommodityPriceOutput> {
  return simulateCommodityPriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simulateCommodityPricePrompt',
  input: {schema: SimulateCommodityPriceInputSchema},
  output: {schema: SimulateCommodityPriceOutputSchema},
  prompt: `You are a game economist tasked with simulating commodity prices within an African economic simulation. Consider the current supply and demand, relevant world events, and any manual adjustments made by the game administrator.

Commodity: {{commodity}}
Current Supply: {{supply}}
Current Demand: {{demand}}
World Events: {{worldEvents}}
Admin Adjustment: {{adminAdjustment}}

Simulate the price of the commodity, explaining your reasoning based on the provided factors. Ensure the price reflects the economic conditions and any manual adjustments.

Reasoning: <reasoning>
Price: <price>`,
});

const simulateCommodityPriceFlow = ai.defineFlow(
  {
    name: 'simulateCommodityPriceFlow',
    inputSchema: SimulateCommodityPriceInputSchema,
    outputSchema: SimulateCommodityPriceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
