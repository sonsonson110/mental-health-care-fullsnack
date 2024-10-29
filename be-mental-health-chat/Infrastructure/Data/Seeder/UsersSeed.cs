using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Data.Seeder;

internal static class UsersSeed
{
    internal static async Task<User> Seed(UserManager<User> userManager)
    {
        var user = new User
        {
            Id = Guid.Parse("a620b691-f136-4afc-811c-cd655e70cbdf"),
            FirstName = "John",
            LastName = "Doe",
            Gender = Gender.MALE,
            DateOfBirth = new DateOnly(1985, 5, 15),
            Email = "john.doe@example.com",
            PhoneNumber = "1234567890",
            IsOnline = false,
            TimeZoneId = "SE Asia Standard Time",
            UserName = "john.doe"
        };
        var result = await userManager.CreateAsync(user, "Password@123");
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(user, "User");
        }
        else
        {
            throw new Exception($"Failed to create user: {result.Errors.First().Description}");
        }
        return user;
    }
}