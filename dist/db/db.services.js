"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOne = void 0;
const findOne = (model, filter) => {
    return model.findOne({ filter });
};
exports.findOne = findOne;
