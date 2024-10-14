using System.Text;
using Application.Interfaces;
using Domain.Interfaces;
using Infrastructure.Data;
using Infrastructure.Integrations;
using Infrastructure.Integrations.Gemini;
using Infrastructure.Integrations.Gemini.Interfaces;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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
        services.AddScoped<IMentalHealthContext, MentalHealthContext>();
        services.AddTransient<IPasswordHasher, PasswordHasher>();
        services.AddTransient<IJwtGenerator, JwtGenerator>();
        services.AddScoped<IGeminiService, GeminiService>();
        
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