import express from "express";
import {
  createNewUser,
  getAllUsers,
  getSelectedUserDetails,
  getUserByUserId,
} from "./user.controller.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/createUser", upload.single("avatarUrl"), createNewUser);
router.get("/allUsers", getAllUsers);
router.get("/:receiverId", getSelectedUserDetails);
router.get("/:userId", getUserByUserId);

export default router;
