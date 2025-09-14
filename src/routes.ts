import { Router } from "express";
import userRouter from "./modules/userModule/user.controller";

const baseRouter = Router();

baseRouter.use("/user", userRouter);

export default baseRouter;