using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class PrivateSessionRegistrationConfiguration: IEntityTypeConfiguration<PrivateSessionRegistration>
{
    public void Configure(EntityTypeBuilder<PrivateSessionRegistration> builder)
    {
        builder.Property(e => e.NoteFromClient).HasMaxLength(500);
        builder.Property(e => e.NoteFromTherapist).HasMaxLength(500);
        
        builder.HasOne(e=>e.Client)
            .WithMany()
            .HasForeignKey(e=>e.ClientId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(e => e.Therapist)
            .WithMany()
            .HasForeignKey(e => e.TherapistId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}