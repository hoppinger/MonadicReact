"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monadic_react_1 = require("../../../src/monadic_react");
exports.rich_text_sample = monadic_react_1.repeat()(monadic_react_1.rich_text("edit"))('').map(s => s.substr(0, 1000)).then(`rich text sample`, monadic_react_1.delay(2000, `rich text delayer`)(monadic_react_1.label(`Raw content:`, true)(monadic_react_1.string("view", "text", "view")))).ignore();
//# sourceMappingURL=rich text.js.map