using Domain.Entities;
using Domain.Enums;

namespace Infrastructure.Data.Seeder;

internal static class PrivateSessionScheduleSeed
{
    internal static List<PrivateSessionSchedule> Seed(MentalHealthContext context, List<PrivateSessionRegistration> registrations)
    {
        var schedules = new List<PrivateSessionSchedule>();
        var random = new Random();
        var today = DateOnly.FromDateTime(DateTime.Today);

        foreach (var registration in registrations)
        {
            // For FINISHED registrations, create past schedules
            if (registration.Status != PrivateSessionRegistrationStatus.FINISHED) continue;
            
            // Create 6 past weekly sessions
            for (int i = 0; i < 6; i++)
            {
                var scheduleDate = today.AddDays(-7 * (i + 1));
                var startTime = new TimeOnly(
                    random.Next(9, 16),
                    random.Next(0, 4) * 15
                );
                    
                var isCancelled = random.Next(0, 10) < 1; // 10% chance of cancellation
                    
                schedules.Add(new PrivateSessionSchedule
                {
                    Id = Guid.NewGuid(),
                    Date = scheduleDate,
                    StartTime = startTime,
                    EndTime = startTime.AddHours(1),
                    PrivateSessionRegistrationId = registration.Id,
                    NoteFromTherapist = isCancelled 
                        ? "Session cancelled due to unavoidable circumstances" 
                        : "Session completed successfully",
                    IsCancelled = isCancelled,
                    CreatedAt = DateTime.UtcNow.AddDays(-7 * (i + 1)),
                    UpdatedAt = DateTime.UtcNow.AddDays(-7 * (i + 1))
                });
            }
        }
        
        context.PrivateSessionSchedules.AddRange(schedules);
        context.SaveChanges();

        return schedules;
    }
}