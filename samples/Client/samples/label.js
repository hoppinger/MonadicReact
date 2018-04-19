"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monadic_react_1 = require("../../../src/monadic_react");
exports.label_sample = monadic_react_1.repeat(`input number`)(n => monadic_react_1.label("Insert a number: ", true)(n => monadic_react_1.number("edit", "number")(n))(n))(0).then(`input number bind`, c => monadic_react_1.string("view", "text", "view")(`Your selection is ${c.toString()}`).ignore());
//# sourceMappingURL=label.js.map