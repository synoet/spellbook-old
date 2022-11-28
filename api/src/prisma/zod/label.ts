import * as z from "zod"
import { CompleteCommand, RelatedCommandSchema, CompleteSnippet, RelatedSnippetSchema } from "./index"

export const LabelSchema = z.object({
  id: z.string(),
  content: z.string(),
  snippetId: z.string().nullish(),
  commandId: z.string().nullish(),
})

export interface CompleteLabel extends z.infer<typeof LabelSchema> {
  Command?: CompleteCommand | null
  Snippet?: CompleteSnippet | null
}

/**
 * RelatedLabelSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedLabelSchema: z.ZodSchema<CompleteLabel> = z.lazy(() => LabelSchema.extend({
  Command: RelatedCommandSchema.nullish(),
  Snippet: RelatedSnippetSchema.nullish(),
}))
