using Domain.Enums;

namespace Application.DTOs.PublicSessionsService;

public class GetPublicSessionSummaryResponseDto
{
    public Guid Id { get; set; }
    public required TherapistDto Therapist { get; set; }
    public string? ThumbnailName { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public PublicSessionType Type { get; set; }
    public required string Location { get; set; }
    public DateOnly Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public bool IsCancelled { get; set; }
    public int FollowerCount { get; set; }
    public PublicSessionFollowType? FollowingType { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class TherapistDto
{
    public Guid Id { get; set; }
    public string? AvatarName { get; set; }
    public required string FullName { get; set; }
    public Gender Gender { get; set; }
}