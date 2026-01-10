import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";
import AuthRouter from "./src/modules/auth/auth.router.js";
import ChatsRouter from "./src/modules/chats/chats.router.js";
import UserRouter from "./src/modules/user/user.router.js";
import ConversationsRouter from "./src/modules/conversations/conversations.router.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
export const client = new MongoClient(MONGO_URL);
await client.connect();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("register-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-message", (userIds) => {
    console.log(userIds);
  });
});

app.use(cors());
app.use(express.json());
app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
app.use("/chat", ChatsRouter);
app.use("/conversation", ConversationsRouter);

app.get("/", (req, res) => {
  res.send("ElChat Backend is running");
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});

export default app;
