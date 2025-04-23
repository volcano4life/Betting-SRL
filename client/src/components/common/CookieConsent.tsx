import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { X } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const { t } = useLanguage();
  
  useEffect(() => {
    // Check if the user has already accepted cookies
    const hasAccepted = localStorage.getItem('cookieConsent');
    if (!hasAccepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setVisible(false);
  };
  
  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setVisible(false);
  };
  
  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 p-4 md:p-6 border-t">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1 pr-4">
            <h3 className="text-lg font-semibold">{t('cookies.title')}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t('cookies.description')}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleReject}
              className="text-sm"
            >
              {t('cookies.reject')}
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleAccept}
              className="text-sm"
            >
              {t('cookies.accept')}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose}
              className="md:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;