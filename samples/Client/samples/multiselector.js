"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monadic_react_1 = require("../../../src/monadic_react");
exports.multiselector_sample = monadic_react_1.multi_selector("checkbox", x => x.toString())([1, 3, 5], [1, 5]).then(`multi_selector`, n => monadic_react_1.string("view")(JSON.stringify(n)).ignore());
//# sourceMappingURL=multiselector.js.map