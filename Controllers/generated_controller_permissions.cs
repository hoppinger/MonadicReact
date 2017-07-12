using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using MonadicComponents;
using MonadicComponents.Models;
using MonadicComponents.Filters;


namespace MonadicComponents.Models
{
  public static class Permissions {
    static public bool can_view_HomePage() { return true; }

    static public bool can_create_HomePage() { return false; }

    static public bool can_edit_HomePage() { return true; }

    static public bool can_delete_HomePage() { return false; }
      
  

    
static public bool can_view_Course() { return true; }

    static public bool can_create_Course() { return true; }

    static public bool can_edit_Course() { return true; }

    static public bool can_delete_Course() { return true; }
      
    static public bool can_view_Course_Name() { return true; }

    static public bool can_edit_Course_Name() { return true; }
    
  static public bool can_view_Course_Points() { return true; }

    static public bool can_edit_Course_Points() { return true; }
    
  static public bool can_view_Course_Logo() { return true; }

    static public bool can_edit_Course_Logo() { return true; }
    
  static public bool can_view_Course_Attachment() { return true; }

    static public bool can_edit_Course_Attachment() { return true; }
    

    
static public bool can_view_Lecture() { return true; }

    static public bool can_create_Lecture() { return true; }

    static public bool can_edit_Lecture() { return true; }

    static public bool can_delete_Lecture() { return true; }
      
    static public bool can_view_Lecture_Name() { return true; }

    static public bool can_edit_Lecture_Name() { return true; }
    
  static public bool can_view_Lecture_Description() { return true; }

    static public bool can_edit_Lecture_Description() { return true; }
    

    

    static public bool can_view_HomePage_Course() { return true; }

    static public bool can_create_HomePage_Course() { return true; }

    static public bool can_edit_HomePage_Course() { return true; }

    static public bool can_delete_HomePage_Course() { return true; }
static public bool can_view_Course_Lecture() { return true; }

    static public bool can_create_Course_Lecture() { return true; }

    static public bool can_edit_Course_Lecture() { return true; }

    static public bool can_delete_Course_Lecture() { return true; }
  }
}
