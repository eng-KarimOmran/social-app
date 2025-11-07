import { Model, Types } from "mongoose";
import { DBRepo } from "../../db/DBRepo";
import { IUser, UserModel } from "../../db/models/userModel";
import { CustomError } from "../../utils/Error";
import { errors } from "../../utils/globalErrors";

export class UserRepo extends DBRepo<IUser> {
  constructor(private readonly userModel: Model<IUser> = UserModel) {
    super(userModel);
  }
  findByEmail = async (email: string): Promise<IUser | null> => {
    const user = await this.userModel.findOne({
      email,
      paranoid: false,
    });
    return user;
  };
  findUserById = async (id: Types.ObjectId): Promise<IUser> => {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      throw new CustomError(
        errors.userNotFound.message,
        errors.userNotFound.statusCode
      );
    }
    return user;
  };
}
