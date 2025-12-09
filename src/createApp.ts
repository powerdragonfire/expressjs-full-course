import express, { Express } from "express";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import session, { SessionOptions } from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import { buildUsersRepo } from "./data/usersRepo.js";
import { configureLocalStrategy } from "./strategies/local-strategy.js";
// import "./strategies/discord-strategy.js";

export function createApp(): Express {
  const app = express();
  const provider = process.env.DB_PROVIDER || "mongodb";
  const usersRepo = buildUsersRepo(provider);

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

  if (provider === "mongodb") {
    sessionOptions.store = MongoStore.create({
      client: mongoose.connection.getClient(),
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
