"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpModel = exports.OtpType = void 0;
const mongoose_1 = require("mongoose");
var OtpType;
(function (OtpType) {
    OtpType["confirmedEmail"] = "confirmedEmail";
    OtpType["ResetPassword"] = "resetPassword";
})(OtpType || (exports.OtpType = OtpType = {}));
const otpSchema = new mongoose_1.Schema({
    email: { type: String, ref: "User", required: true },
    otp: { type: String, required: true },
    typeOtp: { type: String, enum: Object.values(OtpType), required: true },
    exp: { type: Date, required: true },
}, {
    timestamps: true,
});
exports.OtpModel = (0, mongoose_1.model)("Otp", otpSchema);
