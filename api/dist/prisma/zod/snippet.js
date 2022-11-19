"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatedSnippetSchema = exports.SnippetSchema = void 0;
const z = __importStar(require("zod"));
const index_1 = require("./index");
exports.SnippetSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    description: z.string(),
    language: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    private: z.boolean(),
    recipeId: z.string().nullish(),
    userId: z.string(),
    teamId: z.string().nullish(),
});
/**
 * RelatedSnippetSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
exports.RelatedSnippetSchema = z.lazy(() => exports.SnippetSchema.extend({
    labels: index_1.RelatedLabelSchema.array(),
    recipe: index_1.RelatedRecipeSchema.nullish(),
    user: index_1.RelatedUserSchema,
    team: index_1.RelatedTeamSchema.nullish(),
}));
