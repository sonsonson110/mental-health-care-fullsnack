using Application.DTOs.ConversationsService;
using Application.DTOs.MessagesService;
using Application.DTOs.Shared;
using Application.Interfaces;
using Application.Services.Interfaces;
using Domain.Entities;
using Infrastructure.Integrations.Gemini.Interfaces;
using LanguageExt.Common;
using LanguageExt.Pipes;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class ConversationsService : IConversationsService
{
    private readonly IMentalHealthContext _context;
    private readonly IGeminiService _geminiService;
    
    public ConversationsService(IMentalHealthContext context, IGeminiService geminiService)
    {
        _context = context;
        _geminiService = geminiService;
    }
    
    public async Task<List<GetAllChatBotConversationResponse>> GetChatbotConversationsByUserIdAsync(Guid userId)
    {
        var conversations = await _context.Conversations
            .Where(c => c.ClientId == userId)
            .Where(c => c.TherapistId == null)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new GetAllChatBotConversationResponse
            {
                Id = c.Id,
                Title = c.Title ?? "Untitled",
            })
            .ToListAsync();
        return conversations;
    }

    public async Task<Result<GetChatbotConversationDetailResponseDto>> GetChatbotConversationDetailByIdAndUserIdAsync(Guid conversationId, Guid userId)
    {
        // check if conversation exists
        var conversation = await _context.Conversations.FindAsync(conversationId);
        if (conversation == null || conversation.ClientId != userId)
        {
            return new Result<GetChatbotConversationDetailResponseDto>(new NotFoundException("Conversation not found"));
        }
        
        var messages = await _context.Messages
            .Where(m => m.ConversationId == conversationId)
            .OrderBy(m => m.CreatedAt)
            .Select(m => new ChatbotMessageDto
            {
                Id = m.Id,
                SenderId = m.SenderId,
                Content = m.Content,
                CreatedAt = m.CreatedAt,
                UpdatedAt = m.UpdatedAt,
                IsRead = m.IsRead
            })
            .ToListAsync();
        
        return new Result<GetChatbotConversationDetailResponseDto>(new GetChatbotConversationDetailResponseDto
        {
            Id = conversation.Id,
            Title = conversation.Title ?? "Untitled",
            Messages = messages
        });
    }

    public async Task<Result<CreateChatbotConversationResponseDto>> CreateChatbotConversationAsync(Guid userId, CreateChatbotConversationRequestDto request)
    {
        var userMessageReceivedTime = DateTime.UtcNow;
        
        // call the gemini service to generate content with the existed messages for context
        // title property should NOT be null
        var geminiResponse = await _geminiService.GenerateContentAsync(request.Content, []);
        
        // create new conversation
        var conversation = new Conversation
        {
            Id = Guid.NewGuid(),
            ClientId = userId,
            Title = geminiResponse.Title!,
            CreatedAt = DateTime.UtcNow
        };
        _context.Conversations.Add(conversation);
        // add user message and response from gemini to the database
        var userMessage = new Message
        {
            Id = Guid.NewGuid(),
            SenderId = userId,
            ConversationId = conversation.Id,
            Content = request.Content,
            CreatedAt = userMessageReceivedTime,
            IsRead = true,
        };
        var geminiMessage = new Message
        {
            Id = Guid.NewGuid(),
            SenderId = null,
            ConversationId = conversation.Id,
            Content = geminiResponse.Response,
            CreatedAt = geminiResponse.ResponseAt,
            IsRead = false,
        };
        _context.Messages.AddRange(userMessage, geminiMessage);
        await _context.SaveChangesAsync();

        return new Result<CreateChatbotConversationResponseDto>(new CreateChatbotConversationResponseDto
        {
            ConversationId = conversation.Id,
            Title = conversation.Title,
            CreatedAt = conversation.CreatedAt
        });
    }

    public async Task<List<GetAllP2pConversationResponse>> GetUserTherapistConversationsByUserIdAsync(Guid userId)
    {
        var conversations = await _context.Conversations
            .Where(c => c.ClientId == userId)
            .Where(c => c.TherapistId != null)
            .Select(c => new 
            {
                Id = c.Id,
                TherapistId = c.TherapistId,
                TherapistFullName = c.Therapist!.FirstName + " " + c.Therapist.LastName,
                IsTherapistOnline = c.Therapist.IsOnline,
                CreatedAt = c.CreatedAt,
                LastMessage = c.Messages
                    .OrderByDescending(m => m.CreatedAt)
                    .Select(m => new
                    {
                        Id = m.Id,
                        SenderId = m.SenderId,
                        SenderFullName = m.Sender!.FirstName+ " " + m.Sender.LastName,
                        Content = m.Content,
                        IsRead = m.IsRead,
                        CreatedAt = m.CreatedAt
                    })
                    .FirstOrDefault()
            })
            .OrderByDescending(c => c.LastMessage != null ? c.LastMessage.CreatedAt : c.CreatedAt)
            .ToListAsync();
        
        return conversations.Select(c => new GetAllP2pConversationResponse
        {
            Id = c.Id,
            ReceiverId = c.TherapistId!.Value,
            IsReceiverOnline = c.IsTherapistOnline,
            ReceiverFullName = c.TherapistFullName,
            LastMessage = c.LastMessage != null ? new LastConversationMessageDto
            {
                Id = c.LastMessage.Id,
                SenderId = c.LastMessage.SenderId!.Value,
                SenderFullName = c.LastMessage.SenderFullName,
                Content = c.LastMessage.Content,
                CreatedAt = c.LastMessage.CreatedAt,
                IsRead = c.LastMessage.IsRead
            } : null
        }).ToList();
    }
}