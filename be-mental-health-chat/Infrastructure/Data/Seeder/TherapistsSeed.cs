using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Data.Seeder;

internal static class TherapistsSeed
{
    internal static async Task<List<User>> Seed(
        MentalHealthContext context,
        UserManager<User> userManager,
        List<IssueTag> issueTags,
        List<User> users)
    {
        const string seedPassword = "Password@123";

        var therapist1 = new User
        {
            Id = Guid.Parse("6dbf3d30-47af-404e-a5c0-2d122f8e5c1f"),
            FirstName = "Sarah",
            LastName = "Johnson",
            Gender = Gender.MALE,
            DateOfBirth = new DateOnly(2001, 12, 24),
            Email = "pson141002@gmail.com",
            PhoneNumber = "0773239745",
            TimeZoneId = "SE Asia Standard Time",
            IsTherapist = true,
            Description = "Dedicated to empowering individuals through holistic mental health practices.",
            UserName = "sarah.johnson",
            AvatarName = "28562708-9333-4e62-ad55-f4f0f4f92394.jpg",
            Educations =
            [
                new Education
                {
                    Id = new Guid(),
                    Institution = "Harvard University",
                    Degree = "Master of Psychology",
                    Major = "Clinical Psychology"
                }
            ],
            Experiences =
            [
                new Experience
                {
                    Id = new Guid(),
                    Organization = "Mindful Wellness Center",
                    Position = "Senior Therapist",
                    Description =
                        "Led individual and group therapy sessions focusing on anxiety and depression management using evidence-based approaches.",
                    StartDate = new DateOnly(2001, 12, 24),
                    EndDate = new DateOnly(2001, 12, 24),
                }
            ],
            Certifications =
            [
                new Certification
                {
                    Id = new Guid(),
                    Name = "Licensed Clinical Social Worker",
                    IssuingOrganization = "State Board of Social Work",
                    DateIssued = new DateOnly(2001, 12, 24),
                    ExpirationDate = new DateOnly(2003, 12, 24),
                    ReferenceUrl = "https://www.certifications.com",
                }
            ],
            TherapistReviews =
            [
                new Review
                {
                    Id = new Guid(),
                    Comment = "Excellent therapist! Really helped me work through my anxiety.",
                    Rating = 4,
                    ClientId = users[0].Id,
                }
            ]
        };

        var therapist1Result = await userManager.CreateAsync(therapist1, seedPassword);
        if (therapist1Result.Succeeded)
        {
            await userManager.AddToRolesAsync(therapist1, ["User", "Therapist"]);

            var therapist1IssueTags = issueTags.Take(3).Select(x => new TherapistIssueTag
            {
                TherapistId = therapist1.Id,
                IssueTagId = x.Id
            }).ToList();
            context.TherapistIssueTags.AddRange(therapist1IssueTags);
        }

        var therapist2 = new User
        {
            Id = Guid.Parse("8cd3f1f2-a75e-4f34-a9cc-5f991c0b31fc"),
            FirstName = "Michael",
            LastName = "Chen",
            Gender = Gender.FEMALE,
            DateOfBirth = new DateOnly(1988, 4, 15),
            Email = "michael.chen@example.com",
            PhoneNumber = "0781234567",
            TimeZoneId = "Pacific Standard Time",
            IsTherapist = true,
            Description = "Dedicated professional with over 10 years of experience.",
            UserName = "michael.chen",
            Educations =
            [
                new Education
                {
                    Id = Guid.NewGuid(),
                    Institution = "Stanford University",
                    Degree = "PhD in Counseling Psychology",
                    Major = "Counseling Psychology"
                }
            ],
            Experiences =
            [
                new Experience
                {
                    Id = Guid.NewGuid(),
                    Organization = "Harmony Therapy Center",
                    Position = "Lead Counselor",
                    Description = "Specialized in relationship counseling and conflict resolution.",
                    StartDate = new DateOnly(2012, 6, 1),
                    EndDate = new DateOnly(2020, 3, 15)
                }
            ],
            Certifications =
            [
                new Certification
                {
                    Id = Guid.NewGuid(),
                    Name = "Certified Mental Health Counselor",
                    IssuingOrganization = "American Counseling Association",
                    DateIssued = new DateOnly(2015, 9, 10),
                    ExpirationDate = new DateOnly(2025, 9, 10),
                    ReferenceUrl = "https://www.counselorcertification.org"
                }
            ],
            TherapistReviews =
            [
                new Review
                {
                    Id = Guid.NewGuid(),
                    Comment = "Michael is compassionate and an excellent listener.",
                    Rating = 5,
                    ClientId = users[0].Id
                }
            ]
        };

        var therapist2Result = await userManager.CreateAsync(therapist2, seedPassword);
        if (therapist2Result.Succeeded)
        {
            await userManager.AddToRolesAsync(therapist2, ["User", "Therapist"]);

            var therapist2IssueTags = issueTags.TakeLast(4).Select(x => new TherapistIssueTag
            {
                TherapistId = therapist2.Id,
                IssueTagId = x.Id
            }).ToList();
            context.TherapistIssueTags.AddRange(therapist2IssueTags);
            await context.SaveChangesAsync();
        }

        var therapist3 = new User
        {
            Id = Guid.Parse("91eb8f2d-6bfe-4f42-94bc-3a6d2321c7a8"),
            FirstName = "Emily",
            LastName = "Rodriguez",
            Gender = Gender.MALE,
            DateOfBirth = new DateOnly(1979, 8, 22),
            Email = "emily.rodriguez@example.com",
            PhoneNumber = "0795671234",
            TimeZoneId = "Mountain Standard Time",
            IsTherapist = true,
            Description = "Experienced therapist with a focus on mindfulness and cognitive-behavioral therapy.",
            UserName = "emily.rodriguez",
            Educations =
            [
                new Education
                {
                    Id = Guid.NewGuid(),
                    Institution = "University of California, Berkeley",
                    Degree = "Master of Social Work",
                    Major = "Mental Health"
                }
            ],
            Experiences =
            [
                new Experience
                {
                    Id = Guid.NewGuid(),
                    Organization = "Serenity Counseling Center",
                    Position = "Mental Health Specialist",
                    Description =
                        "Provided individual and group counseling sessions, specializing in stress and trauma recovery.",
                    StartDate = new DateOnly(2005, 9, 1),
                    EndDate = new DateOnly(2015, 6, 30)
                }
            ],
            Certifications =
            [
                new Certification
                {
                    Id = Guid.NewGuid(),
                    Name = "Certified CBT Practitioner",
                    IssuingOrganization = "Cognitive Behavioral Therapy Institute",
                    DateIssued = new DateOnly(2010, 5, 20),
                    ExpirationDate = new DateOnly(2025, 5, 20),
                    ReferenceUrl = "https://www.cbti.org/certification"
                }
            ],
            TherapistReviews =
            [
                new Review
                {
                    Id = Guid.NewGuid(),
                    Comment = "Emily's mindfulness techniques really helped me manage my stress levels.",
                    Rating = 3,
                    ClientId = users[0].Id
                }
            ]
        };

        var therapist3Result = await userManager.CreateAsync(therapist3, seedPassword);
        if (therapist3Result.Succeeded)
        {
            await userManager.AddToRolesAsync(therapist3, ["User", "Therapist"]);

            var therapist3IssueTags = issueTags.Take(4).Select(x => new TherapistIssueTag
            {
                TherapistId = therapist3.Id,
                IssueTagId = x.Id
            }).ToList();
            context.TherapistIssueTags.AddRange(therapist3IssueTags);
        }

        // Therapist 4
        var therapist4 = new User
        {
            Id = Guid.Parse("4fa93d72-2a2f-4cb7-8f25-bc6d28a0e324"),
            FirstName = "David",
            LastName = "Williams",
            Gender = Gender.MALE,
            DateOfBirth = new DateOnly(1990, 3, 14),
            Email = "david.williams@example.com",
            PhoneNumber = "0812456789",
            TimeZoneId = "Central European Standard Time",
            IsTherapist = true,
            Description = "Passionate about helping individuals navigate challenges using evidence-based therapies.",
            UserName = "david.williams",
            Educations =
            [
                new Education
                {
                    Id = Guid.NewGuid(),
                    Institution = "University of Oxford",
                    Degree = "Master of Science",
                    Major = "Clinical Mental Health"
                }
            ],
            Experiences =
            [
                new Experience
                {
                    Id = Guid.NewGuid(),
                    Organization = "Wellbeing Mental Health Clinic",
                    Position = "Clinical Psychologist",
                    Description =
                        "Specialized in cognitive and dialectical behavioral therapy for individuals with mood disorders.",
                    StartDate = new DateOnly(2014, 7, 1),
                    EndDate = new DateOnly(2022, 10, 15)
                }
            ],
            Certifications =
            [
                new Certification
                {
                    Id = Guid.NewGuid(),
                    Name = "Certified Dialectical Behavior Therapist",
                    IssuingOrganization = "National Certification Board for DBT",
                    DateIssued = new DateOnly(2018, 4, 12),
                    ExpirationDate = new DateOnly(2026, 4, 12),
                    ReferenceUrl = "https://www.dbtcertification.org"
                }
            ],
            TherapistReviews =
            [
                new Review
                {
                    Id = Guid.NewGuid(),
                    Comment = "David's strategies and guidance helped me overcome persistent anxiety.",
                    Rating = 2,
                    ClientId = users[0].Id
                }
            ]
        };

        var therapist4Result = await userManager.CreateAsync(therapist4, seedPassword);
        if (therapist4Result.Succeeded)
        {
            await userManager.AddToRolesAsync(therapist4, ["User", "Therapist"]);

            var therapist4IssueTags = issueTags.Select(x => new TherapistIssueTag
            {
                TherapistId = therapist4.Id,
                IssueTagId = x.Id
            }).ToList();
            context.TherapistIssueTags.AddRange(therapist4IssueTags);
        }
        
        // Therapist 5
        var therapist5 = new User
        {
            Id = Guid.Parse("bc8a7ef4-5a9d-4e38-832d-df2f3f4271cb"),
            FirstName = "Amanda",
            LastName = "Patel",
            Gender = Gender.MALE,
            DateOfBirth = new DateOnly(1985, 11, 8),
            Email = "amanda.patel@example.com",
            PhoneNumber = "0798346125",
            TimeZoneId = "Eastern Standard Time",
            IsTherapist = true,
            Description = "Dedicated to empowering individuals through holistic mental health practices.",
            UserName = "amanda.patel",
            Educations =
            [
                new Education
                {
                    Id = Guid.NewGuid(),
                    Institution = "New York University",
                    Degree = "Master of Social Work",
                    Major = "Mental Health Counseling"
                }
            ],
            Experiences =
            [
                new Experience
                {
                    Id = Guid.NewGuid(),
                    Organization = "Resilience Therapy Group",
                    Position = "Licensed Clinical Social Worker",
                    Description =
                        "Provided therapeutic interventions for individuals coping with PTSD and chronic stress.",
                    StartDate = new DateOnly(2010, 5, 20),
                    EndDate = new DateOnly(2021, 7, 15)
                }
            ],
            Certifications =
            [
                new Certification
                {
                    Id = Guid.NewGuid(),
                    Name = "Certified Trauma Specialist",
                    IssuingOrganization = "International Association of Trauma Professionals",
                    DateIssued = new DateOnly(2017, 3, 10),
                    ExpirationDate = new DateOnly(2027, 3, 10),
                    ReferenceUrl = "https://www.traumacertification.org"
                }
            ],
            TherapistReviews =
            [
                new Review
                {
                    Id = Guid.NewGuid(),
                    Comment = "Amanda's trauma-focused approach helped me regain control over my life.",
                    Rating = 4,
                    ClientId = users[0].Id
                }
            ]
        };

        var therapist5Result = await userManager.CreateAsync(therapist5, seedPassword);
        if (therapist5Result.Succeeded)
        {
            await userManager.AddToRolesAsync(therapist5, ["User", "Therapist"]);

            var therapist5IssueTags = issueTags.TakeLast(2).Select(x => new TherapistIssueTag
            {
                TherapistId = therapist5.Id,
                IssueTagId = x.Id
            }).ToList();
            context.TherapistIssueTags.AddRange(therapist5IssueTags);
        }

        await context.SaveChangesAsync();

        return [therapist1, therapist2, therapist3, therapist4, therapist5];
    }
}