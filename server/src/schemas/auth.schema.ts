import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string({
      message: "Username must be a string.",
    })
    .trim()
    .nonempty({
    message: "Username is required.",
    })
    .min(3, {
      message: "Username must be at least 3 characters long.",
    })
    .max(25, {
      message: "Username must not exceed 25 characters.",
    }),
    
  email: z
     .email({
      message: "Please provide a valid email address.",
    })
    .trim(),

  password: z
    .string({
      message: "Password must be a string.",
    })
    .min(8, {
      message: "Password must be at least 8 characters long.",
    })
    .max(128, {
      message: "Password must not exceed 128 characters.",
    }),
}).strict();

export const loginSchema = z.object({
    
  email: z
     .email({
      message: "Please provide a valid email address.",
    })
    .trim(),

  password: z
    .string({
      message: "Password must be a string.",
    })
    .min(8, {
      message: "Password must be at least 8 characters long.",
    })
    .max(128, {
      message: "Password must not exceed 128 characters.",
    }),
}).strict();

