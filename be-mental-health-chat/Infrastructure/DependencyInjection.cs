using System.Text;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.FileStorage;
using Infrastructure.Integrations.Gemini;
using Infrastructure.Security;
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
        services.AddDbContext<Data.MentalHealthContext>(opt =>
        {
            opt.UseNpgsql(configuration.GetConnectionString("MentalHealthContext"));
        });

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
            .AddEntityFrameworkStores<Data.MentalHealthContext>()
            .AddDefaultTokenProviders();

        services.AddTransient<IJwtGenerator, JwtGenerator>();
        services.AddScoped<IGeminiService, GeminiService>();
        services.AddScoped<IFileStorageService, FileStorageService>();

        // Register HttpClient
        services.AddHttpClient<IGeminiService, GeminiService>();

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration["Jwt:Issuer"],
                ValidAudience = configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]))
            };
        });
        services.AddAuthorization();

        return services;
    }
}