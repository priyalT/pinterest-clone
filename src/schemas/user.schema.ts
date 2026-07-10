import { z } from "zod";

export const getUserSchema = z.object({
  id: z.uuid()
}).strict();

export const updateUserSchema = z.object({
  username: z
    .string({
      message: "Username must be a string.",
    })
    .trim()
    .min(3, {
      message: "Username must be at least 3 characters long.",
    })
    .max(25, {
      message: "Username must not exceed 25 characters.",
    })
    .optional(),
    
  email: z
     .email({
      message: "Please provide a valid email address.",
    })
    .trim()
    .optional(),

  password: z
    .string({
      message: "Password must be a string.",
    })
    .min(8, {
      message: "Password must be at least 8 characters long.",
    })
    .max(128, {
      message: "Password must not exceed 128 characters.",
    })
    .optional(),
  
  removeAvatar: z.union(
    [z.boolean(),
      z.literal('true'),
      z.literal('false')
    ]
  ).optional()
  }).strict();


