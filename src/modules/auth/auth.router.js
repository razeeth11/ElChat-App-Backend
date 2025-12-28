import express from "express";
import { loginOtpHandler, verifyOtpHandler } from "./auth.controller.js";

const router = express.Router();

router.post("/login-otp", loginOtpHandler);
router.post("/verify-otp", verifyOtpHandler);

router.post("/register", (req, res) => {
  // Handle user registration
  // res.send("Register endpoint");
});

export default router;
