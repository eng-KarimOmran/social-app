import { NextFunction, Request, Response } from "express";
import { Payload, TokenType, verifyToken } from "../utils/token";
import { CustomError } from "../utils/Error";
import { InvalidTokenRepo } from "../modules/authModule/invalidToken.repo";
import { UserRepo } from "../modules/authModule/user.repo";
import { IUser } from "../db/models/userModel";
import { errors } from "../utils/globalErrors.js";

export interface IRequest extends Request {
  payload?: Payload;
  user?: IUser;
}

export const auth = (type: TokenType) => {
  return async (
    req: IRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const invalidTokenModel = new InvalidTokenRepo();
    const userModel = new UserRepo();
    const { authorization } = req.headers;
    const BEARER_KEY = process.env.BEARER_KEY as string;
    if (!authorization?.startsWith(BEARER_KEY)) {
      throw new CustomError(
        errors.invalidBearerKey.message,
        errors.invalidBearerKey.statusCode
      );
    }
    const token = authorization.split(" ")[1] as string;
    const payload = verifyToken(type, token);

    const jtiInvalid = await invalidTokenModel.findOne({
      filter: {
        jti: payload.jti,
      },
    });

    if (jtiInvalid) {
      throw new CustomError(
        errors.invalidToken.message,
        errors.invalidToken.statusCode
      );
    }

    const user = await userModel.findUserById(payload.userId);
    const issuedAtDate = new Date(payload.iat * 1000);
    if (issuedAtDate < user.lastSensitiveUpdate) {
      throw new CustomError(
        errors.invalidToken.message,
        errors.invalidToken.statusCode
      );
    }
    req.user = user;
    req.payload = payload;
    return next();
  };
};
