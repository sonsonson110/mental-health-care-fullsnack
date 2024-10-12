using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.ConversationsService;

public class CreateChatbotConversationRequestDto
{
    [Required] 
    public required string Content { get; set; }
}