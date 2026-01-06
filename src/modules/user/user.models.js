import { client } from "../../../app.js";

export async function storeNewUser(userDetails) {
  return await client.db("ElChat").collection("Users").insertOne(userDetails);
}
