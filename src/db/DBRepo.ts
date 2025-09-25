import { Model, FilterQuery } from "mongoose";

export abstract class DBRepo<T> {
  constructor(private readonly model: Model<T>) {}

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

  updateOne = async ({
    filter,
    data,
  }: {
    filter: FilterQuery<T>;
    data: Partial<T>;
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
}
