using System.Text;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Infrastructure.Data.Services;
using Infrastructure.FileStorage;
using Infrastructure.Integrations;
using Infrastructure.Integrations.Common;
using Infrastructure.Security;
using Infrastructure.Services;
using Infrastructure.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<MentalHealthContext>(opt =>
        {
            opt.UseNpgsql(configuration.GetConnectionString("MentalHealthContext"));
        });
        
        services.AddScoped<IMentalHealthContext>(provider => provider.GetRequiredService<MentalHealthContext>());

        services.AddIdentity<User, Role>(options =>
            {
                // Lockout settings - disabled
                options.Lockout = new LockoutOptions
                {
                    AllowedForNewUsers = false,
                    DefaultLockoutTimeSpan = TimeSpan.Zero,
                    MaxFailedAccessAttempts = 1000
                };
                
                // Sign-in settings - no verification required
                options.SignIn = new SignInOptions 
                {
                    RequireConfirmedEmail = false,
                    RequireConfirmedPhoneNumber = false,
                    RequireConfirmedAccount = false
                };
            })
            .AddEntityFrameworkStores<MentalHealthContext>()
            .AddDefaultTokenProviders();

        services.AddScoped<IIdentityService, IdentityService>();
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IGeminiService, GeminiService>();
        services.AddScoped<IFileStorageService, FileStorageService>();

        // Register HttpClient
        services.AddHttpClient<IGeminiService, GeminiService>();
        
        // Jwt authentication
        services.Configure<JwtSettings>(
            configuration.GetSection("Jwt"));
        
        services.AddScoped<CustomJwtBearerEvents>();
        
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            var jwtSettings = configuration.GetSection("Jwt").Get<JwtSettings>();
            
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings.Issuer,
                ValidAudience = jwtSettings.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key)),
                ClockSkew = TimeSpan.Zero // remove default 5 minutes delay expiration check
            };
            
            options.EventsType = typeof(CustomJwtBearerEvents);
        });
        services.AddAuthorization();
        
        // Email service
        services.Configure<EmailSettings>(
            configuration.GetSection("EmailSettings"));
            
        services.AddScoped<IEmailSender, GmailSenderService>();
        services.AddScoped<IEmailService, EmailService>();

        return services;
    }
}