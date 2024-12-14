namespace Application.DTOs.PublicSessionsService;

public class GetPublicSessionSummariesRequestDto
{
    public Guid? TherapistId { get; set; }
    public bool? IsCancelled { get; set; }
    public List<Guid> IssueTagIds { get; set; } = [];
}