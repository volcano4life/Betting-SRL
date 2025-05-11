import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import BettingLogo from './BettingLogo';
import SportsBettingLogo from './SportsBettingLogo';
import CasinoChipLogo from './CasinoChipLogo';
import { useLogo, LogoType } from '@/contexts/LogoContext';

interface LogoSelectorProps {
  // No props needed anymore, we'll use context
}

const LogoSelector: React.FC<LogoSelectorProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { selectedLogo, setSelectedLogo, customLogoUrl, setCustomLogoUrl } = useLogo();

  const handleSelectLogo = (logoType: LogoType) => {
    setSelectedLogo(logoType);
    if (logoType !== 'custom') {
      setIsOpen(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleConfirmCustomLogo = () => {
    if (previewUrl) {
      setCustomLogoUrl(previewUrl);
      setSelectedLogo('custom');
      setIsOpen(false);
    }
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
            onClick={() => handleSelectLogo('poker-chip' as LogoType)}>
            <BettingLogo className="h-16" />
            <div className="text-center">
              <h3 className="font-medium">Betting SRL</h3>
              <p className="text-sm text-muted-foreground">Official Betting SRL logo with green background</p>
            </div>
            {selectedLogo === 'poker-chip' && (
              <div className="mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary text-white">
                Selected
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center gap-2 p-4 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors" 
            onClick={() => handleSelectLogo('sports-shield' as LogoType)}>
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
            onClick={() => handleSelectLogo('casino-chip' as LogoType)}>
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
          
          <div className="flex flex-col items-center gap-2 p-4 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
            <div 
              className="w-16 h-16 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer"
              onClick={handleUploadClick}
            >
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Custom logo preview" 
                  className="h-14 object-contain" 
                  style={{ maxWidth: "100%", aspectRatio: "auto" }}
                />
              ) : (
                <Upload className="w-8 h-8 text-muted-foreground" />
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
            </div>
            <div className="text-center">
              <h3 className="font-medium">Custom Logo</h3>
              <p className="text-sm text-muted-foreground">Upload your own custom logo</p>
            </div>
            {selectedLogo === 'custom' && !previewUrl && customLogoUrl && (
              <div className="mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary text-white">
                Selected
              </div>
            )}
            {previewUrl && (
              <Button
                size="sm"
                onClick={handleConfirmCustomLogo}
                className="mt-2"
              >
                Use This Logo
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoSelector;