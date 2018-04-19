"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const monadic_react_1 = require("../../../src/monadic_react");
exports.editable_list_sample = monadic_react_1.editable_list(`editable-number-list`, monadic_react_1.unit(immutable_1.Range(1, 5).toList()), s => monadic_react_1.button(`+`)(s.items.max() + 1)).then(`editable number list container`, s => monadic_react_1.string("view")(`The selected item is ${s.items.get(s.selected_index)}`).ignore());
//# sourceMappingURL=editable_list.js.map