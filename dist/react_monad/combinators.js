"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Immutable = require("immutable");
var i18next = require("i18next");
var core_1 = require("./core");
var html_1 = require("./html");
var primitives_1 = require("./primitives");
var Repeat = /** @class */ (function (_super) {
    __extends(Repeat, _super);
    function Repeat(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.stopped = false;
        _this.state = { current_value: props.value, frame_index: 1 };
        return _this;
    }
    Repeat.prototype.componentWillUnmount = function () {
        this.stopped = true;
    };
    Repeat.prototype.componentWillMount = function () {
        this.stopped = false;
    };
    Repeat.prototype.render = function () {
        var _this = this;
        this.props.debug_info && console.log("Render:", this.props.debug_info(), this.state.current_value);
        return this.props.p(this.state.current_value).comp(this.props.context)(function (callback) { return function (new_value) {
            if (_this.stopped)
                return;
            return _this.setState(__assign({}, _this.state, { frame_index: _this.state.frame_index + 1, current_value: new_value }), function () {
                return _this.props.cont(callback)(new_value);
            });
        }; });
    };
    return Repeat;
}(React.Component));
exports.repeat = function (key, dbg) {
    return function (p) { return function (initial_value) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Repeat, ({ kind: "repeat", debug_info: dbg, p: p, value: initial_value, context: ctxt, cont: cont, key: key }));
    }; }); }; };
};
var Any = /** @class */ (function (_super) {
    __extends(Any, _super);
    function Any(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { ps: "creating" };
        return _this;
    }
    Any.prototype.componentWillReceiveProps = function (new_props) {
        this.setState(__assign({}, this.state, { ps: new_props.ps.map(function (p) {
                return p(new_props.value).comp(new_props.context)(function (callback) { return function (new_value) {
                    return new_props.cont(callback)(new_value);
                }; });
            }) }));
    };
    Any.prototype.componentWillMount = function () {
        var _this = this;
        this.setState(__assign({}, this.state, { ps: this.props.ps.map(function (p) {
                return p(_this.props.value).comp(_this.props.context)(function (callback) { return function (new_value) {
                    return _this.props.cont(callback)(new_value);
                }; });
            }) }));
    };
    Any.prototype.render = function () {
        return React.createElement("div", { className: this.props.className },
            " ",
            this.state.ps != "creating" ? this.state.ps : null,
            " ");
    };
    return Any;
}(React.Component));
exports.any = function (key, className, dbg) {
    return function (ps) { return function (initial_value) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Any, { kind: "any", debug_info: dbg, ps: ps, value: initial_value, context: ctxt, cont: cont, key: key, className: className });
    }; }); }; };
};
var Never = /** @class */ (function (_super) {
    __extends(Never, _super);
    function Never(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { p: "loading" };
        return _this;
    }
    Never.prototype.componentWillReceiveProps = function (new_props) {
        this.setState(__assign({}, this.state, { p: new_props.p.comp(new_props.context)(function (callback) { return function (new_value) { }; }) }));
    };
    Never.prototype.componentWillMount = function () {
        this.setState(__assign({}, this.state, { p: this.props.p.comp(this.props.context)(function (callback) { return function (new_value) { }; }) }));
    };
    Never.prototype.render = function () {
        return this.state.p != "loading" ? this.state.p : [];
    };
    return Never;
}(React.Component));
exports.never = function (p, key) {
    return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Never, { kind: "never", p: p, context: ctxt, cont: cont, key: key, debug_info: undefined });
    }; });
};
var All = /** @class */ (function (_super) {
    __extends(All, _super);
    function All(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { results: Immutable.Map(), ps: "creating" };
        return _this;
    }
    All.prototype.componentWillReceiveProps = function (new_props) {
        var _this = this;
        this.setState(__assign({}, this.state, { ps: new_props.ps.map(function (p, p_i) {
                return p.comp(new_props.context)(function (callback) { return function (result) {
                    return _this.setState(__assign({}, _this.state, { results: _this.state.results.set(p_i, result) }), function () {
                        if (_this.state.results.keySeq().toSet().equals(Immutable.Range(0, new_props.ps.length).toSet())) {
                            var results_1 = _this.state.results.sortBy(function (r, r_i) { return r_i; }).toArray();
                            _this.setState(__assign({}, _this.state, { results: Immutable.Map() }), function () {
                                return new_props.cont(callback)(results_1);
                            });
                        }
                    });
                }; });
            }) }));
    };
    All.prototype.componentWillMount = function () {
        var _this = this;
        this.setState(__assign({}, this.state, { ps: this.props.ps.map(function (p, p_i) {
                return p.comp(_this.props.context)(function (callback) { return function (result) {
                    return _this.setState(__assign({}, _this.state, { results: _this.state.results.set(p_i, result) }), function () {
                        if (_this.state.results.keySeq().toSet().equals(Immutable.Range(0, _this.props.ps.length).toSet())) {
                            var results_2 = _this.state.results.sortBy(function (r, r_i) { return r_i; }).toArray();
                            _this.setState(__assign({}, _this.state, { results: Immutable.Map() }), function () {
                                return _this.props.cont(callback)(results_2);
                            });
                        }
                    });
                }; });
            }) }));
    };
    All.prototype.render = function () {
        return React.createElement("div", null,
            " ",
            this.state.ps != "creating" ? this.state.ps : null,
            " ");
    };
    return All;
}(React.Component));
exports.all = function (ps, key, dbg) {
    return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(All, { kind: "all", debug_info: dbg, ps: ps, context: ctxt, cont: cont, key: key });
    }; });
};
var Retract = /** @class */ (function (_super) {
    __extends(Retract, _super);
    function Retract(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { p: "creating" };
        return _this;
    }
    Retract.prototype.componentWillReceiveProps = function (new_props) {
        this.setState(__assign({}, this.state, { p: new_props.p(new_props.inb(new_props.value)).comp(new_props.context)(function (callback) { return function (new_value) {
                return new_props.cont(callback)(new_props.out(new_props.value)(new_value));
            }; }) }));
    };
    Retract.prototype.componentWillMount = function () {
        var _this = this;
        this.setState(__assign({}, this.state, { p: this.props.p(this.props.inb(this.props.value)).comp(this.props.context)(function (callback) { return function (new_value) {
                return _this.props.cont(callback)(_this.props.out(_this.props.value)(new_value));
            }; }) }));
    };
    Retract.prototype.render = function () {
        return this.state.p != "creating" ? this.state.p : [];
    };
    return Retract;
}(React.Component));
exports.retract = function (key, dbg) {
    return function (inb, out, p) { return function (initial_value) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Retract, { kind: "retract", debug_info: dbg, inb: inb, out: out, p: p, value: initial_value, context: ctxt, cont: cont, key: key });
    }; }); }; };
};
var LiftPromise = /** @class */ (function (_super) {
    __extends(LiftPromise, _super);
    function LiftPromise(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.wait_time = 500;
        _this.stopped = false;
        _this.state = { result: "busy", input: props.value, retry_count: 0 };
        return _this;
    }
    LiftPromise.prototype.componentWillReceiveProps = function (new_props) {
        var _this = this;
        // if (this.state.result != "busy" && this.state.result != "error") {
        //   this.props.debug_info && console.log("New props (ignored):", this.props.debug_info(), this.state.input, new_props.value)
        //   return
        // }
        this.props.debug_info && console.log("New props:", this.props.debug_info(), this.state.input, new_props.value);
        this.setState(__assign({}, this.state, { input: new_props.value }), function () {
            return _this.load(new_props);
        });
    };
    LiftPromise.prototype.load = function (props) {
        var _this = this;
        if (this.stopped)
            return;
        this.setState(__assign({}, this.state, { result: "busy" }), function () {
            return props.p(_this.state.input).then(function (x) {
                _this.wait_time = 500;
                if (_this.props.debug_info)
                    console.log("Promise done:", _this.props.debug_info());
                if (_this.stopped)
                    return;
                _this.setState(__assign({}, _this.state, { result: x }), function () { return props.cont(function () { return null; })(x); });
            })
                .catch(function () {
                if (props.retry_strategy == "never") {
                    if (_this.stopped)
                        return;
                    _this.setState(__assign({}, _this.state, { result: "error" }));
                }
                else if (props.retry_strategy == "semi exponential") {
                    _this.wait_time = Math.floor(Math.max(_this.wait_time * 1.5, 2500));
                    setTimeout(function () { return _this.load(props); }, _this.wait_time);
                }
                else if (props.retry_strategy.kind == "retry then show failure") {
                    if (_this.stopped)
                        return;
                    if (_this.state.retry_count < props.retry_strategy.times) {
                        _this.setState(__assign({}, _this.state, { retry_count: _this.state.retry_count + 1 }));
                        setTimeout(function () { return _this.load(props); }, _this.wait_time);
                    }
                    else {
                        var failedJSX = props.retry_strategy.on_failure.comp(props.context)(props.cont);
                        _this.setState(__assign({}, _this.state, { retry_count: 0, result: { kind: "failing", failure_renderer: failedJSX } }));
                    }
                }
                else if (props.retry_strategy.kind == "never") {
                    if (_this.stopped)
                        return;
                    var failedJSX = props.retry_strategy.on_failure.comp(props.context)(props.cont);
                    _this.setState(__assign({}, _this.state, { result: { kind: "failing", failure_renderer: failedJSX } }));
                }
            });
        });
    };
    LiftPromise.prototype.componentWillUnmount = function () {
        this.stopped = true;
    };
    LiftPromise.prototype.componentWillMount = function () {
        this.stopped = false;
        this.props.debug_info && console.log("Mount:", this.props.debug_info());
        this.load(this.props);
    };
    LiftPromise.prototype.render = function () {
        this.props.debug_info && console.log("Render:", this.props.debug_info());
        return this.state.result == "busy" ? React.createElement("div", { className: "busy" }, i18next.t("busy"))
            : this.state.result == "error" ? React.createElement("div", { className: "error" }, i18next.t("error"))
                : this.state.result != undefined && this.state.result.hasOwnProperty('kind') && this.state.result.kind === "failing" ? this.state.result.failure_renderer
                    : [];
    };
    return LiftPromise;
}(React.Component));
exports.lift_promise = function (p, retry_strategy, key, dbg) {
    return function (x) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(LiftPromise, { kind: "lift promise", debug_info: dbg, value: x, retry_strategy: retry_strategy, p: p, context: ctxt, cont: cont, key: key });
    }; }); };
};
var Delay = /** @class */ (function (_super) {
    __extends(Delay, _super);
    function Delay(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.running = false;
        _this.state = { status: "dirty", value: props.value, last_command: props.p(props.value).comp(props.context)(props.cont) };
        return _this;
    }
    Delay.prototype.componentWillMount = function () {
        var _this = this;
        // console.log("starting delay thread")
        if (this.running)
            return;
        this.running = true;
        var self = this;
        var process = function () { return setTimeout(function () {
            // console.log("delay is ticking", self.state.status, self.state.value)
            if (self.state.status == "dirty") {
                // console.log("delay is submitting the data to save")
                if (!_this.running)
                    return;
                self.setState(__assign({}, self.state, { status: "waiting", last_command: self.props.p(self.state.value).comp(_this.props.context)(function (callback) { return function (new_value) {
                        // console.log("calling the continuation of dirty", self.state.value)
                        self.props.cont(callback)(new_value);
                    }; }) }));
                process();
            }
            else {
                if (self.running)
                    process();
            }
        }, self.props.dt); };
        process();
    };
    Delay.prototype.componentWillUnmount = function () {
        // console.log("stopping delay thread")
        this.running = false;
    };
    Delay.prototype.componentWillReceiveProps = function (new_props) {
        // console.log("Delay received new props and is going back to dirty")
        this.setState(__assign({}, this.state, { value: new_props.value, status: "dirty" }));
    };
    Delay.prototype.render = function () {
        return this.state.last_command;
    };
    return Delay;
}(React.Component));
exports.delay = function (dt, key, dbg) {
    return function (p) { return function (initial_value) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Delay, { kind: "delay", debug_info: dbg, dt: dt, p: p, value: initial_value, context: ctxt, cont: cont, key: key });
    }; }); }; };
};
exports.mk_submenu_entry = function (label, children) { return { kind: "sub menu", label: label, children: children }; };
exports.mk_menu_entry = function (v) { return { kind: "item", value: v }; };
exports.simple_menu = function (type, to_string, key, dbg) {
    var content_menu_class, content_class, menu_class, entries_class, entry_class, sub_entry_class;
    if (type == "side menu") {
        content_menu_class = "monadic-content-with-menu";
        content_class = "monadic-content";
        menu_class = "monadic-content-menu";
        entries_class = "monadic-content-menu__entries";
        entry_class = "monadic-content-menu__entry";
        sub_entry_class = "monadic-content-menu__sub-entry";
    }
    else {
        content_menu_class = "monadic-content-with-tabs";
        content_class = "monadic-content";
        menu_class = "monadic-tabs";
        entries_class = "monadic-tabs__entries";
        entry_class = "monadic-tabs__entry";
        sub_entry_class = "monadic-tabs__sub-entry";
    }
    return function (items_array, p, selected_item, selected_sub_menu) {
        var items = Immutable.List(items_array);
        var entries = function (s) {
            return (type != "side menu" && s.shown_range.first > 0 ?
                [function (s) { return html_1.div(entry_class + " monadic-prev-tab")(html_1.a("<"))(__assign({}, s, { shown_range: __assign({}, s.shown_range, { first: s.shown_range.first - 1 }) })); }]
                :
                    []).concat(items.map(function (item, i) {
                return function (s) {
                    return item.kind == "item" ?
                        html_1.div(entry_class + " " + (s.selected.kind == "item" && item.value == s.selected.value ? " " + entry_class + "--active" : ""), to_string(item.value))(html_1.a(to_string(item.value), undefined, undefined, false, undefined))(__assign({}, s, { sub_selected: { kind: "nothing" }, selected: item, last_action: { kind: "selection" } }))
                        :
                            exports.any(item.label)([
                                function (s) { return html_1.div(entry_class + " ", item.label)(html_1.a(item.label, undefined, undefined, false, undefined))(__assign({}, s, { sub_selected: item, last_action: { kind: "selection" } })); }
                            ].concat((s.sub_selected.kind == "sub menu" && item.label == s.sub_selected.label) ||
                                (s.selected.kind == "item" && item.children.some(function (c) { return s.selected.kind == "item" && c.value == s.selected.value; })) ?
                                item.children.map(function (c) {
                                    return function (s) { return html_1.div(sub_entry_class + " " + (s.selected.kind == "item" && c.value == s.selected.value ? " " + sub_entry_class + "--active" : ""), to_string(c.value))(html_1.a(to_string(c.value), undefined, undefined, false, undefined))(__assign({}, s, { sub_selected: item, selected: c, last_action: { kind: "selection" } })); };
                                })
                                :
                                    []))(s);
                };
            }).filter(function (i, i_i) { return type == "side menu" || i_i >= s.shown_range.first && (i_i - s.shown_range.first) < s.shown_range.amount; })
                .concat(type != "side menu" && s.shown_range.first + s.shown_range.amount < items.count() ?
                [function (s) { return html_1.div(entry_class + " monadic-next-tab")(html_1.a(">"))(__assign({}, s, { shown_range: __assign({}, s.shown_range, { first: s.shown_range.first + 1 }) })); }]
                :
                    [])
                .toArray());
        };
        return exports.repeat()(html_1.div()(exports.any(undefined, content_menu_class)([
            html_1.div(menu_class, menu_class)(function (s) { return exports.any(undefined, entries_class)(entries(s))(s); }),
            html_1.div(content_class, content_class)(function (s) { return s.selected.kind == "item" ?
                p(s.selected.value).then(undefined, function (p_res) { return core_1.unit(__assign({}, s, { last_action: { kind: "p", p_res: p_res } })); })
                :
                    core_1.unit(s).never(); })
        ])))({ selected: selected_item == undefined ? { kind: "nothing" } : { kind: "item", value: selected_item },
            sub_selected: selected_sub_menu == undefined ? { kind: "nothing" } : { kind: "sub menu", label: selected_sub_menu },
            last_action: { kind: "init" },
            shown_range: type == "side menu" ? undefined : { first: 0, amount: type.max_tabs } })
            .filter(function (s) { return s.last_action.kind != "p"; })
            .map(function (s) { return s.last_action.kind == "p" && s.last_action.p_res; });
    };
};
exports.custom = function (key, dbg) {
    return function (render) { return core_1.make_C(function (ctxt) { return function (cont) { return render(ctxt)(cont); }; }); };
};
exports.hide = function (f_name, f) {
    return exports.repeat()(function (visible) {
        return primitives_1.bool("edit", "plus/minus")(visible);
    })(false).then(f_name + " toggle", function (visible) {
        return !visible ?
            core_1.unit(null)
            :
                f.then("visible " + f_name, function (_) { return core_1.unit(null); });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYmluYXRvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVhY3RfbW9uYWQvY29tYmluYXRvcnMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkJBQThCO0FBRTlCLHFDQUFzQztBQUN0QyxpQ0FBa0M7QUFFbEMsK0JBQTRFO0FBQzVFLCtCQUE2QjtBQUM3QiwyQ0FBaUM7QUFhakM7SUFBd0IsMEJBQThDO0lBQ3BFLGdCQUFZLEtBQW9CLEVBQUMsT0FBVztRQUE1QyxZQUNFLGtCQUFNLEtBQUssRUFBRSxPQUFPLENBQUMsU0FFdEI7UUFDRCxhQUFPLEdBQVcsS0FBSyxDQUFBO1FBRnJCLEtBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxhQUFhLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUMsQ0FBQyxFQUFFLENBQUE7O0lBQzVELENBQUM7SUFHRCxxQ0FBb0IsR0FBcEI7UUFDRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtJQUNyQixDQUFDO0lBRUQsbUNBQWtCLEdBQWxCO1FBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7SUFDdEIsQ0FBQztJQUVELHVCQUFNLEdBQU47UUFBQSxpQkFPQztRQU5DLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtRQUNsRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxVQUFBLFNBQVM7WUFDMUYsSUFBSSxLQUFJLENBQUMs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