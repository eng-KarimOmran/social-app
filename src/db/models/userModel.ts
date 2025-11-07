import { Document, Types } from "mongoose";
import Mongoose from "mongoose";
import { hash } from "../../utils/Encryption";

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  emailConfirmed: boolean;
  lastSensitiveUpdate: Date;
  profileImage: string;
  slug: string;
  deleteAt: Date | null;
  friends: Types.ObjectId[];
}

interface QueryWithConditions<T> extends Mongoose.Query<T, T> {
  _conditions: Record<string, any>;
}

const userSchema = new Mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 25,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 25,
    },
    slug: {
      type: String,
      minLength: 2,
      maxLength: 51,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
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
    deleteAt: {
      type: Date,
      default: null,
    },
    friends: [
      {
        type: Types.ObjectId,
        ref: "users",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await hash(this.password);
    this.lastSensitiveUpdate = new Date(Date.now());
  }
});

userSchema.pre(["find", "findOne"], function (next) {
  const query = this as QueryWithConditions<any>;
  const { paranoid } = query._conditions;
  delete query._conditions.paranoid;
  if (paranoid !== false) {
    query.where({ deleteAt: null });
  }
  next();
});

userSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as Record<string, any>;
  if (update?.deleteAt) {
    update.lastSensitiveUpdate = Date.now();
  }
  next();
});

export const UserModel = Mongoose.model<IUser>("User", userSchema);
