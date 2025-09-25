import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";
import { CustomError } from "./Error";
import { errors } from "./globalErrors";
import { Types } from "mongoose";

export enum TokenType {
  RefreshToken = "refreshToken",
  AccessToken = "accessToken",
  PasswordToken = "passwordToken",
}

export interface Payload {
  userId: Types.ObjectId;
  iat: number;
  exp: number;
  jti: string;
}

export const createToken = (
  type: TokenType,
  data: {},
  jwtid: string
): string => {
  let secret: Secret;
  let options: SignOptions = { expiresIn: "0m", jwtid };

  switch (type) {
    case TokenType.RefreshToken:
      secret = process.env.REFRESH_TOKEN_SECRET as Secret;
      options.expiresIn = "7d";
      break;

    case TokenType.AccessToken:
      secret = process.env.ACCESS_TOKEN_SECRET as Secret;
      options.expiresIn = "5m";
      break;

    case TokenType.PasswordToken:
      secret = process.env.PASSWORD_TOKEN_SECRET as Secret;
      options.expiresIn = "15m";
      break;

    default:
      throw new CustomError(
        errors.invalidTokenType.message,
        errors.invalidTokenType.statusCode
      );
  }

  return jwt.sign(data, secret, options);
};

export const verifyToken = (type: TokenType, token: string): Payload => {
  let secret: Secret;
  switch (type) {
    case TokenType.RefreshToken:
      secret = process.env.REFRESH_TOKEN_SECRET as Secret;
      break;
    case TokenType.AccessToken:
      secret = process.env.ACCESS_TOKEN_SECRET as Secret;
      break;
    case TokenType.PasswordToken:
      secret = process.env.PASSWORD_TOKEN_SECRET as Secret;
      break;
    default:
      throw new CustomError(
        errors.invalidTokenType.message,
        errors.invalidTokenType.statusCode
      );
  }
  try {
    const payload = jwt.verify(token, secret) as Payload;
    return payload;
  } catch (e) {
    const error = e as Error;
    if (error.message === "jwt expired") {
      throw new CustomError(
        errors.tokenExpired.message,
        errors.tokenExpired.statusCode
      );
    }
    throw new CustomError(
      errors.invalidToken.message,
      errors.invalidToken.statusCode
    );
  }
};
