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

export async function checkUserInUsersDb(phoneNumber) {
  const result = await client
    .db("ElChat")
    .collection("Users")
    .findOne({ phoneNumber: phoneNumber });

  return result;
}

export async function getUserDataFromMessages(id) {
  const result = await client
    .db("ElChat")
    .collection("Messages")
    .find({ _id: new ObjectId(id) })
    .toArray();
}
