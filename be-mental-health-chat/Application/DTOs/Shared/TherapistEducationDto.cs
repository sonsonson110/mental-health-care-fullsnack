using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Shared;

public class TherapistEducationDto
{
    public Guid? Id { get; set; }
    [Required] public string Institution { get; set; } = string.Empty;

    public string? Degree { get; set; }

    public string? Major { get; set; }

    [Required] public DateOnly StartDate { get; set; }

    public DateOnly? EndDate { get; set; }
}