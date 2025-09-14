import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import baseRouter from "../routes";
import globalErrorHandler from "../middlewares/globalErrorHandler";
import { connectDB } from "../db/db.connect";
dotenv.config({ path: path.resolve("./src/config/.env") });
const app = express();
export const bootstrap = async () => {
  await connectDB();
  app.use(express.json());
  app.use("/api/v1/", baseRouter);

  app.get("/", (req: Request, res: Response, next: NextFunction): Response => {
    return res.status(200).json({ message: "Welcome to the server" });
  });

  app.use(globalErrorHandler);

  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
};
