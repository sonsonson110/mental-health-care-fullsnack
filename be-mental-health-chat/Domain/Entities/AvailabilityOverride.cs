using Domain.Common;

namespace Domain.Entities;

public class AvailabilityOverride: EntityBase
{
    public DateOnly Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public bool IsAvailable { get; set; }
    public string? Description { get; set; }
    
    public Guid TherapistId { get; set; }

    #region navigation properties

    public User Therapist { get; set; } = null!;

    #endregion
}