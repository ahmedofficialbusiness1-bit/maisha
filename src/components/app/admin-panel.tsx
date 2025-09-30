
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { simulateCommodityPrice, type SimulateCommodityPriceInput } from '@/ai/flows/commodity-price-simulation';
import { generateAiPlayer, type GenerateAiPlayerOutput } from '@/ai/flows/generate-ai-player';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getDatabase, ref, set } from 'firebase/database';
import { doc, setDoc } from 'firebase/firestore';
import { useDatabase } from '@/firebase';
import { Progress } from '../ui/progress';


const simulationFormSchema = z.object({
  commodity: z.string().min(1, 'Commodity name is required.'),
  supply: z.coerce.number().min(0, 'Supply must be a positive number.'),
  demand: z.coerce.number().min(0, 'Demand must be a positive number.'),
  worldEvents: z.string().min(1, 'World events description is required.'),
  adminAdjustment: z.coerce.number().optional(),
});

function CommoditySimulator() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<{ price: number; reasoning: string } | null>(null);

  const form = useForm<z.infer<typeof simulationFormSchema>>({
    resolver: zodResolver(simulationFormSchema),
    defaultValues: {
      commodity: '',
      supply: 1000,
      demand: 1000,
      worldEvents: 'No major events affecting the market.',
      adminAdjustment: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof simulationFormSchema>) => {
    setIsLoading(true);
    setResult(null);
    try {
      const simulationResult = await simulateCommodityPrice(values);
      setResult(simulationResult);
      toast({
        title: 'Simulation Successful',
        description: `The new simulated price for ${values.commodity} is $${simulationResult.price.toFixed(2)}.`,
      });
    } catch (error) {
      console.error('Simulation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Simulation Failed',
        description: 'Could not simulate the commodity price. Please check the console for errors.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
      <Card className="bg-gray-800/60 border-gray-700">
        <CardHeader>
          <CardTitle>Commodity Price Simulation</CardTitle>
          <CardDescription>
            Use this tool to simulate and understand commodity price changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="commodity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commodity</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mahindi" {...field} className="bg-gray-700 border-gray-600" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="supply"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Supply</FormLabel>
                      <FormControl>
                          <Input type="number" {...field} className="bg-gray-700 border-gray-600" />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField
                  control={form.control}
                  name="demand"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Demand</FormLabel>
                      <FormControl>
                          <Input type="number" {...field} className="bg-gray-700 border-gray-600" />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
               <FormField
                control={form.control}
                name="worldEvents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>World Events</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe any relevant world events..." {...field} className="bg-gray-700 border-gray-600"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="adminAdjustment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Price Adjustment (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-gray-700 border-gray-600" />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Run Simulation
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800/60 border-gray-700">
         <CardHeader>
          <CardTitle>Simulation Result</CardTitle>
          <CardDescription>
            The output of the price simulation will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
              <div className="flex justify-center items-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-400"/>
              </div>
          ) : result ? (
              <div className="space-y-4">
                  <div>
                      <p className="text-sm text-gray-400">Simulated Price</p>
                      <p className="text-3xl font-bold text-green-400">${result.price.toFixed(2)}</p>
                  </div>
                   <div>
                      <p className="text-sm text-gray-400">Reasoning</p>
                      <p className="text-base text-gray-200 bg-gray-900/50 p-3 rounded-md">{result.reasoning}</p>
                  </div>
              </div>
          ) : (
              <div className="flex justify-center items-center h-48 text-gray-500">
                  <p>Run a simulation to see the results.</p>
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PlayerManagement() {
    const { toast } = useToast();
    const rt_db = getDatabase();
    const { db: firestore } = useDatabase();
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [generationProgress, setGenerationProgress] = React.useState(0);
    const [generatedCount, setGeneratedCount] = React.useState(0);
    const totalPlayersToGenerate = 100;

    const handleGeneratePlayers = async () => {
        setIsGenerating(true);
        setGenerationProgress(0);
        setGeneratedCount(0);

        for (let i = 0; i < totalPlayersToGenerate; i++) {
            try {
                // This is a fake UID for the AI player for DB keying purposes
                const fakeUid = `ai-${Date.now()}-${i}`;
                
                const aiPlayerData: GenerateAiPlayerOutput = await generateAiPlayer({
                    uid: fakeUid,
                    email: `${fakeUid}@uchumi.ai`,
                });

                // Save to Realtime Database (/users/{uid})
                const userRef = ref(rt_db, `users/${fakeUid}`);
                await set(userRef, aiPlayerData);

                // Save to Firestore Leaderboard (/leaderboard/{uid})
                const leaderboardDocRef = doc(firestore, 'leaderboard', fakeUid);
                await setDoc(leaderboardDocRef, {
                    playerId: aiPlayerData.uid,
                    username: aiPlayerData.username,
                    score: aiPlayerData.netWorth,
                    avatar: `https://picsum.photos/seed/${aiPlayerData.uid}/100/100`,
                    level: aiPlayerData.playerLevel,
                });

                const newCount = i + 1;
                setGeneratedCount(newCount);
                setGenerationProgress((newCount / totalPlayersToGenerate) * 100);

            } catch (error) {
                console.error(`Failed to generate AI player ${i + 1}:`, error);
                toast({
                    variant: 'destructive',
                    title: 'Generation Error',
                    description: `Failed on player ${i + 1}. Check console for details.`,
                });
                break; // Stop generation on error
            }
        }

        setIsGenerating(false);
        if (generatedCount === totalPlayersToGenerate) {
            toast({
                title: 'Success!',
                description: `${totalPlayersToGenerate} AI players have been generated and added to the game.`,
            });
        }
    };


  return (
    <Card className="bg-gray-800/60 border-gray-700 mt-4">
        <CardHeader>
            <CardTitle>AI Player Generation</CardTitle>
            <CardDescription>Generate AI-powered players to populate the game world.</CardDescription>
        </CardHeader>
        <CardContent>
            {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-48 gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-400"/>
                    <div className='w-full max-w-sm text-center'>
                      <p>Generating players... {generatedCount} / {totalPlayersToGenerate}</p>
                      <Progress value={generationProgress} className="mt-2" />
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-48">
                    <Button onClick={handleGeneratePlayers} disabled={isGenerating}>
                        Generate 100 AI Players
                    </Button>
                </div>
            )}
        </CardContent>
    </Card>
  );
}

export function AdminPanel() {

  return (
    <div className="flex flex-col gap-4 text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">Tools for managing the game world and players.</p>
      </div>

       <Tabs defaultValue="players" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900/50">
            <TabsTrigger value="players">Player Management</TabsTrigger>
            <TabsTrigger value="economy">Economy Tools</TabsTrigger>
          </TabsList>
          <TabsContent value="players">
            <PlayerManagement />
          </TabsContent>
          <TabsContent value="economy">
             <CommoditySimulator />
          </TabsContent>
        </Tabs>
    </div>
  );
}
