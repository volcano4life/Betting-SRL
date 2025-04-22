import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import RatingStars from "../common/RatingStars";
import { formatDate } from "@/lib/utils";
import { Game, Review, News } from "@shared/schema";

export default function HeroSection() {
  const { data: featuredReviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ['/api/reviews/featured'],
  });
  
  const { data: featuredGames, isLoading: gamesLoading } = useQuery<Game[]>({
    queryKey: ['/api/games/featured'],
  });
  
  const { data: latestNews, isLoading: newsLoading } = useQuery<News[]>({
    queryKey: ['/api/news/latest', 2],
  });
  
  const isLoading = reviewsLoading || gamesLoading || newsLoading;
  
  const mainFeatured = featuredReviews?.[0];
  const secondaryFeatured = latestNews?.slice(0, 2);
  
  return (
    <section className="bg-[#222236] text-white py-12 md:py-16">
      <div className="container mx-auto px-4">
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
                alt={mainFeatured.title} 
                className="w-full h-full object-cover transition duration-300 transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <div className="flex items-center mb-3">
                  <Badge variant="secondary" className="mr-3">NEW</Badge>
                  <span className="text-sm text-gray-300">{formatDate(mainFeatured.publishDate)}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{mainFeatured.title}</h2>
                <p className="text-gray-200 mb-4 line-clamp-2">{mainFeatured.summary}</p>
                <div className="flex items-center">
                  <RatingStars rating={mainFeatured.rating} size="xl" />
                  <span className="ml-2 font-bold">{mainFeatured.rating.toFixed(1)}</span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="col-span-2 relative rounded-lg overflow-hidden flex items-center justify-center h-96 bg-neutral-800">
              <p>No featured content available</p>
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
              secondaryFeatured.map((news) => (
                <Link
                  key={news.id}
                  href={`/news/${news.slug}`}
                  className="relative rounded-lg overflow-hidden group h-44"
                >
                  <img 
                    src={news.coverImage} 
                    alt={news.title} 
                    className="w-full h-full object-cover transition duration-300 transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-lg font-bold mb-1">{news.title}</h3>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-accent text-[#222236] font-bold">HOT</Badge>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="h-full flex items-center justify-center bg-neutral-800 rounded-lg">
                <p>No news available</p>
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
                alt={mainFeatured.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <div className="flex items-center mb-2">
                  <Badge variant="secondary" className="mr-2">NEW</Badge>
                  <span className="text-xs text-gray-300">{formatDate(mainFeatured.publishDate)}</span>
                </div>
                <h2 className="text-xl font-bold mb-2">{mainFeatured.title}</h2>
                <div className="flex items-center">
                  <RatingStars rating={mainFeatured.rating} size="sm" />
                  <span className="ml-2 font-bold">{mainFeatured.rating.toFixed(1)}</span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="relative rounded-lg overflow-hidden mb-6 h-80 flex items-center justify-center bg-neutral-800">
              <p>No featured content available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
