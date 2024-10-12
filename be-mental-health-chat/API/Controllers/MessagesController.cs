using API.Extensions;
using Application.DTOs.MessagesService;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MessagesController : MentalHeathControllerBase
{
    private readonly IMessagesService _messagesService;
    
    public MessagesController(IMessagesService messagesService)
    {
        _messagesService = messagesService;
    }
    
    // POST: /messages/chatbot
    [HttpPost("chatbot")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CreateChatbotMessage([FromBody] CreateChatbotMessageRequestDto request)
    {
        var userId = GetUserId();
        var result = await _messagesService.CreateChatbotMessageAsync(request, userId);
        
        return result.ReturnFromPost();
    }
}