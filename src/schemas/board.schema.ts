import { z } from "zod";

export const createBoardSchema = z.object({
  
  name: z
    .string({
      message: "Title must be a string.",
    })
    .nonempty()
    .trim()
    .min(5, {
      message: "Title must be at least 5 characters long.",
    })
    .max(25, {
      message: "Title must not exceed 25 characters.",
    }),
    
}).strict();

export const getBoardSchema = z.object({
  id: z.uuid()
}).strict();

export const updateBoardSchema = z.object({
  
  name: z
    .string({
      message: "Title must be a string.",
    })
    .nonempty()
    .trim()
    .min(5, {
      message: "Title must be at least 5 characters long.",
    })
    .max(25, {
      message: "Title must not exceed 25 characters.",
    }),
    
}).strict();

export const getUserBoardFeedSchema = z.object({
  page: z.coerce
  .number()
  .int("Page must be an integer")
  .min(1, "Page must be atleast 1")
  .default(1),

  limit: z.coerce
  .number()
  .int("Limit must be an integer")
  .min(20, "Limit must be atleast 20")
  .max(50, "Cannot request more than 50 pins at a time")
  .default(20),

  sort: z.enum(["newest", "oldest"])
  .default("newest")

}).strict();
