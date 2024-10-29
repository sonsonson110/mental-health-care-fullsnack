using Domain.Entities;
using Infrastructure.Data.Converter;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class NotificationConfiguration: IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.Property(e => e.Title).HasMaxLength(100);
        
        builder.Property(e => e.Metadata)
            .HasColumnType("jsonb")
            .HasConversion<DictionaryJsonConverter>()
            .Metadata.SetValueComparer(DictionaryJsonConverter.Comparer);
    }
}