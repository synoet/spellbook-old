import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { CommandSchema } from "../../../prisma/zod";

const createCommandSchema = z.object({
  content: z
    .string({
      required_error: "Content is required",
      invalid_type_error: "Content must be a string",
    })
    .min(2)
    .max(100),
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    })
    .min(2)
    .max(100)
    .optional(),
  labels: z.array(z.string()).optional(),
  userId: z.string({
    required_error: "userId is required",
    invalid_type_error: "userId must be a string",
  }),
  recipeId: z.string().optional(),
  teamId: z.string().optional(),
});

const createCommandResponseSchema = CommandSchema;

export type CreateCommandSchema = z.infer<typeof createCommandSchema>;
export type CreateCommandResponseSchema = z.infer<
  typeof createCommandResponseSchema
>;

const getAllCommandsSchema = z.object({
  ids: z.array(z.string()).max(20).optional(),
  q: z.string().optional(),
  labels: z.array(z.string()).optional(),
});

const getAllCommandsResponseSchema = z.object({
  facets: getAllCommandsSchema,
  commands: z.array(CommandSchema),
});

export type GetAllCommandsSchema = z.infer<typeof getAllCommandsSchema>;
export type GetAllCommandsResponseSchema = z.infer<
  typeof getAllCommandsResponseSchema
>;

export const { schemas: commandSchemas, $ref } = buildJsonSchemas({
  createCommandSchema,
  createCommandResponseSchema,
  getAllCommandsSchema,
  getAllCommandsResponseSchema,
});
