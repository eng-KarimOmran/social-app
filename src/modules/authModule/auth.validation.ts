import * as z from "zod";
import { otp, user } from "../../utils/globalValidationSchema";

export const signupSchema = z
  .object({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    password: user.password,
    confirmPassword: user.password,
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

export const confirmEmailSchema = z.object({
  otp: otp,
  email: user.email,
});

export const resendConfirmEmailCode = z.object({
  email: user.email,
});

export const login = z.object({
  email: user.email,
  password: user.password,
});

export const forgotPassword = z.object({
  email: user.email,
});

export const verifyPasswordResetCode = z.object({
  email: user.email,
  otp: otp,
});

export const changePassword = z
  .object({
    password: user.password,
    confirmPassword: user.password,
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
