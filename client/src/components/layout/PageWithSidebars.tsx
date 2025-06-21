import { useQuery } from "@tanstack/react-query";
import { AdvertisementBanner as AdvertisementBannerType } from "@shared/schema";
import AdvertisementBanner from "./AdvertisementBanner";

interface PageWithSidebarsProps {
  children: React.ReactNode;
}

export default function PageWithSidebars({ children }: PageWithSidebarsProps) {
  // Check if there are any active advertisement banners
  const { data: banners = [] } = useQuery<AdvertisementBannerType[]>({
    queryKey: ['/api/advertisement-banners'],
  });

  const leftBanners = banners.filter(banner => banner.position === 'left' && banner.isActive);
  const rightBanners = banners.filter(banner => banner.position === 'right' && banner.isActive);
  const hasLeftBanners = leftBanners.length > 0;
  const hasRightBanners = rightBanners.length > 0;
  const hasBanners = hasLeftBanners || hasRightBanners;

  // Dynamic padding based on banner availability
  const getContentPadding = () => {
    if (!hasBanners) return "px-4"; // No banners, use normal padding
    if (hasLeftBanners && hasRightBanners) return "xl:px-80 px-4"; // Both sides
    if (hasLeftBanners || hasRightBanners) return "xl:px-40 px-4"; // One side only
    return "px-4";
  };

  // Force re-render when banner state changes
  const bannerKey = `${hasLeftBanners}-${hasRightBanners}-${banners.length}`;

  return (
    <div className="relative" key={bannerKey}>
      {/* Left Advertisement Banners */}
      {hasLeftBanners && (
        <div className="hidden xl:block">
          <AdvertisementBanner position="left" />
        </div>
      )}

      {/* Main Content */}
      <div className={getContentPadding()}>
        {children}
      </div>

      {/* Right Advertisement Banners */}
      {hasRightBanners && (
        <div className="hidden xl:block">
          <AdvertisementBanner position="right" />
        </div>
      )}
    </div>
  );
}