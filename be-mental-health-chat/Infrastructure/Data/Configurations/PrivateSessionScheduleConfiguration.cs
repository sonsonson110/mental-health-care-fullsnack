using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class PrivateSessionScheduleConfiguration: IEntityTypeConfiguration<PrivateSessionSchedule>
{
    public void Configure(EntityTypeBuilder<PrivateSessionSchedule> builder)
    {
        builder.Property(s => s.Date).HasColumnType("date");
        
        builder.Property(s => s.StartTime).HasColumnType("time");
        
        builder.Property(s => s.EndTime).HasColumnType("time");
    }
}