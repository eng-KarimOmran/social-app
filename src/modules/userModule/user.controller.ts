import { Router } from "express";
import UserServices from "./user.service";
import validation from "../../middlewares/globalValidationHandler.js";
import { signupSchema } from "./user.validation.js";

const userRouter = Router();
const userServices = new UserServices();

userRouter.post("/signup", validation(signupSchema), userServices.signup);

export default userRouter;
