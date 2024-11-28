namespace Application.DTOs.AvailableOverridesService;

public class CreateUpdateAvailabilityOverrideRequestDto
{
    public Guid? Id { get; set; }
    public DateOnly Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public bool IsAvailable { get; set; }
    public string? Description { get; set; }
}