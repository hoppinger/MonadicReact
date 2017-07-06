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


  [Route("api/v1/Course")]
  public class CourseApiController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly MonadicComponentsContext _context;
    private IHostingEnvironment env;

    public CourseApiController(MonadicComponentsContext context, IHostingEnvironment env, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
      this.env = env;
    }

    public bool ApiTokenValid => RestrictToUserTypeAttribute.ApiToken != null &&
        HttpContext.Request.Headers["ApiToken"] == RestrictToUserTypeAttribute.ApiToken;

    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Course_id}/HomePage_Courses")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<HomePage> GetHomePage_Courses(int Course_id, [FromQuery] int page_index, [FromQuery] int page_size = 25 )
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = ApiTokenValid ? _context.Course : _context.Course;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Course_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<MonadicComponents.Models.HomePage>() // B
              .AsQueryable()
              .Select(MonadicComponents.Models.HomePage.FilterViewableAttributes())
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, MonadicComponents.Models.HomePage.WithoutImages, item => item , null);
      var allowed_targets = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var editable_targets = ApiTokenValid ? _context.HomePage : (_context.HomePage);
      var can_edit_by_token = ApiTokenValid || true;
      var items = (from target in allowed_targets
              select target).OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
              .Select(MonadicComponents.Models.HomePage.FilterViewableAttributes())
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, MonadicComponents.Models.HomePage.WithoutImages, item => item , null);
    }

    [HttpGet("{Course_id}/HomePage_Courses/{HomePage_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*HomePage*/ GetHomePage_CourseById(int Course_id, int HomePage_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = ApiTokenValid ? _context.Course : _context.Course;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Course_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return NotFound();
      var allowed_targets = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var item = (from target in allowed_targets
              select target).OrderBy(i => i.CreatedDate)
              .Select(MonadicComponents.Models.HomePage.FilterViewableAttributes())
              .FirstOrDefault(t => t.Id == HomePage_id);
      if (item == null) return NotFound();
      item = MonadicComponents.Models.HomePage.WithoutImages(item);
      return Ok(item);
    }

    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Course_id}/Course_Lectures")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Lecture> GetCourse_Lectures(int Course_id, [FromQuery] int page_index, [FromQuery] int page_size = 25 )
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = ApiTokenValid ? _context.Course : _context.Course;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Course_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<MonadicComponents.Models.Lecture>() // B
              .AsQueryable()
              .Select(MonadicComponents.Models.Lecture.FilterViewableAttributes())
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, MonadicComponents.Models.Lecture.WithoutImages, item => item , null);
      var allowed_targets = ApiTokenValid ? _context.Lecture : _context.Lecture;
      var editable_targets = ApiTokenValid ? _context.Lecture : (_context.Lecture);
      var can_edit_by_token = ApiTokenValid || true;
      var items = (from link in _context.Course_Lecture
              where link.CourseId == source.Id
              from target in allowed_targets
              where link.LectureId == target.Id
              select target).OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
              .Select(MonadicComponents.Models.Lecture.FilterViewableAttributes())
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, MonadicComponents.Models.Lecture.WithoutImages, item => item , null);
    }

    [HttpGet("{Course_id}/Course_Lectures/{Lecture_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*Lecture*/ GetCourse_LectureById(int Course_id, int Lecture_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = ApiTokenValid ? _context.Course : _context.Course;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Course_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return NotFound();
      var allowed_targets = ApiTokenValid ? _context.Lecture : _context.Lecture;
      var item = (from link in _context.Course_Lecture
              where link.CourseId == source.Id
              from target in allowed_targets
              where link.LectureId == target.Id
              select target).OrderBy(i => i.CreatedDate)
              .Select(MonadicComponents.Models.Lecture.FilterViewableAttributes())
              .FirstOrDefault(t => t.Id == Lecture_id);
      if (item == null) return NotFound();
      item = MonadicComponents.Models.Lecture.WithoutImages(item);
      return Ok(item);
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Course_id}/unlinked/Course_Lectures")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Lecture> GetUnlinkedCourse_Lectures(int Course_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = ApiTokenValid ? _context.Course : _context.Course;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Course_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return Enumerable.Empty<MonadicComponents.Models.Lecture>()
              .AsQueryable()
              .Select(MonadicComponents.Models.Lecture.FilterViewableAttributes())
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, MonadicComponents.Models.Lecture.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Lecture : _context.Lecture;
      var editable_targets = ApiTokenValid ? _context.Lecture : (_context.Lecture);
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Course_Lecture.Any(link => link.CourseId == source.Id && link.LectureId == target.Id) &&
              (from link in _context.Course_Lecture
                where link.LectureId == target.Id
                from s in _context.Course
                where link.CourseId == s.Id
                select s).Count() < 1
              select target).OrderBy(i => i.CreatedDate)
              .Select(MonadicComponents.Models.Lecture.FilterViewableAttributes())
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, MonadicComponents.Models.Lecture.WithoutImages, item => item);
    }

    bool CanAdd_Course_Course_Lectures(Course source) {
      return true;
    }

    bool CanAdd_Lecture_Course_Lectures(Lecture target) {
      return (from link in _context.Course_Lecture
           where link.LectureId == target.Id
           from source in _context.Course
           where link.CourseId == source.Id
           select source).Count() < 1;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Course_id}/Course_Lectures_Lecture")]
    public IActionResult /*IEnumerable<Lecture>*/ CreateNewCourse_Lecture_Lecture(int Course_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = ApiTokenValid ? _context.Course : _context.Course;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Course_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Course_Lectures");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Course_Course_Lectures(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Course_Lectures");
      var new_target = new Lecture() { CreatedDate = DateTime.Now, Id = _context.Lecture.Max(i => i.Id) + 1 };
      _context.Lecture.Add(new_target);
      _context.SaveChanges();
      var link = new Course_Lecture() { Id = _context.Course_Lecture.Max(l => l.Id) + 1, CourseId = source.Id, LectureId = new_target.Id };
      _context.Course_Lecture.Add(link);
      _context.SaveChanges();
      return Ok(new Lecture[] { new_target });
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Course_id}/Course_Lectures/{Lecture_id}")]
    public IActionResult LinkWithCourse_Lecture(int Course_id, int Lecture_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Course;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Course_id);
      var allowed_targets = _context.Lecture;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Lecture_id);
      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Course_Course_Lectures(source) || !can_link_by_token || !can_edit_source_by_token || !can_edit_target_by_token)
        return BadRequest();
        // throw new Exception("Cannot add item to relation Course_Lectures");
      if (!CanAdd_Lecture_Course_Lectures(target))
        return BadRequest();
        // throw new Exception("Cannot add item to relation Course_Lectures");
      var link = new Course_Lecture() { Id = _context.Course_Lecture.Max(i => i.Id) + 1, CourseId = source.Id, LectureId = target.Id };
      _context.Course_Lecture.Add(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpDelete("{Course_id}/Course_Lectures/{Lecture_id}")]
    public IActionResult UnlinkFromCourse_Lecture(int Course_id, int Lecture_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Course;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Course_id);
      var allowed_targets = _context.Lecture;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Lecture_id);
      var link = _context.Course_Lecture.FirstOrDefault(l => l.CourseId == source.Id && l.LectureId == target.Id);

      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_unlink_by_token = ApiTokenValid || true;
      if (!can_unlink_by_token || !can_edit_source_by_token || !can_edit_target_by_token) return Unauthorized(); // throw new Exception("Cannot remove item from relation Course_Lectures");
      _context.Course_Lecture.Remove(link);
      var target_to_remove = _context.Lecture.FirstOrDefault(t => t.Id == Lecture_id);
      
      _context.Lecture.Remove(target_to_remove);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*ItemWithEditable<Course>*/ GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = ApiTokenValid ? _context.Course : _context.Course;
      var editable_items = ApiTokenValid ? _context.Course : _context.Course;
      var item_full = allowed_items.FirstOrDefault(e => e.Id == id);
      if (item_full == null) return NotFound();
      var item = MonadicComponents.Models.Course.FilterViewableAttributesLocal()(item_full);
      item = MonadicComponents.Models.Course.WithoutImages(item);
      return Ok(new ItemWithEditable<Course>() {
        Item = item,
        Editable = editable_items.Any(e => e.Id == item.Id) });
    }

[RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}/WithPictures")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*ItemWithEditable<Course>*/ GetByIdWithPictures(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = ApiTokenValid ? _context.Course : _context.Course;
      var editable_items = ApiTokenValid ? _context.Course : _context.Course;
      var item_full = allowed_items.FirstOrDefault(e => e.Id == id);
      if (item_full == null) return NotFound();
      var item = MonadicComponents.Models.Course.FilterViewableAttributesLocal()(item_full);
      return Ok(new ItemWithEditable<Course>() {
        Item = item,
        Editable = editable_items.Any(e => e.Id == item.Id) });
    }
    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}/Logo")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*Container<string>*/ GetLogoById(int id)
    {
var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = ApiTokenValid ? _context.Course : _context.Course;
      var full_item = allowed_items.FirstOrDefault(e => e.Id == id);
      if (full_item == null) return NotFound();
      var item = MonadicComponents.Models.Course.FilterViewableAttributesLocal()(full_item);
      return Ok(new Container<string> { Content = item.Logo });
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPut("{id}/Logo")]
    [ValidateAntiForgeryToken]
    public void ChangeLogo(int id, [FromBody] Container<string> Logo)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = ApiTokenValid ? _context.Course : _context.Course;
      if (!allowed_items.Any(i => i.Id == id)) return;
      var item = new Course() { Id = id, Logo = Logo.Content };
      _context.Course.Update(item);
      
      _context.Entry(item).Property(x => x.Name).IsModified = false;
      _context.Entry(item).Property(x => x.Points).IsModified = false;
      _context.Entry(item).Property(x => x.CreatedDate).IsModified = false;
      _context.Entry(item).Property(x => x.Logo).IsModified = true;
      _context.SaveChanges();
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult /*Course*/ Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var can_create_by_token = ApiTokenValid || true;
      if (!can_create_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized create attempt");
      var item = new Course() { CreatedDate = DateTime.Now, Id = _context.Course.Max(i => i.Id) + 1 };
      _context.Course.Add(MonadicComponents.Models.Course.FilterViewableAttributesLocal()(item));
      _context.SaveChanges();
      item = MonadicComponents.Models.Course.WithoutImages(item);
      return Ok(item);
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public IActionResult Update([FromBody] Course item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = ApiTokenValid ? _context.Course : _context.Course;
      if (!allowed_items.Any(i => i.Id == item.Id)) return Unauthorized();
      var new_item = item;
      
      var can_edit_by_token = ApiTokenValid || true;
      if (item == null || !can_edit_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized edit attempt");
      _context.Update(new_item);
      _context.Entry(new_item).Property(x => x.Logo).IsModified = false;
      _context.Entry(new_item).Property(x => x.CreatedDate).IsModified = false;
      _context.SaveChanges();
      return Ok();
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPut("WithPictures")]
    [ValidateAntiForgeryToken]
    public IActionResult UpdateWithPictures([FromBody] Course item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = ApiTokenValid ? _context.Course : _context.Course;
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

    [RestrictToUserType(new string[] {"*"})]
    [HttpDelete("{id}")]
    [ValidateAntiForgeryToken]
    public IActionResult Delete(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = ApiTokenValid ? _context.Course : _context.Course;
      var item = _context.Course.FirstOrDefault(e => e.Id == id);
      var can_delete_by_token = ApiTokenValid || true;
      if (item == null || !can_delete_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized delete attempt");
      
      if (!allowed_items.Any(a => a.Id == item.Id)) return Unauthorized(); // throw new Exception("Unauthorized delete attempt");
      
      

      var targets_to_remove_0 = _context.Lecture.Where(t => _context.Course_Lecture.Any(l => l.CourseId == item.Id && l.LectureId == t.Id));
      
      _context.Lecture.RemoveRange(targets_to_remove_0);

      _context.Course.Remove(item);
      _context.SaveChanges();
      return Ok();
    }


    [RestrictToUserType(new string[] {"*"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Course> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25 )
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = ApiTokenValid ? _context.Course : _context.Course;
      var editable_items = ApiTokenValid ? _context.Course : _context.Course;
      var can_edit_by_token = ApiTokenValid || true;
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true;
      var items = allowed_items.OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
        .Select(MonadicComponents.Models.Course.FilterViewableAttributes())
        .Select(s => Tuple.Create(s, can_edit_by_token && editable_items.Any(es => es.Id == s.Id)))
        .Paginate(can_create_by_token, can_delete_by_token, false, page_index, page_size, MonadicComponents.Models.Course.WithoutImages, item => item , null );
    }

    


    
  }

  