import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import AnimatedWrapper from '@/components/ui/animated-wrapper';
import OutletSlideshowModal from '@/components/ui/outlet-slideshow-modal';

// Import the images
import redmoon1 from '@/assets/redmoon1.jpg';
import redmoon2 from '@/assets/redmoon2.jpg';
import redmoon3 from '@/assets/redmoon3.jpg';
import redmoon4 from '@/assets/redmoon4.jpg';
import redmoon5 from '@/assets/redmoon5.jpg';

interface Outlet {
  id: number;
  title_en: string;
  title_it: string;
  description_en: string | null;
  description_it: string | null;
  imageUrl: string;
  order: number | null;
  isActive: boolean;
  createdAt: Date;
}

export function OutletSlideshow() {
  const { language, t, getLocalizedField } = useLanguage();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: outlets, isLoading } = useQuery<Outlet[]>({
    queryKey: ['/api/outlets'],
  });

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
  
  // Define a map of outlet IDs to their slideshow images
  // Each outlet has its own dedicated set of images
  const outletImageSets: { [key: number]: string[] } = {
    1: [redmoon1, redmoon2, redmoon3, redmoon4, redmoon5], // Redmoon Aversa
    2: [redmoon2, redmoon3, redmoon4], // Wincity Trentola-Ducenta
    3: [redmoon3, redmoon4, redmoon5], // Matchpoint Trentola-Ducenta
  };
  
  const handleOutletClick = (outlet: Outlet) => {
    setSelectedOutlet(outlet);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
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
          {displayOutlets.map((outlet, index) => (
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
                  src={outlet.imageUrl === 'redmoon1.jpg' ? redmoon1 : 
                       outlet.imageUrl === 'redmoon2.jpg' ? redmoon2 : 
                       outlet.imageUrl === 'redmoon3.jpg' ? redmoon3 : 
                       outlet.imageUrl === 'redmoon4.jpg' ? redmoon4 : redmoon5}
                  alt={getLocalizedField(outlet, 'title')} 
                  className={`w-full h-full object-cover object-center transition-all duration-700 ease-in-out ${
                    hoveredId === outlet.id ? 'scale-110 brightness-110' : 'scale-100 brightness-100'
                  }`}
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
          images={outletImageSets[selectedOutlet.id] || []}
          title={getLocalizedField(selectedOutlet, 'title')}
          description={getLocalizedField(selectedOutlet, 'description') || ''}
        />
      )}
    </section>
  );
}