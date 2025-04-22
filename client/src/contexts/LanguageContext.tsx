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
    'featured.viewAll': 'View All Casinos',
    
    'promos.title': 'Exclusive Promo Codes',
    'promos.viewAll': 'View All Promotions',
    
    'sports.title': 'Sports Betting',
    'sports.viewAll': 'View All Odds',
    
    'responsible.title': 'Responsible Gambling',
    'responsible.description': 'Play responsibly and know your limits. Gambling should be entertaining, not a way to make money.',
    
    'faq.title': 'Frequently Asked Questions',
    
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
    'featured.viewAll': 'Vedi Tutti i Casinò',
    
    'promos.title': 'Codici Promo Esclusivi',
    'promos.viewAll': 'Vedi Tutte le Promozioni',
    
    'sports.title': 'Scommesse Sportive',
    'sports.viewAll': 'Vedi Tutte le Quote',
    
    'responsible.title': 'Gioco Responsabile',
    'responsible.description': 'Gioca responsabilmente e conosci i tuoi limiti. Il gioco dovrebbe essere un divertimento, non un modo per fare soldi.',
    
    'faq.title': 'Domande Frequenti',
    
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