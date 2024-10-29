using System.ComponentModel.DataAnnotations;
using Domain.Common;

namespace Domain.Entities;

public class PrivateSessionSchedule : TimestampMarkedEntityBase
{
    public DateOnly Date { get; set; }
    [MaxLength(255)]
    public string? NoteFromTherapist { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }

    public Guid PrivateSessionRegistrationId { get; set; }

    #region navigation properties

    public PrivateSessionRegistration PrivateSessionRegistration { get; set; } = null!;

    #endregion
}