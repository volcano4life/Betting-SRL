import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import AnimatedWrapper from '@/components/ui/animated-wrapper';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface Outlet {
  id: number;
  title_en: string;
  title_it: string;
  description_en: string | null;
  description_it: string | null;
  imageUrl: string;
  order: number | null;
  isActive: boolean;
  createdAt: Date;
}

export function OutletSlideshow() {
  const { language, t, getLocalizedField } = useLanguage();
  
  const { data: outlets, isLoading } = useQuery<Outlet[]>({
    queryKey: ['/api/outlets'],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-2">
        <div className="w-8 h-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!outlets || outlets.length === 0) {
    return null;
  }

  return (
    <section className="py-2 bg-gradient-to-r from-[#2a293e] to-[#222236] border-b border-gray-800">
      <div className="container px-2">
        <div className="mb-3 pt-2 text-center">
          <h2 className="text-xl font-bold text-white">
            {language === 'it' ? 'Scopri I nostri punti vendita' : 'Check out our betting outlets'}
          </h2>
        </div>
        <Carousel className="w-full" opts={{ loop: true, align: "start", dragFree: true }}>
          <CarouselContent>
            {outlets.map((outlet) => (
              <CarouselItem key={outlet.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-1 pr-1">
                <AnimatedWrapper
                  animation="fade" 
                  duration={0.5} 
                  delay={0.1}
                >
                  <div className="relative overflow-hidden rounded-md group h-20 sm:h-24 md:h-32">
                    <img 
                      src={outlet.imageUrl} 
                      alt={getLocalizedField(outlet, 'title')} 
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                      <p className="text-white text-sm font-medium truncate">
                        {getLocalizedField(outlet, 'title')}
                      </p>
                    </div>
                  </div>
                </AnimatedWrapper>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-3 h-8 w-8 bg-[#222236]/80 border-accent/20 text-white hover:bg-accent/20 hover:text-white" />
          <CarouselNext className="-right-3 h-8 w-8 bg-[#222236]/80 border-accent/20 text-white hover:bg-accent/20 hover:text-white" />
        </Carousel>
      </div>
    </section>
  );
}