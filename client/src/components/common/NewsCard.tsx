import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface NewsCardProps {
  id?: number;
  title?: string;
  slug?: string;
  category?: string;
  date?: string | Date;
  summary?: string;
  isLoading?: boolean;
}

export default function NewsCard({
  id,
  title,
  slug,
  category,
  date,
  summary,
  isLoading = false,
}: NewsCardProps) {
  const { language } = useLanguage();
  if (isLoading) {
    return (
      <Card className="bg-[#F7F7FA] rounded-lg p-5 shadow-sm hover:shadow-md transition duration-300 animate-pulse h-[180px]">
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-5 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        <Skeleton className="h-4 w-24" />
      </Card>
    );
  }

  if (!id || !title || !slug || !summary) {
    return null;
  }

  return (
    <Card className="bg-[#F7F7FA] rounded-lg p-5 shadow-sm hover:shadow-md transition duration-300">
      <CardContent className="p-0">
        <div className="text-xs text-gray-500 mb-2">
          {date && formatDate(date, language)} • {category}
        </div>
        <h3 className="text-lg font-bold mb-3 line-clamp-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{summary}</p>
        <Link 
          href={`/news/${slug}`}
          className="text-primary hover:text-secondary font-semibold text-sm transition duration-200"
        >
          Read More <ChevronRight className="inline-block ml-1 h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}
