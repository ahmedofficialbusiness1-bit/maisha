
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Banknote, Building2, Handshake, Landmark, LineChart, Package, Percent, Loader2, ChevronsUpDown, Check } from 'lucide-react';
import type { EconomyData, NationalOrder, Subsidy, TreasuryData } from '@/services/game-service';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { sectors } from '@/lib/building-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { encyclopediaData } from '@/lib/encyclopedia-data';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';


interface PresidentOfficePanelProps {
    treasury: TreasuryData | null;
    economy: EconomyData | null;
    officialPrices: Record<string, number>;
    nationalOrders: Record<string, NationalOrder>;
    onSetTaxRate: (rate: number) => void;
    onProposeSubsidy: (sector: string, amount: number) => void;
    onSetOfficialPrice: (item: string, price: number) => void;
    onCreateNationalOrder: (item: string, quantity: number, reward: number) => void;
}

const taxSchema = z.object({
  rate: z.coerce.number().min(0, "Rate must be positive").max(25, "Rate cannot exceed 25%"),
});

const subsidySchema = z.object({
  sector: z.string().min(1, "Sector is required"),
  amount: z.coerce.number().min(100000, "Subsidy must be at least $100,000"),
});

const priceSchema = z.object({
  item: z.string().min(1, "Item is required"),
  price: z.coerce.number().min(0.01, "Price must be positive"),
});

