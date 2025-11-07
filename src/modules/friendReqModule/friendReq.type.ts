import { Types } from "mongoose";

export interface IFriendReq {
  _id: Types.ObjectId;
  from: Types.ObjectId;
  to: Types.ObjectId;
}
