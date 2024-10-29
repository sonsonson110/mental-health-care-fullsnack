using Domain.Entities;
using Domain.Enums;

namespace Infrastructure.Data.Seeder;

public static class AvailabilityTemplateSeed
{
    public static List<AvailabilityTemplate> Seed(MentalHealthContext context, Therapist therapist)
    {
        var therapistId = therapist.Id;
        var availabilityTemplates = new List<AvailabilityTemplate>();

        foreach (DateOfWeek day in Enum.GetValues(typeof(DateOfWeek)))
        {
            // Morning session (9:00 - 12:00)
            for (var hour = 9; hour < 12; hour++)
            {
                availabilityTemplates.Add(new AvailabilityTemplate
                {
                    DateOfWeek = day,
                    StartTime = new TimeOnly(hour, 0),
                    EndTime = new TimeOnly(hour + 1, 0),
                    IsAvailable = true,
                    TherapistId = therapistId
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
                    IsAvailable = true,
                    TherapistId = therapistId
                });
            }
        }

        // Seed data into the database
        context.AvailabilityTemplates.AddRange(availabilityTemplates);
        context.SaveChanges();

        return availabilityTemplates;
    }
}