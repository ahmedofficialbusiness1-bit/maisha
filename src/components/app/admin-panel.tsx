
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
import { simulateCommodityPrice } from '@/ai/flows/commodity-price-simulation';
import { Check, ChevronsUpDown, CircleDollarSign, Crown, Gift, Loader2, Star, Users, Wifi, WifiOff } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAllPlayers, type PlayerPublicData } from '@/firebase/database/use-all-players';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { encyclopediaData } from '@/lib/encyclopedia-data';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { getDatabase, ref, set, push, runTransaction, update } from 'firebase/database';


const simulationFormSchema = z.object({
  commodity: z.string().min(1, 'Commodity name is required.'),
  supply: z.coerce.number().min(0, 'Supply must be a positive number.'),
  demand: z.coerce.number().min(0, 'Demand must be a positive number.'),
  worldEvents: z.string().min(1, 'World events description is required.'),
  adminAdjustment: z.coerce.number().optional(),
});

const itemSenderFormSchema = z.object({
    itemName: z.string({ required_error: 'Please select an item.' }),
    quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
    targetUid: z.string().min(1, 'Target UID is required.'),
});

const currencySenderSchema = z.object({
    amount: z.coerce.number().min(1, "Amount must be greater than 0."),
    targetUid: z.string().min(1, "Target UID is required."),
});


