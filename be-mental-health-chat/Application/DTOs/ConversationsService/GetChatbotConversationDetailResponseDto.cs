namespace Application.DTOs.MessagesService;

public class GetChatbotConversationDetailResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public List<ChatbotMessageDto> Messages { get; set; }
}

public class ChatbotMessageDto
{
    public Guid Id { get; set; }
    public Guid? SenderId { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsRead { get; set; }
}