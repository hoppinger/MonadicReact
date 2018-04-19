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
        return null;
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
            this.state.p_inner == "waiting" ? null
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
            (this.state.k == "waiting for p" || !this.props.once) && this.state.p != "creating" ?
                this.state.p
                :
                    null,
            this.state.k != "waiting for p" ?
                this.state.k
                :
                    null);
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
        return this.state.p != "creating" ? this.state.p : null;
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
        return this.state.p != "creating" ? this.state.p : null;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdF9tb25hZC9jb3JlLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZCQUE4QjtBQUk5Qiw2Q0FBbUM7QUFtQ25DLGdCQUEwQixJQUF3RDtJQUNoRixPQUFPO1FBQ0wsSUFBSSxFQUFDLElBQUk7UUFDVCxJQUFJLEVBQUMsVUFBdUIsR0FBVSxFQUFFLENBQWEsRUFBRSxTQUFpQixFQUFFLEdBQWU7WUFDakYsT0FBTyxZQUFJLENBQU0sR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQ2hELENBQUM7UUFDUCxHQUFHLEVBQUMsVUFBdUIsQ0FBVSxFQUFFLEdBQVcsRUFBRSxHQUFlO1lBQzNELE9BQU8sV0FBRyxDQUFNLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNwQyxDQUFDO1FBQ1AsTUFBTSxFQUFDLFVBQW9CLENBQWdCLEVBQUUsR0FBVyxFQUFFLEdBQWU7WUFDakUsT0FBTyxjQUFNLENBQUksR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3JDLENBQUM7UUFDUCx3RkFBd0Y7UUFDeEYsbURBQW1EO1FBQ25ELFdBQVc7UUFDWCxLQUFLLEVBQUMsVUFBdUIsR0FBVztZQUN0QyxPQUFPLG1CQUFLLENBQU8sSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQy9CLENBQUM7UUFDRCxXQUFXLEVBQUMsVUFBdUIsQ0FBRztZQUNwQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUksRUFBRSxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsWUFBSSxDQUFJLENBQUMsQ0FBQyxFQUFWLENBQVUsQ0FBQyxDQUFBO1FBQzFDLENBQUM7UUFDRCxNQUFNLEVBQUMsVUFBb0Is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