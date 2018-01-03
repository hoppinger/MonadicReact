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
var Application = /** @class */ (function (_super) {
    __extends(Application, _super);
    function Application(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.history = Immutable.Stack();
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
            var newState = __assign({}, _this.state, { kind: "running", context: _this.context_from_props(_this.props, initial_page), routes: routes });
            _this.setState(newState);
        }).catch(function () { return setTimeout(function () { return _this.load(); }, 250); });
    };
    Application.prototype.componentDidMount = function () {
        this.load();
        var self = this;
        var load = function () {
            if (self.state.kind != "running")
                return;
            if (self.history.count() == 1) {
                var slug_1 = self.history.peek();
                window.history.pushState("" + self.props.base_url + slug_1, "" + self.props.base_url + slug_1, "" + self.props.base_url + slug_1);
                return;
            }
            self.history = self.history.pop();
            var slug = self.history.peek();
            // console.log("back to", slug, old_history.toArray(), self.history.toArray())
            var routes = self.state.routes;
            var new_page = undefined;
            routes.forEach(function (r) {
                var p = r.url.in(slug).map(r.page);
                if (p.kind == "some") {
                    new_page = p.value;
                    return false;
                }
                return true;
            });
            window.history.pushState("" + self.props.base_url + slug, "" + self.props.base_url + slug, "" + self.props.base_url + slug);
            var new_context = __assign({}, self.state.context, { current_page: new_page, logic_frame: self.state.context.logic_frame + 1 });
            var new_state = __assign({}, self.state, { context: new_context });
            self.setState(new_state);
        };
        window.onpopstate = function (e) {
            load();
        };
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
                var out = new_page.url.out(x);
                window.history.pushState("" + self.props.base_url + out, "" + self.props.base_url + out, "" + self.props.base_url + out);
                if (self.history.isEmpty() || self.history.peek() != out)
                    self.history = self.history.push(out);
                // console.log("set page", self.history.toArray())
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
                var out = new_url.out(x);
                // console.log("set page", self.props.base_url, out, new_url)
                window.history.pushState("" + self.props.base_url + out, "" + self.props.base_url + out, "" + self.props.base_url + out);
                if (self.history.isEmpty() || self.history.peek() != out)
                    self.history = self.history.push(out);
                // console.log("set url", self.history.toArray())
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