using Application;
using Microsoft.AspNetCore.Mvc;

namespace API.Extensions;

public static class ExceptionExtension
{
    public static ProblemDetails ToProblemDetails(this BadRequestException exception)
    {
        return new ProblemDetails
        {
            Title = "Validation failed",
            Status = 400,
            Detail = exception.Message,
            Extensions = { ["errors"] = exception.Errors }
        };
    }
    
    public static ProblemDetails ToProblemDetails(this NotFoundException exception)
    {
        return new ProblemDetails
        {
            Title = "Not found",
            Status = 404,
            Detail = exception.Message,
        };
    }
}