using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace HumanitarianCrisisPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    protected Guid CurrentUserId
    {
        get
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                     ?? User.FindFirst("sub")?.Value;
            return Guid.TryParse(claim, out var id) ? id : Guid.Empty;
        }
    }

    protected string CurrentUserRole =>
        User.FindFirst(ClaimTypes.Role)?.Value
        ?? User.FindFirst("role")?.Value
        ?? string.Empty;

    protected string CurrentUserName =>
        User.FindFirst(ClaimTypes.Name)?.Value
        ?? User.FindFirst("name")?.Value
        ?? "Ishara Senanayake";
}
