import dayjs from "dayjs";
import { client } from "../../../index.js";

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
      createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      lastUpdatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    });
}

export async function getSenderChats(userId) {
  return client
    .db("ElChat")
    .collection("Messages")
    .find({
      $or: [{ senderId: userId }, { receiverId: userId }],
      lastMessage: { $exists: true, $ne: "" },
    })
    .sort({ lastUpdatedAt: -1 })
    .toArray();
}
