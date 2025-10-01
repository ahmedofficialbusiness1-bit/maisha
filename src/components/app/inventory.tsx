
'use client';

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
import { MoreHorizontal } from 'lucide-react';
import { encyclopediaData } from '@/lib/encyclopedia-data';
import { ScrollArea } from '../ui/scroll-area';

export type InventoryItem = {
  item: string;
  quantity: number;
  marketPrice: number;
};

interface InventoryProps {
  inventoryItems: InventoryItem[];
  onPostToMarket: (item: InventoryItem, quantity: number, price: number) => void;
}


export function Inventory({ inventoryItems, onPostToMarket }: InventoryProps) {
  const [isSellDialogOpen, setIsSellDialogOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const [price, setPrice] = React.useState(0);
  const [officialPrice, setOfficialPrice] = React.useState(0);
  const [priceFloor, setPriceFloor] = React.useState(0);
  const [priceCeiling, setPriceCeiling] = React.useState(0);
  
  const handleOpenSellDialog = (item: InventoryItem) => {
    const entry = encyclopediaData.find(e => e.name === item.item);
    const officialMarketPrice = entry ? parseFloat(entry.properties.find(p => p.label === 'Market Cost')?.value.replace('$', '').replace(/,/g, '') || '0') : item.marketPrice;
    
    const floor = officialMarketPrice * 0.85;
    const ceiling = officialMarketPrice * 1.15;

    setSelectedItem(item);
    setOfficialPrice(officialMarketPrice);
    setPrice(officialMarketPrice);
    setPriceFloor(floor);
    setPriceCeiling(ceiling);
    setQuantity(1);
    setIsSellDialogOpen(true);
  };

  const handleConfirmPost = () => {
    if (selectedItem) {
      onPostToMarket(selectedItem, quantity, price);
      setIsSellDialogOpen(false);
    }
  };


  return (
    <>
      <div className="flex flex-col gap-4 text-white">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ghala (Inventory)</h1>
          <p className="text-muted-foreground">
            Tazama bidhaa zako zote ulizonunua na kuzalisha.
          </p>
        </div>
        <Separator className="bg-white/20" />
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
                                      <Image 
                                          src={productInfo.imageUrl}
                                          alt={productInfo.name}
                                          data-ai-hint={productInfo.imageHint}
                                          width={40}
                                          height={40}
                                          className="rounded-md"
                                      />
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
                              <DropdownMenuItem>
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
      </div>

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
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(Number(e.target.value), selectedItem.quantity)))}
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
                        value={price}
                        onChange={(e) => setPrice(Math.max(priceFloor, Math.min(Number(e.target.value), priceCeiling)))}
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
                    <p className='text-2xl font-mono text-green-400'>${(quantity * price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="text-xs text-gray-500 mt-1">A 5% market tax will be deducted upon sale.</p>
                </div>
             </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSellDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!selectedItem || quantity <= 0 || quantity > selectedItem.quantity}
              onClick={handleConfirmPost}
            >
              Post to Market
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

    
