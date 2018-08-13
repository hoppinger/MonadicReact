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
var Number = /** @class */ (function (_super) {
    __extends(Number, _super);
    function Number(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { value: props.value };
        return _this;
    }
    Number.prototype.componentWillReceiveProps = function (new_props) {
        if (new_props.value != this.state.value)
            this.setState(__assign({}, this.state, { value: new_props.value })); //, () => this.call_cont(this.state.value))
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
var String = /** @class */ (function (_super) {
    __extends(String, _super);
    function String(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { value: props.value };
        return _this;
    }
    String.prototype.componentWillReceiveProps = function (new_props) {
        if (this.props.debug_info != undefined)
            console.log("receiving props", this.props.debug_info());
        if (new_props.value != this.state.value)
            this.setState(__assign({}, this.state, { value: new_props.value })); //, () => this.call_cont(new_props.value))
    };
    String.prototype.componentWillMount = function () {
        if (this.props.debug_info != undefined)
            console.log("mounting", this.props.debug_info());
        this.call_cont(this.state.value);
    };
    String.prototype.call_cont = function (value) {
        if (this.props.debug_info != undefined)
            console.log("calling continuation", this.props.debug_info());
        this.props.cont(function () { return null; })(value);
    };
    String.prototype.render = function () {
        var _this = this;
        if (this.props.debug_info != undefined)
            console.log("render", this.props.debug_info());
        return this.props.mode == "edit" ? React.createElement("input", { type: this.props.type, value: this.state.value, onChange: function (e) {
                if (_this.state.value == e.currentTarget.value)
                    return;
                _this.call_cont(e.currentTarget.value);
            }, size: this.props.optional_parameters.size != undefined ? this.props.optional_parameters.size : undefined, disabled: this.props.optional_parameters.disabled != undefined && this.props.optional_parameters.disabled })
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
exports.string = function (mode, type, key, dbg, optional_parameters) { return function (value) {
    return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(String, { kind: "string", debug_info: dbg, type: type || "text", mode: mode, value: value, context: ctxt, cont: cont, key: key, optional_parameters: optional_parameters == undefined || optional_parameters == null ? {} : optional_parameters });
    }; });
}; };
var Bool = /** @class */ (function (_super) {
    __extends(Bool, _super);
    function Bool(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { value: props.value };
        return _this;
    }
    Bool.prototype.componentWillReceiveProps = function (new_props) {
        if (new_props.value != this.state.value)
            this.setState(__assign({}, this.state, { value: new_props.value })); //, () => this.call_cont(this.state.value))
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
var DateTime = /** @class */ (function (_super) {
    __extends(DateTime, _super);
    function DateTime(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { value: props.value };
        return _this;
    }
    DateTime.prototype.componentWillReceiveProps = function (new_props) {
        if (new_props.value != this.state.value)
            this.setState(__assign({}, this.state, { value: new_props.value })); //, () => this.call_cont(this.state.value))
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
var DateOnly = /** @class */ (function (_super) {
    __extends(DateOnly, _super);
    function DateOnly(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { value: props.value };
        return _this;
    }
    DateOnly.prototype.componentWillReceiveProps = function (new_props) {
        if (new_props.value != this.state.value)
            this.setState(__assign({}, this.state, { value: new_props.value })); //, () => this.call_cont(this.state.value))
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
var Time = /** @class */ (function (_super) {
    __extends(Time, _super);
    function Time(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { value: props.value };
        return _this;
    }
    Time.prototype.componentWillReceiveProps = function (new_props) {
        if (new_props.value != this.state.value)
            this.setState(__assign({}, this.state, { value: new_props.value })); //, () => this.call_cont(this.state.value))
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
                    return _this.call_cont(Moment.utc(e.currentTarget.valueAsDate));
                } });
    };
    return Time;
}(React.Component));
exports.time = function (mode, key, dbg) { return function (value) {
    return core_1.make_C(function (ctxt) { return function (cont) {
        return React.createElement(Time, { kind: "time", debug_info: dbg, mode: mode, value: value, context: ctxt, cont: cont, key: key });
    }; });
}; };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbWl0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdF9tb25hZC9wcmltaXRpdmVzLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZCQUE4QjtBQUU5QixxQ0FBc0M7QUFDdEMsK0JBQWdDO0FBQ2hDLCtCQUFtRTtBQUVuRSxvQkFBb0IsR0FBVSxFQUFFLE1BQWE7SUFDekMsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsRSxDQUFDO0FBaUJEO0lBQXFCLDBCQUF3QztJQUMzRCxnQkFBWSxLQUFpQixFQUFDLE9BQVc7UUFBekMsWUFDRSxrQkFBTSxLQUFLLEVBQUUsT0FBTyxDQUFDLFNBRXRCO1FBREMsS0FBSSxDQUFDLEtBQUssR0FBRyxFQUFFLEtBQUssRUFBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUE7O0lBQ3BDLENBQUM7SUFDRCwwQ0FBeUIsR0FBekIsVUFBMEIsU0FBcUI7UUFDN0MsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUN0QyxJQUFJLENBQUMsUUFBUSxjQUFLLElBQUksQ0FBQyxLQUFLLElBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLLElBQUUsQ0FBQSxDQUFDLDJDQUEyQztJQUN0RyxDQUFDO0lBQ0QsbUNBQWtCLEdBQWxCO1FBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2xDLENBQUM7SUFDRCwwQkFBUyxHQUFULFVBQVUsS0FBWTtRQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFJLE9BQUEsSUFBSSxFQUFKLENBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2xDLENBQUM7SUFDRCx1QkFBTSxHQUFOO1FBQUEsaUJBV0M7UUFWQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLENBQUM7WUFDOUIsK0JBQU8sSUFBSSxFQUFDLFFBQVEsRUFDbEIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUN2QixRQUFRLEVBQUUsVUFBQSxDQUFDO29CQUNULElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFBO29CQUN4RixFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksS0FBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7d0JBQUMsTUFBTSxDQUFBO29CQUN6QyxLQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFJLE9BQUEsSUFBSSxFQUFKLENBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFBO2dCQUFBLENBQUMsR0FDdEM7WUFDTCxDQUFDO2dCQUNDLGtDQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFRLENBQUE7SUFDckMsQ0FBQztJQUNILGFBQUM7QUFBRCxDQUFDLEFBM0JELENBQXFCLEtBQUssQ0FBQyxTQUFTLEdBMkJuQztBQUVVLFFBQUEsTUFBTSxHQUFHLFVBQUMsSUFBUyxFQUFFLEdBQVcsRUFBRSxHQUFpQixJQUFLLE9BQUEsVUFBUyxLQUFZO0lBQ3RGLE1BQU0sQ0FBQyxhQUFNLENBQVMsVUFBQSxJQUFJLElBQUksT0FBQSxVQUFBLElBQUk7UUFDaEMsT0FBQSxLQUFLLENBQUMsYUFBYSxDQUFjLE1BQU0sRUFDdkMsRUFBRSxJQUFJLEVBQUMsUUFBUSxFQUFFLFVBQVUsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUMsR0FBRyxFQUFFLENBQUM7SUFENUYsQ0FDNEYsRUFGaEUsQ0FFZ0UsQ0FBQyxDQUFBO0FBQ2pHLENBQUMsRUFKa0UsQ0FJbEUsQ0FBQTtBQUdEO0lBQXFCLDBCQUF3QztJQUMzRCxnQkFBWSxLQUFpQixFQUFDLE9BQVc7UUFBekMsWUFDRSxrQkFBTSxLQUFLLEVBQUUsT0FBTyxDQUFDLFNBRXRCO1FBREMsS0FBSSxDQUFDLEtBQUssR0FBRyxFQUFFLEtBQUssRUFBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUE7O0lBQ3BDLENBQUM7SUFDRCwwQ0FBeUIsR0FBekIsVUFBMEIsU0FBcUI7UUFDN0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksU0FBUyxDQUFDO1lBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7UUFDL0YsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUN0QyxJQUFJLENBQUMsUUFBUSxjQUFLLElBQUksQ0FBQyxLQUFLLElBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLLElBQUUsQ0FBQSxDQUFDLDBDQUEwQztJQUNyRyxDQUFDO0lBQ0QsbUNBQWtCLEdBQWxCO1FBQ0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksU0FBUyxDQUFDO1lBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFBO1FBQ3hGLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0lBQ0QsMEJBQVMsR0FBVCxVQUFVLEtBQVk7UUFDcEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksU0FBUyxDQUFDO1lBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7UUFDcEcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBSSxPQUFBLElBQUksRUFBSixDQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0lBQ0QsdUJBQU0sR0FBTjtRQUFBLGlCQXlCQztRQXhCQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxTQUFTLENBQUM7WUFBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7UUFDdEYsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsK0JBQU8sSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUNqRCxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQ3ZCLFFBQVEsRUFBRSxVQUFBLENBQUM7Z0JBQ1QsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7b0JBQUMsTUFBTSxDQUFBO2dCQUNyRCxLQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7WUFBQSxDQUFDLEVBRXhDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLElBQUksSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQ3hHLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLFFBQVEsSUFBSSxTQUFTLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEdBQ3ZHO1lBQ1IsQ0FBQztnQkFDQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsQ0FBQztvQkFDeEIsa0NBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQVE7b0JBQ2xDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsQ0FBQzt3QkFDMUIsMkJBQUcsSUFBSSxFQUFFLFNBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFPLElBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUs7d0JBQzVELENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsQ0FBQzs0QkFDNUIsMkJBQUcsSUFBSSxFQUFFLFlBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFPLElBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUs7NEJBQy9ELENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsQ0FBQztnQ0FDMUIsMkJBQUcsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFLO2dDQUNuRCxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksVUFBVSxDQUFDLENBQUM7b0NBQzlCLGtDQUFPLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBUTtvQ0FDekUsQ0FBQzt3Q0FFQyxrQ0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBUSxDQUFBO0lBQzdDLENBQUM7SUFDSCxhQUFDO0FBQUQsQ0FBQyxBQTVDRCxDQUFxQixLQUFLLENBQUMsU0FBUyxHQTRDbkM7QUFFVSxRQUFBLE1BQU0sR0FBRyxVQUFDLElBQVMsRUFBRSxJQUFnQixFQUFFLEdBQVcsRUFBRSxHQUFpQixFQUFFLG1CQUF3QyxJQUFLLE9BQUEsVUFBUyxLQUFZO0lBQ2xKLE1BQU0sQ0FBQyxhQUFNLENBQVMsVUFBQSxJQUFJLElBQUksT0FBQSxVQUFBLElBQUk7UUFDaEMsT0FBQSxLQUFLLENBQUMsYUFBYSxDQUFjLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBQyxRQUFRLEVBQUUsVUFBVSxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsSUFBSSxJQUFJLE1BQU0sRUFBRSxJQUFJLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBQyxHQUFHLEVBQUcsbUJBQW1CLEVBQUUsbUJBQW1CLElBQUksU0FBUyxJQUFJLG1CQUFtQixJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBQTVRLENBQTRRLEVBRGhQLENBQ2dQLENBQUMsQ0FBQTtBQUNqUixDQUFDLEVBSDhILENBRzlILENBQUE7QUFJRDtJQUFtQix3QkFBb0M7SUFDckQsY0FBWSxLQUFlLEVBQUMsT0FBVztRQUF2QyxZQUNFLGtCQUFNLEtBQUssRUFBRSxPQUFPLENBQUMsU0FFdEI7UUFEQyxLQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsS0FBSyxFQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQTs7SUFDcEMsQ0FBQztJQUNELHdDQUF5QixHQUF6QixVQUEwQixTQUFtQjtRQUMzQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxRQUFRLGNBQUssSUFBSSxDQUFDLEtBQUssSUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLEtBQUssSUFBRSxDQUFBLENBQUMsMkNBQTJDO0lBQ3RHLENBQUM7SUFDRCxpQ0FBa0IsR0FBbEI7UUFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDbEMsQ0FBQztJQUNELHdCQUFTLEdBQVQsVUFBVSxLQUFhO1FBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQUksT0FBQSxJQUFJLEVBQUosQ0FBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDbEMsQ0FBQztJQUNELHFCQUFNLEdBQU47UUFBQSxpQkFzQkc7UUFyQkQsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLGNBQWMsQ0FBQyxDQUFDO1lBQ25DLCtCQUFPLElBQUksRUFBQyxVQUFVLEVBQ3BCLFNBQVMsRUFBQyxxREFBcUQsRUFDL0QsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLE1BQU0sRUFDbkMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUN6QixRQUFRLEVBQUUsVUFBQSxDQUFDO29CQUNULE9BQUEsS0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBSSxPQUFBLElBQUksRUFBSixDQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztnQkFBbEQsQ0FBa0QsR0FBSTtZQUMxRCxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksWUFBWSxDQUFDLENBQUM7Z0JBQ2xDLCtCQUFPLElBQUksRUFBQyxVQUFVLEVBQ3BCLFNBQVMsRUFBQyxxREFBcUQsRUFDL0QsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLE1BQU0sRUFDbkMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUN6QixRQUFRLEVBQUUsVUFBQSxDQUFDO3dCQUNULE9BQUEsS0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBSSxPQUFBLElBQUksRUFBSixDQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztvQkFBbEQsQ0FBa0QsR0FBSTtnQkFDMUQsQ0FBQztvQkFDRCwrQkFBTyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQzNCLFNBQVMsRUFBQyx1REFBdUQsRUFDakUsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLE1BQU0sRUFDbkMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUN6QixRQUFRLEVBQUUsVUFBQSxDQUFDOzRCQUNULE9BQUEsS0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBSSxPQUFBLElBQUksRUFBSixDQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQzt3QkFBbEQsQ0FBa0QsR0FBSSxDQUFBO0lBQ3BFLENBQUM7SUFDTCxXQUFDO0FBQUQsQ0FBQyxBQXRDRCxDQUFtQixLQUFLLENBQUMsU0FBUyxHQXNDakM7QUFFVSxRQUFBLElBQUksR0FBRyxVQUFDLElBQVMsRUFBRSxLQUFrQixFQUFFLEdBQVcsRUFBRSxHQUFpQixJQUFLLE9BQUEsVUFBUyxLQUFhO0lBQ3pHLE1BQU0sQ0FBQyxhQUFNLENBQVUsVUFBQSxJQUFJLElBQUksT0FBQSxVQUFBLElBQUk7UUFDakMsT0FBQSxLQUFLLENBQUMsYUFBYSxDQUFZLElBQUksRUFBRSxFQUFFLElBQUksRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFDLEdBQUcsRUFBRSxDQUFDO0lBQTVJLENBQTRJLEVBRC9HLENBQytHLENBQUMsQ0FBQTtBQUNqSixDQUFDLEVBSG9GLENBR3BGLENBQUE7QUFJRDtJQUF1Qiw0QkFBNEM7SUFDakUsa0JBQVksS0FBbUIsRUFBQyxPQUFXO1FBQTNDLFlBQ0Usa0JBQU0sS0FBSyxFQUFFLE9BQU8sQ0FBQyxTQUV0QjtRQURDLEtBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxLQUFLLEVBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFBOztJQUNwQyxDQUFDO0lBQ0QsNENBQXlCLEdBQXpCLFVBQTBCLFNBQXVCO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDdEMsSUFBSSxDQUFDLFFBQVEsY0FBSyxJQUFJLENBQUMsS0FBSyxJQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSyxJQUFFLENBQUEsQ0FBQywyQ0FBMkM7SUFDdEcsQ0FBQztJQUNELHFDQUFrQixHQUFsQjtRQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0lBQ0QsNEJBQVMsR0FBVCxVQUFVLEtBQW1CO1FBQzNCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQUksT0FBQSxJQUFJLEVBQUosQ0FBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDbEMsQ0FBQztJQUNELHlCQUFNLEdBQU47UUFBQSxpQkFVQztRQVRDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFBO1FBQzNCLElBQUksYUFBYSxHQUFNLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLFNBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsU0FBSSxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFHLENBQUE7UUFDbEwsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDO1lBQ2hDLGlDQUFVLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLFNBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsVUFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFHLENBQVE7WUFDaEwsQ0FBQyxDQUFDLCtCQUFPLElBQUksRUFBQyxnQkFBZ0IsRUFDNUIsS0FBSyxFQUFFLGFBQWEsRUFDcEIsUUFBUSxFQUFFLFVBQUMsQ0FBQztvQkFDVixPQUFBLEtBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUFqRCxDQUFpRCxHQUNuRCxDQUFBO0lBQ0osQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDLEFBMUJELENBQXVCLEtBQUssQ0FBQyxTQUFTLEdBMEJyQztBQUVVLFFBQUEsU0FBUyxHQUFHLFVBQUMsSUFBUyxFQUFFLEdBQVcsRUFBRSxHQUFpQixJQUFLLE9BQUEsVUFBUyxLQUFtQjtJQUNoRyxNQUFNLENBQUMsYUFBTSxDQUFnQixVQUFBLElBQUksSUFBSSxPQUFBLFVBQUEsSUFBSTtRQUN2QyxPQUFBLEtBQUssQ0FBQyxhQUFhLENBQWdCLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBQyxXQUFXLEVBQUUsVUFBVSxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBQyxHQUFHLEVBQUUsQ0FBQztJQUE1SSxDQUE0SSxFQUR6RyxDQUN5RyxDQUFDLENBQUE7QUFDakosQ0FBQyxFQUhxRSxDQUdyRSxDQUFBO0FBSUQ7SUFBdUIsNEJBQW9DO0lBQ3pELGtCQUFZLEtBQWUsRUFBQyxPQUFXO1FBQXZDLFlBQ0Usa0JBQU0sS0FBSyxFQUFFLE9BQU8sQ0FBQyxTQUV0QjtRQURDLEtBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxLQUFLLEVBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFBOztJQUNwQyxDQUFDO0lBQ0QsNENBQXlCLEdBQXpCLFVBQTBCLFNBQW1CO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDdEMsSUFBSSxDQUFDLFFBQVEsY0FBSyxJQUFJLENBQUMsS0FBSyxJQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSyxJQUFFLENBQUEsQ0FBQywyQ0FBMkM7SUFDdEcsQ0FBQztJQUNELHFDQUFrQixHQUFsQjtRQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0lBQ0QsNEJBQVMsR0FBVCxVQUFVLEtBQW1CO1FBQzNCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQUksT0FBQSxJQUFJLEVBQUosQ0FBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDbEMsQ0FBQztJQUNELHlCQUFNLEdBQU47UUFBQSxpQkFVQztRQVRDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFBO1FBQzNCLElBQUksYUFBYSxHQUFNLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLFNBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUcsQ0FBQTtRQUNsSCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLENBQUM7WUFDaEMsaUNBQVUsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsU0FBSSxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBSSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBRyxDQUFRO1lBQy9HLENBQUMsQ0FBQywrQkFBTyxJQUFJLEVBQUMsTUFBTSxFQUNsQixLQUFLLEVBQUUsYUFBYSxFQUNwQixRQUFRLEVBQUUsVUFBQyxDQUFDO29CQUNWLE9BQUEsS0FBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFBckYsQ0FBcUYsR0FDdkYsQ0FBQTtJQUNKLENBQUM7SUFDSCxlQUFDO0FBQUQsQ0FBQyxBQTFCRCxDQUF1QixLQUFLLENBQUMsU0FBUyxHQTBCckM7QUFFVSxRQUFBLElBQUksR0FBRyxVQUFDLElBQVMsRUFBRSxHQUFXLEVBQUUsR0FBaUIsSUFBSyxPQUFBLFVBQVMsS0FBbUI7SUFDM0YsTUFBTSxDQUFDLGFBQU0sQ0FBZ0IsVUFBQSxJQUFJLElBQUksT0FBQSxVQUFBLElBQUk7UUFDdkMsT0FBQSxLQUFLLENBQUMsYUFBYSxDQUFZLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBQyxHQUFHLEVBQUUsQ0FBQztJQUFuSSxDQUFtSSxFQURoRyxDQUNnRyxDQUFDLENBQUE7QUFDeEksQ0FBQyxFQUhnRSxDQUdoRSxDQUFBO0FBR0Q7SUFBbUIsd0JBQW9DO0lBQ3JELGNBQVksS0FBZSxFQUFDLE9BQVc7UUFBdkMsWUFDRSxrQkFBTSxLQUFLLEVBQUUsT0FBTyxDQUFDLFNBRXRCO1FBREMsS0FBSSxDQUFDLEtBQUssR0FBRyxFQUFFLEtBQUssRUFBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUE7O0lBQ3BDLENBQUM7SUFDRCx3Q0FBeUIsR0FBekIsVUFBMEIsU0FBbUI7UUFDM0MsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUN0QyxJQUFJLENBQUMsUUFBUSxjQUFLLElBQUksQ0FBQyxLQUFLLElBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLLElBQUUsQ0FBQSxDQUFDLDJDQUEyQztJQUN0RyxDQUFDO0lBQ0QsaUNBQWtCLEdBQWxCO1FBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2xDLENBQUM7SUFDRCx3QkFBUyxHQUFULFVBQVUsS0FBbUI7UUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBSSxPQUFBLElBQUksRUFBSixDQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0lBQ0QscUJBQU0sR0FBTjtRQUFBLGlCQVVDO1FBVEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUE7UUFDM0IsSUFBSSxhQUFhLEdBQU0sVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsU0FBSSxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBRyxDQUFBO1FBQ3JGLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsQ0FBQztZQUNoQyxpQ0FBTyxhQUFhLENBQVE7WUFDOUIsQ0FBQyxDQUFDLCtCQUFPLElBQUksRUFBQyxNQUFNLEVBQ2xCLEtBQUssRUFBRSxhQUFhLEVBQ3BCLFFBQVEsRUFBRSxVQUFDLENBQUM7b0JBQ1YsT0FBQSxLQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFBdkQsQ0FBdUQsR0FDekQsQ0FBQTtJQUNKLENBQUM7SUFDSCxXQUFDO0FBQUQsQ0FBQyxBQTFCRCxDQUFtQixLQUFLLENBQUMsU0FBUyxHQTBCakM7QUFFVSxRQUFBLElBQUksR0FBRyxVQUFDLElBQVMsRUFBRSxHQUFXLEVBQUUsR0FBaUIsSUFBSyxPQUFBLFVBQVMsS0FBbUI7SUFDM0YsTUFBTSxDQUFDLGFBQU0sQ0FBZ0IsVUFBQSxJQUFJLElBQUksT0FBQSxVQUFBLElBQUk7UUFDdkMsT0FBQSxLQUFLLENBQUMsYUFBYSxDQUFZLElBQUksRUFBRSxFQUFFLElBQUksRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBQyxHQUFHLEVBQUUsQ0FBQztJQUEvSCxDQUErSCxFQUQ1RixDQUM0RixDQUFDLENBQUE7QUFDcEksQ0FBQyxFQUhnRSxDQUdoRSxDQUFBIn0=