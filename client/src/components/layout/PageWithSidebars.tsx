import AdvertisementBanner from "./AdvertisementBanner";

interface PageWithSidebarsProps {
  children: React.ReactNode;
}

export default function PageWithSidebars({ children }: PageWithSidebarsProps) {
  return (
    <div className="relative">
      {/* Left Advertisement Banners */}
      <div className="hidden xl:block">
        <AdvertisementBanner position="left" />
      </div>

      {/* Main Content */}
      <div className="xl:px-80 px-4">
        {children}
      </div>

      {/* Right Advertisement Banners */}
      <div className="hidden xl:block">
        <AdvertisementBanner position="right" />
      </div>
    </div>
  );
}