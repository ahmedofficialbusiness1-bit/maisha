
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
import { Crown, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, type Timestamp } from 'firebase/firestore';
import type { UserData } from '@/app/game';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

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
  const [players, setPlayers] = React.useState<UserData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('netWorth', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const playersData: UserData[] = [];
      querySnapshot.forEach((doc) => {
        playersData.push(doc.data() as UserData);
      });
      setPlayers(playersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatLastSeen = (timestamp: Timestamp | Date | null) => {
    if (!timestamp) return 'N/A';
    const date = (timestamp as Timestamp).toDate ? (timestamp as Timestamp).toDate() : (timestamp as Date);
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return (
    <Card className="bg-gray-800/60 border-gray-700 mt-4">
        <CardHeader>
            <CardTitle>Player List</CardTitle>
            <CardDescription>A real-time list of all registered players.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-700/50">
                  <TableHead className="text-white w-[60px]">Rank</TableHead>
                  <TableHead className="text-white">Player</TableHead>
                  <TableHead className="text-right text-white">Net Worth</TableHead>
                  <TableHead className="text-right text-white">Level</TableHead>
                  <TableHead className="text-right text-white">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((player, index) => (
                  <TableRow key={player.uid} className={cn("border-gray-700", index < 3 && "bg-yellow-500/5")}>
                    <TableCell className="font-bold text-lg text-center">
                       {index === 0 && <Crown className="h-6 w-6 text-yellow-400 inline" />}
                       {index > 0 && (index + 1)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://picsum.photos/seed/${player.uid}/40/40`} alt={player.username} data-ai-hint="player avatar" />
                          <AvatarFallback>{player.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <span className="font-medium">{player.username}</span>
                            <p className="text-xs text-gray-400">{player.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-green-400 text-base">
                      ${player.netWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </TableCell>
                    <TableCell className="text-right font-mono text-blue-400 text-base">
                        {player.playerLevel}
                    </TableCell>
                     <TableCell className="text-right">
                       <div className={cn('flex items-center justify-end gap-2 text-xs', player.status === 'online' ? 'text-green-400' : 'text-gray-500')}>
                          <div className={cn('h-2 w-2 rounded-full', player.status === 'online' ? 'bg-green-500' : 'bg-gray-500')} />
                          {player.status === 'online' ? 'Online' : formatLastSeen(player.lastSeen)}
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

    