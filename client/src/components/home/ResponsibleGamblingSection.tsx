import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Clock, Ban, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ResponsibleGamblingSection() {
  const { t } = useLanguage();
  const responsibleGamblingPrinciples = [
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Set Time Limits",
      description: "Monitor and limit the time you spend gambling online to maintain a healthy balance."
    },
    {
      icon: <Ban className="h-8 w-8 text-primary" />,
      title: "Know When to Stop",
      description: "Set budget limits and never gamble with money you cannot afford to lose."
    },
    {
      icon: <AlertCircle className="h-8 w-8 text-primary" />,
      title: "Recognize Warning Signs",
      description: "Be aware of problematic gambling behaviors and seek help when needed."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Use Protective Tools",
      description: "Utilize deposit limits, self-exclusion, and reality checks offered by casinos."
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
                <h3 className="font-bold text-lg mb-2">{principle.title}</h3>
                <p className="text-sm text-muted-foreground">{principle.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 p-6 bg-[#222236]/5 rounded-lg max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-2">
            If you or someone you know is struggling with gambling addiction, please reach out for help:
          </p>
          <p className="font-medium">
            National Problem Gambling Helpline: <span className="text-primary">1-800-522-4700</span>
          </p>
        </div>
      </div>
    </section>
  );
}