namespace Application.Interfaces;

public interface IEmailBackgroundService
{
    Task QueueEmailNotificationAsync(Guid registrationId);
    Task QueueRegistrationUpdateEmailAsync(Guid registrationId);
}