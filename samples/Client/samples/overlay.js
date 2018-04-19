"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monadic_react_1 = require("../../../src/monadic_react");
exports.overlay_sample = monadic_react_1.repeat(`overlay sample`)(visible => monadic_react_1.any()([
    monadic_react_1.any()([
        _ => monadic_react_1.string("view")("The overlay is hidden").never(),
        _ => monadic_react_1.button("Show overlay")(true)
    ]),
    !visible ?
        _ => monadic_react_1.unit(null).never()
        :
            monadic_react_1.overlay()(monadic_react_1.any()([
                _ => monadic_react_1.string("view")("This is the overlay").never(),
                _ => monadic_react_1.button("X")(false)
            ]))
])(null))(false).ignore();
//# sourceMappingURL=overlay.js.map