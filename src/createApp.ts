import express, { Express } from "express";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import session, { SessionOptions, Store } from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import createPgStore from "connect-pg-simple";
import mongoose from "mongoose";
import { Pool } from "pg";
import { buildUsersRepo } from "./data/usersRepo.js";
import { configureLocalStrategy } from "./strategies/local-strategy.js";
// import "./strategies/discord-strategy.js";

export function createApp(provider?: string): Express {
  const app = express();
  const dbProvider = provider || process.env.DB_PROVIDER || "mongodb";
  const usersRepo = buildUsersRepo(dbProvider);

  app.use(express.json());
  app.use(cookieParser("helloworld"));

  const sessionOptions: SessionOptions = {
    secret: "anson the dev",
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  };

  if (dbProvider === "mongodb") {
    sessionOptions.store = MongoStore.create({
      client: mongoose.connection.getClient(),
    });
  } else if (dbProvider === "postgres") {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || "postgresql://localhost:5432/expressjs",
    });
    const PgStore = createPgStore(session);
    sessionOptions.store = new PgStore({
      pool,
      tableName: "session",
    });
  }

  app.use(session(sessionOptions));

  configureLocalStrategy(usersRepo);

  app.use((req, res, next) => {
    (req as any).repos = { users: usersRepo };
    next();
  });

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(routes(usersRepo));

  return app;
}
