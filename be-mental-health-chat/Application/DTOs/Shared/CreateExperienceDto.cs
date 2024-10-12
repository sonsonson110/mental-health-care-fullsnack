using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Shared;

public class CreateExperienceDto
{
    public Guid? Id { get; set; }

    [Required]
    public string Organization { get; set; }

    [Required]
    public string Position { get; set; }

    public string? Description { get; set; }

    [Required]
    public DateOnly StartDate { get; set; }

    public DateOnly? EndDate { get; set; }
}