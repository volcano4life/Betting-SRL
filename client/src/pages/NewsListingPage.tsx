import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { News } from "@shared/schema";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPageTitle } from "@/config/siteConfig";

export default function NewsListingPage() {
  const { t, getLocalizedField, language } = useLanguage();
  const { data: news, isLoading, isError } = useQuery<News[]>({
    queryKey: ['/api/news'],
  });

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>{getPageTitle('news.listing')}</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-8">
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-12 w-2/3 mb-2" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Helmet>
          <title>{getPageTitle('news.listing')}</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('news.errorLoading')}</h1>
            <p className="text-gray-600 mb-8">{t('news.errorLoadingDesc')}</p>
            <Button asChild>
              <Link href="/">{t('news.backToHome')}</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{getPageTitle('news.listing')}</title>
        <meta name="description" content={t('news.listingDesc')} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back button and header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-6">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('news.backToHome')}
              </Link>
            </Button>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('news.allNews')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('news.listingDesc')}
            </p>
          </div>

          {/* News grid */}
          {news && news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article) => (
                <Card key={article.id} className="overflow-hidden group bg-white hover:shadow-lg transition-shadow duration-300">
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
                        <Badge className="bg-blue-600 text-white">
                          {article.category}
                        </Badge>
                      </div>
                      {article.featured && (
                        <div className="absolute top-0 right-0 m-3">
                          <Badge variant="secondary">
                            {t('news.featured')}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-grow flex flex-col">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(article.publishDate, language)}</span>
                      </div>

                      <Link href={`/news/${article.slug}`}>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition line-clamp-2">
                          {getLocalizedField(article, 'title')}
                        </h3>
                      </Link>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
                        {getLocalizedField(article, 'summary')}
                      </p>

                      <Button variant="outline" size="sm" className="mt-auto w-full hover:bg-blue-50 hover:border-blue-600" asChild>
                        <Link href={`/news/${article.slug}`}>
                          {t('news.readMore')}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('news.empty')}</h3>
              <p className="text-gray-600">{t('news.emptyDesc')}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}