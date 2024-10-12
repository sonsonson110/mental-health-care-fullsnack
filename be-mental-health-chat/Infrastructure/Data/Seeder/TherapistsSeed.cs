using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;

namespace Infrastructure.Data.SeedData;

internal static class TherapistsSeed
{
    private static readonly Random Random = new Random();

    internal static List<Therapist> Seed(MentalHealthContext context, IPasswordHasher passwordHasher,
        List<IssueTag> issueTags, List<User> users)
    {
        var therapists = new List<Therapist>
        {
            new Therapist
            {
                Id = Guid.NewGuid(),
                FirstName = "Sarah",
                LastName = "Johnson",
                Gender = Gender.FEMALE,
                DateOfBirth = new DateOnly(1980, 3, 15),
                Email = "sarah.johnson@example.com",
                PhoneNumber = "+1234567890",
                PasswordHash = passwordHasher.HashPassword("password123"),
                IsOnline = true,
                UserType = UserType.THERAPIST,
                Bio =
                    "Experienced therapist specializing in anxiety and depression, with a focus on cognitive-behavioral therapy.",
                Educations = CreateUniqueEducations(),
                Experiences = CreateUniqueExperiences(),
                Certifications = CreateUniqueCertifications(),
                Reviews = CreateUniqueReviews(users),
                IssueTags = issueTags
            },
            new Therapist
            {
                Id = Guid.NewGuid(),
                FirstName = "Michael",
                LastName = "Chen",
                Gender = Gender.MALE,
                DateOfBirth = new DateOnly(1975, 8, 22),
                Email = "michael.chen@example.com",
                PhoneNumber = "+1987654321",
                PasswordHash = passwordHasher.HashPassword("password456"),
                IsOnline = false,
                UserType = UserType.THERAPIST,
                Bio = "Compassionate therapist with a focus on relationship counseling and family therapy.",
                Educations = CreateUniqueEducations(),
                Experiences = CreateUniqueExperiences(),
                Certifications = CreateUniqueCertifications(),
                Reviews = CreateUniqueReviews(users),
                IssueTags = issueTags
            },
        };
        context.Therapists.AddRange(therapists);
        context.SaveChanges();

        return therapists;
    }

    private static List<Education> CreateUniqueEducations()
        {
            return new List<Education>
            {
                new Education
                {
                    Id = Guid.NewGuid(),
                    Institution = "Curabitur vel sapien in ipsum pulvinar eleifend",
                    Degree = "Curabitur vel sapien",
                    Major = "Curabitur",
                    StartDate = new DateOnly(1993, 9, 1),
                    EndDate = new DateOnly(1997, 5, 31)
                },
                new Education
                {
                    Id = Guid.NewGuid(),
                    Institution = "Mauris vel mauris maximus, egestas augue sit amet, pretium turpis",
                    Degree = "Mauris vel mauris",
                    Major = "Mauris",
                    StartDate = new DateOnly(1997, 9, 1),
                    EndDate = new DateOnly(1999, 6, 30)
                },
            };
        }
    

    private static List<Certification> CreateUniqueCertifications()
    {
        return new List<Certification>
        {
            new Certification
            {
                Id = Guid.NewGuid(),
                Name = "Aenean iaculis id ipsum et vulputate",
                IssuingOrganization = "Aenean iaculis id ipsum et vulputate",
                DateIssued = new DateOnly(2000, 1, 15),
                ExpirationDate = new DateOnly(2025, 1, 15)
            },
            new Certification
            {
                Id = Guid.NewGuid(),
                Name = "Etiam tempus ultrices accumsan",
                IssuingOrganization = "Etiam tempus ultrices accumsan",
                DateIssued = new DateOnly(2012, 5, 20),
                ExpirationDate = new DateOnly(2022, 5, 20)
            },
        };
    }

    private static List<Experience> CreateUniqueExperiences()
    {
        return
        [
            new Experience
            {
                Id = Guid.NewGuid(),
                Organization = "Lorem ipsum dolor sit amet",
                Position = "Lorem ipsum",
                Description =
                    $"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                StartDate = new DateOnly(2000 + Random.Next(10), Random.Next(1, 13), 1),
                EndDate = Random.Next(2) == 0 ? null : new DateOnly(2010 + Random.Next(14), Random.Next(1, 13), 1)
            },

            new Experience
            {
                Id = Guid.NewGuid(),
                Organization = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem",
                Position = "Sed ut perspiciatis",
                Description =
                    "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur",
                StartDate = new DateOnly(2005 + Random.Next(10), Random.Next(1, 13), 1),
                EndDate = null // Current job
            }
        ];
    }

    private static List<Review> CreateUniqueReviews(List<User> users)
    {
        return
        [
            new Review
            {
                Id = Guid.NewGuid(),
                Rating = Random.Next(4, 6), // 4 or 5 stars rating
                Comment =
                    "In efficitur, lacus id commodo luctus, tortor libero scelerisque ligula, a vulputate nisi lectus id felis. Nunc sagittis leo ut ante auctor vehicula. Pellentesque id elementum nisl. Aenean iaculis id ipsum et vulputate",
                CreatedAt = DateTime.UtcNow.AddDays(-Random.Next(1, 365)),
                Client = users[0]
            },

            new Review
            {
                Id = Guid.NewGuid(),
                Rating = Random.Next(4, 6), // 4 or 5 stars rating
                Comment =
                    "Donec sagittis neque mi, in tincidunt felis tempor nec. Etiam et condimentum dui, in tempus metus. Donec ullamcorper congue libero, sit amet tincidunt enim elementum quis.",
                CreatedAt = DateTime.UtcNow.AddDays(-Random.Next(1, 365)),
                UpdatedAt = DateTime.UtcNow.AddDays(-Random.Next(1, 30)),
                Client = users[1]
            }
        ];
    }
}