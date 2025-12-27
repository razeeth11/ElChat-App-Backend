import express from "express";

const router = express.Router();

router.post("/chats1", (req, res) => {
  // Handle user login
  res.send("chats1 endpoint");
});

router.post("/chats2", (req, res) => {
  // Handle user registration
  res.send("chats2 endpoint");
});

export default router;
