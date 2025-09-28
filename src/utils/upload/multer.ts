import { Request } from "express";
import multer from "multer";
import { CustomError } from "../Error";
import { errors } from "../globalErrors";

export enum StoreIn {
  memory = "memory",
  disk = "disk",
}

export const TypesFile = {
  image: ["image/jpeg", "image/png", "image/jpg"],
};

export const upload = ({
  type = TypesFile.image,
  storeIn = StoreIn.memory,
}: {
  type?: string[];
  storeIn?: StoreIn;
}) => {
  const storage =
    storeIn === StoreIn.memory
      ? multer.memoryStorage()
      : multer.diskStorage({});

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: CallableFunction
  ) => {
    if (!type.includes(file.mimetype)) {
      return cb(
        new CustomError(
          errors.invalidFileType.message,
          errors.invalidFileType.statusCode
        ),
        false
      );
    }
    cb(null, true);
  };
  return multer({
    storage,
    fileFilter,
    limits: { fileSize: storeIn && StoreIn.memory && 5 * 1024 ** 2 },
  });
};
