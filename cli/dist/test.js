"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const chalk_1 = __importDefault(require("chalk"));
const ava_1 = __importDefault(require("ava"));
const ink_testing_library_1 = require("ink-testing-library");
const ui_1 = __importDefault(require("./ui"));
(0, ava_1.default)('greet with query', t => {
    const { lastFrame } = (0, ink_testing_library_1.render)(react_1.default.createElement(ui_1.default, { query: "docker" }));
    t.is(lastFrame(), (0, chalk_1.default) `Showing Results For Query, {green docker}`);
});
