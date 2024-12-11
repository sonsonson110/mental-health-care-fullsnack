using Application.DTOs.NotificationService;

namespace Application.Interfaces;

public interface IRealtimeService
{
    Task SendNotification(Guid userId, GetNotificationResponseDto notification);
}