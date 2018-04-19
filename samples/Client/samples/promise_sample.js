"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monadic_react_1 = require("../../../src/monadic_react");
exports.promise_sample = monadic_react_1.repeat(`input number`)(n => monadic_react_1.label("Insert an even number: ", true)(n => monadic_react_1.number("edit", "number")(n))(n))(0).then(`input number bind`, n => monadic_react_1.button(`Send ${n.toString()} further`, false, "button_key")(n).then("key", (n) => monadic_react_1.lift_promise(getResponse, 
//  "never",
{ kind: "retry then show failure", times: 3, on_failure: monadic_react_1.string("view")("99999").map(a => undefined) }, "new promise", undefined)(n)
    .then("response_offer", (r) => {
    console.log("then in response");
    return monadic_react_1.unit((n + 5) * 5);
}))
    .map(n => `Your selection is ${n.toString()}`)
    .then(`button to string`, s => monadic_react_1.string("view")(s).ignore()));
const getResponse = (request) => {
    console.log("getResponse");
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            console.log('Request');
            //resolve();    
            reject();
        }, 1000);
    });
};
//# sourceMappingURL=promise_sample.js.map