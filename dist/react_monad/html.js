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
        _this.state = { p: "creating", ps: "creating" };
        return _this;
    }
    Div.prototype.componentWillReceiveProps = function (new_props) {
        this.props.debug_info && console.log("New props:", this.props.debug_info());
        this.setState(__assign({}, this.state, { p: new_props.p(new_props.value).comp(new_props.context)(function (callback) { return function (x) {
                return new_props.cont(callback)(x);
            }; }), ps: new_props.ps.map(function (p) { return p(new_props.value).comp(new_props.context)(function (callback) { return function (x) { }; }); }) }));
    };
    Div.prototype.componentWillMount = function () {
        var _this = this;
        this.setState(__assign({}, this.state, { p: this.props.p(this.props.value).comp(this.props.context)(function (callback) { return function (x) {
                return _this.props.cont(callback)(x);
            }; }), ps: this.props.ps.map(function (p) { return p(_this.props.value).comp(_this.props.context)(function (callback) { return function (x) { }; }); }) }));
    };
    Div.prototype.render = function () {
        return React.createElement("div", { className: this.props.className },
            this.state.ps != "creating" ? this.state.ps : null,
            this.state.p != "creating" ? this.state.p : null);
    };
    return Div;
}(React.Component));
function div(className, key, dbg) {
    return function (ps) { return function (p) { return function (value) { return core_1.make_C(function (ctxt) { return function (cont) {
        return (React.createElement(Div, { kind: "div", className: className, debug_info: dbg, value: value, ps: ps, p: p, context: ctxt, cont: cont, key: key }));
    }; }); }; }; };
}
exports.div = div;
function overlay(key, dbg) {
    return function (ps) { return function (p) { return div("overlay")([])(div("overlay__item")(ps)(p)); }; };
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
        return React.createElement(Selector, { kind: "selector", debug_info: dbg, items: items, selected_item: selected_item, type: type, to_string: to_string, context: ctxt, cont: cont, key: key });
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
            this.props.cont(function () { return null; })(this.state.selected.map(function (index) { return _this.props.items.get(index); }).toList());
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
                        return _this.props.cont(function () { })(selection.map(function (index) { return _this.props.items.get(index); }).toList());
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
                                _this.setState(__assign({}, _this.state, { selected: selection }), function () { return _this.props.cont(function () { })(selection.map(function (index) { return _this.props.items.get(index); }).toList()); });
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
            items: items,
            selected_items: selected_items,
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
        return this.props.type == "a" ?
            React.createElement("a", { className: "" + (this.props.className ? this.props.className : "") + (this.props.disabled ? " disabled" : ""), onClick: function () { return _this.props.cont(function () { })(_this.state.x); } }, this.props.label)
            :
                React.createElement("button", { type: "button", className: "button " + (this.props.className ? this.props.className : ""), disabled: this.props.disabled, onClick: function () { return _this.props.cont(function () { })(_this.state.x); } }, this.props.label);
    };
    return Button;
}(React.Component));
exports.a = function (label, disabled, key, className, dbg) {
    return function (x) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Button, { kind: "button", debug_info: dbg, label: label, type: "a", disabled: !!disabled, x: x, context: ctxt, cont: cont, key: key, className: className });
    }; }); };
};
exports.button = function (label, disabled, key, className, dbg) {
    return function (x) { return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Button, { kind: "button", debug_info: dbg, label: label, type: "button", disabled: !!disabled, x: x, context: ctxt, cont: cont, key: key, className: className });
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
        return React.createElement("a", { href: this.props.url, className: "button " + (this.props.disabled ? "disabled" : "") }, this.props.label);
    };
    return Link;
}(React.Component));
exports.link = function (label, url, disabled, key, dbg) {
    return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Link, { kind: "link", debug_info: dbg, label: label, url: url, disabled: !!disabled, context: ctxt, cont: cont, key: key });
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