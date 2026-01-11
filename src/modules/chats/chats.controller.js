import { success } from "zod";
import { createNewChat, findChat, getSenderChats } from "./chats.models.js";

export async function createChat(req, res) {
  try {
    const isChatExist = await findChat(req.body);
    let conversationId;

    if (!isChatExist) {
      const isChatCreated = await createNewChat(req.body);
      conversationId = isChatCreated.insertedId;
    } else {
      conversationId = isChatExist._id;
    }

    res.status(200).json({ success: true, conversationId });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getChatsBySenderId(req, res) {
  try {
    const { senderId } = req.params;
    const allChatsBySenderId = await getSenderChats(senderId);
    res.status(200).json({ success: true, chats: allChatsBySenderId });
  } catch (err) {
    res.status(500).json({ message: false, message: "Internal server error" });
  }
}
