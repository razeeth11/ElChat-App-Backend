import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";
import AuthRouter from "./src/modules/auth/auth.router.js";
import ChatsRouter from "./src/modules/chats/chats.router.js";
import ConversationsRouter from "./src/modules/conversations/conversations.router.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

export const client = new MongoClient(MONGO_URL);
await client.connect();

app.use(cors());
app.use(express.json());
app.use("/auth", AuthRouter);
app.use("/chat", ChatsRouter);
app.use("/conversation", ConversationsRouter);

app.get("/", (req, res) => {
  res.send("ElChat Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});

export default app;
