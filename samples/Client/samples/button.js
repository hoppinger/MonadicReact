"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monadic_react_1 = require("../../../src/monadic_react");
exports.button_sample = monadic_react_1.repeat(`input number`)(n => monadic_react_1.label("Insert an even number: ", true)(n => monadic_react_1.number("edit", "number")(n))(n))(0).then(`input number bind`, n => monadic_react_1.button(`Send ${n.toString()} further`, n % 2 != 0)(n).filter(n => n % 2 == 0).map(n => `Your selection is ${n.toString()}`).then(`button to string`, s => monadic_react_1.string("view")(s).ignore()));
//# sourceMappingURL=button.js.map