using Application.DTOs.AuthService;
using Application.Interfaces;
using Application.Services.Interfaces;
using Domain.Interfaces;
using LanguageExt.Common;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class AuthService : IAuthService
{
    private readonly IPasswordHasher _passwordHasher;
    private readonly IMentalHealthContext _context;
    private readonly IJwtGenerator _jwtGenerator;

    public AuthService(
        IMentalHealthContext context, 
        IPasswordHasher passwordHasher, 
        IJwtGenerator jwtGenerator)
    {
        _passwordHasher = passwordHasher;
        _context = context;
        _jwtGenerator = jwtGenerator;
    }

    public async Task<Result<AuthenticationResponseDto>> AuthenticateAsync(AuthenticationRequestDto request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == request.Email);
        // validate
        if (user == null)
        {
            return new Result<AuthenticationResponseDto>(new NotFoundException("Email not found"));
        }

        if (!_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            return new Result<AuthenticationResponseDto>(new BadRequestException("Password is incorrect", null));
        }

        return new AuthenticationResponseDto { Token = _jwtGenerator.GenerateJwtToken(user) };
    }
}