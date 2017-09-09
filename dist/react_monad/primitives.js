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
var Moment = require("moment");
var core_1 = require("./core");
function format_int(num, length) {
    return (num / Math.pow(10, length)).toFixed(length).substr(2);
}
var Number = (function (_super) {
    __extends(Number, _super);
    function Number(props, context) {
        var _this = _super.call(this) || this;
        _this.state = { value: props.value };
        return _this;
    }
    Number.prototype.componentWillReceiveProps = function (new_props) {
        var _this = this;
        if (new_props.value != this.state.value)
            this.setState(__assign({}, this.state, { value: new_props.value }), function () { return _this.call_cont(_this.state.value); });
    };
    Number.prototype.componentWillMount = function () {
        this.call_cont(this.state.value);
    };
    Number.prototype.call_cont = function (value) {
        this.props.cont(function () { return null; })(value);
    };
    Number.prototype.render = function () {
        var _this = this;
        return this.props.mode == "edit" ?
            React.createElement("input", { type: "number", value: this.state.value, onChange: function (e) {
                    var new_value = isNaN(e.currentTarget.valueAsNumber) ? 0 : e.currentTarget.valueAsNumber;
                    if (new_value == _this.state.value)
                        return;
                    _this.props.cont(function () { return null; })(new_value);
                } })
            :
                React.createElement("span", null, this.state.value);
    };
    return Number;
}(React.Component));
exports.number = function (mode, key, dbg) { return function (value) {
    return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Number, { kind: "number", debug_info: dbg, mode: mode, value: value, context: ctxt, cont: cont, key: key });
    }; });
}; };
var String = (function (_super) {
    __extends(String, _super);
    function String(props, context) {
        var _this = _super.call(this) || this;
        _this.state = { value: props.value };
        return _this;
    }
    String.prototype.componentWillReceiveProps = function (new_props) {
        var _this = this;
        if (new_props.value != this.state.value)
            this.setState(__assign({}, this.state, { value: new_props.value }), function () { return _this.call_cont(_this.state.value); });
    };
    String.prototype.componentWillMount = function () {
        this.call_cont(this.state.value);
    };
    String.prototype.call_cont = function (value) {
        this.props.cont(function () { return null; })(value);
    };
    String.prototype.render = function () {
        var _this = this;
        return this.props.mode == "edit" ? React.createElement("input", { type: this.props.type, value: this.state.value, onChange: function (e) {
                if (_this.state.value == e.currentTarget.value)
                    return;
                _this.call_cont(e.currentTarget.value);
            } })
            :
                this.props.type == "text" ?
                    React.createElement("span", null, this.state.value)
                    : this.props.type == "tel" ?
                        React.createElement("a", { href: "tel:" + this.state.value }, this.state.value)
                        : this.props.type == "email" ?
                            React.createElement("a", { href: "mailto:" + this.state.value }, this.state.value)
                            : this.props.type == "url" ?
                                React.createElement("a", { href: this.state.value }, this.state.value)
                                : this.props.type == "password" ?
                                    React.createElement("span", null, Immutable.Repeat("*", this.state.value.length).join(""))
                                    :
                                        React.createElement("span", null, this.state.value);
    };
    return String;
}(React.Component));
exports.string = function (mode, type, key, dbg) { return function (value) {
    return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(String, { kind: "string", debug_info: dbg, type: type || "text", mode: mode, value: value, context: ctxt, cont: cont, key: key });
    }; });
}; };
var Bool = (function (_super) {
    __extends(Bool, _super);
    function Bool(props, context) {
        var _this = _super.call(this) || this;
        _this.state = { value: props.value };
        return _this;
    }
    Bool.prototype.componentWillReceiveProps = function (new_props) {
        var _this = this;
        if (new_props.value != this.state.value)
            this.setState(__assign({}, this.state, { value: new_props.value }), function () { return _this.call_cont(_this.state.value); });
    };
    Bool.prototype.componentWillMount = function () {
        this.call_cont(this.state.value);
    };
    Bool.prototype.call_cont = function (value) {
        this.props.cont(function () { return null; })(value);
    };
    Bool.prototype.render = function () {
        var _this = this;
        return this.props.style == "fancy toggle" ?
            React.createElement("input", { type: "checkbox", className: "monadic-input-choices monadic-input-choices--switch", disabled: this.props.mode == "view", checked: this.state.value, onChange: function (e) {
                    return _this.props.cont(function () { return null; })(e.currentTarget.checked);
                } })
            : this.props.style == "plus/minus" ?
                React.createElement("input", { type: "checkbox", className: "monadic-input-choices monadic-input-choices--toggle", disabled: this.props.mode == "view", checked: this.state.value, onChange: function (e) {
                        return _this.props.cont(function () { return null; })(e.currentTarget.checked);
                    } })
                :
                    React.createElement("input", { type: this.props.style, className: "monadic-input-choices monadic-input-choices--checkbox", disabled: this.props.mode == "view", checked: this.state.value, onChange: function (e) {
                            return _this.props.cont(function () { return null; })(e.currentTarget.checked);
                        } });
    };
    return Bool;
}(React.Component));
exports.bool = function (mode, style, key, dbg) { return function (value) {
    return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Bool, { kind: "bool", debug_info: dbg, style: style, mode: mode, value: value, context: ctxt, cont: cont, key: key });
    }; });
}; };
var DateTime = (function (_super) {
    __extends(DateTime, _super);
    function DateTime(props, context) {
        var _this = _super.call(this) || this;
        _this.state = { value: props.value };
        return _this;
    }
    DateTime.prototype.componentWillReceiveProps = function (new_props) {
        var _this = this;
        if (new_props.value != this.state.value)
            this.setState(__assign({}, this.state, { value: new_props.value }), function () { return _this.call_cont(_this.state.value); });
    };
    DateTime.prototype.componentWillMount = function () {
        this.call_cont(this.state.value);
    };
    DateTime.prototype.call_cont = function (value) {
        this.props.cont(function () { return null; })(value);
    };
    DateTime.prototype.render = function () {
        var _this = this;
        var item = this.state.value;
        var default_value = format_int(item.year(), 4) + "-" + format_int(item.month() + 1, 2) + "-" + format_int(item.date(), 2) + "T" + format_int(item.hours(), 2) + ":" + format_int(item.minutes(), 2);
        return this.props.mode == "view" ?
            React.createElement("div", null, format_int(item.date(), 2) + "/" + format_int(item.month() + 1, 2) + "/" + format_int(item.year(), 4) + "  " + format_int(item.hours(), 2) + ":" + format_int(item.minutes(), 2))
            : React.createElement("input", { type: "datetime-local", value: default_value, onChange: function (e) {
                    return _this.call_cont(Moment.utc(e.currentTarget.value));
                } });
    };
    return DateTime;
}(React.Component));
exports.date_time = function (mode, key, dbg) { return function (value) {
    return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(DateTime, { kind: "date time", debug_info: dbg, mode: mode, value: value, context: ctxt, cont: cont, key: key });
    }; });
}; };
var DateOnly = (function (_super) {
    __extends(DateOnly, _super);
    function DateOnly(props, context) {
        var _this = _super.call(this) || this;
        _this.state = { value: props.value };
        return _this;
    }
    DateOnly.prototype.componentWillReceiveProps = function (new_props) {
        var _this = this;
        if (new_props.value != this.state.value)
            this.setState(__assign({}, this.state, { value: new_props.value }), function () { return _this.call_cont(_this.state.value); });
    };
    DateOnly.prototype.componentWillMount = function () {
        this.call_cont(this.state.value);
    };
    DateOnly.prototype.call_cont = function (value) {
        this.props.cont(function () { return null; })(value);
    };
    DateOnly.prototype.render = function () {
        var _this = this;
        var item = this.state.value;
        var default_value = format_int(item.year(), 4) + "-" + format_int(item.month() + 1, 2) + "-" + format_int(item.date(), 2);
        return this.props.mode == "view" ?
            React.createElement("div", null, format_int(item.date(), 2) + "/" + format_int(item.month() + 1, 2) + "/" + format_int(item.year(), 4))
            : React.createElement("input", { type: "date", value: default_value, onChange: function (e) {
                    return _this.call_cont(Moment.utc(new Date(e.currentTarget.value)).startOf('d').add(12, 'h'));
                } });
    };
    return DateOnly;
}(React.Component));
exports.date = function (mode, key, dbg) { return function (value) {
    return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(DateOnly, { kind: "date", debug_info: dbg, mode: mode, value: value, context: ctxt, cont: cont, key: key });
    }; });
}; };
var Time = (function (_super) {
    __extends(Time, _super);
    function Time(props, context) {
        var _this = _super.call(this) || this;
        _this.state = { value: props.value };
        return _this;
    }
    Time.prototype.componentWillReceiveProps = function (new_props) {
        var _this = this;
        if (new_props.value != this.state.value)
            this.setState(__assign({}, this.state, { value: new_props.value }), function () { return _this.call_cont(_this.state.value); });
    };
    Time.prototype.componentWillMount = function () {
        this.call_cont(this.state.value);
    };
    Time.prototype.call_cont = function (value) {
        this.props.cont(function () { return null; })(value);
    };
    Time.prototype.render = function () {
        var _this = this;
        var item = this.state.value;
        var default_value = format_int(item.hours(), 2) + ":" + format_int(item.minutes(), 2);
        return this.props.mode == "view" ?
            React.createElement("div", null, default_value)
            : React.createElement("input", { type: "time", value: default_value, onChange: function (e) {
                    return _this.call_cont(Moment.utc(new Date(e.currentTarget.valueAsDate)));
                } });
    };
    return Time;
}(React.Component));
exports.time = function (mode, key, dbg) { return function (value) {
    return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Time, { kind: "time", debug_info: dbg, mode: mode, value: value, context: ctxt, cont: cont, key: key });
    }; });
}; };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbWl0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdF9tb25hZC9wcmltaXRpdmVzLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZCQUE4QjtBQUU5QixxQ0FBc0M7QUFDdEMsK0JBQWdDO0FBQ2hDLCtCQUFtRTtBQUVuRSxvQkFBb0IsR0FBVSxFQUFFLE1BQWE7SUFDekMsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsRSxDQUFDO0FBWUQ7SUFBcUIsMEJBQXdDO0lBQzNELGdCQUFZLEtBQWlCLEVBQUMsT0FBVztRQUF6QyxZQUNFLGlCQUFPLFNBRVI7UUFEQyxLQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsS0FBSyxFQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQTs7SUFDcEMsQ0FBQztJQUNELDBDQUF5QixHQUF6QixVQUEwQixTQUFxQjtRQUEvQyxpQkFHQztRQUZDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDdEMsSUFBSSxDQUFDLFFBQVEsY0FBSyxJQUFJLENBQUMsS0FBSyxJQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSyxLQUFHLGNBQU0sT0FBQSxLQUFJLENBQUMsU0FBUyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQWhDLENBQWdDLENBQUMsQ0FBQTtJQUNsRyxDQUFDO0lBQ0QsbUNBQWtCLEdBQWxCO1FBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2xDLENBQUM7SUFDRCwwQkFBUyxHQUFULFVB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