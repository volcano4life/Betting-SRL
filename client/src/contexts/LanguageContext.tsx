import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Language = 'en' | 'it';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  tHtml: (key: string) => React.ReactNode;
  getLocalizedField: <T extends Record<string, any>>(item: T, fieldName: string) => string;
  translateCategory: (category: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translations object
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Auth and Admin
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.welcomeBack': 'Welcome Back',
    'auth.loginDesc': 'Sign in to access your account',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.usernamePlaceholder': 'Enter your username',
    'auth.passwordPlaceholder': 'Enter your password',
    'auth.loginButton': 'Login',
    'auth.createAccount': 'Create an Account',
    'auth.registerDesc': 'Fill in the form to create your account',
    'auth.confirmPassword': 'Confirm Password',
    'auth.confirmPasswordPlaceholder': 'Confirm your password',
    'auth.registerButton': 'Register',
    'auth.heroTitle': 'Welcome to <span translate="no">Betting SRL</span>',
    'auth.heroDescription': 'Your trusted source for Italian casino reviews, exclusive promo codes, and sports betting insights.',
    'auth.feature1Title': 'Exclusive Bonuses',
    'auth.feature1Desc': 'Get access to special promotions and bonus codes not available anywhere else.',
    'auth.feature2Title': 'Expert Reviews',
    'auth.feature2Desc': 'Trust our detailed reviews of the best Italian online casinos and betting sites.',
    
    'admin.title': 'Admin Dashboard',
    'admin.backToSite': 'Back to Site',
    'admin.logout': 'Logout',
    'admin.promoCodes': 'Promo Codes',
    'admin.games': 'Games',
    'admin.reviews': 'Reviews',
    'admin.news': 'News',
    'admin.guides': 'Guides',
    'admin.administrators': 'Administrators',
    'admin.addNew': 'Add New',
    'admin.promoCodesDesc': 'Manage casino promotion codes',
    'admin.gamesDesc': 'Manage casino games and descriptions',
    'admin.reviewsDesc': 'Manage casino reviews',
    'admin.newsDesc': 'Manage news articles',
    'admin.guidesDesc': 'Manage betting guides',
    'admin.promoCodeCasino': 'Casino',
    'admin.promoCode': 'Promo Code',
    'admin.validUntil': 'Valid Until',
    'admin.actions': 'Actions',
    'admin.edit': 'Edit',
    'admin.delete': 'Delete',
    
    // Cookies
    'cookies.title': 'Cookie Policy',
    'cookies.description': 'We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.',
    'cookies.accept': 'Accept All',
    'cookies.reject': 'Reject All',
    'cookies.settings': 'Cookie Settings',
    'admin.confirmDeleteTitle': 'Confirm Deletion',
    'admin.confirmDeletePromoCode': 'Are you sure you want to delete this promo code? This action cannot be undone.',
    'admin.cancel': 'Cancel',
    'admin.confirmDelete': 'Yes, Delete',
    'admin.noPromoCodes': 'No promo codes found',
    'admin.editPromoCode': 'Edit Promo Code',
    'admin.addPromoCode': 'Add New Promo Code',
    'admin.promoCodeFormDesc': 'Enter promo code details in both English and Italian',
    'admin.englishContent': 'English Content',
    'admin.italianContent': 'Italian Content',
    'admin.casinoName': 'Casino Name',
    'admin.description': 'Description',
    'admin.bonus': 'Bonus',
    'admin.commonFields': 'Common Fields',
    'admin.featured': 'Featured Status',
    'admin.selectFeatured': 'Select featured status',
    'admin.notFeatured': 'Not Featured',
    'admin.featuredLevel1': 'Featured (Priority 1)',
    'admin.featuredLevel2': 'Featured (Priority 2)',
    'admin.logoUrl': 'Logo URL',
    'admin.affiliateLink': 'Affiliate Link',
    'admin.save': 'Save',
    'admin.back': 'Back',
    'admin.implementationPending': 'Full implementation coming soon',
    'admin.editGame': 'Edit Game',
    'admin.addGame': 'Add New Game',
    'admin.gameFormDesc': 'Enter game details in both English and Italian',
    'admin.editReview': 'Edit Review',
    'admin.addReview': 'Add New Review',
    'admin.reviewFormDesc': 'Enter review details in both English and Italian',
    'admin.editNews': 'Edit News',
    'admin.addNews': 'Add New News',
    'admin.newsFormDesc': 'Enter news details in both English and Italian',
    'admin.editGuide': 'Edit Guide',
    'admin.addGuide': 'Add New Guide',
    'admin.guideFormDesc': 'Enter guide details in both English and Italian',
    'admin.promoCodeLoadError': 'Failed to load promo codes',
    'admin.gamesLoadError': 'Failed to load games',
    'admin.reviewsLoadError': 'Failed to load reviews',
    'admin.newsLoadError': 'Failed to load news',
    'admin.guidesLoadError': 'Failed to load guides',
    'admin.administratorsLoadError': 'Failed to load administrators',
    'admin.administratorsDesc': 'Manage website administrators',
    'admin.inviteAdmin': 'Invite Administrator',
    'admin.siteOwner': 'Site Owner',
    'admin.admin': 'Administrator',
    'admin.superAdmin': 'Super Administrator',
    'admin.username': 'Username',
    'admin.administratorName': 'Administrator',
    'admin.role': 'Role',
    'admin.status': 'Status',
    'admin.active': 'Active',
    'admin.blocked': 'Blocked',
    'admin.createdAt': 'Created At',
    'admin.approvalPending': 'Approval Pending',
    'admin.pendingApproval': 'Pending Approval',
    'admin.approve': 'Approve',
    'admin.block': 'Block',
    'admin.unblock': 'Unblock',
    'admin.noAdministrators': 'No administrators found',
    'admin.statusUpdatedTitle': 'Status Updated',
    'admin.statusUpdatedDesc': 'User status has been updated',
    'admin.adminApprovedTitle': 'Admin Approved',
    'admin.adminApprovedDesc': 'The administrator has been approved',
    'admin.tryAgainLater': 'Please try again later',
    'admin.editAdminDesc': 'Edit administrator details',
    'admin.selectRole': 'Select role',
    'admin.rolePromptTitle': 'Assign Administrator Role',
    'admin.rolePromptDesc': 'Select a role for this user',
    'admin.transferOwnership': 'Transfer Ownership',
    'admin.transferOwnershipTitle': 'Transfer Site Ownership',
    'admin.transferOwnershipDesc': 'Are you sure you want to transfer site ownership to this user? This will give them full control over the site.',
    'admin.transferOwnershipConfirm': 'Yes, Transfer Ownership',
    'admin.transferOwnershipPending': 'Transfer pending',
    'admin.transferOwnershipTimer': 'Transfer in {hours}h {minutes}m',
    'admin.cancelTransfer': 'Cancel Transfer',
    'admin.transferCancelled': 'Ownership transfer cancelled',
    'admin.transferCompleted': 'Ownership transfer completed',
    'admin.editAdmin': 'Edit Administrator',
    'admin.adminInvitedTitle': 'Administrator Invited',
    'admin.adminInvitedDesc': 'The invitation has been sent successfully',
    'admin.adminInviteErrorTitle': 'Invite Error',
    'admin.passwordRequirements': 'Password must be at least 8 characters',
    'admin.initialPassword': 'Initial Password',
    'admin.inviteAdminDesc': 'Invite a new administrator to the site',
    'admin.sendInvite': 'Send Invite',
    'admin.email': 'Email',
    'admin.emailOptional': 'Optional',
    'admin.emailDescription': 'Email address for sending invitation notifications',
    'admin.selectRoleTitle': 'Select Administrator Role',
    'admin.selectRoleDescription': 'Choose the role for this administrator',
    'admin.regularAdmin': 'Regular Administrator',
    'admin.regularAdminDescription': 'Can manage content but cannot modify other administrators.',
    'admin.superAdminDescription': 'Can manage content and has additional permissions.',
    'admin.pendingTransfer': 'Pending Transfer',
    'admin.transferWarningTitle': 'Important Notice',
    'admin.transferWarningDesc': 'This action cannot be undone after the 24-hour cancellation period.',
    'admin.transferTimerExplanation': 'A 24-hour cancellation period will begin, during which you can still cancel the transfer.',
    'admin.initiateTransfer': 'Initiate Transfer',
    'admin.transferInProgress': 'Ownership transfer in progress',
    'admin.promoCodeDeletedTitle': 'Promo Code Deleted',
    'admin.promoCodeDeletedDesc': 'The promo code has been deleted successfully',
    'admin.promoCodeDeleteErrorTitle': 'Delete Error',
    'admin.savingErrorTitle': 'Error',
    'admin.promoCodeUpdatedTitle': 'Promo Code Updated',
    'admin.promoCodeUpdatedDesc': 'The promo code has been updated successfully',
    'admin.promoCodeCreatedTitle': 'Promo Code Created',
    'admin.promoCodeCreatedDesc': 'The promo code has been created successfully',
    
    // Page titles
    'home.title': 'Best Italian Online Casinos & Sports Betting',
    
    // Additional admin table headers and form fields
    'admin.confirmDeleteGame': 'Are you sure you want to delete this game? This action cannot be undone.',
    'admin.confirmDeleteReview': 'Are you sure you want to delete this review? This action cannot be undone.',
    'admin.confirmDeleteNews': 'Are you sure you want to delete this news item? This action cannot be undone.',
    'admin.confirmDeleteGuide': 'Are you sure you want to delete this guide? This action cannot be undone.',
    'admin.noGames': 'No games found',
    'admin.noReviews': 'No reviews found',
    'admin.noNews': 'No news found',
    'admin.noGuides': 'No guides found',
    'admin.titleColumn': 'Title',
    'admin.publishDate': 'Publish Date',
    'admin.category': 'Category',
    'admin.summary': 'Summary',
    'admin.content': 'Content',
    'admin.slug': 'URL Slug',
    'admin.gameId': 'Game',
    'admin.rating': 'Rating',
    'admin.difficulty': 'Difficulty Level',
    'admin.difficulty.beginner': 'Beginner',
    'admin.difficulty.intermediate': 'Intermediate',
    'admin.difficulty.advanced': 'Advanced',
    'admin.difficulty.expert': 'Expert',
    'admin.gameUpdatedTitle': 'Game Updated',
    'admin.gameUpdatedDesc': 'The game has been updated successfully',
    'admin.gameCreatedTitle': 'Game Created',
    'admin.gameCreatedDesc': 'The game has been created successfully',
    'admin.reviewUpdatedTitle': 'Review Updated',
    'admin.reviewUpdatedDesc': 'The review has been updated successfully',
    'admin.reviewCreatedTitle': 'Review Created',
    'admin.reviewCreatedDesc': 'The review has been created successfully',
    'admin.newsUpdatedTitle': 'News Updated',
    'admin.newsUpdatedDesc': 'The news has been updated successfully',
    'admin.newsCreatedTitle': 'News Created',
    'admin.newsCreatedDesc': 'The news has been created successfully',
    'admin.guideUpdatedTitle': 'Guide Updated',
    'admin.guideUpdatedDesc': 'The guide has been updated successfully',
    'admin.guideCreatedTitle': 'Guide Created',
    'admin.guideCreatedDesc': 'The guide has been created successfully',
    'admin.error': 'Error',
    'admin.itemNotFound': 'Item Not Found',
    'admin.itemNotFoundDesc': 'The requested item could not be found.',
    'admin.saving': 'Saving...',
    'admin.loading': 'Loading...',
    'admin.coverImage': 'Cover Image',
    'admin.releaseDate': 'Release Date',
    'admin.graphicsRating': 'Graphics Rating',
    'admin.gameplayRating': 'Gameplay Rating',
    'admin.storyRating': 'Story Rating',
    'admin.valueRating': 'Value Rating',
    'admin.overallRating': 'Overall Rating',
    'admin.ratingOutOf': '{rating}/10',
    'admin.featuredGame': 'Featured Game',
    'admin.casinoLogo': 'Casino Logo',
    'admin.platforms': 'Platforms',
    'admin.developer': 'Developer',
    'admin.publisher': 'Publisher',
    'admin.genre': 'Genre',

    // Navigation
    'nav.home': 'Home',
    'nav.outlets': 'Outlets',
    'nav.dealers': 'Dealers',
    'nav.bonuses': 'Bonuses',
    'nav.news': 'News',
    'nav.aboutUs': 'About Us',
    'nav.language': 'Italiano',
    'nav.adminPanel': 'Admin Panel',
    'nav.changePassword': 'Change Password',
    'nav.logout': 'Logout',
    
    // Search
    'search.title': 'Search',
    'search.placeholder': 'Search casinos, bonuses, sports news...',
    'search.button': 'Search',
    'search.loading': 'Searching...',
    'search.error': 'Error during search',
    'search.resultsFound': 'results found for',
    'search.noResults': 'No results found for',
    'search.all': 'All',
    'search.games': 'Games',
    'search.reviews': 'Reviews',
    'search.news': 'News',
    'search.guides': 'Guides',
    


    // About Us Page
    'aboutUs.title': 'About Us',
    'aboutUs.subtitle': 'Learn more about Betting SRL and our commitment to providing exceptional gaming experiences.',
    'aboutUs.description': 'Discover Betting SRL - your trusted partner for sports betting and gaming in Italy.',
    'aboutUs.ourStory': 'Our Story',
    'aboutUs.storyText1': 'Betting SRL has been a cornerstone of the Italian gaming industry, providing reliable and exciting betting experiences across multiple locations in the Campania region.',
    'aboutUs.storyText2': 'Our journey began with a simple mission: to create welcoming spaces where gaming enthusiasts can enjoy their passion in a safe, regulated environment.',
    'aboutUs.ourMission': 'Our Mission',
    'aboutUs.missionText1': 'We are dedicated to offering the highest quality gaming and betting services while maintaining the strictest standards of responsible gaming.',
    'aboutUs.missionText2': 'Our team of experienced professionals ensures every visitor receives personalized attention and expert guidance.',
    'aboutUs.ourOutlets': 'Our Locations',
    'aboutUs.contactUs': 'Contact Information',
    'aboutUs.companyInfo': 'Company Information',
    'aboutUs.legalNotice': 'Licensed and regulated gaming operator in Italy',
    'aboutUs.responsibleGaming': 'Responsible Gaming',
    'aboutUs.responsibleGamingText': 'We are committed to promoting responsible gaming and providing support for those who need it.',

    // Homepage Sections
    'hero.title': 'Find your favorite gaming concessionaire',
    'hero.subtitle': 'Exclusive Bonus',
    'hero.cta': 'Claim Bonus',
    'hero.featuredReview': 'Featured Review',
    'hero.noFeaturedContent': 'No featured content available',
    'hero.noNewsAvailable': 'No news available',
    'hero.new': 'NEW',
    'hero.hot': 'HOT',
    'hero.featuredReviewSummary': 'Play at one of the top Italian online casinos with an exclusive welcome bonus and a massive selection of slots and live games.',
    'hero.news1Title': 'Italian Gambling Authority Announces New Regulation Changes',
    'hero.news2Title': 'Top Sports Betting Trends for Football Season 2025',
    
    'featured.title': 'Comparison of Bonuses from Our Partner Bookmakers',
    'featured.subtitle': 'Exclusive bonus offers from our top-rated partners',
    'featured.viewAll': 'View All Casinos',
    'featured.empty': 'No featured casinos available',
    'featured.recommended': 'RECOMMENDED',
    'featured.validUntil': 'Valid until',
    'featured.limitedTimeOffer': 'Limited Time Offer',
    'featured.showPromoCode': 'Show Promo Code',
    'featured.visitCasino': 'Visit Site',
    'featured.welcomeBonus': 'Welcome Bonus: Please see terms and conditions',
    
    'promos.title': 'Exclusive Promo Codes',
    'promos.subtitle': 'Special bonuses only available through <span translate="no">Betting SRL</span>',
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
    'promos.viewCode': 'View Code',
    'promos.claimBonus': 'Claim Bonus',
    
    'sportsNews.title': 'Sports News',
    'sportsNews.subtitle': 'Latest sports news and updates from Italy and around the world',
    'sportsNews.viewAll': 'View All News',
    'sportsNews.empty': 'No sports news available',
    'sportsNews.readMore': 'Read More',
    'sportsNews.breaking': 'Breaking',
    'sportsNews.trending': 'Trending',
    'sportsNews.badge': 'Sports',
    
    'news.notFound': 'Article Not Found',
    'news.notFoundDesc': 'The article you are looking for could not be found.',
    'news.backToHome': 'Back to Home',
    'news.featured': 'Featured',
    'news.detail': 'News',
    'news.listing': 'All News',
    'news.allNews': 'All News',
    'news.listingDesc': 'Stay updated with the latest news from the gambling and sports betting industry',
    'news.errorLoading': 'Error Loading News',
    'news.errorLoadingDesc': 'Unable to load news articles. Please try again later.',
    'news.empty': 'No News Available',
    'news.emptyDesc': 'There are no news articles available at this time.',
    'news.readMore': 'Read More',
    
    // News categories
    'category.regulation': 'Regulation',
    'category.promotions': 'Promotions',
    'category.football': 'Football',
    'category.championsLeague': 'Champions League',
    'category.tennis': 'Tennis',
    'category.sports': 'Sports',
    'category.gaming': 'Gaming',
    'category.casino': 'Casino',
    'category.betting': 'Betting',
    
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
    'newsletter.thankYou': 'Thank You for Subscribing!',
    'newsletter.successMessage': 'You have successfully subscribed to our newsletter. Stay tuned for the latest updates!',
    'newsletter.privacyNotice': 'By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.',
    'newsletter.subscribing': 'Subscribing...',
    'newsletter.successTitle': 'Subscription Successful',
    'newsletter.successDesc': 'Thank you for subscribing to our newsletter!',
    'newsletter.errorTitle': 'Subscription Failed',
    'newsletter.errorDesc': 'Failed to subscribe. Please try again.',
    
    // Footer
    'footer.about': 'About Us',
    'footer.terms': 'Terms & Conditions',
    'footer.privacy': 'Privacy Policy',
    'footer.contact': 'Contact Us',
    'footer.copyright': '© {year} <span translate="no">Betting SRL</span>. All rights reserved. All trademarks are property of their respective owners.',
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
    // Auth and Admin
    'auth.login': 'Accedi',
    'auth.register': 'Registrati',
    'auth.welcomeBack': 'Bentornato',
    'auth.loginDesc': 'Accedi al tuo account',
    'auth.username': 'Nome Utente',
    'auth.password': 'Password',
    'auth.usernamePlaceholder': 'Inserisci il tuo nome utente',
    'auth.passwordPlaceholder': 'Inserisci la tua password',
    'auth.loginButton': 'Accedi',
    'auth.createAccount': 'Crea un Account',
    'auth.registerDesc': 'Compila il modulo per creare il tuo account',
    'auth.confirmPassword': 'Conferma Password',
    'auth.confirmPasswordPlaceholder': 'Conferma la tua password',
    'auth.registerButton': 'Registrati',
    'auth.heroTitle': 'Benvenuto su <span translate="no">Betting SRL</span>',
    'auth.heroDescription': 'La tua fonte affidabile per recensioni di casinò italiani, codici promozionali esclusivi e approfondimenti sulle scommesse sportive.',
    'auth.feature1Title': 'Bonus Esclusivi',
    'auth.feature1Desc': 'Accedi a promozioni speciali e codici bonus non disponibili altrove.',
    'auth.feature2Title': 'Recensioni di Esperti',
    'auth.feature2Desc': 'Fidati delle nostre recensioni dettagliate sui migliori casinò online e siti di scommesse italiani.',
    
    'admin.title': 'Pannello di Amministrazione',
    'admin.backToSite': 'Torna al Sito',
    'admin.logout': 'Disconnetti',
    'admin.promoCodes': 'Codici Promo',
    'admin.games': 'Giochi',
    'admin.reviews': 'Recensioni',
    'admin.news': 'Notizie',
    'admin.guides': 'Guide',
    'admin.addNew': 'Aggiungi Nuovo',
    'admin.promoCodesDesc': 'Gestisci i codici promozionali del casinò',
    'admin.gamesDesc': 'Gestisci i giochi e le descrizioni del casinò',
    'admin.reviewsDesc': 'Gestisci le recensioni del casinò',
    'admin.newsDesc': 'Gestisci gli articoli di notizie',
    'admin.guidesDesc': 'Gestisci le guide alle scommesse',
    'admin.promoCodeCasino': 'Casinò',
    'admin.promoCode': 'Codice Promo',
    'admin.validUntil': 'Valido Fino Al',
    'admin.actions': 'Azioni',
    'admin.edit': 'Modifica',
    'admin.delete': 'Elimina',
    
    // Cookies
    'cookies.title': 'Politica dei Cookie',
    'cookies.description': 'Utilizziamo i cookie per migliorare la tua esperienza di navigazione, offrire contenuti personalizzati e analizzare il nostro traffico. Facendo clic su "Accetta", acconsenti al nostro utilizzo dei cookie.',
    'cookies.accept': 'Accetta Tutti',
    'cookies.reject': 'Rifiuta Tutti',
    'cookies.settings': 'Impostazioni Cookie',
    'admin.confirmDeleteTitle': 'Conferma Eliminazione',
    'admin.confirmDeletePromoCode': 'Sei sicuro di voler eliminare questo codice promo? Questa azione non può essere annullata.',
    'admin.cancel': 'Annulla',
    'admin.confirmDelete': 'Sì, Elimina',
    'admin.noPromoCodes': 'Nessun codice promo trovato',
    'admin.editPromoCode': 'Modifica Codice Promo',
    'admin.addPromoCode': 'Aggiungi Nuovo Codice Promo',
    'admin.promoCodeFormDesc': 'Inserisci i dettagli del codice promo sia in inglese che in italiano',
    'admin.englishContent': 'Contenuto in Inglese',
    'admin.italianContent': 'Contenuto in Italiano',
    'admin.casinoName': 'Nome del Casinò',
    'admin.description': 'Descrizione',
    'admin.bonus': 'Bonus',
    'admin.commonFields': 'Campi Comuni',
    'admin.featured': 'Stato in Evidenza',
    'admin.selectFeatured': 'Seleziona lo stato in evidenza',
    'admin.notFeatured': 'Non in Evidenza',
    'admin.featuredLevel1': 'In Evidenza (Priorità 1)',
    'admin.featuredLevel2': 'In Evidenza (Priorità 2)',
    'admin.logoUrl': 'URL del Logo',
    'admin.affiliateLink': 'Link di Affiliazione',
    'admin.save': 'Salva',
    'admin.back': 'Indietro',
    'admin.implementationPending': 'Implementazione completa in arrivo',
    'admin.editGame': 'Modifica Gioco',
    'admin.addGame': 'Aggiungi Nuovo Gioco',
    'admin.gameFormDesc': 'Inserisci i dettagli del gioco sia in inglese che in italiano',
    'admin.editReview': 'Modifica Recensione',
    'admin.addReview': 'Aggiungi Nuova Recensione',
    'admin.reviewFormDesc': 'Inserisci i dettagli della recensione sia in inglese che in italiano',
    'admin.editNews': 'Modifica Notizia',
    'admin.addNews': 'Aggiungi Nuova Notizia',
    'admin.newsFormDesc': 'Inserisci i dettagli della notizia sia in inglese che in italiano',
    'admin.editGuide': 'Modifica Guida',
    'admin.addGuide': 'Aggiungi Nuova Guida',
    'admin.guideFormDesc': 'Inserisci i dettagli della guida sia in inglese che in italiano',
    'admin.promoCodeLoadError': 'Impossibile caricare i codici promo',
    'admin.gamesLoadError': 'Impossibile caricare i giochi',
    'admin.reviewsLoadError': 'Impossibile caricare le recensioni',
    'admin.newsLoadError': 'Impossibile caricare le notizie',
    'admin.guidesLoadError': 'Impossibile caricare le guide',
    'admin.administratorsLoadError': 'Impossibile caricare gli amministratori',
    'admin.administrators': 'Amministratori',
    'admin.administratorsDesc': 'Gestisci gli amministratori del sito',
    'admin.createdAt': 'Creato il',
    'admin.pendingApproval': 'Approvazione Pendente',
    'admin.approve': 'Approva',
    'admin.block': 'Blocca',
    'admin.unblock': 'Sblocca',
    'admin.selectRoleTitle': 'Seleziona Ruolo Amministratore',
    'admin.selectRoleDescription': 'Scegli il ruolo per questo amministratore',
    'admin.regularAdmin': 'Amministratore Regolare',
    'admin.superAdmin': 'Super Amministratore',
    'admin.regularAdminDescription': 'Può gestire i contenuti ma non può modificare altri amministratori.',
    'admin.superAdminDescription': 'Può gestire i contenuti e ha permessi aggiuntivi.',
    'admin.confirm': 'Conferma',
    'admin.pendingTransfer': 'Trasferimento in Attesa',
    'admin.transferWarningTitle': 'Avviso Importante',
    'admin.transferWarningDesc': 'Questa azione non può essere annullata dopo il periodo di cancellazione di 24 ore.',
    'admin.transferTimerExplanation': 'Inizierà un periodo di cancellazione di 24 ore, durante il quale potrai ancora annullare il trasferimento.',
    'admin.initiateTransfer': 'Avvia Trasferimento',
    'admin.transferInProgress': 'Trasferimento proprietà in corso',
    'admin.transferOwnership': 'Trasferisci Proprietà',
    'admin.transferOwnershipTitle': 'Trasferisci Proprietà del Sito',
    'admin.transferOwnershipDescription': 'Stai per trasferire la proprietà del sito a un altro amministratore.',
    'admin.transferOwnershipTimer': '{hours}h {minutes}m rimanenti per annullare',
    'admin.cancelTransfer': 'Annulla Trasferimento',
    'admin.transferCancelled': 'Trasferimento proprietà annullato',
    'admin.transferCompleted': 'Trasferimento proprietà completato',
    'admin.siteOwner': 'Proprietario Sito',
    'admin.editAdminDesc': 'Modifica i dettagli dell\'amministratore',
    'admin.editAdmin': 'Modifica Amministratore',
    'admin.adminInvitedTitle': 'Amministratore Invitato',
    'admin.adminInvitedDesc': 'L\'invito è stato inviato con successo',
    'admin.adminInviteErrorTitle': 'Errore di Invito',
    'admin.passwordRequirements': 'La password deve essere almeno di 8 caratteri',
    'admin.initialPassword': 'Password Iniziale',
    'admin.inviteAdminDesc': 'Invita un nuovo amministratore al sito',
    'admin.sendInvite': 'Invia Invito',
    'admin.email': 'Email',
    'admin.emailOptional': 'Opzionale',
    'admin.emailDescription': 'Indirizzo email per inviare notifiche di invito',
    'admin.administratorName': 'Amministratore',
    'admin.noAdministrators': 'Nessun amministratore trovato',
    'admin.statusUpdatedTitle': 'Stato Aggiornato',
    'admin.statusUpdatedDesc': 'Lo stato dell\'utente è stato aggiornato',
    'admin.status': 'Stato',
    'admin.active': 'Attivo',
    'admin.blocked': 'Bloccato',
    'admin.adminApprovedTitle': 'Amministratore Approvato',
    'admin.adminApprovedDesc': 'L\'amministratore è stato approvato',
    'admin.tryAgainLater': 'Per favore riprova più tardi',
    'admin.selectRole': 'Seleziona ruolo',
    'admin.rolePromptTitle': 'Assegna Ruolo Amministratore',
    'admin.rolePromptDesc': 'Seleziona un ruolo per questo utente',
    'admin.inviteAdmin': 'Invita Amministratore',
    'admin.approvalPending': 'Approvazione in Attesa',
    
    // Page titles
    'home.title': 'I Migliori Casinò Online e Scommesse Sportive Italiane',
    // All admin table headers and notifications are defined in the English section
    'admin.titleColumn': 'Titolo',
    'admin.slug': 'URL Slug',
    'admin.gameId': 'Gioco',
    'admin.rating': 'Valutazione',
    'admin.difficulty': 'Livello di Difficoltà',
    'admin.difficulty.beginner': 'Principiante',
    'admin.difficulty.intermediate': 'Intermedio',
    'admin.difficulty.advanced': 'Avanzato',
    'admin.difficulty.expert': 'Esperto',
    'admin.publishDate': 'Data di Pubblicazione',
    'admin.category': 'Categoria',

    // Navigation
    'nav.home': 'Home',
    'nav.outlets': 'Punti Vendita',
    'nav.dealers': 'Concessionari',
    'nav.bonuses': 'Bonus',
    'nav.news': 'News',
    'nav.aboutUs': 'Chi Siamo',
    'nav.language': 'English',
    'nav.adminPanel': 'Pannello Admin',
    'nav.changePassword': 'Cambia Password',
    'nav.logout': 'Disconnetti',
    
    // Search
    'search.title': 'Ricerca',
    'search.placeholder': 'Cerca casino, bonus, notizie sportive...',
    'search.button': 'Cerca',
    'search.loading': 'Ricerca in corso...',
    'search.error': 'Errore durante la ricerca',
    'search.resultsFound': 'risultati trovati per',
    'search.noResults': 'Nessun risultato trovato per',
    'search.all': 'Tutti',
    'search.games': 'Giochi',
    'search.reviews': 'Recensioni',
    'search.news': 'Notizie',
    'search.guides': 'Guide',

    // About Us Page
    'aboutUs.title': 'Chi Siamo',
    'aboutUs.subtitle': 'Scopri di più su Betting SRL e il nostro impegno nel fornire esperienze di gioco eccezionali.',
    'aboutUs.description': 'Scopri Betting SRL - il tuo partner di fiducia per scommesse sportive e gioco in Italia.',
    'aboutUs.ourStory': 'La Nostra Storia',
    'aboutUs.storyText1': 'Betting SRL è stata una pietra miliare dell\'industria del gioco italiana, fornendo esperienze di scommesse affidabili ed emozionanti attraverso diverse sedi nella regione Campania.',
    'aboutUs.storyText2': 'Il nostro viaggio è iniziato con una missione semplice: creare spazi accoglienti dove gli appassionati di gioco possono godersi la loro passione in un ambiente sicuro e regolamentato.',
    'aboutUs.ourMission': 'La Nostra Missione',
    'aboutUs.missionText1': 'Siamo dedicati ad offrire servizi di gioco e scommesse della più alta qualità mantenendo i più rigorosi standard di gioco responsabile.',
    'aboutUs.missionText2': 'Il nostro team di professionisti esperti assicura che ogni visitatore riceva attenzione personalizzata e guida esperta.',
    'aboutUs.ourOutlets': 'Le Nostre Sedi',
    'aboutUs.contactUs': 'Informazioni di Contatto',
    'aboutUs.companyInfo': 'Informazioni Aziendali',
    'aboutUs.legalNotice': 'Operatore di gioco autorizzato e regolamentato in Italia',
    'aboutUs.responsibleGaming': 'Gioco Responsabile',
    'aboutUs.responsibleGamingText': 'Siamo impegnati a promuovere il gioco responsabile e a fornire supporto per coloro che ne hanno bisogno.',

    // Homepage Sections
    'hero.title': 'Trova il tuo concessionario di gioco preferito',
    'hero.subtitle': 'Bonus Esclusivi',
    'hero.cta': 'Ottieni Bonus',
    'hero.featuredReview': 'Recensione in Evidenza',
    'hero.noFeaturedContent': 'Nessun contenuto in evidenza disponibile',
    'hero.noNewsAvailable': 'Nessuna notizia disponibile',
    'hero.new': 'NUOVO',
    'hero.hot': 'CALDO',
    'hero.featuredReviewSummary': 'Gioca in uno dei migliori casinò online italiani con un bonus di benvenuto esclusivo e una vasta selezione di slot e giochi dal vivo.',
    'hero.news1Title': 'L\'Autorità Italiana di Gioco Annuncia Nuovi Cambiamenti Normativi',
    'hero.news2Title': 'Principali Tendenze nelle Scommesse Sportive per la Stagione Calcistica 2025',
    
    'featured.title': 'Comparazione Bonus dei Bookmakers Nostri Partner',
    'featured.subtitle': 'Bonus Esclusivi a Noi Dedicati',
    'featured.viewAll': 'Vedi Tutti i Casinò',
    'featured.empty': 'Nessun casinò in evidenza disponibile',
    'featured.recommended': 'CONSIGLIATO',
    'featured.validUntil': 'Valido fino al',
    'featured.limitedTimeOffer': 'Offerta a Tempo Limitato',
    'featured.showPromoCode': 'Mostra Codice Promo',
    'featured.visitCasino': 'Visita il Sito',
    'featured.welcomeBonus': 'Welcome Bonus: Vedi Termini e Condizioni',
    
    'promos.title': 'Codici Promo Esclusivi',
    'promos.subtitle': 'Bonus speciali disponibili solo tramite <span translate="no">Betting SRL</span>',
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
    'promos.viewCode': 'Vedi Codice',
    'promos.claimBonus': 'Ottieni Bonus',
    
    'sportsNews.title': 'Notizie Sportive',
    'sportsNews.subtitle': 'Ultime notizie sportive e aggiornamenti dall\'Italia e dal mondo',
    'sportsNews.viewAll': 'Visualizza Tutte le Notizie',
    'sportsNews.empty': 'Nessuna notizia sportiva disponibile',
    'sportsNews.readMore': 'Leggi di Più',
    'sportsNews.breaking': 'Ultima Ora',
    'sportsNews.trending': 'Tendenza',
    'sportsNews.badge': 'Sport',
    
    'news.notFound': 'Articolo Non Trovato',
    'news.notFoundDesc': 'L\'articolo che stai cercando non è stato trovato.',
    'news.backToHome': 'Torna alla Home',
    'news.featured': 'In Evidenza',
    'news.detail': 'Notizie',
    'news.listing': 'Tutte le Notizie',
    'news.allNews': 'Tutte le Notizie',
    'news.listingDesc': 'Resta aggiornato con le ultime notizie dal settore del gioco d\'azzardo e delle scommesse sportive',
    'news.errorLoading': 'Errore nel Caricamento delle Notizie',
    'news.errorLoadingDesc': 'Impossibile caricare gli articoli di notizie. Riprova più tardi.',
    'news.empty': 'Nessuna Notizia Disponibile',
    'news.emptyDesc': 'Non ci sono articoli di notizie disponibili al momento.',
    'news.readMore': 'Leggi di Più',
    
    // News categories
    'category.regulation': 'Regolamentazione',
    'category.promotions': 'Promozioni',
    'category.football': 'Calcio',
    'category.championsLeague': 'Champions League',
    'category.tennis': 'Tennis',
    'category.sports': 'Sport',
    'category.gaming': 'Gaming',
    'category.casino': 'Casinò',
    'category.betting': 'Scommesse',
    
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
    'newsletter.thankYou': 'Grazie per l\'Iscrizione!',
    'newsletter.successMessage': 'Ti sei iscritto con successo alla nostra newsletter. Resta sintonizzato per gli ultimi aggiornamenti!',
    'newsletter.privacyNotice': 'Iscrivendoti, accetti la nostra Informativa sulla Privacy e acconsenti a ricevere aggiornamenti dalla nostra azienda.',
    'newsletter.subscribing': 'Iscrizione in corso...',
    'newsletter.successTitle': 'Iscrizione Riuscita',
    'newsletter.successDesc': 'Grazie per esserti iscritto alla nostra newsletter!',
    'newsletter.errorTitle': 'Iscrizione Fallita',
    'newsletter.errorDesc': 'Impossibile completare l\'iscrizione. Riprova più tardi.',
    
    // Footer
    'footer.about': 'Chi Siamo',
    'footer.terms': 'Termini & Condizioni',
    'footer.privacy': 'Privacy Policy',
    'footer.contact': 'Contattaci',
    'footer.copyright': '© {year} <span translate="no">Betting SRL</span>. Tutti i diritti riservati. Tutti i marchi sono di proprietà dei rispettivi proprietari.',
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
  // Initialize language from localStorage or default to 'it'
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('preferred-language');
      return (stored === 'en' || stored === 'it') ? stored as Language : 'it';
    }
    return 'it';
  });

  // Enhanced setLanguage function that persists to localStorage and syncs across tabs
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', newLanguage);
      
      // Trigger a custom event for cross-tab synchronization
      window.dispatchEvent(new CustomEvent('language-changed', { 
        detail: { language: newLanguage } 
      }));
    }
  };

  // Listen for language changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'preferred-language' && e.newValue && (e.newValue === 'en' || e.newValue === 'it')) {
        setLanguageState(e.newValue as Language);
      }
    };

    const handleLanguageChange = (e: CustomEvent) => {
      if (e.detail && e.detail.language && (e.detail.language === 'en' || e.detail.language === 'it')) {
        setLanguageState(e.detail.language);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('language-changed', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('language-changed', handleLanguageChange as EventListener);
    };
  }, []);

  // Function to get translation for a key
  const t = (key: string): string => {
    const translatedText = translations[language][key] || key;
    
    // Always protect the brand name from translation by ensuring it has the same value
    // This approach doesn't change the actual text but maintains code intention
    return translatedText;
  };
  
  // Function to parse and render HTML content in translations
  const tHtml = (key: string): React.ReactNode => {
    const text = t(key);
    
    // If the translation contains HTML with translate="no", we need to parse it
    if (text.includes('<span translate="no">')) {
      return (
        <>
          {text.split(/<span translate="no">|<\/span>/).map((part, i) => {
            // Even indices are regular text, odd indices are content that should not be translated
            if (i % 2 === 0) {
              return part;
            } else {
              return <span key={i} translate="no">{part}</span>;
            }
          })}
        </>
      );
    }
    
    // If there's no HTML, just return the plain text
    return text;
  };
  
  // Function to get the correct language field from an item
  const getLocalizedField = <T extends Record<string, any>>(item: T, fieldName: string): string => {
    if (!item) return '';
    
    // Try to get the field with language suffix first
    const langField = `${fieldName}_${language}` as keyof T;
    if (langField in item) {
      return item[langField] as string;
    }
    
    // Fallback to the direct field name if it exists
    if (fieldName in item) {
      return item[fieldName as keyof T] as string;
    }
    
    return '';
  };

  // Function to translate category names
  const translateCategory = (category: string): string => {
    // Convert category to translation key format
    const categoryKey = category.toLowerCase()
      .replace(/\s+/g, '')
      .replace('champions league', 'championsLeague');
    
    const translationKey = `category.${categoryKey}`;
    const translated = translations[language][translationKey];
    
    // Return translated category or fallback to original
    return translated || category;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tHtml, getLocalizedField, translateCategory }}>
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