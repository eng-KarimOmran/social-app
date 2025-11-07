import validation from "../../middlewares/globalValidationHandler";
import { PostServices } from "./post.service";
import { Router } from "express";
import { PostValidation } from "./post.validation";
import { auth } from "../../middlewares/auth.middleware";
import { TokenType } from "../../utils/token";
import { upload } from "../../utils/upload/multer";

const postRouter = Router();

const postServices = new PostServices();

export const PostRoutes = {
  create: "/",
  update: "",
  like: "/like",
};

postRouter.use(auth(TokenType.AccessToken));

postRouter.post(
  PostRoutes.create,
  upload().array("attachments", 4),
  validation(PostValidation.createPost),
  postServices.createPost
);

postRouter.patch(
  PostRoutes.update,
  upload().array("attachments", 4),
  validation(PostValidation.update),
  postServices.updatePost
);

postRouter.patch(
  PostRoutes.like,
  validation(PostValidation.like),
  postServices.like
);
export default postRouter;
