import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface GuideCardProps {
  id?: number;
  title?: string;
  slug?: string;
  coverImage?: string;
  difficulty?: string;
  category?: string;
  date?: string | Date;
  summary?: string;
  isLoading?: boolean;
}

export default function GuideCard({
  id,
  title,
  slug,
  coverImage,
  difficulty,
  category,
  date,
  summary,
  isLoading = false,
}: GuideCardProps) {
  const { language } = useLanguage();
  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse h-[370px]">
        <Skeleton className="w-full h-48" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-4 w-24" />
        </CardContent>
      </Card>
    );
  }

  if (!id || !title || !slug || !coverImage || !summary) {
    return null;
  }

  const getBadgeColor = (difficulty: string) => {
    switch (difficulty.toUpperCase()) {
      case 'BEGINNER':
        return "bg-secondary text-white";
      case 'INTERMEDIATE':
        return "bg-primary text-white";
      case 'ADVANCED':
        return "bg-accent text-[#222236]";
      case 'HARDWARE':
        return "bg-primary text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={coverImage} 
        alt={title} 
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Badge className={getBadgeColor(difficulty || "")}>{difficulty}</Badge>
          <span className="text-xs text-gray-500">{date && formatDate(date)}</span>
        </div>
        <h3 className="text-lg font-bold mb-3">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{summary}</p>
        <Link 
          href={`/guides/${slug}`}
          className="text-primary hover:text-secondary font-semibold text-sm transition duration-200"
        >
          Read Guide <ChevronRight className="inline-block ml-1 h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}
