using System.ComponentModel.DataAnnotations;
using Domain.Common;
using Domain.Common.Interface;

namespace Domain.Entities;

public class Review : TimestampMarkedEntityBase
{
    [Range(1, 5)]
    public int Rating { get; set; }
    [MaxLength(500)]
    public required string Comment { get; set; }
    
    public Guid ClientId { get; set; }
    public Guid TherapistId { get; set; }
    
    public User Client { get; set; } = null!;
    public Therapist Therapist { get; set; } = null!;
}