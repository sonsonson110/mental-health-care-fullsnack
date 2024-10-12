using Application.DTOs.AuthService;
using LanguageExt.Common;

namespace Application.Interfaces;

public interface IAuthService
{
    Task<Result<AuthenticationResponseDto>> AuthenticateAsync(AuthenticationRequestDto request);
}