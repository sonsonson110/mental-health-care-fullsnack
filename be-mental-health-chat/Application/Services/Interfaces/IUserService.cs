using Application.DTOs.UserService;
using LanguageExt.Common;

namespace Application.Services.Interfaces;

public interface IUserService
{
    Task<Result<bool>> RegisterUserAsync(RegisterUserRequestDto request);
    Task<Result<UserDetailResponseDto>> GetUserDetailAsync(Guid userId);
    Task<Result<bool>> UpdateUserAsync(Guid userId, UpdateUserRequestDto request);
    Task<Result<bool>> ChangePasswordAsync(Guid userId, ChangePasswordRequestDto request);
    Task<Result<bool>> DeleteUserAsync(Guid userId, DeleteUserRequestDto request);
}