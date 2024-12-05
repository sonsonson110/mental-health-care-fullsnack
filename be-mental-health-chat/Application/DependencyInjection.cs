using Application.Meters;
using Application.Services;
using Application.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IIssueTagsService, IssueTagsService>();
        services.AddScoped<IConversationsService, ConversationsService>();
        services.AddScoped<IMessagesService, MessagesService>();
        services.AddScoped<ITherapistsService, TherapistsService>();
        services.AddScoped<IPrivateSessionRegistrationsService, PrivateSessionRegistrationsService>();
        services.AddScoped<IPrivateSessionRegistrationsService, PrivateSessionRegistrationsService>();
        services.AddScoped<IPrivateSessionSchedulesService, PrivateSessionSchedulesService>();
        services.AddScoped<IPublicSessionsService, PublicSessionsService>();
        services.AddScoped<IPostsService, PostsService>();
        services.AddScoped<IAvailabilityTemplateService, AvailabilityTemplateService>();
        services.AddScoped<IAvailabilityOverridesService, AvailabilityOverridesService>();
        services.AddScoped<INotificationService, NotificationService>();
        
        // Meters
        services.AddScoped<ChatbotMeter>();
        
        // Scan all assemblies for profiles
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

        return services;
    }
}