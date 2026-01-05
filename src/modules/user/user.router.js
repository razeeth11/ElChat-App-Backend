import express from "express";
import { createNewUser } from "./user.controller.js";

const router = express.Router();

router.post("/createUser", createNewUser);

export default router;
