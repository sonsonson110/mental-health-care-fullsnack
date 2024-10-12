using Domain.Common;

namespace Domain.Entities;

public class Certification : EntityBase
{
    public string Name { get; set; }
    public string IssuingOrganization { get; set; }
    public DateOnly DateIssued { get; set; }
    public DateOnly? ExpirationDate { get; set; }
    public string? ReferenceUrl { get; set; }
}