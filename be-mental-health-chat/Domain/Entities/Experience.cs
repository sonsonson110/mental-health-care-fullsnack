using System.ComponentModel.DataAnnotations;
using Domain.Common;

namespace Domain.Entities;

public class Experience : EntityBase
{
    [MaxLength(200)]
    public required string Organization { get; set; }
    [MaxLength(50)]
    public required string Position { get; set; }
    [MaxLength(200)]
    public string? Description { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
}