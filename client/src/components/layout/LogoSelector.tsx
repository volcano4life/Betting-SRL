import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import BettingLogo from './BettingLogo';
import SportsBettingLogo from './SportsBettingLogo';
import CasinoChipLogo from './CasinoChipLogo';

interface LogoSelectorProps {
  onSelectLogo: (logoType: string) => void;
  selectedLogo: string;
}

const LogoSelector: React.FC<LogoSelectorProps> = ({ onSelectLogo, selectedLogo }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectLogo = (logoType: string) => {
    onSelectLogo(logoType);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">Change Logo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select a Logo</DialogTitle>
          <DialogDescription>
            Choose one of the logo options for the Betting SRL website.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col items-center gap-2 p-4 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors" 
            onClick={() => handleSelectLogo('poker-chip')}>
            <BettingLogo className="w-16 h-16" />
            <div className="text-center">
              <h3 className="font-medium">Card Table</h3>
              <p className="text-sm text-muted-foreground">Poker table with playing cards and casino chips</p>
            </div>
            {selectedLogo === 'poker-chip' && (
              <div className="mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary text-white">
                Selected
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center gap-2 p-4 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors" 
            onClick={() => handleSelectLogo('sports-shield')}>
            <SportsBettingLogo className="w-16 h-16" />
            <div className="text-center">
              <h3 className="font-medium">Sports Field</h3>
              <p className="text-sm text-muted-foreground">Sports jersey with football field and trophy</p>
            </div>
            {selectedLogo === 'sports-shield' && (
              <div className="mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary text-white">
                Selected
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center gap-2 p-4 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors" 
            onClick={() => handleSelectLogo('casino-chip')}>
            <CasinoChipLogo className="w-16 h-16" />
            <div className="text-center">
              <h3 className="font-medium">Vegas Night</h3>
              <p className="text-sm text-muted-foreground">Las Vegas-styled slot machine with dice and skyline</p>
            </div>
            {selectedLogo === 'casino-chip' && (
              <div className="mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary text-white">
                Selected
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoSelector;