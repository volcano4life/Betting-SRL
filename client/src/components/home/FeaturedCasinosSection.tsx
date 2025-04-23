import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CasinoCard from "../common/CasinoCard";
import { Game } from "@shared/schema"; // We're temporarily using Game until we update schema.ts
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function FeaturedCasinosSection() {
  const { t, getLocalizedField } = useLanguage();
  const { data: featuredCasinos, isLoading } = useQuery<Game[]>({
    queryKey: ['/api/games/top-rated'],
  });
  
  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
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
    <motion.section 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
      className="py-12 md:py-16"
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex justify-between items-center mb-8"
          variants={headerVariants}
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#222236]">
              {t('featured.title')}
            </h2>
            <p className="text-gray-500 mt-2">
              {t('featured.subtitle')}
            </p>
          </div>
          <Link href="/casinos">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="hidden md:inline-flex">
                {t('featured.viewAll')}
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={sectionVariants}
        >
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <motion.div 
                key={index} 
                className="flex flex-col space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Skeleton className="w-full h-48 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="w-3/4 h-5 rounded" />
                  <Skeleton className="w-1/2 h-4 rounded" />
                </div>
              </motion.div>
            ))
          ) : featuredCasinos && featuredCasinos.length > 0 ? (
            featuredCasinos.slice(0, 3).map((casino, index) => (
              <motion.div
                key={casino.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
              >
                <CasinoCard
                  id={casino.id}
                  title={getLocalizedField(casino, 'title')}
                  slug={casino.slug}
                  logo={casino.coverImage}
                  rating={casino.overallRating || 8.5}
                  bonus="Welcome Bonus: 100% up to €500 + 200 Free Spins"
                  promoCode="BTMAX100"
                  validUntil={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 days from now
                  featured={casino.id === featuredCasinos[0].id}
                />
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="col-span-3 text-center py-12"
              variants={headerVariants}
            >
              <p className="text-gray-500">{t('featured.empty')}</p>
            </motion.div>
          )}
        </motion.div>

        <motion.div 
          className="mt-8 text-center md:hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/casinos">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline">{t('featured.viewAll')}</Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}