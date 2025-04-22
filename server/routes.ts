import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertSubscriberSchema, 
  insertGameSchema, 
  insertReviewSchema, 
  insertNewsSchema,
  insertGuideSchema,
  insertPromoCodeSchema
} from "@shared/schema";
import { setupAuth, seedAdminUser } from "./auth";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { games, reviews, news, guides, promoCodes } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  const { requireAdmin, requireSiteOwner } = setupAuth(app);
  
  // Seed admin user
  await seedAdminUser();
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

  // ====== ADMIN ROUTES ======
  
  // PromoCode endpoints - requires admin auth
  app.get('/api/admin/promo-codes', requireAdmin, async (req, res) => {
    try {
      const result = await db.select().from(promoCodes).orderBy(promoCodes.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching promo codes', error });
    }
  });

  app.get('/api/admin/promo-codes/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const [result] = await db.select().from(promoCodes).where(eq(promoCodes.id, id));
      if (!result) {
        return res.status(404).json({ message: 'Promo code not found' });
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching promo code', error });
    }
  });

  app.post('/api/admin/promo-codes', requireAdmin, async (req, res) => {
    try {
      const parsedData = insertPromoCodeSchema.parse(req.body);
      const [result] = await db.insert(promoCodes).values(parsedData).returning();
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: 'Invalid promo code data', error });
    }
  });

  app.put('/api/admin/promo-codes/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsedData = insertPromoCodeSchema.parse(req.body);
      const [result] = await db
        .update(promoCodes)
        .set(parsedData)
        .where(eq(promoCodes.id, id))
        .returning();
      
      if (!result) {
        return res.status(404).json({ message: 'Promo code not found' });
      }
      
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: 'Invalid promo code data', error });
    }
  });

  app.delete('/api/admin/promo-codes/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const [result] = await db
        .delete(promoCodes)
        .where(eq(promoCodes.id, id))
        .returning();
        
      if (!result) {
        return res.status(404).json({ message: 'Promo code not found' });
      }
      
      res.json({ message: 'Promo code deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting promo code', error });
    }
  });

  // Games admin endpoints
  app.get('/api/admin/games', requireAdmin, async (req, res) => {
    try {
      const result = await db.select().from(games).orderBy(games.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching games', error });
    }
  });

  app.post('/api/admin/games', requireAdmin, async (req, res) => {
    try {
      const parsedData = insertGameSchema.parse(req.body);
      const [result] = await db.insert(games).values(parsedData).returning();
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: 'Invalid game data', error });
    }
  });

  app.put('/api/admin/games/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsedData = insertGameSchema.parse(req.body);
      const [result] = await db
        .update(games)
        .set(parsedData)
        .where(eq(games.id, id))
        .returning();
      
      if (!result) {
        return res.status(404).json({ message: 'Game not found' });
      }
      
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: 'Invalid game data', error });
    }
  });

  app.delete('/api/admin/games/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const [result] = await db
        .delete(games)
        .where(eq(games.id, id))
        .returning();
        
      if (!result) {
        return res.status(404).json({ message: 'Game not found' });
      }
      
      res.json({ message: 'Game deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting game', error });
    }
  });

  // Reviews admin endpoints
  app.get('/api/admin/reviews', requireAdmin, async (req, res) => {
    try {
      const result = await db.select().from(reviews).orderBy(reviews.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching reviews', error });
    }
  });

  app.post('/api/admin/reviews', requireAdmin, async (req, res) => {
    try {
      const parsedData = insertReviewSchema.parse(req.body);
      const [result] = await db.insert(reviews).values(parsedData).returning();
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: 'Invalid review data', error });
    }
  });

  app.put('/api/admin/reviews/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsedData = insertReviewSchema.parse(req.body);
      const [result] = await db
        .update(reviews)
        .set(parsedData)
        .where(eq(reviews.id, id))
        .returning();
      
      if (!result) {
        return res.status(404).json({ message: 'Review not found' });
      }
      
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: 'Invalid review data', error });
    }
  });

  app.delete('/api/admin/reviews/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const [result] = await db
        .delete(reviews)
        .where(eq(reviews.id, id))
        .returning();
        
      if (!result) {
        return res.status(404).json({ message: 'Review not found' });
      }
      
      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting review', error });
    }
  });

  // News admin endpoints
  app.get('/api/admin/news', requireAdmin, async (req, res) => {
    try {
      const result = await db.select().from(news).orderBy(news.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching news', error });
    }
  });

  app.post('/api/admin/news', requireAdmin, async (req, res) => {
    try {
      const parsedData = insertNewsSchema.parse(req.body);
      const [result] = await db.insert(news).values(parsedData).returning();
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: 'Invalid news data', error });
    }
  });

  app.put('/api/admin/news/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsedData = insertNewsSchema.parse(req.body);
      const [result] = await db
        .update(news)
        .set(parsedData)
        .where(eq(news.id, id))
        .returning();
      
      if (!result) {
        return res.status(404).json({ message: 'News item not found' });
      }
      
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: 'Invalid news data', error });
    }
  });

  app.delete('/api/admin/news/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const [result] = await db
        .delete(news)
        .where(eq(news.id, id))
        .returning();
        
      if (!result) {
        return res.status(404).json({ message: 'News item not found' });
      }
      
      res.json({ message: 'News item deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting news item', error });
    }
  });

  // Guides admin endpoints
  app.get('/api/admin/guides', requireAdmin, async (req, res) => {
    try {
      const result = await db.select().from(guides).orderBy(guides.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching guides', error });
    }
  });

  app.post('/api/admin/guides', requireAdmin, async (req, res) => {
    try {
      const parsedData = insertGuideSchema.parse(req.body);
      const [result] = await db.insert(guides).values(parsedData).returning();
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: 'Invalid guide data', error });
    }
  });

  app.put('/api/admin/guides/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsedData = insertGuideSchema.parse(req.body);
      const [result] = await db
        .update(guides)
        .set(parsedData)
        .where(eq(guides.id, id))
        .returning();
      
      if (!result) {
        return res.status(404).json({ message: 'Guide not found' });
      }
      
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: 'Invalid guide data', error });
    }
  });

  app.delete('/api/admin/guides/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const [result] = await db
        .delete(guides)
        .where(eq(guides.id, id))
        .returning();
        
      if (!result) {
        return res.status(404).json({ message: 'Guide not found' });
      }
      
      res.json({ message: 'Guide deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting guide', error });
    }
  });
  
  // ====== ADMINISTRATOR MANAGEMENT ROUTES ======
  
  // Get all users (only accessible to admins)
  app.get('/api/admin/users', requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove password from response
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  });
  
  // Block/unblock a user (only site owner can block other admins)
  app.put('/api/admin/users/:id/block', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { isBlocked } = req.body;
      
      // Check if target user exists
      const targetUser = await storage.getUser(id);
      if (!targetUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Only the site owner (admin) can block/unblock other admins
      if (targetUser.isAdmin && req.user.username !== 'admin') {
        return res.status(403).json({ message: 'Only the site owner can block other administrators' });
      }
      
      // Prevent blocking the site owner (admin)
      if (targetUser.username === 'admin') {
        return res.status(403).json({ message: 'The site owner cannot be blocked' });
      }
      
      // Update user status
      const updatedUser = await storage.updateUserStatus(id, isBlocked);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user status', error });
    }
  });
  
  // Approve an admin user (only site owner can approve)
  app.put('/api/admin/users/:id/approve', requireSiteOwner, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if target user exists
      const targetUser = await storage.getUser(id);
      if (!targetUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // If user is already an admin, return error
      if (targetUser.isAdmin) {
        return res.status(400).json({ message: 'User is already an administrator' });
      }
      
      // Approve admin
      const updatedUser = await storage.approveAdmin(id);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Error approving administrator', error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
