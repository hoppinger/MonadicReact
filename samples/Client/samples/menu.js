"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monadic_react_1 = require("../../../src/monadic_react");
exports.menu_sample = monadic_react_1.simple_menu("side menu", p => p.title, `fictional pages menu`)([
    { title: "About", content: "This page talks about us" },
    { title: "Content", content: "This page is full of interesting content" }
].map(s => ({ kind: "item", value: s })), p => monadic_react_1.string("view")(p.content)).ignore();
//# sourceMappingURL=menu.js.map