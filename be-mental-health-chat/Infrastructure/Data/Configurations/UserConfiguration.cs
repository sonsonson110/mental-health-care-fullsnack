using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.Property(p => p.FirstName).HasMaxLength(50).IsRequired();

        builder.Property(p => p.LastName).HasMaxLength(50).IsRequired();

        builder.Property(p => p.IsOnline)
            .HasDefaultValue(false);

        builder.Property(p => p.AvatarName)
            .HasMaxLength(50);

        builder.Property(p => p.Bio)
            .HasMaxLength(255);

        builder.Property(p => p.TimeZoneId)
            .HasMaxLength(50);

        builder.Property(p => p.IsTherapist)
            .HasDefaultValue(false);

        builder.Property(p => p.Description)
            .HasMaxLength(500);

        builder.Property(p => p.IsDeleted).HasDefaultValue(false);

        // configure for DateOnly type
        builder
            .Property(e => e.DateOfBirth)
            .HasColumnType("date");

        // Many to many relationship between Therapist (User) and IssueTag
        builder.HasMany(e => e.IssueTags)
            .WithMany()
            .UsingEntity<TherapistIssueTag>(
                r => r.HasOne<IssueTag>().WithMany(),
                l => l.HasOne<User>().WithMany(e => e.TherapistIssueTags).HasForeignKey(e => e.TherapistId)
            );
    }
}