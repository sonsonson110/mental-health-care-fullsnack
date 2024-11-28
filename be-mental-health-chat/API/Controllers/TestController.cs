using Application.Interfaces;
using Domain.Common;
using Infrastructure.Integrations.Common;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("sys")]
public class TestController
{
    [HttpGet("health")]
    public IActionResult Get()
    {
        return new OkObjectResult(DateTime.UtcNow);
    }
}