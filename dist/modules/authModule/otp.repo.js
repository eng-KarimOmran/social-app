"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRepo = void 0;
const DBRepo_1 = require("../../db/DBRepo");
const otpModel_1 = require("../../db/models/otpModel");
class OtpRepo extends DBRepo_1.DBRepo {
    otpModel;
    constructor(otpModel = otpModel_1.OtpModel) {
        super(otpModel);
        this.otpModel = otpModel;
    }
}
exports.OtpRepo = OtpRepo;
