using API.Extensions;
using Application;
using Application.DTOs.UserService;
using Application.Interfaces;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class UserController : MentalHeathControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    // POST: /user/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserRequestDto request)
    {
        var result = await _userService.RegisterUserAsync(request);
        return result.ReturnFromGet();
    }
}