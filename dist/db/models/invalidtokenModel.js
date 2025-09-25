"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTokenModel = void 0;
const mongoose_1 = require("mongoose");
const invalidTokenSchema = new mongoose_1.Schema({
    jti: {
        type: String,
        required: true,
    },
    exp: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
});
exports.InvalidTokenModel = (0, mongoose_1.model)("InvalidToken", invalidTokenSchema);
