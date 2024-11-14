using Application.Interfaces;
using Domain.Common;
using Domain.Entities;
using Domain.Enums;
using Domain.Model;
using Infrastructure.Integrations.Common;
using Infrastructure.Services.Interfaces;

namespace Infrastructure.Services;

public class EmailService : IEmailService
{
    private IEmailSender _emailSender;

    public EmailService(IEmailSender emailSender)
    {
        _emailSender = emailSender;
    }

    public async Task SendClientRegistrationNotificationToTherapistAsync(PrivateSessionRegistration registration,
        CancellationToken cancellationToken = default)
    {
        var therapistEmail = registration.Therapist.Email ??
                             throw new ArgumentException("Therapist email should not be null");
        var subject = "New Client Registration";
        var body = GenerateTherapistNotificationTemplate(registration);

        await _emailSender.SendEmailAsync(
            new Email(therapistEmail, subject, body),
            cancellationToken);
    }

    public async Task SendRegistrationUpdateNotificationToClientAsync(PrivateSessionRegistration registration,
        CancellationToken cancellationToken = default)
    {
        var clientEmail = registration.Client.Email ?? throw new ArgumentException("Client email should not be null");
        var subject = "Registration Status Update";
        var body = GenerateClientNotificationTemplate(registration);

        await _emailSender.SendEmailAsync(
            new Email(clientEmail, subject, body),
            cancellationToken);
    }

    private static string GenerateTherapistNotificationTemplate(PrivateSessionRegistration registration)
    {
        return $"""
                <!DOCTYPE html>
                <html>
                <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                    <p>Hello {registration.Therapist.GetFullName()},</p>
                    
                    <p>A new client has registered for private sessions:</p>
                    
                    <p><b>Client:</b> {registration.Client.GetFullName()}</p>
                    <p><b>Client's Note:</b> {registration.NoteFromClient}</p>
                    <p><b>Registered at:</b> {registration.CreatedAt:R}</p>
                
                    <p>Please review and update the registration status at your earliest convenience.</p>
                    
                    <p>Best regards,<br>Mental health team</p>
                </body>
                </html>
                """;
    }

    private static string GenerateClientNotificationTemplate(PrivateSessionRegistration registration)
    {
        var statusMessage = registration.Status switch
        {
            PrivateSessionRegistrationStatus.APPROVED => "approved",
            PrivateSessionRegistrationStatus.REJECTED => "rejected",
            PrivateSessionRegistrationStatus.FINISHED => "finished",
            PrivateSessionRegistrationStatus.CANCELED => "canceled",
            _ => throw new ArgumentOutOfRangeException("statusMessage","Invalid provided registration statuses")
        };

        return $"""

                <!DOCTYPE html>
                <html>
                <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                    <p>Hello {registration.Client.GetFullName()},</p>
                    
                    <p>Your registration status has been updated to <b>{statusMessage}</b> by {registration.Therapist.GetFullName()}.</p>
                    
                    {(string.IsNullOrEmpty(registration.NoteFromTherapist)
                        ? ""
                        : $"""
                           
                               <p><b>Message from therapist:</b><br>
                               {registration.NoteFromTherapist}</p>
                           """)}
                    
                    {(!registration.EndDate.HasValue 
                        ? ""
                        : $"""
                         
                             <p><b>End Date:</b> {registration.EndDate:R}</p>
                         """)}
                
                    <p>Best regards,<br>Mental health team</p>
                </body>
                </html>
                """;
    }
}