import { client } from "../../../app.js";

export async function findChat(userIds) {
  return client.db("ElChat").collection("Messages").findOne({ users: userIds });
}

export async function createNewChat(userIds) {
  return client
    .db("ElChat")
    .collection("Messages")
    .insertOne({ users: userIds });
}
