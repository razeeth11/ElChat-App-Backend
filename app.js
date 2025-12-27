import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
const MONGO_URL = process.env.MONGO_URL;

const client = new MongoClient(MONGO_URL);
await client.connect();

app.get("/", (req, res) => {
  res.send("ElChat Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
