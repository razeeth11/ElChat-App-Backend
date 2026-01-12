import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
import { saveUserToUsers } from "./user.services.js";
import {
  getAllUsersFromDb,
  getPhoneNumber,
  getSelectedUserDetailsFromDb,
} from "./user.models.js";
import { clearVerifiedOTP } from "../auth/auth.models.js";
import jwt from "jsonwebtoken";
dotenv.config();

export async function createNewUser(req, res) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    let avatarUrl = null;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
      });
      avatarUrl = uploadResult.secure_url;
    }

    const user = await getPhoneNumber(req.body.authId);

    const payload = {
      ...req.body,
      phoneNumber: user.phoneNumber,
      avatarUrl,
    };

    const isSaved = await saveUserToUsers(payload);

    if (!isSaved) {
      return res.status(500).json({
        status: false,
        message: "User could not be saved!",
      });
    }

    const token = jwt.sign(
      { userId: isSaved.insertedId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await clearVerifiedOTP(req.body.authId);

    res.status(201).json({
      status: true,
      message: "User saved successfully",
      userId: isSaved.insertedId,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Upload failed" });
  }
}

export async function getAllUsers(req, res) {
  try {
    const result = await getAllUsersFromDb();

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users: result,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", err });
  }
}

export async function getSelectedUserDetails(req, res) {
  try {
    const { receiverId } = req.params;
    const result = await getSelectedUserDetailsFromDb(receiverId);

    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      userDetails: result,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", err });
  }
}
