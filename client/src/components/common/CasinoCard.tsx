import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RatingStars from "./RatingStars";
import PromoCodeModal from "./PromoCodeModal";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

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
  const { t, language } = useLanguage();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    },
    hover: { 
      scale: 1.03,
      boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 30 
      }
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { delay: 0.2 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.03,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.97 }
  };

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={cardVariants}
      >
        <Card className="overflow-hidden">
          <div className="flex flex-col h-full">
            {featured && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-primary text-white text-xs font-bold py-1 px-3 text-center"
              >
                {t('featured.recommended')}
              </motion.div>
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
                <motion.div variants={badgeVariants}>
                  <Badge variant="outline" className="text-sm font-normal">
                    {typeof validUntil === 'string' || validUntil instanceof Date 
                      ? `${t('featured.validUntil')} ${formatDate(validUntil, language)}` 
                      : t('featured.limitedTimeOffer')}
                  </Badge>
                </motion.div>
              </div>
              
              <Link href={`/casinos/${slug}`}>
                <h3 className="text-xl font-bold mb-2 hover:text-primary transition">{title}</h3>
              </Link>
              
              <div className="flex items-center mb-4">
                <RatingStars rating={rating} size="md" />
                <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}/10</span>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-muted p-3 rounded-lg mb-4"
              >
                <p className="text-sm font-medium text-center">{bonus}</p>
              </motion.div>
              
              <div className="mt-auto space-y-2">
                {promoCode && (
                  <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                    <Button 
                      onClick={() => setPromoModalOpen(true)}
                      variant="outline" 
                      className="w-full"
                    >
                      {t('featured.showPromoCode')}
                    </Button>
                  </motion.div>
                )}
                
                <Link href={`/casinos/${slug}`}>
                  <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                    <Button className="w-full">
                      {t('featured.visitCasino')}
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
      
      {promoCode && (
        <PromoCodeModal
          open={promoModalOpen}
          onOpenChange={setPromoModalOpen}
          title={t('promos.modalTitle')}
          description={t('promos.modalDescription')}
          promoCode={promoCode}
          casino={title}
          expiryDate={validUntil ? formatDate(validUntil, language) : undefined}
        />
      )}
    </>
  );
}