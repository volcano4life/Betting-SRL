import { 
  Game, InsertGame, 
  Review, InsertReview, 
  News, InsertNews, 
  Guide, InsertGuide, 
  Subscriber, InsertSubscriber 
} from "@shared/schema";

export interface IStorage {
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
  
  // Guides
  getAllGuides(): Promise<Guide[]>;
  getLatestGuides(limit?: number): Promise<Guide[]>;
  getGuideBySlug(slug: string): Promise<Guide | undefined>;
  getGuideById(id: number): Promise<Guide | undefined>;
  createGuide(guide: InsertGuide): Promise<Guide>;
  
  // Subscribers
  addSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  
  // Search
  search(query: string): Promise<{
    games: Game[];
    reviews: Review[];
    news: News[];
    guides: Guide[];
  }>;
}

export class MemStorage implements IStorage {
  private games: Map<number, Game>;
  private reviews: Map<number, Review>;
  private news: Map<number, News>;
  private guides: Map<number, Guide>;
  private subscribers: Map<number, Subscriber>;
  
  private gameId: number;
  private reviewId: number;
  private newsId: number;
  private guideId: number;
  private subscriberId: number;
  
  constructor() {
    this.games = new Map();
    this.reviews = new Map();
    this.news = new Map();
    this.guides = new Map();
    this.subscribers = new Map();
    
    this.gameId = 1;
    this.reviewId = 1;
    this.newsId = 1;
    this.guideId = 1;
    this.subscriberId = 1;
    
    // Add some initial data
    this.initializeData();
  }
  
  private initializeData() {
    // Initialize with sample game
    const game1: InsertGame = {
      title: "Starcasino",
      slug: "starcasino",
      description: "Starcasino is a premier Italian online casino offering a comprehensive selection of games, generous bonuses, and excellent customer support.",
      coverImage: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=800&q=80",
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
      title: "888Casino",
      slug: "888casino",
      description: "888Casino offers Italian players a secure and entertaining gaming environment with a wide range of casino games and sports betting options.",
      coverImage: "https://images.unsplash.com/photo-1596838132731-3301c3fd4527?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
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
      title: "LeoVegas",
      slug: "leovegas",
      description: "LeoVegas stands out for its exceptional mobile casino experience, offering thousands of games and a user-friendly interface optimized for on-the-go play.",
      coverImage: "https://images.unsplash.com/photo-1560415755-bd80d06eda60?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
      releaseDate: new Date("2022-02-25"),
      platforms: ["Desktop", "Mobile", "App"],
      genres: ["Slots", "Live Casino", "Sports Betting"],
      overallRating: 9.6,
      gameplayRating: 9.7,
      graphicsRating: 9.3,
      storyRating: 9.4,
      valueRating: 9.8,
      featured: 0
    };
    this.createGame(game3);
    
    // Sample casino reviews
    const review1: InsertReview = {
      gameId: 1,
      title: "Starcasino Review: Italy's Premier Online Casino Experience",
      slug: "starcasino-review-italy-premier-online-casino",
      summary: "Starcasino delivers an exceptional gaming experience with a vast selection of slots and generous welcome bonuses.",
      content: "Starcasino stands out as one of Italy's top online gambling destinations. With over 2,000 slot games from providers like NetEnt and Playtech, a comprehensive live dealer section, and a user-friendly mobile app, it caters to all types of players. New users can claim a welcome bonus of up to €500 plus 200 free spins, with reasonable 35x wagering requirements. Customer support is available 24/7 in Italian and English, and the platform offers secure payment methods including PayPal, credit cards, and bank transfers.",
      coverImage: "https://images.unsplash.com/photo-1566694271453-390536dd1f0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=800&q=80",
      rating: 9.8,
      featured: 1
    };
    this.createReview(review1);

    const review2: InsertReview = {
      gameId: 2,
      title: "888Casino: The Complete Italian Player's Guide",
      slug: "888casino-italian-players-guide",
      summary: "888Casino combines excellent game variety with outstanding bonuses and promotions for Italian players.",
      content: "888Casino has established itself as a leading option for Italian gamblers seeking quality entertainment. The platform holds all necessary licenses for operation in Italy and offers a clean, modern interface that's simple to navigate. With a welcome bonus of 100% up to €200 and frequent reload bonuses, players have plenty of incentives. The game selection includes over 1,000 slots, numerous table games, and an award-winning poker platform. Mobile gameplay is smooth across all devices, and withdrawals are processed efficiently within 24-48 hours.",
      coverImage: "https://images.unsplash.com/photo-1518895312237-a9e23508fd43?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=800&q=80",
      rating: 9.2,
      featured: 0
    };
    this.createReview(review2);
    
    // Add casino news samples
    const news1: InsertNews = {
      title: "Italian Gambling Authority Announces Stricter Regulations for 2024",
      slug: "italian-gambling-authority-stricter-regulations-2024",
      summary: "New regulations aimed at enhancing player protection will require additional identity verification steps and deposit limits.",
      content: "The Italian gambling regulatory authority (ADM) has announced significant changes to online gambling regulations, set to take effect in early 2024. The new framework will require operators to implement stricter identity verification procedures, mandatory deposit limits that players must set before gambling, and enhanced self-exclusion options. While the measures aim to combat problem gambling, industry experts suggest they may impact the user experience with additional verification steps. Licensed operators, including major brands like Starcasino and 888, have six months to implement the required changes.",
      coverImage: "https://images.unsplash.com/photo-1563237023-b1e970526dcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
      category: "Regulation",
      featured: 1
    };
    this.createNews(news1);

    const news2: InsertNews = {
      title: "Exclusive: LeoVegas Launches 'Leo Millions' €5M Guaranteed Jackpot",
      slug: "leovegas-launches-leo-millions-jackpot",
      summary: "LeoVegas introduces a new progressive jackpot slot with a minimum guaranteed prize pool of €5 million.",
      content: "LeoVegas has announced the launch of 'Leo Millions,' a proprietary progressive jackpot slot game with a guaranteed minimum prize pool of €5 million. The exclusive game, developed in partnership with Play'n GO, will be available only to Italian players for the first month before expanding to other European markets. The launch is accompanied by a promotion offering 50 free spins to all players who deposit €20 or more between October 15-31. Industry analysts note this represents one of the largest guaranteed jackpots ever offered by an online casino operating in the Italian market.",
      coverImage: "https://images.unsplash.com/photo-1605870445919-838d190e8e1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
      category: "Promotions",
      featured: 0
    };
    this.createNews(news2);
    
    // Add betting guides
    const guide1: InsertGuide = {
      title: "Roulette Strategy Guide: Mastering the Most Popular Casino Table Game",
      slug: "roulette-strategy-guide-mastering-casino-table-game",
      summary: "Learn proven roulette strategies including the Martingale, Fibonacci, and D'Alembert systems to maximize your chances of winning.",
      content: "Roulette remains one of the most popular casino games in Italy, combining simplicity with excitement. This comprehensive guide covers everything from understanding the European, American, and French roulette variations to implementing betting strategies that can improve your odds. We explain the mathematics behind the Martingale system (doubling your bet after each loss), the more conservative Fibonacci approach (following the Fibonacci sequence for bet sizes), and the D'Alembert strategy (increasing bets by one unit after losses). The guide also includes bankroll management techniques and explains when each strategy is most appropriate based on your risk tolerance.",
      coverImage: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
      difficulty: "INTERMEDIATE",
      category: "Casino Guides"
    };
    this.createGuide(guide1);

    const guide2: InsertGuide = {
      title: "Serie A Betting Guide: Expert Tips for the 2023-24 Season",
      slug: "serie-a-betting-guide-expert-tips-2023-24-season",
      summary: "Maximize your Serie A betting success with our expert analysis, team insights, and strategic betting approaches.",
      content: "This comprehensive Serie A betting guide provides everything you need to know before placing wagers on Italy's top football league. We analyze the strengths and weaknesses of title contenders including Inter Milan, AC Milan, Juventus, and Napoli, with detailed statistical insights on home/away performance, scoring patterns, and defensive solidity. The guide includes expert tips on identifying value bets, leveraging Asian handicap markets, and utilizing in-play betting opportunities. We also cover the impact of European competition schedules on domestic performance and identify promising mid-table teams that consistently offer value against the betting spread.",
      coverImage: "https://images.unsplash.com/photo-1610215078970-51f8395af5e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
      difficulty: "ADVANCED",
      category: "Sports Betting"
    };
    this.createGuide(guide2);
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
    return Array.from(this.news.values());
  }
  
