using System.ComponentModel.DataAnnotations;
using Domain.Common;
using Domain.Enums;

namespace Domain.Entities;

public class PrivateSessionRegistration: TimestampMarkedEntityBase
{
    public PrivateSessionRegistrationStatus Status { get; set; }
    [MaxLength(255)]
    public string? NoteFromTherapist { get; set; }
    [MaxLength(255)]
    public string? NoteFromClient { get; set; }
    public DateTime? EndDate { get; set; }
    
    public Guid TherapistId { get; set; }
    public Guid ClientId { get; set; }

    #region navigation properties

    public Therapist Therapist { get; set; } = null!;
    public User Client { get; set; } = null!;
    public List<PrivateSessionSchedule> PrivateSessionSchedules { get; set; } = null!;

    #endregion
}