"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommand = exports.getAllCommands = exports.createCommand = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createCommand = (command) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.command.create({
        data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ content: command.content }, (command.description && { description: command.description })), (command.labels && {
            labels: {
                create: command.labels.map((label) => ({ content: label })),
            },
        })), { user: {
                connect: {
                    id: command.userId,
                },
            } }), (command.recipeId && {
            recipe: {
                connect: {
                    id: command.recipeId,
                },
            },
        })), (command.teamId && {
            team: {
                connect: {
                    id: command.recipeId,
                },
            },
        })),
    });
});
exports.createCommand = createCommand;
const getAllCommands = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.command.findMany({
        where: Object.assign(Object.assign(Object.assign({}, (query.ids && {
            id: {
                in: query.ids,
            },
        })), (query.labels && {
            labels: {
                some: {
                    content: {
                        in: query.labels,
                    },
                },
            },
        })), (query.q && {
            OR: {
                content: {
                    search: query.q,
                },
                description: {
                    search: query.q,
                },
            },
        })),
    });
});
exports.getAllCommands = getAllCommands;
const getCommand = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.command.findUnique({
        where: {
            id: id,
        },
        include: {
            labels: true,
            user: true,
            team: true,
            recipe: true,
        }
    });
});
exports.getCommand = getCommand;
