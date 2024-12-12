using Domain.Entities;

namespace Application.DTOs.ConversationsService;

public class GetChatbotConversationDetailResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public List<ChatbotMessageDto> Messages { get; set; } = [];
}

public class ChatbotMessageDto
{
    public Guid Id { get; set; }
    public Guid? SenderId { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsRead { get; set; }
    public List<IssueTag> IssueTags { get; set; } = [];
}