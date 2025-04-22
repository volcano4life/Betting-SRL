import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Clock, Ban, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ResponsibleGamblingSection() {
  const { t } = useLanguage();
  const responsibleGamblingPrinciples = [
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      titleKey: "responsible.principle1.title",
      descriptionKey: "responsible.principle1.description"
    },
    {
      icon: <Ban className="h-8 w-8 text-primary" />,
      titleKey: "responsible.principle2.title",
      descriptionKey: "responsible.principle2.description"
    },
    {
      icon: <AlertCircle className="h-8 w-8 text-primary" />,
      titleKey: "responsible.principle3.title",
      descriptionKey: "responsible.principle3.description"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      titleKey: "responsible.principle4.title",
      descriptionKey: "responsible.principle4.description"
    }
  ];

  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#222236] mb-4">
            {t('responsible.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('responsible.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {responsibleGamblingPrinciples.map((principle, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {principle.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{t(principle.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(principle.descriptionKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 p-6 bg-[#222236]/5 rounded-lg max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {t('responsible.helpMessage')}
          </p>
          <p className="font-medium">
            {t('responsible.helpline')}: <span className="text-primary">{t('responsible.helplineNumber')}</span>
          </p>
        </div>
      </div>
    </section>
  );
}