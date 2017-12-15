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
    return initial_items.then(list_name, function (items) {
        return combinators_1.repeat("monadic-list " + list_name)(html_1.form("monadic-list-form")(combinators_1.any()([
            function (s) { return list_1.list(s.items, undefined, "monadic-list-items")(function (i) { return function (n) {
                return combinators_1.any("item_" + n, "monadic-list-item")([
                    html_1.div("monadic-list-cell")(function (_) {
                        return html_1.label("")(primitives_1.bool("edit", "radio", "radio-bool"))(s.selected_index == i).then(undefined, function (selected) {
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
            }; }).then("inner list", function (op) { return core_1.unit(perform(s, op)); }); },
            function (s) { return create_new_form(s).then("monadic-new-list-item", function (new_value) { return core_1.unit(perform(s, { kind: "add", value: new_value })); }); }
        ])))({ items: items, selected_index: undefined });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGVfbGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdF9tb25hZC9lZGl0YWJsZV9saXN0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBS0EsNENBQWlEO0FBQ2pELHdEQUE4RDtBQUM5RCw0Q0FBcUc7QUFDckcsMERBQW9IO0FBR3BILDRDQUF3QztBQUl4QyxJQUFJLE9BQU8sR0FBRyxVQUFZLENBQXNCLEVBQUUsRUFBbUI7SUFDbkUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLENBQUMsY0FDYixDQUFDLElBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFDckMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLENBQUMsY0FDakIsQ0FBQyxJQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsY0FBYyxFQUFDLENBQUMsQ0FBQyxjQUFjLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxJQUN4SyxDQUFDLGNBQUssQ0FBQyxJQUFFLGNBQWMsRUFBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsR0FBRyxDQUFBO0FBQ3ZILENBQUMsQ0FBQTtB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