import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Review } from "@shared/schema";
import GameCard from "../common/GameCard";
import { ChevronRight } from "lucide-react";

export default function LatestReviewsSection() {
  const { data: latestReviews, isLoading } = useQuery<Review[]>({
    queryKey: ['/api/reviews/latest'],
  });

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Latest Reviews</h2>
          <Button variant="link" className="text-primary hover:text-secondary font-semibold" asChild>
            <Link href="/reviews">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <GameCard key={i} isLoading />
            ))
          ) : latestReviews && latestReviews.length > 0 ? (
            latestReviews.map((review) => (
              <GameCard
                key={review.id}
                id={review.id}
                title={review.title}
                slug={review.slug}
                coverImage={review.coverImage}
                rating={review.rating}
                summary={review.summary}
                categoryInfo={{
                  platforms: ["PC"], // This would normally come from the game data
                  genres: ["RPG"],   // This would normally come from the game data
                  date: review.publishDate,
                }}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p>No reviews available at the moment</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
