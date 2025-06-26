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
        <Card className="overflow-hidden relative h-full">
          <div className="flex flex-col h-full">
            {/* Logo banner across the top - standardized height */}
            <div className="w-full h-20 bg-white flex items-center justify-center border-b">
              {logo && logo.includes('@assets') ? (
                <img 
                  src={logo.replace('@assets', '/attached_assets')}
                  alt={title} 
                  className={title === "PokerStars" ? "h-20 object-contain max-w-full px-2" : title === "GoldBet" ? "h-18 object-contain max-w-full px-2" : "h-16 object-contain max-w-full px-2"}
                />
              ) : (
                <img 
                  src={logo} 
                  alt={title} 
                  className="h-16 object-contain max-w-full px-2" 
                />
              )}
            </div>
            
            <CardContent className="p-4 flex-grow flex flex-col">
              <div className="mb-3">
                {/* Remove validity date badge completely */}
              </div>
              
              {title === "Sisal" ? (
                <a href="https://ads.sisal.it/promoRedirect?key=ej0xMzUyNDE2MyZsPTE2MTY4NTcxJnA9MTM2Nzc5" target="_blank" rel="noopener noreferrer">
                  <h3 className="text-xl font-bold mb-2 hover:text-primary transition">{title}</h3>
                </a>
              ) : title === "PokerStars" ? (
                <a href="https://secure.starsaffiliateclub.com/C.ashx?btag=a_189389b_7227c_&affid=100980558&siteid=189389&adid=7227&c=" target="_blank" rel="noopener noreferrer">
                  <h3 className="text-xl font-bold mb-2 hover:text-primary transition">{title}</h3>
                </a>
              ) : (
                <Link href={`/casinos/${slug}`}>
                  <h3 className="text-xl font-bold mb-2 hover:text-primary transition">{title}</h3>
                </Link>
              )}
              
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
              
              <div className="mt-auto">
                {title === "Sisal" ? (
                  <a href="https://ads.sisal.it/promoRedirect?key=ej0xMzUyNDE2MyZsPTE2MTY4NTcxJnA9MTM2Nzc5" target="_blank" rel="noopener noreferrer">
                    <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                      <Button className="w-full">
                        {t('featured.visitCasino')}
                      </Button>
                    </motion.div>
                  </a>
                ) : title === "PokerStars" ? (
                  <a href="https://secure.starsaffiliateclub.com/C.ashx?btag=a_189389b_7227c_&affid=100980558&siteid=189389&adid=7227&c=" target="_blank" rel="noopener noreferrer">
                    <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                      <Button className="w-full">
                        {t('featured.visitCasino')}
                      </Button>
                    </motion.div>
                  </a>
                ) : title === "GoldBet" ? (
                  <a href="https://media.goldbetpartners.it/redirect.aspx?pid=16281&bid=1494" target="_blank" rel="noopener noreferrer">
                    <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                      <Button className="w-full">
                        {t('featured.visitCasino')}
                      </Button>
                    </motion.div>
                  </a>
                ) : (
                  <Link href={`/casinos/${slug}`}>
                    <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                      <Button className="w-full">
                        {t('featured.visitCasino')}
                      </Button>
                    </motion.div>
                  </Link>
                )}
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