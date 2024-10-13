namespace Application.DTOs.Shared;

public class LastConversationMessageDto
{
    public Guid Id { get; set; }
    public Guid SenderId { get; set; }
    public string SenderFullName { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; } // for client
}