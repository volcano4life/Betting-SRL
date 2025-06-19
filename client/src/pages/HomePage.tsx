import HeroSection from "@/components/home/HeroSection";
import FeaturedCasinosSection from "@/components/home/FeaturedCasinosSection";
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
        <title translate="no">{siteConfig.defaultTitle}</title>
        <meta name="description" content={siteConfig.defaultDescription} />
      </Helmet>

      <OutletSlideshow />
      <HeroSection />
      <FeaturedCasinosSection />
      <SportsBettingSection />
      <ResponsibleGamblingSection />
      <GamblingFAQSection />
      <NewsletterSection />
    </>
  );
}
