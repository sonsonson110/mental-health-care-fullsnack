using Domain.Common;

namespace Domain.Entities;

public class IssueTag : EntityBase
{
    public string Name { get; set; }
    public string? ShortName { get; set; }
    public string Definition { get; set; }
}