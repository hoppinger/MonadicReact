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
var Unit = (function (_super) {
    __extends(Unit, _super);
    function Unit(props, context) {
        var _this = _super.call(this) || this;
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
var Join = (function (_super) {
    __extends(Join, _super);
    function Join(props, context) {
        var _this = _super.call(this) || this;
        _this.state = { p_inner: "waiting", p_outer: props.p.comp(props.context)(function (cont) { return function (p_inner) {
                return _this.setState(__assign({}, _this.state, { p_inner: p_inner.comp(_this.props.context)(function (cb) { return function (x) { return _this.props.cont(cb)(x); }; }) }));
            }; }) };
        return _this;
    }
    Join.prototype.componentWillReceiveProps = function (new_props) {
        var _this = this;
        new_props.debug_info && console.log("New join props:", new_props.debug_info());
        this.setState({ p_inner: "waiting", p_outer: new_props.p.comp(new_props.context)(function (cont) { return function (p_inner) {
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
var Bind = (function (_super) {
    __extends(Bind, _super);
    function Bind(props, context) {
        var _this = _super.call(this) || this;
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
    // let q = p.map<C<B>>(k, key, dbg)
    // return join<B>(q, key, dbg)
    return make_C(function (ctxt) { return function (cont) {
        return (React.createElement(Bind, { kind: "bind", debug_info: dbg, p: p, k: k, once: false, cont: cont, context: ctxt, key: key, className: className }));
    }; });
};
var Map = (function (_super) {
    __extends(Map, _super);
    function Map(props, context) {
        var _this = _super.call(this) || this;
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
var Filter = (function (_super) {
    __extends(Filter, _super);
    function Filter(props, context) {
        var _this = _super.call(this) || this;
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
var SimpleApplication = (function (_super) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdF9tb25hZC9jb3JlLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZCQUE4QjtBQUk5Qiw2Q0FBbUM7QUFtQ25DLGdCQUEwQixJQUF3RDtJQUNoRixNQUFNLENBQUM7UUFDTCxJQUFJLEVBQUMsSUFBSTtRQUNULElBQUksRUFBQyxVQUF1QixHQUFVLEVBQUUsQ0FBYSxFQUFFLFNBQWlCLEVBQUUsR0FBZTtZQUNqRixNQUFNLENBQUMsWUFBSSxDQUFNLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUNoRCxDQUFDO1FBQ1AsR0FBRyxFQUFDLFVBQXVCLENBQVUsRUFBRSxHQUFXLEVBQUUsR0FBZTtZQUMzRCxNQUFNLENBQUMsV0FBRyxDQUFNLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNwQyxDQUFDO1FBQ1AsTUFBTSxFQUFDLFVBQW9CLENBQWdCLEVBQUUsR0FBVyxFQUFFLEdBQWU7WUFDakUsTUFBTSxDQUFDLGNBQU0sQ0FBSSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDckMsQ0FBQztRQUNQLHdGQUF3RjtRQUN4RixtREFBbUQ7UUFDbkQsV0FBVztRQUNYLEtBQUssRUFBQyxVQUF1QixHQUFXO1lBQ3RDLE1BQU0sQ0FBQyxtQkFBSyxDQUFPLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUMvQixDQUFDO1FBQ0QsV0FBVyxFQUFDLFVBQXVCLENBQUc7WUFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUksRUFBRSxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsWUFBSSxDQUFJLENBQUMsQ0FBQyxFQUFWLENBQVUsQ0FBQyxDQUFBO1FB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