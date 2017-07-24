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
        _this.state = { context: _this.context_from_props(_this.props, props.p) };
        return _this;
    }
    SimpleApplication.prototype.context_from_props = function (props, p) {
        var _this = this;
        var self = this;
        return {
            mode: props.mode,
            current_page: p,
            set_mode: function (new_mode, callback) {
                return make_C(function (ctxt) { return function (inner_callback) { return _this.setState(__assign({}, _this.state, { context: __assign({}, _this.state.context, { mode: new_mode }) }), function () { return inner_callback(callback)(null); }) || null; }; });
            },
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
        return React.createElement("div", { className: "monadic-application", key: "application@" + this.state.context.logic_frame }, this.state.context.current_page.comp(function () { return _this.state.context; })(function (callback) { return function (_) { return callback && callback(); }; }));
    };
    return SimpleApplication;
}(React.Component));
exports.SimpleApplication = SimpleApplication;
exports.simple_application = function (mode, p) {
    return React.createElement(SimpleApplication, { mode: mode, p: p });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdF9tb25hZC9jb3JlLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZCQUE4QjtBQUk5Qiw2Q0FBbUM7QUFxQ25DLGdCQUEwQixJQUF3RDtJQUNoRixNQUFNLENBQUM7UUFDTCxJQUFJLEVBQUMsSUFBSTtRQUNULElBQUksRUFBQyxVQUF1QixHQUFVLEVBQUUsQ0FBYSxFQUFFLFNBQWlCLEVBQUUsR0FBZTtZQUNqRixNQUFNLENBQUMsWUFBSSxDQUFNLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUNoRCxDQUFDO1FBQ1AsR0FBRyxFQUFDLFVBQXVCLENBQVUsRUFBRSxHQUFXLEVBQUUsR0FBZTtZQUMzRCxNQUFNLENBQUMsV0FBRyxDQUFNLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNwQyxDQUFDO1FBQ1AsTUFBTSxFQUFDLFVBQW9CLENBQWdCLEVBQUUsR0FBVyxFQUFFLEdBQWU7WUFDakUsTUFBTSxDQUFDLGNBQU0sQ0FBSSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDckMsQ0FBQztRQUNQLHdGQUF3RjtRQUN4RixtREFBbUQ7UUFDbkQsV0FBVztRQUNYLEtBQUssRUFBQyxVQUF1QixHQUFXO1lBQ3RDLE1BQU0sQ0FBQyxtQkFBSyxDQUFPLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUMvQixDQUFDO1FBQ0QsV0FBVyxFQUFDLFVBQXVCLENBQUc7WUFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUksRUFBRSxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsWUFBSSxDQUFJLENBQUMsQ0FBQyxFQUFWLENBQVUsQ0FBQyxDQUFBO1FB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