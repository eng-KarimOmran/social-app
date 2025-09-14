import { Router } from "express";
import UserServices from "./user.service";
import validation from "../../middlewares/globalValidationHandler";
import { signupSchema } from "./user.validation";

const userRouter = Router();
const userServices = new UserServices();

userRouter.post("/signup", validation(signupSchema), userServices.signup);

export default userRouter;
