import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { Review } from "@shared/schema"; // We're temporarily using Review until we update schema.ts
import { useLanguage } from "@/contexts/LanguageContext";

export default function PromoCodesSection() {
  const { t } = useLanguage();
  const { data: promos, isLoading } = useQuery<Review[]>({
    queryKey: ['/api/reviews/latest'],
  });

  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#222236]">
              {t('promos.title')}
            </h2>
            <p className="text-gray-500 mt-2">
              {t('promos.subtitle')}
            </p>
          </div>
          <Link href="/promos">
            <Button variant="outline" className="hidden md:inline-flex">
              {t('promos.viewAll')}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-44 w-full rounded-lg" />
            ))
          ) : promos && promos.length > 0 ? (
            promos.slice(0, 3).map((promo) => (
              <Card key={promo.id} className="overflow-hidden group">
                <CardContent className="p-0 relative">
                  <div className="absolute top-0 right-0 m-3 z-10">
                    <Badge className="bg-red-500 hover:bg-red-600 text-white">
                      Expires {formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))}
                    </Badge>
                  </div>
                  <div className="relative p-6">
                    <div className="mb-3 flex items-center">
                      <img 
                        src={promo.coverImage} 
                        alt={promo.title} 
                        className="h-12 mr-3 object-contain" 
                      />
                      <h3 className="font-bold text-lg">{promo.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {promo.summary || "Exclusive welcome bonus with free spins and deposit match"}
                    </p>
                    <div className="bg-primary/10 border border-primary/20 rounded p-2 text-center mb-4">
                      <span className="font-mono font-bold">WELCOME100</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button className="w-full" size="sm" asChild>
                        <Link href={`/promos/${promo.slug}`}>
                          Claim Now
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href={`/casinos/${promo.slug}`}>
                          View Casino
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-500">No promo codes available</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/promos">
            <Button variant="outline">View All Promos</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}