namespace Application.DTOs.PrivateSessionSchedulesService;

public class GetTherapistScheduleResponseDto
{
    public Guid Id { get; set; }
    public Guid PrivateSessionRegistrationId { get; set; }
    public ClientDto Client { get; set; }
    public DateOnly Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public string? NoteFromTherapist { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsCancelled { get; set; }
}

public class ClientDto
{
    public Guid Id { get; set; }
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public string? AvatarName { get; set; }
}