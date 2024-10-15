using Application.DTOs.MessagesService;
using LanguageExt.Common;

namespace Application.Services.Interfaces;

public interface IMessagesService
{
    Task<Result<CreateChatbotMessageResponseDto>> CreateChatbotMessageAsync(CreateChatbotMessageRequestDto request, Guid userId);
    Task<Result<CreateP2pMessageResponse>> CreateP2PMessageAsync(CreateP2PMessageRequest request, Guid userId);
}