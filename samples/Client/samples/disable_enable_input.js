"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monadic_react_1 = require("../../../src/monadic_react");
exports.disablable_sample = monadic_react_1.repeat()(monadic_react_1.any()([
    s => monadic_react_1.string('edit', 'text', 'inputstring', undefined, { disabled: s.disabled })(s.value).then('pass_string', us => monadic_react_1.unit(Object.assign({}, s, { value: us }))),
    s => monadic_react_1.button(s.disabled ? "Enable" : "Disable", false, 'enabling_button')(Object.assign({}, s, { disabled: !s.disabled }))
]))({ disabled: false, value: "" }).never();
//# sourceMappingURL=disable_enable_input.js.map