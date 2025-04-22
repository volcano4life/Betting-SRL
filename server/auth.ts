import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { User } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { users } from "@shared/schema";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);
const scryptAsync = promisify(scrypt);

declare global {
  namespace Express {
    interface User extends User {}
  }
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

async function getUserByUsername(username: string): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.username, username));
  return result[0];
}

async function getUserById(id: number): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0];
}

async function createUser(username: string, password: string, isAdmin: boolean = false): Promise<User> {
  const hashedPassword = await hashPassword(password);
  const result = await db.insert(users)
    .values({ username, password: hashedPassword, isAdmin })
    .returning();
  return result[0];
}

export function setupAuth(app: Express) {
  const sessionStore = new PostgresSessionStore({
    pool: db.client,
    createTableIfMissing: true,
  });

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "betting-srl-secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await getUserById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Auth routes
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const existingUser = await getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await createUser(
        req.body.username, 
        req.body.password,
        req.body.isAdmin || false
      );

      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(201).json({ id: user.id, username: user.username, isAdmin: user.isAdmin });
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    const user = req.user;
    return res.status(200).json({ id: user.id, username: user.username, isAdmin: user.isAdmin });
  });

  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      return res.sendStatus(200);
    });
  });

  app.get("/api/auth/session", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ authenticated: false });
    }
    const user = req.user;
    return res.json({ 
      authenticated: true, 
      user: { id: user.id, username: user.username, isAdmin: user.isAdmin } 
    });
  });

  // Middleware to check if user is admin
  const requireAdmin = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    next();
  };

  return { requireAdmin };
}

// Function to seed an admin user (used during initial setup)
export async function seedAdminUser() {
  try {
    const adminExists = await getUserByUsername("admin");
    if (!adminExists) {
      await createUser("admin", "adminpassword", true);
      console.log("Admin user created successfully");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
}