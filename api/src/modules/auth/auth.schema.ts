import { z } from "zod";

export const userTokenSchema = z.object({
  id: z.string(),
});

export type UserToken = z.infer<typeof userTokenSchema>;