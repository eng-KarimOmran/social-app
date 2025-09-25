"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCode = void 0;
const nanoid_1 = require("nanoid");
const nanoid = (0, nanoid_1.customAlphabet)("0123456789", 6);
const createCode = () => {
    const code = nanoid();
    return code;
};
exports.createCode = createCode;
