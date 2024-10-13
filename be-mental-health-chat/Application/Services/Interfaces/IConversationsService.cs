using Application.DTOs.ConversationsService;
using Application.DTOs.MessagesService;
using LanguageExt.Common;

namespace Application.Services.Interfaces;

public interface IConversationsService
{
    Task<List<GetAllChatBotConversationResponse>> GetChatbotConversationsByUserIdAsync(Guid userId);
    Task<Result<GetChatbotConversationDetailResponseDto>> GetChatbotConversationDetailByIdAndUserIdAsync(Guid conversationId, Guid userId);
    Task<Result<CreateChatbotConversationResponseDto>> CreateChatbotConversationAsync(Guid userId, CreateChatbotConversationRequestDto request);
    Task<List<GetAllUserTherapistConversationResponse>> GetUserTherapistConversationsByUserIdAsync(Guid userId);
}