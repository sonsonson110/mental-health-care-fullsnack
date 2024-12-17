using Application.Interfaces;
using Infrastructure.BackgroundTasks.Interfaces;
using Infrastructure.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.BackgroundTasks;

public class EmailBackgroundService: IEmailBackgroundService
{
    private readonly IBackgroundTaskQueue _taskQueue;
    private readonly IServiceScopeFactory  _serviceScopeFactory;
    
    public EmailBackgroundService(IBackgroundTaskQueue taskQueue, IServiceScopeFactory  serviceScopeFactory)
    {
        _taskQueue = taskQueue;
        _serviceScopeFactory = serviceScopeFactory;
    }
    
    public async Task QueueEmailNotificationAsync(Guid registrationId)
    {
        await _taskQueue.QueueBackgroundWorkItemAsync(async token =>
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<IMentalHealthContext>();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

            var registration = await dbContext.PrivateSessionRegistrations
                .Include(r => r.Client)
                .Include(r => r.Therapist)
                .FirstOrDefaultAsync(r => r.Id == registrationId, token);

            if (registration != null)
            {
                await emailService.SendClientRegistrationNotificationToTherapistAsync(registration, token);
            }
        });
    }

    public async Task QueueRegistrationUpdateEmailAsync(Guid registrationId)
    {
        await _taskQueue.QueueBackgroundWorkItemAsync(async token =>
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<IMentalHealthContext>();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

            var registration = await dbContext.PrivateSessionRegistrations
                .Include(r => r.Client)
                .Include(r => r.Therapist)
                .Include(r => r.PrivateSessionSchedules)
                .FirstOrDefaultAsync(r => r.Id == registrationId, token);

            if (registration != null)
            {
                await emailService.SendRegistrationUpdateNotificationToClientAsync(registration, token);
            }
        });
    }
}