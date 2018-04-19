"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Moment = require("moment");
const monadic_react_1 = require("../../../src/monadic_react");
exports.moments_sample = monadic_react_1.repeat()(monadic_react_1.any(`input number`)([
    c => monadic_react_1.repeat()(monadic_react_1.label("Insert a time: ", true)(monadic_react_1.time("edit", "time")))(c).then(`time bind`, c => monadic_react_1.string("view")(`Your selection is ${c.toString()}`)).map(_ => c).filter(_ => false, 'time_filter'),
    c => monadic_react_1.repeat()(monadic_react_1.label("Insert a date: ", true)(monadic_react_1.date("edit", "date")))(c).then(`date bind`, c => monadic_react_1.string("view")(`Your selection is ${c.toString()}`)).map(_ => c).filter(_ => false, 'date_filter'),
    c => monadic_react_1.repeat()(monadic_react_1.label("Insert a date with time: ", true)(monadic_react_1.date_time("edit", "date-time")))(c).then(`date-time bind`, c => monadic_react_1.string("view")(`Your selection is ${c.toString()}`)).map(_ => c).filter(_ => false, 'date_time_filter')
]))(Moment(Moment.now())).ignore();
//# sourceMappingURL=moments.js.map