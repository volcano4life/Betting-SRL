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
      title: "The Legend of Zelda: Tears of the Kingdom",
      slug: "legend-of-zelda-tears-of-the-kingdom",
      description: "The sequel to Breath of the Wild takes everything that made the original special and expands on it in meaningful ways. Link's new abilities transform the gameplay, allowing for unprecedented creativity in how you approach challenges.",
      coverImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=800&q=80",
      releaseDate: new Date("2023-05-12"),
      platforms: ["Nintendo Switch"],
      genres: ["Action", "Adventure"],
      overallRating: 9.8,
      gameplayRating: 9.8,
      graphicsRating: 9.0,
      storyRating: 9.5,
      valueRating: 10.0,
      featured: 1
    };
    this.createGame(game1);
    
    const game2: InsertGame = {
      title: "Baldur's Gate 3",
      slug: "baldurs-gate-3",
      description: "A storytelling masterpiece that sets a new standard for RPGs with its deep character development and reactive world.",
      coverImage: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
      releaseDate: new Date("2023-08-03"),
      platforms: ["PC", "PlayStation 5"],
      genres: ["RPG"],
      overallRating: 9.7,
      gameplayRating: 9.6,
      graphicsRating: 9.5,
      storyRating: 9.9,
      valueRating: 9.8,
      featured: 1
    };
    this.createGame(game2);
    
    const game3: InsertGame = {
      title: "Elden Ring",
      slug: "elden-ring",
      description: "FromSoftware's open-world masterpiece that redefines exploration with its vast landscapes and challenging combat.",
      coverImage: "https://images.unsplash.com/photo-1620336655055-088d06e36bf0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
      releaseDate: new Date("2022-02-25"),
      platforms: ["PC", "PlayStation 5", "Xbox Series X"],
      genres: ["Action RPG"],
      overallRating: 9.6,
      gameplayRating: 9.7,
      graphicsRating: 9.3,
      storyRating: 9.4,
      valueRating: 9.8,
      featured: 0
    };
    this.createGame(game3);
    
    // Sample reviews
    const review1: InsertReview = {
      gameId: 1,
      title: "The Legend of Zelda: Tears of the Kingdom Review",
      slug: "legend-of-zelda-tears-of-the-kingdom-review",
      summary: "Nintendo delivers another masterpiece that redefines open-world adventure games.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies ultricies, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl nec ultricies ultricies, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
      coverImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=800&q=80",
      rating: 9.8,
      featured: 1
    };
    this.createReview(review1);
    
    // Add news samples
    const news1: InsertNews = {
      title: "Sony Officially Announces PS5 Pro for 2024 Release",
      slug: "sony-announces-ps5-pro-2024-release",
      summary: "Sony has finally confirmed the existence of the PS5 Pro, promising significant performance improvements and enhanced ray tracing capabilities.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies ultricies, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl nec ultricies ultricies, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
      coverImage: "https://images.unsplash.com/photo-1575792324513-3441e9a08224?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
      category: "News",
      featured: 1
    };
    this.createNews(news1);
    
    // Add guides
    const guide1: InsertGuide = {
      title: "Starfield: 10 Essential Tips for New Players",
      slug: "starfield-essential-tips-new-players",
      summary: "Navigate Bethesda's massive space RPG with confidence using these beginner-friendly tips and tricks.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies ultricies, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl nec ultricies ultricies, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
      coverImage: "https://images.unsplash.com/photo-1564049489314-60d154ff107d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
      difficulty: "BEGINNER",
      category: "Guides"
    };
    this.createGuide(guide1);
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
