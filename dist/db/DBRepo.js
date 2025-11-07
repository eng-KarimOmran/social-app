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
    find = async ({ filter, options = {}, }) => {
        const doc = await this.model.find(filter, null, options);
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
    findOneAndUpdate = async (filter, data, isNew = true) => {
        const doc = await this.model.findOneAndUpdate(filter, data, {
            new: isNew,
            upsert: false,
        });
        return doc;
    };
    softDelete = async (id) => {
        const doc = await this.model.findOneAndUpdate({ _id: id }, { deleteAt: Date.now() }, { new: true });
        return doc;
    };
    updateMany = async ({ filter, data, options = {}, }) => {
        const result = await this.model.updateMany(filter, data, options);
        return result;
    };
}
exports.DBRepo = DBRepo;
