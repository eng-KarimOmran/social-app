import { Response, Request, NextFunction } from "express";
import { userModel } from "../../db/models/userModel";
import { CustomError } from "../../utils/Error";
import sendResponse from "../../utils/SendResponse";

interface IUserServices {
  signup(req: Request, res: Response, next: NextFunction): Promise<Response>;
}

class UserServices implements IUserServices {
  constructor() {}

  async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    const { firstName, lastName, email, phone, password } = req.body;
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      throw new CustomError("The user already exists", 400);
    }

    const newUser = await userModel.create({
      firstName,
      lastName,
      email,
      phone,
      password,
    });

    return sendResponse({
      res,
      status: 201,
      message: "user added",
      data: { user: newUser.toJSON() },
    });
  }
}

export default UserServices;
