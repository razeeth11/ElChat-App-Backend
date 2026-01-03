import { checkOtp } from "./auth.models.js";
import { sentOtp, verifyOtp } from "./auth.services.js";

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
  try {
    const OTP = Math.floor(100000 + Math.random() * 999999);
    const isOtpSent = await sentOtp(OTP);

    if (!isOtpSent) {
      res.send(respones.otpSentFailure);
      return;
    }

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

    res.status(200).json(respones.otpVerifiedSuccess);
  } catch (err) {
    res.status(500).send(respones.internalServerError);
  }
}
