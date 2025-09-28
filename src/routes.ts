import { Router } from "express";
import authRouter from "./modules/authModule/auth.controller";
import userRouter from "./modules/userModule/user.controller";
import { getFileMiddleware } from "./middlewares/getFile.middleware";

const baseRouter = Router();

baseRouter.get("/upload/*path", getFileMiddleware);
baseRouter.use("/auth", authRouter);
baseRouter.use("/user", userRouter);

export default baseRouter;
