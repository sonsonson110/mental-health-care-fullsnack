using Domain.Enums;

namespace Application.DTOs.PostsService;

public class GetPostResponseDto
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Content { get; set; }
    public bool IsPrivate { get; set; }
    public int LikeCount { get; set; }
    public bool IsLiked { get; set; }
    public DateTime UpdatedAt { get; set; }
    public UserDto? User { get; set; }
}

public class UserDto
{
    public Guid Id { get; set; }
    public required string FullName { get; set; }
    public string? AvatarName { get; set; }
    public Gender Gender { get; set; }
}