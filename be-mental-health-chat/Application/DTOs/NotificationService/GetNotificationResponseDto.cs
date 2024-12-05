using Domain.Enums;

namespace Application.DTOs.NotificationService;

public class GetNotificationResponseDto
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public NotificationType Type { get; set; }
    public Dictionary<string, string> Metadata { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}