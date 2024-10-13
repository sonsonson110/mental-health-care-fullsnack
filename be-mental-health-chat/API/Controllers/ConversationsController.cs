using API.Extensions;
using Application.DTOs.ConversationsService;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class ConversationsController: MentalHeathControllerBase
{
    private readonly IConversationsService _conversationsService;
    
    public ConversationsController(IConversationsService conversationsService)
    {
        _conversationsService = conversationsService;
    }
    
    // GET: /conversations/chatbot
    [HttpGet("chatbot")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetChatbotConversations()
    {
        var userId = GetUserId();
        var conversations = await _conversationsService.GetChatbotConversationsByUserIdAsync(userId);
        return Ok(conversations);
    }
    
    // GET: /conversations/therapist
    [HttpGet("therapist")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetTherapistConversations()
    {
        var userId = GetUserId();
        var conversations = await _conversationsService.GetUserTherapistConversationsByUserIdAsync(userId);
        return Ok(conversations);
    }
    
    // GET: /conversations/chatbot/{conversationId}
    [HttpGet("chatbot/{conversationId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetChatbotConversationDetailById([FromRoute] Guid conversationId)
    {
        var userId = GetUserId();
        var result = await _conversationsService.GetChatbotConversationDetailByIdAndUserIdAsync(conversationId, userId);
        return result.ReturnFromGet();
    }
    
    // POST: /conversations/chatbot
    [HttpPost("chatbot")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateChatbotConversation([FromBody] CreateChatbotConversationRequestDto request)
    {
        var userId = GetUserId();
        
        var result = await _conversationsService.CreateChatbotConversationAsync(userId, request);
        return result.ReturnFromPost();
    }
}