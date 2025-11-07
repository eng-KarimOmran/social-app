"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepo = void 0;
const DBRepo_1 = require("../../db/DBRepo");
const userModel_1 = require("../../db/models/userModel");
const Error_1 = require("../../utils/Error");
const globalErrors_1 = require("../../utils/globalErrors");
class UserRepo extends DBRepo_1.DBRepo {
    userModel;
    constructor(userModel = userModel_1.UserModel) {
        super(userModel);
        this.userModel = userModel;
    }
    findByEmail = async (email) => {
        const user = await this.userModel.findOne({
            email,
            paranoid: false,
        });
        return user;
    };
    findUserById = async (id) => {
        const user = await this.userModel.findOne({ _id: id });
        if (!user) {
            throw new Error_1.CustomError(globalErrors_1.errors.userNotFound.message, globalErrors_1.errors.userNotFound.statusCode);
        }
        return user;
    };
}
exports.UserRepo = UserRepo;
