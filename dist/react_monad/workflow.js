"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("../react_monad/core");
var combinators_1 = require("../react_monad/combinators");
exports.simple_workflow = function (workflow_name, steps, initial_model, initial_step) {
    return initial_model.bind(workflow_name + "_initial_binder", function (m) {
        return combinators_1.repeat(workflow_name + "_repeater")(function (cd) {
            return steps.has(cd.step) ?
                steps.get(cd.step)(cd)
                :
                    core_1.unit(cd).filter(function (_) { return false; });
        })({ model: m, step: initial_step }).map(function (c) { return c.model; });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2Zsb3cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVhY3RfbW9uYWQvd29ya2Zsb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSw0Q0FBaUQ7QUFHakQsMERBQXlHO0FBSTlGLFFBQUEsZUFBZSxHQUFHLFVBQWMsYUFBb0IsRUFBRSxLQUFxRSxFQUFFLGFBQWtCLEVBQUUsWUFBYztJQUN4SyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBSSxhQUFhLG9CQUFpQixFQUFFLFVBQUEsQ0FBQztRQUM5RCxPQUFBLG9CQUFNLENBQXVCLGFBQWEsY0FBVyxDQUFDLENBQUMsVUFBQSxFQUFFO1lBQ3ZELE9BQUEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO2dCQUNoQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUM7O29CQUV0QixXQUFJLENBQW9CLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUssRUFBTCxDQUFLLENBQUM7UUFIaEQsQ0FHZ0QsQ0FDakQsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFJLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEtBQUssRUFBUCxDQUFPLENBQUM7SUFMdkQsQ0FLdUQsQ0FBQyxDQUFBO0FBQzFELENBQUMsQ0FBQSJ9