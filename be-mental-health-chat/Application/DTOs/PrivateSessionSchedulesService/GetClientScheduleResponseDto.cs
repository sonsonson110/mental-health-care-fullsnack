namespace Application.DTOs.PrivateSessionSchedulesService;

public class GetClientScheduleResponseDto
{
    public Guid Id { get; set; }
    public DateOnly Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public string? NoteFromTherapist { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsCancelled { get; set; }
}