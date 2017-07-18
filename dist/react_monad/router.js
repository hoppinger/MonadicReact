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
    return React.createElement(Application, { mode: mode, base_url: base_url, slug: slug, routes: routes });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlYWN0X21vbmFkL3JvdXRlci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2QkFBOEI7QUFJOUIsaUNBQWtDO0FBRWxDLCtCQUE0RTtBQUM1RSwrQkFBNkI7QUFJbEIsUUFBQSxTQUFTLEdBQUcsVUFBK0IsUUFBdUI7SUFDM0UsTUFBTSxDQUFDLFVBQUEsR0FBRztRQUNSLElBQUksR0FBRyxHQUFTLEVBQUUsQ0FBQTtRQUNsQixJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFLLENBQUE7UUFDaEUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDMUMsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3BCLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNuQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFLLENBQUE7WUFDckMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDbkIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUFDLE1BQU0sQ0FB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