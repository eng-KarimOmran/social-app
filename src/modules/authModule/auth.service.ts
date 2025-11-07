import { errors } from "./../../utils/globalErrors";
import { Response, Request } from "express";
import sendResponse from "../../utils/SendResponse";
import {
  ConfirmEmail,
  ForgotPassword,
  Login,
  ResendConfirmEmailCode,
  Signup,
  VerifyPasswordResetCode,
} from "./auth.DTO";
import { CustomError } from "../../utils/Error";
import { UserRepo } from "./user.repo";
import { compare, hash } from "../../utils/Encryption";
import { sendEmail } from "../../utils/SendEmail/sendEmail";
import { OtpRepo } from "./otp.repo";
import { OtpType } from "../../db/models/otpModel";
import { createToken, TokenType } from "../../utils/token";
import { createCode } from "../../utils/createCode";
import { nanoid } from "nanoid";
import { IRequest } from "../../middlewares/auth.middleware";
import { InvalidTokenRepo } from "./invalidToken.repo";
import { IUser } from "../../db/models/userModel";

interface IAuthServices {
  signup(req: Request, res: Response): Promise<Response>;
  confirmEmail(req: Request, res: Response): Promise<Response>;
  resendConfirmEmailCode(req: Request, res: Response): Promise<Response>;
  login(req: Request, res: Response): Promise<Response>;
  logout(req: Request, res: Response): Promise<Response>;
  refreshToken(req: Request, res: Response): Promise<Response>;
  forgotPassword(req: Request, res: Response): Promise<Response>;
  verifyPasswordResetCode(req: Request, res: Response): Promise<Response>;
  changePassword(req: Request, res: Response): Promise<Response>;
}

class AuthServices implements IAuthServices {
  private userModel = new UserRepo();
  private otpModel = new OtpRepo();
  private invalidTokenModel = new InvalidTokenRepo();
  
