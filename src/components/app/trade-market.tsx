

import * as React from 'react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, ArrowUp, ArrowDown, TrendingUp, TrendingDown, Star, ChevronsLeft, ChevronsRight, HelpCircle, Search, FileText, Building, LandPlot, ShieldCheck, Landmark } from 'lucide-react';
import type { InventoryItem } from './inventory';
import { encyclopediaData, type EncyclopediaEntry } from '@/lib/encyclopedia-data.tsx';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '../ui/separator';


export type PlayerListing = {
  id: number;
  commodity: string;
  seller: string;
  quantity: number;
  price: number;
  avatar: string;
  quality: number;
  imageHint: string;
};

export type StockListing = {
    id: string;
    ticker: string;
    companyName: string;
    stockPrice: number;
    sharesAvailable: number;
    marketCap: number;
    logo: string;
    imageHint: string;
    creditRating: string;
    dailyRevenue: number;
    dividendYield: number; // e.g., 0.015 for 1.5%
};

export type BondListing = {
    id: number;
    issuer: string;
    faceValue: number;
    couponRate: number;
    maturityDate: string;
    price: number;
    quantityAvailable: number;
    creditRating: string;
    issuerLogo: string;
    imageHint: string;
};

function PriceTicker({ inventory }: { inventory: InventoryItem[] }) {
  const tickerItems = React.useMemo(() => {
    if (!inventory || inventory.length === 0) return [];
    const items = inventory.map((item, index) => ({
      commodity: item.item,
      price: item.marketPrice,
      // Simulate change for visual effect
      change: (Math.random() - 0.5) * 5,
    }));
    // Duplicate for seamless loop
    return [...items, ...items];
  }, [inventory]);

  if (tickerItems.length === 0) return null;

  return (
    <div className="relative flex w-full overflow-hidden bg-gray-900/80 border-y border-gray-700 py-2">
      <div className="flex animate-ticker whitespace-nowrap">
        {tickerItems.map((item, index) => (
          <div key={index} className="flex items-center mx-4">
            <span className="font-semibold text-white">{item.commodity}:</span>
            <span className="ml-2 font-mono text-white">${item.price.toFixed(2)}</span>
            <div
              className={`flex items-center ml-1 ${
                item.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {item.change >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span className="ml-0.5 text-xs font-mono">{Math.abs(item.change).toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const productCategories = encyclopediaData.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
        acc[category] = [];
    }
    acc[category].push(item);
    return acc;
}, {} as Record<string, EncyclopediaEntry[]>);


interface TradeMarketProps {
  playerListings: PlayerListing[];
  stockListings: StockListing[];
  bondListings: BondListing[];
  inventory: InventoryItem[];
  onBuyStock: (stock: StockListing, quantity: number) => void;
  onBuyFromMarket: (listing: PlayerListing, quantity: number) => void;
  playerName: string;
}

export function TradeMarket({ playerListings, stockListings, bondListings, inventory, onBuyStock, onBuyFromMarket, playerName }: TradeMarketProps) {
  const [viewMode, setViewMode] = React.useState<'list' | 'exchange'>('list');
  const [selectedProduct, setSelectedProduct] = React.useState<EncyclopediaEntry | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  const [isBuyStockDialogOpen, setIsBuyStockDialogOpen] = React.useState(false);
  const [selectedStock, setSelectedStock] = React.useState<StockListing | null>(null);
  const [buyStockQuantity, setBuyStockQuantity] = React.useState(1);
  
  const [buyQuantity, setBuyQuantity] = React.useState(0);
  const [selectedListing, setSelectedListing] = React.useState<PlayerListing | null>(null);

  const handleOpenBuyStockDialog = (stock: StockListing) => {
    setSelectedStock(stock);
    setBuyStockQuantity(1);
    setIsBuyStockDialogOpen(true);
  };
  
  const handleConfirmBuyStock = () => {
    if (selectedStock && buyStockQuantity > 0) {
      onBuyStock(selectedStock, buyStockQuantity);
      setIsBuyStockDialogOpen(false);
    }
  };


  const filteredListings = playerListings.filter(listing => listing.commodity === selectedProduct?.name);
  
  const handleProductSelect = (product: EncyclopediaEntry) => {
    setSelectedProduct(product);
    setViewMode('exchange');
    setBuyQuantity(0);
    setSelectedListing(null);
  };

  const handleBackToList = () => {
      setViewMode('list');
      setSelectedProduct(null);
  }
  
  const handleSelectListing = (listing: PlayerListing) => {
    if (listing.seller === playerName) return;
    setSelectedListing(listing);
    setBuyQuantity(listing.quantity);
  }

  const handleConfirmBuy = () => {
    if (selectedListing && buyQuantity > 0) {
        onBuyFromMarket(selectedListing, buyQuantity);
        // Reset after buying
        setSelectedListing(null);
        setBuyQuantity(0);
    }
  }


  const filteredCategories = React.useMemo(() => {
    if (!searchTerm) {
        return productCategories;
    }

    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered: Record<string, EncyclopediaEntry[]> = {};

    for (const category in productCategories) {
        const matchingProducts = productCategories[category].filter(product =>
            product.name.toLowerCase().includes(lowercasedFilter)
        );

        if (matchingProducts.length > 0) {
            filtered[category] = matchingProducts;
        }
    }

    return filtered;
  }, [searchTerm]);

  const renderCommoditiesMarket = () => (
    <>
    {viewMode === 'list' && (
        <div className="p-4 sm:p-6 flex flex-col gap-4">
            <Card className="bg-gray-800/60 border-gray-700">
                 <CardHeader>
                    <CardTitle>Soko la Bidhaa</CardTitle>
                    <CardDescription>Tafuta na chagua bidhaa ili kuona orodha za sokoni.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='relative'>
                        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                        <Input 
                            placeholder='Tafuta bidhaa...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full pl-10 bg-gray-900/80 border-gray-600'
                        />
                    </div>
                </CardContent>
            </Card>

            <ScrollArea className="h-[65vh]">
            <div className="pr-4">
                {Object.entries(filteredCategories).map(([category, products]) => (
                <div key={category} className="mb-4">
                    <h3 className="font-bold text-sm text-gray-400 px-2 mb-2">{category}</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                    {products.map(product => (
                        <button
                        key={product.id}
                        onClick={() => handleProductSelect(product)}
                        className="p-3 rounded-lg border-2 text-center flex flex-col items-center justify-center bg-gray-700/50 border-gray-600 hover:bg-blue-600/30 hover:border-blue-500 transition-colors"
                        title={product.name}
                        >
                        <div className="h-5 w-5 flex items-center justify-center mb-2">
                            {React.cloneElement(product.icon, { className: "h-full w-full" })}
                        </div>
                        <span className="text-xs font-semibold block truncate w-full">{product.name}</span>
                        </button>
                    ))}
                    </div>
                </div>
                ))}
                </div>
            </ScrollArea>
        </div>
      )}

      {viewMode === 'exchange' && selectedProduct && (
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 sm:px-6">
            <div className="lg:col-span-3">
                 <Card className="bg-gray-800/60 border-gray-700 h-full">
                     <CardHeader>
                        <Button variant="outline" onClick={handleBackToList} className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Rudi kwenye Bidhaa Zote
                        </Button>
                         <div className="text-center">
                            {React.cloneElement(selectedProduct.icon, { className: "h-12 w-12 mx-auto mb-2" })}
                            <CardTitle className="text-2xl">{selectedProduct.name}</CardTitle>
                            <CardDescription>{selectedProduct.category}</CardDescription>
                         </div>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-4">
                             <div>
                                <Label htmlFor='buy-amount'>Kiasi cha Kununua</Label>
                                <Input 
                                  id="buy-amount" 
                                  type="number" 
                                  placeholder="0" 
                                  className="w-full bg-gray-700 border-gray-600 mt-1" 
                                  value={buyQuantity}
                                  onChange={(e) => setBuyQuantity(Math.max(0, Math.min(Number(e.target.value), selectedListing?.quantity || 0)))}
                                  disabled={!selectedListing}
                                />
                            </div>
                            <div className='text-center text-sm'>
                                {selectedListing ? (
                                    <p>Jumla: <span className='font-bold'>${(buyQuantity * selectedListing.price).toLocaleString(undefined, { minimumFractionDigits: 2})}</span></p>
                                ) : (
                                    <p className='text-gray-400'>Chagua muuzaji ili kununua.</p>
                                )}
                            </div>
                            <Button 
                              className="w-full bg-green-600 hover:bg-green-700"
                              onClick={handleConfirmBuy}
                              disabled={!selectedListing || buyQuantity <= 0}
                            >
                                NUNUA
                            </Button>
                        </div>
                     </CardContent>
                 </Card>
            </div>
            <div className="lg:col-span-9 flex flex-col gap-4">
                <Card className="bg-gray-800/60 border-gray-700 flex-grow">
                     <CardHeader>
                        <CardTitle>Soko la {selectedProduct.name}</CardTitle>
                        <CardDescription>Inaonyesha orodha zote za wachezaji.</CardDescription>
                     </CardHeader>
                     <CardContent className="p-0">
                        <ScrollArea className="h-[65vh]">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-700 sticky top-0 bg-gray-800/95 backdrop-blur-sm">
                                        <TableHead className="text-white w-2/5">Muuzaji</TableHead>
                                        <TableHead className="text-right text-white">Ubora</TableHead>
                                        <TableHead className="text-right text-white">Kiasi</TableHead>
                                        <TableHead className="text-right text-white">Bei (kwa uniti)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                {filteredListings.map((listing) => (
                                    <TableRow 
                                      key={listing.id}
                                      onClick={() => handleSelectListing(listing)}
                                      className={cn(
                                        "border-gray-700 hover:bg-gray-700/50",
                                        listing.seller === playerName ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                                        selectedListing?.id === listing.id && "bg-blue-600/30"
                                      )}
                                    >
                                        <TableCell className="font-medium p-2 sm:p-4">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={listing.avatar} alt={listing.seller} data-ai-hint={listing.imageHint} />
                                                    <AvatarFallback>{listing.seller.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span>{listing.seller}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right p-2 sm:p-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <span>{listing.quality}</span>
                                                <Star className="h-4 w-4 text-yellow-400" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-mono p-2 sm:p-4">{listing.quantity.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-mono p-2 sm:p-4">${listing.price.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                             {filteredListings.length === 0 && (
                                <div className="flex items-center justify-center h-48 text-gray-400">
                                    <p>Hakuna wachezaji wanaouza {selectedProduct?.name || 'bidhaa hii'} kwa sasa.</p>
                                </div>
                             )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}
    </>
  );

    const renderStocksMarket = () => (
        <div className="p-1 sm:p-2 md:p-4 lg:p-6">
            <Card className="bg-gray-800/60 border-gray-700">
                <CardHeader>
                    <CardTitle>Soko la Hisa</CardTitle>
                    <CardDescription>Nunua na uza hisa za makampuni mbalimbali yaliyosajiliwa.</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-700 hover:bg-gray-700/50">
                                <TableHead className="text-white">Kampuni</TableHead>
                                <TableHead className="text-right text-white">Bei</TableHead>
                                <TableHead className="text-right text-white">Hisa Zipo</TableHead>
                                <TableHead className="text-right text-white">Thamani ya Kampuni</TableHead>
                                <TableHead className="text-right text-white">Ukadiriaji</TableHead>
                                <TableHead className="text-right text-white">Vitendo</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stockListings.map((stock) => (
                                <TableRow key={stock.id} className="border-gray-700">
                                    <TableCell className="p-2 sm:p-4">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                                                <AvatarImage src={stock.logo} alt={stock.companyName} data-ai-hint={stock.imageHint} />
                                                <AvatarFallback>{stock.ticker.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-sm sm:text-base">{stock.companyName}</p>
                                                <p className="text-xs text-gray-400">{stock.ticker}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono p-2 sm:p-4">${stock.stockPrice.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-mono p-2 sm:p-4">{stock.sharesAvailable.toLocaleString()}</TableCell>
                                    <TableCell className="text-right font-mono p-2 sm:p-4">${stock.marketCap.toLocaleString()}</TableCell>
                                    <TableCell className="text-right p-2 sm:p-4">
                                        <div className={cn("flex items-center justify-end font-bold text-sm", 
                                            stock.creditRating.startsWith('A') ? 'text-green-400' : 
                                            stock.creditRating.startsWith('B') ? 'text-yellow-400' : 'text-orange-400'
                                        )}>
                                            {stock.creditRating}
                                            <ShieldCheck className="ml-1 h-4 w-4" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right p-2 sm:p-4">
                                        <Button size="sm" variant="secondary" className="bg-green-600 hover:bg-green-700 text-xs h-8" onClick={() => handleOpenBuyStockDialog(stock)}>Nunua</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );

    const renderBondsMarket = () => (
        <div className="p-1 sm:p-2 md:p-4 lg:p-6">
            <Card className="bg-gray-800/60 border-gray-700">
                <CardHeader>
                    <CardTitle>Soko la Hatifungani</CardTitle>
                    <CardDescription>Wekeza kwenye hatifungani za serikali na makampuni kwa mapato ya kudumu.</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-700 hover:bg-gray-700/50">
                                <TableHead className="text-white">Mtoaji</TableHead>
                                <TableHead className="text-right text-white">Ukadiriaji</TableHead>
                                <TableHead className="text-right text-white">Kuponi</TableHead>
                                <TableHead className="text-right text-white">Ukomavu</TableHead>
                                <TableHead className="text-right text-white">Bei</TableHead>
                                <TableHead className="text-right text-white">Vitendo</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bondListings.map((bond) => (
                                <TableRow key={bond.id} className="border-gray-700">
                                    <TableCell className="p-2 sm:p-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                                                <AvatarImage src={bond.issuerLogo} alt={bond.issuer} data-ai-hint={bond.imageHint} />
                                                <AvatarFallback>{bond.issuer.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                             <div>
                                                <p className="font-bold text-sm sm:text-base">{bond.issuer}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right p-2 sm:p-4">
                                        <div className={cn("flex items-center justify-end font-bold text-sm", 
                                            bond.creditRating.startsWith('A') ? 'text-green-400' : 
                                            bond.creditRating.startsWith('B') ? 'text-yellow-400' : 'text-orange-400'
                                        )}>
                                            {bond.creditRating}
                                            <ShieldCheck className="ml-1 h-4 w-4" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-green-400 p-2 sm:p-4">{bond.couponRate.toFixed(2)}%</TableCell>
                                    <TableCell className="text-right font-mono p-2 sm:p-4">{new Date(bond.maturityDate).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right font-mono p-2 sm:p-4">${bond.price.toLocaleString()}</TableCell>
                                    <TableCell className="text-right p-2 sm:p-4">
                                        <Button size="sm" variant="secondary" className="bg-blue-600 hover:bg-blue-700 text-xs h-8">Nunua</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );

  return (
    <>
    <div className="flex flex-col gap-4 text-white -m-4 sm:-m-6">
      <PriceTicker inventory={inventory} />
      
        <Tabs defaultValue="stocks" className="w-full pt-4">
            <div className="px-4 sm:px-6">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800/80">
                    <TabsTrigger value="commodities"><LandPlot className='mr-2 h-4 w-4'/>Bidhaa</TabsTrigger>
                    <TabsTrigger value="stocks"><Landmark className='mr-2 h-4 w-4'/>Hisa</TabsTrigger>
                    <TabsTrigger value="bonds"><FileText className='mr-2 h-4 w-4'/>Hatifungani</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="commodities" className="mt-4">
                {renderCommoditiesMarket()}
            </TabsContent>
            <TabsContent value="stocks" className="mt-4">
                {renderStocksMarket()}
            </TabsContent>
            <TabsContent value="bonds" className="mt-4">
                {renderBondsMarket()}
            </TabsContent>
        </Tabs>
    </div>
     <Dialog open={isBuyStockDialogOpen} onOpenChange={setIsBuyStockDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Nunua Hisa za {selectedStock?.ticker}</DialogTitle>
            <DialogDescription>
              Weka kiasi cha hisa unachotaka kununua.
            </DialogDescription>
          </DialogHeader>
          {selectedStock && (
             <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">Kiasi</Label>
                    <Input 
                        id="quantity" 
                        type="number"
                        value={buyStockQuantity}
                        onChange={(e) => setBuyStockQuantity(Math.max(1, Math.min(Number(e.target.value), selectedStock.sharesAvailable)))}
                        min="1"
                        max={selectedStock.sharesAvailable}
                        className="col-span-3 bg-gray-800 border-gray-600"
                    />
                </div>
                <div className='col-span-4 text-xs text-center text-gray-400'>
                    <p>Bei kwa Hisa: ${selectedStock.stockPrice.toFixed(2)}</p>
                </div>
                <Separator className="my-2 bg-gray-700"/>
                <div className='text-center'>
                    <p className="text-lg font-bold">Jumla ya Gharama</p>
                    <p className='text-2xl font-mono text-green-400'>${(buyStockQuantity * selectedStock.stockPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
             </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBuyStockDialogOpen(false)}>Ghairi</Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!selectedStock || buyStockQuantity <= 0 || buyStockQuantity > selectedStock.sharesAvailable}
              onClick={handleConfirmBuyStock}
            >
              Thibitisha Ununuzi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
