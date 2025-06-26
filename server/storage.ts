import { 
  Game, InsertGame, 
  Review, InsertReview, 
  News, InsertNews, 
  Guide, InsertGuide, 
  Subscriber, InsertSubscriber,
  User, InsertUser,
  PromoCode, InsertPromoCode,
  Outlet, InsertOutlet,
  AdvertisementBanner, InsertAdvertisementBanner
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserStatus(id: number, isBlocked: boolean): Promise<User>;
  approveAdmin(id: number, role?: string): Promise<User>;
  updateUserPassword(id: number, newPassword: string): Promise<User>;
  
  // Games
  getAllGames(): Promise<Game[]>;
  getFeaturedGames(): Promise<Game[]>;
  getTopRatedGames(limit?: number): Promise<Game[]>;
  getGameBySlug(slug: string): Promise<Game | undefined>;
  getGameById(id: number): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  
  // Reviews
  getAllReviews(): Promise<Review[]>;
  getLatestReviews(limit?: number): Promise<Review[]>;
  getFeaturedReviews(): Promise<Review[]>;
  getReviewBySlug(slug: string): Promise<Review | undefined>;
  getReviewById(id: number): Promise<Review | undefined>;
  getReviewsByGameId(gameId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // News
  getAllNews(): Promise<News[]>;
  getLatestNews(limit?: number): Promise<News[]>;
  getNewsBySlug(slug: string): Promise<News | undefined>;
  getNewsById(id: number): Promise<News | undefined>;
  createNews(news: InsertNews): Promise<News>;
  refreshNewsCache(): Promise<void>;
  
  // Guides
  getAllGuides(): Promise<Guide[]>;
  getLatestGuides(limit?: number): Promise<Guide[]>;
  getGuideBySlug(slug: string): Promise<Guide | undefined>;
  getGuideById(id: number): Promise<Guide | undefined>;
  createGuide(guide: InsertGuide): Promise<Guide>;
  
  // Promo Codes
  getAllPromoCodes(): Promise<PromoCode[]>;
  getActivePromoCodes(): Promise<PromoCode[]>;
  getFeaturedPromoCodes(limit?: number): Promise<PromoCode[]>;
  getPromoCodeById(id: number): Promise<PromoCode | undefined>;
  createPromoCode(promoCode: InsertPromoCode): Promise<PromoCode>;
  updatePromoCode(id: number, promoCode: Partial<InsertPromoCode>): Promise<PromoCode>;
  deletePromoCode(id: number): Promise<PromoCode>;
  
  // Outlets
  getAllOutlets(): Promise<Outlet[]>;
  getActiveOutlets(): Promise<Outlet[]>;
  getOutletById(id: number): Promise<Outlet | undefined>;
  createOutlet(outlet: InsertOutlet): Promise<Outlet>;
  updateOutlet(id: number, outlet: Partial<InsertOutlet>): Promise<Outlet>;
  deleteOutlet(id: number): Promise<Outlet>;
  
  // Subscribers
  addSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  
  // Advertisement Banners
  getAllAdvertisementBanners(): Promise<AdvertisementBanner[]>;
  getActiveAdvertisementBanners(position?: string): Promise<AdvertisementBanner[]>;
  getAdvertisementBannerById(id: number): Promise<AdvertisementBanner | undefined>;
  createAdvertisementBanner(banner: InsertAdvertisementBanner): Promise<AdvertisementBanner>;
  updateAdvertisementBanner(id: number, banner: Partial<InsertAdvertisementBanner>): Promise<AdvertisementBanner>;
  deleteAdvertisementBanner(id: number): Promise<AdvertisementBanner>;
  
  // Search
  search(query: string): Promise<{
    games: Game[];
    reviews: Review[];
    news: News[];
    guides: Guide[];
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private reviews: Map<number, Review>;
  private news: Map<number, News>;
  private guides: Map<number, Guide>;
  private subscribers: Map<number, Subscriber>;
  private promoCodes: Map<number, PromoCode>;
  private outlets: Map<number, Outlet>;
  private advertisementBanners: Map<number, AdvertisementBanner>;
  
  // Caching for GNews data
  private cachedNews: News[] | null = null;
  private newsCacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds (frozen temporarily)
  private isLoadingNews: boolean = false;
  
  private userId: number;
  private gameId: number;
  private reviewId: number;
  private newsId: number;
  private guideId: number;
  private subscriberId: number;
  private promoCodeId: number;
  private outletId: number;
  private advertisementBannerId: number;
  
  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.reviews = new Map();
    this.news = new Map();
    this.guides = new Map();
    this.subscribers = new Map();
    this.promoCodes = new Map();
    this.outlets = new Map();
    this.advertisementBanners = new Map();
    
    this.userId = 1;
    this.gameId = 1;
    this.reviewId = 1;
    this.newsId = 1;
    this.guideId = 1;
    this.subscriberId = 1;
    this.promoCodeId = 1;
    this.outletId = 1;
    this.advertisementBannerId = 1;
    
    // Add some initial data
    this.initializeData();
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const isAdmin = user.isAdmin === true; // Ensure isAdmin is a boolean, default to false if undefined
    // Set isBlocked to false by default for new users
    const isBlocked = false;
    const newUser: User = { 
      ...user, 
      id, 
      createdAt, 
      isAdmin, 
      isBlocked,
      pendingApproval: user.pendingApproval ?? false,
      email: user.email ?? null
    };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async updateUserStatus(id: number, isBlocked: boolean): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    
    // Update the user's status
    const updatedUser = { ...user, isBlocked };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async approveAdmin(id: number, role?: string): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    
    // Set isAdmin to true and add role if provided
    const username = role === 'superadmin' ? 'superadmin' : user.username;
    const updatedUser = { ...user, isAdmin: true, username };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateUserPassword(id: number, newPassword: string): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    
    // Update password
    const updatedUser = { ...user, password: newPassword };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  private initializeData() {
    // Initialize with sample game
    const game1: InsertGame = {
      title_en: "Sisal",
      title_it: "Sisal",
      slug: "sisal",
      description_en: "Sisal is a premier Italian online casino offering a comprehensive selection of games, generous bonuses, and excellent customer support.",
      description_it: "Sisal è un casinò online italiano di prim'ordine che offre una selezione completa di giochi, bonus generosi e un eccellente servizio clienti.",
      coverImage: "@assets/logo_Sisal_1750962171880.png",
      releaseDate: new Date("2023-05-12"),
      platforms: ["Desktop", "Mobile", "App"],
      genres: ["Slots", "Live Casino", "Table Games"],
      overallRating: 9.8,
      gameplayRating: 9.8,
      graphicsRating: 9.0,
      storyRating: 9.5,
      valueRating: 10.0,
      featured: 1
    };
    this.createGame(game1);
    
    const game2: InsertGame = {
      title_en: "PokerStars",
      title_it: "PokerStars",
      slug: "pokerstars",
      description_en: "PokerStars offers Italian players a secure and entertaining gaming environment with a wide range of casino games and sports betting options.",
      description_it: "PokerStars offre ai giocatori italiani un ambiente di gioco sicuro e divertente con un'ampia gamma di giochi da casinò e opzioni di scommesse sportive.",
      coverImage: "@assets/PokerStars-Logo_1750962736007.png",
      releaseDate: new Date("2023-08-03"),
      platforms: ["Desktop", "Mobile", "App"],
      genres: ["Slots", "Poker", "Sports Betting"],
      overallRating: 9.7,
      gameplayRating: 9.6,
      graphicsRating: 9.5,
      storyRating: 9.9,
      valueRating: 9.8,
      featured: 1
    };
    this.createGame(game2);
    
    const game3: InsertGame = {
      title_en: "GoldBet",
      title_it: "GoldBet",
      slug: "goldbet",
      description_en: "GoldBet provides Italian players with a comprehensive gaming platform featuring sports betting, casino games, and live dealer experiences.",
      description_it: "GoldBet offre ai giocatori italiani una piattaforma di gioco completa con scommesse sportive, giochi da casinò ed esperienze con dealer dal vivo.",
      coverImage: "@assets/GoldBet-500x500_dark_1750963481772.png",
      releaseDate: new Date("2022-02-25"),
      platforms: ["Desktop", "Mobile", "App"],
      genres: ["Sports Betting", "Slots", "Live Casino"],
      overallRating: 9.0,
      gameplayRating: 9.1,
      graphicsRating: 8.8,
      storyRating: 8.9,
      valueRating: 9.0,
      featured: 0
    };
    this.createGame(game3);
    
    // Sample casino reviews
    const review1: InsertReview = {
      gameId: 1,
      title_en: "Starcasino Review: Italy's Premier Online Casino Experience",
      title_it: "Recensione Starcasino: La Principale Esperienza di Casinò Online in Italia",
      slug: "starcasino-review-italy-premier-online-casino",
      summary_en: "Starcasino delivers an exceptional gaming experience with a vast selection of slots and generous welcome bonuses.",
      summary_it: "Starcasino offre un'esperienza di gioco eccezionale con una vasta selezione di slot e generosi bonus di benvenuto.",
      content_en: "Starcasino stands out as one of Italy's top online gambling destinations. With over 2,000 slot games from providers like NetEnt and Playtech, a comprehensive live dealer section, and a user-friendly mobile app, it caters to all types of players. New users can claim a welcome bonus of up to €500 plus 200 free spins, with reasonable 35x wagering requirements. Customer support is available 24/7 in Italian and English, and the platform offers secure payment methods including PayPal, credit cards, and bank transfers.",
      content_it: "Starcasino si distingue come una delle principali destinazioni di gioco d'azzardo online in Italia. Con oltre 2.000 giochi di slot di fornitori come NetEnt e Playtech, una sezione completa di dealer dal vivo e un'app mobile facile da usare, soddisfa tutti i tipi di giocatori. I nuovi utenti possono richiedere un bonus di benvenuto fino a €500 più 200 giri gratuiti, con ragionevoli requisiti di scommessa 35x. L'assistenza clienti è disponibile 24/7 in italiano e inglese, e la piattaforma offre metodi di pagamento sicuri tra cui PayPal, carte di credito e bonifici bancari.",
      coverImage: "https://images.unsplash.com/photo-1566694271453-390536dd1f0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=800&q=80",
      rating: 9.8,
      featured: 1
    };
    this.createReview(review1);

    const review2: InsertReview = {
      gameId: 2,
      title_en: "888Casino: The Complete Italian Player's Guide",
      title_it: "888Casino: La Guida Completa per il Giocatore Italiano",
      slug: "888casino-italian-players-guide",
      summary_en: "888Casino combines excellent game variety with outstanding bonuses and promotions for Italian players.",
      summary_it: "888Casino combina un'eccellente varietà di giochi con bonus e promozioni eccezionali per i giocatori italiani.",
      content_en: "888Casino has established itself as a leading option for Italian gamblers seeking quality entertainment. The platform holds all necessary licenses for operation in Italy and offers a clean, modern interface that's simple to navigate. With a welcome bonus of 100% up to €200 and frequent reload bonuses, players have plenty of incentives. The game selection includes over 1,000 slots, numerous table games, and an award-winning poker platform. Mobile gameplay is smooth across all devices, and withdrawals are processed efficiently within 24-48 hours.",
      content_it: "888Casino si è affermato come un'opzione di primo piano per i giocatori italiani in cerca di intrattenimento di qualità. La piattaforma detiene tutte le licenze necessarie per operare in Italia e offre un'interfaccia pulita e moderna facile da navigare. Con un bonus di benvenuto del 100% fino a €200 e frequenti bonus di ricarica, i giocatori hanno molti incentivi. La selezione di giochi include oltre 1.000 slot, numerosi giochi da tavolo e una piattaforma di poker premiata. Il gameplay mobile è fluido su tutti i dispositivi e i prelievi vengono elaborati in modo efficiente entro 24-48 ore.",
      coverImage: "https://images.unsplash.com/photo-1518895312237-a9e23508fd43?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=800&q=80",
      rating: 9.2,
      featured: 0
    };
    this.createReview(review2);
    
    // Add casino news samples
    const news1: InsertNews = {
      title_en: "Italian Gambling Authority Announces Stricter Regulations for 2024",
      title_it: "L'Autorità Italiana del Gioco d'Azzardo Annuncia Regolamenti Più Severi per il 2024",
      slug: "italian-gambling-authority-stricter-regulations-2024",
      summary_en: "New regulations aimed at enhancing player protection will require additional identity verification steps and deposit limits.",
      summary_it: "Nuove normative volte a migliorare la protezione dei giocatori richiederanno ulteriori passaggi di verifica dell'identità e limiti di deposito.",
      content_en: "The Italian gambling regulatory authority (ADM) has announced significant changes to online gambling regulations, set to take effect in early 2024. The new framework will require operators to implement stricter identity verification procedures, mandatory deposit limits that players must set before gambling, and enhanced self-exclusion options. While the measures aim to combat problem gambling, industry experts suggest they may impact the user experience with additional verification steps. Licensed operators, including major brands like Starcasino and 888, have six months to implement the required changes.",
      content_it: "L'autorità regolatoria italiana del gioco d'azzardo (ADM) ha annunciato significativi cambiamenti alle normative sul gioco d'azzardo online, che entreranno in vigore all'inizio del 2024. Il nuovo quadro richiederà agli operatori di implementare procedure di verifica dell'identità più rigide, limiti di deposito obbligatori che i giocatori devono impostare prima di giocare d'azzardo e opzioni di auto-esclusione migliorate. Mentre le misure mirano a combattere il gioco d'azzardo problematico, gli esperti del settore suggeriscono che potrebbero influire sull'esperienza utente con ulteriori passaggi di verifica. Gli operatori con licenza, inclusi i principali marchi come Starcasino e 888, hanno sei mesi per implementare le modifiche richieste.",
      coverImage: "https://images.unsplash.com/photo-1563237023-b1e970526dcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
      category: "Regulation",
      featured: 1
    };
    this.createNews(news1);

    const news2: InsertNews = {
      title_en: "Exclusive: LeoVegas Launches 'Leo Millions' €5M Guaranteed Jackpot",
      title_it: "Esclusiva: LeoVegas Lancia il Jackpot Garantito 'Leo Millions' da €5M",
      slug: "leovegas-launches-leo-millions-jackpot",
      summary_en: "LeoVegas introduces a new progressive jackpot slot with a minimum guaranteed prize pool of €5 million.",
      summary_it: "LeoVegas introduce una nuova slot a jackpot progressivo con un montepremi minimo garantito di €5 milioni.",
      content_en: "LeoVegas has announced the launch of 'Leo Millions,' a proprietary progressive jackpot slot game with a guaranteed minimum prize pool of €5 million. The exclusive game, developed in partnership with Play'n GO, will be available only to Italian players for the first month before expanding to other European markets. The launch is accompanied by a promotion offering 50 free spins to all players who deposit €20 or more between October 15-31. Industry analysts note this represents one of the largest guaranteed jackpots ever offered by an online casino operating in the Italian market.",
      content_it: "LeoVegas ha annunciato il lancio di 'Leo Millions', un gioco di slot a jackpot progressivo proprietario con un montepremi minimo garantito di €5 milioni. Il gioco esclusivo, sviluppato in collaborazione con Play'n GO, sarà disponibile solo per i giocatori italiani per il primo mese prima di espandersi ad altri mercati europei. Il lancio è accompagnato da una promozione che offre 50 giri gratuiti a tutti i giocatori che depositano €20 o più tra il 15 e il 31 ottobre. Gli analisti del settore notano che questo rappresenta uno dei jackpot garantiti più grandi mai offerti da un casinò online operante nel mercato italiano.",
      coverImage: "https://images.unsplash.com/photo-1605870445919-838d190e8e1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
      category: "Promotions",
      featured: 0
    };
    this.createNews(news2);

    // Add sports news samples
    const sportsNews1: InsertNews = {
      title_en: "Juventus Signs €100M Deal with New Serie A Betting Partner",
      title_it: "La Juventus Firma un Accordo da €100M con il Nuovo Partner di Scommesse della Serie A",
      slug: "juventus-signs-100m-deal-serie-a-betting-partner",
      summary_en: "Juventus announces a groundbreaking partnership with a major betting operator, marking the largest sponsorship deal in Serie A history.",
      summary_it: "La Juventus annuncia una partnership rivoluzionaria con un importante operatore di scommesse, segnando il più grande accordo di sponsorizzazione nella storia della Serie A.",
      content_en: "Juventus Football Club has announced a historic €100 million partnership deal with a leading sports betting operator, making it the largest sponsorship agreement in Serie A history. The three-year deal will see the betting company become the club's official betting partner and shirt sponsor. The announcement comes as Italian football continues to embrace partnerships with regulated gambling operators. Club president Andrea Agnelli stated that the partnership will help fund new player acquisitions and stadium improvements. The deal reflects the growing intersection between professional sports and the regulated betting industry in Italy.",
      content_it: "La Juventus Football Club ha annunciato uno storico accordo di partnership da €100 milioni con un importante operatore di scommesse sportive, rendendolo il più grande accordo di sponsorizzazione nella storia della Serie A. L'accordo triennale vedrà la società di scommesse diventare il partner ufficiale di scommesse del club e sponsor della maglia. L'annuncio arriva mentre il calcio italiano continua ad abbracciare partnership con operatori di gioco d'azzardo regolamentati. Il presidente del club Andrea Agnelli ha dichiarato che la partnership aiuterà a finanziare nuovi acquisti di giocatori e miglioramenti dello stadio. L'accordo riflette la crescente intersezione tra sport professionistici e l'industria delle scommesse regolamentate in Italia.",
      coverImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
      category: "Football",
      featured: 1
    };
    this.createNews(sportsNews1);

    const sportsNews2: InsertNews = {
      title_en: "UEFA Champions League: Italian Teams Lead Betting Odds for Quarter-Finals",
      title_it: "UEFA Champions League: Le Squadre Italiane Guidano le Quote per i Quarti di Finale",
      slug: "uefa-champions-league-italian-teams-betting-odds",
      summary_en: "AC Milan, Inter Milan, and Napoli are among the favorites according to major European sportsbooks for the upcoming Champions League quarter-finals.",
      summary_it: "AC Milan, Inter Milan e Napoli sono tra i favoriti secondo i principali sportsbook europei per i prossimi quarti di finale di Champions League.",
      content_en: "Italian football is experiencing a renaissance in European competition, with three Serie A teams making it to the UEFA Champions League quarter-finals. According to major European sportsbooks, AC Milan leads the betting odds at 3/1, followed by Inter Milan at 4/1, and Napoli at 5/1. The strong showing of Italian clubs has led to increased betting activity, with regulated operators reporting a 40% increase in Champions League wagers from Italian customers. Sports betting analysts attribute this success to improved tactical approaches and significant investments in player development. The quarter-final draws will take place next Friday, with matches scheduled for early April.",
      content_it: "Il calcio italiano sta vivendo una rinascita nella competizione europea, con tre squadre di Serie A che hanno raggiunto i quarti di finale della UEFA Champions League. Secondo i principali sportsbook europei, l'AC Milan guida le quote scommesse a 3/1, seguito dall'Inter Milan a 4/1 e dal Napoli a 5/1. La forte prestazione dei club italiani ha portato a un aumento dell'attività di scommesse, con operatori regolamentati che riportano un aumento del 40% delle scommesse sulla Champions League da parte dei clienti italiani. Gli analisti delle scommesse sportive attribuiscono questo successo a approcci tattici migliorati e investimenti significativi nello sviluppo dei giocatori. I sorteggi dei quarti di finale si terranno venerdì prossimo, con partite programmate per l'inizio di aprile.",
      coverImage: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
      category: "Champions League",
      featured: 0
    };
    this.createNews(sportsNews2);

    const sportsNews3: InsertNews = {
      title_en: "Tennis: Italian Open Rome Sets Record Betting Handle for ATP Masters",
      title_it: "Tennis: Gli Internazionali d'Italia di Roma Stabiliscono un Record di Scommesse per gli ATP Masters",
      slug: "italian-open-rome-record-betting-handle-atp-masters",
      summary_en: "The Italian Open in Rome generated the highest betting volume for any ATP Masters 1000 tournament this season, driven by strong local interest.",
      summary_it: "Gli Internazionali d'Italia a Roma hanno generato il volume di scommesse più alto per qualsiasi torneo ATP Masters 1000 di questa stagione, guidato dal forte interesse locale.",
      content_en: "The Italian Open tennis tournament in Rome has set a new record for betting handle among ATP Masters 1000 events this season, with over €15 million wagered across regulated Italian operators during the tournament week. The surge in betting activity was driven by strong performances from Italian players, including Jannik Sinner's run to the semifinals and Lorenzo Musetti's impressive showing. Tennis betting has grown significantly in Italy, with the sport now accounting for 15% of all sports betting volume in the country. The tournament's popularity among bettors was further boosted by favorable weather conditions that ensured all matches were completed on schedule.",
      content_it: "Il torneo di tennis degli Internazionali d'Italia a Roma ha stabilito un nuovo record per il volume di scommesse tra gli eventi ATP Masters 1000 di questa stagione, con oltre €15 milioni scommessi attraverso operatori italiani regolamentati durante la settimana del torneo. L'aumento dell'attività di scommesse è stato guidato dalle forti prestazioni dei giocatori italiani, inclusa la corsa di Jannik Sinner alle semifinali e l'impressionante prestazione di Lorenzo Musetti. Le scommesse sul tennis sono cresciute significativamente in Italia, con questo sport che ora rappresenta il 15% di tutto il volume di scommesse sportive nel paese. La popolarità del torneo tra gli scommettitori è stata ulteriormente rafforzata dalle condizioni meteorologiche favorevoli che hanno assicurato il completamento di tutte le partite nei tempi previsti.",
      coverImage: "https://images.unsplash.com/photo-1554068875-090f0c7aaba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
      category: "Tennis",
      featured: 0
    };
    this.createNews(sportsNews3);
    
    // Add betting guides
    const guide1: InsertGuide = {
      title_en: "Roulette Strategy Guide: Mastering the Most Popular Casino Table Game",
      title_it: "Guida alle Strategie della Roulette: Padroneggiare il Gioco da Tavolo da Casinò Più Popolare",
      slug: "roulette-strategy-guide-mastering-casino-table-game",
      summary_en: "Learn proven roulette strategies including the Martingale, Fibonacci, and D'Alembert systems to maximize your chances of winning.",
      summary_it: "Impara strategie comprovate per la roulette, inclusi i sistemi Martingale, Fibonacci e D'Alembert per massimizzare le tue possibilità di vincita.",
      content_en: "Roulette remains one of the most popular casino games in Italy, combining simplicity with excitement. This comprehensive guide covers everything from understanding the European, American, and French roulette variations to implementing betting strategies that can improve your odds. We explain the mathematics behind the Martingale system (doubling your bet after each loss), the more conservative Fibonacci approach (following the Fibonacci sequence for bet sizes), and the D'Alembert strategy (increasing bets by one unit after losses). The guide also includes bankroll management techniques and explains when each strategy is most appropriate based on your risk tolerance.",
      content_it: "La roulette rimane uno dei giochi da casinò più popolari in Italia, combinando semplicità ed emozione. Questa guida completa copre tutto, dalla comprensione delle varianti di roulette europea, americana e francese all'implementazione di strategie di scommessa che possono migliorare le tue probabilità. Spieghiamo la matematica dietro il sistema Martingale (raddoppiare la puntata dopo ogni perdita), l'approccio più conservativo di Fibonacci (seguendo la sequenza di Fibonacci per le dimensioni delle puntate) e la strategia D'Alembert (aumentare le puntate di un'unità dopo le perdite). La guida include anche tecniche di gestione del bankroll e spiega quando ogni strategia è più appropriata in base alla tua tolleranza al rischio.",
      coverImage: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
      difficulty: "INTERMEDIATE",
      category: "Casino Guides"
    };
    this.createGuide(guide1);

    const guide2: InsertGuide = {
      title_en: "Serie A Betting Guide: Expert Tips for the 2023-24 Season",
      title_it: "Guida alle Scommesse sulla Serie A: Consigli di Esperti per la Stagione 2023-24",
      slug: "serie-a-betting-guide-expert-tips-2023-24-season",
      summary_en: "Maximize your Serie A betting success with our expert analysis, team insights, and strategic betting approaches.",
      summary_it: "Massimizza il tuo successo nelle scommesse sulla Serie A con la nostra analisi di esperti, approfondimenti sulle squadre e approcci strategici alle scommesse.",
      content_en: "This comprehensive Serie A betting guide provides everything you need to know before placing wagers on Italy's top football league. We analyze the strengths and weaknesses of title contenders including Inter Milan, AC Milan, Juventus, and Napoli, with detailed statistical insights on home/away performance, scoring patterns, and defensive solidity. The guide includes expert tips on identifying value bets, leveraging Asian handicap markets, and utilizing in-play betting opportunities. We also cover the impact of European competition schedules on domestic performance and identify promising mid-table teams that consistently offer value against the betting spread.",
      content_it: "Questa guida completa alle scommesse sulla Serie A fornisce tutto ciò che devi sapere prima di piazzare scommesse sul principale campionato di calcio italiano. Analizziamo i punti di forza e di debolezza dei contendenti al titolo, tra cui Inter, Milan, Juventus e Napoli, con approfondimenti statistici dettagliati sulle prestazioni in casa/fuori casa, sui modelli di realizzazione e sulla solidità difensiva. La guida include consigli di esperti su come identificare le scommesse di valore, sfruttare i mercati dell'handicap asiatico e utilizzare le opportunità di scommesse dal vivo. Copriamo anche l'impatto dei calendari delle competizioni europee sulle prestazioni nazionali e identifichiamo squadre promettenti di metà classifica che offrono costantemente valore contro lo spread delle scommesse.",
      coverImage: "https://images.unsplash.com/photo-1610215078970-51f8395af5e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
      difficulty: "ADVANCED",
      category: "Sports Betting"
    };
    this.createGuide(guide2);
    
    // Add sample promo codes
    const promoCode1: InsertPromoCode = {
      casino_name_en: "Starcasino",
      casino_name_it: "Starcasino",
      code: "STAR100",
      description_en: "Get a 100% welcome bonus up to €200 plus 200 free spins on your first deposit at Starcasino.",
      description_it: "Ottieni un bonus di benvenuto del 100% fino a €200 più 200 giri gratuiti sul tuo primo deposito su Starcasino.",
      bonus_en: "100% up to €200 + 200 Free Spins",
      bonus_it: "100% fino a €200 + 200 Giri Gratuiti",
      validUntil: new Date(new Date().setMonth(new Date().getMonth() + 3)), // 3 months from now
      casinoLogo: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      affiliateLink: "https://example.com/starcasino-affiliate",
      active: true,
      featured: 2
    };
    this.createPromoCode(promoCode1);
    
    const promoCode2: InsertPromoCode = {
      casino_name_en: "888Casino",
      casino_name_it: "888Casino",
      code: "888BONUS",
      description_en: "New players at 888Casino can claim a 100% match bonus up to €100 using our exclusive promo code.",
      description_it: "I nuovi giocatori su 888Casino possono richiedere un bonus di corrispondenza del 100% fino a €100 utilizzando il nostro codice promozionale esclusivo.",
      bonus_en: "100% up to €100",
      bonus_it: "100% fino a €100",
      validUntil: new Date(new Date().setMonth(new Date().getMonth() + 2)), // 2 months from now
      casinoLogo: "https://images.unsplash.com/photo-1596838132731-3301c3fd4527?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      affiliateLink: "https://example.com/888casino-affiliate",
      active: true,
      featured: 1
    };
    this.createPromoCode(promoCode2);
    
    // Initialize outlets
    const outlet1: InsertOutlet = {
      title_en: "Redmoon Aversa",
      title_it: "Redmoon Aversa",
      description_en: "Our premium betting outlet in Aversa, featuring live sports betting, virtual games, and a welcoming atmosphere for all betting enthusiasts.",
      description_it: "Il nostro punto vendita premium ad Aversa, con scommesse sportive live, giochi virtuali e un'atmosfera accogliente per tutti gli appassionati di scommesse.",
      address_en: "Via Roma 123, Aversa (CE)",
      address_it: "Via Roma 123, Aversa (CE)",
      imageUrl: "redmoon-new-3",
      additionalImages: ["redmoon-new-1", "redmoon-new-2", "redmoon-new-4", "redmoon-new-5"],
      order: 1,
      isActive: true
    };
    
    const outlet2: InsertOutlet = {
      title_en: "Wincity Trentola-Ducenta",
      title_it: "Wincity Trentola-Ducenta",
      description_en: "Our Wincity location in Trentola-Ducenta offers a modern betting experience with state-of-the-art facilities and a wide range of gaming options.",
      description_it: "La nostra sede Wincity a Trentola-Ducenta offre un'esperienza di scommesse moderna con strutture all'avanguardia e un'ampia gamma di opzioni di gioco.",
      address_en: "Via Nazionale 45, Trentola-Ducenta (CE)",
      address_it: "Via Nazionale 45, Trentola-Ducenta (CE)",
      imageUrl: "wincity-new-1",
      additionalImages: ["wincity-new-2", "wincity-new-3", "wincity-new-4", "wincity-new-5", "wincity-new-6"],
      order: 2,
      isActive: true
    };
    
    const outlet3: InsertOutlet = {
      title_en: "Matchpoint Trentola-Ducenta",
      title_it: "Matchpoint Trentola-Ducenta",
      description_en: "Visit our Matchpoint location in Trentola-Ducenta for a premium sports betting experience with real-time odds and expert staff to guide you.",
      description_it: "Visita la nostra sede Matchpoint a Trentola-Ducenta per un'esperienza di scommesse sportive premium con quote in tempo reale e personale esperto per guidarti.",
      address_en: "Via Napoli 78, Trentola-Ducenta (CE)",
      address_it: "Via Napoli 78, Trentola-Ducenta (CE)",
      imageUrl: "matchpoint-new-1",
      additionalImages: ["matchpoint-new-2", "matchpoint-new-3", "matchpoint-new-4", "matchpoint-new-5", "matchpoint-new-6"],
      order: 3,
      isActive: true
    };
    
    const outlet4: InsertOutlet = {
      title_en: "Caffeteria Nini",
      title_it: "Caffeteria Nini",
      description_en: "A welcoming bar and restaurant offering both dining and gaming experiences. Enjoy excellent food and drinks while betting in a relaxed, social atmosphere.",
      description_it: "Un bar e ristorante accogliente che offre esperienze culinarie e di gioco. Goditi ottimo cibo e bevande mentre scommetti in un'atmosfera rilassata e sociale.",
      address_en: "Via delle Rose 15, Aversa (CE)",
      address_it: "Via delle Rose 15, Aversa (CE)",
      imageUrl: "1_1750514327472",
      additionalImages: [],
      order: 4,
      isActive: true
    };

    this.createOutlet(outlet1);
    this.createOutlet(outlet2);
    this.createOutlet(outlet3);
    this.createOutlet(outlet4);

    // Add demo advertisement banners - one per side
    const leftBanner: InsertAdvertisementBanner = {
      title: "Casino Bonus 200%",
      imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400&q=80",
      clickUrl: "https://example-casino.com/bonus",
      position: "left",
      isActive: true,
      order: 1
    };
    this.createAdvertisementBanner(leftBanner);

    const rightBanner: InsertAdvertisementBanner = {
      title: "Live Casino Experience",
      imageUrl: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400&q=80",
      clickUrl: "https://example-livecasino.com/play",
      position: "right",
      isActive: true,
      order: 1
    };
    this.createAdvertisementBanner(rightBanner);
  }
  
  // Games methods
  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }
  
  async getFeaturedGames(): Promise<Game[]> {
    return Array.from(this.games.values()).filter(game => game.featured === 1);
  }
  
  async getTopRatedGames(limit: number = 10): Promise<Game[]> {
    return Array.from(this.games.values())
      .sort((a, b) => b.overallRating - a.overallRating)
      .slice(0, limit);
  }
  
  async getGameBySlug(slug: string): Promise<Game | undefined> {
    return Array.from(this.games.values()).find(game => game.slug === slug);
  }
  
  async getGameById(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }
  
  async createGame(game: InsertGame): Promise<Game> {
    const id = this.gameId++;
    const createdAt = new Date();
    const newGame: Game = { ...game, id, createdAt };
    this.games.set(id, newGame);
    return newGame;
  }
  
  // Reviews methods
  async getAllReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }
  
  async getLatestReviews(limit: number = 4): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, limit);
  }
  
  async getFeaturedReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.featured === 1);
  }
  
  async getReviewBySlug(slug: string): Promise<Review | undefined> {
    return Array.from(this.reviews.values()).find(review => review.slug === slug);
  }
  
  async getReviewById(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }
  
  async getReviewsByGameId(gameId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.gameId === gameId);
  }
  
  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const publishDate = new Date();
    const newReview: Review = { ...review, id, publishDate };
    this.reviews.set(id, newReview);
    return newReview;
  }
  
  // News methods
  async getAllNews(): Promise<News[]> {
    await this.ensureNewsCache();
    return this.cachedNews || [];
  }
  
  async getLatestNews(limit: number = 5): Promise<News[]> {
    await this.ensureNewsCache();
    return (this.cachedNews || [])
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, limit);
  }

  private async ensureNewsCache(): Promise<void> {
    const now = Date.now();
    
    // If cache is valid, return immediately
    if (this.cachedNews && (now - this.newsCacheTimestamp) < this.CACHE_DURATION) {
      return;
    }
    
    // If already loading, wait for it to complete
    if (this.isLoadingNews) {
      // Wait for the current load to complete
      while (this.isLoadingNews) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }
    
    // If cache is expired or doesn't exist, refresh it
    await this.loadCachedNews();
  }

  private async loadCachedNews(): Promise<void> {
    if (this.isLoadingNews) return;
    
    this.isLoadingNews = true;
    try {
      console.log('Refreshing news cache from GNews API...');
      const { fetchGNews, convertGNewsToNews } = await import('./services/gnews');
      const articles = await fetchGNews('sports', 'it');
      
      this.cachedNews = articles.map((article, index) => convertGNewsToNews(article, index));
      this.newsCacheTimestamp = Date.now();
      console.log(`News cache refreshed successfully with ${this.cachedNews.length} articles`);
    } catch (error) {
      console.error('Failed to load news from GNews API:', error);
      // Only use fallback if we don't have any cached data
      if (!this.cachedNews) {
        this.cachedNews = Array.from(this.news.values());
        console.log('Using fallback static news data');
      } else {
        console.log('Keeping existing cached news data');
      }
      this.newsCacheTimestamp = Date.now();
    } finally {
      this.isLoadingNews = false;
    }
  }

  async refreshNewsCache(): Promise<void> {
    // Only refresh if enough time has passed to avoid API limits
    const now = Date.now();
    if (this.newsCacheTimestamp && (now - this.newsCacheTimestamp) < this.CACHE_DURATION) {
      console.log('News cache refresh skipped - cache still valid');
      return;
    }
    
    this.cachedNews = null;
    this.newsCacheTimestamp = 0;
    await this.loadCachedNews();
  }
  
  async getNewsBySlug(slug: string): Promise<News | undefined> {
    await this.ensureNewsCache();
    
    // First check cached news
    if (this.cachedNews) {
      const cachedArticle = this.cachedNews.find(news => news.slug === slug);
      if (cachedArticle) return cachedArticle;
    }
    
    // Fallback to static news
    return Array.from(this.news.values()).find(news => news.slug === slug);
  }
  
  async getNewsById(id: number): Promise<News | undefined> {
    await this.ensureNewsCache();
    
    // First check cached news
    if (this.cachedNews) {
      const cachedArticle = this.cachedNews.find(news => news.id === id);
      if (cachedArticle) return cachedArticle;
    }
    
    // Fallback to static news
    return this.news.get(id);
  }
  
  async createNews(news: InsertNews): Promise<News> {
    const id = this.newsId++;
    const publishDate = new Date();
    const newNews: News = { ...news, id, publishDate };
    this.news.set(id, newNews);
    return newNews;
  }
  
  // Guides methods
  async getAllGuides(): Promise<Guide[]> {
    return Array.from(this.guides.values());
  }
  
  async getLatestGuides(limit: number = 3): Promise<Guide[]> {
    return Array.from(this.guides.values())
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, limit);
  }
  
  async getGuideBySlug(slug: string): Promise<Guide | undefined> {
    return Array.from(this.guides.values()).find(guide => guide.slug === slug);
  }
  
  async getGuideById(id: number): Promise<Guide | undefined> {
    return this.guides.get(id);
  }
  
  async createGuide(guide: InsertGuide): Promise<Guide> {
    const id = this.guideId++;
    const publishDate = new Date();
    const newGuide: Guide = { ...guide, id, publishDate };
    this.guides.set(id, newGuide);
    return newGuide;
  }
  
  // Subscribers methods
  async addSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    // Check if subscriber already exists
    const existingSubscriber = Array.from(this.subscribers.values()).find(
      s => s.email === subscriber.email
    );
    
    if (existingSubscriber) {
      return existingSubscriber;
    }
    
    const id = this.subscriberId++;
    const createdAt = new Date();
    const newSubscriber: Subscriber = { ...subscriber, id, createdAt };
    this.subscribers.set(id, newSubscriber);
    return newSubscriber;
  }
  
  // Promo Codes methods
  async getAllPromoCodes(): Promise<PromoCode[]> {
    return Array.from(this.promoCodes.values());
  }
  
  async getActivePromoCodes(): Promise<PromoCode[]> {
    return Array.from(this.promoCodes.values())
      .filter(code => code.active && new Date(code.validUntil) > new Date());
  }
  
  async getFeaturedPromoCodes(limit: number = 10): Promise<PromoCode[]> {
    return Array.from(this.promoCodes.values())
      .filter(code => code.active && new Date(code.validUntil) > new Date() && code.featured)
      .sort((a, b) => Number(b.featured) - Number(a.featured))
      .slice(0, limit);
  }
  
  async getPromoCodeById(id: number): Promise<PromoCode | undefined> {
    return this.promoCodes.get(id);
  }
  
  async createPromoCode(promoCode: InsertPromoCode): Promise<PromoCode> {
    const id = this.promoCodeId++;
    const createdAt = new Date();
    const newPromoCode: PromoCode = { 
      ...promoCode, 
      id, 
      createdAt,
      featured: promoCode.featured || 0,
      active: promoCode.active === undefined ? true : promoCode.active
    };
    this.promoCodes.set(id, newPromoCode);
    return newPromoCode;
  }
  
  async updatePromoCode(id: number, promoCode: Partial<InsertPromoCode>): Promise<PromoCode> {
    const existingPromoCode = await this.getPromoCodeById(id);
    if (!existingPromoCode) {
      throw new Error("Promo code not found");
    }
    
    // Update the promo code fields
    const updatedPromoCode: PromoCode = { 
      ...existingPromoCode, 
      ...promoCode,
      // Make sure we have proper featured value
      featured: promoCode.featured !== undefined ? promoCode.featured : existingPromoCode.featured
    };
    
    this.promoCodes.set(id, updatedPromoCode);
    return updatedPromoCode;
  }
  
  async deletePromoCode(id: number): Promise<PromoCode> {
    const promoCode = await this.getPromoCodeById(id);
    if (!promoCode) {
      throw new Error("Promo code not found");
    }
    
    this.promoCodes.delete(id);
    return promoCode;
  }
  
  // Search functionality
  async search(query: string): Promise<{
    games: Game[];
    reviews: Review[];
    news: News[];
    guides: Guide[];
  }> {
    const lowerQuery = query.toLowerCase();
    
    const games = Array.from(this.games.values()).filter(game => 
      game.title_en.toLowerCase().includes(lowerQuery) || 
      game.title_it.toLowerCase().includes(lowerQuery) || 
      game.description_en.toLowerCase().includes(lowerQuery) ||
      game.description_it.toLowerCase().includes(lowerQuery)
    );
    
    const reviews = Array.from(this.reviews.values()).filter(review => 
      review.title_en.toLowerCase().includes(lowerQuery) || 
      review.title_it.toLowerCase().includes(lowerQuery) || 
      review.summary_en.toLowerCase().includes(lowerQuery) ||
      review.summary_it.toLowerCase().includes(lowerQuery) ||
      review.content_en.toLowerCase().includes(lowerQuery) ||
      review.content_it.toLowerCase().includes(lowerQuery)
    );
    
    const news = Array.from(this.news.values()).filter(news => 
      news.title_en.toLowerCase().includes(lowerQuery) || 
      news.title_it.toLowerCase().includes(lowerQuery) || 
      news.summary_en.toLowerCase().includes(lowerQuery) ||
      news.summary_it.toLowerCase().includes(lowerQuery) ||
      news.content_en.toLowerCase().includes(lowerQuery) ||
      news.content_it.toLowerCase().includes(lowerQuery)
    );
    
    const guides = Array.from(this.guides.values()).filter(guide => 
      guide.title_en.toLowerCase().includes(lowerQuery) || 
      guide.title_it.toLowerCase().includes(lowerQuery) || 
      guide.summary_en.toLowerCase().includes(lowerQuery) ||
      guide.summary_it.toLowerCase().includes(lowerQuery) ||
      guide.content_en.toLowerCase().includes(lowerQuery) ||
      guide.content_it.toLowerCase().includes(lowerQuery)
    );
    
    return { games, reviews, news, guides };
  }
  
  // Outlet methods
  async getAllOutlets(): Promise<Outlet[]> {
    return Array.from(this.outlets.values());
  }

  async getActiveOutlets(): Promise<Outlet[]> {
    return Array.from(this.outlets.values()).filter(outlet => outlet.isActive);
  }

  async getOutletById(id: number): Promise<Outlet | undefined> {
    return this.outlets.get(id);
  }

  async createOutlet(outlet: InsertOutlet): Promise<Outlet> {
    const id = this.outletId++;
    const createdAt = new Date();
    const newOutlet: Outlet = { ...outlet, id, createdAt };
    this.outlets.set(id, newOutlet);
    return newOutlet;
  }

  async updateOutlet(id: number, outlet: Partial<InsertOutlet>): Promise<Outlet> {
    const existingOutlet = this.outlets.get(id);
    if (!existingOutlet) {
      throw new Error(`Outlet with id ${id} not found.`);
    }
    
    const updatedOutlet: Outlet = { ...existingOutlet, ...outlet };
    this.outlets.set(id, updatedOutlet);
    return updatedOutlet;
  }

  async deleteOutlet(id: number): Promise<Outlet> {
    const outlet = this.outlets.get(id);
    if (!outlet) {
      throw new Error(`Outlet with id ${id} not found.`);
    }
    
    this.outlets.delete(id);
    return outlet;
  }

  // Advertisement Banner methods
  async getAllAdvertisementBanners(): Promise<AdvertisementBanner[]> {
    return Array.from(this.advertisementBanners.values()).sort((a, b) => a.order - b.order);
  }

  async getActiveAdvertisementBanners(position?: string): Promise<AdvertisementBanner[]> {
    let banners = Array.from(this.advertisementBanners.values()).filter(banner => banner.isActive);
    if (position) {
      banners = banners.filter(banner => banner.position === position);
    }
    return banners.sort((a, b) => a.order - b.order);
  }

  async getAdvertisementBannerById(id: number): Promise<AdvertisementBanner | undefined> {
    return this.advertisementBanners.get(id);
  }

  async createAdvertisementBanner(banner: InsertAdvertisementBanner): Promise<AdvertisementBanner> {
    const id = this.advertisementBannerId++;
    const createdAt = new Date();
    const newBanner: AdvertisementBanner = { 
      ...banner, 
      id, 
      createdAt,
      order: banner.order ?? 0,
      isActive: banner.isActive ?? true,
      clickUrl: banner.clickUrl ?? null
    };
    this.advertisementBanners.set(id, newBanner);
    return newBanner;
  }

  async updateAdvertisementBanner(id: number, banner: Partial<InsertAdvertisementBanner>): Promise<AdvertisementBanner> {
    const existingBanner = this.advertisementBanners.get(id);
    if (!existingBanner) {
      throw new Error(`Advertisement banner with id ${id} not found.`);
    }
    
    const updatedBanner: AdvertisementBanner = { ...existingBanner, ...banner };
    this.advertisementBanners.set(id, updatedBanner);
    return updatedBanner;
  }

  async deleteAdvertisementBanner(id: number): Promise<AdvertisementBanner> {
    const banner = this.advertisementBanners.get(id);
    if (!banner) {
      throw new Error(`Advertisement banner with id ${id} not found.`);
    }
    
    this.advertisementBanners.delete(id);
    return banner;
  }
}

export const storage = new MemStorage();
