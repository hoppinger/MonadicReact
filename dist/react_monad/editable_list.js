"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("../react_monad/core");
var primitives_1 = require("../react_monad/primitives");
var html_1 = require("../react_monad/html");
var combinators_1 = require("../react_monad/combinators");
var list_1 = require("../react_monad/list");
var perform = function (s, op) {
    return op.kind == "add" ? __assign({}, s, { items: s.items.push(op.value) }) : op.kind == "remove" ? __assign({}, s, { items: s.items.remove(op.index), selected_index: s.selected_index == op.index ? undefined : op.index > s.selected_index ? s.selected_index : s.selected_index - 1 }) : __assign({}, s, { selected_index: op.selected ? op.index : s.selected_index == op.index ? undefined : s.selected_index });
};
exports.editable_list = function (list_name, initial_items, create_new_form) {
    return initial_items.bind(list_name, function (items) {
        return combinators_1.repeat(html_1.form("monadic-list-form")(combinators_1.any([
            function (s) { return list_1.list(s.items, undefined, "monadic-list-items")(function (i) { return function (n) {
                return combinators_1.any([
                    html_1.div("monadic-list-cell")([])(function (_) {
                        return html_1.label("")(primitives_1.bool("edit", "radio"))(s.selected_index == i).bind(undefined, function (selected) {
                            return core_1.unit({ kind: "toggle", value: n, index: i, selected: selected }).filter(function (_) {
                                return selected != (s.selected_index == i);
                            });
                        });
                    }),
                    html_1.div("monadic-list-cell")([])(function (op) {
                        return primitives_1.string("view")("This is item " + n + ", with index " + i).filter(function (_) { return false; }).ignore_with(op);
                    }),
                    html_1.div("monadic-list-cell monadic-list-lastcell")([])(function (_) {
                        return html_1.button("X")({ kind: "remove", value: n, index: i });
                    })
                ], "item_" + n, "monadic-list-item")(undefined);
            }; }).bind("inner list", function (op) { return core_1.unit(perform(s, op)); }); },
            function (s) { return create_new_form(s).bind("monadic-new-list-item", function (new_value) { return core_1.unit(perform(s, { kind: "add", value: new_value })); }); }
        ])))({ items: items, selected_index: undefined });
    }, "monadic-list " + list_name);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGVfbGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdF9tb25hZC9lZGl0YWJsZV9saXN0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBS0EsNENBQWlEO0FBQ2pELHdEQUE4RDtBQUM5RCw0Q0FBcUc7QUFDckcsMERBQW9IO0FBR3BILDRDQUF3QztBQUl4QyxJQUFJLE9BQU8sR0FBRyxVQUFZLENBQXNCLEVBQUUsRUFBbUI7SUFDbkUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksS0FBSyxnQkFDWCxDQUFDLElBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFDbkMsRUFBRSxDQUFDLElBQUksSUFBSSxRQUFRLGdCQUNmLENBQUMsSUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLGNBQWMsRUFBQyxDQUFDLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEdBQUcsU0FBUyxHQUFHLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxtQkFDbEssQ0FBQyxJQUFFLGNBQWMsRUFBQyxFQUFFLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLGNBQWMsSUFBSSxFQUFFLENBQUMsS0FBSyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUMsY0FBYyxHQUFHLENBQUE7QUFDdkgsQ0FBQyxDQUFBO0FBRVUsUUFBQSxhQUFhLEdBQUcsVUFBWSxTQUFnQixFQUFFLGFBQXdCLEVBQUUsZUFBZ0Q7SUFDakksTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQUEsS0FBSztRQUMxQyxPQUFB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