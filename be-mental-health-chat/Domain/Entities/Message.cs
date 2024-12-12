using System.ComponentModel.DataAnnotations;
using Domain.Common;
using Domain.Common.Interface;

namespace Domain.Entities;

public class Message : TimestampMarkedEntityBase
{
    public required string Content { get; set; }
    public bool IsRead { get; set; }
    public Guid? SenderId { get; set; }
    public Guid ConversationId { get; set; }
    #region navigation properties

    public User? Sender { get; set; }
    public Conversation Conversation { get; set; } = null!;
    public List<IssueTag> IssueTags { get; set; } = [];

    #endregion

}