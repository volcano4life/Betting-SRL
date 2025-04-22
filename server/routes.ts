import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubscriberSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = app.route('/api');
  
  // Games endpoints
  app.get('/api/games', async (req, res) => {
    const games = await storage.getAllGames();
    res.json(games);
  });
  
  app.get('/api/games/featured', async (req, res) => {
    const featuredGames = await storage.getFeaturedGames();
    res.json(featuredGames);
  });
  
  app.get('/api/games/top-rated', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const topRatedGames = await storage.getTopRatedGames(limit);
    res.json(topRatedGames);
  });
  
  app.get('/api/games/:slug', async (req, res) => {
    const game = await storage.getGameBySlug(req.params.slug);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  });
  
  // Reviews endpoints
  app.get('/api/reviews', async (req, res) => {
    const reviews = await storage.getAllReviews();
    res.json(reviews);
  });
  
  app.get('/api/reviews/latest', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
    const latestReviews = await storage.getLatestReviews(limit);
    res.json(latestReviews);
  });
  
  app.get('/api/reviews/featured', async (req, res) => {
    const featuredReviews = await storage.getFeaturedReviews();
    res.json(featuredReviews);
  });
  
  app.get('/api/reviews/:slug', async (req, res) => {
    const review = await storage.getReviewBySlug(req.params.slug);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Get game info
    const game = await storage.getGameById(review.gameId);
    
    res.json({ review, game });
  });
  
  app.get('/api/games/:gameId/reviews', async (req, res) => {
    const gameId = parseInt(req.params.gameId);
    const reviews = await storage.getReviewsByGameId(gameId);
    res.json(reviews);
  });
  
  // News endpoints
  app.get('/api/news', async (req, res) => {
    const news = await storage.getAllNews();
    res.json(news);
  });
  
  app.get('/api/news/latest', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const latestNews = await storage.getLatestNews(limit);
    res.json(latestNews);
  });
  
  app.get('/api/news/:slug', async (req, res) => {
    const newsItem = await storage.getNewsBySlug(req.params.slug);
    if (!newsItem) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(newsItem);
  });
  
  // Guides endpoints
  app.get('/api/guides', async (req, res) => {
    const guides = await storage.getAllGuides();
    res.json(guides);
  });
  
  app.get('/api/guides/latest', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
    const latestGuides = await storage.getLatestGuides(limit);
    res.json(latestGuides);
  });
  
  app.get('/api/guides/:slug', async (req, res) => {
    const guide = await storage.getGuideBySlug(req.params.slug);
    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }
    res.json(guide);
  });
  
  // Search endpoint
  app.get('/api/search', async (req, res) => {
    const query = req.query.q as string;
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const results = await storage.search(query);
    res.json(results);
  });
  
  // Newsletter subscription
  app.post('/api/subscribe', async (req, res) => {
    try {
      const parsedData = insertSubscriberSchema.parse(req.body);
      const subscriber = await storage.addSubscriber(parsedData);
      res.status(201).json({ message: 'Successfully subscribed', subscriber });
    } catch (error) {
      res.status(400).json({ message: 'Invalid subscriber data', error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
