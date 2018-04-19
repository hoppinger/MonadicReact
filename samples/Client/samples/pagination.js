"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monadic_react_1 = require("../../../src/monadic_react");
exports.pagination_sample = monadic_react_1.div(undefined, `pagination sample`)(_ => monadic_react_1.paginate(10, (cp, ipp) => monadic_react_1.unit(({ num_pages: 10, page_index: cp, items: cp })), `pagination sample`)(n => monadic_react_1.string("view")(`The current page is ${n + 1}`).ignore()))(null);
//# sourceMappingURL=pagination.js.map