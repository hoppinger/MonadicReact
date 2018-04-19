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
exports.should_component_update_sample = monadic_react_1.repeat("should component update sample")(monadic_react_1.any("should component update any")([
    // should_component_update<ShouldComponentUpdateSampleState,ShouldComponentUpdateSampleState>("string 1 should component update", () => "string1")(
    //   s => s.last_update == "string1")(
    monadic_react_1.retract("string 1 retract")(s => s.string1, s => s1 => (Object.assign({}, s, { string1: s1, last_update: "string1" })), s => console.log("updating string 1") || monadic_react_1.string("edit", "text", "string 1")(s))
    // )
    ,
    // should_component_update<ShouldComponentUpdateSampleState,ShouldComponentUpdateSampleState>("strings 2/3 should component update", () => "strings 2/3")(
    //   s => s.last_update == "sub_state")(
    monadic_react_1.retract("string 2 retract")(s => s.sub_state, s => sub_state => (Object.assign({}, s, { sub_state: sub_state, last_update: "sub_state" })), s => console.log("updating sub-state") ||
        monadic_react_1.any("sub state any")([
            // should_component_update<ShouldComponentUpdateSampleSubState,ShouldComponentUpdateSampleSubState>("string 2 should component update", () => "string2")(
            //   s => s.last_update == "string2")(
            monadic_react_1.retract("string 2 retract")(s => s.string2, s => s2 => (Object.assign({}, s, { string2: s2, last_update: "string2" })), s => console.log("updating string 2") || monadic_react_1.string("edit", "text", "string 2")(s))
            //)
            ,
            monadic_react_1.retract("string 3 retract")(s => ({ s: s.string3, last_update: s.last_update }), s => s3 => (Object.assign({}, s, { string3: s3.s, last_update: "string3" })), monadic_react_1.should_component_update("string 3 should component update", () => "string3")(s => s.last_update == "string3")(monadic_react_1.retract("string 3 inner retract")(s => s.s, s => s1 => (Object.assign({}, s, { s: s1 })), monadic_react_1.string("edit", "text", "string 3"))))
        ])(s))
    // )
]))({ string1: "string 1", sub_state: { string2: "string 2", string3: "string 3", last_update: "none" }, last_update: "none" })
    .map(s => console.log("done with", [s.string1, s.sub_state.string2, s.sub_state.string3]) || monadic_react_1.unit(s)).ignore();
//# sourceMappingURL=form.js.map