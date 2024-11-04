using Domain.Entities;
using Domain.Enums;

namespace Infrastructure.Data.Seeder;

internal static class PrivateSessionRegistrationSeed
{
    internal static List<PrivateSessionRegistration> Seed(MentalHealthContext context, List<User> users,
        List<User> therapists)
    {
        var privateSessionRegistrations = new List<PrivateSessionRegistration>();
        var privateSessionStatuses = Enum.GetValues(typeof(PrivateSessionRegistrationStatus)).Cast<PrivateSessionRegistrationStatus>().ToList();

        for (var i = 0; i < 20; i++)
        {
            var user = users[i % users.Count];
            var therapist = therapists[i % therapists.Count];
            var privateSessionStatus = privateSessionStatuses[i % privateSessionStatuses.Count];
            
            var privateSessionRegistration = new PrivateSessionRegistration
            {
                Id = Guid.NewGuid(),
                ClientId = user.Id,
                TherapistId = therapist.Id,
                Status = privateSessionStatus,
                EndDate = privateSessionStatus == PrivateSessionRegistrationStatus.FINISHED
                    ? DateTime.UtcNow
                    : null
            };

            privateSessionRegistrations.Add(privateSessionRegistration);
        }

        context.PrivateSessionRegistrations.AddRange(privateSessionRegistrations);
        context.SaveChanges();

        return privateSessionRegistrations;
    }
}