using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Shared;

public class TherapistEducationDto
{
    public Guid? Id { get; set; }
    [Required] 
    public string Institution { get; set; } = null!;

    [MinLength(3)]
    public string? Degree { get; set; }

    [MinLength(3)]
    public string? Major { get; set; }

    [Required] 
    public DateOnly StartDate { get; set; }

    public DateOnly? EndDate { get; set; }
}