import { useQuery } from "@tanstack/react-query";
import { AdvertisementBanner as Banner } from "@shared/schema";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface AdvertisementBannerProps {
  position: 'left' | 'right';
}

export default function AdvertisementBanner({ position }: AdvertisementBannerProps) {
  const { data: banners = [], isLoading } = useQuery<Banner[]>({
    queryKey: ['/api/advertisement-banners', position],
    queryFn: async () => {
      const response = await fetch(`/api/advertisement-banners?position=${position}`);
      return response.json();
    },
  });

  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleImageError = (bannerId: number) => {
    setImageErrors(prev => new Set([...prev, bannerId]));
  };

  if (isLoading || banners.length === 0) {
    return null;
  }

  const validBanners = banners.filter(banner => !imageErrors.has(banner.id));

  if (validBanners.length === 0) {
    return null;
  }

  // Show only the first banner for each position
  const banner = validBanners[0];

  return (
    <div className={`fixed top-1/2 -translate-y-1/2 ${position === 'left' ? 'left-4' : 'right-4'} w-64 xl:w-72 z-40`}>
      <div
        key={banner.id}
        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative"
      >
        {/* AD Badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-2 left-2 bg-black/80 text-white text-xs font-bold px-2 py-1 z-10 hover:bg-black/80"
        >
          AD
        </Badge>
        
        {banner.clickUrl ? (
          <a
            href={banner.clickUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-auto object-cover max-h-96"
              loading="lazy"
              onError={() => handleImageError(banner.id)}
            />
            <div className="p-3 bg-gradient-to-r from-primary to-secondary">
              <p className="text-white text-sm font-medium text-center truncate">
                {banner.title}
              </p>
            </div>
          </a>
        ) : (
          <>
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-auto object-cover max-h-96"
              loading="lazy"
              onError={() => handleImageError(banner.id)}
            />
            <div className="p-3 bg-gradient-to-r from-primary to-secondary">
              <p className="text-white text-sm font-medium text-center truncate">
                {banner.title}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}