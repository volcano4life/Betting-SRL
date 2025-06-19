import { useQuery } from "@tanstack/react-query";
import { AdvertisementBanner as Banner } from "@shared/schema";

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

  if (isLoading || banners.length === 0) {
    return null;
  }

  return (
    <div className={`fixed top-20 ${position === 'left' ? 'left-4' : 'right-4'} w-64 z-40 space-y-4`}>
      {banners.map((banner) => (
        <div
          key={banner.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
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
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </a>
          ) : (
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          )}
        </div>
      ))}
    </div>
  );
}