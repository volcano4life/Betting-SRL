import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from '@/components/ui/button';

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
      <div className="flex justify-center items-center p-6">
        <div className="w-8 h-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!outlets || outlets.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-secondary/10">
      <div className="container">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">
            {language === 'it' ? 'Scopri I nostri punti vendita' : 'Check out our betting outlets'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'it' 
              ? 'Visita uno dei nostri punti vendita per un\'esperienza di scommesse premium' 
              : 'Visit one of our outlets for a premium betting experience'}
          </p>
        </div>
        
        <Carousel className="w-full">
          <CarouselContent>
            {outlets.map((outlet) => (
              <CarouselItem key={outlet.id} className="md:basis-1/2 lg:basis-1/3">
                <AnimatedWrapper
                  type="fade-in-up" 
                  duration={0.5} 
                  delay={0.1}
                  className="h-full"
                >
                  <Card className="h-full overflow-hidden border shadow-md bg-card hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={outlet.imageUrl} 
                        alt={getLocalizedField(outlet, 'title')} 
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-xl font-bold mb-2">
                        {getLocalizedField(outlet, 'title')}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {getLocalizedField(outlet, 'description')}
                      </p>
                      
                      <Button variant="outline" className="w-full">
                        {language === 'it' ? 'Maggiori informazioni' : 'More information'}
                      </Button>
                    </CardContent>
                  </Card>
                </AnimatedWrapper>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
    </section>
  );
}