"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monadic_react_1 = require("../../../src/monadic_react");
exports.toggles_sample = monadic_react_1.repeat()(b => monadic_react_1.any(`toggles`)([
    monadic_react_1.label("my toggle.")(b => monadic_react_1.bool("edit", "checkbox", `basic toggle`)(b)),
    monadic_react_1.label("my fancy toggle.")(b => monadic_react_1.bool("edit", "fancy toggle", `fancy toggle`)(b)),
    monadic_react_1.label("The last toggle: ")(b => monadic_react_1.bool("edit", "plus/minus", `a plus/minus toggle.`)(b)),
])(b))(true).then(`fancy_toggle_bind`, c => monadic_react_1.string("view")(`Your selection is ${c.toString()}`).ignore());
//# sourceMappingURL=toggles.js.map