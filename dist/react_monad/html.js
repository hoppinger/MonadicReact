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
        var span = React.createElement("span", null, this.props.text);
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
                    e.stopPropagation();
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