
'use server';
/**
 * @fileOverview Generates a new AI player profile for the game.
 *
 * - generateAiPlayer - A function that creates a new AI player.
 * - GenerateAiPlayerInput - The input type for the generateAiPlayer function.
 * - GenerateAiPlayerOutput - The return type for the generateAiPlayer function (matches UserData).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiPlayerInputSchema = z.object({
  uid: z.string().describe('The unique ID for the new AI player.'),
  email: z.string().email().describe('The email address for the new AI player.'),
});
export type GenerateAiPlayerInput = z.infer<
  typeof GenerateAiPlayerInputSchema
>;

// This Zod schema must match the `UserData` type in `src/services/game-service.ts`
const UserDataSchema = z.object({
  uid: z.string(),
  username: z.string().describe("A creative, cool, and unique username for an African economic simulation game player. Can be in English or Swahili."),
  email: z.string().email().nullable(),
  lastLogin: z.number(),
  money: z.number().describe("A starting cash amount between 5,000 and 20,000."),
  stars: z.number().describe("A starting star count between 10 and 50."),
  netWorth: z.number().describe("The calculated net worth, which should be equal to the starting money."),
  buildingSlots: z.array(z.any()),
  inventory: z.array(z.any()),
  playerStocks: z.array(z.any()),
  transactions: z.array(z.any()),
  notifications: z.array(z.any()),
  playerLevel: z.number().describe("A starting level between 1 and 5."),
  playerXP: z.number(),
  privateNotes: z.string().describe("A short, interesting, and creative in-character bio for the player. Can be ambitious, funny, or mysterious. (Max 2-3 sentences)"),
  status: z.enum(['online', 'offline']),
  role: z.enum(['player', 'admin']),
  lastSeen: z.number(),
});

export type GenerateAiPlayerOutput = z.infer<typeof UserDataSchema>;


export async function generateAiPlayer(
  input: GenerateAiPlayerInput
): Promise<GenerateAiPlayerOutput> {
  const result = await generateAiPlayerFlow(input);
  
  // Post-processing and filling in non-AI data
  const finalResult: GenerateAiPlayerOutput = {
    ...result,
    uid: input.uid,
    email: input.email,
    lastLogin: Date.now(),
    lastSeen: Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7), // last seen within the last week
    status: Math.random() > 0.5 ? 'online' : 'offline',
    role: 'player',
    netWorth: result.money, // Net worth should initially match money
    playerXP: 0,
    // Standard initial game state data
    buildingSlots: Array(20).fill({ building: null, level: 0 }),
    inventory: [
      { item: 'Mbao', quantity: 2000, marketPrice: 2.5 },
      { item: 'Matofali', quantity: 4000, marketPrice: 1.2 },
      { item: 'Saruji', quantity: 1000, marketPrice: 10 },
    ],
    playerStocks: [],
    transactions: [],
    notifications: [],
  };

  return finalResult;
}

const prompt = ai.definePrompt({
  name: 'generateAiPlayerPrompt',
  input: { schema: GenerateAiPlayerInputSchema },
  output: { schema: UserDataSchema },
  prompt: `You are a character creator for an African economic simulation game called "Uchumi wa Afrika".
Generate a single, compelling, and realistic AI player profile. The player should feel like a real person playing the game.

Generate the following fields based on the instructions in the schema.
- username
- money
- stars
- playerLevel
- privateNotes

Do not generate any other fields. The system will fill in the rest.
`,
});

const generateAiPlayerFlow = ai.defineFlow(
  {
    name: 'generateAiPlayerFlow',
    inputSchema: GenerateAiPlayerInputSchema,
    outputSchema: UserDataSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
