import { Router } from "express";
import AuthServices from "./auth.service";
import validation from "../../middlewares/globalValidationHandler";
import {
  changePassword,
  confirmEmailSchema,
  forgotPassword,
  login,
  resendConfirmEmailCode,
  signupSchema,
  verifyPasswordResetCode,
} from "./auth.validation";
import { auth } from "../../middlewares/auth.middleware";
import { TokenType } from "../../utils/token";

const authRouter = Router();
const authServices = new AuthServices();

authRouter.post("/signup", validation(signupSchema), authServices.signup);

authRouter.patch(
  "/confirm-email",
  validation(confirmEmailSchema),
  authServices.confirmEmail
);

authRouter.post(
  "/resend-confirm-email-code",
  validation(resendConfirmEmailCode),
  authServices.resendConfirmEmailCode
);

authRouter.post("/login", validation(login), authServices.login);

authRouter.post("/logout", auth(TokenType.AccessToken), authServices.logout);

authRouter.get(
  "/refresh-token",
  auth(TokenType.RefreshToken),
  authServices.refreshToken
);

authRouter.post(
  "/forgot-password",
  validation(forgotPassword),
  authServices.forgotPassword
);

authRouter.post(
  "/verify-password-reset-code",
  validation(verifyPasswordResetCode),
  authServices.verifyPasswordResetCode
);

authRouter.patch(
  "/change-password",
  validation(changePassword),
  auth(TokenType.PasswordToken),
  authServices.changePassword
);

export default authRouter;