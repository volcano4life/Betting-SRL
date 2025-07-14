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
  private readonly CACHE_DURATION = 20 * 60 * 1000; // 20 minutes in milliseconds
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
      featured: 1
    };
    this.createGame(game3);

    const game4: InsertGame = {
      title_en: "Lottomatica",
      title_it: "Lottomatica",
      slug: "lottomatica",
      description_en: "Lottomatica is Italy's leading gaming operator offering lottery, sports betting, casino games, and innovative gaming solutions.",
      description_it: "Lottomatica è il principale operatore di gioco in Italia che offre lotterie, scommesse sportive, giochi da casinò e soluzioni di gioco innovative.",
      coverImage: "@assets/Logo_Lottomatica_Col_RGB-e1684494644169_1750968051426.png",
      releaseDate: new Date("2018-06-30"),
      platforms: ["Desktop", "Mobile", "App", "Retail"],
      genres: ["Lottery", "Sports Betting", "Casino", "Slots"],
      overallRating: 9.3,
      gameplayRating: 9.4,
      graphicsRating: 9.1,
      storyRating: 9.2,
      valueRating: 9.5,
      featured: 1
    };
    this.createGame(game4);

    const game5: InsertGame = {
      title_en: "Betfair",
      title_it: "Betfair",
      slug: "betfair",
      description_en: "Betfair is a leading global betting exchange offering innovative sports betting, casino games, and exchange betting with competitive odds.",
      description_it: "Betfair è un exchange di scommesse globale leader che offre scommesse sportive innovative, giochi da casinò e scommesse exchange con quote competitive.",
      coverImage: "@assets/Betfair-Logo_1750965384418.png",
      releaseDate: new Date("2020-09-12"),
      platforms: ["Desktop", "Mobile", "App"],
      genres: ["Exchange Betting", "Sports Betting", "Casino"],
      overallRating: 9.2,
      gameplayRating: 9.3,
      graphicsRating: 9.0,
      storyRating: 9.1,
      valueRating: 9.4,
      featured: 1
    };
    this.createGame(game5);

    const game6: InsertGame = {
      title_en: "Snai",
      title_it: "Snai",
      slug: "snai",
      description_en: "Snai is a well-established Italian gaming brand offering sports betting, casino games, and poker with decades of experience.",
      description_it: "Snai è un marchio di gioco italiano ben consolidato che offre scommesse sportive, giochi da casinò e poker con decenni di esperienza.",
      coverImage: "@assets/image_2021_06_03T16_49_57_431Z_1750966673841.png",
      releaseDate: new Date("2020-11-20"),
      platforms: ["Desktop", "Mobile", "App"],
      genres: ["Sports Betting", "Casino", "Poker"],
      overallRating: 8.9,
      gameplayRating: 9.0,
      graphicsRating: 8.7,
      storyRating: 8.8,
      valueRating: 9.1,
      featured: 1
    };
    this.createGame(game6);

    const game7: InsertGame = {
      title_en: "Eurobet",
      title_it: "Eurobet",
      slug: "eurobet",
      description_en: "Eurobet provides a modern gaming experience with innovative features, competitive odds, and a user-friendly interface for Italian players.",
      description_it: "Eurobet fornisce un'esperienza di gioco moderna con funzionalità innovative, quote competitive e un'interfaccia user-friendly per i giocatori italiani.",
      coverImage: "@assets/Eurobet_Logo1_1750966301590.png",
      releaseDate: new Date("2021-03-10"),
      platforms: ["Desktop", "Mobile"],
      genres: ["Sports Betting", "Live Casino", "Slots"],
      overallRating: 8.8,
      gameplayRating: 8.9,
      graphicsRating: 8.8,
      storyRating: 8.6,
      valueRating: 8.9,
      featured: 1
    };
    this.createGame(game7);

    const game8: InsertGame = {
      title_en: "Netwin",
      title_it: "Netwin",
      slug: "netwin",
      description_en: "Netwin is an innovative Italian gaming platform offering sports betting, casino games, and virtual sports with cutting-edge technology and competitive odds.",
      description_it: "Netwin è una piattaforma di gioco italiana innovativa che offre scommesse sportive, giochi da casinò e sport virtuali con tecnologia all'avanguardia e quote competitive.",
      coverImage: "@assets/Netwin-Logo-293x90_1750966253550.png",
      releaseDate: new Date("2021-11-15"),
      platforms: ["Desktop", "Mobile", "App"],
      genres: ["Sports Betting", "Casino", "Virtual Sports"],
      overallRating: 8.9,
      gameplayRating: 9.0,
      graphicsRating: 8.8,
      storyRating: 8.7,
      valueRating: 9.1,
      featured: 1
    };
    this.createGame(game8);
    
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
      title_en: "New Live Casino Studio Opens in Milan: Revolutionary Gaming Experience",
      title_it: "Nuovo Studio Live Casino Apre a Milano: Esperienza di Gioco Rivoluzionaria",
      slug: "live-casino-studio-opens-milan-revolutionary-gaming",
      summary_en: "Evolution Gaming unveils state-of-the-art live casino studio in Milan, featuring Italian dealers and localized games for Italian players.",
      summary_it: "Evolution Gaming svela uno studio live casino all'avanguardia a Milano, con dealer italiani e giochi localizzati per i giocatori italiani.",
      content_en: "Evolution Gaming has officially opened its new live casino studio in Milan, marking a significant milestone for the Italian gambling market. The 2,000 square meter facility features 15 live gaming tables with native Italian dealers, offering localized versions of popular games including Italian Roulette, Blackjack Italiano, and Baccarat Roma. The studio incorporates advanced streaming technology with 4K resolution and multiple camera angles to provide an immersive gaming experience. Italian players can now enjoy authentic live casino gaming with dealers who speak their language and understand local gaming preferences, available across all licensed operators in Italy.",
      content_it: "Evolution Gaming ha ufficialmente aperto il suo nuovo studio live casino a Milano, segnando una pietra miliare significativa per il mercato del gioco d'azzardo italiano. La struttura di 2.000 metri quadrati presenta 15 tavoli da gioco dal vivo con dealer italiani nativi, offrendo versioni localizzate di giochi popolari tra cui Roulette Italiana, Blackjack Italiano e Baccarat Roma. Lo studio incorpora tecnologie di streaming avanzate con risoluzione 4K e angoli di telecamera multipli per fornire un'esperienza di gioco immersiva. I giocatori italiani possono ora godere di un autentico gioco live casino con dealer che parlano la loro lingua e capiscono le preferenze di gioco locali, disponibile su tutti gli operatori con licenza in Italia.",
      coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      category: "Technology",
      featured: 1
    };
    this.createNews(news1);

    const news2: InsertNews = {
      title_en: "Italy's Mobile Gaming Revenue Surges 45% in Q3 2024",
      title_it: "I Ricavi del Gaming Mobile in Italia Aumentano del 45% nel Q3 2024",
      slug: "italy-mobile-gaming-revenue-surges-45-percent-q3-2024",
      summary_en: "Mobile casino gaming continues to dominate the Italian market, with smartphones accounting for 70% of all online gambling activity.",
      summary_it: "Il gaming mobile da casinò continua a dominare il mercato italiano, con gli smartphone che rappresentano il 70% di tutta l'attività di gioco d'azzardo online.",
      content_en: "According to the latest report from the Italian Gaming Authority (ADM), mobile gaming revenue in Italy reached €1.2 billion in Q3 2024, representing a remarkable 45% increase compared to the same period last year. The growth is primarily driven by improved mobile app experiences and the popularity of mobile-optimized slot games. Industry leaders like Sisal, PokerStars, and Lottomatica have invested heavily in mobile-first strategies, with some operators reporting that over 80% of their customers now primarily use mobile devices. The trend towards mobile gaming has also led to innovative features such as live mobile dealer games and augmented reality casino experiences.",
      content_it: "Secondo l'ultimo rapporto dell'Autorità Italiana del Gioco (ADM), i ricavi del gaming mobile in Italia hanno raggiunto €1,2 miliardi nel Q3 2024, rappresentando un notevole aumento del 45% rispetto allo stesso periodo dell'anno scorso. La crescita è guidata principalmente dal miglioramento delle esperienze delle app mobile e dalla popolarità dei giochi di slot ottimizzati per dispositivi mobili. I leader del settore come Sisal, PokerStars e Lottomatica hanno investito pesantemente in strategie mobile-first, con alcuni operatori che riportano che oltre l'80% dei loro clienti ora utilizza principalmente dispositivi mobili. La tendenza verso il gaming mobile ha anche portato a funzionalità innovative come i giochi live dealer mobile e le esperienze di casinò in realtà aumentata.",
      coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      category: "Market Analysis",
      featured: 0
    };
    this.createNews(news2);

    // Add sports news samples
    const sportsNews1: InsertNews = {
      title_en: "Formula 1: Monza Grand Prix Betting Reaches All-Time High in Italy",
      title_it: "Formula 1: Le Scommesse del Gran Premio di Monza Raggiungono il Massimo Storico in Italia",
      slug: "formula1-monza-grand-prix-betting-all-time-high-italy",
      summary_en: "The Italian Grand Prix at Monza generated record betting volumes, with Ferrari's home race attracting unprecedented interest from Italian bettors.",
      summary_it: "Il Gran Premio d'Italia a Monza ha generato volumi di scommesse record, con la gara di casa della Ferrari che ha attirato un interesse senza precedenti dai scommettitori italiani.",
      content_en: "The 2024 Italian Grand Prix at Monza has set a new record for Formula 1 betting activity in Italy, with over €25 million wagered across regulated operators during the race weekend. The surge was driven by Ferrari's strong qualifying performance and Charles Leclerc's pole position, which saw his odds to win shorten from 8/1 to 3/1. Italian operators reported that 60% of all F1 bets placed during the weekend were on Ferrari drivers, with many new customers creating accounts specifically to bet on the home race. The passionate Italian support for Ferrari, combined with the historical significance of Monza, created perfect conditions for record-breaking betting activity in the motorsport category.",
      content_it: "Il Gran Premio d'Italia 2024 a Monza ha stabilito un nuovo record per l'attività di scommesse di Formula 1 in Italia, con oltre €25 milioni scommessi attraverso operatori regolamentati durante il weekend di gara. L'aumento è stato guidato dalla forte prestazione in qualifica della Ferrari e dalla pole position di Charles Leclerc, che ha visto le sue quote per la vittoria accorciarsi da 8/1 a 3/1. Gli operatori italiani hanno riportato che il 60% di tutte le scommesse F1 piazzate durante il weekend erano sui piloti Ferrari, con molti nuovi clienti che hanno creato account specificamente per scommettere sulla gara di casa. Il supporto appassionato italiano per la Ferrari, combinato con il significato storico di Monza, ha creato condizioni perfette per un'attività di scommesse da record nella categoria motorsport.",
      coverImage: "https://images.unsplash.com/photo-1558618047-3c03d5d7b10a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      category: "Formula 1",
      featured: 1
    };
    this.createNews(sportsNews1);

    const sportsNews2: InsertNews = {
      title_en: "Basketball: Italian League Partners with Major Betting Operator",
      title_it: "Basket: La Lega Italiana Si Associa con un Importante Operatore di Scommesse",
      slug: "basketball-italian-league-partners-major-betting-operator",
      summary_en: "The Italian Basketball League announces a comprehensive partnership deal focusing on responsible gambling and fan engagement.",
      summary_it: "La Lega Italiana di Basket annuncia un accordo di partnership completo incentrato sul gioco responsabile e sul coinvolgimento dei tifosi.",
      content_en: "The Italian Basketball League (Serie A) has announced a landmark partnership with a leading regulated betting operator, marking the first major sponsorship deal in Italian basketball history. The three-year agreement will see the betting company become the league's official partner, with a focus on responsible gambling initiatives and enhanced fan engagement through interactive betting experiences. The partnership includes educational programs about responsible gambling, live betting features during games, and exclusive content for basketball fans. League president Umberto Gandini emphasized that the deal will help grow basketball's popularity in Italy while maintaining the highest standards of player and fan protection.",
      content_it: "La Lega Italiana di Basket (Serie A) ha annunciato una partnership storica con un importante operatore di scommesse regolamentato, segnando il primo grande accordo di sponsorizzazione nella storia del basket italiano. L'accordo triennale vedrà la società di scommesse diventare il partner ufficiale della lega, con un focus su iniziative di gioco responsabile e maggiore coinvolgimento dei tifosi attraverso esperienze di scommesse interattive. La partnership include programmi educativi sul gioco responsabile, funzionalità di scommesse live durante le partite e contenuti esclusivi per i tifosi del basket. Il presidente della lega Umberto Gandini ha sottolineato che l'accordo aiuterà a far crescere la popolarità del basket in Italia mantenendo i più alti standard di protezione dei giocatori e dei tifosi.",
      coverImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      category: "Basketball",
      featured: 0
    };
    this.createNews(sportsNews2);

    const sportsNews3: InsertNews = {
      title_en: "Winter Olympics 2026: Milan-Cortina Betting Markets Open Early",
      title_it: "Olimpiadi Invernali 2026: I Mercati di Scommesse Milano-Cortina Aprono in Anticipo",
      slug: "winter-olympics-2026-milan-cortina-betting-markets-open-early",
      summary_en: "Italian operators launch early betting markets for the 2026 Winter Olympics, with home advantage boosting Italian athletes' odds.",
      summary_it: "Gli operatori italiani lanciano mercati di scommesse anticipati per le Olimpiadi Invernali 2026, con il vantaggio di casa che migliora le quote degli atleti italiani.",
      content_en: "With just over a year until the 2026 Winter Olympics in Milan and Cortina, Italian betting operators have launched early markets for the games, generating significant interest from sports bettors. Italian athletes are receiving favorable odds due to home advantage, with figure skater Matteo Rizzo at 5/1 for gold and the ski jumping team at 7/2 for a podium finish. The early launch of Olympic betting markets reflects the growing excitement in Italy for hosting the games, with operators reporting that Winter Olympics futures are already accounting for 8% of all long-term sports betting activity. Special markets including 'Most Medals by Italy' and 'Olympic Venue Atmosphere' have been particularly popular with Italian bettors.",
      content_it: "Con poco più di un anno alle Olimpiadi Invernali 2026 a Milano e Cortina, gli operatori di scommesse italiani hanno lanciato mercati anticipati per i giochi, generando un interesse significativo dai scommettitori sportivi. Gli atleti italiani stanno ricevendo quote favorevoli grazie al vantaggio di casa, con il pattinatore artistico Matteo Rizzo a 5/1 per l'oro e la squadra di salto con gli sci a 7/2 per un posto sul podio. Il lancio anticipato dei mercati di scommesse olimpiche riflette la crescente eccitazione in Italia per l'ospitalità dei giochi, con operatori che riportano che i future delle Olimpiadi Invernali rappresentano già l'8% di tutta l'attività di scommesse sportive a lungo termine. I mercati speciali tra cui 'Più Medaglie dall'Italia' e 'Atmosfera delle Sedi Olimpiche' sono stati particolarmente popolari tra i scommettitori italiani.",
      coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      category: "Winter Olympics",
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

    // Add demo advertisement banners - one per side (disabled by default)
    const leftBanner: InsertAdvertisementBanner = {
      title: "Casino Bonus 200%",
      imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400&q=80",
      clickUrl: "https://example-casino.com/bonus",
      position: "left",
      isActive: false,
      order: 1
    };
    this.createAdvertisementBanner(leftBanner);

    const rightBanner: InsertAdvertisementBanner = {
      title: "Live Casino Experience",
      imageUrl: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400&q=80",
      clickUrl: "https://example-livecasino.com/play",
      position: "right",
      isActive: false,
      order: 1
    };
    this.createAdvertisementBanner(rightBanner);
  }
  
  // Games methods
  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }
  
  async getFeaturedGames(): Promise<Game[]> {
    const featuredGames = Array.from(this.games.values()).filter(game => game.featured === 1);
    
    // Custom sort order: Sisal, Pokerstars, Snai, Lottomatica, Betfair, Netwin, Eurobet, Goldbet
    const sortOrder = ['sisal', 'pokerstars', 'snai', 'lottomatica', 'betfair', 'netwin', 'eurobet', 'goldbet'];
    
    return featuredGames.sort((a, b) => {
      const aIndex = sortOrder.indexOf(a.slug);
      const bIndex = sortOrder.indexOf(b.slug);
      
      // If both games are in the sort order, sort by their position
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      // If only one is in the sort order, prioritize it
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      
      // If neither is in the sort order, maintain original order
      return 0;
    });
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
    const cacheAge = now - this.newsCacheTimestamp;
    
    // If cache is valid, return immediately (within 20 minutes)
    if (this.cachedNews && cacheAge < this.CACHE_DURATION) {
      const remainingTime = Math.round((this.CACHE_DURATION - cacheAge) / 1000 / 60);
      console.log(`Using cached news data (expires in ${remainingTime} minutes)`);
      return;
    }
    
    // If already loading, wait for it to complete
    if (this.isLoadingNews) {
      console.log('News cache refresh already in progress, waiting...');
      // Wait for the current load to complete
      while (this.isLoadingNews) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }
    
    // Cache expired or doesn't exist - refresh it
    if (this.cachedNews) {
      console.log(`News cache expired (age: ${Math.round(cacheAge / 1000 / 60)} minutes), refreshing...`);
    } else {
      console.log('No cached news found, loading fresh data...');
    }
    
    await this.loadCachedNews();
  }

  private async loadCachedNews(): Promise<void> {
    if (this.isLoadingNews) return;
    
    this.isLoadingNews = true;
    try {
      console.log('Refreshing news cache from GNews API...');
      const { fetchGNews, convertGNewsToNews } = await import('./services/gnews');
      const articles = await fetchGNews('sports', 'it');
      
      // Filter for diverse content - avoid repetitive articles about same people
      const diverseArticles = this.filterDiverseContent(articles);
      
      // Convert to news format - use only authentic GNews content
      const gNewsArticles = diverseArticles.map((article, index) => convertGNewsToNews(article, index));
      
      // Use only authentic GNews articles
      this.cachedNews = gNewsArticles;
      this.newsCacheTimestamp = Date.now();
      console.log(`News cache refreshed successfully with ${gNewsArticles.length} diverse authentic GNews articles`);
    } catch (error) {
      console.error('Error fetching news from GNews API:', error);
      // No fallback - show empty if API fails to maintain authentic content only
      this.cachedNews = [];
      this.newsCacheTimestamp = Date.now();
      console.log('GNews API failed - no fallback to maintain authentic content only');
    } finally {
      this.isLoadingNews = false;
    }
  }

  private filterDiverseContent(articles: any[]): any[] {
    const usedNames = new Set<string>();
    const usedKeywords = new Set<string>();
    const diverseArticles: any[] = [];
    
    // Common Italian sports names to detect repetition
    const commonSportsNames = [
      'sinner', 'jannik', 'berrettini', 'musetti', 'sonego',
      'yates', 'simon', 'pogacar', 'roglic', 'vingegaard',
      'leclerc', 'sainz', 'verstappen', 'hamilton', 'russell',
      'chiesa', 'barella', 'donnarumma', 'verratti', 'insigne',
      'healy', 'modric', 'tour de france', 'tour', 'giro'
    ];
    
    // Common keywords to detect similar topics
    const topicKeywords = [
      'tour de france', 'giro d\'italia', 'champions league', 'serie a',
      'formula 1', 'motogp', 'tennis', 'basket', 'volley', 'nuoto'
    ];
    
    for (const article of articles) {
      const title = article.title.toLowerCase();
      const description = (article.description || '').toLowerCase();
      const fullText = `${title} ${description}`;
      
      // Check if this article mentions names already used
      let hasRepeatedName = false;
      for (const name of commonSportsNames) {
        if (fullText.includes(name)) {
          if (usedNames.has(name)) {
            hasRepeatedName = true;
            break;
          }
          usedNames.add(name);
        }
      }
      
      // Check for repeated topic keywords
      let hasRepeatedTopic = false;
      for (const keyword of topicKeywords) {
        if (fullText.includes(keyword)) {
          if (usedKeywords.has(keyword)) {
            hasRepeatedTopic = true;
            break;
          }
          usedKeywords.add(keyword);
        }
      }
      
      // Only add if no repeated names AND topics (be less restrictive)
      if (!hasRepeatedName || !hasRepeatedTopic) {
        diverseArticles.push(article);
      }
      
      // Stop when we have enough diverse articles (ensure 10+ for news page)
      if (diverseArticles.length >= 12) break;
    }
    
    return diverseArticles;
  }

  async refreshNewsCache(): Promise<void> {
    const now = Date.now();
    if (this.newsCacheTimestamp && (now - this.newsCacheTimestamp) < this.CACHE_DURATION) {
      console.log('News cache refresh skipped - cache still valid');
      return;
    }
    console.log('Refreshing news cache with diverse GNews content...');
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
      isActive: banner.isActive ?? false,
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
