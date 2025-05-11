import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { VisuallyHidden } from './visually-hidden';

interface OutletSlideshowModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  title: string;
  description: string;
}

export default function OutletSlideshowModal({
  isOpen,
  onClose,
  images,
  title,
  description
}: OutletSlideshowModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { language } = useLanguage();
  
  // Reset to first image when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen]);
  
  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  
  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-black/95 border-0">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        <div className="relative">
          {/* Close button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 z-20 bg-black/50 hover:bg-black/60 text-white rounded-full" 
            onClick={onClose}
            aria-label={language === 'it' ? 'Chiudi' : 'Close'}
          >
            <X className="h-5 w-5" />
            <VisuallyHidden>{language === 'it' ? 'Chiudi' : 'Close'}</VisuallyHidden>
          </Button>
          
          {/* Image container */}
          <div className="relative w-full h-[70vh] max-h-[650px]">
            <img
              src={images[currentIndex]}
              alt={`${title} - ${currentIndex + 1}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                // Try alternative paths in sequence if the image fails to load
                const target = e.target as HTMLImageElement;
                const originalSrc = target.src;
                
                // First try without the outlets folder
                if (originalSrc.includes('/outlets/')) {
                  const newSrc = originalSrc.replace('/outlets/', '/');
                  target.src = newSrc;
                  
                  // Set up error handler for this attempt
                  target.onerror = () => {
                    // If still failing, try a different format (with or without hyphens)
                    const baseName = originalSrc.split('/').pop()?.replace('.jpg', '') || '';
                    if (baseName.includes('-')) {
                      target.src = `/assets/${baseName.replace(/-/g, '')}.jpg`;
                    } else if (/\d/.test(baseName)) {
                      // Try adding hyphen before numbers
                      target.src = `/assets/${baseName.replace(/(\d)/g, '-$1')}.jpg`;
                    } else {
                      // Last resort - placeholder
                      target.src = 'https://placehold.co/600x400?text=Image+Not+Found';
                    }
                  };
                } else {
                  // Fallback for other image problems
                  target.src = 'https://placehold.co/600x400?text=Image+Not+Found';
                }
              }}
            />
            
            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 hover:bg-black/60 text-white rounded-full"
                  onClick={goToPrevious}
                  aria-label={language === 'it' ? 'Immagine precedente' : 'Previous image'}
                >
                  <ChevronLeft className="h-6 w-6" />
                  <VisuallyHidden>{language === 'it' ? 'Immagine precedente' : 'Previous image'}</VisuallyHidden>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 hover:bg-black/60 text-white rounded-full"
                  onClick={goToNext}
                  aria-label={language === 'it' ? 'Immagine successiva' : 'Next image'}
                >
                  <ChevronRight className="h-6 w-6" />
                  <VisuallyHidden>{language === 'it' ? 'Immagine successiva' : 'Next image'}</VisuallyHidden>
                </Button>
              </>
            )}
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
          
          {/* Description section */}
          <div className="bg-[#222236] text-white p-6">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-gray-300">{description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}