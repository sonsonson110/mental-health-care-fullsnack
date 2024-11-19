namespace Application.DTOs.PublicSessionsService;

public class GetPublicSessionSummariesRequestDto
{
    public Guid? TherapistId { get; set; }
    public bool? IsCancelled { get; set; }
}