using Application.DTOs.AuthService;
using Application.Interfaces;
using Application.Services.Interfaces;
using Domain.Entities;
using LanguageExt.Common;
using Microsoft.AspNetCore.Identity;

namespace Application.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly IJwtGenerator _jwtGenerator;
    private readonly SignInManager<User> _signInManager;

    public AuthService(
        UserManager<User> userManager,
        IJwtGenerator jwtGenerator,
        SignInManager<User> signInManager)
    {
        _userManager = userManager;
        _jwtGenerator = jwtGenerator;
        _signInManager = signInManager;
    }

    public async Task<Result<AuthenticationResponseDto>> AuthenticateAsync(AuthenticationRequestDto request)
    {
        var user = await _userManager.FindByNameAsync(request.UserName);

        // validate
        if (user == null)
        {
            return new Result<AuthenticationResponseDto>(new NotFoundException("User name is not found"));
        }

        var passwordSignInResult = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!passwordSignInResult.Succeeded)
        {
            return new Result<AuthenticationResponseDto>(
                new BadRequestException("Invalid user name or password", null));
        }

        var userRoles = await _userManager.GetRolesAsync(user);
        return new AuthenticationResponseDto { Token = _jwtGenerator.GenerateJwtToken(user, userRoles) };
    }
}