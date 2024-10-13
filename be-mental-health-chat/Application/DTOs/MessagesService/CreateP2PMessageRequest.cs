using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.MessagesService;

public class CreateP2PMessageRequest
{
    public Guid SentToUserId { get; set; }
    public Guid ConversationId { get; set; }
    public required string Content { get; set; }
}