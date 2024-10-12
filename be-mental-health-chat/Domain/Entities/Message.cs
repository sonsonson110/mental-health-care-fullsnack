using Domain.Common;
using Domain.Common.Interface;

namespace Domain.Entities;

public class Message : EntityBase, ICreateTimestampMarkEntityBase, IUpdateTimeStampMarkEntityBase
{
    public Guid? SenderId { get; set; }
    public Guid ConversationId { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsRead { get; set; }
    
    public User? Sender { get; set; }
    public Conversation Conversation { get; set; }
}