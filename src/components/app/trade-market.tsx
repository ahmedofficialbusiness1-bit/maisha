import * as React from 'react';
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
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown } from 'lucide-react';
import type { InventoryItem } from './inventory';

export type PlayerListing = { 
  id: number; 
  commodity: string; 
  seller: string; 
  quantity: number; 
  price: number; 
};

function PriceTicker({ inventory }: { inventory: InventoryItem[] }) {
  const [tickerItems, setTickerItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    const items = inventory.map((item, index) => ({
      commodity: item.item,
      price: item.marketPrice,
      // Simulate change for visual effect
      change: (Math.random() - 0.5) * 5, 
    }));
    // Duplicate for seamless loop
    setTickerItems([...items, ...items]); 
  }, [inventory]);

  if(tickerItems.length === 0) return null;

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

interface TradeMarketProps {
  playerListings: PlayerListing[];
  inventory: InventoryItem[];
}

export function TradeMarket({ playerListings, inventory }: TradeMarketProps) {
  return (
    <div className="flex flex-col gap-4 text-white">
      <PriceTicker inventory={inventory} />

      <Card className="bg-gray-800/60 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Soko la Wachezaji</CardTitle>
          <CardDescription className="text-gray-400">
            Nunua bidhaa zilizowekwa sokoni na wachezaji wengine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-700/50">
                <TableHead className="text-white">Bidhaa</TableHead>
                <TableHead className="text-white">Muuzaji</TableHead>
                <TableHead className="text-right text-white">Idadi</TableHead>
                <TableHead className="text-right text-white">Bei (kwa Kimoja)</TableHead>
                <TableHead className="text-center text-white">Kitendo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playerListings.map((listing) => (
                <TableRow key={listing.id} className="border-gray-700 hover:bg-gray-700/50">
                  <TableCell className="font-medium">{listing.commodity}</TableCell>
                  <TableCell className="text-gray-400">{listing.seller}</TableCell>
                  <TableCell className="text-right font-mono">{listing.quantity.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">${listing.price.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="bg-green-600 text-white hover:bg-green-700"
                    >
                      Nunua
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
