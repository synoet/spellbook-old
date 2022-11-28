import * as z from "zod"
import { CompleteCommand, RelatedCommandSchema, CompleteSnippet, RelatedSnippetSchema, CompleteUser, RelatedUserSchema, CompleteTeam, RelatedTeamSchema } from "./index"

export const RecipeSchema = z.object({
  id: z.string(),
  title: z.string(),
  private: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().nullish(),
  teamId: z.string().nullish(),
})

export interface CompleteRecipe extends z.infer<typeof RecipeSchema> {
  commands: CompleteCommand[]
  snippets: CompleteSnippet[]
  user?: CompleteUser | null
  team?: CompleteTeam | null
}

/**
 * RelatedRecipeSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRecipeSchema: z.ZodSchema<CompleteRecipe> = z.lazy(() => RecipeSchema.extend({
  commands: RelatedCommandSchema.array(),
  snippets: RelatedSnippetSchema.array(),
  user: RelatedUserSchema.nullish(),
  team: RelatedTeamSchema.nullish(),
}))
