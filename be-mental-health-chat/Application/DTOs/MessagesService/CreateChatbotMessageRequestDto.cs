using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.MessagesService;

public class CreateChatbotMessageRequestDto
{
    [Required]
    public Guid ConversationId { get; set; }
    [Required]
    public required string Content { get; set; }
}