using Application.DTOs.Shared;

namespace Application.DTOs.ConversationsService;

public class GetAllUserTherapistConversationResponse
{
    public Guid Id { get; set; }
    public Guid TherapistId { get; set; }
    public string TherapistFullName { get; set; }
    public bool IsTherapistOnline { get; set; }
    public LastConversationMessageDto? LastMessage { get; set; }
}