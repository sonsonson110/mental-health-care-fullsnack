using Application.DTOs.MessagesService;
using Application.Interfaces;
using Application.Services.Interfaces;
using Domain.Entities;
using Infrastructure.Interfaces;
using LanguageExt.Common;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class MessagesService : IMessagesService
{
    private readonly IMentalHealthContext _context;
    private readonly IGeminiService _geminiService;

    public MessagesService(IMentalHealthContext context, IGeminiService geminiService)
    {
        _context = context;
        _geminiService = geminiService;
    }

    public async Task<Result<CreateChatbotMessageResponseDto>> CreateChatbotMessageAsync(
        CreateChatbotMessageRequestDto request, Guid userId)
    {
        var userMessageReceivedTime = DateTime.UtcNow;

        // check if conversation exists
        var conversation = await _context.Conversations.FindAsync(request.ConversationId);
        if (conversation == null || conversation.ClientId != userId)
        {
            return new Result<CreateChatbotMessageResponseDto>(new NotFoundException("Conversation not found"));
        }

        // get the existed messages
        var messages = await _context.Messages
            .Where(m => m.ConversationId == request.ConversationId)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync();

        // call the gemini service to generate content with the existed messages for context
        // title property should be null
        var geminiResponse = await _geminiService.GenerateContentAsync(request.Content, messages);

        // add user message and response from gemini to the database
        var userMessage = new Message
        {
            Id = Guid.NewGuid(),
            SenderId = userId,
            ConversationId = request.ConversationId,
            Content = request.Content,
            CreatedAt = userMessageReceivedTime,
            IsRead = true,
        };
        var geminiMessage = new Message
        {
            Id = Guid.NewGuid(),
            SenderId = null,
            ConversationId = request.ConversationId,
            Content = geminiResponse.Response,
            CreatedAt = geminiResponse.ResponseAt,
            IsRead = false,
        };
        _context.Messages.AddRange(userMessage, geminiMessage);

        await _context.SaveChangesAsync();

        return new Result<CreateChatbotMessageResponseDto>(new CreateChatbotMessageResponseDto
        {
            Id = geminiMessage.Id,
            Content = geminiMessage.Content,
            ConversationId = request.ConversationId,
            CreatedAt = geminiResponse.ResponseAt,
            IsRead = false,
            LastUserMessageId = userMessage.Id,
            LastUserMessageCreatedAt = userMessageReceivedTime,
        });
    }

    public async Task<Result<CreateP2PMessageResponse>> CreateP2PMessageAsync(CreateP2PMessageRequest request,
        Guid userId)
    {
        #region validation
        
        // validate if circular message
        if (userId == request.SentToUserId)
        {
            return new Result<CreateP2PMessageResponse>(new BadRequestException("Cannot send message to yourself", null));
        }
        
        // validate if conversation exists
        var conversationExisted = await _context.Conversations
            .Where(c => c.Id == request.ConversationId)
            .Where(c => c.ClientId == userId || c.TherapistId == userId)
            .Where(c => c.ClientId == request.SentToUserId || c.TherapistId == request.SentToUserId)
            .AnyAsync();
        if (!conversationExisted)
        {
            return new Result<CreateP2PMessageResponse>(new NotFoundException("Conversation not found"));
        }
        
        // TODO: validate if the user has access to the conversation later
        
        #endregion
        
        var message = new Message
        {
            Id = Guid.NewGuid(),
            SenderId = userId,
            ConversationId = request.ConversationId,
            Content = request.Content,
            IsRead = false,
        };
        _context.Messages.Add(message);
        await _context.SaveChangesAsync();
        
        return new Result<CreateP2PMessageResponse>(new CreateP2PMessageResponse
        {
            Id = message.Id,
            SenderId = message.SenderId.Value,
            ConversationId = request.ConversationId,
            Content = message.Content,
            CreatedAt = message.CreatedAt,
            IsRead = message.IsRead,
        });
    }
}