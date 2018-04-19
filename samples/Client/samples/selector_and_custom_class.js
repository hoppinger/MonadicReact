"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const monadic_react_1 = require("../../../src/monadic_react");
class Counter extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { current: 0, signals_sent: 0 };
    }
    render() {
        return React.createElement("div", null,
            React.createElement("label", { style: { margin: "10px" } },
                "Progress: ",
                this.state.current,
                "/",
                this.props.target),
            React.createElement("button", { onClick: () => this.setState(Object.assign({}, this.state, { current: this.state.current + 1 }), () => this.state.current >= this.props.target + 1 && this.setState(Object.assign({}, this.state, { current: 0, signals_sent: this.state.signals_sent + 1 }), () => this.props.cont(() => { })(this.state.signals_sent))) }, "+1"));
    }
}
exports.selector_sample = monadic_react_1.selector("dropdown", x => x.toString())([1, 3, 5]).then(`target_selector`, n => monadic_react_1.custom()(ctxt => cont => React.createElement(Counter, { target: n, context: ctxt, cont: cont })).then(`counter`, s => monadic_react_1.string("view")(`The component has ticked ${s} times.`).ignore()));
//# sourceMappingURL=selector_and_custom_class.js.map