import HeroSection from "@/components/home/HeroSection";
import FeaturedCasinosSection from "@/components/home/FeaturedCasinosSection";
import SportsNewsSection from "@/components/home/SportsNewsSection";
import ResponsibleGamblingSection from "@/components/home/ResponsibleGamblingSection";
import GamblingFAQSection from "@/components/home/GamblingFAQSection";

import { OutletSlideshow } from "@/components/sections/OutletSlideshow";
import { Helmet } from "react-helmet";
import { siteConfig } from "@/config/siteConfig";
import { usePageTitle } from "@/hooks/use-page-title";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();
  
  // Use the custom hook for cross-tab title synchronization
  usePageTitle('home.title');

  return (
    <>
      <Helmet>
        <meta name="description" content={siteConfig.defaultDescription} />
      </Helmet>

      <div id="outlets-section">
        <OutletSlideshow />
      </div>
      
      {/* <div id="hero-section">
        <HeroSection />
      </div> */}
      
      <div id="dealers-section">
        <FeaturedCasinosSection />
      </div>
      

      <div id="news-section">
        <SportsNewsSection />
      </div>
      
      <ResponsibleGamblingSection />
      <GamblingFAQSection />

    </>
  );
}
