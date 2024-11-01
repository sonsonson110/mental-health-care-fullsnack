using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Data.Seeder;

internal static class UsersSeed
{
    internal static async Task<List<User>> Seed(MentalHealthContext context, UserManager<User> userManager, List<IssueTag> issueTags)
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
        
        // add therapist
        var therapist = new User
        {
            Id = Guid.Parse("6dbf3d30-47af-404e-a5c0-2d122f8e5c1f"),
            FirstName = "Sarah",
            LastName = "Johnson",
            Gender = Gender.FEMALE,
            DateOfBirth = new DateOnly(1980, 3, 15),
            Email = "sarah.johnson@example.com",
            PhoneNumber = "123456789",
            IsOnline = true,
            TimeZoneId = "SE Asia Standard Time",
            IsTherapist = true,
            Bio =
                "Experienced therapist specializing in anxiety and depression, with a focus on cognitive-behavioral therapy.",
            Educations =
            [
                new Education
                {
                    Id = Guid.Parse("62f2da5c-454d-402b-b585-61e953ce8f0d"),
                    Institution = "Curabitur vel sapien in ipsum pulvinar eleifend",
                    Degree = "Curabitur vel sapien",
                    Major = "Curabitur",
                    StartDate = DateOnly.MinValue,
                    EndDate = DateOnly.MaxValue
                },
                new Education
                {
                    Id = Guid.Parse("6b81873d-d876-444e-a3f9-fd94faaeb35d"),
                    Institution = "Mauris vel mauris maximus, egestas augue sit amet, pretium turpis",
                    Degree = "Mauris vel mauris",
                    Major = "Mauris",
                    StartDate = DateOnly.MinValue,
                    EndDate = DateOnly.MaxValue
                },
            ],
            Experiences =
            [
                new Experience
                {
                    Id = Guid.Parse("8ebb5ff9-cda0-44fe-b63a-e0e105b54e40"),
                    Organization = "Lorem ipsum dolor sit amet",
                    Position = "Lorem ipsum",
                    Description =
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud",
                    StartDate = DateOnly.MinValue,
                    EndDate = DateOnly.MaxValue
                },

                new Experience
                {
                    Id = Guid.Parse("cb08c9e4-93ea-4dc5-971a-e807cd1837da"),
                    Organization = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem",
                    Position = "Sed ut perspiciatis",
                    Description =
                        "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur",
                    StartDate = DateOnly.MaxValue,
                    EndDate = null
                }
            ],
            Certifications =
            [
                new Certification
                {
                    Id = Guid.Parse("49a18291-52ea-44d6-bc41-4e111aa417ab"),
                    Name = "Aenean iaculis id ipsum et vulputate",
                    IssuingOrganization = "Aenean iaculis id ipsum et vulputate",
                    DateIssued = DateOnly.MinValue,
                    ExpirationDate = DateOnly.MaxValue
                },
                new Certification
                {
                    Id = Guid.Parse("f2520548-9af0-4d67-87e6-d15451f17ba5"),
                    Name = "Etiam tempus ultrices accumsan",
                    IssuingOrganization = "Etiam tempus ultrices accumsan",
                    DateIssued = DateOnly.MinValue,
                    ExpirationDate = DateOnly.MaxValue
                },
            ],
            UserName = "sarah.johnson"
        };
        var therapistResult = await userManager.CreateAsync(therapist, "Password@123");
        if (therapistResult.Succeeded)
        {
            await userManager.AddToRolesAsync(therapist, ["User", "Therapist"]);
            
            // Add therapist issue tags
            var therapistIssueTags = issueTags.Select(x => new TherapistIssueTag
            {
                TherapistId = therapist.Id,
                IssueTagId = x.Id
            }).ToList();
            context.TherapistIssueTags.AddRange(therapistIssueTags);
            await context.SaveChangesAsync();
        }
        else
        {
            throw new Exception($"Failed to create user: {therapistResult.Errors.First().Description}");
        }

        return [user, therapist];
    }
}