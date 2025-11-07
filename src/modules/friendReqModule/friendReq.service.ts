import { errors } from "./../../utils/globalErrors";
import { Response } from "express";
import { FriendRepo } from "./friendReq.repo";
import { IRequest } from "../../middlewares/auth.middleware";
import { IUser } from "../../db/models/userModel";
import { AddFriendDTO } from "./friendReq.DTO";
import { CustomError } from "../../utils/Error";
import { UserRepo } from "../authModule/user.repo";
import sendResponse from "../../utils/SendResponse";

interface IFriendReqServices {
  addFriend(req: IRequest, res: Response): Promise<Response>;
  acceptFriendReq(req: IRequest, res: Response): Promise<Response>;
  unfriend(req: IRequest, res: Response): Promise<Response>;
}

export class friendReqServices implements IFriendReqServices {
  private friendModel = new FriendRepo();
  private userModel = new UserRepo();
  constructor() {}

  addFriend = async (req: IRequest, res: Response): Promise<Response> => {
    const user = req.user as IUser;
    const { to }: AddFriendDTO = req.body;
    if (to === user._id) {
      throw new CustomError(
        errors.friendRequestYourself.message,
        errors.friendRequestYourself.statusCode
      );
    }
    const friendExists = user.friends?.findIndex((friendId) => friendId === to);
    if (friendExists !== -1) {
      throw new CustomError(
        errors.userAlreadyFriend.message,
        errors.userAlreadyFriend.statusCode
      );
    }
    const userTo = await this.userModel.findUserById(to);
    if (!userTo) {
      throw new CustomError(
        errors.userNotFound.message,
        errors.userNotFound.statusCode
      );
    }
    const sendReqFriend = await this.friendModel.findOne({
      filter: { to, from: user._id },
    });
    if (sendReqFriend) {
      throw new CustomError(
        errors.reqAlreadyFriend.message,
        errors.reqAlreadyFriend.statusCode
      );
    }
    const friend = await this.friendModel.create({
      data: {
        to,
        from: user._id,
      },
    });
    return sendResponse({ res, data: { friend } });
  };

  acceptFriendReq = async (req: IRequest, res: Response): Promise<Response> => {
    const user = req.user as IUser;
    const { reqId, accept } = req.body;

    const friendRequest = await this.friendModel.findOne({
      filter: { to: user._id, _id: reqId },
    });

    if (!friendRequest) {
      throw new CustomError(
        errors.friendRequestNotFound.message,
        errors.friendRequestNotFound.statusCode
      );
    }

    if (accept) {
      await this.userModel.updateOne({
        filter: { _id: friendRequest.to },
        data: {
          $addToSet: { friends: friendRequest.from },
        },
      });
      await this.userModel.updateOne({
        filter: { _id: friendRequest.from },
        data: {
          $addToSet: { friends: friendRequest.to },
        },
      });
    }
    await this.friendModel.deleteOne({ filter: { _id: friendRequest._id } });
    if (accept) {
      return sendResponse({ res, message: "Friend request accepted" });
    }
    return sendResponse({
      res,
      message: "The friend request was rejected.",
    });
  };

  unfriend = async (req: IRequest, res: Response): Promise<Response> => {
    const user = req.user as IUser;
    const { friendId } = req.body;

    const isFriend = user.friends.some((id) => id.toString() === friendId);

    if (!isFriend) {
      throw new CustomError(
        errors.notFriends.message,
        errors.notFriends.statusCode
      );
    }

    await this.userModel.updateOne({
      filter: {
        _id: friendId,
      },
      data: {
        $pull: { friends: user._id },
      },
    });

    await this.userModel.updateOne({
      filter: {
        _id: user._id,
      },
      data: {
        $pull: { friends: friendId },
      },
    });
    return sendResponse({
      res,
      message: "Friendship cancelled",
    });
  };
}
