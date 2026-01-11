import express from "express";
import { createChat, getChatsBySenderId } from "./chats.controller.js";

const router = express.Router();

router.post("/createChat", createChat);
router.get("/:senderId", getChatsBySenderId);

export default router;
