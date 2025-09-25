"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBRepo = void 0;
class DBRepo {
    model;
    constructor(model) {
        this.model = model;
    }
    create = async ({ data }) => {
        const doc = await this.model.create(data);
        return doc;
    };
    findOne = async ({ filter, }) => {
        const doc = await this.model.findOne(filter);
        return doc;
    };
    updateOne = async ({ filter, data, }) => {
        const doc = await this.model.updateOne(filter, data);
        return doc;
    };
    deleteOne = async ({ filter }) => {
        const doc = await this.model.deleteOne(filter);
        return doc;
    };
    deleteMany = async ({ filter }) => {
        const doc = await this.model.deleteMany(filter);
        return doc;
    };
}
exports.DBRepo = DBRepo;
