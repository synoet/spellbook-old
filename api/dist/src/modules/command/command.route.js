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
Object.defineProperty(exports, "__esModule", { value: true });
const command_controller_1 = require("./command.controller");
const command_schema_1 = require("./command.schema");
const commandRoutes = (server) => __awaiter(void 0, void 0, void 0, function* () {
    server.post("/", {
        schema: {
            body: (0, command_schema_1.$ref)("createCommandSchema"),
            response: {
                201: (0, command_schema_1.$ref)("createCommandResponseSchema"),
            },
        },
    }, command_controller_1.createCommandHandler);
    server.get("/", {
        schema: {
            querystring: (0, command_schema_1.$ref)("getAllCommandsSchema"),
            response: {
                200: (0, command_schema_1.$ref)("getAllCommandsResponseSchema"),
            },
        },
    }, command_controller_1.getAllCommandsHandler);
    server.get("/:id", {}, command_controller_1.getCommandHandler);
});
exports.default = commandRoutes;
