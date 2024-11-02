using API.Controllers.Common;
using API.Extensions;
using Application.DTOs.AuthService;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AuthController : MentalHeathControllerBase
{
    private readonly IAuthService _authService;
    
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }
    
    // POST /auth/login
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] AuthenticationRequestDto request)
    {
        var result = await _authService.AuthenticateAsync(request);
        return result.ReturnFromGet();
    }
}