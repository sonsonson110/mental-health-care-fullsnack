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
            if (data is bool b)
            {
                return b ? new OkResult() : new StatusCodeResult(500);
            }

            return new OkObjectResult(data);
        }, HandleException);
    }

    public static IActionResult ReturnFromPost<TResult>(this Result<TResult> result)
    {
        return result.Match<IActionResult>(data =>
        {
            if (data is bool b)
            {
                return b ? new CreatedResult() : new StatusCodeResult(500);
            }

            return new CreatedResult((string?)null, data);
        }, HandleException);
    }

    public static IActionResult ReturnFromPut<TResult>(this Result<TResult> result)
    {
        return result.Match<IActionResult>(data =>
        {
            if (data is bool b)
            {
                return b ? new NoContentResult() : new StatusCodeResult(500);
            }

            return new ObjectResult(data);
        }, HandleException);
    }

    private static IActionResult HandleException(Exception exception)
    {
        return exception switch
        {
            BadRequestException validationException => new BadRequestObjectResult(
                validationException.ToProblemDetails()),
            NotFoundException notFoundException => new NotFoundObjectResult(notFoundException.ToProblemDetails()),
            _ => new StatusCodeResult(500)
        };
    }
}