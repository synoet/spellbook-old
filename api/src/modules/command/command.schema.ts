import { Command, Label} from "@prisma/client";
import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

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

export type CreateCommandSchema = z.infer<typeof createCommandSchema>;

export const { schemas: commandSchemas, $ref } = buildJsonSchemas({
  createCommandSchema,
});
