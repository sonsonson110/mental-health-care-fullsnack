using Domain.Entities;

namespace Infrastructure.Services.Interfaces;

public interface IEmailService
{
    Task SendClientRegistrationNotificationToTherapistAsync(
        PrivateSessionRegistration registration,
        CancellationToken cancellationToken = default);

    Task SendRegistrationUpdateNotificationToClientAsync(
        PrivateSessionRegistration registration,
        CancellationToken cancellationToken = default);
}