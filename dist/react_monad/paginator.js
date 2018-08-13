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
var Paginate = /** @class */ (function (_super) {
    __extends(Paginate, _super);
    function Paginate(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { page_index: 0, get_page_cache: "loading", current_page: "loading", page_cache: "loading" };
        return _this;
    }
    Paginate.prototype.componentWillReceiveProps = function (new_props) {
        var _this = this;
        new_props.debug_info && console.log("New props:", new_props.debug_info());
        this.setState(__assign({}, this.state, { get_page_cache: new_props.get_page(this.state.page_index, new_props.items_per_page).comp(new_props.context)(function (callback) { return function (page) {
                return _this.setState(__assign({}, _this.state, { current_page: page, page_cache: new_props.renderer(page.items).comp(new_props.context)(new_props.cont) }));
            }; }) }));
    };
    Paginate.prototype.componentWillMount = function () {
        var _this = this;
        this.props.debug_info && console.log("Component will mount:", this.props.debug_info());
        this.setState(__assign({}, this.state, { get_page_cache: this.props.get_page(this.state.page_index, this.props.items_per_page).comp(this.props.context)(function (callback) { return function (page) {
                return _this.setState(__assign({}, _this.state, { current_page: page, page_cache: _this.props.renderer(page.items).comp(_this.props.context)(_this.props.cont) }));
            }; }) }));
    };
    Paginate.prototype.goto = function (page_index) {
        var _this = this;
        this.setState(__assign({}, this.state, { get_page_cache: this.props.get_page(page_index, this.props.items_per_page).comp(this.props.context)(function (callback) { return function (page) {
                return _this.setState(__assign({}, _this.state, { page_index: page_index, current_page: page, page_cache: _this.props.renderer(page.items).comp(_this.props.context)(_this.props.cont) }));
            }; }) }));
    };
    Paginate.prototype.render = function () {
        var _this = this;
        this.props.debug_info && console.log("Render:", this.props.debug_info());
        return React.createElement("div", { className: "monadic-paginated-content" },
            this.state.get_page_cache != "loading" ? this.state.get_page_cache : [],
            this.state.current_page != "loading" && this.state.current_page.num_pages > 1 ?
                React.createElement("div", { className: "monadic-paginator" },
                    this.state.current_page.page_index > 0 && this.state.current_page.num_pages > 3 ?
                        React.createElement("a", { className: "page first-page", style: { margin: "5px" }, onClick: function () { return _this.goto(0); } }, 1) : [],
                    this.state.current_page.page_index > 2 ? "..." : [],
                    this.state.current_page.page_index > 0 ?
                        React.createElement("a", { className: "page prev-page", style: { margin: "5px" }, onClick: function () { return _this.goto(_this.state.current_page != "loading" && _this.state.current_page.page_index - 1); } }, '<') : [],
                    React.createElement("span", { className: "page current-page", style: { margin: "5px" } }, this.state.current_page.page_index + 1),
                    this.state.current_page.page_index < this.state.current_page.num_pages - 1 ?
                        React.createElement("a", { className: "page next-page", style: { margin: "5px" }, onClick: function () { return _this.state.current_page != "loading" && _this.goto(_this.state.current_page.page_index + 1); } }, '>') : [],
                    this.state.current_page.page_index < this.state.current_page.num_pages - 2 ? "..." : [],
                    this.state.current_page.page_index < this.state.current_page.num_pages - 1 && this.state.current_page.num_pages > 3 ?
                        React.createElement("a", { className: "page last-page", style: { margin: "5px" }, onClick: function () { return _this.state.current_page != "loading" && _this.goto(_this.state.current_page.num_pages - 1); } }, this.state.current_page.num_pages) : null)
                :
                    [],
            this.state.page_cache != "loading" ? this.state.page_cache : []);
    };
    return Paginate;
}(React.Component));
exports.paginate = function (items_per_page, get_page, key, dbg) {
    return function (renderer) { return core_1.make_C(function (context) { return function (cont) {
        return React.createElement(Paginate, { kind: "paginate", items_per_page: items_per_page,
            get_page: get_page, renderer: renderer,
            cont: cont, context: context, key: key, debug_info: dbg });
    }; }); };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlYWN0X21vbmFkL3BhZ2luYXRvci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2QkFBOEI7QUFHOUIsNENBQTBFO0FBaUIxRTtJQUE0Qiw0QkFBc0Q7SUFDaEYsa0JBQVksS0FBd0IsRUFBQyxPQUFXO1FBQWhELFlBQ0Usa0JBQU0sS0FBSyxFQUFFLE9BQU8sQ0FBQyxTQUV0QjtRQURDLEtBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxVQUFVLEVBQUMsQ0FBQyxFQUFFLGNBQWMsRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUMsU0FBUyxFQUFFLENBQUE7O0lBQ3ZHLENBQUM7SUFDRCw0Q0FBeUIsR0FBekIsVUFBMEIsU0FBNEI7UUFBdEQsaUJBS0M7UUFKQyxTQUFTLENBQUMsVUFBVSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFBO1FBQ3pFLElBQUksQ0FBQyxRQUFRLGNBQUssSUFBSSxDQUFDLEtBQUssSUFDMUIsY0FBYyxFQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxVQUFBLElBQUk7Z0JBQzNILE9BQUEsS0FBSSxDQUFDLFFBQVEsY0FBSyxLQUFJLENBQUMsS0FBSyxJQUFFLFlBQVksRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFFO1lB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