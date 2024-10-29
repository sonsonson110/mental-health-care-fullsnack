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
            var user = await UsersSeed.Seed(userManager);
            var issueTags = IssueTagsSeed.Seed(dbContext);
            var therapist = await TherapistsSeed.Seed(dbContext, userManager, issueTags);
            var conversations = ConversationsSeed.Seed(dbContext, user, therapist);
            var availabilityTemplates = AvailabilityTemplateSeed.Seed(dbContext, therapist);
            var notifications = NotificationSeed.Seed(dbContext, user);
            await Console.Out.WriteLineAsync("Database created, migration applied and seeded");
        }
    }
}