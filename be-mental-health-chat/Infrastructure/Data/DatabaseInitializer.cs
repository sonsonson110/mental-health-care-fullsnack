using Domain.Entities;
using Infrastructure.Data.Seeder;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Data;

public static class DatabaseInitializer
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<MentalHealthContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<Role>>();

        if (await dbContext.Database.EnsureDeletedAsync())
        {
            await Console.Out.WriteLineAsync("Database deleted");
        }

        if (await dbContext.Database.EnsureCreatedAsync())
        {
            var roles = RoleSeed.Seed(dbContext);
            var issueTags = IssueTagsSeed.Seed(dbContext);
            var users = await UsersSeed.Seed(dbContext, userManager);
            var therapists = await TherapistsSeed.Seed(dbContext, userManager, issueTags, users);
            var privateSessionRegistrations = PrivateSessionRegistrationSeed.Seed(dbContext, users, therapists);
            var conversations = ConversationsSeed.Seed(dbContext, users[0], therapists[0]);
            var availabilityTemplates = AvailabilityTemplateSeed.Seed(dbContext, therapists);
            var notifications = NotificationSeed.Seed(dbContext, users[0]);
            await Console.Out.WriteLineAsync("Database created, migration applied and seeded");
        }
    }
}