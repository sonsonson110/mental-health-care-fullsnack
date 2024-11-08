using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Data.Seeder;

internal static class UsersSeed
{
    internal static async Task<List<User>> Seed(MentalHealthContext context, UserManager<User> userManager)
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
            UserName = "john.doe",
            IsTherapist = false
        };
        var userResult = await userManager.CreateAsync(user, "Password@123");
        if (userResult.Succeeded)
        {
            await userManager.AddToRoleAsync(user, "User");
        }
        else
        {
            throw new Exception($"Failed to create user: {userResult.Errors.First().Description}");
        }
        
        var user2 = new User
        {
            Id = Guid.NewGuid(),
            FirstName = "John",
            LastName = "Doey",
            Gender = Gender.MALE,
            DateOfBirth = new DateOnly(1985, 5, 15),
            Email = "johnny.dang@example.com",
            PhoneNumber = "11234567890",
            IsOnline = false,
            TimeZoneId = "SE Asia Standard Time",
            UserName = "johnny.dang",
            IsTherapist = false
        };
        var user2Result = await userManager.CreateAsync(user2, "Password@123");
        if (user2Result.Succeeded)
        {
            await userManager.AddToRoleAsync(user2, "User");
        }
        else
        {
            throw new Exception($"Failed to create user: {user2Result.Errors.First().Description}");
        }

        return [user, user2];
    }
}