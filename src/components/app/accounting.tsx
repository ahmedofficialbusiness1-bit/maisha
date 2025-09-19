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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  timestamp: number;
};

interface AccountingProps {
  transactions: Transaction[];
}

export function Accounting({ transactions }: AccountingProps) {
  const { totalIncome, totalExpenses, netProfit } = React.useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    return { totalIncome, totalExpenses, netProfit };
  }, [transactions]);

  return (
    <div className="flex flex-col gap-4 text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Uhasibu (Accounting)</h1>
        <p className="text-muted-foreground">
          Fuatilia mapato, matumizi, na angalia afya ya kifedha ya himaya yako.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-green-500/10 border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-300">
              <ArrowUpRight /> Jumla ya Mapato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-300">
              <ArrowDownLeft /> Jumla ya Matumizi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card className={cn(
            "border-gray-500/30",
            netProfit >= 0 ? "bg-blue-500/10" : "bg-orange-500/10"
        )}>
          <CardHeader>
            <CardTitle className={cn(
                netProfit >= 0 ? "text-blue-300" : "text-orange-300"
            )}>Faida/Hasara Halisi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800/60 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Orodha ya Miamala</CardTitle>
          <CardDescription className="text-gray-400">
            Historia ya miamala yote ya kifedha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[50vh]">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-700/50 sticky top-0 bg-gray-800/95">
                  <TableHead className="text-white">Aina</TableHead>
                  <TableHead className="text-white">Maelezo</TableHead>
                  <TableHead className="text-white hidden sm:table-cell">Muda</TableHead>
                  <TableHead className="text-right text-white">Kiasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id} className="border-gray-700 hover:bg-gray-700/50">
                    <TableCell className="p-2 sm:p-4">
                      <span
                        className={cn(
                          'flex items-center gap-2 font-semibold',
                          t.type === 'income' ? 'text-green-400' : 'text-red-400'
                        )}
                      >
                        {t.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                        <span className="hidden sm:inline">{t.type === 'income' ? 'Mapato' : 'Matumizi'}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-300 p-2 sm:p-4">{t.description}</TableCell>
                    <TableCell className="text-gray-400 text-xs hidden sm:table-cell p-2 sm:p-4">
                        {new Date(t.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className={cn(
                        'text-right font-mono p-2 sm:p-4',
                        t.type === 'income' ? 'text-green-400' : 'text-red-400'
                    )}>
                      {t.type === 'expense' ? '-' : ''}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             {transactions.length === 0 && (
                <div className="flex items-center justify-center h-48 text-gray-400">
                    <p>Hakuna miamala iliyorekodiwa bado.</p>
                </div>
             )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
