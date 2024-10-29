using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class AvailabilityTemplateConfiguration : IEntityTypeConfiguration<AvailabilityTemplate>
{
    public void Configure(EntityTypeBuilder<AvailabilityTemplate> builder)
    {
        builder.Property(at => at.StartTime).HasColumnType("time");

        builder.Property(at => at.EndTime).HasColumnType("time");
    }
}