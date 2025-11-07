import { Router } from "express";
import { UserServices } from "./user.service";
import { auth } from "../../middlewares/auth.middleware";
import { TokenType } from "../../utils/token";
import validation from "../../middlewares/globalValidationHandler";
import { profileImage } from "./user.validation";

const userRouter = Router();
const userServices = new UserServices();

userRouter.use(auth(TokenType.AccessToken));

userRouter.patch(
  "/profile-image",
  validation(profileImage),
  userServices.profileImage
);

userRouter.delete("/delete-account", userServices.softDeleteAccount);
export default userRouter;