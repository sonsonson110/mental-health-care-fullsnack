using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.AvailableOverridesService;

public class GetAvailableOverridesRequestDto
{
    [Required]
    public DateOnly? StartDate { get; set; }
    [Required]
    public DateOnly? EndDate { get; set; }
}