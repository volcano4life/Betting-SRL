import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RatingStars from "./RatingStars";
import PromoCodeModal from "./PromoCodeModal";
import { formatDate } from "@/lib/utils";

interface CasinoCardProps {
  id?: number;
  title?: string;
  slug?: string;
  logo?: string;
  rating?: number;
  bonus?: string;
  promoCode?: string;
  validUntil?: string | Date;
  featured?: boolean;
  isLoading?: boolean;
}

export default function CasinoCard({
  id = 0,
  title = "",
  slug = "",
  logo = "",
  rating = 0,
  bonus = "",
  promoCode = "",
  validUntil,
  featured = false,
  isLoading = false
}: CasinoCardProps) {
  const [promoModalOpen, setPromoModalOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden transition hover:shadow-lg">
        <div className="flex flex-col h-full">
          {featured && (
            <div className="bg-primary text-white text-xs font-bold py-1 px-3 text-center">
              RECOMMENDED
            </div>
          )}
          
          <CardContent className="p-4 flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <Link href={`/casinos/${slug}`}>
                <img 
                  src={logo} 
                  alt={title} 
                  className="h-14 object-contain" 
                />
              </Link>
              <Badge variant="outline" className="text-sm font-normal">
                {typeof validUntil === 'string' || validUntil instanceof Date 
                  ? `Valid until ${formatDate(validUntil)}` 
                  : 'Limited Time Offer'}
              </Badge>
            </div>
            
            <Link href={`/casinos/${slug}`}>
              <h3 className="text-xl font-bold mb-2 hover:text-primary transition">{title}</h3>
            </Link>
            
            <div className="flex items-center mb-4">
              <RatingStars rating={rating} size="md" />
              <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}/10</span>
            </div>
            
            <div className="bg-muted p-3 rounded-lg mb-4">
              <p className="text-sm font-medium text-center">{bonus}</p>
            </div>
            
            <div className="mt-auto space-y-2">
              {promoCode && (
                <Button 
                  onClick={() => setPromoModalOpen(true)}
                  variant="outline" 
                  className="w-full"
                >
                  Show Promo Code
                </Button>
              )}
              
              <Link href={`/casinos/${slug}`}>
                <Button className="w-full">
                  Visit Casino
                </Button>
              </Link>
            </div>
          </CardContent>
        </div>
      </Card>
      
      {promoCode && (
        <PromoCodeModal
          open={promoModalOpen}
          onOpenChange={setPromoModalOpen}
          title="Your Exclusive Bonus Code"
          description="Use this code when registering to claim your bonus"
          promoCode={promoCode}
          casino={title}
          expiryDate={validUntil ? formatDate(validUntil) : undefined}
        />
      )}
    </>
  );
}