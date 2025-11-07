"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendReqServices = void 0;
const globalErrors_1 = require("./../../utils/globalErrors");
const friendReq_repo_1 = require("./friendReq.repo");
const Error_1 = require("../../utils/Error");
const user_repo_1 = require("../authModule/user.repo");
const SendResponse_1 = __importDefault(require("../../utils/SendResponse"));
class friendReqServices {
    friendModel = new friendReq_repo_1.FriendRepo();
    userModel = new user_repo_1.UserRepo();
    constructor() { }
    addFriend = async (req, res) => {
        const user = req.user;
        const { to } = req.body;
        if (to === user._id) {
            throw new Error_1.CustomError(globalErrors_1.errors.friendRequestYourself.message, globalErrors_1.errors.friendRequestYourself.statusCode);
        }
        const friendExists = user.friends?.findIndex((friendId) => friendId === to);
        if (friendExists !== -1) {
            throw new Error_1.CustomError(globalErrors_1.errors.userAlreadyFriend.message, globalErrors_1.errors.userAlreadyFriend.statusCode);
        }
        const userTo = await this.userModel.findUserById(to);
        if (!userTo) {
            throw new Error_1.CustomError(globalErrors_1.errors.userNotFound.message, globalErrors_1.errors.userNotFound.statusCode);
        }
        const sendReqFriend = await this.friendModel.findOne({
            filter: { to, from: user._id },
        });
        if (sendReqFriend) {
            throw new Error_1.CustomError(globalErrors_1.errors.reqAlreadyFriend.message, globalErrors_1.errors.reqAlreadyFriend.statusCode);
        }
        const friend = await this.friendModel.create({
            data: {
                to,
                from: user._id,
            },
        });
        return (0, SendResponse_1.default)({ res, data: { friend } });
    };
    acceptFriendReq = async (req, res) => {
        const user = req.user;
        const { reqId, accept } = req.body;
        const friendRequest = await this.friendModel.findOne({
            filter: { to: user._id, _id: reqId },
        });
        if (!friendRequest) {
            throw new Error_1.CustomError(globalErrors_1.errors.friendRequestNotFound.message, globalErrors_1.errors.friendRequestNotFound.statusCode);
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
            return (0, SendResponse_1.default)({ res, message: "Friend request accepted" });
        }
        return (0, SendResponse_1.default)({
            res,
            message: "The friend request was rejected.",
        });
    };
    unfriend = async (req, res) => {
        const user = req.user;
        const { friendId } = req.body;
        const isFriend = user.friends.some((id) => id.toString() === friendId);
        if (!isFriend) {
            throw new Error_1.CustomError(globalErrors_1.errors.notFriends.message, globalErrors_1.errors.notFriends.statusCode);
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
        return (0, SendResponse_1.default)({
            res,
            message: "Friendship cancelled",
        });
    };
}
exports.friendReqServices = friendReqServices;
