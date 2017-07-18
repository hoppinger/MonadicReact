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
var core_1 = require("../react_monad/core");
var List = (function (_super) {
    __extends(List, _super);
    function List(props, context) {
        var _this = _super.call(this) || this;
        _this.state = { ps: "creating" };
        return _this;
    }
    List.prototype.componentWillReceiveProps = function (new_props) {
        console.log("Received new list props", new_props.items.map(function (item, index) { return [item, index]; }).toArray());
        this.setState(__assign({}, this.state, { ps: new_props.items.map(function (item, index) {
                return new_props.renderer(index)(item).comp(new_props.context)(function (callback) { return function (new_value) {
                    return new_props.cont(callback)(new_value);
                }; });
            }).toList() }));
    };
    List.prototype.componentWillMount = function () {
        var _this = this;
        this.setState(__assign({}, this.state, { ps: this.props.items.map(function (item, index) {
                return _this.props.renderer(index)(item).comp(_this.props.context)(function (callback) { return function (new_value) {
                    return _this.props.cont(callback)(new_value);
                }; });
            }).toList() }));
    };
    List.prototype.render = function () {
        return React.createElement("div", { className: "monadic-list " + (this.props.className || "") },
            " ",
            this.state.ps != "creating" ? this.state.ps : null,
            " ");
    };
    return List;
}(React.Component));
exports.list = function (items, key, className, dbg) {
    return function (renderer) { return core_1.make_C(function (context) { return function (cont) {
        return React.createElement(List, { kind: "list",
            items: items, renderer: renderer,
            cont: cont, context: context, key: key, className: className, debug_info: dbg });
    }; }); };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdF9tb25hZC9saXN0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZCQUE4QjtBQUc5Qiw0Q0FBMEU7QUFZMUU7SUFBd0Isd0JBQThDO0lBQ3BFLGNBQVksS0FBb0IsRUFBQyxPQUFXO1FBQTVDLFlBQ0UsaUJBQU8sU0FFUjtRQURDLEtBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLEVBQUMsVUFBVSxFQUFFLENBQUE7O0lBQ2hDLENBQUM7SUFDRCx3Q0FBeUIsR0FBekIsVUFBMEIsU0FBd0I7UUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQUksRUFBRSxLQUFLLElBQUssT0FBQSxDQUFDLElBQUksRUFBQyxLQUFLLENBQUMsRUFBWixDQUFZLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO1FBQ3BHLElBQUksQ0FBQyxRQUFRLGNBQUssSUFBSSxDQUFDLEtBQUssSUFDMUIsRUFBRSxFQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBSSxFQUFFLEtBQUs7Z0JBQy9CLE9BQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsVUFBQSxTQUFTO29CQUMzRSxPQUFBLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUFuQyxDQUFtQyxFQUQrQixDQUMvQixDQUFDO1lBRHRDLENBQ3NDLENBQUMsQ0FBQyxNQUFNLEVBQUUsSUFBRSxDQUFBO0lBQzFELENBQUM7SUFDRCxpQ0FBa0IsR0FBbEI7UUFBQSxpQkFLQztRQUpDLElBQUksQ0FBQyxRQUFRLGNBQUssSUFBSSxDQUFDLEtBQUssSUFDMUIsRUFBRSxFQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQUksRUFBRSxLQUFLO2dCQUNoQyxPQUFBLEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsVUFBQSxTQUFTO29CQUM3RSxPQUFBLEtBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQztnQkFBcEMsQ0FBb0MsRUFEZ0MsQ0FDaEMsQ0FBQztZQUR2QyxDQUN1QyxDQUFDLENBQUMsTUFBTSxFQUFFLElBQUUsQ0FBQTtJQUMzRCxDQUFDO0lBQ0QscUJBQU0sR0FBTjtRQUNFLE1BQU0sQ0FBQyw2QkFBSyxTQUFTLEVBQUUsbUJBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBRTs7WUFBSyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsSUFBSTtnQkFBUyxDQUFBO0lBQ3JJLENBQUM7SUFDSCxXQUFDO0FBQUQsQ0FBQyxBQXJCRCxDQUF3QixLQUFLLENBQUMsU0FBUyxHQXFCdEM7QUFFVSxRQUFBLElBQUksR0FBRyxVQUFjLEtBQXVCLEVBQUUsR0FBVyxFQUFFLFNBQWlCLEVBQUUsR0FBaUI7SUFDeEcsTUFBTSxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsYUFBTSxDQUFJLFVBQUEsT0FBTyxJQUFJLE9BQUEsVUFBQSxJQUFJO1FBQ3RDLE9BQUEsS0FBSyxDQUFDLGFBQWEsQ0FBaUIsSUFBSSxFQUN0QyxFQUFFLElBQUksRUFBQyxNQUFNO1lBQ1gsS0FBSyxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUMsUUFBUTtZQUM5QixJQUFJLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQztJQUgvRSxDQUcrRSxFQUo3QyxDQUk2QyxDQUFDLEVBSm5FLENBSW1FLENBQUE7QUFDeEYsQ0FBQyxDQUFBIn0=