import * as z from "zod"
import { CompleteUser, RelatedUserSchema } from "./index"

export const LinkSchema = z.object({
  id: z.string(),
  linkId: z.string(),
  title: z.string(),
  type: z.string(),
  content: z.string(),
  userId: z.string().nullish(),
  createdAt: z.date(),
  visibility: z.string(),
})

export interface CompleteLink extends z.infer<typeof LinkSchema> {
  user?: CompleteUser | null
}

/**
 * RelatedLinkSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedLinkSchema: z.ZodSchema<CompleteLink> = z.lazy(() => LinkSchema.extend({
  user: RelatedUserSchema.nullish(),
}))
