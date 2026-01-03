import dayjs from "dayjs";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { storedOTPHandler, updateAttempts } from "./auth.models.js";
dotenv.config();

export async function sentOtp(OTP) {
  const hashedOTP = await bcrypt.hash(OTP.toString(), 10);

  const payload = {
    otpHash: hashedOTP,
    createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    expiresAt: dayjs().add(5, "minutes").format("YYYY-MM-DD HH:mm:ss"),
    attempts: 3,
  };

  return await storedOTPHandler(payload);
}

export async function verifyOtp(body, dbData) {
  let isMatch = await bcrypt.compare(body.otp, dbData.otpHash);
  if (dayjs().format("YYYY-MM-DD HH:mm:ss") > dbData.expiresAt) {
    return 1;
  } else if (dbData.attempts === 0) {
    return 2;
  } else if (!isMatch) {
    await updateAttempts(body.authId);
    return 3;
  }

  return 4;
}
