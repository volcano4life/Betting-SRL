import HeroSection from "@/components/home/HeroSection";
import LatestReviewsSection from "@/components/home/LatestReviewsSection";
import TopRatedGamesSection from "@/components/home/TopRatedGamesSection";
import GamingNewsSection from "@/components/home/GamingNewsSection";
import GamingGuidesSection from "@/components/home/GamingGuidesSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import { Helmet } from "react-helmet";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>GameReviews - Your Source for Gaming Information</title>
        <meta name="description" content="Discover the latest game reviews, news, and guides for PC, console, and mobile gaming." />
      </Helmet>

      <HeroSection />
      <LatestReviewsSection />
      <TopRatedGamesSection />
      <GamingNewsSection />
      <GamingGuidesSection />
      <NewsletterSection />
    </>
  );
}
