"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachCommandRoutes = void 0;
const command_schema_1 = require("./command.schema");
const command_route_1 = __importDefault(require("./command.route"));
const attachCommandRoutes = (server) => {
    for (const schema of command_schema_1.commandSchemas) {
        server.addSchema(schema);
    }
    server.register(command_route_1.default, { prefix: "/api/command" });
};
exports.attachCommandRoutes = attachCommandRoutes;
