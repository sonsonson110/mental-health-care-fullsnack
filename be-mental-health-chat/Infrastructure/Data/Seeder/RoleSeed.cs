using Domain.Entities;

namespace Infrastructure.Data.Seeder;

public static class RoleSeed
{
    public static List<Role> Seed(MentalHealthContext context)
    {
        List<Role> roles =
        [
            new Role
            {
                Id = Guid.Parse("959d3ed4-3ce6-4195-8195-675ac74d52a8"), Name = "User", NormalizedName = "USER",
                Description = "General user who use the application",
            },
            new Role
            {
                Id = Guid.Parse("080bd847-4e10-46b5-9dc8-5f5ccba30ae8"), Name = "Therapist",
                NormalizedName = "THERAPIST", Description = "Application user who provides therapy service",
            },
        ];
        context.Roles.AddRange(roles);
        context.SaveChanges();
        return roles;
    }
}