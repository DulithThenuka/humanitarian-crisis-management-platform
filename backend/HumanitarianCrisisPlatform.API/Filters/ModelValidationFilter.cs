using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using HumanitarianCrisisPlatform.Application.Common.Models;

namespace HumanitarianCrisisPlatform.API.Filters;

public class ModelValidationFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.ModelState.IsValid)
        {
            var errors = context.ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

            context.Result = new BadRequestObjectResult(Result.Failure(errors));
        }
    }

    public void OnActionExecuted(ActionExecutedContext context) { }
}
