using System.ComponentModel.DataAnnotations;
using Domain.Common;
using Domain.Common.Interface;

namespace Domain.Entities;

public class Review : EntityBase, ICreateTimestampMarkEntityBase, IUpdateTimeStampMarkEntityBase
{
    public Guid ClientId { get; set; }
    public Guid TherapistId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    public User Client { get; set; }
    public Therapist Therapist { get; set; }
}