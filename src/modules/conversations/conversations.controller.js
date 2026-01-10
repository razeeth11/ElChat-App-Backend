import { getConversationsByConvoId } from "./conversations.models.js";

export async function getConversations(req, res) {
  try {
    const { conversationId } = req.params;

    const allConversations = await getConversationsByConvoId(conversationId);
    console.log(allConversations);
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
