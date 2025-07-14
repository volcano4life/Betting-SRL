import { useLanguage } from "@/contexts/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();
  
  // Static banner data - will be replaced with tracking links later
  const mainBanner = {
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
    title: "Main Banner",
    link: "#"
  };
  
  const secondaryBanners = [
    {
      image: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
      title: "Secondary Banner 1",
      link: "#"
    },
    {
      image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
      title: "Secondary Banner 2", 
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
          <a 
            href={mainBanner.link} 
            className="col-span-2 relative rounded-lg overflow-hidden group h-96"
          >
            <img 
              src={mainBanner.image} 
              alt={mainBanner.title} 
              className="w-full h-full object-cover transition duration-300 transform group-hover:scale-105"
            />
          </a>

          {/* Secondary Banners */}
          <div className="flex flex-col space-y-6">
            {secondaryBanners.map((banner, index) => (
              <a
                key={index}
                href={banner.link}
                className="relative rounded-lg overflow-hidden group h-44"
              >
                <img 
                  src={banner.image} 
                  alt={banner.title} 
                  className="w-full h-full object-cover transition duration-300 transform group-hover:scale-105"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Mobile Hero */}
        <div className="md:hidden">
          <a
            href={mainBanner.link}
            className="relative rounded-lg overflow-hidden mb-6 h-80 block"
          >
            <img 
              src={mainBanner.image} 
              alt={mainBanner.title} 
              className="w-full h-full object-cover"
            />
          </a>
          
          {/* Mobile Secondary Banners */}
          <div className="space-y-4">
            {secondaryBanners.map((banner, index) => (
              <a
                key={index}
                href={banner.link}
                className="relative rounded-lg overflow-hidden block h-40"
              >
                <img 
                  src={banner.image} 
                  alt={banner.title} 
                  className="w-full h-full object-cover"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
