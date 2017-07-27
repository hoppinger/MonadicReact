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
var Option = require("./option");
var Slugify = require("slugify");
var core_1 = require("./core");
var html_1 = require("./html");
exports.parse_url = function (template) {
    return function (url) {
        var res = {};
        var url_items = url.split("/");
        if (url_items.length != template.length)
            return Option.none();
        for (var i = 0; i < url_items.length; i++) {
            var x = Slugify(url_items[i]);
            var y = Slugify(template[i]);
            if (typeof y === "string") {
                if (x != y)
                    return Option.none();
            }
            else {
                var n = parseInt(x);
                if (isNaN(n))
                    return Option.none();
                res[y.name] = n;
            }
        }
        return Option.some(res);
    };
};
exports.instantiate_url = function (template) {
    return function (t) {
        var url = "";
        for (var i = 0; i < template.length; i++) {
            var el = Slugify(template[i]);
            if (typeof el === "string") {
                url = i == 0 ? el : url + "/" + el;
            }
            else {
                url = i == 0 ? "" + t[el.name] : url + "/" + t[el.name];
            }
        }
        return url;
    };
};
exports.make_url = function (template) {
    return { in: exports.parse_url(template), out: exports.instantiate_url(template) };
};
exports.fallback_url = function () {
    return { in: function (_) { return Option.some({}); }, out: function (_) { return ""; } };
};
var Application = (function (_super) {
    __extends(Application, _super);
    function Application(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { kind: "loading routes" };
        return _this;
    }
    Application.prototype.load = function () {
        var _this = this;
        this.props.routes().then(function (raw_routes) {
            var routes = Immutable.List(raw_routes);
            var initial_page = undefined;
            routes.forEach(function (r) {
                var p = r.url.in(_this.props.slug).map(r.page);
                if (p.kind == "some") {
                    initial_page = p.value;
                    return false;
                }
                return true;
            });
            _this.setState(__assign({}, _this.state, { kind: "running", context: _this.context_from_props(_this.props, initial_page), routes: routes }));
        }).catch(function () { return setTimeout(function () { return _this.load(); }, 250); });
    };
    Application.prototype.componentDidMount = function () {
        this.load();
    };
    Application.prototype.context_from_props = function (props, p) {
        var _this = this;
        var self = this;
        return {
            current_page: p,
            logic_frame: 0,
            force_reload: function (callback) {
                return core_1.make_C(function (ctxt) { return function (inner_callback) {
                    if (_this.state.kind == "loading routes")
                        return null;
                    var old_context = _this.state.context;
                    var new_state = __assign({}, _this.state, { context: __assign({}, old_context, { logic_frame: _this.state.context.logic_frame + 1 }) });
                    _this.setState(new_state, function () {
                        return inner_callback(callback)(null);
                    });
                    return null;
                }; });
            },
            set_page: function (x, new_page, callback) {
                var _this = this;
                window.history.pushState("", "", "" + self.props.base_url + new_page.url.out(x));
                return core_1.make_C(function (ctxt) { return function (inner_callback) {
                    if (self.state.kind == "loading routes")
                        return undefined;
                    var new_context = __assign({}, self.state.context, { current_page: new_page.page(x) });
                    var new_state = __assign({}, _this.state, { context: new_context });
                    self.setState(new_state, function () {
                        return inner_callback(callback)(null);
                    });
                    return null;
                }; });
            },
            set_url: function (x, new_url, callback) {
                // console.log(self.props.base_url, new_url.out(x))
                window.history.pushState("", "", "" + self.props.base_url + new_url.out(x));
                return core_1.unit(null);
            },
            push_route: function (new_route, callback) {
                return core_1.make_C(function (ctxt) { return function (inner_callback) {
                    if (_this.state.kind == "loading routes")
                        return null;
                    var old_context = _this.state.context;
                    var new_state = __assign({}, _this.state, { routes: _this.state.routes.push(new_route) });
                    _this.setState(new_state, function () {
                        return inner_callback(callback)(null);
                    });
                    return null;
                }; });
            },
            set_routes: function (routes, callback) {
                return core_1.make_C(function (ctxt) { return function (inner_callback) {
                    if (_this.state.kind == "loading routes")
                        return null;
                    var old_context = _this.state.context;
                    var new_state = __assign({}, _this.state, { routes: Immutable.List(routes) });
                    _this.setState(new_state, function () {
                        return inner_callback(callback)(null);
                    });
                    return null;
                }; });
            },
        };
    };
    Application.prototype.render = function () {
        var _this = this;
        if (this.state.kind == "loading routes")
            return React.createElement("div", { className: "loading" }, "Loading...");
        return React.createElement("div", { className: "monadic-application", key: "application@" + this.state.context.logic_frame }, this.state.context.current_page.comp(function () { return _this.state.kind != "loading routes" && _this.state.context; })(function (callback) { return function (_) { return callback && callback(); }; }));
    };
    return Application;
}(React.Component));
exports.Application = Application;
exports.application = function (mode, base_url, slug, routes) {
    console.log("Calling application with", window.location.href, slug, base_url);
    return React.createElement(Application, { mode: mode, base_url: base_url, slug: slug, routes: routes });
};
exports.get_context = function (key, dbg) {
    return core_1.make_C(function (ctxt) { return function (cont) {
        return (core_1.unit(ctxt()).comp(ctxt)(cont));
    }; });
};
exports.link_to_route = function (label, x, r, key, className) {
    return html_1.button(label)(null).then(key, function (_) {
        return exports.get_context().then(undefined, function (c) {
            return c.set_page(x, r);
        }, className).ignore();
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlYWN0X21vbmFkL3JvdXRlci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2QkFBOEI7QUFFOUIscUNBQXNDO0FBRXRDLGlDQUFrQztBQUNsQyxpQ0FBa0M7QUFFbEMsK0JBQTRFO0FBQzVFLCtCQUE2QjtBQUlsQixRQUFBLFNBQVMsR0FBRyxVQUErQixRQUF1QjtJQUMzRSxNQUFNLENBQUMsVUFBQSxHQUFHO1FBQ1IsSUFBSSxHQUFHLEdBQVMsRUFBRSxDQUFBO1FBQ2xCLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDOUIsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUssQ0FBQTtRQUNoRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMxQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDN0IsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUssQ0FBQTtZQUNyQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUNu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