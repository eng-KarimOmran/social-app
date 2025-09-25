import { Document, Schema, model } from "mongoose";

export enum OtpType {
  confirmedEmail = "confirmedEmail",
  ResetPassword = "resetPassword",
}

export interface IOtp extends Document {
  email: string;
  otp: string;
  typeOtp: OtpType;
  exp: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    email: { type: String, ref: "User", required: true },
    otp: { type: String, required: true },
    typeOtp: { type: String, enum: Object.values(OtpType), required: true },
    exp: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export const OtpModel = model<IOtp>("Otp", otpSchema);
