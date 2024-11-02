using Application.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Data.Services;

public class IdentityService : IIdentityService
{
    private readonly SignInManager<User> _signInManager;
    private readonly UserManager<User> _userManager;

    public IdentityService(SignInManager<User> signInManager,
        UserManager<User> userManager)
    {
        _signInManager = signInManager;
        _userManager = userManager;
    }

    public Task<User?> FindUserByIdAsync(Guid userId)
    {
        return _userManager.FindByIdAsync(userId.ToString());
    }

    public Task<User?> FindUserByNameAsync(string userName)
    {
        return _userManager.FindByNameAsync(userName);
    }

    public Task<IdentityResult> CreateUserAsync(User user, string password)
    {
        return _userManager.CreateAsync(user, password);
    }

    public Task<IdentityResult> UpdateUserAsync(User user)
    {
        return _userManager.UpdateAsync(user);
    }

    public Task<SignInResult> CheckPasswordSignInAsync(User user, string password)
    {
        return _signInManager.CheckPasswordSignInAsync(user, password, false);
    }

    public Task<bool> CheckUserPasswordAsync(User user, string password)
    {
        return _userManager.CheckPasswordAsync(user, password);
    }

    public Task<IdentityResult> UpdateSecurityStampAsync(User user)
    {
        return _userManager.UpdateSecurityStampAsync(user);
    }

    public Task<IdentityResult> AddUserToRoleAsync(User user, string role)
    {
        return _userManager.AddToRoleAsync(user, role);
    }

    public Task<IdentityResult> AddUserToRolesAsync(User user, IEnumerable<string> roles)
    {
        return _userManager.AddToRolesAsync(user, roles);
    }

    public Task<IdentityResult> RemoveUserFromRoleAsync(User user, string role)
    {
        return _userManager.RemoveFromRoleAsync(user, role);
    }

    public async Task<IList<string>> GetUserRolesAsync(User user)
    {
        return await _userManager.GetRolesAsync(user);
    }
}