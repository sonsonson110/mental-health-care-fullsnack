using Domain.Common;

namespace Domain.Entities;

public class Education : EntityBase
{
    public string Institution { get; set; }
    public string? Degree { get; set; }
    public string? Major { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
}