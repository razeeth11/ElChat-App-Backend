import express from "express";
import { createChat } from "./chats.controller.js";

const router = express.Router();

router.post("/createChat", createChat);

export default router;
