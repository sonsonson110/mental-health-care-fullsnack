using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class MessageConfiguration : IEntityTypeConfiguration<Message>
{
    public void Configure(EntityTypeBuilder<Message> builder)
    {
        builder.Property(e => e.Content).HasMaxLength(8192);

        // many-to-many with issue tags using recommended tags
        builder.HasMany(e => e.IssueTags)
            .WithMany()
            .UsingEntity<RecommendedTag>();
    }
}