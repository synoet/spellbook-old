import * as z from "zod"
import { CompleteLabel, RelatedLabelSchema, CompleteRecipe, RelatedRecipeSchema, CompleteUser, RelatedUserSchema, CompleteTeam, RelatedTeamSchema } from "./index"

export const SnippetSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  description: z.string(),
  language: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  private: z.boolean(),
  recipeId: z.string().nullish(),
  userId: z.string(),
  teamId: z.string().nullish(),
})

export interface CompleteSnippet extends z.infer<typeof SnippetSchema> {
  labels: CompleteLabel[]
  recipe?: CompleteRecipe | null
  user: CompleteUser
  team?: CompleteTeam | null
}

/**
 * RelatedSnippetSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSnippetSchema: z.ZodSchema<CompleteSnippet> = z.lazy(() => SnippetSchema.extend({
  labels: RelatedLabelSchema.array(),
  recipe: RelatedRecipeSchema.nullish(),
  user: RelatedUserSchema,
  team: RelatedTeamSchema.nullish(),
}))
