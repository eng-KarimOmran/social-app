"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendReqModel = void 0;
const mongoose_1 = require("mongoose");
const FriendReqSchema = new mongoose_1.Schema({
    from: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "users",
    },
    to: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "users",
    },
}, {
    timestamps: true,
});
exports.FriendReqModel = (0, mongoose_1.model)("friendReq", FriendReqSchema);
