namespace Application.DTOs.PrivateSessionSchedulesService;

public class GetClientSchedulesRequestDto
{
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
}