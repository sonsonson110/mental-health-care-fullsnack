using API.Extensions;
using Application.DTOs.UserService;
using Application.Services.Interfaces;
using Infrastructure.FileStorage;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class UsersController : MentalHeathControllerBase
{
    private readonly IUserService _userService;


    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    // POST: /users/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserRequestDto request)
    {
        var result = await _userService.RegisterUserAsync(request);
        return result.ReturnFromGet();
    }
}