"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepo = void 0;
const DBRepo_1 = require("../../db/DBRepo");
const postModel_1 = require("../../db/models/postModel");
class PostRepo extends DBRepo_1.DBRepo {
    model;
    constructor(model = postModel_1.PostModel) {
        super(model);
        this.model = model;
    }
}
exports.PostRepo = PostRepo;
