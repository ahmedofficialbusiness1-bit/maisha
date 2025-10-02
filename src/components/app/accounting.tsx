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
import { ArrowUpRight, ArrowDownLeft, Banknote, Warehouse, LineChart, Building, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { startOfDay, startOfWeek, startOfMonth, isAfter } from 'date-fns';

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  timestamp: number;
};

interface AccountingProps {
  transactions: Transaction[];
  netWorth: number;
  inventoryValue: number;
  stockValue: number;
  buildingValue: number;
  cash: number;
}

const ReportCard = ({ title, value, type }: { title: string, value: number, type: 'income' | 'expense' | 'profit' }) => {
    const isProfit = type === 'profit';
    const isIncome = type === 'income';
    const isExpense = type === 'expense';
    const isPositiveProfit = isProfit && value >= 0;

    return (
        <Card className={cn(
            isIncome && "bg-green-500/10 border-green-500/30",
            isExpense && "bg-red-500/10 border-red-500/30",
            isProfit && (isPositiveProfit ? "bg-blue-500/10 border-blue-500/30" : "bg-orange-500/10 border-orange-500/30")
        )}>
            <CardHeader>
                <CardTitle className={cn(
                    "flex items-center gap-2",
                    isIncome && "text-green-300",
                    isExpense && "text-red-300",
                    isProfit && (isPositiveProfit ? "text-blue-300" : "text-orange-300")
                )}>
                   {isIncome && <ArrowUpRight />}
                   {isExpense && <ArrowDownLeft />}
                   {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold text-white">${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </CardContent>
        </Card>
    );
}

const ReportPeriodView = ({ transactions }: { transactions: Transaction[] }) => {
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
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
                <ReportCard title="Jumla ya Mapato" value={totalIncome} type="income" />
                <ReportCard title="Jumla ya Matumizi" value={totalExpenses} type="expense" />
                <ReportCard title="Faida/Hasara Halisi" value={netProfit} type="profit" />
            </div>

             <Card className="bg-gray-800/60 border-gray-700 text-white">
                <CardHeader>
                <CardTitle>Orodha ya Miamala</CardTitle>
                <CardDescription className="text-gray-400">
                    Historia ya miamala yote ya kifedha kwa kipindi hiki.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <ScrollArea className="h-[40vh]">
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
                            <p>Hakuna miamala iliyorekodiwa kwa kipindi hiki.</p>
                        </div>
                    )}
                </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
};

const NetWorthView = ({ netWorth, inventoryValue, stockValue, buildingValue, cash }: Omit<AccountingProps, 'transactions'>) => {
    
    const MetricCard = ({ title, value, icon }: { title: string, value: number, icon: React.ElementType }) => (
        <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
                {React.createElement(icon, { className: "h-5 w-5 text-gray-400" })}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-4">
            <Card className="bg-blue-900/30 border-blue-500/50">
                 <CardHeader className="pb-4">
                    <CardTitle className="text-blue-300">Utajiri Wako Wote (Net Worth)</CardTitle>
                    <CardDescription className="text-blue-400">Jumla ya thamani ya mali zako zote.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-5xl font-bold text-white">${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </CardContent>
            </Card>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard title="Pesa Taslimu" value={cash} icon={Banknote} />
                <MetricCard title="Thamani ya Bidhaa" value={inventoryValue} icon={Warehouse} />
                <MetricCard title="Thamani ya Hisa" value={stockValue} icon={LineChart} />
                <MetricCard title="Thamani ya Majengo" value={buildingValue} icon={Building} />
             </div>
        </div>
    )
}


export function Accounting({ transactions, netWorth, inventoryValue, stockValue, buildingValue, cash }: AccountingProps) {
  
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);

  const dailyTransactions = transactions.filter(t => isAfter(t.timestamp, todayStart));
  const weeklyTransactions = transactions.filter(t => isAfter(t.timestamp, weekStart));
  const monthlyTransactions = transactions.filter(t => isAfter(t.timestamp, monthStart));

  return (
    <div className="flex flex-col gap-4 text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ripoti ya Kifedha</h1>
        <p className="text-muted-foreground">
          Fuatilia mapato, matumizi, na angalia afya ya kifedha ya himaya yako.
        </p>
      </div>
      
       <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900/80 max-w-lg">
            <TabsTrigger value="daily">Leo</TabsTrigger>
            <TabsTrigger value="weekly">Wiki Hii</TabsTrigger>
            <TabsTrigger value="monthly">Mwezi Huu</TabsTrigger>
            <TabsTrigger value="net_worth"><Wallet className="mr-2 h-4 w-4"/> Thamani Halisi</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="mt-4">
            <ReportPeriodView transactions={dailyTransactions} />
        </TabsContent>
         <TabsContent value="weekly" className="mt-4">
            <ReportPeriodView transactions={weeklyTransactions} />
        </TabsContent>
         <TabsContent value="monthly" className="mt-4">
            <ReportPeriodView transactions={monthlyTransactions} />
        </TabsContent>
        <TabsContent value="net_worth" className="mt-4">
            <NetWorthView netWorth={netWorth} inventoryValue={inventoryValue} stockValue={stockValue} buildingValue={buildingValue} cash={cash} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
