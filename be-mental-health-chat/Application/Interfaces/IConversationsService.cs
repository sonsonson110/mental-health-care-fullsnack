using Application.DTOs.ConversationsService;
using Application.DTOs.MessagesService;
using Domain.Entities;
using LanguageExt.Common;

namespace Application.Interfaces;

public interface IConversationsService
{
    Task<List<GetAllChatBotConversationResponse>> GetChatbotConversationsByUserIdAsync(Guid userId);
    Task<Result<GetChatbotConversationDetailResponseDto>> GetChatbotConversationDetailByIdAndUserIdAsync(Guid conversationId, Guid userId);
    Task<Result<CreateChatbotConversationResponseDto>> CreateChatbotConversationAsync(Guid userId, CreateChatbotConversationRequestDto request);
}