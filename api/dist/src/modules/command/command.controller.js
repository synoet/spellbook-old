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
exports.getCommandHandler = exports.getAllCommandsHandler = exports.createCommandHandler = void 0;
const command_service_1 = require("./command.service");
const createCommandHandler = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const command = yield (0, command_service_1.createCommand)(req.body).catch((e) => {
        console.error(e);
        rep.status(500).send("Error Creating Command");
    });
    rep.status(201).send(command);
});
exports.createCommandHandler = createCommandHandler;
const getAllCommandsHandler = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, command_service_1.getAllCommands)(req.query).catch((e) => {
        console.error(e);
        rep.status(500).send("Error Getting Commands");
    });
    rep.status(200).send({
        commands: response,
        facets: req.query,
    });
});
exports.getAllCommandsHandler = getAllCommandsHandler;
const getCommandHandler = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const command = yield (0, command_service_1.getCommand)(req.params.id).catch((e) => {
        console.error(e);
        rep.status(500).send("Error Getting Command");
    });
    rep.status(200).send(command);
});
exports.getCommandHandler = getCommandHandler;
