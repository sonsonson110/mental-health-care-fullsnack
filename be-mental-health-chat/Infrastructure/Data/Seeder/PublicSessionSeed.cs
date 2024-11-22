using Domain.Entities;
using Domain.Enums;

namespace Infrastructure.Data.Seeder;

internal static class PublicSessionSeed
{
    internal static List<PublicSession> Seed(MentalHealthContext context, List<User> therapists, List<User> users)
    {
        var publicSessions = new List<PublicSession>();

        var sessionTitles = new[] { "Mindfulness Workshop", "Stress Management", "Coping with Anxiety", "Building Resilience", "Overcoming Burnout" };
        var locations = new[] { "Online", "Community Hall", "Therapy Center", "Virtual Meetup", "Wellness Clinic" };
        var descriptions = new[]
        {
            "Learn mindfulness techniques to improve focus and reduce stress.",
            "A practical guide to managing stress in everyday life.",
            "Effective strategies for dealing with anxiety.",
            "Techniques to build emotional and mental resilience.",
            "How to overcome workplace burnout and maintain a balanced life."
        };

        var random = new Random();

        for (int i = 0; i < therapists.Count; i++)
        {
            var therapist = therapists[i];

            for (int j = 0; j < 2; j++) // Each therapist gets 2 sessions
            {
                var publicSession = new PublicSession
                {
                    Id = Guid.NewGuid(),
                    Title = sessionTitles[random.Next(sessionTitles.Length)],
                    Description = descriptions[random.Next(descriptions.Length)],
                    Date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(random.Next(3, 30))),
                    StartTime = new TimeOnly(random.Next(8, 12), 0),
                    EndTime = new TimeOnly(random.Next(13, 18), 0),
                    Location = locations[random.Next(locations.Length)],
                    IsCancelled = false,
                    Type = random.Next(0, 2) == 0 ? PublicSessionType.ONLINE : PublicSessionType.OFFLINE,
                    TherapistId = therapist.Id,
                    Followers = []
                };

                publicSessions.Add(publicSession);
            }
        }

        // Add the data to the context
        context.PublicSessions.AddRange(publicSessions);
        context.SaveChanges();
        
        return publicSessions;
    }
}