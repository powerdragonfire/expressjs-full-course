import mongoose from "mongoose";
import dotenv from "dotenv";
import { createApp } from "./createApp.js";

dotenv.config();

const provider = process.env.DB_PROVIDER || "mongodb";

if (provider === "mongodb") {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
  mongoose
    .connect(mongoUri)
    .then(() => console.log("Connected to Database"))
    .catch((err) => console.log(`Error: ${err}`));
}

const app = createApp();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
