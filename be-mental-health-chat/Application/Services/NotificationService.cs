using Application.DTOs.NotificationService;
using Application.Interfaces;
using Application.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class NotificationService : INotificationService
{
    private readonly IMentalHealthContext _context;

    public NotificationService(IMentalHealthContext context)
    {
        _context = context;
    }

    public async Task<List<GetNotificationResponseDto>> GetNotificationsByUserIdAsync(Guid userId)
    {
        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new GetNotificationResponseDto
            {
                Id = n.Id,
                Title = n.Title,
                CreatedAt = n.CreatedAt,
                Type = n.Type,
                Metadata = n.Metadata,
                IsRead = n.IsRead
            }).ToListAsync();

        return notifications;
    }

    public async Task MarkNotificationAsReadAsync(Guid notificationId, Guid userId)
    {
        await _context.Notifications.Where(n => n.Id == notificationId && n.UserId == userId)
            .ExecuteUpdateAsync(setter =>
                setter.SetProperty(n => n.IsRead, true));
    }
}