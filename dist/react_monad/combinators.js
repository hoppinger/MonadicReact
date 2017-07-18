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
exports.repeat = function (p, key, dbg) {
    return function (initial_value) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Repeat, ({ kind: "repeat", debug_info: dbg, p: p, value: initial_value, context: ctxt, cont: cont, key: key }));
    }; }); };
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
exports.any = function (ps, key, className, dbg) {
    return function (initial_value) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Any, { kind: "any", debug_info: dbg, ps: ps, value: initial_value, context: ctxt, cont: cont, key: key, className: className });
    }; }); };
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
exports.retract = function (inb, out, p, key, dbg) {
    return function (initial_value) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Retract, { kind: "retract", debug_info: dbg, inb: inb, out: out, p: p, value: initial_value, context: ctxt, cont: cont, key: key });
    }; }); };
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
    return function (items, p, selected_item, selected_sub_menu) {
        return exports.repeat(html_1.div()([])(exports.any([
            html_1.div(menu_class)([])(function (s) { return exports.any((type != "side menu" && s.shown_range.first > 0 ?
                [function (s) { return html_1.div(entry_class + " monadic-prev-tab")([])(html_1.a("<"))(__assign({}, s, { shown_range: __assign({}, s.shown_range, { first: s.shown_range.first - 1 }) })); }]
                :
                    []).concat(items.map(function (item, i) {
                return function (s) {
                    return item.kind == "item" ?
                        html_1.div(entry_class + " " + (s.selected.kind == "item" && item.value == s.selected.value ? " " + entry_class + "--active" : ""))([])(html_1.a(to_string(item.value), false, undefined))(__assign({}, s, { sub_selected: { kind: "nothing" }, selected: item, last_action: { kind: "selection" } }))
                        :
                            exports.any([
                                function (s) { return html_1.div(entry_class + " ")([])(html_1.a(item.label, false, undefined))(__assign({}, s, { sub_selected: item, last_action: { kind: "selection" } })); }
                            ].concat((s.sub_selected.kind == "sub menu" && item.label == s.sub_selected.label) ||
                                (s.selected.kind == "item" && item.children.some(function (c) { return s.selected.kind == "item" && c.value == s.selected.value; })) ?
                                item.children.map(function (c) {
                                    return function (s) { return html_1.div(sub_entry_class + " " + (s.selected.kind == "item" && c.value == s.selected.value ? " " + sub_entry_class + "--active" : ""))([])(html_1.a(to_string(c.value), false, undefined))(__assign({}, s, { sub_selected: item, selected: c, last_action: { kind: "selection" } })); };
                                })
                                :
                                    []))(s);
                };
            }).filter(function (i, i_i) { return type == "side menu" || i_i >= s.shown_range.first && (i_i - s.shown_range.first) < s.shown_range.amount; })
                .concat(type != "side menu" && s.shown_range.first + s.shown_range.amount < items.count() ?
                [function (s) { return html_1.div(entry_class + " monadic-next-tab")([])(html_1.a(">"))(__assign({}, s, { shown_range: __assign({}, s.shown_range, { first: s.shown_range.first + 1 }) })); }]
                :
                    [])
                .toArray()), undefined, entries_class)(s); }),
            html_1.div(content_class)([])(function (s) { return s.selected.kind == "item" ?
                p(s.selected.value).bind(undefined, function (p_res) { return core_1.unit(__assign({}, s, { last_action: { kind: "p", p_res: p_res } })); })
                :
                    core_1.unit(s).never(); })
        ], undefined, content_menu_class)))({ selected: selected_item == undefined ? { kind: "nothing" } : { kind: "item", value: selected_item },
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
    return exports.repeat(function (visible) {
        return primitives_1.bool("edit", "plus/minus")(visible);
    })(false).bind(f_name + " toggle", function (visible) {
        return !visible ?
            core_1.unit(null)
            :
                f.bind("visible " + f_name, function (_) { return core_1.unit(null); });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYmluYXRvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVhY3RfbW9uYWQvY29tYmluYXRvcnMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkJBQThCO0FBRTlCLHFDQUFzQztBQUN0QyxpQ0FBa0M7QUFFbEMsK0JBQTRFO0FBQzVFLCtCQUE2QjtBQUM3QiwyQ0FBaUM7QUFhakM7SUFBd0IsMEJBQThDO0lBQ3BFLGdCQUFZLEtBQW9CLEVBQUMsT0FBVztRQUE1QyxZQUNFLGlCQUFPLFNBRVI7UUFEQyxLQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFDLENBQUMsRUFBRSxDQUFBOztJQUM1RCxDQUFDO0lBQ0QsdUJBQU0sR0FBTjtRQUFBLGlCQUtDO1FBSkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBQ2xHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsVUFBQSxTQUFTO1lBQzFGLE9BQUEsS0FBSSxDQUFDLFFBQVEsY0FBSyxLQUFJLENBQUMsS0FBSyxJQUFFLFdBQVcsRUFBQyxLQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBQyxDQUFDLEVBQUUsYUFBYSxFQUFDLFNBQVMsS0FBRztnQkFDNUYsT0FBQSxLQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFB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