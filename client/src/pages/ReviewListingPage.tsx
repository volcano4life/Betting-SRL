import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Review } from "@shared/schema";
import { Separator } from "@/components/ui/separator";
import { Helmet } from "react-helmet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GameCard from "@/components/common/GameCard";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPageTitle, siteConfig } from "@/config/siteConfig";

export default function ReviewListingPage() {
  const [location] = useLocation();
  const [searchParams] = useState(() => new URLSearchParams(location.split("?")[1] || ""));
  const platform = searchParams.get("platform") || "";
  const category = searchParams.get("category") || "";
  const { getLocalizedField } = useLanguage();
  
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ['/api/reviews'],
  });
  
  // Filter reviews based on URL params (in a real app, this would be handled by the backend)
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [sortOption, setSortOption] = useState("newest");
  
  useEffect(() => {
    if (reviews) {
      let filtered = [...reviews];
      
      // Apply filters once backend data is available
      // In a real app, we'd pass these filters to the API
      
      // Sort reviews
      if (sortOption === "newest") {
        filtered.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
      } else if (sortOption === "highest") {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (sortOption === "lowest") {
        filtered.sort((a, b) => a.rating - b.rating);
      }
      
      setFilteredReviews(filtered);
    }
  }, [reviews, platform, category, sortOption]);
  
  // Construct the page title based on filters
  const getPageHeading = () => {
    let title = "Game Reviews";
    
    if (platform && category) {
      title = `${category.charAt(0).toUpperCase() + category.slice(1)} Games for ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
    } else if (platform) {
      title = `${platform.charAt(0).toUpperCase() + platform.slice(1)} Games`;
    } else if (category) {
      title = `${category.charAt(0).toUpperCase() + category.slice(1)} Games`;
    }
    
    return title;
  };

  return (
    <>
      <Helmet>
        <title translate="no">{getPageTitle('reviewListing', platform || category ? getPageHeading() : undefined)}</title>
        <meta name="description" content={`Browse our collection of ${getPageHeading().toLowerCase()}. Find the best casino reviews, tips, and expert insights on ${siteConfig.name}.`} />
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
              <span className="cursor-default">
                Reviews
              </span>
            </BreadcrumbItem>
            {platform && (
              <>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <span className="cursor-default">
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </span>
                </BreadcrumbItem>
              </>
            )}
            {category && (
              <>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <span className="cursor-default">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        
        <h1 className="text-3xl font-bold mb-6">{getPageHeading()}</h1>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <p className="text-gray-600 mb-4 md:mb-0">
            Showing {filteredReviews.length} reviews
          </p>
          
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium">Sort by:</span>
            <Select defaultValue={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="highest">Highest Rated</SelectItem>
                <SelectItem value="lowest">Lowest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Separator className="mb-8" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <GameCard key={i} isLoading />
            ))
          ) : filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <GameCard
                key={review.id}
                id={review.id}
                title={getLocalizedField(review, 'title')}
                slug={review.slug}
                coverImage={review.coverImage}
                rating={review.rating}
                summary={getLocalizedField(review, 'summary')}
                categoryInfo={{
                  platforms: ["PC"], // This would come from game data in a real implementation
                  genres: ["RPG"],   // This would come from game data in a real implementation
                  date: review.publishDate,
                }}
              />
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <h3 className="text-xl font-bold mb-2">No reviews found</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later for new content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}