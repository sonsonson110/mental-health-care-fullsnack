using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class ExperienceConfiguration: IEntityTypeConfiguration<Experience>
{
    public void Configure(EntityTypeBuilder<Experience> builder)
    {
        // configure for DateOnly type
        builder
            .Property(e => e.StartDate)
            .HasColumnType("date");
        builder
            .Property(e => e.EndDate)
            .HasColumnType("date");
    }
}