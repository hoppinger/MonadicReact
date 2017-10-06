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
var Label = (function (_super) {
    __extends(Label, _super);
    function Label(props, context) {
        var _this = _super.call(this) || this;
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
var H1 = (function (_super) {
    __extends(H1, _super);
    function H1(props, context) {
        var _this = _super.call(this) || this;
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
var H2 = (function (_super) {
    __extends(H2, _super);
    function H2(props, context) {
        var _this = _super.call(this) || this;
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
var Div = (function (_super) {
    __extends(Div, _super);
    function Div(props, context) {
        var _this = _super.call(this) || this;
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
        return React.createElement("div", { className: this.props.className }, this.state.p != "creating" ? this.state.p : null);
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
var Form = (function (_super) {
    __extends(Form, _super);
    function Form(props, context) {
        var _this = _super.call(this) || this;
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
        return React.createElement("form", { className: this.props.className }, this.state.p != "creating" ? this.state.p : null);
    };
    return Form;
}(React.Component));
function form(className, key, dbg) {
    return function (p) { return function (value) { return core_1.make_C(function (ctxt) { return function (cont) {
        return (React.createElement(Form, { kind: "form", className: className, debug_info: dbg, value: value, p: p, context: ctxt, cont: cont, key: key }));
    }; }); }; };
}
exports.form = form;
var Selector = (function (_super) {
    __extends(Selector, _super);
    function Selector(props, context) {
        var _this = _super.call(this) || this;
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
            return null;
        }
    };
    return Selector;
}(React.Component));
exports.selector = function (type, to_string, key, dbg) {
    return function (items, selected_item) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Selector, { kind: "selector", debug_info: dbg, items: Immutable.List(items), selected_item: selected_item, type: type, to_string: to_string, context: ctxt, cont: cont, key: key });
    }; }); };
};
var MultiSelector = (function (_super) {
    __extends(MultiSelector, _super);
    function MultiSelector(props, context) {
        var _this = _super.call(this) || this;
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
var Image = (function (_super) {
    __extends(Image, _super);
    function Image(props, context) {
        var _this = _super.call(this) || this;
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
                    null);
    };
    return Image;
}(React.Component));
exports.image = function (mode, key, dbg) { return function (src) {
    return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Image, { kind: "image", debug_info: dbg, mode: mode, src: src, context: ctxt, cont: cont, key: key });
    }; });
}; };
var Button = (function (_super) {
    __extends(Button, _super);
    function Button(props, context) {
        var _this = _super.call(this) || this;
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
var Link = (function (_super) {
    __extends(Link, _super);
    function Link(props, context) {
        var _this = _super.call(this) || this;
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
var FileComponent = (function (_super) {
    __extends(FileComponent, _super);
    function FileComponent(props, context) {
        var _this = _super.call(this) || this;
        _this.state = {};
        return _this;
    }
    FileComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null,
            React.createElement("span", null,
                React.createElement("a", { href: this.props.url }, this.props.label)),
            this.props.mode == "view" ?
                null
                :
                    React.createElement("input", { disabled: this.props.disabled, type: "file", onChange: function (e) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdF9tb25hZC9odG1sLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZCQUE4QjtBQUU5QixxQ0FBc0M7QUFDdEMsK0JBQW1FO0FBa0JuRTtJQUF5Qix5QkFBZ0Q7SUFDdkUsZUFBWSxLQUFxQixFQUFDLE9BQVc7UUFBN0MsWUFDRSxpQkFBTyxTQUVSO1FBREMsS0FBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBQyxVQUFVLEVBQUUsQ0FBQTs7SUFDL0IsQ0FBQztJQUNELHlDQUF5QixHQUF6QixVQUEwQixTQUF5QjtRQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7UUFDM0UsSUFBSSxDQUFDLFFBQVEsY0FBSyxJQUFJLENBQUMsS0FBSyxJQUFFLENBQUMsRUFBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsVUFBQSxDQUFDO2dCQUN6RSxPQUFBLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQTNCLENBQTJCLEVBRDZDLENBQzdDLENBQUMsSUFBRSxDQUFBO0lBQ3pELENBQUM7SUFDRCxrQ0FBa0IsR0FBbEI7UUFBQSxpQkFHQztRQUZDLElBQUksQ0FBQyxRQUFRLGNBQUssSUFBSSxDQUFDLEtBQUssSUFBRSxDQUFDLEVBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFP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