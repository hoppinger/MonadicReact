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
        return combinators_1.repeat("monadic-list " + list_name)(html_1.form("monadic-list-form")(combinators_1.any()([
            function (s) { return list_1.list(s.items, undefined, "monadic-list-items")(function (i) { return function (n) {
                return combinators_1.any("item_" + n, "monadic-list-item")([
                    html_1.div("monadic-list-cell")(function (_) {
                        return html_1.label("")(primitives_1.bool("edit", "radio"))(s.selected_index == i).bind(undefined, function (selected) {
                            return core_1.unit({ kind: "toggle", value: n, index: i, selected: selected }).filter(function (_) {
                                return selected != (s.selected_index == i);
                            });
                        });
                    }),
                    html_1.div("monadic-list-cell")(function (op) {
                        return primitives_1.string("view")("This is item " + n + ", with index " + i).filter(function (_) { return false; }).ignore_with(op);
                    }),
                    html_1.div("monadic-list-cell monadic-list-lastcell")(function (_) {
                        return html_1.button("X")({ kind: "remove", value: n, index: i });
                    })
                ])(undefined);
            }; }).bind("inner list", function (op) { return core_1.unit(perform(s, op)); }); },
            function (s) { return create_new_form(s).bind("monadic-new-list-item", function (new_value) { return core_1.unit(perform(s, { kind: "add", value: new_value })); }); }
        ])))({ items: items, selected_index: undefined });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGVfbGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdF9tb25hZC9lZGl0YWJsZV9saXN0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBS0EsNENBQWlEO0FBQ2pELHdEQUE4RDtBQUM5RCw0Q0FBcUc7QUFDckcsMERBQW9IO0FBR3BILDRDQUF3QztBQUl4QyxJQUFJLE9BQU8sR0FBRyxVQUFZLENBQXNCLEVBQUUsRUFBbUI7SUFDbkUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksS0FBSyxnQkFDWCxDQUFDLElBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFDbkMsRUFBRSxDQUFDLElBQUksSUFBSSxRQUFRLGdCQUNmLENBQUMsSUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLGNBQWMsRUFBQyxDQUFDLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEdBQUcsU0FBUyxHQUFHLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxtQkFDbEssQ0FBQyxJQUFFLGNBQWMsRUFBQyxFQUFFLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLGNBQWMsSUFBSSxFQUFFLENBQUMsS0FBSyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUMsY0FBYyxHQUFHLENBQUE7QUFDdkgsQ0FBQyxDQUFBO0FBRVUsUUFBQSxhQUFhLEdBQUcsVUFBWSxTQUFnQixFQUFFLGFBQXdCLEVBQUUsZUFBZ0Q7SUFDakksTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQUEsS0FBSztRQUMxQyxPQUFB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