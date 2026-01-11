import { ObjectId } from "mongodb";
import { client } from "../../../app.js";

export async function storeNewUser(userDetails) {
  return await client.db("ElChat").collection("Users").insertOne(userDetails);
}

export async function getAllUsersFromDb() {
  return await client.db("ElChat").collection("Users").find().toArray({});
}

export async function getSelectedUserDetailsFromDb(receiverId) {
  return await client
    .db("ElChat")
    .collection("Users")
    .findOne({ _id: new ObjectId(receiverId) });
}
