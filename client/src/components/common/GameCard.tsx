import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface GameCardProps {
  id?: number;
  title?: string;
  slug?: string;
  coverImage?: string;
  rating?: number;
  summary?: string;
  categoryInfo?: {
    platforms: string[];
    genres: string[];
    date: string | Date;
  };
  isLoading?: boolean;
}

export default function GameCard({
  id,
  title,
  slug,
  coverImage,
  rating,
  summary,
  categoryInfo,
  isLoading = false,
}: GameCardProps) {
  const { language } = useLanguage();
  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg h-[350px] animate-pulse">
        <Skeleton className="w-full h-48" />
        <CardContent className="p-4">
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <Skeleton className="h-3 w-20 mr-2" />
            <Skeleton className="h-3 w-8 mr-2" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    );
  }

  if (!id || !title || !slug || !coverImage || !rating) {
    return null;
  }

  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg">
      <div className="relative">
        <img 
          src={coverImage} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-0 right-0 bg-primary text-white text-sm font-bold px-3 py-1 m-2 rounded">
          {rating.toFixed(1)}
        </div>
      </div>
      <CardContent className="p-4">
        {categoryInfo && (
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <span>{categoryInfo.platforms.join(', ')}</span>
            <span className="mx-2">•</span>
            <span>{categoryInfo.genres.join(', ')}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(categoryInfo.date, language)}</span>
          </div>
        )}
        <h3 className="text-lg font-bold mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{summary}</p>
        <Link 
          href={`/reviews/${slug}`}
          className="text-primary hover:text-secondary font-semibold text-sm transition duration-200"
        >
          Read Full Review <ChevronRight className="inline-block ml-1 h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}
