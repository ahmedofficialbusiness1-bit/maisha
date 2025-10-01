
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '../ui/separator';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, FileSignature, Archive, Handshake, Inbox, Check, X, Hourglass, History } from 'lucide-react';
import { encyclopediaData } from '@/lib/encyclopedia-data';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import type { ContractListing } from './trade-market';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export type InventoryItem = {
  item: string;
  quantity: number;
  marketPrice: number;
};

interface InventoryProps {
  inventoryItems: InventoryItem[];
  contractListings: ContractListing[];
  onPostToMarket: (item: InventoryItem, quantity: number, price: number) => void;
  onCreateContract: (item: InventoryItem, quantity: number, pricePerUnit: number, targetIdentifier: string) => void;
  onAcceptContract: (contract: ContractListing) => void;
  onRejectContract: (contract: ContractListing) => void;
  onCancelContract: (contract: ContractListing) => void;
  currentUserId: string;
  currentUsername: string;
}

function ItemInventoryView({ inventoryItems, onPostToMarket, onCreateContract }: Pick<InventoryProps, 'inventoryItems' | 'onPostToMarket' | 'onCreateContract'>) {
  const [isSellDialogOpen, setIsSellDialogOpen] = React.useState(false);
  const [isContractDialogOpen, setIsContractDialogOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<InventoryItem | null>(null);
  
  // State for Market Sell
  const [marketQuantity, setMarketQuantity] = React.useState(1);
  const [marketPrice, setMarketPrice] = React.useState(0);
  const [officialPrice, setOfficialPrice] = React.useState(0);
  const [priceFloor, setPriceFloor] = React.useState(0);
  const [priceCeiling, setPriceCeiling] = React.useState(0);

  // State for Contract
  const [contractQuantity, setContractQuantity] = React.useState(10);
  const [contractPrice, setContractPrice] = React.useState(0);
  const [contractTarget, setContractTarget] = React.useState('');

  const handleOpenSellDialog = (item: InventoryItem) => {
    const entry = encyclopediaData.find(e => e.name === item.item);
    const officialMarketPrice = entry ? parseFloat(entry.properties.find(p => p.label === 'Market Cost')?.value.replace('$', '').replace(/,/g, '') || '0') : item.marketPrice;
    
    const floor = officialMarketPrice * 0.85;
    const ceiling = officialMarketPrice * 1.15;

    setSelectedItem(item);
    setOfficialPrice(officialMarketPrice);
    setMarketPrice(officialMarketPrice);
    setPriceFloor(floor);
    setPriceCeiling(ceiling);
    setMarketQuantity(1);
    setIsSellDialogOpen(true);
  };
  
  const handleOpenContractDialog = (item: InventoryItem) => {
    const entry = encyclopediaData.find(e => e.name === item.item);
    const officialMarketPrice = entry ? parseFloat(entry.properties.find(p => p.label === 'Market Cost')?.value.replace('$', '').replace(/,/g, '') || '0') : item.marketPrice;

    setSelectedItem(item);
    setContractPrice(officialMarketPrice * 0.95); // Default contract price to 95% of market
    setContractQuantity(10);
    setContractTarget('');
    setIsContractDialogOpen(true);
  };


  const handleConfirmPost = () => {
    if (selectedItem) {
      onPostToMarket(selectedItem, marketQuantity, marketPrice);
      setIsSellDialogOpen(false);
    }
  };
  
  const handleConfirmContract = () => {
    if (selectedItem) {
      onCreateContract(selectedItem, contractQuantity, contractPrice, contractTarget);
      setIsContractDialogOpen(false);
    }
  };

  return (
    <>
      <Card className="bg-gray-800/60 border-gray-700 text-white">
          <CardHeader>
            <CardTitle>Orodha ya Bidhaa</CardTitle>
            <CardDescription className="text-gray-400">
              Hizi ndizo bidhaa ulizonazo kwenye ghala lako.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-700/50 sticky top-0 bg-gray-800/95">
                    <TableHead className="text-white">Bidhaa</TableHead>
                    <TableHead className="text-right text-white">Idadi</TableHead>
                    <TableHead className="text-right text-white">Vitendo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryItems.map(item => {
                    const productInfo = encyclopediaData.find(e => e.name === item.item);
                    return (
                      <TableRow
                          key={item.item}
                          className="border-gray-700 hover:bg-gray-700/50"
                      >
                          <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                  {productInfo && (
                                      <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gray-700/60'>
                                        {React.createElement(productInfo.icon, { className: 'h-6 w-6' })}
                                      </div>
                                  )}
                                  <span>{item.item}</span>
                              </div>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                          {item.quantity.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                          <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0" disabled={item.quantity <= 0}>
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                              </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                              <DropdownMenuItem onClick={() => handleOpenSellDialog(item)}>
                                  Sell on Market
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenContractDialog(item)}>
                                  Create Contract
                              </DropdownMenuItem>
                              </DropdownMenuContent>
                          </DropdownMenu>
                          </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
              {inventoryItems.length === 0 && (
                <div className="flex items-center justify-center h-48 text-gray-400">
                    <p>Ghala lako ni tupu.</p>
                </div>
              )}
          </CardContent>
        </Card>

      {/* Market Sell Dialog */}
      <Dialog open={isSellDialogOpen} onOpenChange={setIsSellDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Sell {selectedItem?.item} on the Market</DialogTitle>
            <DialogDescription>
              Set the quantity and price to list your item on the player market.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
             <div className="grid gap-4 py-4">
                <div className="grid gap-2 sm:grid-cols-4 sm:items-center sm:gap-4">
                    <Label htmlFor="quantity" className="sm:text-right">Quantity</Label>
                    <Input 
                        id="quantity" 
                        type="number"
                        value={marketQuantity}
                        onChange={(e) => setMarketQuantity(Math.max(1, Math.min(Number(e.target.value), selectedItem.quantity)))}
                        min="1"
                        max={selectedItem.quantity}
                        className="sm:col-span-3 bg-gray-800 border-gray-600"
                    />
                </div>
                 <div className="grid gap-2 sm:grid-cols-4 sm:items-center sm:gap-4">
                    <Label htmlFor="price" className="sm:text-right">Price/Unit</Label>
                    <Input 
                        id="price" 
                        type="number"
                        value={marketPrice}
                        onChange={(e) => setMarketPrice(Math.max(priceFloor, Math.min(Number(e.target.value), priceCeiling)))}
                        min={priceFloor}
                        max={priceCeiling}
                        step="0.01"
                        className="sm:col-span-3 bg-gray-800 border-gray-600"
                    />
                </div>
                <div className='col-span-4 text-xs text-center text-gray-400'>
                     <p>Official Market Price (Bei Elekezi): ${officialPrice.toFixed(2)}</p>
                     <p>Allowed Range: ${priceFloor.toFixed(2)} - ${priceCeiling.toFixed(2)}</p>
                </div>
                <Separator className="my-2 bg-gray-700"/>
                <div className='text-center'>
                    <p className="text-lg font-bold">Total Sale Value</p>
                    <p className='text-2xl font-mono text-green-400'>${(marketQuantity * marketPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="text-xs text-gray-500 mt-1">A 5% market tax will be deducted upon sale.</p>
                </div>
             </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSellDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!selectedItem || marketQuantity <= 0 || marketQuantity > selectedItem.quantity}
              onClick={handleConfirmPost}
            >
              Post to Market
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Contract Dialog */}
       <Dialog open={isContractDialogOpen} onOpenChange={setIsContractDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Create a Contract for {selectedItem?.item}</DialogTitle>
            <DialogDescription>
                Weka masharti ya mkataba wako. Mkataba utaisha baada ya siku 5 kama haujakubaliwa.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-grow overflow-y-auto -mr-6 pr-6">
            {selectedItem && (
              <div className="space-y-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="c-target">Mpokeaji (Jina au UID)</Label>
                    <Input 
                        id="c-target" 
                        type="text"
                        placeholder="Acha wazi kwa mkataba wa umma"
                        value={contractTarget}
                        onChange={(e) => setContractTarget(e.target.value)}
                        className="bg-gray-800 border-gray-600"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="c-qty">Kiasi (Una: {selectedItem.quantity.toLocaleString()})</Label>
                    <Input 
                        id="c-qty" 
                        type="number"
                        value={contractQuantity}
                        onChange={(e) => setContractQuantity(Math.max(1, Math.min(Number(e.target.value), selectedItem.quantity)))}
                        min="1"
                        max={selectedItem.quantity}
                        className="bg-gray-800 border-gray-600"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="c-price">Bei kwa Kipande (Price/Unit)</Label>
                    <Input 
                        id="c-price" 
                        type="number"
                        value={contractPrice}
                        onChange={(e) => setContractPrice(Number(e.target.value))}
                        step="0.01"
                        className="bg-gray-800 border-gray-600"
                    />
                    <p className="text-xs text-gray-400 mt-1">Bei elekezi sokoni ni ${selectedItem.marketPrice.toFixed(2)}. Weka bei ya kuvutia.</p>
                  </div>
                  
                  <Separator className="my-4 bg-gray-700"/>

                  <div className="p-4 bg-gray-800 rounded-lg space-y-2 text-sm">
                      <div className="flex justify-between"><span>Jumla ya Gharama ya Mkataba:</span> <span className="font-bold text-green-400">${(contractQuantity * contractPrice).toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                  </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="mt-auto pt-4 border-t border-gray-800 -mx-6 px-6 pb-6">
            <Button variant="outline" onClick={() => setIsContractDialogOpen(false)}>Ghairi</Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!selectedItem || contractQuantity <= 0 || contractQuantity > selectedItem.quantity || contractPrice <= 0}
              onClick={handleConfirmContract}
            >
              Chapisha Mkataba
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ContractInventoryView({ contractListings, currentUserId, currentUsername, onAcceptContract, onRejectContract, onCancelContract }: Pick<InventoryProps, 'contractListings' | 'currentUserId' | 'currentUsername' | 'onAcceptContract' | 'onRejectContract' | 'onCancelContract'>) {
    const { incoming, outgoing, history } = React.useMemo(() => {
        const myContracts = contractListings.filter(c => {
            const isSeller = c.sellerUid === currentUserId;
            const isTargetedBuyer = c.buyerIdentifier === currentUserId || c.buyerIdentifier === currentUsername;
            const isPublicAndOpen = !c.buyerIdentifier && c.status === 'open';
            return isSeller || isTargetedBuyer || isPublicAndOpen;
        });

        const incoming = myContracts.filter(c => c.status === 'open' && c.sellerUid !== currentUserId);
        const outgoing = myContracts.filter(c => c.status === 'open' && c.sellerUid === currentUserId);
        const history = myContracts.filter(c => c.status !== 'open');

        return { incoming, outgoing, history };
    }, [contractListings, currentUserId, currentUsername]);

    const renderContractCard = (contract: ContractListing) => {
        const isSeller = contract.sellerUid === currentUserId;
        const isBuyer = !isSeller;
        const productInfo = encyclopediaData.find(e => e.name === contract.commodity);

        let statusText = contract.status.charAt(0).toUpperCase() + contract.status.slice(1);
        let statusColor = "text-gray-400";
        
        switch (contract.status) {
            case 'open':
                statusText = 'Inasubiri Kukubaliwa';
                statusColor = "text-yellow-400";
                break;
            case 'completed':
                statusText = 'Imekamilika';
                statusColor = "text-green-400";
                break;
            case 'rejected':
                statusText = 'Imekataliwa';
                statusColor = "text-red-400";
                break;
            case 'cancelled':
                statusText = 'Imeghairiwa';
                statusColor = "text-orange-400";
                break;
            case 'expired':
                statusText = 'Muda Umeisha';
                statusColor = "text-gray-500";
                break;
        }

        return (
            <Card key={contract.id} className="bg-gray-900/50">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={isSeller ? contract.buyerName ? `https://picsum.photos/seed/${contract.buyerUid}/40/40` : 'https://picsum.photos/seed/public/40/40' : contract.sellerAvatar} alt={isSeller ? contract.buyerName : contract.sellerName} />
                                <AvatarFallback>{(isSeller ? contract.buyerName || contract.buyerIdentifier || 'P' : contract.sellerName).charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardDescription>{isSeller ? 'Unauza Kwa' : 'Unanunua Kutoka'}</CardDescription>
                                <CardTitle className="text-base">{isSeller ? contract.buyerIdentifier || 'Mkataba wa Umma' : contract.sellerName}</CardTitle>
                            </div>
                        </div>
                        <div className="text-right">
                           {productInfo && React.createElement(productInfo.icon, { className: "h-8 w-8 ml-auto text-gray-300" })}
                           <p className="text-xs text-gray-400 mt-1">{contract.commodity}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                     <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="text-gray-400">Bei/Kipande</div>
                        <div className="font-mono text-right font-bold">${contract.pricePerUnit.toFixed(2)}</div>
                        <div className="text-gray-400">Jumla ya Kiasi</div>
                        <div className="font-mono text-right">{contract.quantity.toLocaleString()}</div>
                        <div className="text-gray-400">Jumla ya Gharama</div>
                        <div className="font-mono text-right font-bold text-green-300">${(contract.quantity * contract.pricePerUnit).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                        <div className="text-gray-400">Status</div>
                        <div className={cn("font-semibold text-right", statusColor)}>{statusText}</div>
                        {contract.status === 'open' && (
                            <>
                                <div className="text-gray-400">Itaisha</div>
                                <div className="text-right text-xs">{formatDistanceToNow(new Date(contract.expiresAt), { addSuffix: true })}</div>
                            </>
                        )}
                     </div>
                     {isBuyer && contract.status === 'open' && (
                        <div className="flex gap-2 pt-2">
                            <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" onClick={() => onAcceptContract(contract)}>
                                <Check className="mr-1 h-4 w-4" /> Kubali
                            </Button>
                            <Button size="sm" variant="destructive" className="w-full" onClick={() => onRejectContract(contract)}>
                                <X className="mr-1 h-4 w-4" /> Kataa
                            </Button>
                        </div>
                     )}
                     {isSeller && contract.status === 'open' && (
                         <Button size="sm" variant="outline" className="w-full" onClick={() => onCancelContract(contract)}>
                            Ghairi Mkataba
                        </Button>
                     )}
                </CardContent>
            </Card>
        );
    }

    const StatCard = ({ icon, title, value }: { icon: React.ElementType, title: string, value: number }) => (
        <Card className="bg-gray-900/50">
            <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 bg-gray-700 rounded-md">
                    {React.createElement(icon, { className: "h-6 w-6 text-blue-300" })}
                </div>
                <div>
                    <p className="text-sm text-gray-400">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
            </CardContent>
        </Card>
    )

    const allMyContracts = [...incoming, ...outgoing, ...history];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard icon={Inbox} title="Mikataba Mipya" value={incoming.length} />
                <StatCard icon={Hourglass} title="Inayosubiri" value={outgoing.length} />
                <StatCard icon={History} title="Historia" value={history.length} />
            </div>
             <Card className="bg-gray-800/60 border-gray-700 text-white">
                <CardHeader>
                    <CardTitle>Orodha ya Mikataba</CardTitle>
                    <CardDescription className="text-gray-400">
                        Simamia mikataba uliyotuma na uliyopokea.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[calc(100vh-28rem)]">
                        {allMyContracts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                                {allMyContracts.map(renderContractCard)}
                            </div>
                        ) : (
                             <div className="flex items-center justify-center h-48 text-gray-400">
                                <p>Huna mikataba yoyote kwa sasa.</p>
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
             </Card>
        </div>
    );
}

export function Inventory(props: InventoryProps) {
  const newContractsCount = React.useMemo(() => {
    return props.contractListings.filter(c => {
        const isTargetedBuyer = c.buyerIdentifier === props.currentUserId || c.buyerIdentifier === props.currentUsername;
        const isPublicAndOpen = !c.buyerIdentifier && c.status === 'open';
        return c.status === 'open' && c.sellerUid !== props.currentUserId && (isTargetedBuyer || isPublicAndOpen);
    }).length;
  }, [props.contractListings, props.currentUserId, props.currentUsername]);

  return (
    <div className="flex flex-col gap-4 text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ghala (Inventory)</h1>
        <p className="text-muted-foreground">
          Tazama bidhaa zako na simamia mikataba yako.
        </p>
      </div>
      <Tabs defaultValue="items" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900/80 max-w-sm">
            <TabsTrigger value="items"><Archive className='mr-2 h-4 w-4'/> Bidhaa</TabsTrigger>
            <TabsTrigger value="contracts" className="relative">
                <FileSignature className='mr-2 h-4 w-4'/> Mikataba
                {newContractsCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                        {newContractsCount}
                    </span>
                )}
            </TabsTrigger>
        </TabsList>
        <TabsContent value="items" className="mt-4">
          <ItemInventoryView {...props} />
        </TabsContent>
        <TabsContent value="contracts" className="mt-4">
          <ContractInventoryView {...props} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
