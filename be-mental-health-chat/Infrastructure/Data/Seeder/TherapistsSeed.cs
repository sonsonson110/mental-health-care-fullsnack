using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Data.Seeder;

internal static class TherapistsSeed
{
    internal static async Task<Therapist> Seed(MentalHealthContext context, UserManager<User> userManager,
        List<IssueTag> issueTags)
    {
        var therapist = new Therapist
        {
            Id = Guid.Parse("6dbf3d30-47af-404e-a5c0-2d122f8e5c1f"),
            FirstName = "Sarah",
            LastName = "Johnson",
            Gender = Gender.FEMALE,
            DateOfBirth = new DateOnly(1980, 3, 15),
            Email = "sarah.johnson@example.com",
            PhoneNumber = "1234567890",
            IsOnline = true,
            TimeZoneId = "SE Asia Standard Time",
            Bio =
                "Experienced therapist specializing in anxiety and depression, with a focus on cognitive-behavioral therapy.",
            Educations =
            [
                new Education
                {
                    Id = Guid.NewGuid(),
                    Institution = "Curabitur vel sapien in ipsum pulvinar eleifend",
                    Degree = "Curabitur vel sapien",
                    Major = "Curabitur",
                    StartDate = DateOnly.MinValue,
                    EndDate = DateOnly.MaxValue
                },
                new Education
                {
                    Id = Guid.NewGuid(),
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
                    Id = Guid.NewGuid(),
                    Organization = "Lorem ipsum dolor sit amet",
                    Position = "Lorem ipsum",
                    Description =
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud",
                    StartDate = DateOnly.MinValue,
                    EndDate = DateOnly.MaxValue
                },

                new Experience
                {
                    Id = Guid.NewGuid(),
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
                    Id = Guid.NewGuid(),
                    Name = "Aenean iaculis id ipsum et vulputate",
                    IssuingOrganization = "Aenean iaculis id ipsum et vulputate",
                    DateIssued = DateOnly.MinValue,
                    ExpirationDate = DateOnly.MaxValue
                },
                new Certification
                {
                    Id = Guid.NewGuid(),
                    Name = "Etiam tempus ultrices accumsan",
                    IssuingOrganization = "Etiam tempus ultrices accumsan",
                    DateIssued = DateOnly.MinValue,
                    ExpirationDate = DateOnly.MaxValue
                },
            ],
            UserName = "sarah.johnson"
        };
        var result = await userManager.CreateAsync(therapist, "Password@123");
        if (result.Succeeded)
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
            throw new Exception($"Failed to create user: {result.Errors.First().Description}");
        }

        return therapist;
    }
}