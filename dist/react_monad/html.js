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
var core_1 = require("./core");
var Label = /** @class */ (function (_super) {
    __extends(Label, _super);
    function Label(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { p: "creating" };
        return _this;
    }
    Label.prototype.componentWillReceiveProps = function (new_props) {
        this.props.debug_info && console.log("New props:", this.props.debug_info());
        this.setState(__assign({}, this.state, { p: new_props.p(new_props.value).comp(new_props.context)(function (callback) { return function (x) {
                return new_props.cont(callback)(x);
            }; }) }));
    };
    Label.prototype.componentWillMount = function () {
        var _this = this;
        this.setState(__assign({}, this.state, { p: this.props.p(this.props.value).comp(this.props.context)(function (callback) { return function (x) {
                return _this.props.cont(callback)(x);
            }; }) }));
    };
    Label.prototype.render = function () {
        var content = this.state.p == "creating" ? null : this.state.p;
        var span = React.createElement("span", { key: "label_span" }, this.props.text);
        return React.createElement("label", { className: this.props.className }, this.props.span_before_content ? [span, content] : [content, span]);
    };
    return Label;
}(React.Component));
function label(text, span_before_content, className, key, dbg) {
    return function (p) { return function (value) { return core_1.make_C(function (ctxt) { return function (cont) {
        return (React.createElement(Label, { kind: "label", className: className, debug_info: dbg, text: text, span_before_content: span_before_content, value: value, p: p, context: ctxt, cont: cont, key: key }));
    }; }); }; };
}
exports.label = label;
var H1 = /** @class */ (function (_super) {
    __extends(H1, _super);
    function H1(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { p: "creating" };
        return _this;
    }
    H1.prototype.componentWillReceiveProps = function (new_props) {
        this.props.debug_info && console.log("New props:", this.props.debug_info());
        this.setState(__assign({}, this.state, { p: new_props.p(new_props.value).comp(new_props.context)(function (callback) { return function (x) {
                return new_props.cont(callback)(x);
            }; }) }));
    };
    H1.prototype.componentWillMount = function () {
        var _this = this;
        this.setState(__assign({}, this.state, { p: this.props.p(this.props.value).comp(this.props.context)(function (callback) { return function (x) {
                return _this.props.cont(callback)(x);
            }; }) }));
    };
    H1.prototype.render = function () {
        var content = this.state.p == "creating" ? null : this.state.p;
        var span = React.createElement("span", null, this.props.text);
        return React.createElement("div", { className: this.props.className },
            React.createElement("h1", null, span),
            content);
    };
    return H1;
}(React.Component));
function h1(text, className, key, dbg) {
    return function (p) { return function (value) { return core_1.make_C(function (ctxt) { return function (cont) {
        return (React.createElement(H1, { kind: "h1", className: className, debug_info: dbg, text: text, value: value, p: p, context: ctxt, cont: cont, key: key }));
    }; }); }; };
}
exports.h1 = h1;
var H2 = /** @class */ (function (_super) {
    __extends(H2, _super);
    function H2(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { p: "creating" };
        return _this;
    }
    H2.prototype.componentWillReceiveProps = function (new_props) {
        this.props.debug_info && console.log("New props:", this.props.debug_info());
        this.setState(__assign({}, this.state, { p: new_props.p(new_props.value).comp(new_props.context)(function (callback) { return function (x) {
                return new_props.cont(callback)(x);
            }; }) }));
    };
    H2.prototype.componentWillMount = function () {
        var _this = this;
        this.setState(__assign({}, this.state, { p: this.props.p(this.props.value).comp(this.props.context)(function (callback) { return function (x) {
                return _this.props.cont(callback)(x);
            }; }) }));
    };
    H2.prototype.render = function () {
        var content = this.state.p == "creating" ? null : this.state.p;
        var span = React.createElement("span", null, this.props.text);
        return React.createElement("div", { className: this.props.className },
            React.createElement("h2", null, span),
            content);
    };
    return H2;
}(React.Component));
function h2(text, className, key, dbg) {
    return function (p) { return function (value) { return core_1.make_C(function (ctxt) { return function (cont) {
        return (React.createElement(H2, { kind: "h2", className: className, debug_info: dbg, text: text, value: value, p: p, context: ctxt, cont: cont, key: key }));
    }; }); }; };
}
exports.h2 = h2;
var Div = /** @class */ (function (_super) {
    __extends(Div, _super);
    function Div(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { p: "creating" };
        return _this;
    }
    Div.prototype.componentWillReceiveProps = function (new_props) {
        this.props.debug_info && console.log("New props:", this.props.debug_info());
        this.setState(__assign({}, this.state, { p: new_props.p(new_props.value).comp(new_props.context)(function (callback) { return function (x) {
                return new_props.cont(callback)(x);
            }; }) }));
    };
    Div.prototype.componentWillMount = function () {
        var _this = this;
        this.setState(__assign({}, this.state, { p: this.props.p(this.props.value).comp(this.props.context)(function (callback) { return function (x) {
                return _this.props.cont(callback)(x);
            }; }) }));
    };
    Div.prototype.render = function () {
        return React.createElement("div", { className: this.props.className }, this.state.p != "creating" ? this.state.p : []);
    };
    return Div;
}(React.Component));
function div(className, key, dbg) {
    return function (p) { return function (value) { return core_1.make_C(function (ctxt) { return function (cont) {
        return (React.createElement(Div, { kind: "div", className: className, debug_info: dbg, value: value, p: p, context: ctxt, cont: cont, key: key }));
    }; }); }; };
}
exports.div = div;
function overlay(key, dbg) {
    return function (p) { return div("overlay")(div("overlay__item")(p)); };
}
exports.overlay = overlay;
var Form = /** @class */ (function (_super) {
    __extends(Form, _super);
    function Form(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { p: "creating" };
        return _this;
    }
    Form.prototype.componentWillReceiveProps = function (new_props) {
        this.props.debug_info && console.log("New props:", this.props.debug_info());
        this.setState(__assign({}, this.state, { p: new_props.p(new_props.value).comp(new_props.context)(function (callback) { return function (x) {
                return new_props.cont(callback)(x);
            }; }) }));
    };
    Form.prototype.componentWillMount = function () {
        var _this = this;
        this.setState(__assign({}, this.state, { p: this.props.p(this.props.value).comp(this.props.context)(function (callback) { return function (x) {
                return _this.props.cont(callback)(x);
            }; }) }));
    };
    Form.prototype.render = function () {
        return React.createElement("form", { className: this.props.className }, this.state.p != "creating" ? this.state.p : []);
    };
    return Form;
}(React.Component));
function form(className, key, dbg) {
    return function (p) { return function (value) { return core_1.make_C(function (ctxt) { return function (cont) {
        return (React.createElement(Form, { kind: "form", className: className, debug_info: dbg, value: value, p: p, context: ctxt, cont: cont, key: key }));
    }; }); }; };
}
exports.form = form;
var Selector = /** @class */ (function (_super) {
    __extends(Selector, _super);
    function Selector(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { selected: props.selected_item != undefined ? props.items.findIndex(function (i) { return props.to_string(i) == props.to_string(props.selected_item); }) : undefined };
        return _this;
    }
    Selector.prototype.componentWillMount = function () {
        if (this.props.selected_item != undefined)
            this.props.cont(function () { return null; })(this.props.selected_item);
    };
    Selector.prototype.render = function () {
        var _this = this;
        if (this.props.type == "dropdown")
            return React.createElement("select", { value: this.state.selected == undefined ? "-1" : this.state.selected.toString(), onChange: function (e) {
                    if (e.currentTarget.value == "-1") {
                        _this.setState(__assign({}, _this.state, { selected: undefined }));
                        return;
                    }
                    var selected_index = parseInt(e.currentTarget.value);
                    var selected = _this.props.items.get(selected_index);
                    _this.setState(__assign({}, _this.state, { selected: selected_index }), function () { return _this.props.cont(function () { })(selected); });
                } },
                React.createElement("option", { value: "-1" }),
                this.props.items.map(function (i, i_index) {
                    var i_s = _this.props.to_string(i);
                    return React.createElement("option", { key: i_s, value: i_index }, i_s);
                }));
        else if (this.props.type == "radio") {
            return React.createElement("form", null, this.props.items.map(function (i, i_index) {
                var i_s = _this.props.to_string(i);
                return React.createElement("div", { key: i_s },
                    React.createElement("label", null,
                        i_s,
                        React.createElement("input", { key: i_s, name: name, type: "radio", checked: i_index == _this.state.selected, onChange: function (e) {
                                if (e.currentTarget.checked == false)
                                    return;
                                var selected = _this.props.items.get(i_index);
                                _this.setState(__assign({}, _this.state, { selected: i_index }), function () {
                                    return _this.props.cont(function () { })(selected);
                                });
                            } })));
            }));
        }
        else {
            return [];
        }
    };
    return Selector;
}(React.Component));
exports.selector = function (type, to_string, key, dbg) {
    return function (items, selected_item) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Selector, { kind: "selector", debug_info: dbg, items: Immutable.List(items), selected_item: selected_item, type: type, to_string: to_string, context: ctxt, cont: cont, key: key });
    }; }); };
};
var MultiSelector = /** @class */ (function (_super) {
    __extends(MultiSelector, _super);
    function MultiSelector(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { selected: Immutable.Set(props.selected_items != undefined ?
                props.items.map(function (i, i_index) { return [props.to_string(i), i_index]; })
                    .filter(function (x) { return props.selected_items.some(function (selected) { return props.to_string(selected) == x[0]; }); })
                    .map(function (x) { return x[1]; })
                    .toArray()
                :
                    []) };
        return _this;
    }
    MultiSelector.prototype.componentWillMount = function () {
        var _this = this;
        if (this.props.selected_items != undefined)
            this.props.cont(function () { return null; })(this.state.selected.map(function (index) { return _this.props.items.get(index); }).toArray());
    };
    MultiSelector.prototype.render = function () {
        var _this = this;
        if (this.props.type == "list") {
            return React.createElement("select", { value: this.state.selected.map(function (index) { return index.toString(); }).toArray(), multiple: true, onChange: function (e) {
                    var options = e.currentTarget.options;
                    var selection = Immutable.Set();
                    for (var i = 0, l = options.length; i < l; i++) {
                        if (options[i].selected) {
                            var index = parseInt(options[i].value);
                            selection = selection.add(index);
                        }
                    }
                    _this.setState(__assign({}, _this.state, { selected: selection }), function () {
                        return _this.props.cont(function () { })(selection.map(function (index) { return _this.props.items.get(index); }).toArray());
                    });
                } }, this.props.items.map(function (i, i_index) {
                var i_s = _this.props.to_string(i);
                return React.createElement("option", { key: i_s, value: i_index }, i_s);
            }));
        }
        else if (this.props.type == "checkbox") {
            return React.createElement("form", null, this.props.items.map(function (i, i_index) {
                var i_s = _this.props.to_string(i);
                return React.createElement("div", { key: i_s },
                    React.createElement("label", null,
                        React.createElement("input", { key: i_s, type: "checkbox", checked: _this.state.selected.has(i_index), className: "monadic-input-choices monadic-input-choices--checkbox", onChange: function (e) {
                                var selected = _this.props.items.get(i_index);
                                var selection = e.currentTarget.checked ? _this.state.selected.add(i_index) : _this.state.selected.remove(i_index);
                                _this.setState(__assign({}, _this.state, { selected: selection }), function () { return _this.props.cont(function () { })(selection.map(function (index) { return _this.props.items.get(index); }).toArray()); });
                            } }),
                        React.createElement("span", null, i_s)));
            }));
        }
        else {
            return null;
        }
    };
    return MultiSelector;
}(React.Component));
exports.multi_selector = function (type, to_string, key, dbg) {
    return function (items, selected_items) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(MultiSelector, { kind: "multi selector",
            debug_info: dbg,
            items: Immutable.List(items),
            selected_items: selected_items ? Immutable.List(selected_items) : Immutable.List(),
            type: type,
            to_string: to_string,
            cont: cont,
            context: ctxt,
            key: key });
    }; }); };
};
var Image = /** @class */ (function (_super) {
    __extends(Image, _super);
    function Image(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { src: props.src };
        return _this;
    }
    Image.prototype.componentWillReceiveProps = function (new_props) {
        if (new_props.src != this.state.src)
            this.setState(__assign({}, this.state, { src: new_props.src }));
    };
    Image.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null,
            React.createElement("img", { src: this.state.src }),
            this.props.mode == "edit" ?
                React.createElement("div", { className: "image-controls" },
                    React.createElement("a", { className: "user button button--delete", onClick: function () {
                            if (confirm('Are you sure?')) {
                                var new_value_1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j//z8ABf4C/qc1gYQAAAAASUVORK5CYII=";
                                _this.setState(__assign({}, _this.state, { src: new_value_1 }), function () {
                                    return _this.props.cont(function () { return null; })(new_value_1);
                                });
                            }
                        } }),
                    React.createElement("input", { type: "file", accept: "image/*", onChange: function (e) {
                            var files = e.target.files;
                            var file_reader = new FileReader();
                            file_reader.onload = (function (e) {
                                var new_value = file_reader.result;
                                _this.setState(__assign({}, _this.state, { src: new_value }), function () {
                                    return _this.props.cont(function () { return null; })(new_value);
                                });
                            });
                            file_reader.readAsDataURL(files[0]);
                        } }))
                :
                    []);
    };
    return Image;
}(React.Component));
exports.image = function (mode, key, dbg) { return function (src) {
    return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Image, { kind: "image", debug_info: dbg, mode: mode, src: src, context: ctxt, cont: cont, key: key });
    }; });
}; };
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { x: props.x };
        return _this;
    }
    Button.prototype.componentWillReceiveProps = function (new_props) {
        this.setState(__assign({}, this.state, { x: new_props.x }));
    };
    Button.prototype.render = function () {
        var _this = this;
        return this.props.kind == "a" ?
            React.createElement("a", { href: this.props.href, rel: this.props.rel || "", className: "" + (this.props.className ? this.props.className : "") + (this.props.disabled ? " disabled" : ""), onClick: function (e) {
                    _this.props.cont(function () { })(_this.state.x);
                    e.preventDefault();
                    return false;
                } }, this.props.label)
            :
                React.createElement("button", { type: "button", className: "button " + (this.props.className ? this.props.className : ""), disabled: this.props.disabled, onClick: function () { return _this.props.cont(function () { })(_this.state.x); } }, this.props.label);
    };
    return Button;
}(React.Component));
exports.a = function (label, href, rel, disabled, key, className, dbg) {
    return function (x) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Button, { kind: "a", debug_info: dbg, label: label, href: href || "#", rel: rel, disabled: !!disabled, x: x, context: ctxt, cont: cont, key: key, className: className });
    }; }); };
};
exports.button = function (label, disabled, key, className, dbg) {
    return function (x) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Button, { kind: "button", debug_info: dbg, label: label, disabled: !!disabled, x: x, context: ctxt, cont: cont, key: key, className: className });
    }; }); };
};
var Link = /** @class */ (function (_super) {
    __extends(Link, _super);
    function Link(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = {};
        return _this;
    }
    Link.prototype.render = function () {
        return React.createElement("a", { href: this.props.url, className: (this.props.className || "") + " " + (this.props.disabled ? "disabled" : "") }, this.props.label);
    };
    return Link;
}(React.Component));
exports.link = function (label, url, disabled, key, className, dbg) {
    return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Link, { kind: "link", debug_info: dbg, label: label, url: url, disabled: !!disabled, context: ctxt, cont: cont, key: key, className: className });
    }; });
};
var FileComponent = /** @class */ (function (_super) {
    __extends(FileComponent, _super);
    function FileComponent(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = {};
        return _this;
    }
    FileComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null,
            React.createElement("span", null,
                React.createElement("a", { href: this.props.url }, this.props.label)),
            this.props.mode == "view"
                ? []
                : React.createElement("input", { disabled: this.props.disabled, type: "file", onChange: function (e) {
                        var files = e.target.files;
                        var f = files[0];
                        _this.props.cont(function () { })(f);
                    } }));
    };
    return FileComponent;
}(React.Component));
exports.file = function (mode, label, url, disabled, key, dbg) {
    return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(FileComponent, { kind: "file", mode: mode, debug_info: dbg, label: label, url: url, disabled: !!disabled, context: ctxt, cont: cont, key: key });
    }; });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdF9tb25hZC9odG1sLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZCQUE4QjtBQUU5QixxQ0FBc0M7QUFDdEMsK0JBQW1FO0FBa0JuRTtJQUF5Qix5QkFBZ0Q7SUFDdkUsZUFBWSxLQUFxQixFQUFDLE9BQVc7UUFBN0MsWUFDRSxrQkFBTSxLQUFLLEVBQUUsT0FBTyxDQUFDLFNBRXRCO1FBREMsS0FBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBQyxVQUFVLEVBQUUsQ0FBQTs7SUFDL0IsQ0FBQztJQUNELHlDQUF5QixHQUF6QixVQUEwQixTQUF5QjtRQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7UUFDM0UsSUFBSSxDQUFDLFFBQVEsY0FBSyxJQUFJLENBQUMsS0FBSyxJQUFFLENBQUMsRUFBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsVUFBQSxDQUFDO2dCQUN6RSxPQUFBLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQTNCLENBQTJCLEVBRDZDLENBQzdDLENBQUMsSUFBRSxDQUFBO0lBQ3pELENBQUM7SUFDRCxrQ0FBa0IsR0FBbEI7UUFBQSxpQkFHQztRQUZDLElBQUksQ0FBQyxRQUFRLGNBQUssSUFBSSxDQUFDLEtBQUssSUFBRSxDQUFDLEVBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFB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