  async getLatestNews(limit: number = 5): Promise<News[]> {
    return Array.from(this.news.values())
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, limit);
  }
  
  async getNewsBySlug(slug: string): Promise<News | undefined> {
    return Array.from(this.news.values()).find(news => news.slug === slug);
  }
  
  async getNewsById(id: number): Promise<News | undefined> {
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
  
  // Search functionality
  async search(query: string): Promise<{
    games: Game[];
    reviews: Review[];
    news: News[];
    guides: Guide[];
  }> {
    const lowerQuery = query.toLowerCase();
    
    const games = Array.from(this.games.values()).filter(game => 
      game.title.toLowerCase().includes(lowerQuery) || 
      game.description.toLowerCase().includes(lowerQuery)
    );
    
    const reviews = Array.from(this.reviews.values()).filter(review => 
      review.title.toLowerCase().includes(lowerQuery) || 
      review.summary.toLowerCase().includes(lowerQuery) ||
      review.content.toLowerCase().includes(lowerQuery)
    );
    
    const news = Array.from(this.news.values()).filter(news => 
      news.title.toLowerCase().includes(lowerQuery) || 
      news.summary.toLowerCase().includes(lowerQuery) ||
      news.content.toLowerCase().includes(lowerQuery)
    );
    
    const guides = Array.from(this.guides.values()).filter(guide => 
      guide.title.toLowerCase().includes(lowerQuery) || 
      guide.summary.toLowerCase().includes(lowerQuery) ||
      guide.content.toLowerCase().includes(lowerQuery)
    );
    
    return { games, reviews, news, guides };
  }
}

export const storage = new MemStorage();
