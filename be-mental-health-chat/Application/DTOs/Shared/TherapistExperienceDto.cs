using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Shared;

public class TherapistExperienceDto
{
    public Guid? Id { get; set; }

    [Required] [MinLength(3)] public string Organization { get; set; } = null!;

    [Required] [MinLength(3)] public string Position { get; set; } = null!;

    public string? Description { get; set; }

    [Required] public DateOnly StartDate { get; set; }

    public DateOnly? EndDate { get; set; }
}