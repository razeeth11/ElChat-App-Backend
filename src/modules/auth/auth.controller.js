import { checkOtp, getUserDataFromMessages } from "./auth.models.js";
import {
  checkUserExstenceByPhoneNumber,
  sentOtp,
  verifyOtp,
} from "./auth.services.js";

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
    const RandomOTP = Math.floor(100000 + Math.random() * 999999);
    const isOtpSent = await sentOtp(phoneNumber, RandomOTP);

    if (!isOtpSent) {
      res.send(respones.otpSentFailure);
      return;
    }

    let OTP = RandomOTP.length > 6 ? RandomOTP.slice(0, 6) : RandomOTP;

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      authId: isOtpSent.insertedId,
      OTP: OTP,
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
        message: "OTP expired!",
      });
    } else if (isVerified === 2) {
      return res.status(400).send({
        success: false,
        message: "OTP attempts exceeded!",
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
    res.status(200).json({
      success: true,
      userId: isUserExist._id,
      newUser: false,
    });
  } catch (err) {
    res.status(500).send(respones.internalServerError);
  }
}
