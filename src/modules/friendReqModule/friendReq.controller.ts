import { Router } from "express";
import { friendReqServices } from "./friendReq.service";
import { auth } from "../../middlewares/auth.middleware";
import { TokenType } from "../../utils/token";
import validation from "../../middlewares/globalValidationHandler";
import * as validationFriendReq from "./friendReq.validation";

const friendServices = new friendReqServices();

const friendRouter = Router();

friendRouter.use(auth(TokenType.AccessToken));

friendRouter.post(
  "/",
  validation(validationFriendReq.addFriend),
  friendServices.addFriend
);

friendRouter.post(
  "/accept-reject",
  validation(validationFriendReq.acceptFriendReq),
  friendServices.acceptFriendReq
);

friendRouter.patch(
  "/unfriend",
  validation(validationFriendReq.unfriend),
  friendServices.unfriend
);
export default friendRouter;