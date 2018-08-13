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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlYWN0X21vbmFkL3JvdXRlci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2QkFBOEI7QUFFOUIscUNBQXNDO0FBRXRDLGlDQUFrQztBQUNsQyxpQ0FBa0M7QUFFbEMsK0JBQTRFO0FBQzVFLCtCQUE2QjtBQUlsQixRQUFBLFNBQVMsR0FBRyxVQUErQixRQUF1QjtJQUMzRSxPQUFPLFVBQUEsR0FBRztRQUNSLElBQUksR0FBRyxHQUFTLEVBQUUsQ0FBQTtRQUNsQixJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQzlCLElBQUksU0FBUyxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUMsTUFBTTtZQUFFLE9BQU8sTUFBTSxDQUFDLElBQUksRUFBSyxDQUFBO1FBQ2hFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3pDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUM3QixJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDNUIsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUM7b0JBQUUsT0FBTyxNQUFNLENBQUMsSUFBSSxFQUFLLENBQUE7YUFDcEM7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUNuQixJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQUUsT0FBTyxNQUFNLENBQUMsSUFBSSxFQUFLLENBQUE7Z0JBQ3JDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2FBQ2hCO1NBQ0Y7UUFFRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUksR0FBUSxDQUFDLENBQUE7SUFDakMsQ0FBQyxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBQ1UsUUFBQSxlQUFlLEdBQUcsVUFBK0IsUUFBdUI7SUFDakYsT0FBTyxVQUFBLENBQUM7UUFDTixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUE7UUFDWixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN4QyxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDN0IsSUFBSSxPQUFPLEVBQUUsS0FBSyxRQUFRLEVBQUU7Z0JBQzFCLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFJLEdBQUcsU0FBSSxFQUFJLENBQUE7YUFDbkM7aUJBQU07Z0JBQ0wsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUcsQ0FBQyxDQUFDLENBQUksR0FBRyxTQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFHLENBQUE7YUFDeEQ7U0FDRjtRQUNELE9BQU8sR0FBRyxDQUFBO0lBQ1osQ0FBQyxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRVUsUUFBQSxRQUFRLEdBQUcsVUFBK0IsUUFBdUI7SUFDMUUsT0FBTyxFQUFFLEVBQUUsRUFBQyxpQkFBUyxDQUFNLFFBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBQyx1QkFBZSxDQUFNLFFBQVEsQ0FBQyxFQUFFLENBQUE7QUFDNUUsQ0FBQyxDQUFBO0FBQ1UsUUFBQSxZQUFZLEdBQUc7SUFDeEIsT0FBTyxFQUFFLEVBQUUsRUFBQyxVQUFBLENBQUMsSUFBSSxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQWYsQ0FBZSxFQUFFLEdBQUcsRUFBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEVBQUUsRUFBRixDQUFFLEVBQUUsQ0FBQTtBQUNqRCxDQUFDLENBQUE7QUFPRDtJQUFpQywrQkFBbUQ7SUFDbEYscUJBQVksS0FBc0IsRUFBRSxPQUFXO1FBQS9DLFlBQ0Usa0JBQU0sS0FBSyxFQUFFLE9BQU8sQ0FBQyxTQUd0QjtRQTBERCxhQUFPLEdBQUcsU0FBUyxDQUFDLEtBQUssRUFBVSxDQUFBO1FBM0RqQyxLQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsSUFBSSxFQUFDLGdCQUFnQixFQUFFLENBQUE7O0lBQ3hDLENBQUM7SUFFRCwwQkFBSSxHQUFKO1FBQUEsaUJBZ0JDO1FBZkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQSxVQUFVO1lBQ2pDLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQVksVUFBVSxDQUFDLENBQUE7WUFDbEQsSUFBSSxZQUFZLEdBQVcsU0FBUyxDQUFBO1lBQ3BDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO2dCQUNaLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFDN0MsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLE1BQU0sRUFBRTtvQkFDcEIsWUFBWSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUE7b0JBQ3RCLE9BQU8sS0FBSyxDQUFBO2lCQUNiO2dCQUNELE9BQU8sSUFBSSxDQUFBO1lBQ2YsQ0FBQyxDQUFDLENBQUE7WUFFRixJQUFJLFFBQVEsZ0JBQXlCLEtBQUksQ0FBQyxLQUFLLElBQUUsSUFBSSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsS0FBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUksQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLEVBQUUsTUFBTSxFQUFDLE1BQU0sR0FBRSxDQUFBO1lBQzVJLEtBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDekIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGNBQU0sT0FBQSxVQUFVLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxJQUFJLEVBQUUsRUFBWCxDQUFXLEVBQUUsR0FBRyxDQUFDLEVBQWxDLENBQWtDLENBQUMsQ0FBQTtJQUNwRCxDQUFDO0lBRUQsdUNBQWlCLEdBQWpCO1FBQ0UsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO1FBQ1gsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBQ2YsSUFBSSxJQUFJLEdBQUc7WUFDVCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLFNBQVM7Z0JBQUUsT0FBTTtZQUN4QyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUM3QixJQUFJLE1BQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFBO2dCQUM5QixNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sRUFBRSxLQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sRUFBRSxLQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxDQUFBO2dCQUMzSCxPQUFNO2FBQ1A7WUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUE7WUFDakMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQTtZQUU5Qiw4RUFBOEU7WUFDOUUsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUE7WUFFOUIsSUFBSSxRQUFRLEdBQVcsU0FBUyxDQUFBO1lBQ2hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO2dCQUNkLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQ2xDLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxNQUFNLEVBQUU7b0JBQ3BCLFFBQVEsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFBO29CQUNsQixPQUFPLEtBQUssQ0FBQTtpQkFDYjtnQkFDRCxPQUFPLElBQUksQ0FBQTtZQUNiLENBQUMsQ0FBQyxDQUFBO1lBRUYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFNLEVBQUUsS0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFNLEVBQUUsS0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFNLENBQUMsQ0FBQTtZQUUzSCxJQUFJLFdBQVcsZ0JBQWUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUUsWUFBWSxFQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBQyxDQUFBO1lBQ3hILElBQUksU0FBUyxnQkFBd0IsSUFBSSxDQUFDLEtBQUssSUFBRSxPQUFPLEVBQUMsV0FBVyxHQUFDLENBQUE7WUFDckUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUMxQixDQUFDLENBQUE7UUFFRCxNQUFNLENBQUMsVUFBVSxHQUFHLFVBQVMsQ0FBQztZQUM1QixJQUFJLEVBQUUsQ0FBQTtRQUNSLENBQUMsQ0FBQTtJQUNILENBQUM7SUFJRCx3Q0FBa0IsR0FBbEIsVUFBbUIsS0FBc0IsRUFBRSxDQUFTO1FBQXBELGlCQXlEQztRQXhEQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUE7UUFDZixPQUFPO1lBQ0wsWUFBWSxFQUFDLENBQUM7WUFDZCxXQUFXLEVBQUMsQ0FBQztZQUNiLFlBQVksRUFBQyxVQUFDLFFBQVE7Z0JBQ3BCLE9BQUEsYUFBTSxDQUFPLFVBQUEsSUFBSSxJQUFJLE9BQUEsVUFBQSxjQUFjO29CQUMvQixJQUFJLEtBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLGdCQUFnQjt3QkFBRSxPQUFPLElBQUksQ0FBQTtvQkFDcEQsSUFBSSxXQUFXLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUE7b0JBQ3BDLElBQUksU0FBUyxnQkFBd0IsS0FBSSxDQUFDLEtBQUssSUFBRSxPQUFPLGVBQUssV0FBVyxJQUFFLFdBQVcsRUFBQyxLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUMsQ0FBQyxNQUFFLENBQUE7b0JBQ3hILEtBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFO3dCQUN6QixPQUFBLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUM7b0JBQTlCLENBQThCLENBQUMsQ0FBQTtvQkFDakMsT0FBTyxJQUFJLENBQUE7Z0JBQ2IsQ0FBQyxFQVBvQixDQU9wQixDQUFDO1lBUEYsQ0FPRTtZQUNKLFFBQVEsRUFBQyxVQUFZLENBQUcsRUFBRSxRQUFpQixFQUFFLFFBQWtCO2dCQUF0RCxpQkFjUjtnQkFiQyxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDN0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxHQUFLLEVBQUUsS0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxHQUFLLEVBQUUsS0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxHQUFLLENBQUMsQ0FBQTtnQkFDeEgsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksR0FBRztvQkFDdEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDdkMsa0RBQWtEO2dCQUNsRCxPQUFPLGFBQU0sQ0FBTyxVQUFBLElBQUksSUFBSSxPQUFBLFVBQUEsY0FBYztvQkFDeEMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxnQkFBZ0I7d0JBQUUsT0FBTyxTQUFTLENBQUE7b0JBQ3pELElBQUksV0FBVyxnQkFBZSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBRSxZQUFZLEVBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBQyxDQUFBO29CQUNoRixJQUFJLFNBQVMsZ0JBQXdCLEtBQUksQ0FBQyxLQUFLLElBQUUsT0FBTyxFQUFDLFdBQVcsR0FBQyxDQUFBO29CQUNyRSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRTt3QkFDekIsT0FBQSxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDO29CQUE5QixDQUE4QixDQUFDLENBQUE7b0JBQy9CLE9BQU8sSUFBSSxDQUFBO2dCQUNiLENBQUMsRUFQMkIsQ0FPM0IsQ0FBQyxDQUFBO1lBQ0osQ0FBQztZQUNELE9BQU8sRUFBQyxVQUFZLENBQUcsRUFBRSxPQUFjLEVBQUUsUUFBa0I7Z0JBQ3pELElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQ3hCLDZEQUE2RDtnQkFDN0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxHQUFLLEVBQUUsS0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxHQUFLLEVBQUUsS0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxHQUFLLENBQUMsQ0FBQTtnQkFDeEgsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksR0FBRztvQkFDdEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDdkMsaURBQWlEO2dCQUNqRCxPQUFPLFdBQUksQ0FBTyxJQUFJLENBQUMsQ0FBQTtZQUN6QixDQUFDO1lBQ0QsVUFBVSxFQUFDLFVBQUMsU0FBUyxFQUFFLFFBQVE7Z0JBQzdCLE9BQUEsYUFBTSxDQUFPLFVBQUEsSUFBSSxJQUFJLE9BQUEsVUFBQSxjQUFjO29CQUMvQixJQUFJLEtBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLGdCQUFnQjt3QkFBRSxPQUFPLElBQUksQ0FBQTtvQkFDcEQsSUFBSSxXQUFXLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUE7b0JBQ3BDLElBQUksU0FBUyxnQkFBd0IsS0FBSSxDQUFDLEtBQUssSUFBRSxNQUFNLEVBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFDLENBQUE7b0JBQzFGLEtBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFO3dCQUN6QixPQUFBLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUM7b0JBQTlCLENBQThCLENBQUMsQ0FBQTtvQkFDakMsT0FBTyxJQUFJLENBQUE7Z0JBQ2IsQ0FBQyxFQVBvQixDQU9wQixDQUFDO1lBUEYsQ0FPRTtZQUNKLFVBQVUsRUFBQyxVQUFDLE1BQU0sRUFBRSxRQUFRO2dCQUMxQixPQUFBLGFBQU0sQ0FBTyxVQUFBLElBQUksSUFBSSxPQUFBLFVBQUEsY0FBYztvQkFDL0IsSUFBSSxLQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxnQkFBZ0I7d0JBQUUsT0FBTyxJQUFJLENBQUE7b0JBQ3BELElBQUksV0FBVyxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFBO29CQUNwQyxJQUFJLFNBQVMsZ0JBQXdCLEtBQUksQ0FBQyxLQUFLLElBQUUsTUFBTSxFQUFDLFNBQVMsQ0FBQyxJQUFJLENBQVksTUFBTSxDQUFDLEdBQUMsQ0FBQTtvQkFDMUYsS0FBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUU7d0JBQ3pCLE9BQUEsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFBOUIsQ0FBOEIsQ0FBQyxDQUFBO29CQUNqQyxPQUFPLElBQUksQ0FBQTtnQkFDYixDQUFDLEVBUG9CLENBT3BCLENBQUM7WUFQRixDQU9FO1NBQ0wsQ0FBQTtJQUNILENBQUM7SUFFRCw0QkFBTSxHQUFOO1FBQUEsaUJBUUM7UUFQQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLGdCQUFnQjtZQUNyQyxPQUFPLDZCQUFLLFNBQVMsRUFBQyxTQUFTLGlCQUFpQixDQUFBO1FBQ2xELE9BQU8sNkJBQUssU0FBUyxFQUFDLHFCQUFxQixFQUFDLEdBQUcsRUFBRSxpQkFBZSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFhLElBRTFGLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLGdCQUFnQixJQUFJLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUF6RCxDQUF5RCxDQUFDLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxVQUFBLENBQUMsSUFBSSxPQUFBLFFBQVEsSUFBSSxRQUFRLEVBQUUsRUFBdEIsQ0FBc0IsRUFBM0IsQ0FBMkIsQ0FBQyxDQUU5SSxDQUFBO0lBQ1IsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQXJJRCxDQUFpQyxLQUFLLENBQUMsU0FBUyxHQXFJL0M7QUFySVksa0NBQVc7QUF1SWIsUUFBQSxXQUFXLEdBQUcsVUFBQyxJQUFTLEVBQUUsUUFBZSxFQUFFLElBQVcsRUFBRSxNQUFzQztJQUN2RyxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUM3RSxPQUFPLEtBQUssQ0FBQyxhQUFhLENBQW1CLFdBQVcsRUFBRSxFQUFFLElBQUksRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO0FBQ3ZILENBQUMsQ0FBQTtBQUVVLFFBQUEsV0FBVyxHQUFHLFVBQVMsR0FBVyxFQUFFLEdBQWlCO0lBQWlCLE9BQU8sYUFBTSxDQUFVLFVBQUEsSUFBSSxJQUFJLE9BQUEsVUFBQSxJQUFJO1FBQ2xILE9BQUEsQ0FBQyxXQUFJLENBQVUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFBeEMsQ0FBd0MsRUFEc0UsQ0FDdEUsQ0FBQyxDQUFBO0FBQUMsQ0FBQyxDQUFBO0FBRWxDLFFBQUEsYUFBYSxHQUFHLFVBQVksS0FBWSxFQUFFLENBQUcsRUFBRSxDQUFVLEVBQUUsR0FBVyxFQUFFLFNBQWlCO0lBQ2xHLE9BQU8sYUFBTSxDQUFPLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBQSxDQUFDO1FBQ25DLE9BQUEsbUJBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBQSxDQUFDO1lBQy9CLE9BQUEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQWhCLENBQWdCLEVBQUUsU0FBUyxDQUFDLENBQUMsTUFBTSxFQUFFO0lBRHJDLENBQ3FDLENBQUMsQ0FBQTtBQUNqRCxDQUFDLENBQUEifQ==