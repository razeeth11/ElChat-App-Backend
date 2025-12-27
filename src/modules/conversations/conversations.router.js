import express from "express";

const router = express.Router();

router.get("/cover1", (req, res) => {
  // Handle user login
  res.send("cover1 endpoint");
});

router.get("/cover2", (req, res) => {
  // Handle user registration
  res.send("cover2 endpoint");
});

export default router;
