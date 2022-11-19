"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ref = exports.commandSchemas = void 0;
const zod_1 = require("zod");
const fastify_zod_1 = require("fastify-zod");
const zod_2 = require("../../../prisma/zod");
const createCommandSchema = zod_1.z.object({
    content: zod_1.z
        .string({
        required_error: "Content is required",
        invalid_type_error: "Content must be a string",
    })
        .min(2)
        .max(100),
    description: zod_1.z
        .string({
        required_error: "Description is required",
        invalid_type_error: "Description must be a string",
    })
        .min(2)
        .max(100)
        .optional(),
    labels: zod_1.z.array(zod_1.z.string()).optional(),
    userId: zod_1.z.string({
        required_error: "userId is required",
        invalid_type_error: "userId must be a string",
    }),
    recipeId: zod_1.z.string().optional(),
    teamId: zod_1.z.string().optional(),
});
const createCommandResponseSchema = zod_2.CommandSchema;
const getAllCommandsSchema = zod_1.z.object({
    ids: zod_1.z.array(zod_1.z.string()).max(20).optional(),
    q: zod_1.z.string().optional(),
    labels: zod_1.z.array(zod_1.z.string()).optional(),
});
const getAllCommandsResponseSchema = zod_1.z.object({
    facets: getAllCommandsSchema,
    commands: zod_1.z.array(zod_2.CommandSchema),
});
const getCommandSchema = zod_1.z.object({
    id: zod_1.z.string({
        required_error: "id is required",
        invalid_type_error: "id must be a string",
    }),
});
const getCommandResponseSchema = zod_2.CommandSchema.extend({
    labels: zod_1.z.array(zod_2.LabelSchema),
    user: zod_2.UserSchema,
    recipe: zod_2.RecipeSchema.optional(),
    team: zod_2.TeamSchema.optional(),
});
_a = (0, fastify_zod_1.buildJsonSchemas)({
    createCommandSchema,
    createCommandResponseSchema,
    getAllCommandsSchema,
    getAllCommandsResponseSchema,
    getCommandSchema,
    getCommandResponseSchema,
}), exports.commandSchemas = _a.schemas, exports.$ref = _a.$ref;
