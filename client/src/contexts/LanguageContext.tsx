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
    'nav.promoCodes': 'Promo Codes',
    'nav.guides': 'Guides',
    'nav.language': 'Italiano',

    // Homepage Sections
    'hero.title': 'Find the Best Italian Online Casinos',
    'hero.subtitle': 'Exclusive Bonuses & Expert Reviews',
    'hero.cta': 'Claim Bonus',
    'hero.featuredReview': 'Featured Review',
    'hero.noFeaturedContent': 'No featured content available',
    'hero.noNewsAvailable': 'No news available',
    'hero.new': 'NEW',
    'hero.hot': 'HOT',
    
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
    
    'reviews.title': 'Latest Reviews',
    'reviews.subtitle': 'Expert reviews on the best Italian online casinos',
    'reviews.viewAll': 'View All',
    'reviews.empty': 'No reviews available at the moment',
    'promos.empty': 'No promo codes available',
    'promos.claim': 'Claim Now',
    'promos.viewCasino': 'View Casino',
    'promos.modalTitle': 'Your Exclusive Bonus Code',
    'promos.modalDescription': 'Use this code when registering to claim your bonus',
    'promos.expires': 'Expires',
    'promos.copy': 'Copy Code',
    'promos.copied': 'Copied!',
    'promos.close': 'Close',
    'promos.casino': 'Casino',
    'promos.promoCode': 'Promo Code',
    
    'sports.title': 'Sports Betting Insights',
    'sports.subtitle': 'Expert predictions, odds analysis and betting tips',
    'sports.viewAll': 'View All Articles',
    'sports.empty': 'No sports articles available',
    'sports.readMore': 'Read Full Analysis',
    'sports.hotTip': 'Hot Tip',
    'sports.analysis': 'Analysis',
    
    'responsible.title': 'Responsible Gambling',
    'responsible.description': 'Play responsibly and know your limits. Gambling should be entertaining, not a way to make money.',
    'responsible.principle1.title': 'Set Time Limits',
    'responsible.principle1.description': 'Monitor and limit the time you spend gambling online to maintain a healthy balance.',
    'responsible.principle2.title': 'Know When to Stop',
    'responsible.principle2.description': 'Set budget limits and never gamble with money you cannot afford to lose.',
    'responsible.principle3.title': 'Recognize Warning Signs',
    'responsible.principle3.description': 'Be aware of problematic gambling behaviors and seek help when needed.',
    'responsible.principle4.title': 'Use Protective Tools',
    'responsible.principle4.description': 'Utilize deposit limits, self-exclusion, and reality checks offered by casinos.',
    'responsible.helpMessage': 'If you or someone you know is struggling with gambling addiction, please reach out for help:',
    'responsible.helpline': 'National Problem Gambling Helpline',
    'responsible.helplineNumber': '1-800-522-4700',
    
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
    'footer.copyright': '© {year} Betting SRL. All rights reserved. All trademarks are property of their respective owners.',
    'footer.disclaimer': 'Gambling involves risk. Please gamble responsibly.',
    'footer.tagline': 'Your trusted source for Italian casino reviews, exclusive promo codes, and sports betting insights.',
    'footer.casinoGames': 'Casino Games',
    'footer.promotions': 'Promotions',
    'footer.company': 'Company',
    
    // Footer casino links
    'footer.casino.slotmachines': 'Slot Machines',
    'footer.casino.roulette': 'Roulette',
    'footer.casino.blackjack': 'Blackjack', 
    'footer.casino.poker': 'Poker',
    'footer.casino.baccarat': 'Baccarat',
    'footer.casino.livecasino': 'Live Casino',
    'footer.casino.bingo': 'Bingo',
    
    // Footer promo links
    'footer.promos.welcomebonuses': 'Welcome Bonuses',
    'footer.promos.nodeposit': 'No Deposit',
    'footer.promos.freespins': 'Free Spins',
    'footer.promos.cashback': 'Cashback',
    'footer.promos.loyaltyprograms': 'Loyalty Programs',
    
    // Footer company links
    'footer.links.aboutus': 'About Us',
    'footer.links.ourteam': 'Our Team',
    'footer.links.careers': 'Careers',
    'footer.links.contactus': 'Contact Us',
    'footer.links.privacypolicy': 'Privacy Policy',
    'footer.links.termsofservice': 'Terms of Service',
    
    // Promo code section
    'promos.defaultSummary': 'Exclusive welcome bonus with free spins and deposit match',
    'promos.defaultCode': 'WELCOME100'
  },
  it: {
    // Navigation
    'nav.home': 'Home',
    'nav.casinos': 'Casinò',
    'nav.slots': 'Slot',
    'nav.liveCasino': 'Casinò Live',
    'nav.sportsBetting': 'Scommesse Sportive',
    'nav.promotions': 'Promozioni',
    'nav.promoCodes': 'Codici Promo',
    'nav.guides': 'Guide',
    'nav.language': 'English',

    // Homepage Sections
    'hero.title': 'Trova i Migliori Casinò Online Italiani',
    'hero.subtitle': 'Bonus Esclusivi & Recensioni di Esperti',
    'hero.cta': 'Ottieni Bonus',
    'hero.featuredReview': 'Recensione in Evidenza',
    'hero.noFeaturedContent': 'Nessun contenuto in evidenza disponibile',
    'hero.noNewsAvailable': 'Nessuna notizia disponibile',
    'hero.new': 'NUOVO',
    'hero.hot': 'CALDO',
    
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
    
    'reviews.title': 'Ultime Recensioni',
    'reviews.subtitle': 'Recensioni di esperti sui migliori casinò online italiani',
    'reviews.viewAll': 'Vedi Tutte',
    'reviews.empty': 'Nessuna recensione disponibile al momento',
    'promos.empty': 'Nessun codice promo disponibile',
    'promos.claim': 'Ottieni Ora',
    'promos.viewCasino': 'Vedi Casinò',
    'promos.modalTitle': 'Il Tuo Codice Bonus Esclusivo',
    'promos.modalDescription': 'Utilizza questo codice durante la registrazione per ottenere il tuo bonus',
    'promos.expires': 'Scade il',
    'promos.copy': 'Copia Codice',
    'promos.copied': 'Copiato!',
    'promos.close': 'Chiudi',
    'promos.casino': 'Casinò',
    'promos.promoCode': 'Codice Promo',
    
    'sports.title': 'Approfondimenti Scommesse Sportive',
    'sports.subtitle': 'Previsioni di esperti, analisi delle quote e consigli per le scommesse',
    'sports.viewAll': 'Vedi Tutti gli Articoli',
    'sports.empty': 'Nessun articolo sportivo disponibile',
    'sports.readMore': 'Leggi Analisi Completa',
    'sports.hotTip': 'Suggerimento Caldo',
    'sports.analysis': 'Analisi',
    
    'responsible.title': 'Gioco Responsabile',
    'responsible.description': 'Gioca responsabilmente e conosci i tuoi limiti. Il gioco dovrebbe essere un divertimento, non un modo per fare soldi.',
    'responsible.principle1.title': 'Imposta Limiti di Tempo',
    'responsible.principle1.description': 'Monitora e limita il tempo che trascorri giocando online per mantenere un sano equilibrio.',
    'responsible.principle2.title': 'Sapere Quando Fermarsi',
    'responsible.principle2.description': 'Imposta limiti di budget e non giocare mai con denaro che non puoi permetterti di perdere.',
    'responsible.principle3.title': 'Riconosci i Segnali d\'Allarme',
    'responsible.principle3.description': 'Sii consapevole dei comportamenti problematici di gioco e chiedi aiuto quando necessario.',
    'responsible.principle4.title': 'Usa Strumenti Protettivi',
    'responsible.principle4.description': 'Utilizza limiti di deposito, auto-esclusione e controlli di realtà offerti dai casinò.',
    'responsible.helpMessage': 'Se tu o qualcuno che conosci sta lottando con la dipendenza dal gioco, per favore cerca aiuto:',
    'responsible.helpline': 'Telefono Verde Nazionale per le Problematiche Legate al Gioco d\'Azzardo',
    'responsible.helplineNumber': '800 558 822',
    
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
    'footer.copyright': '© {year} Betting SRL. Tutti i diritti riservati. Tutti i marchi sono di proprietà dei rispettivi proprietari.',
    'footer.disclaimer': 'Il gioco comporta rischi. Gioca responsabilmente.',
    'footer.tagline': 'La tua fonte affidabile per recensioni di casinò italiani, codici promozionali esclusivi e approfondimenti sulle scommesse sportive.',
    'footer.casinoGames': 'Giochi da Casinò',
    'footer.promotions': 'Promozioni',
    'footer.company': 'Azienda',
    
    // Footer casino links
    'footer.casino.slotmachines': 'Slot Machine',
    'footer.casino.roulette': 'Roulette',
    'footer.casino.blackjack': 'Blackjack', 
    'footer.casino.poker': 'Poker',
    'footer.casino.baccarat': 'Baccarat',
    'footer.casino.livecasino': 'Casinò Live',
    'footer.casino.bingo': 'Bingo',
    
    // Footer promo links
    'footer.promos.welcomebonuses': 'Bonus di Benvenuto',
    'footer.promos.nodeposit': 'Senza Deposito',
    'footer.promos.freespins': 'Giri Gratuiti',
    'footer.promos.cashback': 'Cashback',
    'footer.promos.loyaltyprograms': 'Programmi Fedeltà',
    
    // Footer company links
    'footer.links.aboutus': 'Chi Siamo',
    'footer.links.ourteam': 'Il Nostro Team',
    'footer.links.careers': 'Lavora con Noi',
    'footer.links.contactus': 'Contattaci',
    'footer.links.privacypolicy': 'Privacy Policy',
    'footer.links.termsofservice': 'Termini di Servizio',
    
    // Promo code section
    'promos.defaultSummary': 'Bonus di benvenuto esclusivo con giri gratuiti e match sul deposito',
    'promos.defaultCode': 'BENVENUTO100'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('it');

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