using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Shared;

public class TherapistExperienceDto
{
    public Guid? Id { get; set; }

    [Required] public string Organization { get; set; } = string.Empty;

    [Required] public string Position { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required] public DateOnly StartDate { get; set; }

    public DateOnly? EndDate { get; set; }
}