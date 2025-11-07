import { Model, FilterQuery, Types, UpdateQuery, QueryOptions } from "mongoose";

export abstract class DBRepo<T> {
  constructor(protected readonly model: Model<T>) {}

  create = async ({ data }: { data: Partial<T> }): Promise<T> => {
    const doc = await this.model.create(data);
    return doc;
  };

  findOne = async ({
    filter,
  }: {
    filter: FilterQuery<T>;
  }): Promise<T | null> => {
    const doc = await this.model.findOne(filter);
    return doc;
  };

  find = async ({
    filter,
    options = {},
  }: {
    filter: FilterQuery<T>;
    options?: QueryOptions;
  }): Promise<T[] | null> => {
    const doc = await this.model.find(filter, null, options);
    return doc;
  };

  updateOne = async ({
    filter,
    data,
  }: {
    filter: FilterQuery<T>;
    data: UpdateQuery<T>;
  }) => {
    const doc = await this.model.updateOne(filter, data);
    return doc;
  };

  deleteOne = async ({ filter }: { filter: FilterQuery<T> }) => {
    const doc = await this.model.deleteOne(filter);
    return doc;
  };

  deleteMany = async ({ filter }: { filter: FilterQuery<T> }) => {
    const doc = await this.model.deleteMany(filter);
    return doc;
  };

  findOneAndUpdate = async (
    filter: FilterQuery<T>,
    data: UpdateQuery<T>,
    isNew: boolean = true
  ) => {
    const doc = await this.model.findOneAndUpdate(filter, data, {
      new: isNew,
      upsert: false,
    });
    return doc;
  };

  softDelete = async (id: Types.ObjectId) => {
    const doc = await this.model.findOneAndUpdate(
      { _id: id },
      { deleteAt: Date.now() },
      { new: true }
    );
    return doc;
  };

  updateMany = async ({
    filter,
    data,
    options = {},
  }: {
    filter: FilterQuery<T>;
    data: UpdateQuery<T>;
    options?: Record<string, any>;
  }) => {
    const result = await this.model.updateMany(filter, data, options);
    return result;
  };
}
