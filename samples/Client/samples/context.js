"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monadic_react_1 = require("../../../src/monadic_react");
exports.context_sample = monadic_react_1.any()([
    _ => monadic_react_1.button(`Force reload`)(null).then(undefined, _ => monadic_react_1.get_context().then(undefined, ctxt => ctxt.force_reload())),
])(null).then(`context sample`, _ => monadic_react_1.get_context().then(undefined, ctxt => monadic_react_1.string("view")(`Context: ${JSON.stringify(ctxt)}`).ignore()));
//# sourceMappingURL=context.js.map