using Application.DTOs.NotificationService;
using Application.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace API.Hubs.Impl;

public class RealtimeService : IRealtimeService
{
    private readonly IHubContext<RealtimeHub> _hubContext;

    public RealtimeService(IHubContext<RealtimeHub> context)
    {
        _hubContext = context;
    }

    public async Task SendNotification(Guid userId, GetNotificationResponseDto notification)
    {
        await _hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveNotification", notification);
    }

    public async Task SendNotification(List<Guid> userIds, GetNotificationResponseDto notification)
    {
        await _hubContext.Clients.Users(userIds.Select(u => u.ToString()).ToList())
            .SendAsync("ReceiveNotification", notification);
    }
}