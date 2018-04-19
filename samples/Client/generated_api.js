"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let Items = [
    { Id: 1, Name: "TestCourse", Points: 1 },
    { Id: 2, Name: "Course 2", Points: 10 },
    { Id: 3, Name: "Third test", Points: 15 },
];
function get_Course(id) {
    let course = Items.filter(x => x.Id == id);
    return Promise.resolve({
        Item: course.length > 0 ? course[0] : null
    });
}
exports.get_Course = get_Course;
function update_Course(c) {
    let courseIndex = Items.findIndex(x => x.Id == c.Id);
    if (courseIndex != -1) {
        Items[courseIndex] = c;
    }
    return Promise.resolve(null);
}
exports.update_Course = update_Course;
//# sourceMappingURL=generated_api.js.map