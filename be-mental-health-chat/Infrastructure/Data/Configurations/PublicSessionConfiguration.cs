using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class PublicSessionConfiguration: IEntityTypeConfiguration<PublicSession>
{
    public void Configure(EntityTypeBuilder<PublicSession> builder)
    {
        builder.Property(p => p.Title).HasMaxLength(100);
        builder.Property(p => p.Description).HasMaxLength(255);
        builder.Property(p => p.ThumbnailUrl).HasMaxLength(50);
        builder.Property(p => p.Date).HasColumnType("date");
        builder.Property(p => p.StartTime).HasColumnType("time");
        builder.Property(p => p.EndTime).HasColumnType("time");
        builder.Property(p => p.Location).HasMaxLength(100);
    }
}