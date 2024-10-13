using System.Security.Claims;
using API.Extensions;
using Application;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace API.Hubs.Common;

[Authorize]
public class HubBase : Hub
{
    protected Guid GetSessionUserIdentifier() => Guid.Parse(Context.User!.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    protected string GetSessionUserEmail() => Context.User!.FindFirst(ClaimTypes.Email)!.Value;
    
    protected async Task HandleException(string method, Exception exception)
    {
        var problemDetails = exception switch
        {
            NotFoundException notFoundException => notFoundException.ToProblemDetails(),
            BadRequestException badRequestException => badRequestException.ToProblemDetails(),
            _ => new ProblemDetails { Status = 500, Title = "Internal Server Error", Detail = "An unexpected error occurred." }
        };
        await Clients.Caller.SendAsync(method, problemDetails);
    }
}