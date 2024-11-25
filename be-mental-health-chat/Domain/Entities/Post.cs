using Domain.Common;

namespace Domain.Entities;

public class Post: TimestampMarkedEntityBase
{
    public required string Title { get; set; }
    public required string Content { get; set; }
    public bool IsPrivate { get; set; }
    public Guid UserId { get; set; }
    
    public List<Like> Likes { get; set; } = null!;
    public User User { get; set; } = null!;
}