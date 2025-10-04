

'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Crown, Loader2 } from 'lucide-react';
import { useAllPlayers, type PlayerPublicData } from '@/firebase/database/use-all-players';
import { Button } from '../ui/button';
import { getPlayerTier, getRankTitle } from '@/lib/player-tiers';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

const formatNetWorth = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
    }).format(value);
};


export function Leaderboard({ onViewProfile, president }: { onViewProfile: (playerId: string) => void, president: PlayerPublicData | null }) {
  const { players, loading } = useAllPlayers();

  const sortedPlayers = React.useMemo(() => {
    if (!players) return [];
    // Sort players by netWorth in descending order
    return [...players].sort((a, b) => b.netWorth - a.netWorth);
  }, [players]);
  
  const getRankStyles = (rank: number): { wrapperClass: string; crownClass: string } => {
    switch (rank) {
      case 0:
        return {
          wrapperClass: 'p-1 rounded-full bg-gradient-to-tr from-yellow-400 via-amber-300 to-yellow-500 shadow-2xl shadow-yellow-400/20',
          crownClass: 'text-yellow-400',
        };
      case 1:
        return {
          wrapperClass: 'p-1 rounded-full bg-gradient-to-tr from-slate-300 via-slate-100 to-slate-400 shadow-2xl shadow-slate-400/20',
          crownClass: 'text-slate-300',
        };
      case 2:
        return {
          wrapperClass: 'p-1 rounded-full bg-gradient-to-tr from-orange-400 via-amber-500 to-orange-600 shadow-2xl shadow-orange-500/20',
          crownClass: 'text-orange-400',
        };
      default:
        return { wrapperClass: '', crownClass: '' };
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ubao wa Viongozi</h1>
        <p className="text-muted-foreground">
          Tazama orodha ya wachezaji matajiri zaidi kwenye mchezo.
        </p>
      </div>

      <Card className="bg-gray-800/60 border-gray-700">
        <CardHeader>
          <CardTitle>Wachezaji Wanaoongoza kwa Utajiri</CardTitle>
          <CardDescription className="text-gray-400">
            Orodha inajisasisha moja kwa moja kutoka Realtime Database.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {sortedPlayers && sortedPlayers.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                 <Table>
                    <TableHeader>
                        <TableRow className="border-gray-700 hover:bg-gray-700/50">
                            <TableHead className="text-white w-16">#</TableHead>
                            <TableHead className="text-white">Mchezaji</TableHead>
                            <TableHead className="text-right text-white">Utajiri (Net Worth)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedPlayers.map((player, index) => {
                            const tier = getPlayerTier(player.netWorth);
                            const { wrapperClass, crownClass } = getRankStyles(index);
                            const rankTitle = getRankTitle(index + 1);
                             const isCurrentPresident = president?.uid === player.uid;
                            
                            return (
                                <TableRow 
                                  key={player.uid} 
                                  className="border-gray-700 hover:bg-gray-700/50"
                                >
                                    <TableCell className="font-bold text-lg flex items-center gap-2 p-2 sm:p-4">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="p-2 sm:p-4">
                                        <Button variant="ghost" className="flex items-center gap-3 p-0 h-auto hover:bg-transparent" onClick={() => onViewProfile(player.uid)}>
                                            <div className={cn("relative", isCurrentPresident ? "p-1 rounded-full bg-gradient-to-tr from-blue-400 via-cyan-300 to-blue-500" : wrapperClass)}>
                                                <Avatar className='h-12 w-12 border-2 border-gray-900'>
                                                    <AvatarImage src={player.avatar} alt={player.username} data-ai-hint="player avatar" />
                                                    <AvatarFallback>{player.username.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                {index < 3 && <Crown className={cn("absolute -top-3 -right-3 h-6 w-6 rotate-[30deg]", crownClass)} />}
                                            </div>
                                            <div className='flex flex-col items-start'>
                                                <span className="font-semibold text-white">{player.username}</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {isCurrentPresident && player.role !== 'admin' && (
                                                        <Badge className="text-[10px] py-0 px-1.5 h-auto bg-blue-800/80 border-blue-600 text-blue-200">
                                                            MR PRESIDENT
                                                        </Badge>
                                                    )}
                                                    <Badge className={cn("text-[10px] py-0 px-1.5 h-auto", tier.color)}>
                                                        <tier.icon className="h-2.5 w-2.5 mr-1" />
                                                        {tier.name}
                                                    </Badge>
                                                    {rankTitle && (
                                                        <Badge className="text-[10px] py-0 px-1.5 h-auto bg-indigo-800/80 border-indigo-600 text-indigo-200">
                                                            {rankTitle}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-lg text-green-400 p-2 sm:p-4">
                                        ${formatNetWorth(player.netWorth)}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                 </Table>
              </div>

              {/* Mobile Card List */}
              <div className="md:hidden space-y-3">
                  {sortedPlayers.map((player, index) => {
                      const tier = getPlayerTier(player.netWorth);
                      const { wrapperClass, crownClass } = getRankStyles(index);
                      const rankTitle = getRankTitle(index + 1);
                       const isCurrentPresident = president?.uid === player.uid;
                      
                      return (
                          <Card 
                            key={player.uid} 
                            className="bg-gray-700/50 border-gray-600 cursor-pointer"
                            onClick={() => onViewProfile(player.uid)}
                          >
                              <CardContent className="p-3 flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                      <div className="flex items-center gap-2 font-normal text-base">
                                          <span>{index + 1}</span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                          <div className={cn("relative", isCurrentPresident ? "p-1 rounded-full bg-gradient-to-tr from-blue-400 via-cyan-300 to-blue-500" : wrapperClass)}>
                                              <Avatar className='h-10 w-10 border-2 border-gray-800'>
                                                  <AvatarImage src={player.avatar} alt={player.username} data-ai-hint="player avatar" />
                                                  <AvatarFallback>{player.username.charAt(0)}</AvatarFallback>
                                              </Avatar>
                                               {index < 3 && <Crown className={cn("absolute -top-2.5 -right-2.5 h-5 w-5 rotate-[30deg]", crownClass)} />}
                                          </div>
                                          <div>
                                              <p className="font-normal text-sm text-white">{player.username}</p>
                                               <div className="flex items-center gap-1 mt-1 flex-wrap">
                                                    {isCurrentPresident && player.role !== 'admin' && (
                                                        <Badge className="text-[10px] py-0 px-1.5 h-auto bg-blue-800/80 border-blue-600 text-blue-200">
                                                            MR PRESIDENT
                                                        </Badge>
                                                    )}
                                                    <Badge className={cn("text-[10px] py-0 px-1.5 h-auto", tier.color)}>
                                                        <tier.icon className="h-2.5 w-2.5 mr-1" />
                                                        {tier.name}
                                                    </Badge>
                                                     {rankTitle && (
                                                        <Badge className="text-[10px] py-0 px-1.5 h-auto bg-indigo-800/80 border-indigo-600 text-indigo-200">
                                                            {rankTitle}
                                                        </Badge>
                                                    )}
                                               </div>
                                          </div>
                                      </div>
                                  </div>
                                   <div className="text-right">
                                      <p className="font-mono text-xs text-green-400">
                                          ${formatNetWorth(player.netWorth)}
                                      </p>
                                       <p className="text-[10px] text-gray-400">Net Worth</p>
                                  </div>
                              </CardContent>
                          </Card>
                      )
                  })}
              </div>
            </>
           ) : (
             <div className="flex items-center justify-center h-48 text-gray-500">
                <p>Hakuna data ya wachezaji kwa sasa. Jisajili na uanze kucheza!</p>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}






