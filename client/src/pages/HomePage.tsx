import HeroSection from "@/components/home/HeroSection";
import FeaturedCasinosSection from "@/components/home/FeaturedCasinosSection";
import PromoCodesSection from "@/components/home/PromoCodesSection";
import SportsBettingSection from "@/components/home/SportsBettingSection";
import ResponsibleGamblingSection from "@/components/home/ResponsibleGamblingSection";
import GamblingFAQSection from "@/components/home/GamblingFAQSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import { OutletSlideshow } from "@/components/sections/OutletSlideshow";
import { Helmet } from "react-helmet";
import { getPageTitle, siteConfig } from "@/config/siteConfig";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>{siteConfig.defaultTitle}</title>
        <meta name="description" content={siteConfig.defaultDescription} />
      </Helmet>

      <HeroSection />
      <OutletSlideshow />
      <FeaturedCasinosSection />
      <PromoCodesSection />
      <SportsBettingSection />
      <ResponsibleGamblingSection />
      <GamblingFAQSection />
      <NewsletterSection />
    </>
  );
}
