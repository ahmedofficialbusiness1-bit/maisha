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
import { MoreHorizontal } from 'lucide-react';
import { encyclopediaData } from '@/lib/encyclopedia-data';

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
  const [officialPrice, setOfficialPrice] = React.useState(0);
  
  const handleOpenSellDialog = (item: InventoryItem) => {
    const entry = encyclopediaData.find(e => e.name === item.item);
    const price = entry ? parseFloat(entry.properties.find(p => p.label === 'Market Cost')?.value.replace('$', '').replace(/,/g, '') || '0') : item.marketPrice;

    setSelectedItem(item);
    setOfficialPrice(price);
    setQuantity(1);
    setIsSellDialogOpen(true);
  };

  const handleConfirmPost = () => {
    if (selectedItem) {
      onPostToMarket(selectedItem, quantity, officialPrice);
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
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-700/50">
                  <TableHead className="text-white">Bidhaa</TableHead>
                  <TableHead className="text-right text-white">Idadi</TableHead>
                  <TableHead className="text-right text-white">Vitendo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryItems.map(item => (
                  <TableRow
                    key={item.item}
                    className="border-gray-700 hover:bg-gray-700/50"
                  >
                    <TableCell className="font-medium">{item.item}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isSellDialogOpen} onOpenChange={setIsSellDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Sell {selectedItem?.item} on the Market</DialogTitle>
            <DialogDescription>
              Set the quantity to sell. The price is fixed to the official market rate.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
             <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">Quantity</Label>
                    <Input 
                        id="quantity" 
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(Number(e.target.value), selectedItem.quantity)))}
                        min="1"
                        max={selectedItem.quantity}
                        className="col-span-3 bg-gray-800 border-gray-600"
                    />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">Price/Unit</Label>
                    <Input 
                        id="price" 
                        type="number"
                        value={officialPrice}
                        disabled
                        className="col-span-3 bg-gray-800 border-gray-600 disabled:opacity-75"
                    />
                </div>
                <div className='col-span-4 text-xs text-center text-gray-400'>
                    <p>Official Market Price (Bei Elekezi): ${officialPrice.toFixed(2)}</p>
                </div>
                <Separator className="my-2 bg-gray-700"/>
                <div className='text-center'>
                    <p className="text-lg font-bold">Total Sale Value</p>
                    <p className='text-2xl font-mono text-green-400'>${(quantity * officialPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
