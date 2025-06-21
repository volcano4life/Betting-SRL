import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RatingStars from "./RatingStars";
import PromoCodeModal from "./PromoCodeModal";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAgeVerification } from "@/contexts/AgeVerificationContext";
import { motion } from "framer-motion";
import { Shield, AlertTriangle } from "lucide-react";

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
  const { isAgeVerified, setAgeVerified } = useAgeVerification();

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
        <Card className="overflow-hidden relative">
          {!isAgeVerified && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6"
            >
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-center"
                >
                  <div className="bg-yellow-500 text-black rounded-full p-3">
                    <AlertTriangle className="h-8 w-8" />
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <h3 className="text-white font-bold text-lg">
                    {language === 'it' ? 'Verifica dell\'Età' : 'Age Verification'}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {language === 'it' 
                      ? 'Devi avere almeno 18 anni per accedere ai contenuti relativi al gioco d\'azzardo. Il gioco può causare dipendenza.'
                      : 'You must be at least 18 years old to access gambling-related content. Gambling can be addictive.'
                    }
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center space-x-2"
                >
                  <Shield className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-xs font-medium">
                    {language === 'it' ? 'Gioco Responsabile' : 'Responsible Gaming'}
                  </span>
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pt-2"
                >
                  <Button 
                    onClick={() => setAgeVerified(true)}
                    className="bg-white text-black hover:bg-gray-100 font-medium px-6"
                  >
                    {language === 'it' ? 'Ho almeno 18 anni' : 'I am 18 or older'}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
          
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