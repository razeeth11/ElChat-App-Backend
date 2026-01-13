import dayjs from "dayjs";
import { storeNewUser } from "./user.models.js";

export async function saveUserToUsers(payload) {
  const userDetails = {
    ...payload,
    lastSeenAt: null,
    accountStatus: null,
    createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss:ss"),
    updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss:ss"),
  };

  return storeNewUser(userDetails);
}
