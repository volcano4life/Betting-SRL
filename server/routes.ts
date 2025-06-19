import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { 
  insertSubscriberSchema, 
  insertGameSchema, 
  insertReviewSchema, 
  insertNewsSchema,
  insertGuideSchema,
  insertPromoCodeSchema,
  insertOutletSchema
} from "@shared/schema";
import { setupAuth, seedAdminUser } from "./auth";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { games, reviews, news, guides, promoCodes, outlets } from "@shared/schema";
import { log } from "./vite";
import { 
  sendWelcomeEmail, 
  sendSubscriptionConfirmation, 
  sendPromoCodeNotification,
  sendPasswordResetEmail,
  sendAdminInvitationEmail 
} from "./services/email";
import { fetchGNews, convertGNewsToNews } from "./services/gnews";

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

  // Sports news endpoint - fetches real Italian sports news from GNews API
  app.get('/api/sports-news', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      
      // Fetch real sports news from GNews API
      const gNewsArticles = await fetchGNews('sports', 'it');
      
      // Convert to our news format and limit results
      const sportsNews = gNewsArticles
        .slice(0, limit)
        .map((article, index) => convertGNewsToNews(article, index));
      
      res.json(sportsNews);
    } catch (error) {
      console.error('Error fetching sports news from GNews:', error);
      
      // Fallback to sample data only if API fails
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const allNews = await storage.getLatestNews(20);
      
      const sportsKeywords = ['sport', 'calcio', 'football', 'soccer', 'tennis', 'basketball', 'serie', 'champions', 'uefa', 'fifa', 'atletico', 'juventus', 'milan', 'inter'];
      const fallbackNews = allNews.filter(news => {
        const searchText = `${news.category} ${news.title_en} ${news.title_it} ${news.summary_en} ${news.summary_it}`.toLowerCase();
        return sportsKeywords.some(keyword => searchText.includes(keyword));
      }).slice(0, limit);
      
      res.json(fallbackNews);
    }
  });

  // Get single news article by slug
  app.get('/api/news/:slug', async (req, res) => {
    try {
      const news = await storage.getNewsBySlug(req.params.slug);
      if (!news) {
        return res.status(404).json({ message: 'News article not found' });
      }
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch news article' });
    }
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
      
      // Send confirmation email if email is provided
      if (subscriber.email) {
        const language = req.query.lang as string || 'en';
        sendSubscriptionConfirmation(subscriber.email, language)
          .then(sent => {
            if (sent) {
              log(`Subscription confirmation email sent to ${subscriber.email}`, 'email');
            } else {
              log(`Failed to send subscription confirmation email to ${subscriber.email}`, 'email');
            }
          })
          .catch(err => {
            log(`Error sending subscription confirmation: ${err}`, 'email');
          });
      }
      
      res.status(201).json({ message: 'Successfully subscribed', subscriber });
    } catch (error) {
      res.status(400).json({ message: 'Invalid subscriber data', error });
    }
  });
  
  // Promo codes public endpoints
  app.get('/api/promo-codes/active', async (req, res) => {
    try {
      const promoCodes = await storage.getActivePromoCodes();
      res.json(promoCodes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching active promo codes', error });
    }
  });
  
  app.get('/api/promo-codes/featured', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const promoCodes = await storage.getFeaturedPromoCodes(limit);
      res.json(promoCodes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching featured promo codes', error });
    }
  });

  // ====== ADMIN ROUTES ======
  
  // PromoCode endpoints - requires admin auth
  app.get('/api/admin/promo-codes', requireAdmin, async (req, res) => {
    try {
      const promoCodes = await storage.getAllPromoCodes();
      res.json(promoCodes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching promo codes', error });
    }
  });

  app.get('/api/admin/promo-codes/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.getPromoCodeById(id);
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
      const result = await storage.createPromoCode(parsedData);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: 'Invalid promo code data', error });
    }
  });

  app.put('/api/admin/promo-codes/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsedData = insertPromoCodeSchema.parse(req.body);
      const result = await storage.updatePromoCode(id, parsedData);
      res.json(result);
    } catch (error) {
      if (error.message === "Promo code not found") {
        return res.status(404).json({ message: 'Promo code not found' });
      }
      res.status(400).json({ message: 'Invalid promo code data', error });
    }
  });

  app.delete('/api/admin/promo-codes/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePromoCode(id);
      res.json({ message: 'Promo code deleted successfully' });
    } catch (error) {
      if (error.message === "Promo code not found") {
        return res.status(404).json({ message: 'Promo code not found' });
      }
      res.status(500).json({ message: 'Error deleting promo code', error });
    }
  });

  // Games admin endpoints
  app.get('/api/admin/games', requireAdmin, async (req, res) => {
    try {
      const result = await storage.getAllGames();
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching games', error });
    }
  });
  
  app.get('/api/admin/games/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const game = await storage.getGameById(id);
      
      if (!game) {
        return res.status(404).json({ message: 'Game not found' });
      }
      
      res.json(game);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching game', error });
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
      const result = await storage.getAllReviews();
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching reviews', error });
    }
  });
  
  app.get('/api/admin/reviews/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const review = await storage.getReviewById(id);
      
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
      
      res.json(review);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching review', error });
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
      const result = await storage.getAllNews();
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching news', error });
    }
  });
  
  app.get('/api/admin/news/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const newsItem = await storage.getNewsById(id);
      
      if (!newsItem) {
        return res.status(404).json({ message: 'News item not found' });
      }
      
      res.json(newsItem);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching news item', error });
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
      const result = await storage.getAllGuides();
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching guides', error });
    }
  });
  
  app.get('/api/admin/guides/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const guide = await storage.getGuideById(id);
      
      if (!guide) {
        return res.status(404).json({ message: 'Guide not found' });
      }
      
      res.json(guide);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching guide', error });
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
  
  // Invite a new administrator (only site owner can invite)
  app.post('/api/admin/users/invite', requireSiteOwner, async (req, res) => {
    try {
      const { username, password, email } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      // Create the new administrator (pending approval)
      const newAdmin = await storage.createUser({
        username,
        password,
        isAdmin: false, // Will be approved later
        pendingApproval: true
      });
      
      // Remove password from response
      const { password: _, ...adminWithoutPassword } = newAdmin;
      
      // Send invitation email if email provided
      if (email) {
        const language = req.query.lang as string || 'en';
        sendAdminInvitationEmail(email, username, password, language)
          .then(sent => {
            if (sent) {
              log(`Admin invitation email sent to ${email}`, 'email');
            } else {
              log(`Failed to send admin invitation email to ${email}`, 'email');
            }
          })
          .catch(err => {
            log(`Error sending admin invitation: ${err}`, 'email');
          });
      }
      
      res.status(201).json(adminWithoutPassword);
    } catch (error) {
      console.error('Error inviting admin:', error);
      res.status(500).json({ message: 'Error inviting administrator', error });
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
      const { role } = req.body;
      
      // Check if target user exists
      const targetUser = await storage.getUser(id);
      if (!targetUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // If user is already an admin, return error
      if (targetUser.isAdmin) {
        return res.status(400).json({ message: 'User is already an administrator' });
      }
      
      // Approve admin with role
      const updatedUser = await storage.approveAdmin(id, role);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Error approving administrator', error });
    }
  });

  // ====== BETTING OUTLETS ROUTES ======

  // Get all active outlets for the public slideshow
  app.get('/api/outlets', async (req, res) => {
    try {
      const outlets = await storage.getActiveOutlets();
      res.json(outlets);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching outlets', error });
    }
  });

  // Admin outlet management endpoints
  app.get('/api/admin/outlets', requireAdmin, async (req, res) => {
    try {
      const outlets = await storage.getAllOutlets();
      res.json(outlets);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching outlets', error });
    }
  });

  app.get('/api/admin/outlets/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const outlet = await storage.getOutletById(id);
      
      if (!outlet) {
        return res.status(404).json({ message: 'Outlet not found' });
      }
      
      res.json(outlet);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching outlet', error });
    }
  });

  app.post('/api/admin/outlets', requireAdmin, async (req, res) => {
    try {
      const { 
        title_en, 
        title_it, 
        description_en, 
        description_it, 
        address_en,
        address_it, 
        imageUrl,
        additionalImages, 
        order, 
        isActive 
      } = req.body;
      
      const outlet = await storage.createOutlet({
        title_en,
        title_it,
        description_en,
        description_it,
        address_en,
        address_it,
        imageUrl,
        additionalImages,
        order,
        isActive
      });
      
      res.status(201).json(outlet);
    } catch (error) {
      res.status(400).json({ message: 'Invalid outlet data', error });
    }
  });

  app.put('/api/admin/outlets/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { 
        title_en, 
        title_it, 
        description_en, 
        description_it, 
        address_en,
        address_it, 
        imageUrl,
        additionalImages, 
        order, 
        isActive 
      } = req.body;
      
      // Debug log to see what's coming in from the client
      console.log('[DEBUG] Outlet update request:', {
        id,
        imageUrl,
        additionalImages
      });
      
      // Always ensure additionalImages is an array, not null
      const safeAdditionalImages = Array.isArray(additionalImages) ? additionalImages : [];
      
      const outlet = await storage.updateOutlet(id, {
        title_en,
        title_it,
        description_en,
        description_it,
        address_en,
        address_it,
        imageUrl,
        additionalImages: safeAdditionalImages,
        order,
        isActive
      });
      
      console.log('[DEBUG] Updated outlet:', {
        id: outlet.id,
        imageUrl: outlet.imageUrl,
        additionalImages: outlet.additionalImages
      });
      
      res.json(outlet);
    } catch (error) {
      console.error('[DEBUG] Error updating outlet:', error);
      if (error.message && error.message.includes('not found')) {
        return res.status(404).json({ message: 'Outlet not found' });
      }
      res.status(400).json({ message: 'Invalid outlet data', error });
    }
  });

  app.delete('/api/admin/outlets/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteOutlet(id);
      res.json({ message: 'Outlet deleted successfully' });
    } catch (error) {
      if (error.message && error.message.includes('not found')) {
        return res.status(404).json({ message: 'Outlet not found' });
      }
      res.status(500).json({ message: 'Error deleting outlet', error });
    }
  });

  // Configure multer for file uploads
  const uploadsDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  const uploadStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      // Create a unique filename using uuid and keep the original extension
      const fileExt = path.extname(file.originalname);
      const fileName = uuidv4() + fileExt;
      cb(null, fileName);
    }
  });

  const upload = multer({ 
    storage: uploadStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function(req, file, cb) {
      // Accept only images
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed!'));
      }
      cb(null, true);
    }
  });

  // File upload endpoint
  app.post('/api/upload', requireAdmin, upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      // Return the full filename WITH extension to ensure proper rendering
      const fullFileName = req.file.filename;
      
      // For backwards compatibility, also provide filename without extension
      const fileNameWithoutExt = path.basename(fullFileName, path.extname(fullFileName));
      
      res.json({ 
        success: true, 
        filename: fileNameWithoutExt,  // Keep this for backwards compatibility
        fullFilename: fullFileName,    // Add this for improved image handling
        url: `/uploads/${fullFileName}`
      });
      
      // Log detailed information for debugging
      console.log('File uploaded successfully:');
      console.log(`- Full filename: ${fullFileName}`);
      console.log(`- Without extension: ${fileNameWithoutExt}`);
      console.log(`- Access URL: /uploads/${fullFileName}`);
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error uploading file', 
        error: String(error)
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
