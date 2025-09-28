import * as z from "zod";
import { TypesFile } from "./upload/multer";

export const user = {
  firstName: z.string().min(2).max(15).trim(),
  lastName: z.string().min(2).max(15).trim(),
  email: z.email().trim(),
  phone: z
    .string()
    .length(11)
    .regex(/^01(0|1|2|5)[0-9]{8}$/, { message: "Invalid Egyptian number" })
    .trim(),
  password: z.string().min(8).max(16),
};

export const otp = z.string().length(6);

export const uploadFile = {
  image: z.object({
    contentType: z.enum(TypesFile.image),
    originalname: z.string().min(4),
  }),
};
