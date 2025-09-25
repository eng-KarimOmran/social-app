import { Model } from "mongoose";
import { DBRepo } from "../../db/DBRepo";
import { IOtp, OtpModel } from "../../db/models/otpModel";

export class OtpRepo extends DBRepo<IOtp> {
  constructor(private readonly otpModel: Model<IOtp> = OtpModel) {
    super(otpModel);
  }
}