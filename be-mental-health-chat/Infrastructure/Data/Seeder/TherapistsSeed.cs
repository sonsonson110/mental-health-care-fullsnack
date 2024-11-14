using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Data.Seeder;

internal static class TherapistsSeed
{
    private static readonly List<(string First, string Last, string Email)> TherapistBaseInfo =
    [
        ("Sarah", "Johnson", "pson141002@gmail.com"),
        ("Michael", "Chen", "michael.chen@example.com"),
        ("Emily", "Rodriguez", "emily.rodriguez@example.com"),
        ("David", "Williams", "david.williams@example.com"),
        ("Amanda", "Patel", "amanda.patel@example.com")
    ];

    private static readonly List<(string Institution, string Degree, string Major)> EducationTemplates =
    [
        ("Harvard University", "Master of Psychology", "Clinical Psychology"),
        ("Stanford University", "Ph.D.", "Counseling Psychology"),
        ("Yale University", "Master of Social Work", "Mental Health"),
        ("Columbia University", "Master of Science", "Marriage and Family Therapy"),
        ("University of California", "Doctor of Psychology", "Behavioral Psychology")
    ];

    private static readonly List<(string Org, string Position, string Description)> ExperienceTemplates =
    [
        ("Mindful Wellness Center", "Senior Therapist", "Led individual and group therapy sessions focusing on anxiety and depression management using evidence-based approaches."),
        ("Behavioral Health Institute", "Clinical Director", "Supervised therapy programs and developed treatment protocols for diverse mental health conditions."),
        ("Community Mental Health Clinic", "Staff Therapist", "Provided comprehensive mental health services to underserved populations with various psychological challenges."),
        ("Private Practice", "Founder & Therapist", "Established and maintained a successful private practice specializing in trauma-informed therapy."),
        ("Mental Health Associates", "Lead Counselor", "Specialized in cognitive behavioral therapy for anxiety, depression, and stress management.")
    ];

    private static readonly List<(string Name, string Organization)> CertificationTemplates =
    [
        ("Licensed Clinical Social Worker", "State Board of Social Work"),
        ("Certified Trauma Professional", "International Association of Trauma Professionals"),
        ("CBT Certification", "Beck Institute for Cognitive Behavior Therapy"),
        ("EMDR Certification", "EMDR International Association"),
        ("Mindfulness-Based Stress Reduction", "Center for Mindfulness")
    ];

    private static readonly List<(string Comment, int Rating)> ReviewTemplates =
    [
        ("Excellent therapist! Really helped me work through my anxiety.", 3),
        ("Very professional and knowledgeable. Highly recommend.", 2),
        ("Great listener and provided practical solutions.", 4),
        ("Helped me develop effective coping strategies.", 4),
        ("Understanding and patient. Made me feel comfortable.", 3)
    ];
    
    private static readonly List<string?> AvatarNames =
    [
        "28562708-9333-4e62-ad55-f4f0f4f92394.jpg",
        null,
        "671f612f-6502-4537-8aa8-9abdb702db34.jpg",
        "7037d6af-e126-4abf-8169-21aaf1040ba9.jpg",
        null
    ];

