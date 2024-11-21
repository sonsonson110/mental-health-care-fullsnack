using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Data.Seeder;

internal static class UsersSeed
{
    internal static async Task<List<User>> Seed(MentalHealthContext context, UserManager<User> userManager)
    {
        const string seedPassword = "Password@123";
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
        await userManager.CreateAsync(user, seedPassword);
        await userManager.AddToRoleAsync(user, "User");

        var user2 = new User
        {
            Id = Guid.NewGuid(),
            FirstName = "Johnny",
            LastName = "Dang",
            Gender = Gender.MALE,
            DateOfBirth = new DateOnly(1985, 5, 15),
            Email = "johnny.dang@example.com",
            PhoneNumber = "11234567890",
            IsOnline = false,
            TimeZoneId = "SE Asia Standard Time",
            UserName = "johnny.dang",
            IsTherapist = false
        };
        await userManager.CreateAsync(user2, seedPassword);
        await userManager.AddToRoleAsync(user2, "User");

        var user3 = new User
        {
            Id = Guid.Parse("f759c089-6f46-4550-bfc7-ad96ae101df6"),
            FirstName = "Nguyen",
            LastName = "Son",
            Gender = Gender.MALE,
            DateOfBirth = new DateOnly(1985, 5, 15),
            Email = "pson141002@gmail.com",
            PhoneNumber = "00000000000",
            IsOnline = false,
            TimeZoneId = "SE Asia Standard Time",
            UserName = "pson141002",
            IsTherapist = false
        };
        await userManager.CreateAsync(user3, seedPassword);
        await userManager.AddToRoleAsync(user3, "User");

        return [user, user2, user3];
    }
}