"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendRepo = void 0;
const DBRepo_1 = require("../../db/DBRepo");
const friendReqModel_1 = require("../../db/models/friendReqModel");
class FriendRepo extends DBRepo_1.DBRepo {
    model;
    constructor(model = friendReqModel_1.FriendReqModel) {
        super(model);
        this.model = model;
    }
}
exports.FriendRepo = FriendRepo;
