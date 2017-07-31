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
var Repeat = (function (_super) {
    __extends(Repeat, _super);
    function Repeat(props, context) {
        var _this = _super.call(this) || this;
        _this.state = { current_value: props.value, frame_index: 1 };
        return _this;
    }
    Repeat.prototype.render = function () {
        var _this = this;
        this.props.debug_info && console.log("Render:", this.props.debug_info(), this.state.current_value);
        return this.props.p(this.state.current_value).comp(this.props.context)(function (callback) { return function (new_value) {
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
var Any = (function (_super) {
    __extends(Any, _super);
    function Any(props, context) {
        var _this = _super.call(this) || this;
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
var Never = (function (_super) {
    __extends(Never, _super);
    function Never(props, context) {
        var _this = _super.call(this) || this;
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
        return this.state.p != "loading" ? this.state.p : null;
    };
    return Never;
}(React.Component));
exports.never = function (p, key) {
    return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Never, { kind: "never", p: p, context: ctxt, cont: cont, key: key, debug_info: undefined });
    }; });
};
var All = (function (_super) {
    __extends(All, _super);
    function All(props, context) {
        var _this = _super.call(this) || this;
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
var Retract = (function (_super) {
    __extends(Retract, _super);
    function Retract(props, context) {
        var _this = _super.call(this) || this;
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
        return this.state.p != "creating" ? this.state.p : null;
    };
    return Retract;
}(React.Component));
exports.retract = function (key, dbg) {
    return function (inb, out, p) { return function (initial_value) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Retract, { kind: "retract", debug_info: dbg, inb: inb, out: out, p: p, value: initial_value, context: ctxt, cont: cont, key: key });
    }; }); }; };
};
var LiftPromise = (function (_super) {
    __extends(LiftPromise, _super);
    function LiftPromise(props, context) {
        var _this = _super.call(this) || this;
        _this.wait_time = 500;
        _this.state = { result: "busy", input: props.value };
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
        this.setState(__assign({}, this.state, { result: "busy" }), function () {
            return props.p(_this.state.input).then(function (x) {
                _this.wait_time = 500;
                if (_this.props.debug_info)
                    console.log("Promise done:", _this.props.debug_info());
                _this.setState(__assign({}, _this.state, { result: x }), function () { return props.cont(function () { return null; })(x); });
            })
                .catch(function () {
                if (props.retry_strategy == "never")
                    _this.setState(__assign({}, _this.state, { result: "error" }));
                else {
                    _this.wait_time = Math.floor(Math.max(_this.wait_time * 1.5, 2500));
                    setTimeout(function () { return _this.load(props); }, _this.wait_time);
                }
            });
        });
    };
    LiftPromise.prototype.componentWillMount = function () {
        this.props.debug_info && console.log("Mount:", this.props.debug_info());
        this.load(this.props);
    };
    LiftPromise.prototype.render = function () {
        this.props.debug_info && console.log("Render:", this.props.debug_info());
        return this.state.result == "busy" ? React.createElement("div", { className: "busy" }, i18next.t("busy"))
            : this.state.result == "error" ? React.createElement("div", { className: "error" }, i18next.t("error"))
                : null; // <div className="done">{i18next.t("done")}</div>
    };
    return LiftPromise;
}(React.Component));
exports.lift_promise = function (p, retry_strategy, key, dbg) {
    return function (x) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(LiftPromise, { kind: "lift promise", debug_info: dbg, value: x, retry_strategy: retry_strategy, p: p, context: ctxt, cont: cont, key: key });
    }; }); };
};
var Delay = (function (_super) {
    __extends(Delay, _super);
    function Delay(props, context) {
        var _this = _super.call(this) || this;
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
                        html_1.div(entry_class + " " + (s.selected.kind == "item" && item.value == s.selected.value ? " " + entry_class + "--active" : ""))(html_1.a(to_string(item.value), undefined, undefined, false, undefined))(__assign({}, s, { sub_selected: { kind: "nothing" }, selected: item, last_action: { kind: "selection" } }))
                        :
                            exports.any()([
                                function (s) { return html_1.div(entry_class + " ")(html_1.a(item.label, undefined, undefined, false, undefined))(__assign({}, s, { sub_selected: item, last_action: { kind: "selection" } })); }
                            ].concat((s.sub_selected.kind == "sub menu" && item.label == s.sub_selected.label) ||
                                (s.selected.kind == "item" && item.children.some(function (c) { return s.selected.kind == "item" && c.value == s.selected.value; })) ?
                                item.children.map(function (c) {
                                    return function (s) { return html_1.div(sub_entry_class + " " + (s.selected.kind == "item" && c.value == s.selected.value ? " " + sub_entry_class + "--active" : ""))(html_1.a(to_string(c.value), undefined, undefined, false, undefined))(__assign({}, s, { sub_selected: item, selected: c, last_action: { kind: "selection" } })); };
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
            html_1.div(menu_class)(function (s) { return exports.any(undefined, entries_class)(entries(s))(s); }),
            html_1.div(content_class)(function (s) { return s.selected.kind == "item" ?
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYmluYXRvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVhY3RfbW9uYWQvY29tYmluYXRvcnMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkJBQThCO0FBRTlCLHFDQUFzQztBQUN0QyxpQ0FBa0M7QUFFbEMsK0JBQTRFO0FBQzVFLCtCQUE2QjtBQUM3QiwyQ0FBaUM7QUFhakM7SUFBd0IsMEJBQThDO0lBQ3BFLGdCQUFZLEtBQW9CLEVBQUMsT0FBVztRQUE1QyxZQUNFLGlCQUFPLFNBRVI7UUFEQyxLQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFDLENBQUMsRUFBRSxDQUFBOztJQUM1RCxDQUFDO0lBQ0QsdUJBQU0sR0FBTjtRQUFBLGlCQUtDO1FBSkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBQ2xHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsVUFBQSxTQUFTO1lBQzFGLE9BQUEsS0FBSSxDQUFDLFFBQVEsY0FBSyxLQUFJLENBQUMsS0FBSyxJQUFFLFdBQVcsRUFBQyxLQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBQyxDQUFDLEVBQUUsYUFBYSxFQUFDLFNBQVMsS0FBRztnQkFDNUYsT0FBQSxLQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFB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