﻿using Application.Interfaces;
using Domain.Common.Interface;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class MentalHealthContext : IdentityDbContext<User, Role, Guid, IdentityUserClaim<Guid>, IdentityUserRole<Guid>,
    IdentityUserLogin<Guid>,
    IdentityRoleClaim<Guid>, IdentityUserToken<Guid>>, IMentalHealthContext
{
    public MentalHealthContext(DbContextOptions<MentalHealthContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Apply configurations from current assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(MentalHealthContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new())
    {
        var now = DateTime.UtcNow;

        foreach (var changedEntity in ChangeTracker.Entries())
        {
            if (changedEntity.Entity is not ITimestampMarkedEntityBase entity) continue;

            switch (changedEntity.State)
            {
                case EntityState.Added:
                    // Only set timestamps if they haven't been explicitly set
                    if (entity.CreatedAt == default)
                    {
                        entity.CreatedAt = now;
                        entity.UpdatedAt = now;
                    }
                    break;
                case EntityState.Modified:
                    Entry(entity).Property(x => x.CreatedAt).IsModified = false;
                    entity.UpdatedAt = now;
                    break;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }

    public DbSet<AvailabilityTemplate> AvailabilityTemplates { get; set; }
    public DbSet<AvailabilityOverride> AvailabilityOverrides { get; set; }
    public DbSet<Certification> Certifications { get; set; }
    public DbSet<ConnectionLog> ConnectionLogs { get; set; }
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<Education> Educations { get; set; }
    public DbSet<Experience> Experiences { get; set; }
    public DbSet<IssueTag> IssueTags { get; set; }
    public DbSet<Like> Likes { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<PrivateSessionRegistration> PrivateSessionRegistrations { get; set; }
    public DbSet<PrivateSessionSchedule> PrivateSessionSchedules { get; set; }
    public DbSet<PublicSession> PublicSessions { get; set; }
    public DbSet<PublicSessionFollower> PublicSessionFollowers { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<TherapistIssueTag> TherapistIssueTags { get; set; }
    public DbSet<RecommendedTag> RecommendedTags { get; set; }
    public DbSet<PublicSessionTag> PublicSessionTags { get; set; }
}