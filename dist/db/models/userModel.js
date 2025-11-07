"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const Encryption_1 = require("../../utils/Encryption");
const userSchema = new mongoose_2.default.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 25,
    },
    lastName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 25,
    },
    slug: {
        type: String,
        minLength: 2,
        maxLength: 51,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
    },
    emailConfirmed: {
        type: Boolean,
        default: false,
    },
    lastSensitiveUpdate: {
        type: Date,
        default: new Date(Date.now()),
    },
    profileImage: {
        type: String,
    },
    deleteAt: {
        type: Date,
        default: null,
    },
    friends: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "users",
        },
    ],
}, {
    timestamps: true,
});
userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await (0, Encryption_1.hash)(this.password);
        this.lastSensitiveUpdate = new Date(Date.now());
    }
});
userSchema.pre(["find", "findOne"], function (next) {
    const query = this;
    const { paranoid } = query._conditions;
    delete query._conditions.paranoid;
    if (paranoid !== false) {
        query.where({ deleteAt: null });
    }
    next();
});
userSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (update?.deleteAt) {
        update.lastSensitiveUpdate = Date.now();
    }
    next();
});
exports.UserModel = mongoose_2.default.model("User", userSchema);
