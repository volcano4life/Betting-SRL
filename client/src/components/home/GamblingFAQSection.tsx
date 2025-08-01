import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

export default function GamblingFAQSection() {
  const { t, language } = useLanguage();
  
  // Define FAQ items for both languages
  const faqItems = language === 'en' ? [
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
  ] : [
    {
      question: "Come scelgo un casinò online affidabile?",
      answer: "Cerca casinò con licenza regolamentati da autorità riconosciute come la Malta Gaming Authority o l'ADM italiana. Verifica la presenza di crittografia SSL, certificazioni di gioco equo, recensioni positive degli utenti e termini e condizioni chiari. Betting SRL collabora solo con casinò italiani completamente autorizzati e regolamentati."
    },
    {
      question: "Cosa sono i requisiti di scommessa?",
      answer: "I requisiti di scommessa (chiamati anche requisiti di playthrough) specificano quante volte devi scommettere l'importo del bonus prima di poter prelevare eventuali vincite. Ad esempio, un requisito di scommessa di 30x su un bonus di €10 significa che devi piazzare scommesse per un totale di €300 prima di prelevare le vincite associate."
    },
    {
      question: "I casinò online sono legali in Italia?",
      answer: "Sì, il gioco d'azzardo online è legale in Italia per gli operatori che detengono una licenza dall'ADM (Agenzia delle Dogane e dei Monopoli), precedentemente nota come AAMS. I casinò autorizzati devono soddisfare rigorosi requisiti normativi per garantire la protezione dei giocatori, il gioco equo e pratiche di gioco responsabile."
    },
    {
      question: "Come funzionano i bonus dei casinò?",
      answer: "I bonus dei casinò sono offerte promozionali che danno ai giocatori fondi extra o giri gratuiti. I bonus di benvenuto sono per i nuovi giocatori, mentre i bonus di ricarica premiano i clienti esistenti. I bonus senza deposito non richiedono di depositare denaro prima. Leggi sempre i termini e le condizioni, poiché i bonus in genere includono requisiti di scommessa e altre condizioni."
    },
    {
      question: "Quali metodi di pagamento posso utilizzare nei casinò online?",
      answer: "La maggior parte dei casinò online italiani accetta carte di credito/debito (Visa, Mastercard), portafogli elettronici (PayPal, Skrill, Neteller), bonifici bancari, carte prepagate (Paysafecard) e, sempre più spesso, criptovalute. La disponibilità di metodi di pagamento specifici varia in base al casinò, quindi controlla la sezione bancaria prima di registrarti."
    },
    {
      question: "Come posso giocare in modo responsabile?",
      answer: "Imposta limiti rigorosi di tempo e denaro prima di giocare. Gioca solo con reddito disponibile, mai con denaro necessario per spese essenziali. Fai pause regolari, non inseguire le perdite ed evita di giocare quando sei in difficoltà emotiva. Utilizza gli strumenti di gioco responsabile forniti dai casinò come limiti di deposito, timeout e opzioni di autoesclusione."
    }
  ];
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#222236] mb-3">
            {t('faq.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('faq.subtitle')}
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


      </div>
    </section>
  );
}