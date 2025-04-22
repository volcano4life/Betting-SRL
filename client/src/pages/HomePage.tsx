import HeroSection from "@/components/home/HeroSection";
import FeaturedCasinosSection from "@/components/home/FeaturedCasinosSection";
import PromoCodesSection from "@/components/home/PromoCodesSection";
import SportsBettingSection from "@/components/home/SportsBettingSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import { Helmet } from "react-helmet";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Betting SRL - Italian Casino Affiliates & Sport Betting</title>
        <meta name="description" content="Find the best Italian casino bonuses, exclusive promo codes, and expert sports betting insights for a premium gambling experience." />
      </Helmet>

      <HeroSection />
      <FeaturedCasinosSection />
      <PromoCodesSection />
      <SportsBettingSection />
      <NewsletterSection />
    </>
  );
}
