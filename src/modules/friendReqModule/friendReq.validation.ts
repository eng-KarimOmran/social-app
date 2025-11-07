import * as z from "zod";
import { ObjectId } from "../../utils/globalValidationSchema";

export const addFriend = z.object({
  to: ObjectId,
});

export const acceptFriendReq = z.object({
  reqId: ObjectId,
  accept: z.boolean(),
});

export const unfriend = z.object({
  friendId: ObjectId,
});
