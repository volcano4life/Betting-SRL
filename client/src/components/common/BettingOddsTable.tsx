import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface Odd {
  bookmaker: string;
  bookmakerLogo?: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  link: string;
}

interface BettingOddsTableProps {
  match: {
    homeTeam: string;
    awayTeam: string;
    league: string;
    startTime: string | Date;
  };
  odds: Odd[];
}

export default function BettingOddsTable({ match, odds }: BettingOddsTableProps) {
  const formatOdd = (odd: number) => odd.toFixed(2);
  
  // Find best odds for each outcome
  const bestHomeOdd = Math.max(...odds.map(odd => odd.homeWin));
  const bestDrawOdd = Math.max(...odds.map(odd => odd.draw));
  const bestAwayOdd = Math.max(...odds.map(odd => odd.awayWin));
  
  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="bg-muted p-4">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            {match.league}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {typeof match.startTime === 'string' 
              ? match.startTime 
              : match.startTime.toLocaleString()}
          </span>
        </div>
        <h3 className="text-lg font-bold">
          {match.homeTeam} vs {match.awayTeam}
        </h3>
      </div>

      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[180px]">Bookmaker</TableHead>
            <TableHead className="text-center">1</TableHead>
            <TableHead className="text-center">X</TableHead>
            <TableHead className="text-center">2</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {odds.map((odd, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  {odd.bookmakerLogo && (
                    <img 
                      src={odd.bookmakerLogo} 
                      alt={odd.bookmaker} 
                      className="w-6 h-6 mr-2 object-contain" 
                    />
                  )}
                  {odd.bookmaker}
                </div>
              </TableCell>
              <TableCell className={`text-center font-medium ${odd.homeWin === bestHomeOdd ? 'text-green-600' : ''}`}>
                {formatOdd(odd.homeWin)}
              </TableCell>
              <TableCell className={`text-center font-medium ${odd.draw === bestDrawOdd ? 'text-green-600' : ''}`}>
                {formatOdd(odd.draw)}
              </TableCell>
              <TableCell className={`text-center font-medium ${odd.awayWin === bestAwayOdd ? 'text-green-600' : ''}`}>
                {formatOdd(odd.awayWin)}
              </TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.open(odd.link, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Bet
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="bg-slate-50 p-3 text-center text-xs text-muted-foreground">
        Odds are subject to change. Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
}