import * as z from "zod"
import { CompleteTeam, RelatedTeamSchema, CompleteUser, RelatedUserSchema } from "./index"

export const TeamMemberSchema = z.object({
  id: z.string(),
  teamId: z.string(),
  userId: z.string(),
  creator: z.boolean(),
  admin: z.boolean(),
})

export interface CompleteTeamMember extends z.infer<typeof TeamMemberSchema> {
  team: CompleteTeam
  user: CompleteUser
}

/**
 * RelatedTeamMemberSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTeamMemberSchema: z.ZodSchema<CompleteTeamMember> = z.lazy(() => TeamMemberSchema.extend({
  team: RelatedTeamSchema,
  user: RelatedUserSchema,
}))
