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
import { ArrowUp, ArrowDown } from 'lucide-react';

const marketData = [
  { commodity: 'Corn', price: 150.75, change: 1.5, changeType: 'increase' },
  { commodity: 'Sunflower Seeds', price: 320.50, change: -0.8, changeType: 'decrease' },
  { commodity: 'Eggs', price: 210.00, change: 2.1, changeType: 'increase' },
  { commodity: 'Corn Flour', price: 280.25, change: 0.5, changeType: 'increase' },
  { commodity: 'Cooking Oil', price: 550.00, change: -1.2, changeType: 'decrease' },
  { commodity: 'Chicken Feed', price: 180.90, change: 0.2, changeType: 'increase' },
  { commodity: 'Soybeans', price: 410.10, change: -2.5, changeType: 'decrease' },
  { commodity: 'Crude Oil', price: 705.20, change: 1.1, changeType: 'increase' },
  { commodity: 'Gold', price: 1805.50, change: -0.2, changeType: 'decrease' },
];

export type PlayerListing = { 
  id: number; 
  commodity: string; 
  seller: string; 
  quantity: number; 
  price: number; 
};


function PriceTicker() {
  const tickerItems = [...marketData, ...marketData]; // Duplicate for seamless loop

  return (
    <div className="relative flex w-full overflow-hidden bg-gray-900/80 border-y border-gray-700 py-2">
      <div className="flex animate-ticker whitespace-nowrap">
        {tickerItems.map((item, index) => (
          <div key={index} className="flex items-center mx-4">
            <span className="font-semibold text-white">{item.commodity}:</span>
            <span className="ml-2 font-mono text-white">${item.price.toFixed(2)}</span>
            <div
              className={`flex items-center ml-1 ${
                item.changeType === 'increase' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {item.changeType === 'increase' ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              <span className="ml-0.5 text-xs font-mono">{Math.abs(item.change)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface TradeMarketProps {
  playerListings: PlayerListing[];
}

export function TradeMarket({ playerListings }: TradeMarketProps) {
  return (
    <div className="flex flex-col gap-4 text-white">
      <PriceTicker />

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
