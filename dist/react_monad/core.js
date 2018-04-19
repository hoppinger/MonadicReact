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
var combinators_1 = require("./combinators");
function make_C(comp) {
    return {
        comp: comp,
        then: function (key, k, className, dbg) {
            return exports.bind(key, this, k, className, dbg);
        },
        map: function (f, key, dbg) {
            return exports.map(key, dbg)(f)(this);
        },
        filter: function (f, key, dbg) {
            return exports.filter(key, dbg)(f)(this);
        },
        // bind_once:function<B>(this:C<A>, key:string, k:(_:A)=>C<B>, dbg?:()=>string) : C<B> {
        //         return bind_once<A,B>(key, this, k, dbg)
        //       },
        never: function (key) {
            return combinators_1.never(this, key);
        },
        ignore_with: function (x) {
            return this.then("", function (_) { return exports.unit(x); });
        },
        ignore: function (key) {
            return this.then(key, function (_) { return exports.unit(null); });
        }
    };
}
exports.make_C = make_C;
var Unit = /** @class */ (function (_super) {
    __extends(Unit, _super);
    function Unit(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = {};
        return _this;
    }
    Unit.prototype.componentWillReceiveProps = function (new_props) {
        new_props.debug_info && console.log("New props:", new_props.debug_info(), new_props.value);
        new_props.cont(function () { })(new_props.value);
    };
    Unit.prototype.componentWillMount = function () {
        this.props.debug_info && console.log("Component will mount:", this.props.debug_info(), this.props.value);
        this.props.cont(function () { })(this.props.value);
    };
    Unit.prototype.render = function () {
        this.props.debug_info && console.log("Render:", this.props.debug_info());
        return [];
    };
    return Unit;
}(React.Component));
exports.unit = function (x, key, dbg) {
    return make_C(function (ctxt) { return function (cont) {
        return (React.createElement(Unit, { kind: "unit", debug_info: dbg, value: x, context: ctxt, cont: cont, key: key }));
    }; });
};
var Join = /** @class */ (function (_super) {
    __extends(Join, _super);
    function Join(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { p_inner: "waiting", p_outer: props.p.comp(props.context)(function (cont) { return function (p_inner) {
                return _this.setState(__assign({}, _this.state, { p_inner: p_inner.comp(_this.props.context)(function (cb) { return function (x) { return _this.props.cont(cb)(x); }; }) }));
            }; }) };
        return _this;
    }
    Join.prototype.componentWillReceiveProps = function (new_props) {
        var _this = this;
        new_props.debug_info && console.log("New join props:", new_props.debug_info());
        this.setState({ p_outer: new_props.p.comp(new_props.context)(function (cont) { return function (p_inner) {
                return _this.setState(__assign({}, _this.state, { p_inner: p_inner.comp(new_props.context)(function (cb) { return function (x) { return new_props.cont(cb)(x); }; }) }));
            }; }) });
    };
    Join.prototype.render = function () {
        return React.createElement("div", null,
            this.state.p_outer,
            this.state.p_inner == "waiting"
                ? []
                : this.state.p_inner);
    };
    return Join;
}(React.Component));
var join = function (p, key, dbg) {
    return make_C(function (ctxt) { return function (cont) { return React.createElement(Join, { p: p, context: ctxt, cont: cont, debug_info: dbg, key: key }); }; });
};
var Bind = /** @class */ (function (_super) {
    __extends(Bind, _super);
    function Bind(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { k: "waiting for p", p: "creating" };
        return _this;
    }
    Bind.prototype.componentWillReceiveProps = function (new_props) {
        var _this = this;
        this.props.debug_info && console.log("New props:", this.props.debug_info());
        if (this.props.once)
            this.setState(__assign({}, this.state, { p: "creating" }));
        else
            this.setState(__assign({}, this.state, { p: new_props.p.comp(new_props.context)(function (callback) { return function (x) {
                    return _this.setState(__assign({}, _this.state, { k: new_props.k(x).comp(new_props.context)(function (callback) { return function (x) {
                            return new_props.cont(callback)(x);
                        }; }) }), callback);
                }; }) }));
    };
    Bind.prototype.componentWillMount = function () {
        var _this = this;
        this.setState(__assign({}, this.state, { p: this.props.p.comp(this.props.context)(function (callback) { return function (x) {
                return _this.setState(__assign({}, _this.state, { k: _this.props.k(x).comp(_this.props.context)(function (callback) { return function (x) {
                        return _this.props.cont(callback)(x);
                    }; }) }), callback);
            }; }) }));
    };
    Bind.prototype.render = function () {
        this.props.debug_info && console.log("Render:", this.props.debug_info());
        return React.createElement("div", { className: "bind " + (this.props.className || "") },
            (this.state.k == "waiting for p" || !this.props.once) && this.state.p != "creating"
                ? this.state.p
                : [],
            this.state.k != "waiting for p"
                ? this.state.k
                : []);
    };
    return Bind;
}(React.Component));
exports.bind = function (key, p, k, className, dbg) {
    var q = p.map(k, key + "_map", dbg);
    return join(q, key + "_join", dbg);
    // return make_C<B>(ctxt => cont =>
    //   (React.createElement<BindProps<A,B>>(Bind,
    //     { kind:"bind", debug_info:dbg, p:p, k:k, once:false, cont:cont, context:ctxt, key:key, className:className })))
};
var Map = /** @class */ (function (_super) {
    __extends(Map, _super);
    function Map(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { p: "creating" };
        return _this;
    }
    Map.prototype.componentWillReceiveProps = function (new_props) {
        this.props.debug_info && console.log("New props:", this.props.debug_info());
        this.setState(__assign({}, this.state, { p: new_props.p.comp(new_props.context)(function (callback) { return function (x) { return new_props.cont(callback)(new_props.f(x)); }; }) }));
    };
    Map.prototype.componentWillMount = function () {
        var _this = this;
        this.setState(__assign({}, this.state, { p: this.props.p.comp(this.props.context)(function (callback) { return function (x) { return _this.props.cont(callback)(_this.props.f(x)); }; }) }));
    };
    Map.prototype.render = function () {
        this.props.debug_info && console.log("Render:", this.props.debug_info());
        return this.state.p != "creating"
            ? this.state.p
            : [];
    };
    return Map;
}(React.Component));
exports.map = function (key, dbg) {
    return function (f) { return function (p) {
        return make_C(function (ctxt) { return function (cont) {
            return React.createElement(Map, { kind: "map", debug_info: dbg, p: p, f: f, context: ctxt, cont: cont, key: key });
        }; });
    }; };
};
var Filter = /** @class */ (function (_super) {
    __extends(Filter, _super);
    function Filter(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { p: "creating" };
        return _this;
    }
    Filter.prototype.componentWillReceiveProps = function (new_props) {
        this.props.debug_info && console.log("New props:", this.props.debug_info());
        this.setState(__assign({}, this.state, { p: new_props.p.comp(new_props.context)(function (callback) { return function (x) { if (new_props.f(x)) {
                new_props.cont(callback)(x);
            } }; }) }));
    };
    Filter.prototype.componentWillMount = function () {
        var _this = this;
        this.setState(__assign({}, this.state, { p: this.props.p.comp(this.props.context)(function (callback) { return function (x) { if (_this.props.f(x)) {
                _this.props.cont(callback)(x);
            } }; }) }));
    };
    Filter.prototype.render = function () {
        this.props.debug_info && console.log("Render:", this.props.debug_info());
        return this.state.p != "creating"
            ? this.state.p
            : [];
    };
    return Filter;
}(React.Component));
exports.filter = function (key, dbg) {
    return function (f) { return function (p) {
        return make_C(function (ctxt) { return function (cont) {
            return React.createElement(Filter, { kind: "filter", debug_info: dbg, p: p, f: f, context: ctxt, cont: cont, key: key });
        }; });
    }; };
};
var ShouldComponentUpdate = /** @class */ (function (_super) {
    __extends(ShouldComponentUpdate, _super);
    function ShouldComponentUpdate(props, context) {
        return _super.call(this, props, context) || this;
    }
    ShouldComponentUpdate.prototype.shouldComponentUpdate = function (next_props) {
        return next_props.f(next_props.v);
    };
    ShouldComponentUpdate.prototype.componentWillReceiveProps = function (next_props) {
        this.props.debug_info && console.log("New props:", this.props.debug_info());
    };
    ShouldComponentUpdate.prototype.render = function () {
        var _this = this;
        this.props.debug_info && console.log("Render:", this.props.debug_info());
        // let s = this.props.v as any
        // console.log(`rendering should component update with props ${this.props.debug_info()}`, JSON.stringify(s))
        return this.props.p(this.props.v).comp(this.props.context)(function (cbk) { return function (y) { return _this.props.cont(cbk)(y); }; });
    };
    return ShouldComponentUpdate;
}(React.Component));
exports.should_component_update = function (key, dbg) {
    return function (f) { return function (p) { return function (v) {
        return make_C(function (ctxt) { return function (cont) {
            return React.createElement(ShouldComponentUpdate, { kind: "should component update", debug_info: dbg, p: p, f: f, context: ctxt, cont: cont, key: key, v: v });
        }; });
    }; }; };
};
var SimpleApplication = /** @class */ (function (_super) {
    __extends(SimpleApplication, _super);
    function SimpleApplication(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { context: _this.context_from_props(_this.props, exports.unit(null)) };
        return _this;
    }
    SimpleApplication.prototype.context_from_props = function (props, p) {
        var _this = this;
        var self = this;
        return {
            current_page: p,
            logic_frame: 0,
            force_reload: function (callback) {
                return make_C(function (ctxt) { return function (inner_callback) { return _this.setState(__assign({}, _this.state, { context: __assign({}, _this.state.context, { logic_frame: _this.state.context.logic_frame + 1 }) }), function () { return inner_callback(callback)(null); }) || null; }; });
            },
            set_page: function (x, new_page, callback) {
                return exports.unit(null);
            },
            set_url: function (x, new_url, callback) {
                return exports.unit(null);
            },
            push_route: function (route, callback) {
                return exports.unit(null);
            },
            set_routes: function (routes, callback) {
                return exports.unit(null);
            }
        };
    };
    SimpleApplication.prototype.render = function () {
        var _this = this;
        return React.createElement("div", { className: "monadic-application", key: "application@" + this.state.context.logic_frame }, this.props.p.comp(function () { return _this.state.context; })(function (callback) { return function (x) { return _this.props.cont(x); }; }));
    };
    return SimpleApplication;
}(React.Component));
exports.SimpleApplication = SimpleApplication;
exports.simple_application = function (p, cont) {
    return React.createElement(SimpleApplication, { p: p, cont: cont });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdF9tb25hZC9jb3JlLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZCQUE4QjtBQUk5Qiw2Q0FBbUM7QUFvQ25DLGdCQUEwQixJQUF3RDtJQUNoRixPQUFPO1FBQ0wsSUFBSSxFQUFDLElBQUk7UUFDVCxJQUFJLEVBQUMsVUFBdUIsR0FBVSxFQUFFLENBQWEsRUFBRSxTQUFpQixFQUFFLEdBQWU7WUFDakYsT0FBTyxZQUFJLENBQU0sR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQ2hELENBQUM7UUFDUCxHQUFHLEVBQUMsVUFBdUIsQ0FBVSxFQUFFLEdBQVcsRUFBRSxHQUFlO1lBQzNELE9BQU8sV0FBRyxDQUFNLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNwQyxDQUFDO1FBQ1AsTUFBTSxFQUFDLFVBQW9CLENBQWdCLEVBQUUsR0FBVyxFQUFFLEdBQWU7WUFDakUsT0FBTyxjQUFNLENBQUksR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3JDLENBQUM7UUFDUCx3RkFBd0Y7UUFDeEYsbURBQW1EO1FBQ25ELFdBQVc7UUFDWCxLQUFLLEVBQUMsVUFBdUIsR0FBVztZQUN0QyxPQUFPLG1CQUFLLENBQU8sSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQy9CLENBQUM7UUFDRCxXQUFXLEVBQUMsVUFBdUIsQ0FBRztZQUNwQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUksRUFBRSxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsWUFBSSxDQUFJLENBQUMsQ0FBQyxFQUFWLENBQVUsQ0FBQyxDQUFBO1FBQzFDLENBQUM7UUFDRCxNQUFNLEVBQUMsVUFBb0Is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