namespace Application.DTOs.MessagesService;

public class CreateChatbotMessageResponseDto
{
    public Guid Id { get; set; }
    public Guid ConversationId { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
    public Guid LastUserMessageId { get; set; }
    public DateTime LastUserMessageCreatedAt { get; set; }
}