import { z } from "zod";

export const createPinSchema = z.object({
  
  title: z
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
    
  description: z
     .string({
      message: "Description must be a string.",
    })
    .trim()
    .min(10, {
      message: "Description must be at least 10 characters long.",
    })
    .max(100, {
      message: "Description must not exceed 100 characters.",
    })
    .optional(),

}).strict();


export const getPinSchema = z.object({
  id: z.uuid()
}).strict();

export const updatePinSchema = z.object({
  title: z
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
    })
    .optional(),
    
  description: z
     .string({
      message: "Description must be a string.",
    })
    .trim()
    .min(10, {
      message: "Description must be at least 10 characters long.",
    })
    .max(100, {
      message: "Description must not exceed 100 characters.",
    })
    .optional(),
}).strict();

export const getPinFeedSchema = z.object({

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
  .default(20)
}).strict();

export const getUserPinFeedSchema = z.object({
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