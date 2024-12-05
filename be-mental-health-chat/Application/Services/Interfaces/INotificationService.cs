using Application.DTOs.NotificationService;

namespace Application.Services.Interfaces;

public interface INotificationService
{
    Task<List<GetNotificationResponseDto>> GetNotificationsByUserIdAsync(Guid userId);
}