  constructor() {}
  signup = async (req: Request, res: Response): Promise<Response> => {
    const { firstName, lastName, email, phone, password }: Signup = req.body;
    const userExists = await this.userModel.findByEmail(email);
    if (userExists) {
      throw new CustomError(
        errors.userAlreadyExists.message,
        errors.userAlreadyExists.statusCode
      );
    }

    const user = await this.userModel.create({
      data: { firstName, lastName, email, phone, password },
    });

    const otp = createCode();
    const otpHash = await hash(otp);

    await this.otpModel.create({
      data: {
        email,
        otp: otpHash,
        typeOtp: OtpType.confirmedEmail,
        exp: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    await sendEmail({
      to: email,
      name: `${firstName} ${lastName}`,
      text: otp,
      subject: "Confirm Email",
    });

    const jwtid = nanoid();

    const accessToken = createToken(
      TokenType.AccessToken,
      { userId: user._id },
      jwtid
    );

    const refreshToken = createToken(
      TokenType.RefreshToken,
      { userId: user._id },
      jwtid
    );

    return sendResponse({
      res,
      message: "Done",
      status: 201,
      data: { accessToken, refreshToken },
    });
  };

  confirmEmail = async (req: Request, res: Response): Promise<Response> => {
    const { email, otp }: ConfirmEmail = req.body;
    const userExists = await this.userModel.findByEmail(email);
    if (!userExists) {
      throw new CustomError(
        errors.userNotFound.message,
        errors.userNotFound.statusCode
      );
    }
    const otpExists = await this.otpModel.findOne({
      filter: { email, typeOtp: OtpType.confirmedEmail },
    });

    if (!otpExists) {
      throw new CustomError(
        errors.codeNotRequested.message,
        errors.codeNotRequested.statusCode
      );
    }

    const isMatch = await compare(otp, otpExists.otp);

    if (!isMatch) {
      throw new CustomError(
        errors.invalidCode.message,
        errors.invalidCode.statusCode
      );
    }

    if (new Date(otpExists.exp).getTime() < Date.now()) {
      throw new CustomError(
        errors.expiredCode.message,
        errors.expiredCode.statusCode
      );
    }

    userExists.emailConfirmed = true;

    await userExists.save();

    await this.otpModel.deleteOne({
      filter: { email, typeOtp: OtpType.confirmedEmail },
    });

    return sendResponse({
      res,
      message: "Email verified",
      status: 200,
    });
  };

  resendConfirmEmailCode = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { email }: ResendConfirmEmailCode = req.body;
    const userExists = await this.userModel.findByEmail(email);
    if (!userExists) {
      throw new CustomError(
        errors.userNotFound.message,
        errors.userNotFound.statusCode
      );
    }
    if (userExists.emailConfirmed) {
      throw new CustomError(
        errors.emailAlreadyConfirmed.message,
        errors.emailAlreadyConfirmed.statusCode
      );
    }

    const otpExists = await this.otpModel.findOne({
      filter: { email, typeOtp: OtpType.confirmedEmail },
    });

    if (!otpExists) {
      throw new CustomError(
        errors.codeNotRequested.message,
        errors.codeNotRequested.statusCode
      );
    }

    if (otpExists.exp.getTime() > Date.now()) {
      throw new CustomError(
        errors.codeAlreadySent.message,
        errors.codeAlreadySent.statusCode
      );
    }

    const otp = createCode();
    const otpHash = await hash(otp);

    otpExists.otp = otpHash;
    otpExists.exp = new Date(Date.now() + 5 * 60 * 1000);
    await otpExists.save();

    await sendEmail({
      to: email,
      name: `${userExists.firstName} ${userExists.lastName}`,
      text: otp,
      subject: "Confirm Email",
    });

    return sendResponse({
      res,
      message: "The code has been sent.",
      status: 200,
    });
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password }: Login = req.body;
    const userExists = await this.userModel.findByEmail(email);
    if (!userExists) {
      throw new CustomError(
        errors.userNotFound.message,
        errors.userNotFound.statusCode
      );
    }
    const isMatch = await compare(password, userExists.password);

    if (!isMatch) {
      throw new CustomError(
        errors.invalidPassword.message,
        errors.invalidPassword.statusCode
      );
    }

    const jwtid = nanoid();

    const accessToken = createToken(
      TokenType.AccessToken,
      { userId: userExists._id },
      jwtid
    );

    const refreshToken = createToken(
      TokenType.RefreshToken,
      { userId: userExists._id },
      jwtid
    );

    userExists.deleteAt = null;
    await userExists.save();
    return sendResponse({
      res,
      message: "Done",
      status: 200,
      data: { accessToken, refreshToken },
    });
  };

  logout = async (req: IRequest, res: Response): Promise<Response> => {
    const jti = req.payload?.jti as string;
    const exp = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    await this.invalidTokenModel.create({ data: { jti, exp } });
    return sendResponse({
      res,
      message: "You are logged out",
      status: 200,
    });
  };

  refreshToken = async (req: IRequest, res: Response): Promise<Response> => {
    const jti = req.payload?.jti as string;
    const userId = req.payload?.userId;
    const accessToken = createToken(TokenType.AccessToken, { userId }, jti);
    return sendResponse({
      res,
      message: "Done",
      status: 200,
      data: { accessToken },
    });
  };

  forgotPassword = async (req: Request, res: Response): Promise<Response> => {
    const { email }: ForgotPassword = req.body;
    const userExists = await this.userModel.findByEmail(email);
    if (!userExists) {
      throw new CustomError(
        errors.userNotFound.message,
        errors.userNotFound.statusCode
      );
    }
    const otpExists = await this.otpModel.findOne({
      filter: { email, typeOtp: OtpType.ResetPassword },
    });

    if (otpExists && otpExists.exp.getTime() > Date.now()) {
      throw new CustomError(
        errors.codeAlreadySent.message,
        errors.codeAlreadySent.statusCode
      );
    }

    await this.otpModel.deleteMany({
      filter: {
        email,
        typeOtp: OtpType.ResetPassword,
      },
    });

    const otp = createCode();
    const otpHash = await hash(otp);

    await sendEmail({
      to: email,
      name: `${userExists.firstName} ${userExists.lastName}`,
      text: otp,
      subject: "Reset Password",
    });

    await this.otpModel.create({
      data: {
        email,
        otp: otpHash,
        typeOtp: OtpType.ResetPassword,
        exp: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    return sendResponse({
      res,
      message: "The code has been sent.",
      status: 200,
    });
  };

  verifyPasswordResetCode = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { email, otp }: VerifyPasswordResetCode = req.body;
    const userExists = await this.userModel.findByEmail(email);
    if (!userExists) {
      throw new CustomError(
        errors.userNotFound.message,
        errors.userNotFound.statusCode
      );
    }
    const otpExists = await this.otpModel.findOne({
      filter: { email, typeOtp: OtpType.ResetPassword },
    });

    if (!otpExists) {
      throw new CustomError(
        errors.codeNotRequested.message,
        errors.codeNotRequested.statusCode
      );
    }

    const isMatch = await compare(otp, otpExists.otp);

    if (!isMatch) {
      throw new CustomError(
        errors.invalidCode.message,
        errors.invalidCode.statusCode
      );
    }

    if (new Date(otpExists.exp).getTime() < Date.now()) {
      throw new CustomError(
        errors.expiredCode.message,
        errors.expiredCode.statusCode
      );
    }

    const jwtid = nanoid();

    const passwordToken = createToken(
      TokenType.PasswordToken,
      { userId: userExists._id },
      jwtid
    );

    return sendResponse({
      res,
      message: "The code has been verified.",
      status: 200,
      data: {
        passwordToken,
      },
    });
  };

  changePassword = async (req: IRequest, res: Response): Promise<Response> => {
    const { password } = req.body;
    const jti = req.payload?.jti as string;
    const user = req.user as IUser;
    const exp = new Date(Date.now() + 1000 * 60 * 15);
    await this.invalidTokenModel.create({ data: { jti, exp } });
    user.password = password;
    await user.save();
    return sendResponse({
      res,
      message: "The password has been changed.",
      status: 200,
    });
  };
}

export default AuthServices;