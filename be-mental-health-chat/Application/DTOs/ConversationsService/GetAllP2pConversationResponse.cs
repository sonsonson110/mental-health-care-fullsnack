using Application.DTOs.Shared;

namespace Application.DTOs.ConversationsService;

public class GetAllP2pConversationResponse
{
    public Guid Id { get; set; }
    public Guid ReceiverId { get; set; }
    public string ReceiverFullName { get; set; }
    public bool IsReceiverOnline { get; set; }
    public LastConversationMessageDto? LastMessage { get; set; }
}