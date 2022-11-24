import * as z from "zod"
import { CompleteCommand, RelatedCommandSchema, CompleteSnippet, RelatedSnippetSchema, CompleteRecipe, RelatedRecipeSchema, CompleteLink, RelatedLinkSchema, CompleteTeam, RelatedTeamSchema } from "./index"

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  profileImage: z.string(),
  githubId: z.string().nullish(),
})

export interface CompleteUser extends z.infer<typeof UserSchema> {
  commands: CompleteCommand[]
  snippets: CompleteSnippet[]
  recipes: CompleteRecipe[]
  links: CompleteLink[]
  teams: CompleteTeam[]
}

/**
 * RelatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() => UserSchema.extend({
  commands: RelatedCommandSchema.array(),
  snippets: RelatedSnippetSchema.array(),
  recipes: RelatedRecipeSchema.array(),
  links: RelatedLinkSchema.array(),
  teams: RelatedTeamSchema.array(),
}))
