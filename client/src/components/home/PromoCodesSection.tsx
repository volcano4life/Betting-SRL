import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { PromoCode } from "@shared/schema";
import { useLanguage } from "@/contexts/LanguageContext";
import PromoCodeModal from "@/components/common/PromoCodeModal";

export default function PromoCodesSection() {
  const { t, getLocalizedField } = useLanguage();
  const [promoModalData, setPromoModalData] = useState<{
    open: boolean;
    promoCode: string;
    casino: string;
    expiryDate: string;
  }>({
    open: false,
    promoCode: "",
    casino: "",
    expiryDate: "",
  });
  
  const { data: promos, isLoading } = useQuery<PromoCode[]>({
    queryKey: ['/api/promo-codes/featured'],
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
                      {t('promos.expires')} {formatDate(new Date(promo.validUntil))}
                    </Badge>
                  </div>
                  <div className="relative p-6">
                    <div className="mb-3 flex items-center">
                      {promo.casinoLogo ? (
                        <img 
                          src={promo.casinoLogo} 
                          alt={getLocalizedField(promo, 'casino_name')} 
                          className="h-12 w-12 mr-3 object-contain" 
                        />
                      ) : (
                        <div className="h-12 w-12 mr-3 bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-gray-500">Logo</span>
                        </div>
                      )}
                      <h3 className="font-bold text-lg">{getLocalizedField(promo, 'casino_name')}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {getLocalizedField(promo, 'description')}
                    </p>
                    <div className="bg-primary/10 border border-primary/20 rounded p-2 text-center mb-4">
                      <span className="font-mono font-bold">{promo.code}</span>
                    </div>
                    <p className="text-sm font-medium text-center mb-3">
                      {getLocalizedField(promo, 'bonus')}
                    </p>
                    <div className="flex space-x-2">
                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={() => setPromoModalData({
                          open: true,
                          promoCode: promo.code,
                          casino: getLocalizedField(promo, 'casino_name'),
                          expiryDate: formatDate(new Date(promo.validUntil))
                        })}
                      >
                        {t('promos.viewCode')}
                      </Button>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={promo.affiliateLink} target="_blank" rel="noopener noreferrer">
                          {t('promos.claimBonus')}
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-500">{t('promos.empty')}</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/promos">
            <Button variant="outline">{t('promos.viewAll')}</Button>
          </Link>
        </div>
      </div>
      
      {/* Promo Code Modal */}
      {promoModalData.open && (
        <PromoCodeModal
          open={promoModalData.open}
          onOpenChange={(open) => setPromoModalData({ ...promoModalData, open })}
          title={t('promos.modalTitle')}
          description={t('promos.modalDescription')}
          promoCode={promoModalData.promoCode}
          casino={promoModalData.casino}
          expiryDate={promoModalData.expiryDate}
        />
      )}
    </section>
  );
}