import { client } from "../../../app.js";

export async function storeNewUser(userDetails) {
  return await client.db("ElChat").collection("Users").insertOne(userDetails);
}

export async function getAllUsersFromDb() {
  return await client.db("ElChat").collection("Users").find().toArray({});
}
