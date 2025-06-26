import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import CasinoCard from "@/components/common/CasinoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Game } from "@shared/schema";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CasinosPage() {
  const { t, getLocalizedField } = useLanguage();
  
  const { data: casinos, isLoading } = useQuery<Game[]>({
    queryKey: ['/api/games'],
  });

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('casinos.pageTitle')} | Betting SRL</title>
        <meta name="description" content={t('casinos.pageDescription')} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">{t('casinos.title')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('casinos.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {isLoading ? (
            Array(8).fill(0).map((_, index) => (
              <motion.div 
                key={index} 
                variants={cardVariants}
                className="flex flex-col space-y-4"
              >
                <Skeleton className="w-full h-48 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="w-3/4 h-5 rounded" />
                  <Skeleton className="w-1/2 h-4 rounded" />
                </div>
              </motion.div>
            ))
          ) : casinos && casinos.length > 0 ? (
            casinos.map((casino, index) => (
              <motion.div
                key={casino.id}
                variants={cardVariants}
              >
                <CasinoCard
                  id={casino.id}
                  title={getLocalizedField(casino, 'title')}
                  slug={casino.slug}
                  logo={casino.coverImage}
                  rating={casino.overallRating || 8.5}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">{t('casinos.noCasinos')}</p>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}