import { Document } from "mongoose";
import { model, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  emailConfirmed: boolean;
  lastSensitiveUpdate: Date;
  profileImage: string;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    emailConfirmed: {
      type: Boolean,
      default: false,
    },
    lastSensitiveUpdate: {
      type: Date,
      default: new Date(Date.now()),
    },
    profileImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<IUser>("User", userSchema);
