import dayjs from "dayjs";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import {
  checkUserInUsersDb,
  storedOTPHandler,
  updateAttempts,
} from "./auth.models.js";
import { client } from "../../../index.js";
import { ObjectId } from "mongodb";
dotenv.config();

export async function sentOtp(phoneNumber, OTP) {
  const hashedOTP = await bcrypt.hash(OTP, 10);

  const payload = {
    phoneNumber: phoneNumber,
    otpHash: hashedOTP,
    createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss:ss"),
    expiresAt: dayjs().add(5, "minutes").format("YYYY-MM-DD HH:mm:ss:ss"),
    attempts: 3,
  };

  return await storedOTPHandler(payload);
}

export async function verifyOtp(body, dbData) {
  let isMatch = await bcrypt.compare(body.otp, dbData.otpHash);
  if (dayjs().format("YYYY-MM-DD HH:mm:ss:ss") > dbData.expiresAt) {
    return 1;
  } else if (dbData.attempts === 0) {
    return 2;
  } else if (!isMatch) {
    await updateAttempts(body.authId);
    return 3;
  }

  return 4;
}

export async function checkUserExstenceByPhoneNumber(data) {
  return checkUserInUsersDb(data.phoneNumber);
}
