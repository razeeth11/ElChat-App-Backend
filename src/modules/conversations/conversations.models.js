import { ObjectId } from "mongodb";
import { client } from "../../../app.js";

export async function getConversationsByConvoId(conversationId) {
  const result = await client
    .db("ElChat")
    .collection("Conversations")
    .find({ _id: new ObjectId(conversationId) })
    .toArray();

  return result;
}
