import { pgTable, text, serial, integer, timestamp, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table for admin authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  isBlocked: boolean("is_blocked").default(false).notNull(),
  pendingApproval: boolean("pending_approval").default(false).notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Games table with multilingual support
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title_en: text("title_en").notNull(),
  title_it: text("title_it").notNull(),
  slug: text("slug").notNull().unique(),
  description_en: text("description_en").notNull(),
  description_it: text("description_it").notNull(),
  coverImage: text("cover_image").notNull(),
  releaseDate: timestamp("release_date").notNull(),
  platforms: text("platforms").array().notNull(),
  genres: text("genres").array().notNull(),
  overallRating: real("overall_rating").notNull(),
  gameplayRating: real("gameplay_rating").notNull(),
  graphicsRating: real("graphics_rating").notNull(),
  storyRating: real("story_rating").notNull(),
  valueRating: real("value_rating").notNull(),
  featured: integer("featured").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reviews table with multilingual support
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").notNull(),
  title_en: text("title_en").notNull(),
  title_it: text("title_it").notNull(),
  slug: text("slug").notNull().unique(),
  summary_en: text("summary_en").notNull(),
  summary_it: text("summary_it").notNull(),
  content_en: text("content_en").notNull(),
  content_it: text("content_it").notNull(),
  coverImage: text("cover_image").notNull(),
  rating: real("rating").notNull(),
  featured: integer("featured").default(0),
  publishDate: timestamp("publish_date").defaultNow().notNull(),
});

// News table with multilingual support
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title_en: text("title_en").notNull(),
  title_it: text("title_it").notNull(),
  slug: text("slug").notNull().unique(),
  summary_en: text("summary_en").notNull(),
  summary_it: text("summary_it").notNull(),
  content_en: text("content_en").notNull(),
  content_it: text("content_it").notNull(),
  coverImage: text("cover_image").notNull(),
  category: text("category").notNull(),
  featured: integer("featured").default(0),
  publishDate: timestamp("publish_date").defaultNow().notNull(),
});

// Guides table with multilingual support
export const guides = pgTable("guides", {
  id: serial("id").primaryKey(),
  title_en: text("title_en").notNull(),
  title_it: text("title_it").notNull(),
  slug: text("slug").notNull().unique(),
  summary_en: text("summary_en").notNull(),
  summary_it: text("summary_it").notNull(),
  content_en: text("content_en").notNull(),
  content_it: text("content_it").notNull(),
  coverImage: text("cover_image").notNull(),
  difficulty: text("difficulty").notNull(),
  category: text("category").notNull(),
  publishDate: timestamp("publish_date").defaultNow().notNull(),
});

// Promo codes table for casino promotions
export const promoCodes = pgTable("promo_codes", {
  id: serial("id").primaryKey(),
  casino_name_en: text("casino_name_en").notNull(),
  casino_name_it: text("casino_name_it").notNull(),
  code: text("code").notNull(),
  description_en: text("description_en").notNull(),
  description_it: text("description_it").notNull(),
  bonus_en: text("bonus_en").notNull(),
  bonus_it: text("bonus_it").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  casinoLogo: text("casino_logo"),
  affiliateLink: text("affiliate_link").notNull(),
  active: boolean("active").default(true).notNull(),
  featured: integer("featured").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Newsletter subscribers
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define relations
export const reviewsRelations = relations(reviews, ({ one }) => ({
  game: one(games, {
    fields: [reviews.gameId],
    references: [games.id]
  })
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
  createdAt: true
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  publishDate: true
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  publishDate: true
});

export const insertGuideSchema = createInsertSchema(guides).omit({
  id: true,
  publishDate: true
});

export const insertPromoCodeSchema = createInsertSchema(promoCodes).omit({
  id: true,
  createdAt: true
});

export const insertSubscriberSchema = createInsertSchema(subscribers).omit({
  id: true,
  createdAt: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;

export type Guide = typeof guides.$inferSelect;
export type InsertGuide = z.infer<typeof insertGuideSchema>;

export type PromoCode = typeof promoCodes.$inferSelect;
export type InsertPromoCode = z.infer<typeof insertPromoCodeSchema>;

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
