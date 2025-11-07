"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRepo = void 0;
const DBRepo_1 = require("../../db/DBRepo");
const otpModel_1 = require("../../db/models/otpModel");
class OtpRepo extends DBRepo_1.DBRepo {
    model;
    constructor(model = otpModel_1.OtpModel) {
        super(model);
        this.model = model;
    }
}
exports.OtpRepo = OtpRepo;
