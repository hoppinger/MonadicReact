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


namespace MonadicComponents.Controllers
{
  public class HomeController : Controller
  {
    private readonly MailOptions _mailOptions;
    private readonly MonadicComponentsContext _context;

    public HomeController(MonadicComponentsContext context, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
    }

    [Route("")]
    [HttpGet("Home")]
    [HttpGet("Home/Index")]
    public IActionResult Index()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);


      ViewData["id"] = _context.HomePage.First().Id;

      ViewData["Page"] = "Home/Index";
      return View();
    }

    [HttpGet("Home/Error")]
    public IActionResult Error()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);


      ViewData["Page"] = "Home/Error";
      return View();
    }

    [HttpGet("Home/Unauthorised")]
    public IActionResult Unauthorised()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);


      ViewData["Page"] = "Home/Unauthorised";
      return View();
    }
  }
}
