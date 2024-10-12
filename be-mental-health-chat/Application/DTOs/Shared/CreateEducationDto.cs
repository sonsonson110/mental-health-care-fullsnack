using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.UserService;

public class CreateEducationDto
{
    [Required]
    public string Institution { get; set; }

    public string? Degree { get; set; }

    public string? Major { get; set; }

    [Required]
    public DateOnly StartDate { get; set; }

    public DateOnly? EndDate { get; set; }
}