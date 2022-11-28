import * as z from "zod"
import { CompleteUser, RelatedUserSchema } from "./index"

export const SessionSchema = z.object({
  id: z.string(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.date(),
})

export interface CompleteSession extends z.infer<typeof SessionSchema> {
  user: CompleteUser
}

/**
 * RelatedSessionSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSessionSchema: z.ZodSchema<CompleteSession> = z.lazy(() => SessionSchema.extend({
  user: RelatedUserSchema,
}))
