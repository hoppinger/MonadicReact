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
using System.IO;

[Route("api/v1/keep_alive")]
public class KeepAliveApiController : Controller
{
  private readonly MailOptions _mailOptions;
  public readonly MonadicComponentsContext _context;

  public KeepAliveApiController(MonadicComponentsContext context, IOptions<MailOptions> mailOptionsAccessor)
  {
    _context = context;
    _mailOptions = mailOptionsAccessor.Value;
  }

  [HttpGet("ping")]
  [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
  public IActionResult Ping() {
    return Ok();
  }

}
