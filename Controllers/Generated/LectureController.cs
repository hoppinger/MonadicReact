using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Hosting;
using SendGrid;
using SendGrid.Helpers.Mail;
using MonadicComponents;
using MonadicComponents.Models;
using MonadicComponents.Filters;


[Route("/[controller]")]
  public class LecturesController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly MonadicComponentsContext _context;
    public IHostingEnvironment env;

    public LecturesController(MonadicComponentsContext context, IHostingEnvironment env, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
      this.env = env;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}")]
    public IActionResult View(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      

      ViewData["id"] = id;
      ViewData["Page"] = "Lectures/View";
      return View();
    }
  }

  