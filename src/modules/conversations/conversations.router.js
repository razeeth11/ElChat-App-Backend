import express from "express";
import { getConversations } from "./conversations.controller.js";

const router = express.Router();

router.get("/:conversationId", getConversations);

export default router;
