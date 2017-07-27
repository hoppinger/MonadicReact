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
                    _this.setState(__assign({}, _this.state, { value: new_value }), function () { return _this.props.cont(function () { return null; })(_this.state.value); });
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
                _this.setState(__assign({}, _this.state, { value: e.currentTarget.value }), function () { return _this.call_cont(_this.state.value); });
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
                    return _this.setState(__assign({}, _this.state, { value: e.currentTarget.checked }), function () { return _this.props.cont(function () { return null; })(_this.state.value); });
                } })
            : this.props.style == "plus/minus" ?
                React.createElement("input", { type: "checkbox", className: "monadic-input-choices monadic-input-choices--toggle", disabled: this.props.mode == "view", checked: this.state.value, onChange: function (e) {
                        return _this.setState(__assign({}, _this.state, { value: e.currentTarget.checked }), function () { return _this.props.cont(function () { return null; })(_this.state.value); });
                    } })
                :
                    React.createElement("input", { type: this.props.style, className: "monadic-input-choices monadic-input-choices--checkbox", disabled: this.props.mode == "view", checked: this.state.value, onChange: function (e) {
                            return _this.setState(__assign({}, _this.state, { value: e.currentTarget.checked }), function () { return _this.props.cont(function () { return null; })(_this.state.value); });
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
                    return _this.setState(__assign({}, _this.state, { value: Moment.utc(e.currentTarget.value) }), function () {
                        return _this.call_cont(_this.state.value);
                    });
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
                    return _this.setState(__assign({}, _this.state, { value: Moment.utc(new Date(e.currentTarget.value)).startOf('d').add(12, 'h') }), function () {
                        return _this.call_cont(_this.state.value);
                    });
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
                    return _this.setState(__assign({}, _this.state, { value: Moment.utc(new Date(e.currentTarget.valueAsDate)) }), function () {
                        return _this.call_cont(_this.state.value);
                    });
                } });
    };
    return Time;
}(React.Component));
exports.time = function (mode, key, dbg) { return function (value) {
    return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Time, { kind: "time", debug_info: dbg, mode: mode, value: value, context: ctxt, cont: cont, key: key });
    }; });
}; };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbWl0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdF9tb25hZC9wcmltaXRpdmVzLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZCQUE4QjtBQUU5QixxQ0FBc0M7QUFDdEMsK0JBQWdDO0FBQ2hDLCtCQUFtRTtBQUVuRSxvQkFBb0IsR0FBVSxFQUFFLE1BQWE7SUFDekMsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsRSxDQUFDO0FBWUQ7SUFBcUIsMEJBQXFDO0lBQ3hELGdCQUFZLEtBQWlCLEVBQUMsT0FBVztRQUF6QyxZQUNFLGlCQUFPLFNBRVI7UUFEQyxLQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsS0FBSyxFQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQTs7SUFDcEMsQ0FBQztJQUNELDBDQUF5QixHQUF6QixVQUEwQixTQUFxQjtRQUEvQyxpQkFHQztRQUZDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDdEMsSUFBSSxDQUFDLFFBQVEsY0FBSyxJQUFJLENBQUMsS0FBSyxJQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSyxLQUFHLGNBQU0sT0FBQSxLQUFJLENBQUMsU0FBUyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQWhDLENBQWdDLENBQUMsQ0FBQTtJQUNsRyxDQUFDO0lBQ0QsbUNBQWtCLEdBQWxCO1FBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2xDLENBQUM7SUFDRCwwQkFBUyxHQUFULFVB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