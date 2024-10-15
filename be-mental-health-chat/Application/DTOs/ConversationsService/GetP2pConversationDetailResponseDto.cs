namespace Application.DTOs.ConversationsService;

public class GetP2pConversationDetailResponseDto
{
    public Guid Id { get; set; }
    public Guid ReceiverId { get; set; }
    public string ReceiverFullName { get; set; } = string.Empty;
    public List<P2pMessageDto> Messages { get; set; } = [];
}

public class P2pMessageDto
{
    public Guid Id { get; set; }
    public Guid? SenderId { get; set; }
    public string SenderFullName { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsRead { get; set; }
}