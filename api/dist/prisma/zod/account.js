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
exports.RelatedAccountSchema = exports.AccountSchema = void 0;
const z = __importStar(require("zod"));
const index_1 = require("./index");
exports.AccountSchema = z.object({
    id: z.string(),
    userId: z.string(),
    type: z.string(),
    provider: z.string(),
    providerAccountId: z.string(),
    refresh_token: z.string().nullish(),
    access_token: z.string().nullish(),
    expires_at: z.number().int().nullish(),
    token_type: z.string().nullish(),
    scope: z.string().nullish(),
    id_token: z.string().nullish(),
    session_state: z.string().nullish(),
});
/**
 * RelatedAccountSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
exports.RelatedAccountSchema = z.lazy(() => exports.AccountSchema.extend({
    user: index_1.RelatedUserSchema,
}));
