"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.TypesFile = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.TypesFile = {
    image: ["image/jpeg", "image/png", "image/jpg"],
};
const upload = () => {
    const baseUploadPath = path_1.default.join(__dirname, "../../../uploadMedia");
    console.log(__dirname);
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            const userFolder = `${baseUploadPath}/${req.user?._id}`;
            if (!fs_1.default.existsSync(userFolder)) {
                fs_1.default.mkdirSync(userFolder, { recursive: true });
            }
            cb(null, userFolder);
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    });
    return (0, multer_1.default)({
        storage,
    });
};
exports.upload = upload;
