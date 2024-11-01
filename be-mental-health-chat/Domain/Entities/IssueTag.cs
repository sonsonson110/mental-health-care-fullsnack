using System.ComponentModel.DataAnnotations;
using Domain.Common;

namespace Domain.Entities;

public class IssueTag : EntityBase
{
    [MaxLength(50)]
    public required string Name { get; set; }
    [MaxLength(16)]
    public string? ShortName { get; set; }
    [MaxLength(255)]
    public required string Definition { get; set; }
}