    internal static async Task<List<User>> Seed(
        MentalHealthContext context,
        UserManager<User> userManager,
        List<IssueTag> issueTags,
        List<User> users)
    {
        var therapists = new List<User>();

        // Preserve the first therapist's original ID
        var firstTherapistId = Guid.Parse("6dbf3d30-47af-404e-a5c0-2d122f8e5c1f");

        for (int i = 0; i < TherapistBaseInfo.Count; i++)
        {
            var baseInfo = TherapistBaseInfo[i];
            var therapist = new User
            {
                Id = i == 0 ? firstTherapistId : Guid.NewGuid(),
                FirstName = baseInfo.First,
                LastName = baseInfo.Last,
                Gender = i % 2 == 0 ? Gender.FEMALE : Gender.MALE,
                DateOfBirth = new DateOnly(1975 + i, 3 + i, 15),
                Email = baseInfo.Email,
                PhoneNumber = $"123456{789 + i}",
                TimeZoneId = "SE Asia Standard Time",
                IsTherapist = true,
                Description = $"Experienced therapist specializing in {issueTags[i].Name} and {issueTags[(i + 1) % issueTags.Count].Name}, with a focus on evidence-based therapy approaches.",
                UserName = baseInfo.Email.Split('@')[0],
                AvatarName = AvatarNames[i],
                
                // Add two educations
                Educations =
                [
                    CreateEducation(EducationTemplates[i], 2000 + i, 2004 + i),
                    CreateEducation(EducationTemplates[(i + 1) % EducationTemplates.Count], 2005 + i, 2008 + i)
                ],
                
                // Add two experiences
                Experiences =
                [
                    CreateExperience(ExperienceTemplates[i], 2010 + i, 2015 + i),
                    CreateExperience(ExperienceTemplates[(i + 1) % ExperienceTemplates.Count], 2015 + i, null)
                ],
                
                // Add two certifications
                Certifications =
                [
                    CreateCertification(CertificationTemplates[i], 2020 + i),
                    CreateCertification(CertificationTemplates[(i + 1) % CertificationTemplates.Count], 2021 + i)
                ],
                
                // Add 1-2 reviews
                TherapistReviews = CreateReviews(i, users)
            };

            var therapistResult = await userManager.CreateAsync(therapist, "Password@123");
            if (therapistResult.Succeeded)
            {
                await userManager.AddToRolesAsync(therapist, ["User", "Therapist"]);

                var therapistIssueTags = issueTags.Select(x => new TherapistIssueTag
                {
                    TherapistId = therapist.Id,
                    IssueTagId = x.Id
                }).ToList();
                context.TherapistIssueTags.AddRange(therapistIssueTags);
                
                therapists.Add(therapist);
            }
            else
            {
                throw new Exception($"Failed to create therapist: {therapistResult.Errors.First().Description}");
            }
        }

        await context.SaveChangesAsync();
        return therapists;
    }

    private static Education CreateEducation((string Institution, string Degree, string Major) template, int startYear, int endYear) =>
        new()
        {
            Id = Guid.NewGuid(),
            Institution = template.Institution,
            Degree = template.Degree,
            Major = template.Major,
            StartDate = new DateOnly(startYear, 1, 1),
            EndDate = new DateOnly(endYear, 12, 31)
        };

    private static Experience CreateExperience((string Org, string Position, string Description) template, int startYear, int? endYear) =>
        new()
        {
            Id = Guid.NewGuid(),
            Organization = template.Org,
            Position = template.Position,
            Description = template.Description,
            StartDate = new DateOnly(startYear, 1, 1),
            EndDate = endYear.HasValue ? new DateOnly(endYear.Value, 12, 31) : null
        };

    private static Certification CreateCertification((string Name, string Organization) template, int year) =>
        new()
        {
            Id = Guid.NewGuid(),
            Name = template.Name,
            IssuingOrganization = template.Organization,
            DateIssued = new DateOnly(year, 1, 1),
            ExpirationDate = new DateOnly(year + 2, 12, 31),
            ReferenceUrl = "https://interpersonalpsychotherapy.org/therapist-certification/"
        };

    private static List<Review> CreateReviews(int therapistIndex, List<User> users)
    {
        var reviews = new List<Review>();
        
        // Add first review
        var review1 = ReviewTemplates[therapistIndex];
        reviews.Add(new Review
        {
            Id = Guid.NewGuid(),
            ClientId = users[therapistIndex % users.Count].Id,
            Rating = review1.Rating,
            Comment = review1.Comment
        });

        // Add second review for even-indexed therapists
        if (therapistIndex % 2 == 0)
        {
            var review2 = ReviewTemplates[(therapistIndex + 1) % ReviewTemplates.Count];
            reviews.Add(new Review
            {
                Id = Guid.NewGuid(),
                ClientId = users[(therapistIndex + 1) % users.Count].Id,
                Rating = review2.Rating,
                Comment = review2.Comment
            });
        }

        return reviews;
    }
}