using Application.DTOs.MessagesService;
using Application.Interfaces;
using Application.Services.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Domain.Model;
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

    // we assume that the conversation has already created before this method is called
    public async Task<Result<CreateChatbotMessageResponseDto>> CreateChatbotMessageAsync(
        CreateChatbotMessageRequestDto request, Guid userId)
    {
        var userMessageReceivedTime = DateTime.Now;
        request.Content = request.Content.Trim();

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

        // user first question should use template prompt
        messages[0].Content = string.Format(PromptTemplate.MentalHealthTemplatePrompt, messages[0].Content);

        // convert the messages to gemini content consumed model
        var geminiContents = messages.Select(message => new Content
            {
                Role = message.SenderId.HasValue ? "user" : "model",
                Parts = [new Part { Text = message.Content }]
            })
            .ToList();

        geminiContents.Add(new Content
        {
            Role = "user",
            Parts = [new Part { Text = request.Content }]
        });

        // call the gemini service to generate content with the existed messages for context
        // title property should be null
        var geminiResponse = await _geminiService.GenerateContentAsync(geminiContents);

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
            Content = geminiResponse.Candidates.First().Content.Parts.First().Text,
            CreatedAt = DateTime.Now,
            IsRead = false,
        };
        _context.Messages.AddRange(userMessage, geminiMessage);

        await _context.SaveChangesAsync();

        return new Result<CreateChatbotMessageResponseDto>(new CreateChatbotMessageResponseDto
        {
            Id = geminiMessage.Id,
            Content = geminiMessage.Content,
            ConversationId = request.ConversationId,
            CreatedAt = geminiMessage.CreatedAt,
            IsRead = false,
            LastUserMessageId = userMessage.Id,
            LastUserMessageCreatedAt = userMessageReceivedTime,
        });
    }

    public async Task<Result<CreateP2pMessageResponse>> CreateP2PMessageAsync(CreateP2PMessageRequest request,
        Guid userId)
    {
        #region validation

        // validate if circular message
        if (userId == request.SentToUserId)
        {
            return new Result<CreateP2pMessageResponse>(
                new BadRequestException("Cannot send message to yourself"));
        }

        // validate if conversation exists
        var conversationExisted = await _context.Conversations
            .Where(c => c.Id == request.ConversationId)
            .Where(c => c.ClientId == userId || c.TherapistId == userId)
            .Where(c => c.ClientId == request.SentToUserId || c.TherapistId == request.SentToUserId)
            .Include(c => c.Client)
            .AnyAsync();
        if (conversationExisted == false)
        {
            return new Result<CreateP2pMessageResponse>(new NotFoundException("Conversation not found"));
        }

        // validate if the user has access to the conversation
        var userHasAccess = await _context.PrivateSessionRegistrations
            .Where(r => r.ClientId == userId || r.TherapistId == userId)
            .Where(r => r.Status == PrivateSessionRegistrationStatus.APPROVED)
            .AnyAsync();
        
        if (!userHasAccess)
        {
            return new Result<CreateP2pMessageResponse>(new BadRequestException("User has no access to the conversation"));
        }
        #endregion

        var message = new Message
        {
            Id = Guid.NewGuid(),
            SenderId = userId,
            ConversationId = request.ConversationId,
            Content = request.Content.Trim(),
            IsRead = false,
        };
        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        var senderFullName = await _context.Users
            .Where(u => u.Id == userId)
            .Select(u => u.FirstName + " " + u.LastName)
            .FirstOrDefaultAsync();

        return new Result<CreateP2pMessageResponse>(new CreateP2pMessageResponse
        {
            Id = message.Id,
            ConversationId = message.ConversationId,
            SenderId = message.SenderId.Value,
            SenderFullName = senderFullName!,
            Content = message.Content,
            CreatedAt = message.CreatedAt,
            IsRead = message.IsRead,
        });
    }
}