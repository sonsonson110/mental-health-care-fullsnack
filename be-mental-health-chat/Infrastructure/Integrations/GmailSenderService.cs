using Domain.Common;
using Infrastructure.Integrations.Common;
using Infrastructure.Settings;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;

namespace Infrastructure.Integrations;

public class GmailSenderService: IEmailSender
{
    private readonly EmailSettings _settings;
    
    public GmailSenderService(IOptions<EmailSettings> settings)
    {
        _settings = settings.Value;
    }
    
    public async Task SendEmailAsync(Email email, CancellationToken cancellationToken = default)
    {
        var message = new MimeMessage();
            
        message.From.Add(new MailboxAddress(_settings.SenderName, _settings.SenderEmail));
        message.To.Add(MailboxAddress.Parse(email.To));
        message.Subject = email.Subject;
        message.Body = new TextPart(TextFormat.Html)
        {
            Text = email.Body
        };

        using var client = new SmtpClient();
        await client.ConnectAsync(_settings.SmtpServer, _settings.SmtpPort, SecureSocketOptions.StartTls, cancellationToken);
        await client.AuthenticateAsync(_settings.SmtpUsername, _settings.SmtpPassword, cancellationToken);
        await client.SendAsync(message, cancellationToken);
        await client.DisconnectAsync(true, cancellationToken);
    }
}