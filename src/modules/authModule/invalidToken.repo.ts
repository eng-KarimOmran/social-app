import { Model } from "mongoose";
import { DBRepo } from "../../db/DBRepo";
import {
  IinvalidToken,
  InvalidTokenModel,
} from "../../db/models/invalidTokenModel";

export class InvalidTokenRepo extends DBRepo<IinvalidToken> {
  constructor(
    private readonly otpModel: Model<IinvalidToken> = InvalidTokenModel
  ) {
    super(otpModel);
  }
}
