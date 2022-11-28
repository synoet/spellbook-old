import * as z from "zod"
import { CompleteLabel, RelatedLabelSchema, CompleteRecipe, RelatedRecipeSchema, CompleteUser, RelatedUserSchema, CompleteTeam, RelatedTeamSchema } from "./index"

export const CommandSchema = z.object({
  id: z.string(),
  content: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  private: z.boolean(),
  recipeId: z.string().nullish(),
  userId: z.string(),
  teamId: z.string().nullish(),
})

export interface CompleteCommand extends z.infer<typeof CommandSchema> {
  labels: CompleteLabel[]
  recipe?: CompleteRecipe | null
  user: CompleteUser
  team?: CompleteTeam | null
}

/**
 * RelatedCommandSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCommandSchema: z.ZodSchema<CompleteCommand> = z.lazy(() => CommandSchema.extend({
  labels: RelatedLabelSchema.array(),
  recipe: RelatedRecipeSchema.nullish(),
  user: RelatedUserSchema,
  team: RelatedTeamSchema.nullish(),
}))
