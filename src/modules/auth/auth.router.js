import express from "express";
import { loginOtpHandler, verifyOtpHandler } from "./auth.controller.js";

const router = express.Router();

router.post("/login-otp", loginOtpHandler);
router.post("/verify-otp", verifyOtpHandler);

export default router;
