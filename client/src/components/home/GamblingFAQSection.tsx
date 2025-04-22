import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "How do I choose a reputable online casino?",
    answer: "Look for licensed casinos regulated by recognized authorities like the Malta Gaming Authority or the UK Gambling Commission. Check for SSL encryption, fair game certifications, positive user reviews, and clear terms and conditions. Betting SRL only partners with fully licensed and regulated Italian casinos."
  },
  {
    question: "What are wagering requirements?",
    answer: "Wagering requirements (also called playthrough requirements) specify how many times you need to bet your bonus amount before you can withdraw any winnings. For example, a 30x wagering requirement on a €10 bonus means you need to place bets totaling €300 before withdrawing associated winnings."
  },
  {
    question: "Are online casinos legal in Italy?",
    answer: "Yes, online gambling is legal in Italy for operators who hold a license from ADM (Agenzia delle Dogane e dei Monopoli), formerly known as AAMS. Licensed casinos must meet strict regulatory requirements to ensure player protection, fair gaming, and responsible gambling practices."
  },
  {
    question: "How do casino bonuses work?",
    answer: "Casino bonuses are promotional offers that give players extra funds or free spins. Welcome bonuses are for new players, while reload bonuses reward existing customers. No-deposit bonuses don't require you to deposit money first. Always read the terms and conditions, as bonuses typically come with wagering requirements and other conditions."
  },
  {
    question: "What payment methods can I use at online casinos?",
    answer: "Most Italian online casinos accept credit/debit cards (Visa, Mastercard), e-wallets (PayPal, Skrill, Neteller), bank transfers, prepaid cards (Paysafecard), and increasingly, cryptocurrencies. The availability of specific payment methods varies by casino, so check the banking section before registering."
  },
  {
    question: "How can I gamble responsibly?",
    answer: "Set strict time and money limits before playing. Only gamble with disposable income, never with money needed for essential expenses. Take regular breaks, don't chase losses, and avoid gambling when under emotional distress. Use responsible gambling tools provided by casinos such as deposit limits, time-outs, and self-exclusion options."
  }
];

export default function GamblingFAQSection() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#222236] mb-3">
            Online Gambling FAQs
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to commonly asked questions about online casinos and gambling in Italy
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Have more questions? <a href="/contact" className="text-primary underline hover:text-primary/80">Contact our team</a>
          </p>
        </div>
      </div>
    </section>
  );
}