import { HydratedDocument } from "mongoose";
import { IUser } from "../db/models/userModel";
import { Visibility } from "../modules/postModule/post.type";

export const visibilityConditional = (user: HydratedDocument<IUser>) => {
  return [
    {
      visibility: Visibility.PUBLIC,
    },
    {
      visibility: Visibility.PRIVATE,
      createdBy: user._id,
    },
    {
      visibility: Visibility.FRIENDS,
      createdBy: {
        $in: [...user.friends, user._id],
      },
    },
    {
      visibility: Visibility.PRIVATE,
      tags: { $in: user._id },
    },
  ];
};