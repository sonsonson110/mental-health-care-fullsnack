using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class TherapistConfiguration : IEntityTypeConfiguration<Therapist>
{
    public void Configure(EntityTypeBuilder<Therapist> builder)
    {
        // Many to many relationship between Therapist and IssueTag
        builder.HasMany(e => e.IssueTags)
            .WithMany(e => e.Therapists)
            .UsingEntity<TherapistIssueTag>(
                r => r.HasOne<IssueTag>().WithMany(e => e.TherapistIssueTags),
                l => l.HasOne<Therapist>().WithMany(e => e.TherapistIssueTags)
            );
    }
}