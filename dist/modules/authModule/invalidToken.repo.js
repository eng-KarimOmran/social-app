"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTokenRepo = void 0;
const DBRepo_1 = require("../../db/DBRepo");
const invalidTokenModel_1 = require("../../db/models/invalidTokenModel");
class InvalidTokenRepo extends DBRepo_1.DBRepo {
    otpModel;
    constructor(otpModel = invalidTokenModel_1.InvalidTokenModel) {
        super(otpModel);
        this.otpModel = otpModel;
    }
}
exports.InvalidTokenRepo = InvalidTokenRepo;
