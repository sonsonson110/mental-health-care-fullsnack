using Domain.Entities;
using Domain.Enums;

namespace Infrastructure.Data.Seeder;

public static class AvailabilityTemplateSeed
{
    private static readonly Dictionary<int, DateOfWeek[]> TherapistWorkingDays = new()
    {
        { 0, new[] { DateOfWeek.MONDAY, DateOfWeek.TUESDAY } },
        { 1, new[] { DateOfWeek.WEDNESDAY, DateOfWeek.THURSDAY } },
        { 2, new[] { DateOfWeek.FRIDAY, DateOfWeek.SATURDAY } },
        { 3, new[] { DateOfWeek.MONDAY, DateOfWeek.WEDNESDAY, DateOfWeek.FRIDAY } },
        { 4, new[] { DateOfWeek.TUESDAY, DateOfWeek.THURSDAY, DateOfWeek.SATURDAY } }
    };

    public static List<AvailabilityTemplate> Seed(MentalHealthContext context, List<User> therapists)
    {
        var availabilityTemplates = new List<AvailabilityTemplate>();
        
        for (var i = 0; i < therapists.Count; i++)
        {
            var therapist = therapists[i];
            var workingDays = TherapistWorkingDays[i];

            foreach (var day in workingDays)
            {
                // Morning session (9:00 - 12:00)
                for (var hour = 9; hour < 12; hour++)
                {
                    availabilityTemplates.Add(new AvailabilityTemplate
                    {
                        DateOfWeek = day,
                        StartTime = new TimeOnly(hour, 0),
                        EndTime = new TimeOnly(hour + 1, 0),
                        TherapistId = therapist.Id
                    });
                }

                // Afternoon session (14:00 - 18:00)
                for (var hour = 14; hour < 18; hour++)
                {
                    availabilityTemplates.Add(new AvailabilityTemplate
                    {
                        DateOfWeek = day,
                        StartTime = new TimeOnly(hour, 0),
                        EndTime = new TimeOnly(hour + 1, 0),
                        TherapistId = therapist.Id
                    });
                }
            }
        }

        context.AvailabilityTemplates.AddRange(availabilityTemplates);
        context.SaveChanges();

        return availabilityTemplates;
    }
}