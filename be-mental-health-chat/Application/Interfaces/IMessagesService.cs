using Application.DTOs.MessagesService;
using LanguageExt.Common;

namespace Application.Interfaces;

public interface IMessagesService
{
    Task<Result<CreateChatbotMessageResponseDto>> CreateChatbotMessageAsync(CreateChatbotMessageRequestDto request, Guid userId);
}