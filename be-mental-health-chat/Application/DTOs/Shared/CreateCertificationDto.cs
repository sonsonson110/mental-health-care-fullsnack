using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.UserService;

public class CreateCertificationDto
{
    public Guid? Id { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public string IssuingOrganization { get; set; }

    public string? Major { get; set; }

    [Required]
    public DateOnly DateIssued { get; set; }

    public DateOnly? ExpirationDate { get; set; }

    public string? ReferenceUrl { get; set; }
}