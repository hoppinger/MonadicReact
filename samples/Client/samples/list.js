"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const monadic_react_1 = require("../../../src/monadic_react");
exports.list_sample = monadic_react_1.list(immutable_1.Range(1, 10).toList(), `list sample`)(i => n => monadic_react_1.string("view", "text", `item-${i}-${n}`)(`This is item ${i}/${n}`).ignore(`ignore-${i}-${n}`));
//# sourceMappingURL=list.js.map