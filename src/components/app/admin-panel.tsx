
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
import { Loader2, Users, Wifi, WifiOff } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAllPlayers, type PlayerPublicData } from '@/firebase/database/use-all-players';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';


const simulationFormSchema = z.object({
  commodity: z.string().min(1, 'Commodity name is required.'),
  supply: z.coerce.number().min(0, 'Supply must be a positive number.'),
  demand: z.coerce.number().min(0, 'Demand must be a positive number.'),
  worldEvents: z.string().min(1, 'World events description is required.'),
  adminAdjustment: z.coerce.number().optional(),
});

interface AdminPanelProps {
    onViewProfile: (playerId: string) => void;
}

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

function PlayerManager({ onViewProfile }: AdminPanelProps) {
    const { players, loading } = useAllPlayers();

    const { onlinePlayers, offlinePlayers } = React.useMemo(() => {
        if (!players) return { onlinePlayers: [], offlinePlayers: [] };
        
        const now = Date.now();
        const ONLINE_THRESHOLD = 5 * 60 * 1000; // 5 minutes

        const online = players.filter(p => p.lastSeen && (now - p.lastSeen < ONLINE_THRESHOLD));
        const offline = players.filter(p => !p.lastSeen || (now - p.lastSeen >= ONLINE_THRESHOLD));

        return { onlinePlayers: online, offlinePlayers: offline };
    }, [players]);


    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400"/>
            </div>
        )
    }
    
    const PlayerListItem = ({ player }: { player: PlayerPublicData }) => (
      <div 
        key={player.uid} 
        className="flex items-center justify-between p-2 rounded-md hover:bg-gray-700/50 cursor-pointer"
        onClick={() => onViewProfile(player.uid)}
      >
          <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                  <AvatarImage src={player.avatar} alt={player.username} data-ai-hint="player avatar" />
                  <AvatarFallback>{player.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                  <p className="font-semibold">{player.username}</p>
                  <p className="text-xs text-gray-400">{player.email}</p>
              </div>
          </div>
          {player.lastSeen && !onlinePlayers.some(p => p.uid === player.uid) && (
              <p className="text-xs text-gray-400">
                  Last seen {formatDistanceToNow(new Date(player.lastSeen), { addSuffix: true })}
              </p>
          )}
      </div>
    );

    return (
        <div className="mt-6">
            <Card className="bg-gray-800/60 border-gray-700">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users /> Player Management
                    </CardTitle>
                    <CardDescription>
                        Total Players: {players?.length || 0}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Online Players */}
                        <div className="flex flex-col">
                            <h3 className="font-bold mb-2 flex items-center gap-2"><Wifi className="text-green-400" /> Online ({onlinePlayers.length})</h3>
                            <ScrollArea className="h-72 flex-grow p-1 rounded-md bg-gray-900/50 border border-gray-700">
                                {onlinePlayers.length > 0 ? (
                                    <div className="space-y-1">
                                        {onlinePlayers.map(player => <PlayerListItem key={player.uid} player={player} />)}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">No players currently online.</div>
                                )}
                            </ScrollArea>
                        </div>

                        {/* Offline Players */}
                        <div className="flex flex-col">
                            <h3 className="font-bold mb-2 flex items-center gap-2"><WifiOff className="text-red-400" /> Offline ({offlinePlayers.length})</h3>
                             <ScrollArea className="h-72 flex-grow p-1 rounded-md bg-gray-900/50 border border-gray-700">
                                {offlinePlayers.length > 0 ? (
                                     <div className="space-y-1">
                                        {offlinePlayers.map(player => <PlayerListItem key={player.uid} player={player} />)}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">No offline players.</div>
                                )}
                            </ScrollArea>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


export function AdminPanel({ onViewProfile }: AdminPanelProps) {

  return (
    <div className="flex flex-col gap-4 text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">Tools for managing the game world.</p>
      </div>

       <Tabs defaultValue="players" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900/50">
            <TabsTrigger value="players">Player Management</TabsTrigger>
            <TabsTrigger value="economy">Economy Tools</TabsTrigger>
          </TabsList>
          <TabsContent value="players">
            <PlayerManager onViewProfile={onViewProfile} />
          </TabsContent>
          <TabsContent value="economy">
             <CommoditySimulator />
          </TabsContent>
        </Tabs>

    </div>
  );
}


    

    

    