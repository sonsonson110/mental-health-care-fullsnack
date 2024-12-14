namespace Application.DTOs.PublicSessionsService;

public class GetCalendarFollowedPublicSessionRequestDto
{
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
}