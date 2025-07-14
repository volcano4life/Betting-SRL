import { useLanguage } from "@/contexts/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();
  
  // Static banner data - will be replaced with tracking links later
  const mainBanner = {
    image: "/attached_assets/logo_Sisal_1750962171880.png",
    title: "Sisal Casino",
    link: "#"
  };
  
  const secondaryBanners = [
    {
      image: "/attached_assets/image_2021_06_03T16_49_57_431Z_1750966673841.png",
      title: "Snai Casino",
      link: "#"
    },
    {
      image: "/attached_assets/PokerStars-Logo_1750962736007.png",
      title: "PokerStars Casino", 
      link: "#"
    }
  ];
  
  return (
    <section className="bg-[#222236] text-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Translated Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{t('hero.title')}</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t('hero.subtitle')}</p>
        </div>
        
        {/* Desktop Hero */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {/* Main Banner */}
          <div className="col-span-2 relative rounded-lg overflow-hidden group h-96 bg-white" style={{ display: 'grid', placeItems: 'center', padding: '20px' }}>
            <a 
              href={mainBanner.link} 
              className="absolute inset-0"
              style={{ 
                display: 'grid',
                placeItems: 'center',
                padding: '20px'
              }}
            >
              <img 
                src={mainBanner.image} 
                alt={mainBanner.title} 
                className="transition duration-300 transform group-hover:scale-105"
                style={{ 
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            </a>
          </div>

          {/* Secondary Banners */}
          <div className="flex flex-col space-y-6">
            {secondaryBanners.map((banner, index) => (
              <a
                key={index}
                href={banner.link}
                className={`relative rounded-lg overflow-hidden group h-44 ${index === 0 || index === 1 ? 'bg-white' : ''}`}
                style={index === 0 || index === 1 ? { display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}}
              >
                <img 
                  src={banner.image} 
                  alt={banner.title} 
                  className={`transition duration-300 transform group-hover:scale-105 ${index === 0 || index === 1 ? 'max-w-full max-h-full object-contain' : 'w-full h-full object-cover'}`}
                />
              </a>
            ))}
          </div>
        </div>

        {/* Mobile Hero */}
        <div className="md:hidden">
          <div className="relative rounded-lg overflow-hidden mb-6 h-80 bg-white" style={{ display: 'grid', placeItems: 'center', padding: '20px' }}>
            <a
              href={mainBanner.link}
              className="absolute inset-0"
              style={{ 
                display: 'grid',
                placeItems: 'center',
                padding: '20px'
              }}
            >
              <img 
                src={mainBanner.image} 
                alt={mainBanner.title} 
                style={{ 
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            </a>
          </div>
          
          {/* Mobile Secondary Banners */}
          <div className="space-y-4">
            {secondaryBanners.map((banner, index) => (
              <a
                key={index}
                href={banner.link}
                className={`relative rounded-lg overflow-hidden block h-40 ${index === 0 || index === 1 ? 'bg-white' : ''}`}
                style={index === 0 || index === 1 ? { display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}}
              >
                <img 
                  src={banner.image} 
                  alt={banner.title} 
                  className={`${index === 0 || index === 1 ? 'max-w-full max-h-full object-contain' : 'w-full h-full object-cover'}`}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
