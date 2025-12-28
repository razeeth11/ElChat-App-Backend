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
};

export async function loginOtpHandler(req, res) {
  try {
    const isOtpSent = await sentOtp(req.body);

    if (!isOtpSent) {
      res.send(respones.otpSentFailure);
      return;
    }

    res.status(200).json(respones.otpSentSuccess);
  } catch (err) {
    console.log(err);
    res.status(500).send(respones.internalServerError);
  }
}

export async function verifyOtpHandler(req, res) {
  try {
    const isVerified = await verifyOtp(req.body);

    if (!isVerified) {
      res.send(respones.otpSentFailure);
      return;
    }

    if (isVerified.status === "pending") {
      res.send(respones.otpVerifiedFailure);
      return;
    }

    res.status(200).json(respones.otpVerifiedSuccess);
  } catch (err) {
    res.status(500).send(respones.internalServerError);
  }
}
