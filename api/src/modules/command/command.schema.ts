import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const commandInput = {
  content: z.string().nonempty({
    message: "Content field cannot be empty"
  }),
  description: z.string().nonempty({
    message: "Description cannot be empty"
  }).min(10, {
    message: "Description should be verbose"
  }),
  labels: z.array(z.string()).nonempty({

    message: "A Command Label cannot be empty",
  }).min(2, {
    message: "Commands require atleast 2 labels",
  }),
}

const commandCreated = {
  id: z.string().cuid(),
  createdAt: z.string().nonempty(),
  updatedAt: z.string().nonempty(),
  content: z.string().nonempty(),
}

const createCommandSchema = z.object({
  ...commandInput,
});

const commandResponseSchema = z.object({
  ...commandInput,
  ...commandCreated,
});


const getCommandSchema = z.object({
  id: z.string().nonempty().min(5, {
    message: "This id doesnt look right, check it again"
  }),
});

const searchCommandsSchema = z.object({
  q: z.string().nonempty({
    message: "/search does not support empty queries. try GET /commands",
  }).min(1, {
    message: "A search query requires atleast one word",
  }),
});

const commandsResponseSchema = z.array(commandResponseSchema);

export type CommandsResponseSchema = z.infer<typeof commandsResponseSchema>;
export type CreateCommandSchema = z.infer<typeof createCommandSchema>;
export type UpdateCommandSchema = Partial<z.infer<typeof createCommandSchema>>;
export type CommandResponseSchema = z.infer<typeof commandResponseSchema>;
export type GetCommandSchema = z.infer<typeof getCommandSchema>;
export type SearchCommandsSchema = z.infer<typeof searchCommandsSchema>;

export const { schemas: commandSchemas, $ref } = buildJsonSchemas({
  getCommandSchema,
  searchCommandsSchema,
  createCommandSchema,
  commandResponseSchema,
  commandsResponseSchema,
});
