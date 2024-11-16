using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.PrivateSessionSchedulesService;

public class GetTherapistSchedulesRequestDto
{
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public List<Guid> PrivateRegistrationIds { get; set; } = [];
}