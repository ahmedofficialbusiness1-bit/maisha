'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Loader2, Trophy } from 'lucide-react';
import { useAllPlayers, type PlayerPublicData } from '@/firebase/database/use-all-players';
import { Button } from '../ui/button';

export function Leaderboard({ onViewProfile }: { onViewProfile: (playerId: string) => void }) {
  const { players, loading } = useAllPlayers();

  const sortedPlayers = React.useMemo(() => {
    if (!players) return [];
    // Sort players by netWorth in descending order
    return [...players].sort((a, b) => b.netWorth - a.netWorth);
  }, [players]);

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
                        {sortedPlayers.map((player, index) => (
                            <TableRow 
                              key={player.uid} 
                              className="border-gray-700 hover:bg-gray-700/50"
                            >
                                <TableCell className="font-bold text-lg flex items-center gap-2 p-2 sm:p-4">
                                    {index + 1}
                                    {index === 0 && <Trophy className="h-5 w-5 text-yellow-400" />}
                                    {index === 1 && <Trophy className="h-5 w-5 text-gray-400" />}
                                    {index === 2 && <Trophy className="h-5 w-5 text-orange-400" />}
                                </TableCell>
                                <TableCell className="p-2 sm:p-4">
                                    <Button variant="ghost" className="flex items-center gap-3 p-0 h-auto hover:bg-transparent" onClick={() => onViewProfile(player.uid)}>
                                        <Avatar>
                                            <AvatarImage src={player.avatar} alt={player.username} data-ai-hint="player avatar" />
                                            <AvatarFallback>{player.username.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-semibold text-white">{player.username}</span>
                                    </Button>
                                </TableCell>
                                <TableCell className="text-right font-mono text-lg text-green-400 p-2 sm:p-4">
                                    ${player.netWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>
              </div>

              {/* Mobile Card List */}
              <div className="md:hidden space-y-3">
                  {sortedPlayers.map((player, index) => (
                      <Card 
                        key={player.uid} 
                        className="bg-gray-700/50 border-gray-600 cursor-pointer"
                        onClick={() => onViewProfile(player.uid)}
                      >
                          <CardContent className="p-3 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2 font-bold text-lg">
                                      <span>{index + 1}</span>
                                      {index === 0 && <Trophy className="h-5 w-5 text-yellow-400" />}
                                      {index === 1 && <Trophy className="h-5 w-5 text-gray-400" />}
                                      {index === 2 && <Trophy className="h-5 w-5 text-orange-400" />}
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <Avatar className="h-10 w-10">
                                          <AvatarImage src={player.avatar} alt={player.username} data-ai-hint="player avatar" />
                                          <AvatarFallback>{player.username.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                          <p className="font-semibold text-white">{player.username}</p>
                                          <p className="text-xs text-gray-400">Level {player.level}</p>
                                      </div>
                                  </div>
                              </div>
                               <div className="text-right">
                                  <p className="font-mono text-base text-green-400">
                                      ${player.netWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                  </p>
                                   <p className="text-xs text-gray-400">Net Worth</p>
                              </div>
                          </CardContent>
                      </Card>
                  ))}
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
