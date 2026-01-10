import { success } from "zod";
import { createNewChat, findChat } from "./chats.models.js";

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
