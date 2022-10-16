#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmount = exports.clear = void 0;
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const meow_1 = __importDefault(require("meow"));
const ui_1 = __importDefault(require("./ui"));
const cli = (0, meow_1.default)(`
	Usage
	  $ cli

	Options
		--name  Your name

	Examples
	  $ cli --name=Jane
	  Hello, Jane
`, {
    flags: {
        query: {
            type: 'string'
        }
    }
});
_a = (0, ink_1.render)(react_1.default.createElement(ui_1.default, { query: cli.flags.query })), exports.clear = _a.clear, exports.unmount = _a.unmount;
