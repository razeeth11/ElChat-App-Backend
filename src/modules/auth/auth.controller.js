import { checkOtp, clearVerifiedOTP } from "./auth.models.js";
import {
  checkUserExstenceByPhoneNumber,
  sentOtp,
  verifyOtp,
} from "./auth.services.js";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const respones = {
  otpSentSuccess: {
    success: true,
    message: "OTP sent successfully",
  },
  otpSentFailure: {
    success: false,
    message: "Failed to send OTP",
  },
  otpVerifiedSuccess: {
    success: true,
    message: "OTP verified successfully",
  },
  otpVerifiedFailure: {
    success: false,
    message: "Incorrect OTP",
  },
  internalServerError: {
    success: false,
    message: "Internal Server Error",
  },
  otpNotFound: {
    success: false,
    message: "OTP not found",
  },
};

export async function loginOtpHandler(req, res) {
  const { phoneNumber } = req.body;
  try {
    if (
      !phoneNumber ||
      phoneNumber.includes(" ") ||
      !phoneNumber.startsWith("+91")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Input / Select India!",
      });
    }

    const initialOtp = Math.floor(100000 + Math.random() * 999999).toString();
    const generatedOtp =
      initialOtp.length > 6 ? initialOtp.slice(0, 6) : initialOtp;

    const isOtpSent = await sentOtp(phoneNumber, generatedOtp);

    if (!isOtpSent) {
      res.send(respones.otpSentFailure);
      return;
    }

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      authId: isOtpSent.insertedId,
      OTP: generatedOtp,
    });
  } catch (err) {
    res.status(500).send(respones.internalServerError);
  }
}

export async function verifyOtpHandler(req, res) {
  try {
    const isExist = await checkOtp(req.body);

    if (!isExist) {
      return res.status(404).json(respones.otpNotFound);
    }

    const isVerified = await verifyOtp(req.body, isExist);

    if (isVerified === 1) {
      return res.status(400).send({
        success: false,
        message: "OTP expired - Generate a new one!",
      });
    } else if (isVerified === 2) {
      return res.status(400).send({
        success: false,
        message: "OTP attempts exceeded - Generate a new one!",
      });
    } else if (isVerified === 3) {
      return res.status(400).send({
        success: false,
        message: "Incorrect OTP!",
      });
    }

    const isUserExist = await checkUserExstenceByPhoneNumber(req.body);

    if (!isUserExist) {
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        newUser: true,
      });
    }

    const token = jwt.sign(
      { userId: isUserExist._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await clearVerifiedOTP(isExist._id);
    res.status(200).json({
      success: true,
      userId: isUserExist._id,
      newUser: false,
      token: token,
    });
  } catch (err) {
    res.status(500).send(respones.internalServerError);
  }
}
