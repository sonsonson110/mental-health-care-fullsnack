using Application.DTOs.AuthService;
using LanguageExt.Common;

namespace Application.Services.Interfaces;

public interface IAuthService
{
    Task<Result<AuthenticationResponseDto>> AuthenticateAsync(AuthenticationRequestDto request);
}