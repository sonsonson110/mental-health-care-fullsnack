using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class TherapistIssueTagConfiguration: IEntityTypeConfiguration<TherapistIssueTag>
{
    public void Configure(EntityTypeBuilder<TherapistIssueTag> builder)
    {
    }
}