import { z } from "zod";

export const userTokenSchema = z.object({
  id: z.string(),
  exp: z.string(),
  iat: z.number(),
});

export type UserToken = z.infer<typeof userTokenSchema>;