const orderSchema = z.object({
  item: z.string().min(1, "Item is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  reward: z.coerce.number().min(1, "Reward must be at least 1"),
});

const StatCard = ({ title, value, icon, description, formatAsCurrency = true }: { title: string, value: number | string, icon: React.ElementType, description: string, formatAsCurrency?: boolean }) => (
    <Card className="bg-gray-800/60 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {React.createElement(icon, { className: "h-5 w-5 text-gray-400" })}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">
                {typeof value === 'number' && formatAsCurrency ? `$${value.toLocaleString()}` : value}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

export function PresidentOfficePanel({ 
    treasury, 
    economy, 
    officialPrices, 
    nationalOrders,
    onSetTaxRate,
    onProposeSubsidy,
    onSetOfficialPrice,
    onCreateNationalOrder,
}: PresidentOfficePanelProps) {
  const { toast } = useToast();
  const [isItemPopoverOpen, setIsItemPopoverOpen] = React.useState(false);

  const taxForm = useForm<z.infer<typeof taxSchema>>({
    resolver: zodResolver(taxSchema),
    defaultValues: { rate: (economy?.taxRate || 0) * 100 },
  });

  const subsidyForm = useForm<z.infer<typeof subsidySchema>>({
    resolver: zodResolver(subsidySchema),
  });

  const priceForm = useForm<z.infer<typeof priceSchema>>({
    resolver: zodResolver(priceSchema),
  });

  const orderForm = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
  });

  const handleTaxSubmit = (data: z.infer<typeof taxSchema>) => {
    onSetTaxRate(data.rate / 100);
    toast({ title: "Tax Rate Updated", description: `Market tax rate set to ${data.rate}%` });
  };

  const handleSubsidySubmit = (data: z.infer<typeof subsidySchema>) => {
    onProposeSubsidy(data.sector, data.amount);
    toast({ title: "Subsidy Proposed", description: `Proposed a $${data.amount.toLocaleString()} subsidy for the ${data.sector} sector.` });
    subsidyForm.reset();
  };
  
  const handlePriceSubmit = (data: z.infer<typeof priceSchema>) => {
    onSetOfficialPrice(data.item, data.price);
    toast({ title: "Official Price Set", description: `Official price for ${data.item} set to $${data.price.toLocaleString()}`});
    priceForm.reset();
  }
  
  const handleOrderSubmit = (data: z.infer<typeof orderSchema>) => {
    onCreateNationalOrder(data.item, data.quantity, data.reward);
    toast({ title: "National Order Created", description: `Order for ${data.quantity.toLocaleString()}x ${data.item} created.`});
    orderForm.reset();
  }

  const itemsForForms = React.useMemo(() => encyclopediaData.filter(e => e.recipe || e.category === 'Raw Material'), []);

  return (
    <div className="flex flex-col gap-4 text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ofisi ya Rais</h1>
        <p className="text-muted-foreground">
          Simamia sera za kiuchumi na maendeleo ya taifa.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900/80">
          <TabsTrigger value="overview"><LineChart className="mr-2 h-4 w-4" />Uchumi</TabsTrigger>
          <TabsTrigger value="fiscal"><Percent className="mr-2 h-4 w-4" />Kodi na Ruzuku</TabsTrigger>
          <TabsTrigger value="prices"><Banknote className="mr-2 h-4 w-4" />Bei Elekezi</TabsTrigger>
          <TabsTrigger value="orders"><Handshake className="mr-2 h-4 w-4" />Tenda za Taifa</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    title="Mfuko wa Taifa" 
                    value={treasury?.balance || 0}
                    icon={Landmark}
                    description="Jumla ya fedha katika hazina ya taifa."
                />
                 <StatCard 
                    title="Kodi ya Soko" 
                    value={`${((economy?.taxRate || 0) * 100).toFixed(1)}%`}
                    icon={Percent}
                    description="Kiwango cha sasa cha kodi kwenye mauzo ya soko."
                    formatAsCurrency={false}
                />
                 <StatCard 
                    title="Tenda Zilizo Wazi" 
                    value={Object.values(nationalOrders || {}).filter(o => o.status === 'open').length}
                    icon={Handshake}
                    description="Idadi ya tenda za taifa zinazosubiri wazabuni."
                    formatAsCurrency={false}
                />
                <StatCard 
                    title="Sekta za Uchumi" 
                    value={7} // Hardcoded for now
                    icon={Building2}
                    description="Jumla ya sekta za kiuchumi nchini."
                    formatAsCurrency={false}
                />
            </div>
            <Card className="mt-4 bg-gray-800/60 border-gray-700">
                <CardHeader>
                    <CardTitle>Ripoti ya Uchumi</CardTitle>
                    <CardDescription>Inakuja hivi karibuni...</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">Sehemu hii itaonyesha grafu za ukuaji wa Pato la Taifa (GDP), mfumuko wa bei, na takwimu nyingine muhimu.</p>
                </CardContent>
            </Card>
        </TabsContent>

        {/* Fiscal Tools Tab */}
        <TabsContent value="fiscal" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gray-800/60 border-gray-700">
                <CardHeader>
                    <CardTitle>Badilisha Kodi ya Soko</CardTitle>
                    <CardDescription>Weka kiwango kipya cha kodi (0-25%).</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={taxForm.handleSubmit(handleTaxSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="tax-rate">Kiwango kipya cha Kodi (%)</Label>
                            <Input id="tax-rate" type="number" {...taxForm.register('rate')} className="mt-1 bg-gray-700 border-gray-600" />
                            {taxForm.formState.errors.rate && <p className="text-red-500 text-xs mt-1">{taxForm.formState.errors.rate.message}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={taxForm.formState.isSubmitting}>
                            {taxForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Weka Kodi Mpya
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <Card className="bg-gray-800/60 border-gray-700">
                <CardHeader>
                    <CardTitle>Pendekeza Ruzuku</CardTitle>
                    <CardDescription>Pendekeza ruzuku kwa sekta maalum. Itahitaji idhini ya Admin.</CardDescription>
                </CardHeader>
                <CardContent>
                     <form onSubmit={subsidyForm.handleSubmit(handleSubsidySubmit)} className="space-y-4">
                        <Controller
                            name="sector"
                            control={subsidyForm.control}
                            render={({ field }) => (
                                <div>
                                    <Label>Sekta</Label>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-full mt-1 bg-gray-700 border-gray-600">
                                            <SelectValue placeholder="Chagua sekta..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sectors.map(sector => <SelectItem key={sector} value={sector}>{sector}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                     {subsidyForm.formState.errors.sector && <p className="text-red-500 text-xs mt-1">{subsidyForm.formState.errors.sector.message}</p>}
                                </div>
                            )}
                        />
                         <div>
                            <Label htmlFor="subsidy-amount">Kiasi cha Ruzuku ($)</Label>
                            <Input id="subsidy-amount" type="number" {...subsidyForm.register('amount')} className="mt-1 bg-gray-700 border-gray-600" />
                            {subsidyForm.formState.errors.amount && <p className="text-red-500 text-xs mt-1">{subsidyForm.formState.errors.amount.message}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={subsidyForm.formState.isSubmitting}>
                             {subsidyForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Pendekeza Ruzuku
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </TabsContent>

        {/* Price Control Tab */}
        <TabsContent value="prices" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gray-800/60 border-gray-700">
                <CardHeader>
                    <CardTitle>Weka Bei Elekezi</CardTitle>
                    <CardDescription>Panga bei rasmi za bidhaa sokoni.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={priceForm.handleSubmit(handlePriceSubmit)} className="space-y-4">
                        <Controller
                            name="item"
                            control={priceForm.control}
                            render={({ field }) => (
                                <div className="flex flex-col space-y-1.5">
                                    <Label>Bidhaa</Label>
                                    <Popover open={isItemPopoverOpen} onOpenChange={setIsItemPopoverOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value && "text-muted-foreground")}>
                                                {field.value ? itemsForForms.find((item) => item.name === field.value)?.name : "Chagua bidhaa"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                                            <Command>
                                                <CommandInput placeholder="Tafuta bidhaa..." />
                                                <CommandList>
                                                    <CommandEmpty>Hakuna bidhaa.</CommandEmpty>
                                                    <CommandGroup>
                                                        {itemsForForms.map((item) => (
                                                            <CommandItem value={item.name} key={item.id} onSelect={() => {priceForm.setValue("item", item.name); setIsItemPopoverOpen(false);}}>
                                                                <Check className={cn("mr-2 h-4 w-4", item.name === field.value ? "opacity-100" : "opacity-0")} />
                                                                {item.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                     {priceForm.formState.errors.item && <p className="text-red-500 text-xs mt-1">{priceForm.formState.errors.item.message}</p>}
                                </div>
                            )}
                        />
                         <div>
                            <Label htmlFor="price-control-price">Bei Mpya ($)</Label>
                            <Input id="price-control-price" type="number" step="0.01" {...priceForm.register('price')} className="mt-1 bg-gray-700 border-gray-600" />
                            {priceForm.formState.errors.price && <p className="text-red-500 text-xs mt-1">{priceForm.formState.errors.price.message}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={priceForm.formState.isSubmitting}>
                             {priceForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Weka Bei
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <Card className="bg-gray-800/60 border-gray-700">
                <CardHeader>
                    <CardTitle>Orodha ya Bei Elekezi</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-72">
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Bidhaa</TableHead>
                                    <TableHead className="text-right">Bei</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(officialPrices).map(([item, price]) => (
                                    <TableRow key={item}>
                                        <TableCell>{item}</TableCell>
                                        <TableCell className="text-right font-mono">${price.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                         </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </TabsContent>

        {/* National Orders Tab */}
        <TabsContent value="orders" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
             <Card className="bg-gray-800/60 border-gray-700">
                <CardHeader>
                    <CardTitle>Anzisha Tenda ya Taifa</CardTitle>
                    <CardDescription>Pendekeza ununuzi wa bidhaa kwa niaba ya taifa.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={orderForm.handleSubmit(handleOrderSubmit)} className="space-y-4">
                         <Controller
                            name="item"
                            control={orderForm.control}
                            render={({ field }) => (
                                <div className="flex flex-col space-y-1.5">
                                    <Label>Bidhaa</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value && "text-muted-foreground")}>
                                                {field.value ? itemsForForms.find((item) => item.name === field.value)?.name : "Chagua bidhaa"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                                            <Command>
                                                <CommandInput placeholder="Tafuta bidhaa..." />
                                                <CommandList>
                                                    <CommandEmpty>Hakuna bidhaa.</CommandEmpty>
                                                    <CommandGroup>
                                                        {itemsForForms.map((item) => (
                                                            <CommandItem value={item.name} key={item.id} onSelect={() => orderForm.setValue("item", item.name)}>
                                                                <Check className={cn("mr-2 h-4 w-4", item.name === field.value ? "opacity-100" : "opacity-0")} />
                                                                {item.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                     {orderForm.formState.errors.item && <p className="text-red-500 text-xs mt-1">{orderForm.formState.errors.item.message}</p>}
                                </div>
                            )}
                        />
                         <div>
                            <Label htmlFor="order-quantity">Kiasi Kinachohitajika</Label>
                            <Input id="order-quantity" type="number" {...orderForm.register('quantity')} className="mt-1 bg-gray-700 border-gray-600" />
                             {orderForm.formState.errors.quantity && <p className="text-red-500 text-xs mt-1">{orderForm.formState.errors.quantity.message}</p>}
                        </div>
                         <div>
                            <Label htmlFor="order-reward">Zawadi ($)</Label>
                            <Input id="order-reward" type="number" {...orderForm.register('reward')} className="mt-1 bg-gray-700 border-gray-600" />
                             {orderForm.formState.errors.reward && <p className="text-red-500 text-xs mt-1">{orderForm.formState.errors.reward.message}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={orderForm.formState.isSubmitting}>
                             {orderForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Anzisha Tenda
                        </Button>
                    </form>
                </CardContent>
            </Card>
             <Card className="bg-gray-800/60 border-gray-700">
                <CardHeader>
                    <CardTitle>Orodha ya Tenda za Taifa</CardTitle>
                </CardHeader>
                <CardContent>
                     <ScrollArea className="h-72">
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Bidhaa</TableHead>
                                    <TableHead>Kiasi</TableHead>
                                    <TableHead>Hali</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(nationalOrders).map(([id, order]) => (
                                    <TableRow key={id}>
                                        <TableCell>{order.product}</TableCell>
                                        <TableCell>{order.quantityRequired.toLocaleString()}</TableCell>
                                        <TableCell className={cn(order.status === 'open' ? 'text-yellow-400' : 'text-green-400')}>{order.status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                         </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
