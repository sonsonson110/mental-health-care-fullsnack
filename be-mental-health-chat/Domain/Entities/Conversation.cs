using Domain.Common;
using Domain.Common.Interface;

namespace Domain.Entities;

public class Conversation: EntityBase, ICreateTimestampMarkEntityBase
{
    public Guid ClientId { get; set; }
    public Guid? TherapistId { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? Title { get; set; }
    
    public User Client { get; set; }
    public Therapist? Therapist { get; set; }
    public List<Message> Messages { get; set; }
}