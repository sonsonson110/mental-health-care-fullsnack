namespace Application.DTOs.MessagesService;

public class CreateP2pMessageResponse
{
    public Guid Id { get; set; }
    public Guid ConversationId { get; set; }
    public Guid SenderId { get; set; }
    public string SenderFullName { get; set; } = string.Empty;
    public required string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
}