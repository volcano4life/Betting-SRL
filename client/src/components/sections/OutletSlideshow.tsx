import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import AnimatedWrapper from '@/components/ui/animated-wrapper';
import OutletSlideshowModal from '@/components/ui/outlet-slideshow-modal';

interface Outlet {
  id: number;
  title_en: string;
  title_it: string;
  description_en: string | null;
  description_it: string | null;
  address_en: string | null;
  address_it: string | null;
  imageUrl: string;
  additionalImages: string[] | null;
  order: number | null;
  isActive: boolean;
  createdAt: Date;
}

export function OutletSlideshow() {
  const { language, getLocalizedField } = useLanguage();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: outlets, isLoading } = useQuery<Outlet[]>({
    queryKey: ['/api/outlets'],
  });

  const handleOutletClick = (outlet: Outlet) => {
    setSelectedOutlet(outlet);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOutlet(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-2">
        <div className="w-8 h-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!outlets || outlets.length === 0) {
    return null;
  }

  // Only show the first 3 outlets
  const displayOutlets = outlets.slice(0, 3);

  // Helper function to get the right image path
  const getImagePath = (imageName: string): string => {
    // Check if the image already has a full path
    if (imageName.startsWith('/') || imageName.startsWith('http')) {
      return imageName;
    }
    
    // Check if this is an uploaded image (should be used without extension)
    if (imageName.includes('-')) {
      return `/uploads/${imageName}`;
    }
    
    // Otherwise, assume it's a predefined asset
    return `/assets/${imageName}.jpg`;
  };

  // Get outlet image from data
  const getOutletImage = (outlet: Outlet): string => {
    if (!outlet.imageUrl) return '/assets/redmoon1.jpg';
    return getImagePath(outlet.imageUrl);
  };

  // Get outlet slideshow images from data
  const getOutletSlideshow = (outlet: Outlet): string[] => {
    const images: string[] = [];
    
    // Add primary image
    if (outlet.imageUrl) {
      images.push(getImagePath(outlet.imageUrl));
    }
    
    // Add additional images if available
    if (outlet.additionalImages && outlet.additionalImages.length > 0) {
      const additionalImages = outlet.additionalImages.map(img => getImagePath(img));
      images.push(...additionalImages);
    }
    
    // Fallback if no images
    if (images.length === 0) {
      images.push('/assets/redmoon1.jpg');
    }
    
    return images;
  };

  return (
    <section className="py-4 bg-gradient-to-r from-[#2a293e] to-[#222236] border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="mb-4 pt-2 text-center">
          <h2 className="text-xl font-bold text-white">
            {language === 'it' ? 'Scopri I nostri punti vendita' : 'Check out our betting outlets'}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {displayOutlets.map((outlet) => (
            <AnimatedWrapper
              key={outlet.id}
              animation="fade" 
              duration={0.5} 
              delay={0.1}
              className="w-full"
            >
              <div 
                className="relative overflow-hidden rounded-md cursor-pointer h-40 sm:h-48"
                onMouseEnter={() => setHoveredId(outlet.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleOutletClick(outlet)}
              >
                <img 
                  src={getOutletImage(outlet)}
                  alt={getLocalizedField(outlet, 'title')} 
                  className={`w-full h-full object-cover object-center transition-all duration-700 ease-in-out ${
                    hoveredId === outlet.id ? 'scale-110 brightness-110' : 'scale-100 brightness-100'
                  }`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const currentSrc = target.src;
                    
                    // Try different fallback paths in sequence
                    if (currentSrc.includes('/uploads/')) {
                      // If uploads path failed, try assets path
                      target.src = `/assets/${outlet.imageUrl}.jpg`;
                    } else if (currentSrc.includes('/assets/') && !currentSrc.includes('/assets/outlets/')) {
                      // If assets path failed, try outlets path
                      target.src = `/assets/outlets/${outlet.imageUrl || 'redmoon1'}.jpg`;
                    } else {
                      // Last resort fallback
                      target.src = '/assets/redmoon1.jpg';
                    }
                  }}
                />
                <div className={`absolute inset-0 transition-all duration-300 ${
                  hoveredId === outlet.id ? 'bg-gradient-to-t from-black/90 via-black/60 to-transparent' 
                  : 'bg-gradient-to-t from-black/80 to-transparent'
                } flex flex-col justify-end p-4`}>
                  <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full opacity-80">
                    {language === 'it' ? 'Clicca per vedere tutto' : 'Click to view all'}
                  </div>
                  <h3 className={`text-white font-bold transition-all duration-300 ${
                    hoveredId === outlet.id ? 'text-lg mb-2' : 'text-base mb-0'
                  }`}>
                    {getLocalizedField(outlet, 'title')}
                  </h3>
                  {hoveredId === outlet.id && (
                    <p className="text-white/90 text-sm line-clamp-2 opacity-100 transform transition-all duration-300">
                      {getLocalizedField(outlet, 'description')}
                    </p>
                  )}
                </div>
              </div>
            </AnimatedWrapper>
          ))}
        </div>
      </div>
      
      {/* Slideshow Modal */}
      {selectedOutlet && (
        <OutletSlideshowModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          images={getOutletSlideshow(selectedOutlet)}
          title={getLocalizedField(selectedOutlet, 'title')}
          description={getLocalizedField(selectedOutlet, 'description') || ''}
        />
      )}
    </section>
  );
}