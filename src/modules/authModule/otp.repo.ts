import { Model } from "mongoose";
import { DBRepo } from "../../db/DBRepo";
import { IOtp, OtpModel } from "../../db/models/otpModel";

export class OtpRepo extends DBRepo<IOtp> {
  constructor(protected readonly model: Model<IOtp> = OtpModel) {
    super(model);
  }
}