import { useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Game, Review } from "@shared/schema";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import RatingStars from "@/components/common/RatingStars";
import { ChevronRight, Facebook, Twitter, Link as LinkIcon } from "lucide-react";
import { formatDate, getRatingText } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPageTitle, siteConfig } from "@/config/siteConfig";

export default function ReviewDetailPage() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  const { language, getLocalizedField } = useLanguage();
  
  // Redirect to 404 if no slug
  useEffect(() => {
    if (!slug) {
      setLocation("/not-found");
    }
  }, [slug, setLocation]);
  
  const { data, isLoading, error } = useQuery<{ review: Review; game: Game }>({
    queryKey: [`/api/reviews/${slug}`],
    enabled: !!slug,
  });
  
  // Handle error
  useEffect(() => {
    if (error) {
      setLocation("/not-found");
    }
  }, [error, setLocation]);
  
  const review = data?.review;
  const game = data?.game;
  
  if (isLoading) {
    return (
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-96 mb-6" />
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                  <Skeleton className="h-80 w-full mb-4" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="flex space-x-3 mb-6">
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
                
                <div className="lg:w-2/3">
                  <Skeleton className="h-10 w-3/4 mb-3" />
                  <div className="flex items-center mb-4">
                    <Skeleton className="h-6 w-32 mr-2" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-6" />
                  <div className="space-y-3 mb-6">
                    {Array(4).fill(0).map((_, i) => (
                      <div key={i} className="flex items-center">
                        <Skeleton className="w-24 h-4 mr-2" />
                        <Skeleton className="w-48 h-2 mr-2" />
                        <Skeleton className="w-8 h-4" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!review || !game) {
    return null;
  }
  
  return (
    <>
      <Helmet>
        <title translate="no">{getPageTitle('reviewDetail', getLocalizedField(review, 'title'))}</title>
        <meta name="description" content={getLocalizedField(review, 'summary')} />
      </Helmet>
      
      <div className="bg-[#F7F7FA] py-8">
        <div className="container mx-auto px-4">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/reviews">Reviews</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <span className="cursor-default">
                  {getLocalizedField(review, 'title')}
                </span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                  <div className="relative mb-4">
                    <img 
                      src={review.coverImage} 
                      alt={getLocalizedField(review, 'title')} 
                      className="w-full rounded-lg shadow-md" 
                    />
                    <div className="absolute top-3 right-3 bg-accent text-[#222236] text-lg font-bold rounded-full w-12 h-12 flex items-center justify-center">
                      {review.rating.toFixed(1)}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {game.platforms.map((platform) => (
                      <Badge key={platform} variant="outline" className="bg-[#F7F7FA] text-[#222236] text-xs font-semibold">
                        {platform}
                      </Badge>
                    ))}
                    {game.genres.map((genre) => (
                      <Badge key={genre} variant="outline" className="bg-[#F7F7FA] text-[#222236] text-xs font-semibold">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Button className="text-sm flex items-center gap-2" size="sm" variant="outline">
                      <Facebook size={16} /> Share
                    </Button>
                    <Button className="text-sm flex items-center gap-2" size="sm" variant="outline">
                      <Twitter size={16} /> Tweet
                    </Button>
                    <Button className="text-sm flex items-center gap-2" size="sm" variant="outline" onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                    }}>
                      <LinkIcon size={16} /> Copy Link
                    </Button>
                  </div>
                </div>
                
                <div className="lg:w-2/3">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>Published: {formatDate(review.publishDate, language)}</span>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-3">{getLocalizedField(review, 'title')}</h1>
                  <div className="flex items-center mb-4">
                    <RatingStars rating={review.rating} size="lg" />
                    <span className="ml-2 font-bold">{getRatingText(review.rating)}</span>
                  </div>
                  <p className="text-gray-700 mb-6 text-lg">{getLocalizedField(review, 'summary')}</p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <span className="w-24 text-sm font-semibold">Gameplay:</span>
                      <div className="w-48 h-2 bg-gray-200 rounded">
                        <div className="h-2 bg-success rounded" style={{ width: `${game.gameplayRating * 10}%` }}></div>
                      </div>
                      <span className="ml-2 text-sm font-bold">{game.gameplayRating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 text-sm font-semibold">Graphics:</span>
                      <div className="w-48 h-2 bg-gray-200 rounded">
                        <div className="h-2 bg-success rounded" style={{ width: `${game.graphicsRating * 10}%` }}></div>
                      </div>
                      <span className="ml-2 text-sm font-bold">{game.graphicsRating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 text-sm font-semibold">Story:</span>
                      <div className="w-48 h-2 bg-gray-200 rounded">
                        <div className="h-2 bg-success rounded" style={{ width: `${game.storyRating * 10}%` }}></div>
                      </div>
                      <span className="ml-2 text-sm font-bold">{game.storyRating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 text-sm font-semibold">Value:</span>
                      <div className="w-48 h-2 bg-gray-200 rounded">
                        <div className="h-2 bg-success rounded" style={{ width: `${game.valueRating * 10}%` }}></div>
                      </div>
                      <span className="ml-2 text-sm font-bold">{game.valueRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Review</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="prose lg:prose-lg max-w-none">
                <p>{getLocalizedField(review, 'content')}</p>
                
                {/* In a real implementation, we would render the full review content here */}
                <p>Full review content would be rendered here from the database.</p>
                <p>This would include multiple paragraphs, possibly with headings and lists.</p>
                <p>The content might also include images and other media elements.</p>
                
                <Separator className="my-8" />
                
                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center">
                    <div className="mr-2 bg-accent text-[#222236] text-2xl font-bold rounded-full w-14 h-14 flex items-center justify-center">
                      {review.rating.toFixed(1)}
                    </div>
                    <div>
                      <p className="font-bold">{getRatingText(review.rating)}</p>
                      <RatingStars rating={review.rating} size="lg" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="text-sm flex items-center gap-2">
                      <Facebook size={16} /> Share
                    </Button>
                    <Button variant="outline" className="text-sm flex items-center gap-2">
                      <Twitter size={16} /> Tweet
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
