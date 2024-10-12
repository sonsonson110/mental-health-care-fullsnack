using Application.Interfaces;
using Domain.Common.Interface;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class MentalHealthContext : DbContext, IMentalHealthContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Therapist> Therapists { get; set; }
    public DbSet<Education> Educations { get; set; }
    public DbSet<Experience> Experiences { get; set; }
    public DbSet<Certification> Certifications { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<IssueTag> IssueTags { get; set; }
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<Message> Messages { get; set; }

    public MentalHealthContext(DbContextOptions<MentalHealthContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Apply configurations from current assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(MentalHealthContext).Assembly);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
    {
        var now = DateTime.UtcNow;

        foreach (var changedEntity in ChangeTracker.Entries())
        {
            if (changedEntity is { State: EntityState.Added, Entity: ICreateTimestampMarkEntityBase addEntity })
            {
                // createdAt should only be set here if it is not set manually (which is MinValue by default)
                if (addEntity.CreatedAt == DateTime.MinValue)
                {
                    addEntity.CreatedAt = now;
                }
            }
            else if (changedEntity.State is EntityState.Modified)
            {
                if (changedEntity.Entity is not IUpdateTimeStampMarkEntityBase updateEntity) continue;
                updateEntity.UpdatedAt = now;

                // Check if the entity also implements ICreateTimestampMarkEntityBase
                if (updateEntity is ICreateTimestampMarkEntityBase createUpdateEntity)
                {
                    Entry(createUpdateEntity).Property(e => e.CreatedAt).IsModified = false;
                }
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}