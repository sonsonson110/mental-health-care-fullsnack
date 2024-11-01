using API.Controllers.Common;
using API.Extensions;
using Application.DTOs.UserService;
using Application.Services.Interfaces;
using Infrastructure.FileStorage;
using Microsoft.AspNetCore.Authorization;
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
    
    // GET: /users/me
    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetUserDetail()
    {
        var result = await _userService.GetUserDetailAsync(GetUserId());
        return result.ReturnFromGet();
    }
    
    // PUT: /users/me
    [Authorize]
    [HttpPut("me")]
    public async Task<IActionResult> UpdateUser([FromBody] UpdateUserRequestDto request)
    {
        var result = await _userService.UpdateUserAsync(GetUserId(), request);
        return result.ReturnFromGet();
    }
    
    // PUT: /users/me/change-password
    [Authorize]
    [HttpPut("me/change-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto request)
    {
        var result = await _userService.ChangePasswordAsync(GetUserId(), request);
        return result.ReturnFromGet();
    }
    
    // POST: /users/me/delete
    [Authorize]
    [HttpPost("me/delete")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> DeleteUser([FromBody] DeleteUserRequestDto request)
    {
        var result = await _userService.DeleteUserAsync(GetUserId(), request);
        return result.ReturnFromGet();
    }
}