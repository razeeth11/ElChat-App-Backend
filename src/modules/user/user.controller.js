import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
import { saveUserToUsers } from "./user.services.js";
dotenv.config();

export async function createNewUser(req, res) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
    });

    const payload = {
      ...req.body,
      avatarUrl: uploadResult.secure_url,
    };

    const isSaved = await saveUserToUsers(payload);

    if (!isSaved) {
      return res.status(500).json({
        status: false,
        message: "User could not be saved!",
      });
    }

    res.status(201).json({
      status: true,
      message: "User saved successfully",
      userId: isSaved.insertedId,
    });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
}
