using Application.DTOs.MessagesService;
using Application.Services.Interfaces;

namespace API.Hubs.Interfaces;

public interface IChatHub
{
    Task SendP2PMessage(CreateP2PMessageRequest request, IMessagesService messagesService);
}