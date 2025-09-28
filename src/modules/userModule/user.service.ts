import { Response, Request } from "express";
import { UserRepo } from "../authModule/user.repo";
import { IUser } from "../../db/models/userModel";
import { IRequest } from "../../middlewares/auth.middleware";
import sendResponse from "../../utils/SendResponse";
import { ceratePreSignedUrl, deleteFile } from "../../utils/upload/s3.Service";

interface IUserServices {
  profileImage(req: IRequest, res: Response): Promise<Response>;
}

export class UserServices implements IUserServices {
  private userModel = new UserRepo();
  constructor() {}
  profileImage = async (req: IRequest, res: Response): Promise<Response> => {
    const user = req.user as IUser;
    const {
      contentType,
      originalname,
    }: { contentType: string; originalname: string } = req.body;
    const { Key, url } = await ceratePreSignedUrl({
      ContentType: contentType,
      originalname,
      path: `users/${user.firstName}_${user.lastName}_${user._id}`,
    });
    user.profileImage = Key;
    await user.save();
    return sendResponse({
      res,
      message: "The image has been uploaded successfully",
      status: 200,
      data: { url },
    });
  };
}
