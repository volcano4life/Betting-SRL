import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PromoCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  promoCode: string;
  casino?: string;
  expiryDate?: string;
}

export default function PromoCodeModal({
  open,
  onOpenChange,
  title,
  description,
  promoCode,
  casino,
  expiryDate
}: PromoCodeModalProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="space-y-4 py-4">
          {casino && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('promos.casino')}</p>
              <p className="font-medium">{casino}</p>
            </div>
          )}
          
          {expiryDate && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('promos.expires')}</p>
              <p className="font-medium">{expiryDate}</p>
            </div>
          )}
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">{t('promos.promoCode')}</p>
            <div className="flex items-center space-x-2">
              <Input 
                value={promoCode} 
                readOnly 
                className="bg-muted font-mono text-center text-lg"
              />
              <Button 
                type="button" 
                size="icon" 
                variant="outline" 
                onClick={handleCopy}
                className="flex-shrink-0"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            {t('promos.close')}
          </Button>
          <Button 
            variant="default" 
            onClick={handleCopy}
          >
            {copied ? t('promos.copied') : t('promos.copy')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}