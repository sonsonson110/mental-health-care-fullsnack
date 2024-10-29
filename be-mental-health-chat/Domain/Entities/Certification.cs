using System.ComponentModel.DataAnnotations;
using Domain.Common;

namespace Domain.Entities;

public class Certification : EntityBase
{
    [MaxLength(200)]
    public required string Name { get; set; }
    [MaxLength(200)]
    public required string IssuingOrganization { get; set; }
    public DateOnly DateIssued { get; set; }
    public DateOnly? ExpirationDate { get; set; }
    [MaxLength(100)]
    public string? ReferenceUrl { get; set; }
}