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
        //console.log("starting delay thread")
        if (this.running)
            return;
        this.running = true;
        var self = this;
        var process = function () { return setTimeout(function () {
            //console.log("delay is ticking", self.state.status, self.state.value)
            if (self.state.status == "dirty") {
                //console.log("delay is submitting the data to save")
                if (!_this.running)
                    return;
                self.setState(__assign({}, self.state, { status: "waiting", last_command: self.props.p(self.state.value).comp(_this.props.context)(function (callback) { return function (new_value) {
                        //console.log("calling the continuation of dirty", self.state.value)
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
        //console.log("stopping delay thread")
        this.running = false;
    };
    Delay.prototype.componentWillReceiveProps = function (new_props) {
        //console.log("Delay received new props and is going back to dirty")
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
var Wait = /** @class */ (function (_super) {
    __extends(Wait, _super);
    function Wait(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.running = false;
        _this.state = { status: "open",
            last_command: null
            //last_command:props.p(props.value).comp(props.context)(props.cont) 
        };
        return _this;
    }
    Wait.prototype.end_process = function () {
        var _this = this;
        if (!this.running)
            return;
        //console.log('Ending process')
        this.setState(__assign({}, this.state, { status: "closed", last_command: this.props.p(this.props.value).comp(this.props.context)(function (callback) { return function (new_value) { return _this.props.cont(callback)(new_value); }; }) }));
    };
    Wait.prototype.process = function () {
        //console.log('Starting Wait process')
    };
    Wait.prototype.componentWillMount = function () {
        var _this = this;
        //console.log("starting wait thread")
        if (this.running)
            return;
        this.running = true;
        //console.log('Starting first waiting')
        setTimeout(function () { return _this.end_process(); }, this.props.dt);
        // var self = this
        // let process = () =>
        // setTimeout(() => {
        //   console.log("wait is ticking", self.state.status, self.state.value)
        //   if (self.state.status == "dirty") {
        //     console.log("wait is submitting the data to save")
        //     if (!this.running) return
        //     self.setState({...self.state, status:"waiting", last_command:self.props.p(self.state.value).comp(this.props.context)(callback => new_value => {
        //       console.log("calling the continuation of dirty", self.state.value)
        //       self.props.cont(callback)(new_value)
        //     })})
        //     process()
        //   } else {
        //     if (self.running)
        //       process()
        //   }
        // }, self.props.dt)
        // process()
    };
    Wait.prototype.componentWillUnmount = function () {
        //console.log("stopping wait thread")
        this.running = false;
    };
    Wait.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _this = this;
        if (prevState.status == 'closed' && this.state.status == "open") {
            //console.log('Here we start the process')
            setTimeout(function () { return _this.end_process(); }, this.props.dt);
        }
    };
    Wait.prototype.componentWillReceiveProps = function (new_props) {
        // console.log("Wait received new props and is going to wait")
        // let process = () => console.log('start process') || setTimeout(() => {
        //   console.log('the process is ending')
        //   this.setState({...this.state, status:"closed", last_command: this.props.p(this.state.value).comp(this.props.context)(callback => new_value => {
        //     this.props.cont(callback)(new_value)
        //   })})
        // }
        //   ,this.props.dt)
        // if (this.state.status == "closed") {
        //   this.setState({...this.state, value: new_props.value, status:"waiting"}, () => process())
        // }
        // else this.setState({...this.state, value: new_props.value})
        this.setState(__assign({}, this.state, { status: 'open' }));
    };
    Wait.prototype.render = function () {
        //console.log(this.props.value)
        return this.state.last_command;
    };
    return Wait;
}(React.Component));
exports.waiting = function (dt, key, dbg) {
    return function (p) { return function (initial_value) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Wait, { kind: "wait", debug_info: dbg, dt: dt, p: p, value: initial_value, context: ctxt, cont: cont, key: key });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYmluYXRvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVhY3RfbW9uYWQvY29tYmluYXRvcnMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkJBQThCO0FBRTlCLHFDQUFzQztBQUN0QyxpQ0FBa0M7QUFFbEMsK0JBQTRFO0FBQzVFLCtCQUE2QjtBQUM3QiwyQ0FBaUM7QUFjakM7SUFBd0IsMEJBQThDO0lBQ3BFLGdCQUFZLEtBQW9CLEVBQUMsT0FBVztRQUE1QyxZQUNFLGtCQUFNLEtBQUssRUFBRSxPQUFPLENBQUMsU0FFdEI7UUFDRCxhQUFPLEdBQVcsS0FBSyxDQUFBO1FBRnJCLEtBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxhQUFhLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUMsQ0FBQyxFQUFFLENBQUE7O0lBQzVELENBQUM7SUFHRCxxQ0FBb0IsR0FBcEI7UUFDRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtJQUNyQixDQUFDO0lBRUQsbUNBQWtCLEdBQWxCO1FBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7SUFDdEIsQ0FBQztJQUVELHVCQUFNLEdBQU47UUFBQSxpQkFPQztRQU5DLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtRQUNsRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFVBQUEsU0FBUztZQUMxRixFQUFFLENBQUMs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