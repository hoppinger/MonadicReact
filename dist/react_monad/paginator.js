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
var Paginate = (function (_super) {
    __extends(Paginate, _super);
    function Paginate(props, context) {
        var _this = _super.call(this) || this;
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
                return _this.setState(__assign({}, _this.state, { current_page: page, page_cache: _this.props.renderer(page.items).comp(_this.props.context)(_this.props.cont) }));
            }; }) }));
    };
    Paginate.prototype.render = function () {
        var _this = this;
        this.props.debug_info && console.log("Render:", this.props.debug_info());
        console.log("Rendering paginator");
        return React.createElement("div", { className: "monadic-paginated-content" },
            this.state.get_page_cache != "loading" ? this.state.get_page_cache : null,
            this.state.current_page != "loading" && this.state.current_page.num_pages > 1 ?
                React.createElement("div", { className: "monadic-paginator" },
                    this.state.current_page.page_index > 0 && this.state.current_page.num_pages > 3 ?
                        React.createElement("a", { className: "page first-page", style: { margin: "5px" }, onClick: function () { return _this.goto(0); } }, 1) : null,
                    this.state.current_page.page_index > 2 ? "..." : null,
                    this.state.current_page.page_index > 0 ?
                        React.createElement("a", { className: "page prev-page", style: { margin: "5px" }, onClick: function () { return _this.goto(_this.state.current_page != "loading" && _this.state.current_page.page_index - 1); } }, '<') : null,
                    React.createElement("span", { className: "page current-page", style: { margin: "5px" } }, this.state.current_page.page_index + 1),
                    this.state.current_page.page_index < this.state.current_page.num_pages - 1 ?
                        React.createElement("button", { className: "page next-page", style: { margin: "5px" }, onClick: function () { return console.log("!!!", _this.state.current_page) || _this.state.current_page != "loading" && _this.goto(_this.state.current_page.page_index + 1); } }, '>') : null,
                    this.state.current_page.page_index < this.state.current_page.num_pages - 2 ? "..." : null,
                    this.state.current_page.page_index < this.state.current_page.num_pages - 1 && this.state.current_page.num_pages > 3 ?
                        React.createElement("a", { className: "page last-page", style: { margin: "5px" }, onClick: function () { return _this.state.current_page != "loading" && _this.goto(_this.state.current_page.num_pages - 1); } }, this.state.current_page.num_pages) : null)
                :
                    null,
            this.state.page_cache != "loading" ? this.state.page_cache : null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlYWN0X21vbmFkL3BhZ2luYXRvci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2QkFBOEI7QUFHOUIsNENBQTBFO0FBaUIxRTtJQUE0Qiw0QkFBc0Q7SUFDaEYsa0JBQVksS0FBd0IsRUFBQyxPQUFXO1FBQWhELFlBQ0UsaUJBQU8sU0FFUjtRQURDLEtBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxVQUFVLEVBQUMsQ0FBQyxFQUFFLGNBQWMsRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUMsU0FBUyxFQUFFLENBQUE7O0lBQ3ZHLENBQUM7SUFDRCw0Q0FBeUIsR0FBekIsVUFBMEIsU0FBNEI7UUFBdEQsaUJBS0M7UUFKQyxTQUFTLENBQUMsVUFBVSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFBO1FBQ3pFLElBQUksQ0FBQyxRQUFRLGNBQUssSUFBSSxDQUFDLEtBQUssSUFDMUIsY0FBYyxFQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxVQUFBLElBQUk7Z0JBQzNILE9BQUEsS0FBSSxDQUFDLFFBQVEsY0FBSyxLQUFJLENBQUMsS0FBSyxJQUFFLFlBQVksRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFFO1lBQXBJLENBQW9JLEVBRGIsQ0FDYSxD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