interface AdminPanelProps {
    onViewProfile: (playerId: string) => void;
    president: PlayerPublicData | null;
    electionState: 'open' | 'closed';
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

function PlayerManager({ onViewProfile }: Pick<AdminPanelProps, 'onViewProfile'>) {
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

function GameTools() {
    const { toast } = useToast();
    const database = getDatabase();
    
    const defaultItemValues = {
        itemName: '',
        quantity: 0,
        targetUid: '',
    };
    const defaultCurrencyValues = {
        amount: 0,
        targetUid: '',
    };

    // States for Item Sender
    const [isItemLoading, setIsItemLoading] = React.useState(false);
    const [isItemPopoverOpen, setIsItemPopoverOpen] = React.useState(false);
    const itemForm = useForm<z.infer<typeof itemSenderFormSchema>>({
        resolver: zodResolver(itemSenderFormSchema),
        defaultValues: defaultItemValues,
    });

    // States for Money Sender
    const [isMoneyLoading, setIsMoneyLoading] = React.useState(false);
    const moneyForm = useForm<z.infer<typeof currencySenderSchema>>({
        resolver: zodResolver(currencySenderSchema),
        defaultValues: defaultCurrencyValues,
    });

    // States for Stars Sender
    const [isStarsLoading, setIsStarsLoading] = React.useState(false);
    const starsForm = useForm<z.infer<typeof currencySenderSchema>>({
        resolver: zodResolver(currencySenderSchema),
        defaultValues: defaultCurrencyValues,
    });

  const onAdminSendItem = (itemName: string, quantity: number, targetUid: string) => {
    const newContractRef = push(ref(database, 'contracts'));
    const productInfo = encyclopediaData.find(e => e.name === itemName);

    const newContract: Omit<any, 'id'> = {
        commodity: itemName,
        quantity,
        pricePerUnit: 0, // Free
        sellerUid: 'admin-system',
        sellerName: 'Game Master',
        sellerAvatar: 'https://picsum.photos/seed/admin/40/40',
        status: 'open',
        createdAt: Date.now(),
        expiresAt: Date.now() + 5 * 24 * 60 * 60 * 1000,
        buyerIdentifier: targetUid,
        imageHint: productInfo?.imageHint || 'gift box'
    };

    set(newContractRef, newContract);
    toast({ title: 'Item Sent', description: `Sent a contract for ${quantity}x ${itemName} to user ${targetUid}.`});
  };

  const onAdminSendMoney = (amount: number, targetUid: string) => {
      const targetUserRef = ref(database, `users/${targetUid}`);
      runTransaction(targetUserRef, (userData) => {
          if (userData) {
              userData.money += amount;
          }
          return userData;
      });
      toast({ title: 'Money Sent', description: `Sent $${amount} to user ${targetUid}.`});
  }

  const onAdminSendStars = (amount: number, targetUid: string) => {
      const targetUserRef = ref(database, `users/${targetUid}`);
      runTransaction(targetUserRef, (userData) => {
          if (userData) {
              userData.stars += amount;
          }
          return userData;
      });
      toast({ title: 'Stars Sent', description: `Sent ${amount} stars to user ${targetUid}.`});
  }
  
    const onSendItemSubmit = (values: z.infer<typeof itemSenderFormSchema>) => {
        setIsItemLoading(true);
        try {
            onAdminSendItem(values.itemName, values.quantity, values.targetUid);
            itemForm.reset(defaultItemValues);
        } catch (error) {
            console.error("Failed to send item:", error);
            toast({
                variant: 'destructive',
                title: 'Failed to Send Item',
                description: 'An error occurred while sending the item contract.',
            });
        } finally {
            setIsItemLoading(false);
        }
    };
    
    const onSendMoneySubmit = (values: z.infer<typeof currencySenderSchema>) => {
        setIsMoneyLoading(true);
        try {
            onAdminSendMoney(values.amount, values.targetUid);
            moneyForm.reset(defaultCurrencyValues);
        } catch (error) {
            console.error("Failed to send money:", error);
        } finally {
            setIsMoneyLoading(false);
        }
    };

    const onSendStarsSubmit = (values: z.infer<typeof currencySenderSchema>) => {
        setIsStarsLoading(true);
        try {
            onAdminSendStars(values.amount, values.targetUid);
            starsForm.reset(defaultCurrencyValues);
        } catch (error) {
             console.error("Failed to send stars:", error);
        } finally {
            setIsStarsLoading(false);
        }
    };
    
    const items = encyclopediaData;

    return (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                <Card className="bg-gray-800/60 border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Gift /> Admin Item Sender
                        </CardTitle>
                        <CardDescription>
                            Send any item as a free contract.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...itemForm}>
                            <form onSubmit={itemForm.handleSubmit(onSendItemSubmit)} className="space-y-6">
                                <FormField
                                    control={itemForm.control}
                                    name="itemName"
                                    render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Item</FormLabel>
                                        <Popover open={isItemPopoverOpen} onOpenChange={setIsItemPopoverOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                "w-full justify-between",
                                                !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                ? items.find(
                                                    (item) => item.name === field.value
                                                    )?.name
                                                : "Select item"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search item..." />
                                                <CommandList>
                                                    <CommandEmpty>No item found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {items.map((item) => (
                                                        <CommandItem
                                                            value={item.name}
                                                            key={item.id}
                                                            onSelect={() => {
                                                                itemForm.setValue("itemName", item.name)
                                                                setIsItemPopoverOpen(false)
                                                            }}
                                                        >
                                                            <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                item.name === field.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                            )}
                                                            />
                                                            {item.name}
                                                        </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />

                                <FormField
                                    control={itemForm.control}
                                    name="quantity"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity</FormLabel>
                                        <FormControl>
                                        <Input type="number" placeholder="100" {...field} className="bg-gray-700 border-gray-600" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />

                                <FormField
                                    control={itemForm.control}
                                    name="targetUid"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Target Player UID</FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter player UID" {...field} className="bg-gray-700 border-gray-600" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isItemLoading}>
                                    {isItemLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Send Item Contract
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="bg-gray-800/60 border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CircleDollarSign /> Send Money
                        </CardTitle>
                        <CardDescription>
                            Directly add money to a player's account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...moneyForm}>
                            <form onSubmit={moneyForm.handleSubmit(onSendMoneySubmit)} className="space-y-6">
                                <FormField
                                    control={moneyForm.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Amount</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="10000" {...field} className="bg-gray-700 border-gray-600" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={moneyForm.control}
                                    name="targetUid"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Target Player UID</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter player UID" {...field} className="bg-gray-700 border-gray-600" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isMoneyLoading}>
                                    {isMoneyLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Send Money
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800/60 border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star /> Send Stars
                        </CardTitle>
                        <CardDescription>
                            Directly add Star Boosts to a player's account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...starsForm}>
                            <form onSubmit={starsForm.handleSubmit(onSendStarsSubmit)} className="space-y-6">
                                <FormField
                                    control={starsForm.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Amount</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="100" {...field} className="bg-gray-700 border-gray-600" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={starsForm.control}
                                    name="targetUid"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Target Player UID</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter player UID" {...field} className="bg-gray-700 border-gray-600" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700" disabled={isStarsLoading}>
                                    {isStarsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Send Stars
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

const appointPresidentSchema = z.object({
    targetUid: z.string().min(1, 'UID is required'),
})

function PresidencyTools({ president, electionState }: Pick<AdminPanelProps, 'president' | 'electionState'>) {
    const database = getDatabase();
    
    const onAdminAppointPresident = (uid: string) => {
        const updates: Record<string, any> = {};
        updates[`/election/presidentUid`] = uid;
        runTransaction(ref(database, `users/${uid}`), (userData) => {
          if (userData) {
              userData.role = 'president';
          }
          return userData;
        });
        update(ref(database), updates);
    };

    const onAdminRemovePresident = () => {
        if(president) {
            runTransaction(ref(database, `users/${president.uid}`), (userData) => {
                if(userData) {
                    userData.role = 'player';
                }
                return userData;
            });
        }
        update(ref(database), { '/election/presidentUid': null });
    };

    const onAdminManageElection = (state: 'open' | 'closed') => {
        update(ref(database), { '/election/state': state });
    };

    const form = useForm<z.infer<typeof appointPresidentSchema>>({
        resolver: zodResolver(appointPresidentSchema),
        defaultValues: { targetUid: '' }
    })
    
    const onAppointSubmit = (values: z.infer<typeof appointPresidentSchema>) => {
        onAdminAppointPresident(values.targetUid);
        form.reset();
    }

    return (
        <div className="mt-6 space-y-6">
            <Card className="bg-gray-800/60 border-gray-700">
                <CardHeader>
                    <CardTitle>Current President</CardTitle>
                </CardHeader>
                <CardContent>
                    {president ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={president.avatar} alt={president.username} data-ai-hint="player avatar" />
                                    <AvatarFallback>{president.username.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-lg">{president.username}</p>
                                    <p className="text-sm text-gray-400 font-mono">{president.uid}</p>
                                </div>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">Remove President</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will remove the current president from power. The seat will be vacant until a new president is elected or appointed.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={onAdminRemovePresident}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    ) : (
                        <p className="text-gray-400">There is currently no president.</p>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-gray-800/60 border-gray-700">
                <CardHeader>
                    <CardTitle>Appoint President</CardTitle>
                    <CardDescription>Directly appoint a player as president, bypassing elections.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Form {...form}>
                        <form onSubmit={form.handleSubmit(onAppointSubmit)} className="flex items-end gap-4">
                             <FormField
                                control={form.control}
                                name="targetUid"
                                render={({ field }) => (
                                    <FormItem className="flex-grow">
                                        <FormLabel>Player UID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter player UID to appoint" {...field} className="bg-gray-700 border-gray-600" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Appoint</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            
            <Card className="bg-gray-800/60 border-gray-700">
                <CardHeader>
                    <CardTitle>Election Control</CardTitle>
                     <CardDescription>Manage the state of the presidential election.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <p>Current State: <span className={cn("font-bold", electionState === 'open' ? 'text-green-400' : 'text-red-400')}>{electionState.toUpperCase()}</span></p>
                    {electionState === 'closed' ? (
                        <Button onClick={() => onAdminManageElection('open')} variant="secondary">Open Elections</Button>
                    ) : (
                         <Button onClick={() => onAdminManageElection('closed')} variant="destructive">Close Elections & Tally</Button>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export function AdminPanel({ onViewProfile, president, electionState }: AdminPanelProps) {

  return (
    <div className="flex flex-col gap-4 text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">Tools for managing the game world.</p>
      </div>

       <Tabs defaultValue="players" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50">
            <TabsTrigger value="players">Player Management</TabsTrigger>
            <TabsTrigger value="economy">Economy Tools</TabsTrigger>
            <TabsTrigger value="tools">Game Tools</TabsTrigger>
            <TabsTrigger value="presidency">Urais</TabsTrigger>
          </TabsList>
          <TabsContent value="players">
            <PlayerManager onViewProfile={onViewProfile} />
          </TabsContent>
          <TabsContent value="economy">
             <CommoditySimulator />
          </TabsContent>
          <TabsContent value="tools">
             <GameTools />
          </TabsContent>
           <TabsContent value="presidency">
             <PresidencyTools president={president} electionState={electionState}/>
          </TabsContent>
        </Tabs>

    </div>
  );
}
