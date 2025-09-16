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
import { ArrowLeft, ArrowUp, ArrowDown, TrendingUp, TrendingDown, Star, ChevronsLeft, ChevronsRight, HelpCircle } from 'lucide-react';
import type { InventoryItem } from './inventory';
import { encyclopediaData, type EncyclopediaEntry } from '@/lib/encyclopedia-data.tsx';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';


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
  inventory: InventoryItem[];
}

export function TradeMarket({ playerListings, inventory }: TradeMarketProps) {
  const [viewMode, setViewMode] = React.useState<'list' | 'exchange'>('list');
  const [selectedProduct, setSelectedProduct] = React.useState<EncyclopediaEntry | null>(null);

  const filteredListings = playerListings.filter(listing => listing.commodity === selectedProduct?.name);
  
  const handleProductSelect = (product: EncyclopediaEntry) => {
    setSelectedProduct(product);
    setViewMode('exchange');
  };

  const handleBackToList = () => {
      setViewMode('list');
      setSelectedProduct(null);
  }

  return (
    <div className="flex flex-col gap-4 text-white -m-4 sm:-m-6">
      <PriceTicker inventory={inventory} />
      
      {viewMode === 'list' && (
        <div className="p-4 sm:p-6">
            <Card className="bg-gray-800/60 border-gray-700 h-full">
                 <CardHeader>
                    <CardTitle>Trade Market</CardTitle>
                    <CardDescription>Select a product to see exchange listings.</CardDescription>
                </CardHeader>
                <ScrollArea className="h-[70vh]">
                <CardContent className="p-2">
                    {Object.entries(productCategories).map(([category, products]) => (
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
                </CardContent>
                </ScrollArea>
            </Card>
        </div>
      )}

      {viewMode === 'exchange' && selectedProduct && (
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 sm:px-6">
            <div className="lg:col-span-3">
                 <Card className="bg-gray-800/60 border-gray-700 h-full">
                     <CardHeader>
                        <Button variant="outline" onClick={handleBackToList} className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to All Products
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
                                <Label htmlFor='buy-amount'>Amount to Buy</Label>
                                <Input id="buy-amount" type="number" placeholder="0" className="w-full bg-gray-700 border-gray-600 mt-1" />
                            </div>
                             <div>
                                <Label htmlFor='min-quality'>Min Quality</Label>
                                <div className="flex items-center gap-1 mt-1">
                                    <Star className="h-4 w-4 text-yellow-400" />
                                    <Input id="min-quality" type="number" placeholder="0" className="w-full bg-gray-700 border-gray-600" />
                                </div>
                            </div>
                            <Button className="w-full bg-green-600 hover:bg-green-700">BUY</Button>
                        </div>
                     </CardContent>
                 </Card>
            </div>
            <div className="lg:col-span-9 flex flex-col gap-4">
                <Card className="bg-gray-800/60 border-gray-700 flex-grow">
                     <CardHeader>
                        <CardTitle>Exchange for {selectedProduct.name}</CardTitle>
                        <CardDescription>Showing all active player listings.</CardDescription>
                     </CardHeader>
                     <CardContent className="p-0">
                        <ScrollArea className="h-[65vh]">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-700 sticky top-0 bg-gray-800/95 backdrop-blur-sm">
                                        <TableHead className="text-white w-2/5">Seller</TableHead>
                                        <TableHead className="text-right text-white">Quality</TableHead>
                                        <TableHead className="text-right text-white">Amount</TableHead>
                                        <TableHead className="text-right text-white">Price (Total)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                {filteredListings.map((listing) => (
                                    <TableRow key={listing.id} className="border-gray-700 hover:bg-gray-700/50 cursor-pointer">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={listing.avatar} alt={listing.seller} data-ai-hint={listing.imageHint} />
                                                    <AvatarFallback>{listing.seller.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span>{listing.seller}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <span>{listing.quality}</span>
                                                <Star className="h-4 w-4 text-yellow-400" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-mono">{listing.quantity.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-mono">${listing.price.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                             {filteredListings.length === 0 && (
                                <div className="flex items-center justify-center h-48 text-gray-400">
                                    <p>No players are selling {selectedProduct?.name || 'this item'} currently.</p>
                                </div>
                             )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}
    </div>
  );
}
