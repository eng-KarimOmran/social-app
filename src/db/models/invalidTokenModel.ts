import { model, Schema } from "mongoose";
export interface IinvalidToken {
  jti: string;
  exp: Date;
}

const invalidTokenSchema = new Schema<IinvalidToken>(
  {
    jti: {
      type: String,
      required: true,
    },
    exp: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const InvalidTokenModel = model<IinvalidToken>(
  "InvalidToken",
  invalidTokenSchema
);
