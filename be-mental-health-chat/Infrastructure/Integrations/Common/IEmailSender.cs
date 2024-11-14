using Domain.Common;
using Domain.Model;

namespace Infrastructure.Integrations.Common;

public interface IEmailSender
{
    Task SendEmailAsync(Email email, CancellationToken cancellationToken = default);
}