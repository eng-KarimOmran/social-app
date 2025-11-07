import { model, Schema, Types } from "mongoose";
import { IFriendReq } from "../../modules/friendReqModule/friendReq.type";

const FriendReqSchema = new Schema<IFriendReq>(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

export const FriendReqModel = model<IFriendReq>("friendReq", FriendReqSchema);
