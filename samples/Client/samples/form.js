"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Api = require("../generated_api");
const monadic_react_1 = require("../../../src/monadic_react");
// Utils: these will be scaffolded at a later time
//let download_course_with_logo : (_:number) => C<Models.Course> = c_id => lift_promise<void, Models.Course>(x => Api.get_Course_with_pictures(c_id).then(c => c.Item), "semi exponential", `course_downloader_lift_${c_id}`)(null)
//let upload_course_with_logo : (_:Models.Course) => C<Models.Course> = c =>
//  lift_promise<Models.Course, Models.Course>(c => Api.update_Course_with_pictures(c).then(_ => c),
//  "semi exponential", `course_uploader_lift_${c.Id}`)(c)
let download_course = c_id => monadic_react_1.lift_promise(x => Api.get_Course(c_id).then(c => c.Item), "semi exponential", `course_downloader_lift_${c_id}`)(null);
let upload_course = c => monadic_react_1.lift_promise(c => Api.update_Course(c).then(_ => c), "semi exponential", `course_uploader_lift_${c.Id}`)(c);
exports.course_form_with_autosave_sample = monadic_react_1.simple_form_with_autosave("edit", c => `course_${c.Id}`, [
    { kind: "string", field_name: "Name", in: c => c.Name || "", out: c => (n) => (Object.assign({}, c, { Name: n })), get_errors: c => c.Name.length < 3 ? ["The name cannot be shorter than three characters."] : [] },
    { kind: "number", field_name: "Points", in: c => c.Points || 0, out: c => (p) => (Object.assign({}, c, { Points: p })), get_errors: c => c.Points < 1 ? ["The course must be worth at least one point."] : [] },
], download_course(1), upload_course);
exports.course_form_sample = monadic_react_1.simple_form_with_save_button("edit", c => `course_${c.Id}`, [
    { kind: "string", field_name: "Name", in: c => c.Name || "", out: c => (n) => (Object.assign({}, c, { Name: n })), get_errors: c => c.Name.length < 3 ? ["The name cannot be shorter than three characters."] : [] },
    { kind: "number", field_name: "Points", in: c => c.Points || 0, out: c => (p) => (Object.assign({}, c, { Points: p })), get_errors: c => c.Points < 1 ? ["The course must be worth at least one point."] : [] },
], download_course(1), upload_course);
//# sourceMappingURL=form.js.map