using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Shared;

public class TherapistCertificationDto
{
    public Guid? Id { get; set; }

    [Required]
    [MinLength(3)]
    public required string Name { get; set; }

    [Required]
    [MinLength(3)]
    public required string IssuingOrganization { get; set; }

    [MinLength(3)]
    public string? Major { get; set; }

    [Required]
    public DateOnly DateIssued { get; set; }

    public DateOnly? ExpirationDate { get; set; }

    [Url]
    public string? ReferenceUrl { get; set; }
}