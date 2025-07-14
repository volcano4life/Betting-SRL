import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import OutletSlideshowModal from '@/components/ui/outlet-slideshow-modal';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  
  // Pagination state for desktop
  const [currentPage, setCurrentPage] = useState(0);
  const outletsPerPage = 3; // Number of outlets to show per page
  
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

  // Manual navigation only - no auto-rotation or progress tracking

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
        
        <div className="relative max-w-6xl mx-auto">
          {/* Remove pause/play button since auto-rotation is disabled */}
        
          {/* Navigation buttons for desktop */}
          {outlets && outlets.length > outletsPerPage && (
            <>
              <button 
                onClick={goToPrevPage}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full shadow-md -ml-4 hidden sm:flex items-center justify-center transition-all duration-300 hover:scale-110"
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
        
          {/* Desktop animated carousel view */}
          <div className="hidden sm:block overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  duration: 0.5 
                }}
                className="grid grid-cols-3 gap-4 min-h-[192px]"
              >
                {displayOutlets.map((outlet, index) => (
                  <motion.div
                    key={outlet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring", 
                      stiffness: 300, 
                      damping: 30 
                    }}
                    className="w-full"
                  >
                    <motion.div 
                      className="relative overflow-hidden rounded-md cursor-pointer h-48 bg-gray-800"
                      onMouseEnter={() => setHoveredId(outlet.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => handleOutletClick(outlet)}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <motion.img 
                        src={getOutletImage(outlet)}
                        alt={getLocalizedField(outlet, 'title')} 
                        className="w-full h-full object-cover object-center"
                        animate={{
                          scale: hoveredId === outlet.id ? 1.1 : 1
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const currentSrc = target.src;
                          
                          // Log error for debugging
                          console.log('Image failed to load in slider:', currentSrc);
                          
                          // Simple fallback to known working image
                          target.src = '/assets/redmoon1.jpg';
                        }}
                      />
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4"
                        animate={{
                          background: hoveredId === outlet.id 
                            ? 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.6), transparent)'
                            : 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full opacity-80">
                          {language === 'it' ? 'Clicca per vedere tutto' : 'Click to view all'}
                        </div>
                        <div className="min-h-[48px] flex flex-col justify-end">
                          <h3 className="text-white font-bold text-base mb-1">
                            {getLocalizedField(outlet, 'title')}
                          </h3>
                          <motion.div 
                            className="overflow-hidden"
                            animate={{
                              maxHeight: hoveredId === outlet.id ? 64 : 0,
                              opacity: hoveredId === outlet.id ? 1 : 0
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <p className="text-white/90 text-sm line-clamp-2">
                              {getLocalizedField(outlet, 'description')}
                            </p>
                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile horizontal scroll view with smooth animations */}
          <div className="sm:hidden">
            <div 
              className="flex gap-4 overflow-x-auto scrollbar-hide mobile-scroll pb-4 px-4"
              style={{
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {outlets && outlets.map((outlet, index) => (
                <motion.div
                  key={outlet.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30 
                  }}
                  className="flex-none w-72"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <motion.div 
                    className="relative overflow-hidden rounded-md cursor-pointer h-48 bg-gray-800"
                    onClick={() => handleOutletClick(outlet)}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <motion.img 
                      src={getOutletImage(outlet)}
                      alt={getLocalizedField(outlet, 'title')} 
                      className="w-full h-full object-cover object-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const currentSrc = target.src;
                        
                        // Log error for debugging
                        console.log('Image failed to load in slider:', currentSrc);
                        
                        // Simple fallback to known working image
                        target.src = '/assets/redmoon1.jpg';
                      }}
                    />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.div 
                        className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full opacity-80"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 30 }}
                      >
                        {language === 'it' ? 'Scorri per vedere tutto' : 'Swipe to view all'}
                      </motion.div>
                      <motion.div 
                        className="min-h-[48px] flex flex-col justify-end"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h3 className="text-white font-bold text-base mb-1">
                          {getLocalizedField(outlet, 'title')}
                        </h3>
                        <p className="text-white/90 text-sm line-clamp-2">
                          {getLocalizedField(outlet, 'description')}
                        </p>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>
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
          
          {/* Progress bar removed - using manual navigation only */}
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