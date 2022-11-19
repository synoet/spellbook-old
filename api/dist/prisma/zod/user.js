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
exports.RelatedUserSchema = exports.UserSchema = void 0;
const z = __importStar(require("zod"));
const index_1 = require("./index");
exports.UserSchema = z.object({
    id: z.string(),
    name: z.string().nullish(),
    email: z.string().nullish(),
    username: z.string().nullish(),
    emailVerified: z.date().nullish(),
    image: z.string().nullish(),
});
/**
 * RelatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
exports.RelatedUserSchema = z.lazy(() => exports.UserSchema.extend({
    accounts: index_1.RelatedAccountSchema.array(),
    sessions: index_1.RelatedSessionSchema.array(),
    commands: index_1.RelatedCommandSchema.array(),
    snippets: index_1.RelatedSnippetSchema.array(),
    links: index_1.RelatedLinkSchema.array(),
    recipes: index_1.RelatedRecipeSchema.array(),
    teams: index_1.RelatedTeamSchema.array(),
}));
