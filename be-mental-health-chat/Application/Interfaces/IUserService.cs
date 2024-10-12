using Application.DTOs.UserService;
using LanguageExt.Common;

namespace Application.Interfaces;

public interface IUserService
{
    Task<Result<bool>> RegisterUserAsync(RegisterUserRequestDto request);
}