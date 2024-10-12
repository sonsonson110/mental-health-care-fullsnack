using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;

namespace Infrastructure.Data.SeedData;

internal static class UsersSeed
{
    internal static List<User> Seed(MentalHealthContext context, IPasswordHasher passwordHasher)
    {
        var users = new List<User>
        {
            new User
            {
                Id = Guid.NewGuid(),
                FirstName = "John",
                LastName = "Doe",
                Gender = Gender.MALE,
                DateOfBirth = new DateOnly(1985, 5, 15),
                Email = "john.doe@example.com",
                PhoneNumber = "+1234567890",
                PasswordHash = passwordHasher.HashPassword("password123"),
                IsOnline = false,
                UserType = UserType.USER
            },
            new User
            {
                Id = Guid.NewGuid(),
                FirstName = "Jane",
                LastName = "Smith",
                Gender = Gender.FEMALE,
                DateOfBirth = new DateOnly(1990, 8, 22),
                Email = "jane.smith@example.com",
                PhoneNumber = "+1987654321",
                PasswordHash = passwordHasher.HashPassword("securePass456"),
                IsOnline = true,
                UserType = UserType.USER
            },
            new User
            {
                Id = Guid.NewGuid(),
                FirstName = "Michael",
                LastName = "Johnson",
                Gender = Gender.MALE,
                DateOfBirth = new DateOnly(1988, 3, 10),
                Email = "michael.johnson@example.com",
                PhoneNumber = "+1122334455",
                PasswordHash = passwordHasher.HashPassword("mjPass789"),
                IsOnline = false,
                UserType = UserType.USER
            },
            new User
            {
                Id = Guid.NewGuid(),
                FirstName = "Emily",
                LastName = "Brown",
                Gender = Gender.FEMALE,
                DateOfBirth = new DateOnly(1992, 11, 5),
                Email = "emily.brown@example.com",
                PhoneNumber = "+1654987321",
                PasswordHash = passwordHasher.HashPassword("brownEmily321"),
                IsOnline = true,
                UserType = UserType.USER
            },
            new User
            {
                Id = Guid.NewGuid(),
                FirstName = "David",
                LastName = "Wilson",
                Gender = Gender.MALE,
                DateOfBirth = new DateOnly(1983, 7, 30),
                Email = "david.wilson@example.com",
                PhoneNumber = "+1369852147",
                PasswordHash = passwordHasher.HashPassword("wilsonDavid987"),
                IsOnline = false,
                UserType = UserType.USER
            }
        };

        context.Users.AddRange(users);
        context.SaveChanges();
        return users;
    }
}