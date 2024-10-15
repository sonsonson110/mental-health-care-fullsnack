using API.Hubs.Common;
using Application.DTOs.MessagesService;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace API.Hubs;

public class ChatHub : HubBase
{
    private const string ClientExceptionMethod = "ChatException";

    public async Task SendP2PMessage(CreateP2PMessageRequest request, [FromServices] IMessagesService messagesService)
    {
        var result = await messagesService.CreateP2PMessageAsync(request, GetSessionUserIdentifier());
        await result.Match<Task>(
            async data =>
            {
                await Clients.Users(GetSessionUserIdentifier().ToString(), request.SentToUserId.ToString())
                    .SendAsync("ReceiveP2PMessage", data);
            }, exception => HandleException(ClientExceptionMethod, exception));
    }
}