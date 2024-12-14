using Domain.Enums;

namespace Application.DTOs.PublicSessionsService;

public class GetCalendarFollowedPublicSessionResponseDto
{
    public Guid PublicSessionId { get; set; }
    public required string TherapistFullName { get; set; }
    public required string Title { get; set; }
    public PublicSessionFollowType FollowingType { get; set; }
    public DateOnly Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsCancelled { get; set; }
}