"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepo = void 0;
const DBRepo_1 = require("../../db/DBRepo");
const userModel_1 = require("../../db/models/userModel");
class UserRepo extends DBRepo_1.DBRepo {
    userModel;
    constructor(userModel = userModel_1.UserModel) {
        super(userModel);
        this.userModel = userModel;
    }
    findByEmail = async (email) => {
        const user = await this.userModel.findOne({ email });
        return user;
    };
}
exports.UserRepo = UserRepo;
