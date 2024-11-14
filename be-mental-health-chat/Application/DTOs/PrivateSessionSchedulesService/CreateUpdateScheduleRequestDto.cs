using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.PrivateSessionSchedulesService;

public class CreateUpdateScheduleRequestDto
{
    public Guid? Id { get; set; }
    [Required] public Guid PrivateSessionRegistrationId { get; set; }
    [Required] public DateOnly Date { get; set; }
    [Required] public TimeOnly StartTime { get; set; }
    [Required] public TimeOnly EndTime { get; set; }
    public string? NoteFromTherapist { get; set; }
    public bool? IsCancelled { get; set; } = false;
}