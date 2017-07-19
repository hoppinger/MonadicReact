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
var core_1 = require("./core");
var html_1 = require("./html");
exports.parse_url = function (template) {
    return function (url) {
        var res = {};
        var url_items = url.split("/");
        if (url_items.length != template.length)
            return Option.none();
        for (var i = 0; i < url_items.length; i++) {
            var x = url_items[i];
            var y = template[i];
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
            var el = template[i];
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
        var initial_page = undefined;
        props.routes.forEach(function (r) {
            var p = r.url.in(props.slug).map(r.page);
            if (p.kind == "some") {
                initial_page = p.value;
                return false;
            }
            return true;
        });
        _this.state = { context: _this.context_from_props(_this.props, initial_page) };
        return _this;
    }
    Application.prototype.context_from_props = function (props, p) {
        var _this = this;
        var self = this;
        return {
            mode: props.mode,
            current_page: p,
            set_mode: function (new_mode, callback) {
                return core_1.make_C(function (ctxt) { return function (inner_callback) { return _this.setState(__assign({}, _this.state, { context: __assign({}, _this.state.context, { mode: new_mode }) }), function () { return inner_callback(callback)(null); }) || null; }; });
            },
            logic_frame: 0,
            force_reload: function (callback) {
                return core_1.make_C(function (ctxt) { return function (inner_callback) { return _this.setState(__assign({}, _this.state, { context: __assign({}, _this.state.context, { logic_frame: _this.state.context.logic_frame + 1 }) }), function () { return inner_callback(callback)(null); }) || null; }; });
            },
            set_page: function (x, new_page, callback) {
                window.history.pushState("", "", "" + self.props.base_url + new_page.url.out(x));
                var new_context = __assign({}, self.state.context, { current_page: new_page.page(x) });
                return core_1.make_C(function (ctxt) { return function (inner_callback) { return self.setState(__assign({}, self.state, { context: new_context }), function () { return inner_callback(callback)(null); }) || null; }; });
            },
            set_url: function (x, new_url, callback) {
                // console.log(self.props.base_url, new_url.out(x))
                window.history.pushState("", "", "" + self.props.base_url + new_url.out(x));
                return core_1.unit(null);
            }
        };
    };
    Application.prototype.render = function () {
        var _this = this;
        return React.createElement("div", { className: "monadic-application", key: "application@" + this.state.context.logic_frame }, this.state.context.current_page.comp(function () { return _this.state.context; })(function (callback) { return function (_) { return callback && callback(); }; }));
    };
    return Application;
}(React.Component));
exports.Application = Application;
exports.application = function (mode, base_url, slug, routes) {
    console.log("Calling application with", window.location.href, slug, base_url);
    return React.createElement(Application, { mode: mode, base_url: base_url, slug: slug, routes: Immutable.List(routes) });
};
exports.get_context = function (key, dbg) {
    return core_1.make_C(function (ctxt) { return function (cont) {
        return (core_1.unit(ctxt()).comp(ctxt)(cont));
    }; });
};
exports.link_to_route = function (label, x, r, key, className) {
    return html_1.button(label)(null).bind(key, function (_) {
        return exports.get_context().bind(undefined, function (c) {
            return c.set_page(x, r);
        }, className).ignore();
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlYWN0X21vbmFkL3JvdXRlci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2QkFBOEI7QUFFOUIscUNBQXNDO0FBRXRDLGlDQUFrQztBQUVsQywrQkFBNEU7QUFDNUUsK0JBQTZCO0FBSWxCLFFBQUEsU0FBUyxHQUFHLFVBQStCLFFBQXVCO0lBQzNFLE1BQU0sQ0FBQyxVQUFBLEdBQUc7UUFDUixJQUFJLEdBQUcsR0FBUyxFQUFFLENBQUE7UUFDbEIsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUM5QixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBSyxDQUFBO1FBQ2hFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzFDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNwQixJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDbkIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDMUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBSyxDQUFBO1lBQ3JDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQ25CLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztv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