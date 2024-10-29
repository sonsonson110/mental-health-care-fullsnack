using System.ComponentModel.DataAnnotations;
using Domain.Common;

namespace Domain.Entities;

public class Education : EntityBase
{
    [MaxLength(200)]
    public required string Institution { get; set; }
    [MaxLength(50)]
    public string? Degree { get; set; }
    [MaxLength(50)]
    public string? Major { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
}