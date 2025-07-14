import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import OutletSlideshowModal from '@/components/ui/outlet-slideshow-modal';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const outletsPerPage = 3; // Number of outlets to show per page
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
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
  
  // Auto-rotation effect
  useEffect(() => {
    if (!outlets || outlets.length <= outletsPerPage) return;
    
    let interval: NodeJS.Timeout;
    
    // Don't rotate if paused or section is hovered
    if (!isPaused && !isHovered) {
      interval = setInterval(() => {
        setCurrentPage((prev) => (prev + 1) % Math.ceil(outlets.length / outletsPerPage));
      }, 8000); // Rotate every 8 seconds for less jarring experience
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [outlets, isPaused, isHovered, outletsPerPage]); // Removing currentPage dependency to prevent reset
  
  // Reference to track animation
  const progressRef = useRef<HTMLDivElement>(null);
  
  // Reset animation when page changes or when pause state changes
  useEffect(() => {
    if (progressRef.current) {
      // Reset animation by removing and re-adding it
      progressRef.current.style.animation = 'none';
      
      // Force a reflow to ensure the animation restart properly
      // eslint-disable-next-line no-unused-expressions
      progressRef.current.offsetHeight;
      
      if (!isPaused && !isHovered) {
        setTimeout(() => {
          if (progressRef.current) {
            progressRef.current.style.animation = 'progress 8s linear 1';
          }
        }, 10);
      }
    }
  }, [currentPage, isPaused, isHovered]);

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

  // Calculate pagination values
  const totalPages = Math.ceil(outlets.length / outletsPerPage);
  const startIndex = currentPage * outletsPerPage;
  const endIndex = startIndex + outletsPerPage;
  const displayOutlets = outlets.slice(startIndex, endIndex);
  
  // Navigation functions
  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  // Helper function to get the right image path
  const getImagePath = (imageName: string): string => {
    // Check if the image already has a full path
    if (imageName.startsWith('/') || imageName.startsWith('http')) {
      return imageName;
    }
    
    // Check if this is a new outlet image (redmoon-new-, wincity-new-, matchpoint-new-, wincity, matchpoint)
    if (imageName.startsWith('redmoon-new-') || imageName.startsWith('wincity-new-') || imageName.startsWith('matchpoint-new-') || imageName.startsWith('wincity') || imageName.startsWith('matchpoint')) {
      return `/assets/outlets/${imageName}.jpg`;
    }
    
    // Check if this is a timestamped image (like 1_1750514327472)
    if (imageName.match(/^\d+_\d+$/)) {
      return `/attached_assets/${imageName}.jpg`;
    }
    
    // Check if this is an uploaded image (UUID format with dashes)
    if (imageName.includes('-') && imageName.length > 10) {
      // If it's an uploaded image, check if it already has an extension
      return imageName.includes('.') ? 
        `/uploads/${imageName}` : 
        `/uploads/${imageName}.jpg`;
    }
    
    // Otherwise, assume it's a predefined asset
    return `/assets/${imageName}.jpg`;
  };
  
  // Log the path resolution for debugging
  console.log('Image path resolution examples:');
  console.log('  redmoon1 →', getImagePath('redmoon1'));
  console.log('  UUID image →', getImagePath('123e4567-e89b-12d3-a456-426614174000'));

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
        <div className="mb-6 pt-4 text-center">
          <h1 className="text-4xl md:text-5xl text-white mb-2 tracking-tight font-bold">
            {language === 'it' ? 'Scopri I nostri punti vendita' : 'Check out our betting outlets'}
          </h1>
          <p className="text-lg text-white/80 font-medium">
            {language === 'it' ? 'Trova il punto vendita più vicino a te' : 'Find the nearest outlet to you'}
          </p>
        </div>
        
        <div 
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Auto-rotation control */}
          {outlets && outlets.length > outletsPerPage && (
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="absolute right-2 top-2 z-20 bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-full shadow-md flex items-center justify-center"
              aria-label={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
            >
              {isPaused ? (
                <Play className="h-3.5 w-3.5" />
              ) : (
                <Pause className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        
          {/* Navigation buttons for larger screens */}
          {outlets && outlets.length > outletsPerPage && (
            <>
              <button 
                onClick={goToPrevPage}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full shadow-md -ml-4 hidden sm:flex items-center justify-center"
                aria-label="Previous outlets"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <button 
                onClick={goToNextPage}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full shadow-md -mr-4 hidden sm:flex items-center justify-center"
                aria-label="Next outlets"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        
          {/* Desktop grid view */}
          <div className="hidden sm:grid grid-cols-3 gap-4 min-h-[192px]">
            {displayOutlets.map((outlet, index) => (
              <div
                key={outlet.id}
                className="w-full transform transition-all duration-300 ease-in-out"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  opacity: 1,
                  transform: 'translateY(0)'
                }}
              >
                <div 
                  className="relative overflow-hidden rounded-md cursor-pointer h-48 bg-gray-800"
                  onMouseEnter={() => {
                    setHoveredId(outlet.id);
                    setIsHovered(true);
                  }}
                  onMouseLeave={() => {
                    setHoveredId(null);
                    setIsHovered(false);
                  }}
                  onClick={() => handleOutletClick(outlet)}
                >
                  <img 
                    src={getOutletImage(outlet)}
                    alt={getLocalizedField(outlet, 'title')} 
                    className={`w-full h-full object-cover object-center transition-transform duration-500 ease-in-out ${
                      hoveredId === outlet.id ? 'scale-110' : 'scale-100'
                    }`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const currentSrc = target.src;
                      
                      // Log error for debugging
                      console.log('Image failed to load in slider:', currentSrc);
                      
                      // Simple fallback to known working image
                      target.src = '/assets/redmoon1.jpg';
                    }}
                  />
                  <div className={`absolute inset-0 transition-all duration-300 ${
                    hoveredId === outlet.id ? 'bg-gradient-to-t from-black/90 via-black/60 to-transparent' 
                    : 'bg-gradient-to-t from-black/80 to-transparent'
                  } flex flex-col justify-end p-4`}>
                    <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full opacity-80">
                      {language === 'it' ? 'Clicca per vedere tutto' : 'Click to view all'}
                    </div>
                    <div className="min-h-[48px] flex flex-col justify-end">
                      <h3 className="text-white font-bold text-base mb-1">
                        {getLocalizedField(outlet, 'title')}
                      </h3>
                      <div className={`overflow-hidden transition-all duration-300 ${
                        hoveredId === outlet.id ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <p className="text-white/90 text-sm line-clamp-2">
                          {getLocalizedField(outlet, 'description')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile horizontal scroll view */}
          <div className="sm:hidden">
            <div 
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
              style={{
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth'
              }}
            >
              {outlets && outlets.map((outlet) => (
                <div
                  key={outlet.id}
                  className="flex-none w-80 transform transition-all duration-300 ease-in-out"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div 
                    className="relative overflow-hidden rounded-md cursor-pointer h-48 bg-gray-800"
                    onTouchStart={() => {
                      setHoveredId(outlet.id);
                      setIsHovered(true);
                    }}
                    onTouchEnd={() => {
                      setHoveredId(null);
                      setIsHovered(false);
                    }}
                    onClick={() => handleOutletClick(outlet)}
                  >
                    <img 
                      src={getOutletImage(outlet)}
                      alt={getLocalizedField(outlet, 'title')} 
                      className="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const currentSrc = target.src;
                        
                        // Log error for debugging
                        console.log('Image failed to load in slider:', currentSrc);
                        
                        // Simple fallback to known working image
                        target.src = '/assets/redmoon1.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                      <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full opacity-80">
                        {language === 'it' ? 'Scorri per vedere tutto' : 'Swipe to view all'}
                      </div>
                      <div className="min-h-[48px] flex flex-col justify-end">
                        <h3 className="text-white font-bold text-base mb-1">
                          {getLocalizedField(outlet, 'title')}
                        </h3>
                        <p className="text-white/90 text-sm line-clamp-2">
                          {getLocalizedField(outlet, 'description')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile scroll indicator */}
          <div className="sm:hidden mt-4 text-center">
            <p className="text-white/60 text-sm">
              {language === 'it' ? 'Scorri orizzontalmente per vedere tutti i punti vendita' : 'Scroll horizontally to see all outlets'}
            </p>
          </div>
          
          {/* Desktop pagination indicators */}
          {outlets && outlets.length > outletsPerPage && (
            <div className="hidden sm:flex justify-center mt-4">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`h-2 mx-1 rounded-full transition-all ${
                    currentPage === index ? 'w-6 bg-white' : 'w-2 bg-white/30'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
          
          {/* Auto-rotation indicator */}
          {outlets && outlets.length > outletsPerPage && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
              <div 
                ref={progressRef}
                className={`h-full transition-all ${isPaused || isHovered ? 'bg-white/20' : 'bg-white/50'}`}
                style={{ 
                  animation: (!isPaused && !isHovered) ? 'progress 8s linear 1' : 'none', 
                  width: isPaused || isHovered ? '30%' : undefined
                }}
              />
            </div>
          )}
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