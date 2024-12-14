using Domain.Common;
using Domain.Enums;

namespace Domain.Entities;

public class PublicSession: TimestampMarkedEntityBase
{
    public required string Title { get; set; }
    public required string Description { get; set; }
    public string? ThumbnailName { get; set; }
    public DateOnly Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public required string Location { get; set; }
    public bool IsCancelled { get; set; }
    public PublicSessionType Type { get; set; }
    public Guid TherapistId { get; set; }
    public List<IssueTag> IssueTags { get; set; } = [];

    #region navigation properties

    public User Therapist { get; set; } = null!;
    public List<PublicSessionFollower> Followers { get; set; } = null!;

    #endregion
}