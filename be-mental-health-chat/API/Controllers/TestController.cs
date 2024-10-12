using Domain.Entities;
using Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class TestController : MentalHeathControllerBase
{
    private readonly IGeminiService _geminiService;
    
    public TestController(IGeminiService geminiService)
    {
        _geminiService = geminiService;
    }
    
    [HttpGet]
    public async Task<IActionResult> Test()
    {
        return Ok();
    }
}