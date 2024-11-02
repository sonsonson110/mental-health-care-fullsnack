using Domain.Entities;
using LanguageExt.Common;
using Microsoft.AspNetCore.Identity;

namespace Application.Interfaces;

public interface IIdentityService
{
    Task<User?> FindUserByIdAsync(Guid userId);
    Task<User?> FindUserByNameAsync(string userName);
    
    Task<IdentityResult> CreateUserAsync(User user, string password);
    Task<IdentityResult> UpdateUserAsync(User user);
    
    Task<SignInResult> CheckPasswordSignInAsync(User user, string password);
    Task<bool> CheckUserPasswordAsync(User user, string password);
    Task<IdentityResult> UpdateSecurityStampAsync(User user);
    
    Task<IdentityResult> AddUserToRoleAsync(User user, string role);
    Task<IdentityResult> AddUserToRolesAsync(User user, IEnumerable<string> roles);
    Task<IdentityResult> RemoveUserFromRoleAsync(User user, string role);
    Task<IList<string>> GetUserRolesAsync(User user);
}