import express, { Router } from "express";
import authRouter from "./modules/authModule/auth.controller";
import userRouter from "./modules/userModule/user.controller";
import postRouter from "./modules/postModule/post.controller";
import { getFileMiddleware } from "./middlewares/getFile.middleware";
import friendRouter from "./modules/friendReqModule/friendReq.controller";

const baseRouter = Router();

baseRouter.use("/uploads", express.static("uploadMedia"));
baseRouter.get("/upload/*path", getFileMiddleware);
baseRouter.use("/auth", authRouter);
baseRouter.use("/user", userRouter);
baseRouter.use("/post", postRouter);
baseRouter.use("/friend", friendRouter);

export default baseRouter;
