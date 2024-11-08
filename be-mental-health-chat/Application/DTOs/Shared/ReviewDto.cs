using Domain.Enums;

namespace Application.DTOs.Shared;

public class ReviewDto
{
    public Guid Id { get; set; }
    public required string ClientFullName { get; set; }
    public string? ClientAvatarName { get; set; }
    public Gender ClientGender { get; set; }
    public Guid ClientId { get; set; } 
    public int Rating { get; set; }
    public required string Comment { get; set; }
    public DateTime UpdatedAt { get; set; }
}