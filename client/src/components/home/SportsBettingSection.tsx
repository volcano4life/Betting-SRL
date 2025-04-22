import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Trophy, TrendingUp } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { News } from "@shared/schema"; // We're temporarily using News until we update schema.ts
import { useLanguage } from "@/contexts/LanguageContext";

export default function SportsBettingSection() {
  const { t } = useLanguage();
  const { data: sportsArticles, isLoading } = useQuery<News[]>({
    queryKey: ['/api/news/latest'],
  });

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#222236]">
              {t('sports.title')}
            </h2>
            <p className="text-gray-500 mt-2">
              {t('sports.subtitle')}
            </p>
          </div>
          <Link href="/sports">
            <Button variant="outline" className="hidden md:inline-flex">
              {t('sports.viewAll')}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-[360px] w-full rounded-lg" />
            ))
          ) : sportsArticles && sportsArticles.length > 0 ? (
            sportsArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden group h-full">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={article.coverImage} 
                      alt={article.title}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-0 left-0 m-3">
                      <Badge className="bg-primary text-white">
                        {article.category || "Serie A"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-grow flex flex-col">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(article.publishDate)}</span>
                      
                      {article.id % 2 === 0 ? (
                        <Badge variant="outline" className="ml-auto flex items-center text-xs">
                          <Trophy className="h-3 w-3 mr-1" />
                          {t('sports.hotTip')}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="ml-auto flex items-center text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {t('sports.analysis')}
                        </Badge>
                      )}
                    </div>
                    
                    <Link href={`/sports/${article.slug}`}>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition">
                        {article.title}
                      </h3>
                    </Link>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
                      {article.summary}
                    </p>
                    
                    <Button variant="outline" size="sm" className="mt-auto w-full" asChild>
                      <Link href={`/sports/${article.slug}`}>
                        {t('sports.readMore')}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-500">{t('sports.empty')}</p>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/sports">
            <Button variant="outline">{t('sports.viewAll')}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}