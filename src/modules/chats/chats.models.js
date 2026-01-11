import dayjs from "dayjs";
import { client } from "../../../app.js";

export async function findChat(userIds) {
  const participants = userIds.sort();
  return client
    .db("ElChat")
    .collection("Messages")
    .findOne({ users: participants });
}

export async function createNewChat(userIds) {
  return client
    .db("ElChat")
    .collection("Messages")
    .insertOne({
      users: userIds,
      senderId: userIds[0],
      receiverId: userIds[1],
      lastMessage: "",
      createdAt: dayjs().format("YYYY-MM-DD HH:mm"),
      lastUpdatedAt: dayjs().format("YYYY-MM-DD HH:mm"),
    });
}

export async function getSenderChats(senderId) {
  return client
    .db("ElChat")
    .collection("Messages")
    .find({
      senderId,
      lastMessage: { $exists: true, $ne: "" },
    })
    .toArray();
}
