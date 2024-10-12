namespace Application.DTOs.ConversationsService;

public class CreateChatbotConversationResponseDto
{
    public Guid ConversationId { get; set; }
    public string Title { get; set; }
    public DateTime CreatedAt { get; set; }
}