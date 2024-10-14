using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Infrastructure.Data.SeedData;
using Infrastructure.Data.Seeder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Data;

public static class DatabaseInitializer
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        using (var scope = serviceProvider.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<MentalHealthContext>();
            var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

            if (dbContext.Database.EnsureDeleted())
            {
                Console.Out.WriteLine("Database deleted");
            }

            if (dbContext.Database.EnsureCreated())
            {
                var users = UsersSeed.Seed(dbContext, passwordHasher);
                var issueTags = IssueTagsSeed.Seed(dbContext);
                var therapists = TherapistsSeed.Seed(dbContext, passwordHasher, issueTags, users);
                var conversations = ConversationsSeed.Seed(dbContext, users, therapists);
                Console.Out.WriteLine("Database created, migration applied and seeded");
            }
        }
    }
}