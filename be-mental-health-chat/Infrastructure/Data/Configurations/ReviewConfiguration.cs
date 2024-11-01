using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class ReviewConfiguration: IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.HasOne(r => r.Client)
            .WithMany(u => u.ClientReviews)
            .HasForeignKey(r => r.ClientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.Therapist)
            .WithMany(u => u.TherapistReviews)
            .HasForeignKey(r => r.TherapistId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}