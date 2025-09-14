import { NextFunction, Request, Response } from "express";
import { ICustomError } from "../utils/Error.js";

const globalErrorHandler = (
  err: ICustomError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  return res.status(err.statusCode || 500).json({
    success: false,
    status: err.statusCode || 500,
    message: err.message,
  });
};

export default globalErrorHandler;
