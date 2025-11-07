import { Model } from "mongoose";
import { DBRepo } from "../../db/DBRepo";
import { IFriendReq } from "./friendReq.type";
import { FriendReqModel } from "../../db/models/friendReqModel";

export class FriendRepo extends DBRepo<IFriendReq> {
  constructor(protected readonly model: Model<IFriendReq> = FriendReqModel) {
    super(model);
  }
}
