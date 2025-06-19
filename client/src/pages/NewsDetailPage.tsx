import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/lib/utils";
import { getPageTitle } from "@/config/siteConfig";
import { News } from "@shared/schema";

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, getLocalizedField, language } = useLanguage();

  const { data: newsItem, isLoading, isError } = useQuery<News>({
    queryKey: [`/api/news/${slug}`],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !newsItem) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('news.notFound')}</h1>
          <p className="text-gray-600 mb-8">{t('news.notFoundDesc')}</p>
          <Button asChild>
            <Link href="/">{t('news.backToHome')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{getPageTitle('news.detail', getLocalizedField(newsItem, 'title'))}</title>
        <meta name="description" content={getLocalizedField(newsItem, 'summary')} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('news.backToHome')}
            </Link>
          </Button>

          {/* Article header */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="relative h-64 md:h-80">
              <img
                src={newsItem.coverImage}
                alt={getLocalizedField(newsItem, 'title')}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80";
                }}
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-green-600 text-white">
                  {newsItem.category}
                </Badge>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(newsItem.publishDate, language)}</span>
                {newsItem.featured && (
                  <Badge variant="outline" className="ml-auto">
                    {t('news.featured')}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {getLocalizedField(newsItem, 'title')}
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {getLocalizedField(newsItem, 'summary')}
              </p>

              <div className="prose prose-lg max-w-none">
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {getLocalizedField(newsItem, 'content')}
                </div>
              </div>
            </div>
          </div>

          {/* Related articles section could go here */}
        </div>
      </div>
    </>
  );
}