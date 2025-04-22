import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { News } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import NewsCard from "../common/NewsCard";

export default function GamingNewsSection() {
  const { data: latestNews, isLoading } = useQuery<News[]>({
    queryKey: ['/api/news/latest', 5],
  });

  const mainNews = latestNews?.slice(0, 2);
  const secondaryNews = latestNews?.slice(2, 5);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Latest Gaming News</h2>
          <Button variant="link" className="text-primary hover:text-secondary font-semibold" asChild>
            <Link href="/news">
              All News <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <>
              <Skeleton className="h-72 w-full rounded-lg" />
              <Skeleton className="h-72 w-full rounded-lg" />
            </>
          ) : mainNews && mainNews.length > 0 ? (
            mainNews.map((news) => (
              <div 
                key={news.id} 
                className="bg-[#F7F7FA] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300"
              >
                <div className="md:flex">
                  <div className="md:w-2/5">
                    <img 
                      src={news.coverImage} 
                      alt={news.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="p-6 md:w-3/5">
                    <div className="text-xs text-gray-500 mb-2">
                      {formatDate(news.publishDate)} • {news.category}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{news.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{news.summary}</p>
                    <Link 
                      href={`/news/${news.slug}`}
                      className="text-primary hover:text-secondary font-semibold transition duration-200 text-sm"
                    >
                      Read More <ChevronRight className="inline-block ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <p>No news available at the moment</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-52 w-full rounded-lg" />
            ))
          ) : secondaryNews && secondaryNews.length > 0 ? (
            secondaryNews.map((news) => (
              <NewsCard 
                key={news.id}
                id={news.id}
                title={news.title}
                slug={news.slug}
                category={news.category}
                date={news.publishDate}
                summary={news.summary}
              />
            ))
          ) : null}
        </div>
      </div>
    </section>
  );
}
