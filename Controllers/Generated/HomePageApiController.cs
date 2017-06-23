using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using MonadicComponents;
using MonadicComponents.Models;
using MonadicComponents.Filters;
using System.IO;


  [Route("api/v1/HomePage")]
  public class HomePageApiController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly MonadicComponentsContext _context;
    private IHostingEnvironment env;

    public HomePageApiController(MonadicComponentsContext context, IHostingEnvironment env, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
      this.env = env;
    }

    public bool ApiTokenValid => RestrictToUserTypeAttribute.ApiToken != null &&
        HttpContext.Request.Headers["ApiToken"] == RestrictToUserTypeAttribute.ApiToken;

    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{HomePage_id}/HomePage_Courses")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Course> GetHomePage_Courses(int HomePage_id, [FromQuery] int page_index, [FromQuery] int page_size = 25 )
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var source = allowed_sources.FirstOrDefault(s => s.Id == HomePage_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<MonadicComponents.Models.Course>() // B
              .AsQueryable()
              .Select(MonadicComponents.Models.Course.FilterViewableAttributes())
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, MonadicComponents.Models.Course.WithoutImages, item => item , null);
      var allowed_targets = ApiTokenValid ? _context.Course : _context.Course;
      var editable_targets = ApiTokenValid ? _context.Course : (_context.Course);
      var can_edit_by_token = ApiTokenValid || true;
      var items = (from target in allowed_targets
              select target).OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
              .Select(MonadicComponents.Models.Course.FilterViewableAttributes())
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, MonadicComponents.Models.Course.WithoutImages, item => item , null);
    }

    [HttpGet("{HomePage_id}/HomePage_Courses/{Course_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*Course*/ GetHomePage_CourseById(int HomePage_id, int Course_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var source = allowed_sources.FirstOrDefault(s => s.Id == HomePage_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return NotFound();
      var allowed_targets = ApiTokenValid ? _context.Course : _context.Course;
      var item = (from target in allowed_targets
              select target).OrderBy(i => i.CreatedDate)
              .Select(MonadicComponents.Models.Course.FilterViewableAttributes())
              .FirstOrDefault(t => t.Id == Course_id);
      if (item == null) return NotFound();
      item = MonadicComponents.Models.Course.WithoutImages(item);
      return Ok(item);
    }

    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*ItemWithEditable<HomePage>*/ GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var editable_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var item_full = allowed_items.FirstOrDefault(e => e.Id == id);
      if (item_full == null) return NotFound();
      var item = MonadicComponents.Models.HomePage.FilterViewableAttributesLocal()(item_full);
      item = MonadicComponents.Models.HomePage.WithoutImages(item);
      return Ok(new ItemWithEditable<HomePage>() {
        Item = item,
        Editable = editable_items.Any(e => e.Id == item.Id) });
    }
    

    [RestrictToUserType(new string[] {})]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult /*HomePage*/ Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var can_create_by_token = ApiTokenValid || true;
      if (!can_create_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized create attempt");
      var item = new HomePage() { CreatedDate = DateTime.Now, Id = _context.HomePage.Max(i => i.Id) + 1 };
      _context.HomePage.Add(MonadicComponents.Models.HomePage.FilterViewableAttributesLocal()(item));
      _context.SaveChanges();
      item = MonadicComponents.Models.HomePage.WithoutImages(item);
      return Ok(item);
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public IActionResult Update([FromBody] HomePage item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      if (!allowed_items.Any(i => i.Id == item.Id)) return Unauthorized();
      var new_item = item;
      
      var can_edit_by_token = ApiTokenValid || true;
      if (item == null || !can_edit_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized edit attempt");
      _context.Update(new_item);
      _context.Entry(new_item).Property(x => x.CreatedDate).IsModified = false;
      _context.SaveChanges();
      return Ok();
    }

    [RestrictToUserType(new string[] {})]
    [HttpDelete("{id}")]
    [ValidateAntiForgeryToken]
    public IActionResult Delete(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var item = _context.HomePage.FirstOrDefault(e => e.Id == id);
      var can_delete_by_token = ApiTokenValid || true;
      if (item == null || !can_delete_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized delete attempt");
      
      if (!allowed_items.Any(a => a.Id == item.Id)) return Unauthorized(); // throw new Exception("Unauthorized delete attempt");
      
      

      _context.HomePage.Remove(item);
      _context.SaveChanges();
      return Ok();
    }


    [RestrictToUserType(new string[] {"*"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<HomePage> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25 )
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var editable_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var can_edit_by_token = ApiTokenValid || true;
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true;
      var items = allowed_items.OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
        .Select(MonadicComponents.Models.HomePage.FilterViewableAttributes())
        .Select(s => Tuple.Create(s, can_edit_by_token && editable_items.Any(es => es.Id == s.Id)))
        .Paginate(can_create_by_token, can_delete_by_token, false, page_index, page_size, MonadicComponents.Models.HomePage.WithoutImages, item => item , null );
    }

    


    /*
    static public void CleanupNullRelations(MonadicComponentsContext _context) {
    
      _context.Course_Lecture.RemoveRange(_context.Course_Lecture.Where(l =>
        l.CourseId == null ||
        l.LectureId == null ||
        !_context.Course.Any(s => s.Id == l.CourseId) ||
        !_context.Lecture.Any(s => s.Id == l.LectureId)));
      _context.SaveChanges();
    

      _context.Course_Lecture.RemoveRange(_context.Course_Lecture.Where(l =>
        l.LectureId == null ||
        l.CourseId == null ||
        !_context.Lecture.Any(s => s.Id == l.LectureId) ||
        !_context.Course.Any(s => s.Id == l.CourseId)));
      _context.SaveChanges();
    
    }
    */
    
  }

  