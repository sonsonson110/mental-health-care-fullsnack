using Domain.Entities;
using Domain.Enums;

namespace Infrastructure.Data.Seeder;

internal static class PrivateSessionRegistrationSeed
{
    internal static List<PrivateSessionRegistration> Seed(MentalHealthContext context, List<User> users,
        List<User> therapists)
    {
        var privateSessionRegistrations = new List<PrivateSessionRegistration>();
        var privateSessionStatuses = Enum.GetValues(typeof(PrivateSessionRegistrationStatus))
            .Cast<PrivateSessionRegistrationStatus>()
            .ToList();

        // First, ensure each therapist has one registration with a different status
        for (var i = 0; i < therapists.Count; i++)
        {
            var therapist = therapists[i];
            var status = privateSessionStatuses[i % privateSessionStatuses.Count];
            var user = users[i % users.Count];

            var registration = new PrivateSessionRegistration
            {
                Id = Guid.NewGuid(),
                ClientId = user.Id,
                TherapistId = therapist.Id,
                Status = status,
                NoteFromClient =
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                EndDate = status == PrivateSessionRegistrationStatus.FINISHED
                ? DateTime.UtcNow
                : null
            };

            privateSessionRegistrations.Add(registration);
        }

        // Then add additional random registrations
        var remainingCount = 30 - therapists.Count;
        for (var i = 0; i < remainingCount; i++)
        {
            var user = users[i % users.Count];
            var therapist = therapists[i % therapists.Count];
            var status = privateSessionStatuses[Random.Shared.Next(privateSessionStatuses.Count)];

            var registration = new PrivateSessionRegistration
            {
                Id = Guid.NewGuid(),
                ClientId = user.Id,
                TherapistId = therapist.Id,
                Status = status,
                NoteFromClient =
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                EndDate = status == PrivateSessionRegistrationStatus.FINISHED
                    ? DateTime.UtcNow
                    : null
            };

            privateSessionRegistrations.Add(registration);
        }

        context.PrivateSessionRegistrations.AddRange(privateSessionRegistrations);
        context.SaveChanges();

        return privateSessionRegistrations;
    }
}