namespace Application.DTOs.Shared;

public class LastConversationMessageDto
{
    public Guid Id { get; set; }
    public Guid SenderId { get; set; }
    public string SenderFullName { get; set; } = String.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; } // for client
}