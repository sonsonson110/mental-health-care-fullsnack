using System.Text;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Infrastructure.Data.Services;
using Infrastructure.FileStorage;
using Infrastructure.Integrations;
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

        services.AddScoped<CustomJwtBearerEvents>();
        
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
            
            options.EventsType = typeof(CustomJwtBearerEvents);
        });
        services.AddAuthorization();

        return services;
    }
}