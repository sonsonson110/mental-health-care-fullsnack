using Domain.Common;
using Domain.Enums;

namespace Domain.Entities;

public class Notification: TimestampMarkedEntityBase
{
    public required string Title { get; set; }
    
    private Dictionary<string, string>? _metadata;
    public Dictionary<string, string> Metadata 
    { 
        get => _metadata ??= new Dictionary<string, string>();
        set => _metadata = value;
    }
    public bool IsRead { get; set; }
    public NotificationType Type { get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}