import { ObjectId } from "mongodb";
import { client } from "../../../app.js";

export async function storedOTPHandler(payload) {
  const result = await client.db("ElChat").collection("OTP").insertOne(payload);
  return result;
}

export async function checkOtp(user) {
  const result = await client
    .db("ElChat")
    .collection("OTP")
    .findOne({ _id: new ObjectId(user.authId) });
  return result;
}

export async function updateAttempts(authId) {
  return await client
    .db("ElChat")
    .collection("OTP")
    .updateOne({ _id: new ObjectId(authId) }, { $inc: { attempts: -1 } });
}
