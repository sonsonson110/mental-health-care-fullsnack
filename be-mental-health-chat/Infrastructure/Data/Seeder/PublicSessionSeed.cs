using Domain.Entities;
using Domain.Enums;

namespace Infrastructure.Data.Seeder;

internal static class PublicSessionSeed
{
    internal static List<PublicSession> Seed(MentalHealthContext context, List<User> therapists,
        List<IssueTag> issueTags)
    {
        var publicSessions = new List<PublicSession>();

        var sessionTitles = new[]
        {
            "Mindfulness Workshop", "Stress Management", "Coping with Anxiety", "Building Resilience",
            "Overcoming Burnout"
        };
        var locations = new[] { "Online", "Community Hall", "Therapy Center", "Virtual Meetup", "Wellness Clinic" };
        List<(string Discription, List<Guid> IssueTagIds)> descriptions =
        [
            ("Learn mindfulness techniques to improve focus and reduce stress.",
            [
                Guid.Parse("99dbda63-dad3-43df-8306-1417f4e3c096"), Guid.Parse("5a14d9fd-4805-481e-acc7-7960c2e6bfdb")
            ]),
            ("A practical guide to managing stress in everyday life.",
                [Guid.Parse("99dbda63-dad3-43df-8306-1417f4e3c096")]),
            ("Effective strategies for dealing with anxiety.",
            [
                Guid.Parse("34589519-935a-4e69-a26c-fa993bdd338d"), Guid.Parse("4ecf2a43-26ce-42ef-9dd9-83a1779ca67e")
            ]),
            ("Avoid and resolve arguments in relationship.", [Guid.Parse("50fb186c-d47b-4dc5-9e75-45bde967dc88")]),
            ("How to overcome workplace burnout and maintain a balanced life.",
            [
                Guid.Parse("5a14d9fd-4805-481e-acc7-7960c2e6bfdb"), Guid.Parse("99dbda63-dad3-43df-8306-1417f4e3c096")
            ])
        ];

        var random = new Random();

        for (int i = 0; i < therapists.Count; i++)
        {
            var therapist = therapists[i];

            for (int j = 0; j < 2; j++) // Each therapist gets 2 sessions
            {
                var randomDescriptionNumber = random.Next(descriptions.Count);
                var publicSession = new PublicSession
                {
                    Id = Guid.NewGuid(),
                    Title = sessionTitles[random.Next(sessionTitles.Length)],
                    Description = descriptions[randomDescriptionNumber].Discription,
                    Date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(random.Next(3, 30))),
                    StartTime = new TimeOnly(random.Next(8, 12), 0),
                    EndTime = new TimeOnly(random.Next(13, 18), 0),
                    Location = locations[random.Next(locations.Length)],
                    IsCancelled = false,
                    Type = random.Next(0, 2) == 0 ? PublicSessionType.ONLINE : PublicSessionType.OFFLINE,
                    TherapistId = therapist.Id,
                };

                foreach (var issueTagId in descriptions[randomDescriptionNumber].IssueTagIds)
                {
                    context.PublicSessionTags.Add(new PublicSessionTag(publicSession.Id, issueTagId));
                }

                publicSessions.Add(publicSession);
            }
        }

        // Add the data to the context
        context.PublicSessions.AddRange(publicSessions);
        context.SaveChanges();

        return publicSessions;
    }
}