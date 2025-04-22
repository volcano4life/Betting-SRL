import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Game } from "@shared/schema";
import RatingStars from "../common/RatingStars";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRatingText } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export default function TopRatedGamesSection() {
  const { data: topRatedGames, isLoading } = useQuery<Game[]>({
    queryKey: ['/api/games/top-rated', 4],
  });

  const featuredGame = topRatedGames?.[0];
  const otherTopGames = topRatedGames?.slice(1, 4);

  return (
    <section className="py-12 bg-[#F7F7FA]">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Top Rated Games</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Featured Top Rated Game */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {isLoading ? (
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 animate-pulse">
                    <div className="sm:w-2/5 pr-0 sm:pr-6">
                      <Skeleton className="w-full h-64 mb-4" />
                      <div className="flex space-x-2 mb-4">
                        <Skeleton className="w-24 h-6" />
                        <Skeleton className="w-16 h-6" />
                      </div>
                    </div>
                    <div className="sm:w-3/5">
                      <Skeleton className="w-3/4 h-8 mb-3" />
                      <Skeleton className="w-1/2 h-5 mb-4" />
                      <Skeleton className="w-full h-24 mb-4" />
                      <div className="space-y-2">
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
              ) : featuredGame ? (
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0">
                    <div className="sm:w-2/5 pr-0 sm:pr-6">
                      <div className="relative mb-4">
                        <img 
                          src={featuredGame.coverImage} 
                          alt={featuredGame.title} 
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <div className="absolute top-3 right-3 bg-accent text-[#222236] text-lg font-bold rounded-full w-12 h-12 flex items-center justify-center">
                          {featuredGame.overallRating.toFixed(1)}
                        </div>
                      </div>
                      <div className="flex space-x-2 mb-4 flex-wrap gap-2">
                        {featuredGame.platforms.map((platform) => (
                          <Badge key={platform} variant="outline" className="bg-[#F7F7FA] text-[#222236] text-xs font-semibold">
                            {platform}
                          </Badge>
                        ))}
                        {featuredGame.genres.map((genre) => (
                          <Badge key={genre} variant="outline" className="bg-[#F7F7FA] text-[#222236] text-xs font-semibold">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4">
                        <Button 
                          className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-primary/80 transition duration-200"
                          asChild
                        >
                          <Link href={`/reviews/${featuredGame.slug}`}>
                            Read Review
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <div className="sm:w-3/5">
                      <h3 className="text-xl md:text-2xl font-bold mb-3">{featuredGame.title}</h3>
                      <div className="flex items-center mb-4">
                        <RatingStars rating={featuredGame.overallRating} size="lg" />
                        <span className="ml-2 font-bold">{getRatingText(featuredGame.overallRating)}</span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-4">{featuredGame.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="w-24 text-sm font-semibold">Gameplay:</span>
                          <div className="w-48 h-2 bg-gray-200 rounded">
                            <div className="h-2 bg-success rounded" style={{ width: `${featuredGame.gameplayRating * 10}%` }}></div>
                          </div>
                          <span className="ml-2 text-sm font-bold">{featuredGame.gameplayRating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 text-sm font-semibold">Graphics:</span>
                          <div className="w-48 h-2 bg-gray-200 rounded">
                            <div className="h-2 bg-success rounded" style={{ width: `${featuredGame.graphicsRating * 10}%` }}></div>
                          </div>
                          <span className="ml-2 text-sm font-bold">{featuredGame.graphicsRating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 text-sm font-semibold">Story:</span>
                          <div className="w-48 h-2 bg-gray-200 rounded">
                            <div className="h-2 bg-success rounded" style={{ width: `${featuredGame.storyRating * 10}%` }}></div>
                          </div>
                          <span className="ml-2 text-sm font-bold">{featuredGame.storyRating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 text-sm font-semibold">Value:</span>
                          <div className="w-48 h-2 bg-gray-200 rounded">
                            <div className="h-2 bg-success rounded" style={{ width: `${featuredGame.valueRating * 10}%` }}></div>
                          </div>
                          <span className="ml-2 text-sm font-bold">{featuredGame.valueRating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center">No top-rated games available</div>
              )}
            </div>
          </div>

          {/* Other Top Games */}
          <div className="flex flex-col space-y-6">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="flex">
                    <Skeleton className="w-1/3 h-32" />
                    <div className="w-2/3 p-4">
                      <div className="flex justify-between items-start">
                        <Skeleton className="w-2/3 h-5 mb-1" />
                        <Skeleton className="w-10 h-5" />
                      </div>
                      <Skeleton className="w-full h-3 mb-2" />
                      <Skeleton className="w-full h-12 mb-2" />
                      <Skeleton className="w-28 h-3" />
                    </div>
                  </div>
                </div>
              ))
            ) : otherTopGames && otherTopGames.length > 0 ? (
              otherTopGames.map((game) => (
                <div key={game.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="flex">
                    <div className="w-1/3">
                      <img 
                        src={game.coverImage} 
                        alt={game.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold mb-1">{game.title}</h3>
                        <div className="bg-primary text-white text-sm font-bold px-2 py-1 rounded">{game.overallRating.toFixed(1)}</div>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <span>{game.platforms.join(', ')}</span>
                        <span className="mx-2">•</span>
                        <span>{game.genres.join(', ')}</span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">{game.description}</p>
                      <Link 
                        href={`/reviews/${game.slug}`} 
                        className="text-primary hover:text-secondary font-semibold text-xs transition duration-200"
                      >
                        Read Review <ChevronRight className="inline h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                No other top games available
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
