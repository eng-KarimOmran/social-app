"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.TypesFile = exports.StoreIn = void 0;
const multer_1 = __importDefault(require("multer"));
const Error_1 = require("../Error");
const globalErrors_1 = require("../globalErrors");
var StoreIn;
(function (StoreIn) {
    StoreIn["memory"] = "memory";
    StoreIn["disk"] = "disk";
})(StoreIn || (exports.StoreIn = StoreIn = {}));
exports.TypesFile = {
    image: ["image/jpeg", "image/png", "image/jpg"],
};
const upload = ({ type = exports.TypesFile.image, storeIn = StoreIn.memory, }) => {
    const storage = storeIn === StoreIn.memory
        ? multer_1.default.memoryStorage()
        : multer_1.default.diskStorage({});
    const fileFilter = (req, file, cb) => {
        if (!type.includes(file.mimetype)) {
            return cb(new Error_1.CustomError(globalErrors_1.errors.invalidFileType.message, globalErrors_1.errors.invalidFileType.statusCode), false);
        }
        cb(null, true);
    };
    return (0, multer_1.default)({
        storage,
        fileFilter,
        limits: { fileSize: storeIn && StoreIn.memory && 5 * 1024 ** 2 },
    });
};
exports.upload = upload;
