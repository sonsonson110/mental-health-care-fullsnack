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

        // configure for DateOnly type
        builder
            .Property(e => e.DateOfBirth)
            .HasColumnType("date");
    }
}