import { NextFunction, Request, Response } from "express";
import { ICustomError } from "../utils/Error";
import { errors } from "../utils/globalErrors";

const globalErrorHandler = (
  err: ICustomError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  return res.status(err.statusCode || errors.serverError.statusCode).json({
    success: false,
    status: err.statusCode || 500,
    message: err.message || errors.serverError.message,
  });
};

export default globalErrorHandler;