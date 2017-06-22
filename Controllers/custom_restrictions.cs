// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Threading.Tasks;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.AspNetCore.Mvc.Rendering;
// using Microsoft.AspNetCore.Mvc.ViewFeatures;
// using Microsoft.EntityFrameworkCore;
// using TestApplication;
// using TestApplication.Models;
// using TestApplication.Filters;
// using System.Linq.Expressions;

// namespace TestApplication.CustomRestrictions {
//   static class UserRestrictions {
//     static public void UsernameIsAdmin2(User current_User, TestApplicationContext dbContext) {
//       if (current_User == null || current_User.Username != "admin2") throw new Exception("Error: username should be admin2");
//     }
//   }

//   static class LectureFilters {
//     static public Expression<Func<Lecture, bool>> LectureCalledLecture1(User current_User, TestApplicationContext dbContext) { return (l => l.Name == "Lecture1" ); }
//   }
// }
