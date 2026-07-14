import { z } from "zod";

export const searchPinSchema = z.object({
    q: z.string()
    .min(1, "Search query cannot be empty"), 

    page: z.coerce.
    number()
    .min(1)
    .default(1),

    limit: z.coerce
    .number()
    .min(1)
    .max(100)
    .default(50),
});
