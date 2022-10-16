"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copy = void 0;
const copy = (command) => {
    var proc = require('child_process').spawn('pbcopy');
    proc.stdin.write(command);
    proc.stdin.end();
};
exports.copy = copy;
