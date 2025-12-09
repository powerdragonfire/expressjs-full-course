import mongoose from "mongoose";
import dotenv from "dotenv";
import { createApp } from "./createApp.js";
import { initPostgresPool } from "./data/providers/postgresUsersRepo.js";

dotenv.config();

const provider = process.env.DB_PROVIDER || "mongodb";

if (provider === "mongodb") {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
  mongoose
    .connect(mongoUri)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(`Error connecting to MongoDB: ${err}`));
}

if (provider === "postgres") {
  const databaseUrl = process.env.DATABASE_URL || "postgresql://localhost:5432/expressjs";
  try {
    initPostgresPool(databaseUrl);
    console.log("Connected to PostgreSQL");
  } catch (err) {
    console.log(`Error connecting to PostgreSQL: ${err}`);
  }
}

const app = createApp(provider);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
