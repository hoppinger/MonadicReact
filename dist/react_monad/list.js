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
var List = /** @class */ (function (_super) {
    __extends(List, _super);
    function List(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { ps: "creating" };
        return _this;
    }
    List.prototype.componentWillReceiveProps = function (new_props) {
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
            this.state.ps != "creating" ? this.state.ps : [],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdF9tb25hZC9saXN0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZCQUE4QjtBQUc5Qiw0Q0FBMEU7QUFZMUU7SUFBd0Isd0JBQThDO0lBQ3BFLGNBQVksS0FBb0IsRUFBQyxPQUFXO1FBQTVDLFlBQ0Usa0JBQU0sS0FBSyxFQUFFLE9BQU8sQ0FBQyxTQUV0QjtRQURDLEtBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLEVBQUMsVUFBVSxFQUFFLENBQUE7O0lBQ2hDLENBQUM7SUFDRCx3Q0FBeUIsR0FBekIsVUFBMEIsU0FBd0I7UUFDaEQsSUFBSSxDQUFDLFFBQVEsY0FBSyxJQUFJLENBQUMsS0FBSyxJQUMxQixFQUFFLEVBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFJLEVBQUUsS0FBSztnQkFDL0IsT0FBQSxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxVQUFBLFNBQVM7b0JBQzNFLE9BQUEsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUM7Z0JBQW5DLENBQW1DLEVBRCtCLENBQy9CLENBQUM7WUFEdEMsQ0FDc0MsQ0FBQyxDQUFDLE1BQU0sRUFBRSxJQUFFLENBQUE7SUFDMUQsQ0FBQztJQUNELGlDQUFrQixHQUFsQjtRQUFBLGlCQUtDO1FBSkMsSUFBSSxDQUFDLFFBQVEsY0FBSyxJQUFJLENBQUMsS0FBSyxJQUMxQixFQUFFLEVBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBSSxFQUFFLEtBQUs7Z0JBQ2hDLE9BQUEsS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxVQUFBLFNBQVM7b0JBQzdFLE9BQUEsS0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUFwQyxDQUFvQyxFQURnQyxDQUNoQyxDQUFDO1lBRHZDLENBQ3VDLENBQUMsQ0FBQyxNQUFNLEVBQUUsSUFBRSxDQUFBO0lBQzNELENBQUM7SUFDRCxxQkFBTSxHQUFOO1FBQ0UsTUFBTSxDQUFDLDZCQUFLLFNBQVMsRUFBRSxtQkFBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFFOztZQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQVMsQ0FBQTtJQUNuSSxDQUFDO0lBQ0gsV0FBQztBQUFELENBQUMsQUFwQkQsQ0FBd0IsS0FBSyxDQUFDLFNBQVMsR0FvQnRDO0FBRVUsUUFBQSxJQUFJLEdBQUcsVUFBYyxLQUF1QixFQUFFLEdBQVcsRUFBRSxTQUFpQixFQUFFLEdBQWlCO0lBQ3hHLE1BQU0sQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLGFBQU0sQ0FBSSxVQUFBLE9BQU8sSUFBSSxPQUFBLFVBQUEsSUFBSTtRQUN0QyxPQUFBLEtBQUssQ0FBQyxhQUFhLENBQWlCLElBQUksRUFDdEMsRUFBRSxJQUFJLEVBQUMsTUFBTTtZQUNYLEtBQUssRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLFFBQVE7WUFDOUIsSUFBSSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUMsR0FBRyxFQUFFLENBQUM7SUFIL0UsQ0FHK0UsRUFKN0MsQ0FJNkMsQ0FBQyxFQUpuRSxDQUltRSxDQUFBO0FBQ3hGLENBQUMsQ0FBQSJ9