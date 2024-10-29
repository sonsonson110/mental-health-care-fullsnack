using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class CertificationConfiguration: IEntityTypeConfiguration<Certification>
{
    public void Configure(EntityTypeBuilder<Certification> builder)
    {
        builder
            .Property(e => e.DateIssued)
            .HasColumnType("date");
        
        builder
            .Property(e => e.ExpirationDate)
            .HasColumnType("date");
    }
}