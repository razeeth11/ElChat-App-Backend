import { ObjectId } from "mongodb";
import { client } from "../../../app.js";

export async function getConversationsByConvoId(conversationId) {
  const result = await client
    .db("ElChat")
    .collection("Conversations")
    .find({ conversationId: conversationId })
    .toArray();

  return result;
}

export async function storeMessageToConversations(payload) {
  await client.db("ElChat").collection("Conversations").insertOne(payload);
}

export async function updateMessageToChats(payload) {
  await client
    .db("ElChat")
    .collection("Messages")
    .updateOne(
      { _id: new ObjectId(payload.conversationId) },
      { $set: { lastMessage: payload.text, lastUpdatedAt: payload.sendedAt } }
    );
}
