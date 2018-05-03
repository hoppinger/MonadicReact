"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monadic_react_1 = require("../../../src/monadic_react");
exports.delay_wait = monadic_react_1.delay(2000)(monadic_react_1.repeat()(monadic_react_1.string('edit', 'text')))("").then('forget', _ => monadic_react_1.unit(null));
//# sourceMappingURL=delay_wait.js.map