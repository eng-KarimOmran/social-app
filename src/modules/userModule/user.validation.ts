import * as z from "zod";
import { user } from "../../utils/globalValidationSchema";

export const signupSchema = z
  .object({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    password: user.password,
    confirmPassword: user.confirmPassword,
  })
  .superRefine((args, ctx) => {
    if (args.password != args.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Password must be equal to Confirm Password",
      });
    }
  });
