using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.Property(p => p.FirstName).HasMaxLength(50);
        
        builder.Property(p => p.LastName).HasMaxLength(50);

        builder.HasIndex(p => p.Email).IsUnique();
        
        builder.Property(p => p.IsOnline)
            .HasDefaultValue(false);
        
        builder.Property(p => p.CreatedAt)
            .HasDefaultValueSql("NOW()");
        
        // configure for DateOnly type
        builder
            .Property(e => e.DateOfBirth)
            .HasColumnType("date");
    }
}