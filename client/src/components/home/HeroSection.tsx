import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import RatingStars from "../common/RatingStars";
import { formatDate } from "@/lib/utils";
import { Game, Review, News } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HeroSection() {
  const { t, getLocalizedField } = useLanguage();
  
  const { data: featuredCasinos, isLoading: casinosLoading } = useQuery<Review[]>({
    queryKey: ['/api/reviews/featured'],
  });
  
  const { data: featuredBonuses, isLoading: bonusesLoading } = useQuery<Game[]>({
    queryKey: ['/api/games/featured'],
  });
  
  const { data: latestNews, isLoading: newsLoading } = useQuery<News[]>({
    queryKey: ['/api/news/latest', 2],
  });
  
  const isLoading = casinosLoading || bonusesLoading || newsLoading;
  
  const mainFeatured = featuredCasinos?.[0];
  const secondaryFeatured = latestNews?.slice(0, 2);
  
  return (
    <section className="bg-[#222236] text-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Translated Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('hero.title')}</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t('hero.subtitle')}</p>
        </div>
        
        {/* Desktop Hero */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {/* Main Featured */}
          {isLoading ? (
            <div className="col-span-2 relative rounded-lg overflow-hidden h-96">
              <Skeleton className="w-full h-full" />
            </div>
          ) : mainFeatured ? (
            <Link 
              href={`/reviews/${mainFeatured.slug}`} 
              className="col-span-2 relative rounded-lg overflow-hidden group h-96"
            >
              <img 
                src={mainFeatured.coverImage} 
                alt={getLocalizedField(mainFeatured, 'title')} 
                className="w-full h-full object-cover transition duration-300 transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <div className="flex items-center mb-3">
                  <Badge variant="secondary" className="mr-3">{t('hero.new')}</Badge>
                  <span className="text-sm text-gray-300">{formatDate(mainFeatured.publishDate)}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{t('hero.featuredReview')}</h2>
                <p className="text-gray-200 mb-4 line-clamp-2">{t('hero.featuredReviewSummary')}</p>
                <div className="flex items-center mb-3">
                  <RatingStars rating={mainFeatured.rating} size="xl" />
                  <span className="ml-2 font-bold">{mainFeatured.rating.toFixed(1)}</span>
                </div>
                <Button size="sm" variant="secondary" className="bg-accent text-[#222236] hover:bg-accent/90 font-medium">
                  {t('hero.cta')}
                </Button>
              </div>
            </Link>
          ) : (
            <div className="col-span-2 relative rounded-lg overflow-hidden flex items-center justify-center h-96 bg-neutral-800">
              <p>{t('hero.noFeaturedContent')}</p>
            </div>
          )}

          {/* Secondary Featured */}
          <div className="flex flex-col space-y-6">
            {isLoading ? (
              <>
                <Skeleton className="h-44 w-full rounded-lg" />
                <Skeleton className="h-44 w-full rounded-lg" />
              </>
            ) : secondaryFeatured && secondaryFeatured.length > 0 ? (
              secondaryFeatured.map((news, index) => (
                <Link
                  key={news.id}
                  href={`/news/${news.slug}`}
                  className="relative rounded-lg overflow-hidden group h-44"
                >
                  <img 
                    src={news.coverImage} 
                    alt={getLocalizedField(news, 'title')} 
                    className="w-full h-full object-cover transition duration-300 transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-lg font-bold mb-1">{index === 0 ? t('hero.news1Title') : t('hero.news2Title')}</h3>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-accent text-[#222236] font-bold">{t('hero.hot')}</Badge>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="h-full flex items-center justify-center bg-neutral-800 rounded-lg">
                <p>{t('hero.noNewsAvailable')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hero */}
        <div className="md:hidden">
          {isLoading ? (
            <Skeleton className="h-80 w-full rounded-lg mb-6" />
          ) : mainFeatured ? (
            <Link
              href={`/reviews/${mainFeatured.slug}`}
              className="relative rounded-lg overflow-hidden mb-6 h-80 block"
            >
              <img 
                src={mainFeatured.coverImage} 
                alt={getLocalizedField(mainFeatured, 'title')} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <div className="flex items-center mb-2">
                  <Badge variant="secondary" className="mr-2">{t('hero.new')}</Badge>
                  <span className="text-xs text-gray-300">{formatDate(mainFeatured.publishDate)}</span>
                </div>
                <h2 className="text-xl font-bold mb-2">{t('hero.featuredReview')}</h2>
                <p className="text-gray-200 mb-2 line-clamp-2 text-sm">{t('hero.featuredReviewSummary')}</p>
                <div className="flex items-center mb-2">
                  <RatingStars rating={mainFeatured.rating} size="sm" />
                  <span className="ml-2 font-bold">{mainFeatured.rating.toFixed(1)}</span>
                </div>
                <Button size="sm" variant="secondary" className="bg-accent text-[#222236] hover:bg-accent/90 font-medium text-xs">
                  {t('hero.cta')}
                </Button>
              </div>
            </Link>
          ) : (
            <div className="relative rounded-lg overflow-hidden mb-6 h-80 flex items-center justify-center bg-neutral-800">
              <p>{t('hero.noFeaturedContent')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
