import { NextFunction, Request, Response } from "express";
import { getFile } from "../utils/upload/s3.Service";
import { CustomError } from "../utils/Error";
import { errors } from "../utils/globalErrors";
import { promisify } from "node:util";
import { pipeline } from "node:stream";

export const getFileMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { action } = req.query;
  const pipelinePromise = promisify(pipeline);
  const { path } = req.params as unknown as { path: string[] };
  const Key = path.join("/");
  const s3Res = await getFile({ Key });
  if (!s3Res.Body) {
    throw new CustomError(
      errors.failedGetFile.message,
      errors.failedGetFile.statusCode
    );
  }
  if (action === "download") {
    const name = path.at(-1)?.slice(15);
    res.header("Content-Disposition", `attachment; filename="${name}"`);
  }
  res.setHeader(
    "Content-Type",
    `${s3Res.ContentType || "application/octet-stream"}`
  );
  return await pipelinePromise(s3Res.Body as NodeJS.ReadableStream, res);
};