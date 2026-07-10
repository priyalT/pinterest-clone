import { z } from "zod";

export const commentsSchema = z.object({
  
  text: z
    .string({
      message: "Comment must be a string.",
    })
    .nonempty()
    .trim()
    .min(1, {
      message: "Comment must be at least 1 character long.",
    })
    .max(500, {
      message: "Comment must not exceed 500 characters.",
    }),
    

}).strict();

export const deleteCommentSchema = z.object({
    id: z.uuid()
})
