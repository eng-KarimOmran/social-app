"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.otp = exports.user = void 0;
const z = __importStar(require("zod"));
const multer_1 = require("./upload/multer");
exports.user = {
    firstName: z.string().min(2).max(15).trim(),
    lastName: z.string().min(2).max(15).trim(),
    email: z.email().trim(),
    phone: z
        .string()
        .length(11)
        .regex(/^01(0|1|2|5)[0-9]{8}$/, { message: "Invalid Egyptian number" })
        .trim(),
    password: z.string().min(8).max(16),
};
exports.otp = z.string().length(6);
exports.uploadFile = {
    image: z.object({
        contentType: z.enum(multer_1.TypesFile.image),
        originalname: z.string().min(4),
    }),
};
