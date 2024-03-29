import * as z from "zod"
import { CompleteTeamMember, RelatedTeamMemberSchema, CompleteCommand, RelatedCommandSchema, CompleteRecipe, RelatedRecipeSchema, CompleteSnippet, RelatedSnippetSchema } from "./index"

export const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteTeam extends z.infer<typeof TeamSchema> {
  members: CompleteTeamMember[]
  commands: CompleteCommand[]
  recipes: CompleteRecipe[]
  snippets: CompleteSnippet[]
}

/**
 * RelatedTeamSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTeamSchema: z.ZodSchema<CompleteTeam> = z.lazy(() => TeamSchema.extend({
  members: RelatedTeamMemberSchema.array(),
  commands: RelatedCommandSchema.array(),
  recipes: RelatedRecipeSchema.array(),
  snippets: RelatedSnippetSchema.array(),
}))
