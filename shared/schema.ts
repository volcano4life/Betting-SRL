import { pgTable, text, serial, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Games table
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
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

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image").notNull(),
  rating: real("rating").notNull(),
  featured: integer("featured").default(0),
  publishDate: timestamp("publish_date").defaultNow().notNull(),
});

// News table
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image").notNull(),
  category: text("category").notNull(),
  featured: integer("featured").default(0),
  publishDate: timestamp("publish_date").defaultNow().notNull(),
});

// Guides table
export const guides = pgTable("guides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image").notNull(),
  difficulty: text("difficulty").notNull(),
  category: text("category").notNull(),
  publishDate: timestamp("publish_date").defaultNow().notNull(),
});

// Newsletter subscribers
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
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

export const insertSubscriberSchema = createInsertSchema(subscribers).omit({
  id: true,
  createdAt: true
});

// Types
export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;

export type Guide = typeof guides.$inferSelect;
export type InsertGuide = z.infer<typeof insertGuideSchema>;

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
