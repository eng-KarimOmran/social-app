"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_js_1 = require("../../db/models/userModel.js");
const Error_js_1 = require("../../utils/Error.js");
const SendResponse_js_1 = __importDefault(require("../../utils/SendResponse.js"));
class UserServices {
    constructor() { }
    async signup(req, res, next) {
        const { firstName, lastName, email, phone, password } = req.body;
        const userExists = await userModel_js_1.userModel.findOne({ email });
        if (userExists) {
            throw new Error_js_1.CustomError("The user already exists", 400);
        }
        const newUser = await userModel_js_1.userModel.create({
            firstName,
            lastName,
            email,
            phone,
            password,
        });
        return (0, SendResponse_js_1.default)({
            res,
            status: 201,
            message: "user added",
            data: { user: newUser.toJSON() },
        });
    }
}
exports.default = UserServices;
