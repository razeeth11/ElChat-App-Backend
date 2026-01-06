import express from "express";
import { createNewUser } from "./user.controller.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/createUser", upload.single("avatarUrl"), createNewUser);

export default router;
