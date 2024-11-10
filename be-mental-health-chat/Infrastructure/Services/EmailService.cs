using Application.Interfaces;
using Infrastructure.Integrations.Common;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private IWebHostEnvironment _environment;
    private IEmailSender _emailSender;

    public EmailService(IConfiguration configuration, IWebHostEnvironment environment, IEmailSender emailSender)
    {
        _configuration = configuration;
        _environment = environment;
        _emailSender = emailSender;
    }
}