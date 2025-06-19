import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Zap, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { News } from "@shared/schema";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SportsNewsSection() {
  const { t, getLocalizedField, language, translateCategory } = useLanguage();
  const { data: sportsNews, isLoading } = useQuery<News[]>({
    queryKey: ['/api/sports-news'],
  });

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#222236]">
              {t('sportsNews.title')}
            </h2>
            <p className="text-gray-500 mt-2">
              {t('sportsNews.subtitle')}
            </p>
          </div>
          <Link href="/news">
            <Button variant="outline" className="hidden md:inline-flex">
              {t('sportsNews.viewAll')}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-[400px] w-full rounded-lg" />
            ))
          ) : sportsNews && sportsNews.length > 0 ? (
            sportsNews.map((article) => (
              <Card key={article.id} className="overflow-hidden group h-full bg-white hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={article.coverImage} 
                      alt={getLocalizedField(article, 'title')}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80";
                      }}
                    />
                    <div className="absolute top-0 left-0 m-3">
                      <Badge className="bg-green-600 text-white">
                        {t('sportsNews.badge')}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-grow flex flex-col">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(article.publishDate, language)}</span>
                      
                      {article.id % 2 === 0 ? (
                        <Badge variant="outline" className="ml-auto flex items-center text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          {t('sportsNews.breaking')}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="ml-auto flex items-center text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {t('sportsNews.trending')}
                        </Badge>
                      )}
                    </div>
                    
                    <Link href={`/news/${article.slug}`}>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-green-600 transition line-clamp-2">
                        {getLocalizedField(article, 'title')}
                      </h3>
                    </Link>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
                      {getLocalizedField(article, 'summary')}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {translateCategory(article.category)}
                      </Badge>
                    </div>
                    
                    <Button variant="outline" size="sm" className="mt-auto w-full hover:bg-green-50 hover:border-green-600" asChild>
                      <Link href={`/news/${article.slug}`}>
                        {t('sportsNews.readMore')}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-500">{t('sportsNews.empty')}</p>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/news">
            <Button variant="outline">{t('sportsNews.viewAll')}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}