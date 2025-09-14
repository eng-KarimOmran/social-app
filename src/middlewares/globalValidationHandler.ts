import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { CustomError } from "../utils/Error.js";

const validation = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = {
      ...req.body,
      ...req.params,
      ...req.query,
    };
    const result = schema.safeParse(data);

    if (!result.success) {
      const errors = result.error.issues.map(
        (err) => `${err.path} => ${err.message}`
      );
      const message = errors.join(" | ");
      throw new CustomError(message, 422);
    }
    next();
  };
};

export default validation;
