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
const react_1 = __importStar(require("react"));
const ink_1 = require("ink");
const pbcopy_1 = require("./utils/pbcopy");
const exampleCommands = [
    {
        name: 'docker image rm <image_id>',
        description: 'remove a docker image'
    },
    {
        name: 'docker ps',
        description: 'show all running docker containers'
    }
];
const Result = ({ name, description, onEnter }) => {
    const { isFocused } = (0, ink_1.useFocus)();
    (0, ink_1.useInput)((_, key) => {
        if (key.return) {
            if (isFocused)
                onEnter(name);
        }
    });
    return (react_1.default.createElement(ink_1.Box, { marginLeft: 3 },
        react_1.default.createElement(ink_1.Text, { color: isFocused ? "blue" : "white" }, '❯'),
        react_1.default.createElement(ink_1.Box, { marginLeft: 1 },
            react_1.default.createElement(ink_1.Text, { bold: isFocused, color: isFocused ? "blue" : "white" }, name)),
        react_1.default.createElement(ink_1.Box, { marginLeft: 2 },
            react_1.default.createElement(ink_1.Text, null, description))));
};
const App = ({ query = undefined }) => {
    const { enableFocus, focusNext } = (0, ink_1.useFocusManager)();
    const { exit } = (0, ink_1.useApp)();
    (0, react_1.useEffect)(() => {
        enableFocus();
        focusNext();
    }, []);
    (0, ink_1.useInput)((input, _) => {
        if (input === 'q') {
            exit();
        }
    });
    const copyCommand = (command) => {
        exit();
        (0, pbcopy_1.copy)(command);
    };
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Text, { color: "white", bold: true },
            "results for (",
            react_1.default.createElement(ink_1.Text, { color: "green" },
                query,
                "\"docker\""),
            ")"),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column" }, exampleCommands.map((command) => (react_1.default.createElement(Result, { key: command.name, name: command.name, description: command.description, onEnter: copyCommand }))))));
};
module.exports = App;
exports.default = App;
