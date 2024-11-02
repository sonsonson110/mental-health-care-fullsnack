using Application.DTOs.AuthService;
using Application.Interfaces;
using Application.Services.Interfaces;
using LanguageExt.Common;

namespace Application.Services;

public class AuthService : IAuthService
{
    private readonly IIdentityService _identityService;
    private readonly IJwtService _jwtService;

    public AuthService(
        IIdentityService identityService,
        IJwtService jwtService)
    {
        _identityService = identityService;
        _jwtService = jwtService;
    }

    public async Task<Result<AuthenticationResponseDto>> AuthenticateAsync(AuthenticationRequestDto request)
    {
        var user = await _identityService.FindUserByNameAsync(request.UserName);

        // validate
        if (user == null)
        {
            return new Result<AuthenticationResponseDto>(new NotFoundException("User name is not found"));
        }

        var passwordSignInResult = await _identityService.CheckPasswordSignInAsync(user, request.Password);
        if (!passwordSignInResult.Succeeded)
        {
            return new Result<AuthenticationResponseDto>(
                new BadRequestException("Invalid user name or password"));
        }
        
        if (user.IsDeleted)
        {
            return new Result<AuthenticationResponseDto>(
                new BadRequestException("User has been deleted"));
        }

        var userRoles = await _identityService.GetUserRolesAsync(user);
        return new AuthenticationResponseDto { Token = _jwtService.GenerateJwtToken(user, userRoles) };
    }
}