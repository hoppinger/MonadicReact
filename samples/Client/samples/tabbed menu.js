"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const monadic_react_1 = require("../../../src/monadic_react");
exports.tabbed_menu_sample = monadic_react_1.simple_menu({ kind: "tabs", max_tabs: 5 }, p => p.title, `tabbed menu`)(immutable_1.Range(1, 10).map(i => ({ title: `Tab ${i}`, content: `This is the content of the tab ${i}.` })).map(s => ({ kind: "item", value: s })).toArray(), p => monadic_react_1.string("view")(p.content)).ignore();
//# sourceMappingURL=tabbed menu.js.map