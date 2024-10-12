using Application;
using LanguageExt.Common;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API.Extensions;

public static class ControllerExtension
{
    public static IActionResult ReturnFromGet<TResult>(this Result<TResult> result)
    {
        return result.Match<IActionResult>(data =>
        {
            if (data is bool)
            {
                return new OkResult();
            }

            return new OkObjectResult(data);
        }, HandleException);
    }
    
    public static IActionResult ReturnFromPost<TResult>(this Result<TResult> result)
    {
        return result.Match<IActionResult>(data =>
        {
            if (data is bool)
            {
                return new CreatedResult();
            }

            return new CreatedResult((string?)null, data);
        }, HandleException);
    }
    
    private static IActionResult HandleException(Exception exception)
    {
        return exception switch
        {
            BadRequestException validationException => new BadRequestObjectResult(validationException.ToProblemDetails()),
            NotFoundException notFoundException => new NotFoundObjectResult(notFoundException.ToProblemDetails()),
            _ => new StatusCodeResult(500)
        };
    }
}