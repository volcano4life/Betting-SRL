import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'it';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translations object
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.casinos': 'Casinos',
    'nav.slots': 'Slots',
    'nav.liveCasino': 'Live Casino',
    'nav.sportsBetting': 'Sports Betting',
    'nav.promotions': 'Promotions',
    'nav.guides': 'Guides',
    'nav.language': 'Italiano',

    // Homepage Sections
    'hero.title': 'Find the Best Italian Online Casinos',
    'hero.subtitle': 'Exclusive Bonuses & Expert Reviews',
    'hero.cta': 'Claim Bonus',
    
    'featured.title': 'Top Rated Casinos',
    'featured.subtitle': 'Exclusive bonus offers from our top-rated partners',
    'featured.viewAll': 'View All Casinos',
    'featured.empty': 'No featured casinos available',
    'featured.recommended': 'RECOMMENDED',
    'featured.validUntil': 'Valid until',
    'featured.limitedTimeOffer': 'Limited Time Offer',
    'featured.showPromoCode': 'Show Promo Code',
    'featured.visitCasino': 'Visit Casino',
    
    'promos.title': 'Exclusive Promo Codes',
    'promos.subtitle': 'Special bonuses only available through Betting SRL',
    'promos.viewAll': 'View All Promotions',
    'promos.empty': 'No promo codes available',
    'promos.claim': 'Claim Now',
    'promos.viewCasino': 'View Casino',
    'promos.modalTitle': 'Your Exclusive Bonus Code',
    'promos.modalDescription': 'Use this code when registering to claim your bonus',
    'promos.expires': 'Expires',
    'promos.copy': 'Copy Code',
    'promos.copied': 'Copied!',
    
    'sports.title': 'Sports Betting Insights',
    'sports.subtitle': 'Expert predictions, odds analysis and betting tips',
    'sports.viewAll': 'View All Articles',
    'sports.empty': 'No sports articles available',
    'sports.readMore': 'Read Full Analysis',
    'sports.hotTip': 'Hot Tip',
    'sports.analysis': 'Analysis',
    
    'responsible.title': 'Responsible Gambling',
    'responsible.description': 'Play responsibly and know your limits. Gambling should be entertaining, not a way to make money.',
    
    'faq.title': 'Online Gambling FAQs',
    'faq.subtitle': 'Find answers to commonly asked questions about online casinos and gambling in Italy',
    'faq.moreQuestions': 'Have more questions?',
    'faq.contactTeam': 'Contact our team',
    
    'newsletter.title': 'Get Exclusive Casino Offers',
    'newsletter.subtitle': 'Subscribe to our newsletter for the latest bonuses and promotions',
    'newsletter.placeholder': 'Your email address',
    'newsletter.button': 'Subscribe',
    
    // Footer
    'footer.about': 'About Us',
    'footer.terms': 'Terms & Conditions',
    'footer.privacy': 'Privacy Policy',
    'footer.contact': 'Contact Us',
    'footer.copyright': '© 2023 Betting SRL. All rights reserved.',
    'footer.disclaimer': 'Gambling involves risk. Please gamble responsibly.'
  },
  it: {
    // Navigation
    'nav.home': 'Home',
    'nav.casinos': 'Casinò',
    'nav.slots': 'Slot',
    'nav.liveCasino': 'Casinò Live',
    'nav.sportsBetting': 'Scommesse Sportive',
    'nav.promotions': 'Promozioni',
    'nav.guides': 'Guide',
    'nav.language': 'English',

    // Homepage Sections
    'hero.title': 'Trova i Migliori Casinò Online Italiani',
    'hero.subtitle': 'Bonus Esclusivi & Recensioni di Esperti',
    'hero.cta': 'Ottieni Bonus',
    
    'featured.title': 'Casinò Più Votati',
    'featured.subtitle': 'Offerte bonus esclusive dai nostri partner migliori',
    'featured.viewAll': 'Vedi Tutti i Casinò',
    'featured.empty': 'Nessun casinò in evidenza disponibile',
    'featured.recommended': 'CONSIGLIATO',
    'featured.validUntil': 'Valido fino al',
    'featured.limitedTimeOffer': 'Offerta a Tempo Limitato',
    'featured.showPromoCode': 'Mostra Codice Promo',
    'featured.visitCasino': 'Visita il Casinò',
    
    'promos.title': 'Codici Promo Esclusivi',
    'promos.subtitle': 'Bonus speciali disponibili solo tramite Betting SRL',
    'promos.viewAll': 'Vedi Tutte le Promozioni',
    'promos.empty': 'Nessun codice promo disponibile',
    'promos.claim': 'Ottieni Ora',
    'promos.viewCasino': 'Vedi Casinò',
    'promos.modalTitle': 'Il Tuo Codice Bonus Esclusivo',
    'promos.modalDescription': 'Utilizza questo codice durante la registrazione per ottenere il tuo bonus',
    'promos.expires': 'Scade il',
    'promos.copy': 'Copia Codice',
    'promos.copied': 'Copiato!',
    
    'sports.title': 'Approfondimenti Scommesse Sportive',
    'sports.subtitle': 'Previsioni di esperti, analisi delle quote e consigli per le scommesse',
    'sports.viewAll': 'Vedi Tutti gli Articoli',
    'sports.empty': 'Nessun articolo sportivo disponibile',
    'sports.readMore': 'Leggi Analisi Completa',
    'sports.hotTip': 'Suggerimento Caldo',
    'sports.analysis': 'Analisi',
    
    'responsible.title': 'Gioco Responsabile',
    'responsible.description': 'Gioca responsabilmente e conosci i tuoi limiti. Il gioco dovrebbe essere un divertimento, non un modo per fare soldi.',
    
    'faq.title': 'FAQ sul Gioco d\'Azzardo Online',
    'faq.subtitle': 'Trova risposte alle domande più frequenti sui casinò online e il gioco d\'azzardo in Italia',
    'faq.moreQuestions': 'Hai altre domande?',
    'faq.contactTeam': 'Contatta il nostro team',
    
    'newsletter.title': 'Ottieni Offerte Esclusive dei Casinò',
    'newsletter.subtitle': 'Iscriviti alla nostra newsletter per gli ultimi bonus e promozioni',
    'newsletter.placeholder': 'Il tuo indirizzo email',
    'newsletter.button': 'Iscriviti',
    
    // Footer
    'footer.about': 'Chi Siamo',
    'footer.terms': 'Termini & Condizioni',
    'footer.privacy': 'Privacy Policy',
    'footer.contact': 'Contattaci',
    'footer.copyright': '© 2023 Betting SRL. Tutti i diritti riservati.',
    'footer.disclaimer': 'Il gioco comporta rischi. Gioca responsabilmente.'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Function to get translation for a key
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};