import * as Models from "./generated_models"

let Items = [
    { Id: 1, Name: "TestCourse", Points: 1 },
    { Id: 2, Name: "Course 2", Points: 10 },
    { Id: 3, Name: "Third test", Points: 15 },
]

type CourseItem = {
    Item: Models.Course
}

export function get_Course(id:number):Promise<CourseItem> {
    let course = Items.filter(x => x.Id == id);
    return Promise.resolve({
        Item: course.length > 0 ? course[0] : null
    })
}

export function update_Course(c:Models.Course):Promise<any> {
    let courseIndex = Items.findIndex(x => x.Id == c.Id);
    
    if(courseIndex != -1) {
        Items[courseIndex] = c;
    }
    return Promise.resolve("")
}