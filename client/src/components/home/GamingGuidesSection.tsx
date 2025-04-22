import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Guide } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import GuideCard from "../common/GuideCard";

export default function GamingGuidesSection() {
  const { data: latestGuides, isLoading } = useQuery<Guide[]>({
    queryKey: ['/api/guides/latest'],
  });

  return (
    <section className="py-12 bg-[#F7F7FA]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Gaming Guides & Tips</h2>
          <Button variant="link" className="text-primary hover:text-secondary font-semibold" asChild>
            <Link href="/guides">
              All Guides <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <GuideCard key={i} isLoading />
            ))
          ) : latestGuides && latestGuides.length > 0 ? (
            latestGuides.map((guide) => (
              <GuideCard 
                key={guide.id}
                id={guide.id}
                title={guide.title}
                slug={guide.slug}
                coverImage={guide.coverImage}
                difficulty={guide.difficulty}
                category={guide.category}
                date={guide.publishDate}
                summary={guide.summary}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p>No guides available at the moment</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
