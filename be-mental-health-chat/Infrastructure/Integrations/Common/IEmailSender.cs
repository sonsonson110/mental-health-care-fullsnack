using Domain.Common;

namespace Infrastructure.Integrations.Common;

public interface IEmailSender
{
    Task SendEmailAsync(Email email, CancellationToken cancellationToken = default);
}