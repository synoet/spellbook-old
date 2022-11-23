import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import {
  SnippetSchema,
  UserSchema,
  RecipeSchema,
  TeamSchema,
  LabelSchema,
} from "../../../prisma/zod";

export const createSnippetSchema = z.object({
  title: z.string(),
  content: z.string().min(5).max(100),
  description: z.string().optional(),
  labels: z.array(z.string()).optional(),
  userId: z.string(),
  teamId: z.string().optional(),
  recipeId: z.string().optional(),
});

export const createSnippetResponseSchema = SnippetSchema;

export type CreateSnippetSchema = z.infer<typeof createSnippetSchema>;
export type CreateSnippetResponseSchema = z.infer<
  typeof createSnippetResponseSchema
>;

const getAllSnippetsSchema = z.object({
  ids: z.array(z.string()).max(20).optional(),
  q: z.string().optional(),
  labels: z.array(z.string()).optional(),
});

const getAllSnippetsResponseSchema = z.object({
  facets: getAllSnippetsSchema,
  snippets: z.array(SnippetSchema),
});

export type GetAllSnippetsSchema = z.infer<typeof getAllSnippetsSchema>;
export type GetAllSnippetsResponseSchema = z.infer<
  typeof getAllSnippetsResponseSchema
>;

const getSnippetSchema = z.object({
  id: z.string({
    required_error: "id is required",
    invalid_type_error: "id must be a string",
  }),
});

const getSnippetResponseSchema = SnippetSchema.extend({
  labels: z.array(LabelSchema),
  user: UserSchema,
  recipe: RecipeSchema.optional(),
  team: TeamSchema.optional(),
});

export type GetSnippetSchema = z.infer<typeof getSnippetSchema>;
export type GetSnippetResponseSchema = z.infer<typeof getSnippetResponseSchema>;

export const { schemas: snippetSchemas, $ref } = buildJsonSchemas(
  {
    createSnippetSchema,
    createSnippetResponseSchema,
    getAllSnippetsSchema,
    getAllSnippetsResponseSchema,
    getSnippetSchema,
  },
  { $id: "snippet" }
);
