using API.Extensions;
using Application.DTOs.AuthService;
using Application.Interfaces;
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
    public async Task<IActionResult> Login([FromBody] AuthenticationRequestDto request)
    {
        var result = await _authService.AuthenticateAsync(request);
        return result.ReturnFromGet();
    }
}